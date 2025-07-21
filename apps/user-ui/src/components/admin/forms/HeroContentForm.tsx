'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { dataProvider } from '../../../lib/data';
import { FILE_SIZE_LIMITS, FILE_TYPES } from '../../../lib/imagekit';
import { HeroContent } from '../../../types/domain';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '../../ui/switch';
import { ImageUploader } from './ImageUploader';

const heroSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  subtitle: z.string().max(200, 'Subtitle too long').optional(),
  ctaText: z
    .string()
    .min(1, 'CTA text is required')
    .max(50, 'CTA text too long'),
  ctaLink: z.string().min(1, 'CTA link is required').url('Invalid URL'),
  position: z.number().min(1, 'Position must be at least 1'),
  isActive: z.boolean(),
});

type HeroFormData = z.infer<typeof heroSchema>;

interface HeroContentFormProps {
  hero?: HeroContent | null;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Hero content form component
 */
export const HeroContentForm: React.FC<HeroContentFormProps> = ({
  hero,
  onClose,
  onSuccess,
}) => {
  const [uploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<any[]>(
    hero?.image
      ? [
          {
            id: 'existing',
            name: 'Hero Image',
            url: hero.image,
            type: 'image/jpeg',
            size: 0,
          },
        ]
      : []
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      title: hero?.title || '',
      subtitle: hero?.subtitle || '',
      ctaText: hero?.ctaText || 'Shop Now',
      ctaLink: hero?.ctaLink || '/products',
      position: hero?.position || 1,
      isActive: hero?.isActive || false,
    },
  });

  const isActive = watch('isActive');

  const onSubmit = async (data: HeroFormData) => {
    if (uploadedImages.length === 0) {
      alert('Please upload a hero image');
      return;
    }

    try {
      const heroData = {
        ...data,
        image: uploadedImages[0].url,
      };

      if (hero) {
        // Update existing hero
        await dataProvider.updateHeroContent(hero.id, heroData);
      } else {
        // Create new hero - this would need to be implemented in the data provider
        console.log('Creating new hero:', heroData);
        // For now, just simulate success
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to save hero content:', error);
      alert('Failed to save hero content');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {hero ? 'Edit Hero Content' : 'Create Hero Content'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Hero Image</Label>
            <ImageUploader
              value={uploadedImages}
              onChange={setUploadedImages}
              maxFiles={1}
              acceptedTypes={FILE_TYPES.IMAGES}
              maxSizeInMB={FILE_SIZE_LIMITS.HERO_IMAGE}
              folder="hero-images"
            />
            <p className="text-sm text-gray-500">
              Upload a high-quality image for the hero banner. Recommended size:
              1920x1080px.
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter hero title"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              {...register('subtitle')}
              placeholder="Enter hero subtitle (optional)"
            />
            {errors.subtitle && (
              <p className="text-sm text-red-600">{errors.subtitle.message}</p>
            )}
          </div>

          {/* CTA Text */}
          <div className="space-y-2">
            <Label htmlFor="ctaText">Call-to-Action Text *</Label>
            <Input
              id="ctaText"
              {...register('ctaText')}
              placeholder="e.g., Shop Now, Learn More"
            />
            {errors.ctaText && (
              <p className="text-sm text-red-600">{errors.ctaText.message}</p>
            )}
          </div>

          {/* CTA Link */}
          <div className="space-y-2">
            <Label htmlFor="ctaLink">Call-to-Action Link *</Label>
            <Input
              id="ctaLink"
              {...register('ctaLink')}
              placeholder="e.g., /products, https://example.com"
            />
            {errors.ctaLink && (
              <p className="text-sm text-red-600">{errors.ctaLink.message}</p>
            )}
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="position">Display Position</Label>
            <Input
              id="position"
              type="number"
              min="1"
              {...register('position', { valueAsNumber: true })}
              placeholder="1"
            />
            {errors.position && (
              <p className="text-sm text-red-600">{errors.position.message}</p>
            )}
            <p className="text-sm text-gray-500">
              Lower numbers appear first in the hero carousel.
            </p>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
            <Label>Set as active hero</Label>
          </div>
          {isActive && (
            <p className="text-sm text-amber-600">
              Setting this as active will deactivate other hero content.
            </p>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || uploading}>
              {isSubmitting
                ? 'Saving...'
                : hero
                ? 'Update Hero'
                : 'Create Hero'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
