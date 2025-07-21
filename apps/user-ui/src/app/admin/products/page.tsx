'use client';

import {
  Edit,
  Eye,
  Filter,
  Package,
  Plus,
  Search,
  Star,
  Tag,
  Trash2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  AdminPageLayout,
  AdminSection,
} from '../../../components/admin/layout/AdminPageLayout';
import { TableSkeleton } from '../../../components/admin/skeletons/AdminSkeletons';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { dataProvider } from '../../../lib/data';
import { generateImageKitUrl } from '../../../lib/imagekit';
import { Product } from '../../../types/domain';

/**
 * Products management page
 */
export default function ProductsManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const pageSize = 10;

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const result = await dataProvider.getProducts(
          currentPage,
          pageSize,
          categoryFilter === 'all' ? undefined : categoryFilter,
          searchTerm || undefined
        );
        setProducts(result.products);
        setTotalPages(result.totalPages);
        setTotalProducts(result.total);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, categoryFilter, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stock <= 10) {
      return <Badge variant="secondary">Low Stock</Badge>;
    }
    return <Badge variant="default">In Stock</Badge>;
  };

  const categories = ['Electronics', 'Clothing', 'Home', 'Books'];

  if (loading && products.length === 0) {
    return (
      <AdminPageLayout
        title="Products Management"
        description="Manage product catalog and inventory"
      >
        <AdminSection>
          <TableSkeleton rows={10} />
        </AdminSection>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Products Management"
      description={`Manage product catalog and inventory (${totalProducts} total products)`}
      actions={
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Star className="mr-2 h-4 w-4" />
            Premium Collection
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      }
    >
      <AdminSection>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>

        {/* Products Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Features</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        {product.images[0] ? (
                          <img
                            src={generateImageKitUrl(product.images[0], {
                              width: 48,
                              height: 48,
                              crop: 'maintain_ratio',
                              quality: 80,
                            })}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          SKU: {product.sku}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {formatCurrency(product.price)}
                      </div>
                      {product.compareAtPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatCurrency(product.compareAtPrice)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{product.stock}</span>
                      {getStockBadge(product.stock)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? 'default' : 'secondary'}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {product.isPremium && (
                        <Badge
                          variant="default"
                          className="bg-yellow-600 text-xs"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                      {product.hasOffer && product.offerLabel && (
                        <Badge variant="destructive" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {product.offerLabel}
                        </Badge>
                      )}
                      {product.isPreOrder && (
                        <Badge variant="outline" className="text-xs">
                          Pre-order
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          window.open(`/admin/products/${product.id}`, '_blank')
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `/admin/products/${product.id}/edit`,
                            '_blank'
                          )
                        }
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, totalProducts)} of{' '}
              {totalProducts} products
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {products.filter((p) => p.isActive).length}
            </div>
            <div className="text-sm text-gray-500">Active Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {products.filter((p) => p.stock === 0).length}
            </div>
            <div className="text-sm text-gray-500">Out of Stock</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {products.filter((p) => p.isPremium).length}
            </div>
            <div className="text-sm text-gray-500">Premium Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {products.filter((p) => p.isPreOrder).length}
            </div>
            <div className="text-sm text-gray-500">Pre-orders</div>
          </div>
        </div>
      </AdminSection>
    </AdminPageLayout>
  );
}
