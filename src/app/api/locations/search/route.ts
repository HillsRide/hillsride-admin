import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

interface GooglePrediction {
  description: string;
  place_id: string;
}

const prisma = new PrismaClient();

// Helper function to get place details including coordinates
async function getPlaceDetails(placeId: string, apiKey: string) {
  try {
    const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    detailsUrl.searchParams.append('place_id', placeId);
    detailsUrl.searchParams.append('fields', 'geometry');
    detailsUrl.searchParams.append('key', apiKey);

    const response = await fetch(detailsUrl.toString());
    const data = await response.json() as {
      predictions?: GooglePrediction[];
      result?: {
        geometry?: {
          location?: {
            lat: number;
            lng: number;
          }
        }
      }
    };


    if (data.result?.geometry?.location) {
      return {
        latitude: data.result.geometry.location.lat,
        longitude: data.result.geometry.location.lng
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}

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

    const data = await response.json() as {
      predictions?: GooglePrediction[];
      result?: {
        geometry?: {
          location?: {
            lat: number;
            lng: number;
          }
        }
      }
    };

    const suggestions = data.predictions?.map((place: GooglePrediction) => ({
      label: place.description,
      value: place.description,
      placeId: place.place_id
    })) || [];

    // Store search history without affecting the response
    if (suggestions.length > 0) {
      try {
        // Process each suggestion sequentially to avoid race conditions
        await Promise.all(suggestions.map(async suggestion => {
          const terms = suggestion.label.split(',');
          const coordinates = await getPlaceDetails(suggestion.placeId, process.env.GOOGLE_MAPS_API_KEY!);

          // First try to find an existing record
          const existingSearch = await prisma.searchHistory.findFirst({
            where: {
              search_query: suggestion.label
            }
          });

          if (existingSearch) {
            // Update existing record
            await prisma.searchHistory.update({
              where: {
                id: existingSearch.id
              },
              data: {
                search_count: {
                  increment: 1
                },
                last_searched: new Date()
              }
            });
          } else {
            // Create new record
            await prisma.searchHistory.create({
              data: {
                search_query: suggestion.label,
                city: terms[0]?.trim() || null,
                state: terms[1]?.trim() || null,
                region: terms[0]?.trim() || null,
                latitude: coordinates?.latitude || null,
                longitude: coordinates?.longitude || null,
                search_count: 1,
                first_searched: new Date(),
                last_searched: new Date(),
                is_successful: true,
                user_type: 'guest',
                search_category: 'LOCATION_SEARCH',
                peak_hour_search: false,
                time_to_result: 0
              }
            });
          }
        }));
      } catch (error) {
        // Log error but don't affect the response
        console.error('Database operation failed:', error);
      }
    }

    const result = NextResponse.json({ suggestions });

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
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}