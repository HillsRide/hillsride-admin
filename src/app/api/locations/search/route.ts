import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    console.log('Search query:', query); // Debug log

    if (!query) {
      return NextResponse.json({ suggestions: [] });
    }

    // Log database search attempt
    console.log('Checking database for:', query);
    const existingSearches = await prisma.searchHistory.findMany({
      where: {
        search_query: {
          contains: query,
          mode: 'insensitive'
        }
      },
      orderBy: {
        search_count: 'desc'
      },
      take: 5,
      select: {
        search_query: true,
        id: true
      }
    });
    console.log('Database results:', existingSearches); // Debug log

    if (existingSearches.length > 0) {
      return NextResponse.json({
        suggestions: existingSearches.map(search => ({
          label: search.search_query,
          value: search.search_query
        }))
      });
    }

    // Log Google API attempt
    console.log('Calling Google Places API');
    const googleUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=geocode&components=country:in&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    console.log('Google API URL:', googleUrl); // Debug log

    const response = await fetch(googleUrl);
    const data = await response.json();
    console.log('Google API response:', data); // Debug log

    if (data.status === 'OK' && data.predictions) {
      await prisma.searchHistory.create({
        data: {
          search_query: query,
          search_category: 'LOCATION_SEARCH',
          user_type: 'guest',
          is_successful: true
        }
      });

      return NextResponse.json({
        suggestions: data.predictions.slice(0, 5).map((place: any) => ({
          label: place.description,
          value: place.description
        }))
      });
    }

    return NextResponse.json({ suggestions: [] });

  } catch (error) {
    console.error('Detailed error:', error); // Enhanced error logging
    return NextResponse.json(
      { error: 'Search failed', suggestions: [] },
      { status: 200 }
    );
  }
}