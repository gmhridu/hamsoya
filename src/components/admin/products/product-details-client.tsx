'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoadingButton } from '@/components/ui/loading-button';
import { useDeleteProduct } from '@/hooks/use-admin-mutations';
import { AdminProduct } from '@/types/admin';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Star, 
  Package, 
  Eye,
  Calendar,
  Tag,
  MapPin,
  Weight,
  Heart,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';

interface ProductDetailsClientProps {
  initialProduct: AdminProduct;
  productId: string;
}

export function ProductDetailsClient({ initialProduct, productId }: ProductDetailsClientProps) {
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteProductMutation = useDeleteProduct();

  const handleToggleFeatured = async () => {
    try {
      await apiClient.updateAdminProductFeatured(productId, !product.featured);
      setProduct(prev => ({ ...prev, featured: !prev.featured }));
      toast.success('Featured status updated successfully');
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  const handleToggleStatus = async () => {
    try {
      const response = await apiClient.updateAdminProduct(productId, { 
        is_active: !product.is_active 
      });
      setProduct(prev => ({ ...prev, is_active: !prev.is_active }));
      toast.success('Product status updated successfully');
    } catch (error) {
      toast.error('Failed to update product status');
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProductMutation.mutateAsync(productId);
      toast.success('Product deleted successfully');
      router.push('/admin/products');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/products')}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => router.push(`/admin/products/${productId}/edit`)}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
            <Button 
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              className="cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Product Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                <p className="text-muted-foreground mt-1">ID: {product.id}</p>
              </div>
              <div className="flex items-center gap-2">
                {product.featured && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </Badge>
                )}
                <Badge variant={product.is_active ? 'default' : 'secondary'}>
                  {product.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant={product.in_stock ? 'default' : 'destructive'}>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{product.description}</p>
          </CardContent>
        </Card>

        {/* Product Images */}
        {product.images && product.images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {product.images.map((imageUrl, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={imageUrl}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="default" className="text-xs">
                          Main
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Price</span>
                <span className="text-lg font-bold">৳{product.price.toLocaleString()}</span>
              </div>
              {product.original_price && product.original_price > product.price && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Original Price</span>
                  <span className="text-sm text-muted-foreground line-through">
                    ৳{product.original_price.toLocaleString()}
                  </span>
                </div>
              )}
              {product.sku && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">SKU</span>
                  <span className="text-sm">{product.sku}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inventory Information */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Stock Quantity</span>
                <Badge variant={product.stock_quantity === 0 ? 'destructive' : product.stock_quantity < 30 ? 'outline' : 'default'}>
                  {product.stock_quantity} units
                </Badge>
              </div>
              {product.low_stock_threshold && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Low Stock Threshold</span>
                  <span className="text-sm">{product.low_stock_threshold} units</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">In Stock Status</span>
                <Badge variant={product.in_stock ? 'default' : 'destructive'}>
                  {product.in_stock ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.weight && (
                <div className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Weight:</span>
                  <span className="text-sm">{product.weight}</span>
                </div>
              )}
              {product.origin && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Origin:</span>
                  <span className="text-sm">{product.origin}</span>
                </div>
              )}
              {product.category_name && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Category:</span>
                  <Badge variant="outline">{product.category_name}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Status Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Featured Product</p>
                  <p className="text-xs text-muted-foreground">Show in featured sections</p>
                </div>
                <Switch
                  checked={product.featured}
                  onCheckedChange={handleToggleFeatured}
                  className="cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Active Status</p>
                  <p className="text-xs text-muted-foreground">Visible to customers</p>
                </div>
                <Switch
                  checked={product.is_active}
                  onCheckedChange={handleToggleStatus}
                  className="cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits and Tags */}
        {(product.benefits && product.benefits.length > 0) || (product.tags && product.tags.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {product.benefits && product.benefits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {product.tags && product.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* SEO Information */}
        {(product.meta_title || product.meta_description) && (
          <Card>
            <CardHeader>
              <CardTitle>SEO Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.meta_title && (
                <div>
                  <p className="text-sm font-medium mb-1">Meta Title</p>
                  <p className="text-sm text-muted-foreground">{product.meta_title}</p>
                </div>
              )}
              {product.meta_description && (
                <div>
                  <p className="text-sm font-medium mb-1">Meta Description</p>
                  <p className="text-sm text-muted-foreground">{product.meta_description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Timestamps */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Created:</span>
              <span className="text-sm">{formatDate(product.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Last Updated:</span>
              <span className="text-sm">{formatDate(product.updated_at)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Product
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{product.name}"? This action cannot be undone.
              The product will be marked as inactive and hidden from customers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <LoadingButton
              variant="destructive"
              onClick={handleDeleteProduct}
              loading={deleteProductMutation.isPending}
              className="cursor-pointer"
            >
              Delete Product
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
