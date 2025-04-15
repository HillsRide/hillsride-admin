import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        status: 'SUSPENDED' // You'll need to add this field to your schema
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