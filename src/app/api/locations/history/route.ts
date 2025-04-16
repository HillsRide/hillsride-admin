import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sort') || 'last_searched';
    const desc = searchParams.get('desc') === 'true';

    const searches = await prisma.searchHistory.findMany({
      orderBy: {
        [sortBy]: desc ? 'desc' : 'asc'
      }
    });

    return NextResponse.json(searches);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}