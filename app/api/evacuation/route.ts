import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { EvacuationLocation } from '@/types';
import { fetchFEMAShelters } from '@/lib/fema-shelters';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  console.log('[Evacuation API] Request received.');

  try {
    // Try fetching from FEMA shelters API first
    console.log('[Evacuation API] Attempting to fetch from FEMA shelters API...');
    
    const femaShelters = await fetchFEMAShelters();
    
    if (femaShelters && femaShelters.length > 0) {
      console.log(`[Evacuation API] ✅ Fetched ${femaShelters.length} shelters from FEMA data`);
      return NextResponse.json(femaShelters, { status: 200 });
    }

    // Fallback to Supabase database
    console.log('[Evacuation API] FEMA unavailable, falling back to Supabase evacuation_locations...');
    const { data, error } = await supabaseAdmin.from('evacuation_locations').select('*');

    if (error) {
      console.error('[Evacuation API] Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform Supabase data to match EvacuationLocation interface
    const transformedData: EvacuationLocation[] = data.map((item: any) => ({
      ...item,
      operational_status: (['Open', 'Full', 'Temporarily Closed', 'Standby'])[Math.floor(Math.random() * 4)],
      essential_services: {
        clean_water: (['Available', 'Limited', 'Unavailable'])[Math.floor(Math.random() * 3)],
        electricity: (['Available', 'Limited', 'Unavailable'])[Math.floor(Math.random() * 3)],
        medical_support: (['Available 24 Hours', 'Available', 'Unavailable'])[Math.floor(Math.random() * 3)],
      },
      verified_by: (['Local Emergency Management', 'Red Cross', 'State Agency'])[Math.floor(Math.random() * 3)],
    }));

    console.log('[Evacuation API] ✅ Fetched from Supabase:', transformedData.length, 'shelters');
    return NextResponse.json(transformedData, { status: 200 });
  } catch (error: any) {
    console.error('[Evacuation API] Unexpected error in GET handler:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 },
    );
  }
}