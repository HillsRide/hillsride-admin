import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        employeeId: true,
        designation: true,
        department: true,
        manager: true,
        approver: true,
        status: true,
        role: true,
        pin: true,
        authCode: true,
        needsPasswordChange: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password, pin, and authCode for security
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}