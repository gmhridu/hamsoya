import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import { AdminProduct, BackendPaginatedResponse, AdminProductQueryParams, CreateProductData, ApiResponse } from '@/types/admin';

// Default fallback data for when backend is unavailable
const DEFAULT_PRODUCTS: AdminProduct[] = [];

// Helper function to build query string from parameters
function buildQueryString(params: AdminProductQueryParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

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
    weight: product.weight ? Number(product.weight) : undefined,
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

// GET /api/admin/products - List products with pagination and filters
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: 'Admin access required'
        },
        { status: 401 }
      );
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const queryParams: AdminProductQueryParams = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 20,
      search: searchParams.get('search') || undefined,
      category_id: searchParams.get('category_id') || undefined,
      featured: searchParams.get('featured') ? searchParams.get('featured') === 'true' : undefined,
      in_stock: searchParams.get('in_stock') ? searchParams.get('in_stock') === 'true' : undefined,
      is_active: searchParams.get('is_active') ? searchParams.get('is_active') === 'true' : undefined,
      low_stock: searchParams.get('low_stock') ? searchParams.get('low_stock') === 'true' : undefined,
      sortBy: searchParams.get('sortBy') || 'created_at',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };

    try {
      // Call backend API
      const queryString = buildQueryString(queryParams);
      const backendUrl = `${API_CONFIG.backend.base}/admin/products${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data: BackendPaginatedResponse<AdminProduct> = await response.json();

        // Validate and sanitize the response data
        const sanitizedProducts = Array.isArray(data.data?.products)
          ? data.data.products.map(sanitizeProduct)
          : [];

        const sanitizedPagination = {
          page: Number(data.data?.pagination?.page) || 1,
          limit: Number(data.data?.pagination?.limit) || 20,
          total: Number(data.data?.pagination?.total) || 0,
          totalPages: Number(data.data?.pagination?.totalPages) || 0,
          hasNext: Boolean(data.data?.pagination?.hasNext),
          hasPrev: Boolean(data.data?.pagination?.hasPrev),
        };

        return NextResponse.json({
          success: true,
          data: sanitizedProducts,
          pagination: sanitizedPagination,
          message: data.message || 'Products retrieved successfully',
          timestamp: new Date().toISOString(),
        });
      }

      // Handle backend errors gracefully
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          {
            success: false,
            error: 'Unauthorized',
            message: 'Admin access required',
          },
          { status: response.status }
        );
      }

      // For other backend errors, log and return default data
      console.warn(`Backend products API returned ${response.status}, using fallback data`);

    } catch (backendError) {
      // Backend is unavailable, log error and continue with fallback
      console.warn('Backend products API unavailable, using fallback data:', backendError);
    }

    // Return default data when backend is unavailable
    return NextResponse.json({
      success: true,
      data: DEFAULT_PRODUCTS,
      pagination: {
        page: queryParams.page || 1,
        limit: queryParams.limit || 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      message: 'Products retrieved (using fallback data)',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Products API error:', error);

    // Return graceful error with fallback data
    return NextResponse.json({
      success: false,
      data: DEFAULT_PRODUCTS,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      error: 'Internal server error',
      message: 'Failed to retrieve products, showing default data',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: 'Admin access required'
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let productData: CreateProductData;
    try {
      const body = await request.json();
      productData = body;

      // Validate required fields
      if (!productData.name || !productData.price) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid request data',
            message: 'Name and price are required',
          },
          { status: 400 }
        );
      }

    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON',
          message: 'Request body must be valid JSON',
        },
        { status: 400 }
      );
    }

    try {
      // Call backend API
      const response = await fetch(`${API_CONFIG.backend.base}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const data: ApiResponse<AdminProduct> = await response.json();

        return NextResponse.json({
          success: true,
          data: sanitizeProduct(data.data),
          message: data.message || 'Product created successfully',
          timestamp: new Date().toISOString(),
        }, { status: 201 });
      }

      // Handle backend errors
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || 'Backend error',
          message: errorData.message || 'Failed to create product',
        },
        { status: response.status }
      );

    } catch (backendError) {
      // Backend is unavailable
      console.error('Backend product creation API unavailable:', backendError);

      return NextResponse.json(
        {
          success: false,
          error: 'Service unavailable',
          message: 'Product management service is temporarily unavailable. Please try again later.',
        },
        { status: 503 }
      );
    }

  } catch (error) {
    console.error('Product creation API error:', error);

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred while creating product',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
