'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/admin/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoadingButton } from '@/components/ui/loading-button';
import { useAdminProducts, useAdminCategories, AdminProduct } from '@/hooks/use-admin-data';
import {
  useUpdateProduct,
  useDeleteProduct
} from '@/hooks/use-admin-mutations';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Eye,
  MoreHorizontal,
  Plus,
  Download,
  Filter,
  Search,
  Edit,
  Trash2,
  Star,
  Package,
  Image as ImageIcon,
  AlertTriangle,
} from 'lucide-react';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const stockOptions = [
  { value: 'all', label: 'All Stock' },
  { value: 'inStock', label: 'In Stock' },
  { value: 'outOfStock', label: 'Out of Stock' },
  { value: 'lowStock', label: 'Low Stock' },
];

export function ProductsManagement() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [productToUpdateStock, setProductToUpdateStock] = useState<AdminProduct | null>(null);

  // Fetch products with filters
  const {
    data: productsResponse,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useAdminProducts({
    page,
    limit: 20,
    search: searchTerm || undefined,
    category_id: categoryFilter !== 'all' ? categoryFilter : undefined,
    is_active: statusFilter !== 'all' ? statusFilter === 'active' : undefined,
    in_stock: stockFilter === 'inStock' ? true : stockFilter === 'outOfStock' ? false : undefined,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  // Fetch categories for filter dropdown
  const { data: categoriesResponse } = useAdminCategories({
    limit: 100,
    is_active: true,
  });

  // Mutations
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const products = (productsResponse as any)?.data || [];
  const categories = (categoriesResponse as any)?.data?.categories || [];

  // Build category options from API data
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((cat: any) => ({
      value: cat.id,
      label: cat.name,
    })),
  ];

  const handleToggleFeatured = async (productId: string, currentFeatured: boolean) => {
    try {
      await apiClient.updateAdminProductFeatured(productId, !currentFeatured);
      toast.success('Product featured status updated successfully');
      refetchProducts();
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  const handleToggleStatus = async (productId: string, currentActive: boolean) => {
    try {
      await updateProductMutation.mutateAsync({
        id: productId,
        is_active: !currentActive,
      });
    } catch (error) {
      toast.error('Failed to update product status');
    }
  };

  const handleStockUpdate = (product: AdminProduct) => {
    setProductToUpdateStock(product);
    setStockDialogOpen(true);
  };

  const handleStockUpdateSuccess = () => {
    refetchProducts();
    setStockDialogOpen(false);
    setProductToUpdateStock(null);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteProductMutation.mutateAsync(productToDelete);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const productColumns = [
    {
      key: 'product',
      title: 'Product',
      render: (_: any, product: any) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-muted-foreground">{product.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'category_name',
      title: 'Category',
      sortable: true,
      render: (value: string) => (
        <Badge variant="outline">{value || 'Uncategorized'}</Badge>
      ),
    },
    {
      key: 'price',
      title: 'Price',
      sortable: true,
      render: (value: number, product: any) => (
        <div>
          <div className="font-medium">৳{value.toLocaleString()}</div>
          {product.original_price && product.original_price > value && (
            <div className="text-sm text-muted-foreground line-through">
              ৳{product.original_price.toLocaleString()}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'stock_quantity',
      title: 'Stock',
      sortable: true,
      render: (value: number) => (
        <Badge
          variant={value === 0 ? 'destructive' : value < 30 ? 'outline' : 'default'}
        >
          {value === 0 ? 'Out of Stock' : `${value} units`}
        </Badge>
      ),
    },
    {
      key: 'featured',
      title: 'Featured',
      render: (value: boolean, product: any) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={value}
            onCheckedChange={() => handleToggleFeatured(product.id, value)}
            className="cursor-pointer"
          />
          {value && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
        </div>
      ),
    },
    {
      key: 'is_active',
      title: 'Status',
      render: (value: boolean, product: any) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={value}
            onCheckedChange={() => handleToggleStatus(product.id, value)}
            className="cursor-pointer"
          />
          <Badge variant={value ? 'default' : 'secondary'}>
            {value ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, product: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="cursor-pointer">
            <DropdownMenuItem
              onClick={() => router.push(`/admin/products/${product.id}`)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/admin/products/${product.id}/edit`)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStockUpdate(product)}
              className="cursor-pointer"
            >
              <Package className="mr-2 h-4 w-4" />
              Update Stock
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setProductToDelete(product.id);
                setDeleteDialogOpen(true);
              }}
              className="text-destructive cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // if (productsLoading) {
  //   return <ProductsManagementSkeleton />;
  // }

  if (productsError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load products</h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading the products. Please try again.
            </p>
            <Button onClick={() => refetchProducts()} className="cursor-pointer">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <CardTitle className="text-lg sm:text-xl">Products</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none min-h-[44px] cursor-pointer">
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button
                size="sm"
                className="flex-1 sm:flex-none min-h-[44px] cursor-pointer"
                onClick={() => router.push('/admin/products/add')}
              >
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {/* Filters - Responsive layout */}
          <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name, description, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[150px] h-10 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="cursor-pointer">
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[130px] h-10 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="cursor-pointer">
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-[130px] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="cursor-pointer">
                  {stockOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Table */}
          <DataTable
            data={products}
            columns={productColumns}
            searchable={false}
            emptyMessage="No products found"
            keyField="id"
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
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

      {/* Stock Update Dialog */}
      {/* <StockUpdateDialog
        open={stockDialogOpen}
        onOpenChange={setStockDialogOpen}
        product={productToUpdateStock}
        onSuccess={handleStockUpdateSuccess}
      /> */}
    </>
  );
}
