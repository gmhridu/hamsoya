'use client';

import { ExternalLink } from 'lucide-react';
import React from 'react';
import { generateImageKitUrl } from '../../../lib/imagekit';
import { HeroContent } from '../../../types/domain';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';

interface HeroPreviewModalProps {
  hero: HeroContent;
  onClose: () => void;
}

/**
 * Hero content preview modal
 */
export const HeroPreviewModal: React.FC<HeroPreviewModalProps> = ({
  hero,
  onClose,
}) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Hero Preview</span>
            <div className="flex items-center space-x-2">
              {hero.isActive && <Badge className="bg-green-600">Active</Badge>}
              <Badge variant="outline">Position: {hero.position}</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Preview */}
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <img
              src={generateImageKitUrl(hero.image, {
                width: 1200,
                height: 675,
                crop: 'maintain_ratio',
                quality: 90,
              })}
              alt={hero.title}
              className="w-full h-full object-cover"
            />

            {/* Hero Content Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white max-w-2xl px-6">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {hero.title}
                </h1>
                {hero.subtitle && (
                  <p className="text-lg md:text-xl mb-8 opacity-90">
                    {hero.subtitle}
                  </p>
                )}
                <Button
                  size="lg"
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                  asChild
                >
                  <a
                    href={hero.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    {hero.ctaText}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Hero Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Content Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Title:</span> {hero.title}
                  </div>
                  {hero.subtitle && (
                    <div>
                      <span className="font-medium">Subtitle:</span>{' '}
                      {hero.subtitle}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">CTA Text:</span>{' '}
                    {hero.ctaText}
                  </div>
                  <div>
                    <span className="font-medium">CTA Link:</span>{' '}
                    <a
                      href={hero.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:underline"
                    >
                      {hero.ctaLink}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Settings</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Status:</span>{' '}
                    <Badge variant={hero.isActive ? 'default' : 'secondary'}>
                      {hero.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Position:</span>{' '}
                    {hero.position}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>{' '}
                    {new Date(hero.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span>{' '}
                    {new Date(hero.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Preview */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Mobile Preview</h3>
            <div className="max-w-sm mx-auto">
              <div className="relative aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden">
                <img
                  src={generateImageKitUrl(hero.image, {
                    width: 400,
                    height: 711,
                    crop: 'maintain_ratio',
                    quality: 90,
                  })}
                  alt={hero.title}
                  className="w-full h-full object-cover"
                />

                {/* Mobile Content Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
                  <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-2">{hero.title}</h2>
                    {hero.subtitle && (
                      <p className="text-sm mb-4 opacity-90">{hero.subtitle}</p>
                    )}
                    <Button
                      size="sm"
                      className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                    >
                      {hero.ctaText}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose}>Close Preview</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
