import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const popularLocations = await prisma.searchHistory.groupBy({
      by: ['search_query'],
      _count: {
        search_query: true
      },
      orderBy: {
        _count: {
          search_query: 'desc'
        }
      },
      take: 10
    });

    return NextResponse.json(
      popularLocations.map((loc: {
        search_query: string;
        _count: { search_query: number };
      }) => ({
        search_query: loc.search_query,
        search_count: loc._count.search_query
      }))
    );
  } catch (error) {
  console.error(error);
  return NextResponse.json([], { status: 500 });
}
}