export type ProductStatus = "draft" | "published" | "scheduled" | "archived";

export interface ProductVariant {
  id: string;
  sku: string;
  size?: string;
  color?: string;
  inventory: number;
  barcode?: string;
  weightG?: number;
  dims?: {
    length?: number;
    width?: number;
    height?: number;
  };
  taxClass?: string;
  allowBackorder?: boolean;
  allowPreorder?: boolean;
  restockEta?: string;
}

export interface CreateVariantRequest {
  sku: string;
  size?: string;
  color?: string;
  barcode?: string;
  weightG?: number;
  dims?: {
    length?: number;
    width?: number;
    height?: number;
  };
  taxClass?: string;
  allowBackorder?: boolean;
  allowPreorder?: boolean;
  restockEta?: string;
}

export interface UpdateVariantRequest extends Partial<CreateVariantRequest> {}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  position?: number;
}

export interface ProductImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface AdminProduct {
  productId: string;
  title: string;
  slug: string;
  brand?: string;
  shortDesc?: string;
  longDescHtml?: string;
  status: ProductStatus;
  categories: ProductCategory[];
  images: ProductImage[];
  variants: ProductVariant[];
  price?: number;
  priceSgd?: number | null;
  priceUsd?: number | null;
  compareAtPrice?: number | null;
  countryOfOrigin?: string;
  seoTitle?: string;
  seoDescription?: string;
  publishAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  page?: number;
  limit?: number;
  status?: ProductStatus;
  categoryId?: string;
  brand?: string;
  sortBy?: "title" | "createdAt" | "updatedAt" | "publishAt";
  sortOrder?: "asc" | "desc";
}

export interface ProductsListResponse {
  success: boolean;
  data: {
    products: AdminProduct[];
    total: number;
    page: number;
    limit: number;
  };
  error?: string;
}

export interface ProductDetailsResponse {
  success: boolean;
  data?: AdminProduct;
  error?: string;
}

export interface CreateProductRequest {
  title: string;
  brand?: string;
  shortDesc?: string;
  longDescHtml?: string;
  status?: ProductStatus;
  publishAt?: string;
  countryOfOrigin?: string;
  seoTitle?: string;
  seoDescription?: string;
  price?: number;
  priceSgd?: number;
  priceUsd?: number;
  compareAtPrice?: number;
  categoryIds?: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  tags?: string[];
}
