'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { uploadImageToImageKit, productImageUploadParams } from '@/lib/imagekit';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ProductImageUploadProps {
  value: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ProductImageUpload({
  value = [],
  onChange,
  maxImages = 5
}: ProductImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - value.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = filesToUpload.map(async (file, index) => {
        const result = await uploadImageToImageKit(
          file,
          `product-${Date.now()}-${index}`,
          productImageUploadParams.folder,
          (progress) => {
            setUploadProgress((prev) => Math.max(prev, progress));
          }
        );
        return result.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...value, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [value, onChange, maxImages]);

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...value];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
        <CardContent className="p-6">
          <div className="text-center">
            {uploading ? (
              <div className="space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Uploading images...</p>
                  <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                </div>
              </div>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Upload Product Images</p>
                  <p className="text-xs text-muted-foreground">
                    Drag and drop or click to select images
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {value.length}/{maxImages} images uploaded
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 cursor-pointer"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.multiple = true;
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const target = e.target as HTMLInputElement;
                      handleFileSelect(target.files);
                    };
                    input.click();
                  }}
                  disabled={value.length >= maxImages}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select Images
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {value.map((imageUrl, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={imageUrl}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />

                  {/* Remove button */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>

                  {/* Main image indicator */}
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1">
                      <Badge variant="default" className="text-xs">
                        Main
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Move buttons */}
                <div className="flex justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs cursor-pointer"
                    onClick={() => moveImage(index, Math.max(0, index - 1))}
                    disabled={index === 0}
                  >
                    ←
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs cursor-pointer"
                    onClick={() => moveImage(index, Math.min(value.length - 1, index + 1))}
                    disabled={index === value.length - 1}
                  >
                    →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
