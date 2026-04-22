"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Printer } from "lucide-react";
import JsBarcode from "jsbarcode";
import type { ProductVariant } from "../types/product.types";

interface BarcodePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  variants: ProductVariant[];
  productName: string;
}

function BarcodeCard({
  variant,
  productName,
}: {
  variant: ProductVariant;
  productName: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Build human-readable variant label
  const variantLabel = (() => {
    const parts: string[] = [];
    if (variant.color) parts.push(variant.color);
    if (variant.size) parts.push(`Size ${variant.size}`);
    if (parts.length === 0) return "Default";
    const label = parts.join(" / ");
    return label.length > 25 ? label.substring(0, 22) + "..." : label;
  })();

  // Prefer the dedicated barcode field (short numeric); fall back to SKU
  const barcodeValue = variant.barcode || variant.sku;
  const isNumeric = /^\d+$/.test(barcodeValue);
  const format = isNumeric && barcodeValue.length === 13
    ? "EAN13"
    : isNumeric && barcodeValue.length === 12
    ? "UPC"
    : "CODE128";

  useEffect(() => {
    if (svgRef.current && barcodeValue) {
      try {
        JsBarcode(svgRef.current, barcodeValue, {
          format,
          width: 1,
          height: 50,
          displayValue: true,
          fontSize: 10,
          margin: 6,
          background: "#ffffff",
          lineColor: "#000000",
          textMargin: 2,
        });
      } catch (e) {
        console.error("Barcode generation failed:", barcodeValue, e);
      }
    }
  }, [barcodeValue, format]);

  return (
    <div className="barcode-card flex flex-col items-center border border-gray-200 rounded-lg px-3 pt-3 pb-3 bg-white">
      {/* Variant label - human readable */}
      <p className="text-xs font-semibold text-gray-700 mb-0.5 text-center">
        {variantLabel}
      </p>
      <p className="text-[10px] text-gray-400 mb-2 text-center truncate w-full">
        {productName.length > 28
          ? productName.substring(0, 25) + "..."
          : productName}
      </p>

      {/* Barcode SVG */}
      <div className="w-full flex items-center justify-center">
        <svg ref={svgRef} />
      </div>

      {/* Show which value is encoded */}
      {variant.barcode && (
        <p className="text-[9px] text-gray-300 mt-1">barcode field</p>
      )}
    </div>
  );
}

export function BarcodePreviewModal({
  isOpen,
  onClose,
  variants,
  productName,
}: BarcodePreviewModalProps) {
  const handlePrint = () => {
    window.print();
  };

  // Close on Escape key + lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validVariants = variants.filter((v) => v.barcode || v.sku);

  return createPortal(
    <>
      {/* Print styles - only barcodes visible when printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            padding: 20px;
          }
          .barcode-card {
            break-inside: avoid;
            page-break-inside: avoid;
            border: 1px solid #ccc !important;
            margin: 8px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[9999] no-print"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 no-print">
            <div>
              <h2
                className="text-xl font-bold text-[#232D35]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Barcode Preview
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {productName} &mdash;{" "}
                <span className="font-medium">{validVariants.length}</span>{" "}
                variant{validVariants.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barcode Grid - scrollable */}
          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-2">
            {validVariants.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <p className="text-base font-medium">
                  No variants with SKU found
                </p>
                <p className="text-sm mt-1">
                  Add a SKU to variants to generate barcodes
                </p>
              </div>
            ) : (
              <div className="print-area">
                {/* Print header - only visible when printing */}
                <div className="hidden print:block mb-6">
                  <h1 className="text-lg font-bold">
                    {productName} — Barcodes
                  </h1>
                  <p className="text-sm text-gray-500">
                    Printed on {new Date().toLocaleDateString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {validVariants.map((variant) => (
                    <BarcodeCard
                      key={variant.id}
                      variant={variant}
                      productName={productName}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl no-print">
            <p className="text-xs text-gray-400">
              Scan barcode to retrieve variant by SKU
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                disabled={validVariants.length === 0}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#232D35] rounded-lg hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Printer className="w-4 h-4" />
                Print All
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
