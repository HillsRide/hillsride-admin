import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function generateAuthCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received data:', body); // Log incoming data
    
    const authCode = generateAuthCode();
    console.log('Generated auth code:', authCode);
    
    // Create user with all required fields
    const user = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        employeeId: body.employeeId,
        designation: body.designation,
        department: body.department,
        manager: body.manager,
        approver: body.approver,
        authCode: authCode
      }
    });
    console.log('User created:', user); // Log created user

    return NextResponse.json({
      success: true,
      user,
      message: 'Employee created successfully'
    });

  } catch (error: any) {
    console.error('Detailed error:', error); // Log detailed error
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      return NextResponse.json(
        { 
          success: false,
          message: `This ${field} is already in use` 
        },
        { status: 400 }
      );
    }

    console.error('Create user error:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to create employee' 
      },
      { status: 500 }
    );
  }
}