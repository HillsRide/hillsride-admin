import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const searchStats = await prisma.searchHistory.groupBy({
      by: ['is_successful'],
      where: {
        last_searched: {
          gte: startDate
        }
      },
      _count: true,
      _sum: {
        search_completion_rate: true
      }
    });

    const totalSearches = searchStats.reduce(
      (acc: number, curr: { is_successful: boolean; _count: number; _sum: { search_completion_rate: number | null } }) => acc + curr._count,
      0
    );
    const successfulSearches = searchStats.find(
      (stat: { is_successful: boolean; _count: number; _sum: { search_completion_rate: number | null } }) => stat.is_successful
    )?._count || 0;
    const successRate = totalSearches ? (successfulSearches / totalSearches) * 100 : 0;

    return NextResponse.json({
      successRate: Math.round(successRate * 100) / 100,
      totalSearches,
      failedSearches: totalSearches - successfulSearches,
      averageCompletionRate: searchStats.reduce(
        (acc: number, curr: { is_successful: boolean; _count: number; _sum: { search_completion_rate: number | null } }) =>
          acc + (curr._sum.search_completion_rate || 0),
        0
      ) / totalSearches
    });
  } catch (error) {
    console.error('Error fetching search accuracy:', error);
    return NextResponse.json({
      successRate: 0,
      totalSearches: 0,
      failedSearches: 0,
      averageCompletionRate: 0
    });
  }
}