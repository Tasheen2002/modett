"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useWishlistId, useWishlistItems } from "@/features/engagement/queries";
import { WishlistProductCard } from "@/features/engagement/components/wishlist-product-card";
import { BackToAccountLink } from "@/features/account/components/shared/back-to-account-link";
import { AccountSidebar } from "@/features/account/components/shared/account-sidebar";

interface WishlistItemWithProduct {
  variantId: string;
  product: any;
  variant: any;
}

export default function WishlistPage() {
  const router = useRouter();
  const { wishlistId, isInitializing } = useWishlistId();
  const {
    data: wishlistItems,
    isLoading: isLoadingItems,
    refetch,
  } = useWishlistItems(wishlistId);
  const [itemsWithProducts, setItemsWithProducts] = useState<
    WishlistItemWithProduct[]
  >([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Process enriched wishlist items from backend
  useEffect(() => {
    if (!wishlistItems || wishlistItems.length === 0) {
      setItemsWithProducts([]);
      return;
    }

    setIsLoadingProducts(true);
    try {
      const processedItems = wishlistItems.map((item: any) => ({
        variantId: item.variantId,
        product: item.product,
        variant: item.variant,
      }));

      setItemsWithProducts(processedItems);
    } catch (error) {
      console.error("Failed to process wishlist items:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [wishlistItems]);

  const handleRemoveItem = () => {
    refetch();
  };

  const isLoading = isInitializing || isLoadingItems || isLoadingProducts;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#232D35]" />
          <p
            className="text-[14px] text-[#232D35]"
            style={{ fontFamily: "Raleway, sans-serif" }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#EFECE5]">
      {/* Top Strip - Back Link */}
      <div className="w-full flex justify-center border-t border-b border-[#C3B0A5]/30">
        <div className="w-full max-w-[1440px] px-4 md:px-[60px] py-[32px]">
          <BackToAccountLink />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-[60px] pt-[56px] pb-20">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-12">
          {/* Left Sidebar */}
          <AccountSidebar />

          {/* Right Content */}
          <div className="flex-1 max-w-[745px]">
            <h1
              className="text-[24px] font-normal text-[#765C4D] mb-8"
              style={{ fontFamily: "Raleway, sans-serif" }}
            >
              Wishlist
            </h1>

            <div className="bg-[#FBF9F6] p-8 min-h-[400px]">
              <div className="mb-6">
                <p
                  className="text-[14px] text-[#765C4D]"
                  style={{ fontFamily: "Raleway, sans-serif" }}
                >
                  You have collected {itemsWithProducts.length} product/s in your
                  Wishlist.
                </p>
              </div>

              {/* Empty State */}
              {!itemsWithProducts || itemsWithProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <p
                    className="text-[14px] text-[#888888] mb-8"
                    style={{ fontFamily: "Raleway, sans-serif" }}
                  >
                    Your wishlist is currently empty.
                  </p>
                  <button
                    onClick={() => router.push("/collections")}
                    className="h-[48px] px-8 bg-[#232D35] text-white text-[12px] uppercase tracking-widest hover:bg-[#3E4851] transition-colors"
                    style={{ fontFamily: "Raleway, sans-serif" }}
                  >
                    START SHOPPING
                  </button>
                </div>
              ) : (
                /* Products Grid */
                <div className="space-y-4">
                  {itemsWithProducts.map((item) => {
                    const product = item.product;
                    const variant = item.variant;

                    if (!product || !variant) return null;

                    // Extract image from media array
                    let imageUrl = "/images/products/product-1.jpg";

                    if (
                      product.media &&
                      Array.isArray(product.media) &&
                      product.media.length > 0
                    ) {
                      const firstMedia = product.media[0];
                      if (firstMedia?.asset?.storageKey) {
                        imageUrl = firstMedia.asset.storageKey;
                      }
                    }

                    const productPrice =
                      typeof product.price === "number"
                        ? product.price
                        : parseFloat(String(product.price)) || 0;

                    return (
                      <WishlistProductCard
                        key={item.variantId}
                        wishlistId={wishlistId!}
                        variantId={item.variantId}
                        productId={product.id}
                        slug={product.slug}
                        title={product.title}
                        price={productPrice}
                        image={imageUrl}
                        variant={{
                          id: variant.id,
                          size: variant.size,
                          color: variant.color,
                          sku: variant.sku || "N/A",
                          inventory: variant.onHand || 0,
                        }}
                        allVariants={[]}
                        material={item.product?.material}
                        onRemove={handleRemoveItem}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
