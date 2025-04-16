import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'week';

    let dateFilter: any = {
      gte: new Date(new Date().setDate(new Date().getDate() - 7))
    };

    if (range === 'month') {
      dateFilter.gte = new Date(new Date().setMonth(new Date().getMonth() - 1));
    } else if (range === 'year') {
      dateFilter.gte = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    }

    const trends = await prisma.searchHistory.groupBy({
      by: ['last_searched'],
      _count: {
        search_id: true
      },
      where: {
        last_searched: dateFilter
      },
      orderBy: {
        last_searched: 'asc'
      }
    });

    return NextResponse.json(
      trends.map(trend => ({
        date: trend.last_searched,
        searches: trend._count.search_id
      }))
    );
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}