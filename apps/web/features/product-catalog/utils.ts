// ============================================================================
// PRODUCT CATALOG UTILITIES
// ============================================================================

import type { Product } from "./types";

/**
 * Transform raw API product data to Product interface
 */
export const transformProduct = (rawProduct: any): Product => {
  return {
    id: rawProduct.productId,
    productId: rawProduct.productId,
    title: rawProduct.title,
    slug: rawProduct.slug,
    description: rawProduct.shortDesc,
    price: rawProduct.price ? parseFloat(rawProduct.price) : 0,
    compareAtPrice: rawProduct.compareAtPrice
      ? parseFloat(rawProduct.compareAtPrice)
      : undefined,
    brand: rawProduct.brand,
    images: rawProduct.images || [],
    variants: rawProduct.variants || [],
    categories: rawProduct.categories || [],
  };
};

/**
 * Sort products by price
 */
export const sortProductsByPrice = (
  products: Product[],
  direction: "asc" | "desc"
): Product[] => {
  return [...products].sort((a, b) => {
    if (direction === "asc") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });
};

/**
 * Calculate size counts from products
 */
export const calculateSizeCounts = (
  products: any[]
): Array<{ id: string; count: number }> => {
  const sizeCounts: Record<string, number> = {};

  products.forEach((product) => {
    product.variants?.forEach((variant: any) => {
      if (variant.size && variant.inventory > 0) {
        sizeCounts[variant.size] = (sizeCounts[variant.size] || 0) + 1;
      }
    });
  });

  return Object.entries(sizeCounts)
    .map(([size, count]) => ({ id: size, count }))
    .sort((a, b) => {
      const numA = parseInt(a.id);
      const numB = parseInt(b.id);
      // If both are valid numbers, sort numerically
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.id.localeCompare(b.id);
    });
};

/**
 * Calculate color counts from products
 */
export const calculateColorCounts = (
  products: any[]
): Array<{ id: string; count: number }> => {
  const colorCounts: Record<string, number> = {};

  products.forEach((product) => {
    product.variants?.forEach((variant: any) => {
      if (variant.color && variant.inventory > 0) {
        colorCounts[variant.color] = (colorCounts[variant.color] || 0) + 1;
      }
    });
  });

  return Object.entries(colorCounts)
    .map(([color, count]) => ({ id: color, count }))
    .sort((a, b) => a.id.localeCompare(b.id));
};
