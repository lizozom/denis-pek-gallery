import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import sharp from 'sharp';

const MAX_WIDTH = 2400;
const MAX_HEIGHT = 1600;
const JPEG_QUALITY = 85;

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
      { status: 400 }
    );
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: 'File too large. Maximum size is 10MB.' },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Process image with sharp - resize and optimize for web
  const processedImage = await sharp(buffer)
    .resize(MAX_WIDTH, MAX_HEIGHT, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({
      quality: JPEG_QUALITY,
      progressive: true,
    })
    .toBuffer();

  // Generate filename with .jpg extension
  const originalName = file.name.replace(/\.[^/.]+$/, '');
  const fileName = `${originalName}-${Date.now()}.jpg`;

  const blob = await put(fileName, processedImage, {
    access: 'public',
    contentType: 'image/jpeg',
  });

  return NextResponse.json({ url: blob.url });
}
