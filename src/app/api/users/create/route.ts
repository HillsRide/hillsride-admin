import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function generateEmployeeId(): string {
  const prefix = 'EMP';
  const timestamp = Date.now().toString(36).slice(-4);
  const random = Math.random().toString(36).slice(-4).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received form data:', body);

    const userData = {
      fullName: String(body.fullName || '').trim(),
      email: String(body.email || '').trim().toLowerCase(),
      phone: String(body.phone || '').trim(),
      employeeId: body.employeeId || generateEmployeeId(),
      designation: String(body.designation || '').trim(),
      department: String(body.department || '').trim(),
      manager: String(body.manager || '').trim(),
      approver: String(body.approver || '').trim(),
    };

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'designation', 'department'];
    for (const field of requiredFields) {
      if (!userData[field as keyof typeof userData]) {
        return NextResponse.json({
          success: false,
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        }, { status: 400 });
      }
    }

    console.log('Creating user with data:', userData);

    const user = await prisma.user.create({
      data: userData
    });

    return NextResponse.json({
      success: true,
      user,
      message: 'Employee created successfully'
    });

  } catch (error: any) {
    console.error('Detailed error:', error);
    
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      return NextResponse.json({
        success: false,
        message: `This ${field} is already in use`
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to create employee'
    }, { status: 500 });
  }
}