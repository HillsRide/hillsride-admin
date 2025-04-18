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
      password: 'Admin@123' // Default password
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

    // Remove sensitive data before sending response
    // (password, pin, authCode are not used, so destructuring is unnecessary)
    return NextResponse.json({
      success: true,
      user,
      message: 'Employee created successfully'
    });

  } catch (error: unknown) {
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