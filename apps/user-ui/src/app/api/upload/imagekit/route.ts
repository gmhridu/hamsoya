import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '../../../../lib/admin-auth';
import { uploadToImageKit } from '../../../../lib/imagekit';

/**
 * ImageKit upload API route
 * Handles file uploads to ImageKit with admin authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'admin-uploads';
    const fileName = (formData.get('fileName') as string) || file.name;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/avi',
      'video/mov',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not supported' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to ImageKit
    const result = await uploadToImageKit({
      file: buffer,
      fileName: fileName,
      folder: `/${folder}`,
      tags: ['admin-upload', session.userId],
      useUniqueFileName: true,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('ImageKit upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

/**
 * Get ImageKit authentication parameters
 */
export async function GET() {
  try {
    // Check admin authentication
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return ImageKit client configuration
    return NextResponse.json({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    });
  } catch (error) {
    console.error('ImageKit auth error:', error);
    return NextResponse.json(
      { error: 'Failed to get authentication parameters' },
      { status: 500 }
    );
  }
}
