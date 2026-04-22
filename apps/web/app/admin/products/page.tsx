"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ProductsTable,
  ProductFormModal,
  CategoryManagementModal,
  DashboardHeader,
  getProducts,
  getCategories,
  type AdminProduct,
  type ProductFilters,
} from "@/features/admin";
import { Plus, Tags } from "lucide-react";

// ============================================================================
// PRODUCTS PAGE COMPONENT
// ============================================================================

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    null
  );
  // Placeholder for modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Fetch products with React Query
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    refetch,
  } = useQuery({
    queryKey: ["admin-products", filters],
    queryFn: () => getProducts(filters),
    placeholderData: (previousData) => previousData,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch categories for filters
  const { data: categoriesData } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => getCategories(),
  });

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleEditProduct = (product: AdminProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleProductUpdated = () => {
    refetch();
  };

  return (
    <div className="space-y-6 max-w-[1600px]">
      <DashboardHeader
        title="Product Management"
        subtitle="Manage your product catalog, inventory, and collections"
        searchTerm={filters.search}
        onSearchChange={(term) =>
          handleFilterChange({ ...filters, search: term, page: 1 })
        }
        searchPlaceholder="Search products by name or brand..."
      >
        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#232D35] border border-[#232D35] rounded-xl hover:bg-[#F8F5F2] transition-all shadow-sm whitespace-nowrap"
          style={{ fontFamily: "Raleway, sans-serif" }}
        >
          <Tags className="w-4 h-4 shrink-0" />
          <span className="font-medium">Manage Categories</span>
        </button>
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#232D35] text-white rounded-xl hover:bg-black transition-all shadow-sm whitespace-nowrap"
          style={{ fontFamily: "Raleway, sans-serif" }}
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className="font-medium">Add Product</span>
        </button>
      </DashboardHeader>

      {/* Products Table */}
      <ProductsTable
        products={productsData?.data?.products || []}
        categories={categoriesData?.data || []}
        isLoading={isLoadingProducts}
        pagination={{
          total: productsData?.data?.total || 0,
          page: productsData?.data?.page || 1,
          limit: productsData?.data?.limit || 20,
        }}
        filters={filters}
        onFilterChange={handleFilterChange}
        onEditProduct={handleEditProduct}
      />

      {/* Category Management Modal */}
      <CategoryManagementModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      {/* Product Add/Edit Modal */}
      <ProductFormModal
        product={selectedProduct}
        isOpen={isModalOpen}
        categories={categoriesData?.data || []}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleProductUpdated}
      />
    </div>
  );
}
