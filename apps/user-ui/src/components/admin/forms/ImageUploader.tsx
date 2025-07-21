'use client';

import { FileText, Image, Upload, Video, X } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import {
  FILE_SIZE_LIMITS,
  FILE_TYPES,
  generateImageKitUrl,
  validateFileSize,
  validateFileType,
} from '../../../lib/imagekit';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

interface ImageUploaderProps {
  value?: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  maxSizeInMB?: number;
  className?: string;
  disabled?: boolean;
  folder?: string;
}

/**
 * ImageKit-powered image/video uploader component
 */
export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = [],
  onChange,
  maxFiles = 5,
  acceptedTypes = FILE_TYPES.ALL_MEDIA,
  maxSizeInMB = FILE_SIZE_LIMITS.IMAGE,
  className,
  disabled = false,
  folder = 'admin-uploads',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (disabled || uploading) return;

      setError(null);
      setUploading(true);

      try {
        const validFiles: File[] = [];

        // Validate files
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          if (!validateFileType(file, acceptedTypes)) {
            setError(`File type not supported: ${file.name}`);
            continue;
          }

          if (!validateFileSize(file, maxSizeInMB)) {
            setError(`File too large: ${file.name} (max ${maxSizeInMB}MB)`);
            continue;
          }

          if (value.length + validFiles.length >= maxFiles) {
            setError(`Maximum ${maxFiles} files allowed`);
            break;
          }

          validFiles.push(file);
        }

        if (validFiles.length === 0) {
          setUploading(false);
          return;
        }

        // Upload files to ImageKit via API route
        const uploadPromises = validFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', folder);
          formData.append('fileName', file.name);

          const response = await fetch('/api/upload/imagekit', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Upload failed for ${file.name}`);
          }

          const result = await response.json();

          return {
            id: result.fileId,
            name: result.name,
            url: result.url,
            type: file.type,
            size: file.size,
          };
        });

        const uploadedFiles = await Promise.all(uploadPromises);
        onChange([...value, ...uploadedFiles]);
      } catch (error) {
        console.error('Upload error:', error);
        setError(error instanceof Error ? error.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [
      value,
      onChange,
      maxFiles,
      acceptedTypes,
      maxSizeInMB,
      disabled,
      uploading,
      folder,
    ]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (e.dataTransfer.files) {
        handleFileUpload(e.dataTransfer.files);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFileUpload(e.target.files);
      }
    },
    [handleFileUpload]
  );

  const removeFile = useCallback(
    (fileId: string) => {
      onChange(value.filter((file) => file.id !== fileId));
    },
    [value, onChange]
  );

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const canUploadMore = value.length < maxFiles;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      {canUploadMore && (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg p-6 transition-colors',
            isDragOver
              ? 'border-brand-primary bg-brand-primary/5'
              : 'border-gray-300',
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            disabled={disabled || uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="text-sm text-gray-600">
              <span className="font-medium text-brand-primary">
                Click to upload
              </span>{' '}
              or drag and drop
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {acceptedTypes.includes('video/mp4')
                ? 'Images and videos'
                : 'Images'}{' '}
              up to {maxSizeInMB}MB
            </p>
            {maxFiles > 1 && (
              <p className="text-xs text-gray-500">
                {value.length} of {maxFiles} files uploaded
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {error}
        </div>
      )}

      {/* Uploaded Files */}
      {value.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {value.map((file) => (
              <div
                key={file.id}
                className="relative group border rounded-lg p-3 bg-white shadow-sm"
              >
                {/* File Preview */}
                <div className="aspect-video bg-gray-100 rounded-md mb-2 overflow-hidden">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={generateImageKitUrl(
                        file.url.replace(
                          process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
                          ''
                        ),
                        {
                          width: 300,
                          height: 200,
                          crop: 'maintain_ratio',
                          quality: 80,
                        }
                      )}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : file.type.startsWith('video/') ? (
                    <video
                      src={file.url}
                      className="w-full h-full object-cover"
                      controls={false}
                      muted
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Uploading files...</span>
          </div>
        </div>
      )}
    </div>
  );
};
