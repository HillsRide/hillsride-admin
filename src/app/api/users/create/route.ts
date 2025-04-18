import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

async function generateEmployeeId(): Promise<string> {
  try {
    // Get all users to find the highest numeric ID
    const users = await prisma.user.findMany({
      select: {
        employeeId: true
      }
    });

    let maxNumber = 0;

    // Loop through existing IDs and find the highest number
    users.forEach(user => {
      // Only process IDs that match our format (EMPxxHR)
      if (user.employeeId.match(/^EMP\d+HR$/)) {
        const num = parseInt(user.employeeId.replace(/[^\d]/g, ''));
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    });

    // Next number should be maxNumber + 1, or 1 if no valid numbers found
    const nextNumber = maxNumber + 1;
    
    // Format with leading zeros
    const formattedNumber = nextNumber.toString().padStart(2, '0');
    return `EMP${formattedNumber}HR`;

  } catch (error) {
    console.error('Error generating employee ID:', error);
    // Fallback to timestamp-based ID if something goes wrong
    const timestamp = Date.now().toString().slice(-4);
    return `EMP${timestamp}HR`;
  }
}

function generatePin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString(); // Generates 4 digit PIN
}

function generateAuthCode(): string {
  return Math.random().toString(36).substring(2, 12).toUpperCase(); // 10 character auth code
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received form data:', body);

    // First check for existing user with same email or name
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: body.email?.trim().toLowerCase() },
          { 
            AND: [
              { fullName: body.fullName?.trim() },
              { department: body.department?.trim() },
              { designation: body.designation?.trim() }
            ]
          }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === body.email?.trim().toLowerCase()) {
        return NextResponse.json({
          success: false,
          message: 'An employee with this email already exists'
        }, { status: 400 });
      }
      
      if (existingUser.fullName === body.fullName?.trim()) {
        return NextResponse.json({
          success: false,
          message: 'An employee with the same name, department, and designation already exists. Please add a distinguishing middle name or initial.'
        }, { status: 400 });
      }
    }

    const userData = {
      fullName: String(body.fullName || '').trim(),
      email: String(body.email || '').trim().toLowerCase(),
      phone: String(body.phone || '').trim(),
      employeeId: body.employeeId || await generateEmployeeId(),
      designation: String(body.designation || '').trim(),
      department: String(body.department || '').trim(),
      manager: String(body.manager || '').trim(),
      approver: String(body.approver || '').trim(),
      pin: generatePin(),
      authCode: generateAuthCode(),
      status: 'ACTIVE',
      role: 'user',
      needsPasswordChange: true,
      password: 'Admin@123'
    };

    // Enhanced validation
    const requiredFields = ['fullName', 'email', 'phone', 'designation', 'department'];
    for (const field of requiredFields) {
      if (!userData[field as keyof typeof userData]) {
        return NextResponse.json({
          success: false,
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        }, { status: 400 });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json({
        success: false,
        message: 'Please enter a valid email address'
      }, { status: 400 });
    }

    // Validate phone number (assuming Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(userData.phone.replace(/[-\s]/g, ''))) {
      return NextResponse.json({
        success: false,
        message: 'Please enter a valid 10-digit phone number'
      }, { status: 400 });
    }

    console.log('Creating user with data:', userData);

    const user = await prisma.user.create({
      data: userData,
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
        createdAt: true,
        pin: true,
        authCode: true
      }
    });

    // Format the creation date
    const formattedUser = {
      ...user,
      createdAt: user.createdAt.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };

    return NextResponse.json({
      success: true,
      user: formattedUser,
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