import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import { getServerAuthState } from '@/lib/server-auth-state';
import { AdminProduct } from '@/types/admin';

// Helper function to sanitize product data
function sanitizeProduct(product: any): AdminProduct {
  return {
    id: String(product.id || ''),
    name: String(product.name || ''),
    description: product.description || undefined,
    price: Number(product.price) || 0,
    original_price: product.original_price ? Number(product.original_price) : undefined,
    cost_price: product.cost_price ? Number(product.cost_price) : undefined,
    sku: product.sku || undefined,
    stock_quantity: Number(product.stock_quantity) || 0,
    low_stock_threshold: product.low_stock_threshold ? Number(product.low_stock_threshold) : undefined,
    category_id: product.category_id || undefined,
    category_name: product.category?.name || product.category_name || undefined,
    images: Array.isArray(product.images) ? product.images : [],
    featured: Boolean(product.featured),
    is_active: Boolean(product.is_active),
    in_stock: Boolean(product.in_stock),
    weight: product.weight || undefined,
    origin: product.origin || undefined,
    benefits: Array.isArray(product.benefits) ? product.benefits : undefined,
    dimensions: product.dimensions || undefined,
    tags: Array.isArray(product.tags) ? product.tags : undefined,
    meta_title: product.meta_title || undefined,
    meta_description: product.meta_description || undefined,
    sales_count: Number(product.sales_count) || 0,
    revenue: Number(product.revenue) || 0,
    created_at: String(product.created_at || new Date().toISOString()),
    updated_at: String(product.updated_at || new Date().toISOString()),
  };
}

// GET /api/admin/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authState = await getServerAuthState();

    if (!authState.isAuthenticated || authState.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_CONFIG.backend.base}/admin/products/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authState.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();

      return NextResponse.json({
        success: true,
        data: sanitizeProduct(data.data),
        message: data.message || 'Product retrieved successfully',
        timestamp: new Date().toISOString(),
      });
    } else {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || 'Failed to fetch product',
          message: errorData.message || 'Backend error'
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authState = await getServerAuthState();

    if (!authState.isAuthenticated || authState.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_CONFIG.backend.base}/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authState.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();

      return NextResponse.json({
        success: true,
        data: sanitizeProduct(data.data),
        message: data.message || 'Product updated successfully',
        timestamp: new Date().toISOString(),
      });
    } else {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || 'Failed to update product',
          message: errorData.message || 'Backend error'
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authState = await getServerAuthState();

    if (!authState.isAuthenticated || authState.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_CONFIG.backend.base}/admin/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authState.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();

      return NextResponse.json({
        success: true,
        message: data.message || 'Product deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } else {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || 'Failed to delete product',
          message: errorData.message || 'Backend error'
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
