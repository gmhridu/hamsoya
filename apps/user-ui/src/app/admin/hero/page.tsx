'use client';

import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HeroContentForm } from '../../../components/admin/forms/HeroContentForm';
import {
  AdminPageLayout,
  AdminSection,
} from '../../../components/admin/layout/AdminPageLayout';
import { HeroPreviewModal } from '../../../components/admin/modals/HeroPreviewModal';
import { CardGridSkeleton } from '../../../components/admin/skeletons/AdminSkeletons';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { dataProvider } from '../../../lib/data';
import { generateImageKitUrl } from '../../../lib/imagekit';
import { cn } from '../../../lib/utils';
import { HeroContent } from '../../../types/domain';

/**
 * Hero content management page
 */
export default function HeroManagementPage() {
  const [heroContent, setHeroContent] = useState<HeroContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHero, setEditingHero] = useState<HeroContent | null>(null);
  const [previewHero, setPreviewHero] = useState<HeroContent | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Load hero content
  useEffect(() => {
    const loadHeroContent = async () => {
      setLoading(true);
      try {
        const content = await dataProvider.getHeroContent();
        setHeroContent(content);
      } catch (error) {
        console.error('Failed to load hero content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHeroContent();
  }, []);

  const handleToggleActive = async (hero: HeroContent) => {
    try {
      // If activating this hero, deactivate others
      if (!hero.isActive) {
        const updatedContent = heroContent.map((h) => ({
          ...h,
          isActive: h.id === hero.id,
        }));
        setHeroContent(updatedContent);

        // Update in data provider
        await dataProvider.updateHeroContent(hero.id, { isActive: true });

        // Deactivate others
        const otherHeroes = heroContent.filter(
          (h) => h.id !== hero.id && h.isActive
        );
        await Promise.all(
          otherHeroes.map((h) =>
            dataProvider.updateHeroContent(h.id, { isActive: false })
          )
        );
      } else {
        // Deactivate this hero
        const updatedContent = heroContent.map((h) =>
          h.id === hero.id ? { ...h, isActive: false } : h
        );
        setHeroContent(updatedContent);
        await dataProvider.updateHeroContent(hero.id, { isActive: false });
      }
    } catch (error) {
      console.error('Failed to toggle hero status:', error);
    }
  };

  const handleEdit = (hero: HeroContent) => {
    setEditingHero(hero);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingHero(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingHero(null);
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingHero(null);

    // Reload hero content
    try {
      const content = await dataProvider.getHeroContent();
      setHeroContent(content);
    } catch (error) {
      console.error('Failed to reload hero content:', error);
    }
  };

  if (loading) {
    return (
      <AdminPageLayout
        title="Hero Content"
        description="Manage hero banners and content"
      >
        <CardGridSkeleton count={3} columns={3} />
      </AdminPageLayout>
    );
  }

  return (
    <>
      <AdminPageLayout
        title="Hero Content"
        description="Manage hero banners and content for the homepage"
        actions={
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Hero
          </Button>
        }
      >
        <AdminSection>
          {heroContent.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hero content
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first hero banner.
              </p>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Hero
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heroContent.map((hero) => (
                <div
                  key={hero.id}
                  className={cn(
                    'border rounded-lg overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md',
                    hero.isActive && 'ring-2 ring-brand-primary'
                  )}
                >
                  {/* Hero Image */}
                  <div className="aspect-video bg-gray-100 relative">
                    <img
                      src={generateImageKitUrl(hero.image, {
                        width: 400,
                        height: 225,
                        crop: 'maintain_ratio',
                        quality: 80,
                      })}
                      alt={hero.title}
                      className="w-full h-full object-cover"
                    />
                    {hero.isActive && (
                      <Badge className="absolute top-2 left-2 bg-green-600">
                        Active
                      </Badge>
                    )}
                  </div>

                  {/* Hero Content */}
                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2">
                        {hero.title}
                      </h3>
                      {hero.subtitle && (
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {hero.subtitle}
                        </p>
                      )}
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {hero.ctaText}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          Position: {hero.position}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={hero.isActive}
                          onCheckedChange={() => handleToggleActive(hero)}
                        />
                        <span className="text-sm text-gray-600">
                          {hero.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewHero(hero)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(hero)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminSection>
      </AdminPageLayout>

      {/* Hero Form Modal */}
      {showForm && (
        <HeroContentForm
          hero={editingHero}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Hero Preview Modal */}
      {previewHero && (
        <HeroPreviewModal
          hero={previewHero}
          onClose={() => setPreviewHero(null)}
        />
      )}
    </>
  );
}
