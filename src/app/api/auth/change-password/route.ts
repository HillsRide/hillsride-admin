import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword, newPin } = await request.json();

    // Validate required fields
    if (!currentPassword || !newPassword || !newPin) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get user from session or token
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    if (!user.password) {
      return NextResponse.json(
        { error: 'No password set for this user' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid current password' },
        { status: 401 }
      );
    }

    // Validate new password format
    const PASSWORD_MIN_LENGTH = 8;
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const PIN_REGEX = /^\d{4}$/;

    if (newPassword.length < PASSWORD_MIN_LENGTH) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' },
        { status: 400 }
      );
    }

    // Validate new PIN format
    if (!PIN_REGEX.test(newPin)) {
      return NextResponse.json(
        { error: 'PIN must be 4 digits' },
        { status: 400 }
      );
    }

    // Hash new password and PIN
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const hashedPin = await bcrypt.hash(newPin, 10);

    // Update user
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        password: hashedPassword,
        pin: hashedPin,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ message: 'Password and PIN updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}