import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const params = await context.params;
    await prisma.user.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        status: 'SUSPENDED'
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Suspend user error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to suspend user' },
      { status: 500 }
    );
  }
}