import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: ['google_maps_api_enabled', 'google_maps_api_key']
        }
      }
    });
    
    const enabled = settings.find(s => s.key === 'google_maps_api_enabled')?.value === 'true';
    const apiKey = settings.find(s => s.key === 'google_maps_api_key')?.value;
    
    return NextResponse.json({ enabled, apiKey });
  } catch (error) {
    return NextResponse.json({ enabled: false, apiKey: '' });
  }
}

export async function POST(request: Request) {
  try {
    const { enabled, apiKey } = await request.json();
    
    // Update enabled status
    await prisma.systemSetting.upsert({
      where: { key: 'google_maps_api_enabled' },
      update: { value: String(enabled) },
      create: {
        key: 'google_maps_api_enabled',
        value: String(enabled)
      }
    });

    // Update API key
    if (apiKey) {
      await prisma.systemSetting.upsert({
        where: { key: 'google_maps_api_key' },
        update: { value: apiKey },
        create: {
          key: 'google_maps_api_key',
          value: apiKey
        }
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update API settings' },
      { status: 500 }
    );
  }
}