import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const params = await context.params;
    const id = params.id;
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching user' },
      { status: 500 }
    );
  }
}