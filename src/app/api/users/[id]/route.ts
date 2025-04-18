import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, context) {
  const { params } = context;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(params.id)
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Remove sensitive information if needed
    // Remove sensitive information if needed
    // (password is not used, so destructuring is unnecessary)
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json(
      { message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  const { params } = context;
  try {
    const userId = parseInt(params.id);

    // First check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Employee not found'
      }, { status: 404 });
    }

    // Perform the deletion
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully'
    });

  } catch (error) {
    console.error('Failed to delete employee:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to delete employee'
    }, { status: 500 });
  }
}