import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const id = parseInt(context.params.id);
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const id = parseInt(context.params.id);

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ success: false, message: 'Employee not found' }, { status: 404 });
  }

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ success: true, message: 'Employee deleted successfully' });
}
