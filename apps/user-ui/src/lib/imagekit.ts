/**
 * ImageKit configuration and utilities for image/video uploads
 */

import ImageKit from 'imagekit';

/**
 * ImageKit configuration
 */
const imagekitConfig = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
};

/**
 * Server-side ImageKit instance
 */
export const imagekit =
  imagekitConfig.publicKey &&
  imagekitConfig.privateKey &&
  imagekitConfig.urlEndpoint
    ? new ImageKit(imagekitConfig)
    : null;

/**
 * Client-side ImageKit configuration
 */
export const clientImageKit = {
  publicKey: imagekitConfig.publicKey,
  urlEndpoint: imagekitConfig.urlEndpoint,
};

/**
 * Upload file to ImageKit
 */
export interface UploadOptions {
  file: string | Buffer;
  fileName: string;
  folder?: string;
  tags?: string[];
  useUniqueFileName?: boolean;
  transformation?: any; // ImageKit transformation object
}

export interface UploadResult {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  size: number;
  filePath: string;
  tags: string[];
  isPrivateFile: boolean;
  customCoordinates: string | null;
  fileType: string;
}

/**
 * Upload file to ImageKit (server-side)
 */
export async function uploadToImageKit(
  options: UploadOptions
): Promise<UploadResult> {
  try {
    if (!imagekit) {
      throw new Error(
        'ImageKit is not properly configured. Please check your environment variables.'
      );
    }

    const uploadResponse: any = await imagekit.upload({
      file: options.file,
      fileName: options.fileName,
      folder: options.folder || '/admin-uploads',
      tags: options.tags || [],
      useUniqueFileName: options.useUniqueFileName !== false,
      transformation: options.transformation,
    });

    return {
      fileId: uploadResponse.fileId || '',
      name: uploadResponse.name || options.fileName,
      url: uploadResponse.url || '',
      thumbnailUrl: uploadResponse.thumbnailUrl || uploadResponse.url || '',
      height: uploadResponse.height || 0,
      width: uploadResponse.width || 0,
      size: uploadResponse.size || 0,
      filePath: uploadResponse.filePath || '',
      tags: uploadResponse.tags || [],
      isPrivateFile: uploadResponse.isPrivateFile || false,
      customCoordinates: uploadResponse.customCoordinates || null,
      fileType: uploadResponse.fileType || 'unknown',
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw new Error('Failed to upload file to ImageKit');
  }
}

/**
 * Delete file from ImageKit
 */
export async function deleteFromImageKit(fileId: string): Promise<void> {
  try {
    if (!imagekit) {
      throw new Error(
        'ImageKit is not properly configured. Please check your environment variables.'
      );
    }

    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error('ImageKit delete error:', error);
    throw new Error('Failed to delete file from ImageKit');
  }
}

/**
 * Generate ImageKit URL with transformations
 */
export interface TransformationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpg' | 'png' | 'webp' | 'avif';
  crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max';
  cropMode?: 'resize' | 'extract' | 'pad_resize';
  focus?:
    | 'center'
    | 'top'
    | 'left'
    | 'bottom'
    | 'right'
    | 'top_left'
    | 'top_right'
    | 'bottom_left'
    | 'bottom_right';
  blur?: number;
  grayscale?: boolean;
}

export function generateImageKitUrl(
  path: string,
  transformations?: TransformationOptions
): string {
  if (!transformations) {
    return `${imagekitConfig.urlEndpoint}${path}`;
  }

  const transformationString = Object.entries(transformations)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => {
      switch (key) {
        case 'width':
          return `w-${value}`;
        case 'height':
          return `h-${value}`;
        case 'quality':
          return `q-${value}`;
        case 'format':
          return `f-${value}`;
        case 'crop':
          return `c-${value}`;
        case 'cropMode':
          return `cm-${value}`;
        case 'focus':
          return `fo-${value}`;
        case 'blur':
          return `bl-${value}`;
        case 'grayscale':
          return value ? 'e-grayscale' : '';
        default:
          return '';
      }
    })
    .filter(Boolean)
    .join(',');

  return `${imagekitConfig.urlEndpoint}/tr:${transformationString}${path}`;
}

/**
 * Get authentication parameters for client-side uploads
 */
export async function getImageKitAuthParams(): Promise<{
  signature: string;
  expire: number;
  token: string;
}> {
  try {
    if (!imagekit) {
      throw new Error(
        'ImageKit is not properly configured. Please check your environment variables.'
      );
    }

    const authenticationParameters = imagekit.getAuthenticationParameters();
    return authenticationParameters;
  } catch (error) {
    console.error('ImageKit auth error:', error);
    throw new Error('Failed to get ImageKit authentication parameters');
  }
}

/**
 * Validate file type for uploads
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * Common file type constants
 */
export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  VIDEOS: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
  ALL_MEDIA: [
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
  ],
};

/**
 * Common file size limits (in MB)
 */
export const FILE_SIZE_LIMITS = {
  IMAGE: 10, // 10MB
  VIDEO: 100, // 100MB
  HERO_IMAGE: 5, // 5MB
  PRODUCT_IMAGE: 8, // 8MB
};
