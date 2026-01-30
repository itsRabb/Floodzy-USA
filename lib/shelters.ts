// lib/shelters.ts - FEMA National Shelter System Integration

export interface Shelter {
  shelter_id: number;
  shelter_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  shelter_status: 'OPEN' | 'CLOSED' | 'UNKNOWN';
  total_population: number;
  evacuation_capacity: number | 'UNKNOWN';
  post_impact_capacity: number | 'UNKNOWN';
  hours_open: string | 'UNKNOWN';
  hours_close: string | 'UNKNOWN';
  org_name: string;
  org_id: number;
  subfacility_code: string | 'UNKNOWN';
  ada_compliant: boolean | 'UNKNOWN';
  wheelchair_accessible: boolean | 'UNKNOWN';
  pet_accommodations_code: string | 'UNKNOWN';
  latitude: number;
  longitude: number;
}

interface FEMAShelterFeature {
  type: 'Feature';
  id: number;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    objectid: number;
    shelter_id: number;
    shelter_name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    shelter_status: string;
    evacuation_capacity: number | null;
    post_impact_capacity: number | null;
    total_population: number;
    hours_open: string | null;
    hours_close: string | null;
    org_name: string;
    org_id: number;
    match_type: string | null;
    subfacility_code: string;
    ada_compliant: boolean | null;
    pet_accommodations_code: string | null;
    wheelchair_accessible: boolean | null;
    latitude: number | null;
    longitude: number | null;
  };
}

interface FEMAShelterResponse {
  type: 'FeatureCollection';
  features: FEMAShelterFeature[];
}

/**
 * Normalize null values to 'UNKNOWN'
 */
function normalizeValue<T>(value: T | null | undefined, defaultValue: any = 'UNKNOWN'): T | typeof defaultValue {
  return value === null || value === undefined ? defaultValue : value;
}

/**
 * Transform FEMA shelter feature to our Shelter interface
 */
function transformShelter(feature: FEMAShelterFeature): Shelter {
  const { geometry, properties } = feature;
  
  // Use geometry coordinates (canonical source) over property lat/lon
  const [longitude, latitude] = geometry.coordinates;
  
  return {
    shelter_id: properties.shelter_id,
    shelter_name: properties.shelter_name,
    address: properties.address,
    city: properties.city,
    state: properties.state,
    zip: properties.zip,
    shelter_status: (properties.shelter_status?.toUpperCase() as 'OPEN' | 'CLOSED') || 'UNKNOWN',
    total_population: properties.total_population || 0,
    evacuation_capacity: normalizeValue(properties.evacuation_capacity),
    post_impact_capacity: normalizeValue(properties.post_impact_capacity),
    hours_open: normalizeValue(properties.hours_open),
    hours_close: normalizeValue(properties.hours_close),
    org_name: properties.org_name || 'Unknown Organization',
    org_id: properties.org_id,
    subfacility_code: normalizeValue(properties.subfacility_code),
    ada_compliant: normalizeValue(properties.ada_compliant),
    wheelchair_accessible: normalizeValue(properties.wheelchair_accessible),
    pet_accommodations_code: normalizeValue(properties.pet_accommodations_code),
    latitude,
    longitude,
  };
}

/**
 * Fetch real-time shelter data from FEMA National Shelter System
 * API: https://gis.fema.gov/arcgis/rest/services/NSS/OpenShelters/MapServer/0
 */
export async function fetchFEMAShelters(options?: {
  status?: 'OPEN' | 'CLOSED' | 'ALL';
  state?: string;
  bounds?: { north: number; south: number; east: number; west: number };
}): Promise<Shelter[]> {
  try {
    const baseUrl = 'https://gis.fema.gov/arcgis/rest/services/NSS/OpenShelters/MapServer/0/query';
    
    // Build query parameters
    const params = new URLSearchParams({
      outFields: '*',
      returnGeometry: 'true',
      f: 'geojson',
    });
    
    // Build WHERE clause based on filters
    const whereClauses: string[] = ['1=1']; // Always true base clause
    
    if (options?.status && options.status !== 'ALL') {
      whereClauses.push(`shelter_status='${options.status}'`);
    }
    
    if (options?.state) {
      whereClauses.push(`state='${options.state}'`);
    }
    
    // Add spatial filter if bounds provided
    if (options?.bounds) {
      const { north, south, east, west } = options.bounds;
      params.set('geometry', JSON.stringify({
        xmin: west,
        ymin: south,
        xmax: east,
        ymax: north,
        spatialReference: { wkid: 4326 }
      }));
      params.set('geometryType', 'esriGeometryEnvelope');
      params.set('spatialRel', 'esriSpatialRelIntersects');
    }
    
    params.set('where', whereClauses.join(' AND '));
    
    const url = `${baseUrl}?${params.toString()}`;
    
    console.log('[FEMA Shelters] Fetching from:', url);
    
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error(`FEMA API returned ${response.status}: ${response.statusText}`);
    }
    
    const data: FEMAShelterResponse = await response.json();
    
    if (!data.features || data.features.length === 0) {
      console.log('[FEMA Shelters] No shelters found matching criteria');
      return [];
    }
    
    const shelters = data.features.map(transformShelter);
    
    console.log(`[FEMA Shelters] Found ${shelters.length} shelters`);
    
    return shelters;
  } catch (error) {
    console.error('[FEMA Shelters] Error fetching shelter data:', error);
    throw error;
  }
}

/**
 * Get shelters within a radius of a specific location
 */
export async function fetchNearbyShelters(
  latitude: number,
  longitude: number,
  radiusMiles: number = 50
): Promise<Shelter[]> {
  // Calculate bounding box from radius
  const latDelta = radiusMiles / 69; // ~69 miles per degree latitude
  const lonDelta = radiusMiles / (69 * Math.cos(latitude * Math.PI / 180));
  
  const bounds = {
    north: latitude + latDelta,
    south: latitude - latDelta,
    east: longitude + lonDelta,
    west: longitude - lonDelta,
  };
  
  const shelters = await fetchFEMAShelters({ status: 'OPEN', bounds });
  
  // Calculate actual distances and sort by proximity
  const sheltersWithDistance = shelters.map(shelter => ({
    ...shelter,
    distance: calculateDistance(latitude, longitude, shelter.latitude, shelter.longitude),
  }));
  
  return sheltersWithDistance
    .filter(s => s.distance <= radiusMiles)
    .sort((a, b) => a.distance - b.distance)
    .map(({ distance, ...shelter }) => shelter);
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get shelter type display name from subfacility code
 */
export function getShelterTypeName(code: string | 'UNKNOWN'): string {
  const types: Record<string, string> = {
    'GENPOPSHEL': 'General Population Shelter',
    'MEDNEEDS': 'Medical Needs Shelter',
    'PETSHELTER': 'Pet-Friendly Shelter',
    'EVACUATION': 'Evacuation Center',
    'UNKNOWN': 'Unknown Type',
  };
  return types[code] || code;
}

/**
 * Get shelter status badge color
 */
export function getShelterStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'OPEN':
      return 'green';
    case 'CLOSED':
      return 'red';
    default:
      return 'gray';
  }
}
