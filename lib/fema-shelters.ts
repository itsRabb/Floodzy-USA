/**
 * FEMA / ARC National Shelter System
 * Source: ArcGIS FeatureServer (public)
 * Data: Real, live shelter records (OPEN shelters)
 *
 * NOTE:
 * - Geometry coordinates are authoritative lat/lon
 * - Properties latitude/longitude fields may be null — ignore them
 * - UNK = Unknown (valid state)
 */

export type Shelter = {
  shelter_id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;

  status: 'OPEN' | 'CLOSED' | 'UNKNOWN';

  latitude: number;
  longitude: number;

  total_population: number | null;

  ada_compliant: 'YES' | 'NO' | 'UNK' | null;
  wheelchair_accessible: 'YES' | 'NO' | 'UNK' | null;
  pet_accommodations: string | null;

  source: 'FEMA / ARC (National Shelter System)';
  last_updated: string;
};

const ARCGIS_SHELTERS_URL =
  'https://gis.fema.gov/arcgis/rest/services/NSS/OpenShelters/FeatureServer/0/query' +
  '?where=1%3D1' +
  '&outFields=*'+
  '&returnGeometry=true' +
  '&f=geojson';

/**
 * Fetch and normalize FEMA / ARC shelter data
 */
export async function fetchFEMAShelters(): Promise<Shelter[]> {
  const res = await fetch(ARCGIS_SHELTERS_URL);

  if (!res.ok) {
    throw new Error(`Failed to fetch FEMA shelters: ${res.statusText}`);
  }

  const geojson = await res.json();

  if (!geojson?.features || !Array.isArray(geojson.features)) {
    throw new Error('Invalid GeoJSON response from ArcGIS');
  }

  return geojson.features
    // Require geometry (authoritative location)
    .filter((f: any) => f.geometry?.type === 'Point')
    .map((f: any): Shelter | null => {
      const coords = f.geometry.coordinates;
      const p = f.properties ?? {};

      if (!Array.isArray(coords) || coords.length !== 2) return null;

      const [longitude, latitude] = coords;

      return {
        shelter_id: p.shelter_id,
        name: p.shelter_name ?? 'Unknown Shelter',
        address: p.address ?? '',
        city: p.city ?? '',
        state: p.state ?? '',
        zip: p.zip ?? '',

        status:
          p.shelter_status === 'OPEN'
            ? 'OPEN'
            : p.shelter_status === 'CLOSED'
            ? 'CLOSED'
            : 'UNKNOWN',

        latitude,
        longitude,

        total_population:
          typeof p.total_population === 'number'
            ? p.total_population
            : null,

        ada_compliant: p.ada_compliant ?? null,
        wheelchair_accessible: p.wheelchair_accessible ?? null,
        pet_accommodations: p.pet_accommodations_code ?? null,

        source: 'FEMA / ARC (National Shelter System)',
        last_updated: new Date().toISOString(),
      };
    })
    .filter(Boolean) as Shelter[];
}

/**
 * Example runner (optional)
 * Run with: ts-node fema-shelters.ts
 */
if (require.main === module) {
  fetchFEMAShelters()
    .then((shelters) => {
      console.log(`Fetched ${shelters.length} shelters`);
      console.log(shelters.slice(0, 3));
    })
    .catch(console.error);
}
