import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sort') || 'last_searched';
    const desc = searchParams.get('desc') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // Calculate skip value for pagination
    const skip = (page - 1) * pageSize;

    // Get total count for pagination
    const totalCount = await prisma.searchHistory.count();

    const searches = await prisma.searchHistory.findMany({
      select: {
        id: true,
        search_query: true,
        search_count: true,
        first_searched: true,
        last_searched: true,
        user_type: true,
        device: true,
        is_successful: true,
      },
      orderBy: {
        [sortBy]: desc ? 'desc' : 'asc',
      },
      skip,
      take: pageSize,
    });

    return NextResponse.json({
      data: searches.map((search: {
        id: number;
        search_query: string;
        search_count: number;
        first_searched: Date;
        last_searched: Date;
        user_type: string;
        device: string;
        is_successful: boolean;
      }) => ({
        ...search,
        search_id: search.id
      })),
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / pageSize)
      }
    });
  } catch (error) {
    console.error('Failed to fetch search history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search history' },
      { status: 500 }
    );
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