import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const testConnection = await prisma.user.findFirst();
    return NextResponse.json({ 
      message: 'Database connection successful',
      success: true 
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        message: 'Database connection failed',
        success: false
      },
      { status: 500 }
    );
  }
}