"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiShoppingCart, FiPlus, FiMinus } from "react-icons/fi";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import type { Product } from "@/types";
import { lkr, usdLabel } from "@/lib/currency";

const CATEGORY_LABELS: Record<string, string> = {
  SkinCare: "Skin Care",
  Fragrance: "Fragrance",
  Hair: "Hair",
  Makeup: "Makeup",
};

const CATEGORY_COLORS: Record<string, string> = {
  SkinCare: "bg-[#fff0f5] text-[#333333]",
  Fragrance: "bg-fuchsia-100 text-fuchsia-600",
  Hair: "bg-purple-100 text-purple-600",
  Makeup: "bg-[#fff0f5] text-[#333333]",
};

interface Props {
  product: Product;
  hideAddToCart?: boolean;
}

export function ProductCard({ product, hideAddToCart }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, qty);
    toast.success(`${product.name} ×${qty} added to cart!`);
    setQty(1);
  };

  const categoryLabel = product.category ? CATEGORY_LABELS[product.category] ?? product.category : null;
  const categoryColor = product.category ? CATEGORY_COLORS[product.category] ?? "bg-[#fff0f5] text-[#333333]" : "";

  return (
    <div className="card group animate-fade-in">
      {/* Image */}
      <Link href={`/shop/${product.slug}`} className="block relative h-48 sm:h-56 bg-gray-50 overflow-hidden">
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            <span>🌸</span>
          </div>
        )}
        {categoryLabel && (
          <div className="absolute top-2 left-2">
            <span className={`text-[10px] font-normal tracking-wider uppercase px-2.5 py-1 rounded-none ${categoryColor}`}>
              {categoryLabel}
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs text-gray-400 font-mono truncate">{product.code}</p>
          {product.brand && (
            <p className="text-xs text-[#835a71]/80 font-mono truncate">· {product.brand.name}</p>
          )}
        </div>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-normal text-gray-800 hover:text-[#333333] transition-colors leading-snug mb-2 line-clamp-2 text-sm sm:text-base tracking-wide">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        {product.price != null ? (
          <div className="mb-3">
            <span className="font-medium text-[#333333] text-base sm:text-lg tracking-wide">{lkr(product.price)}</span>
            <span className="ml-1.5 text-xs text-gray-400">({usdLabel(product.price)})</span>
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic mb-3">On request</p>
        )}

        {/* Qty stepper + Add */}
        {!hideAddToCart && (
          <div className="flex items-center gap-2 mt-5">
            <div className="flex items-center border border-[#333333]/20 rounded-none overflow-hidden h-10 sm:h-11">
              <button
                onClick={(e) => { e.preventDefault(); setQty((q) => Math.max(1, q - 1)); }}
                className="px-3 h-full flex items-center justify-center text-[#333333] hover:bg-gray-100 transition-colors"
                aria-label="Decrease quantity"
              >
                <FiMinus className="text-xs" />
              </button>
              <span className="px-2 text-sm font-normal text-gray-700 min-w-[1.5rem] text-center">{qty}</span>
              <button
                onClick={(e) => { e.preventDefault(); setQty((q) => q + 1); }}
                className="px-3 h-full flex items-center justify-center text-[#333333] hover:bg-gray-100 transition-colors"
                aria-label="Increase quantity"
              >
                <FiPlus className="text-xs" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex-1 flex items-center justify-center gap-1.5 btn-primary !px-3 h-10 sm:h-11 !py-0 text-xs sm:text-sm"
            >
              <FiShoppingCart className="text-sm" />
              <span>Add</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
