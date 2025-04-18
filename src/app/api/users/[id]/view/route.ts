import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  // For now, just return a success response
  return NextResponse.json({
    success: true,
    message: 'Route working'
  });
}

export async function PUT(request, context) {
  const { params } = context;
  try {
    const userId = parseInt(params.id);
    const { status } = await request.json();

    if (!['ACTIVE', 'SUSPENDED', 'DISMISSED', 'PAUSED'].includes(status)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid status'
      }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        status: true
      }
    });

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
