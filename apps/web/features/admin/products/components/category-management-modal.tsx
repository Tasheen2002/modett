"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Plus, Pencil, Trash2, Check, XCircle } from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/products.api";

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryManagementModal({
  isOpen,
  onClose,
}: CategoryManagementModalProps) {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => getCategories(),
    enabled: isOpen,
  });

  const categories = categoriesData?.data || [];

  const createMutation = useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
        setNewName("");
        setError(null);
      } else {
        setError(result.error || "Failed to create category");
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCategory(id, name),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
        setEditingId(null);
        setEditingName("");
        setError(null);
      } else {
        setError(result.error || "Failed to update category");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
        setError(null);
      } else {
        setError(result.error || "Failed to delete category");
      }
    },
  });

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    createMutation.mutate(trimmed);
  };

  const handleEditStart = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
    setError(null);
  };

  const handleEditSave = () => {
    const trimmed = editingName.trim();
    if (!trimmed || !editingId) return;
    updateMutation.mutate({ id: editingId, name: trimmed });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName("");
    setError(null);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[9999]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2
                className="text-xl font-bold text-[#232D35]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Manage Categories
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 max-h-[60vh]">
            {/* Add New Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Category
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="e.g. Sneakers, Running Shoes..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#232D35]/20 focus:border-[#232D35]"
                  style={{ fontFamily: "Raleway, sans-serif" }}
                />
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim() || createMutation.isPending}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#232D35] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 mb-3">{error}</p>
            )}

            {/* Category List */}
            {isLoading ? (
              <div className="flex items-center justify-center h-24 text-gray-400 text-sm">
                Loading...
              </div>
            ) : categories.length === 0 ? (
              <div className="flex items-center justify-center h-24 text-gray-400 text-sm">
                No categories yet. Add one above.
              </div>
            ) : (
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    {editingId === cat.id ? (
                      <>
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleEditSave();
                            if (e.key === "Escape") handleEditCancel();
                          }}
                          autoFocus
                          className="flex-1 px-2 py-1 border border-[#232D35] rounded text-sm focus:outline-none"
                          style={{ fontFamily: "Raleway, sans-serif" }}
                        />
                        <button
                          onClick={handleEditSave}
                          disabled={updateMutation.isPending}
                          className="p-1 text-green-600 hover:text-green-700 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span
                          className="flex-1 text-sm text-[#232D35] font-medium"
                          style={{ fontFamily: "Raleway, sans-serif" }}
                        >
                          {cat.name}
                        </span>
                        <button
                          onClick={() => handleEditStart(cat.id, cat.name)}
                          className="p-1 text-gray-400 hover:text-[#232D35] transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          disabled={deleteMutation.isPending}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-white bg-[#232D35] rounded-lg hover:bg-black transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
