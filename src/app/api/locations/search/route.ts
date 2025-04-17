import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    if (!query) {
      return NextResponse.json({ suggestions: [] });
    }

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key missing');
      return NextResponse.json(
        { error: 'Configuration error', suggestions: [] },
        { status: 500 }
      );
    }

    const googleUrl = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
    googleUrl.searchParams.append('input', query);
    googleUrl.searchParams.append('types', 'geocode');
    googleUrl.searchParams.append('components', 'country:in');
    googleUrl.searchParams.append('key', process.env.GOOGLE_MAPS_API_KEY);

    const response = await fetch(googleUrl.toString(), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Google API responded with status ${response.status}`);
    }

    const data = await response.json();

    const result = NextResponse.json({
      suggestions: data.predictions?.map((place: any) => ({
        label: place.description,
        value: place.description,
        placeId: place.place_id
      })) || []
    });

    // Add CORS headers to the response
    result.headers.set('Access-Control-Allow-Origin', '*');
    result.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    result.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return result;

  } catch (error) {
    console.error('Search error:', error);
    const errorResponse = NextResponse.json(
      { error: 'Failed to fetch locations', suggestions: [] },
      { status: 500 }
    );
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    return errorResponse;
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, {
    status: 200,
  });
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
}