"use client";
import { useState, useTransition, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ShopFilters } from "./ShopFilters";
import { ProductCard } from "../ui/ProductCard";
import type { Product, Brand } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { FiLoader } from "react-icons/fi";

interface Props {
  allProducts: Product[];
  allBrands: Brand[];
}

export function ShopContainer({ allProducts, allBrands }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const category = searchParams.get("category");
  const search = searchParams.get("search")?.toLowerCase();
  const brand = searchParams.get("brand");
  const minPrice = parseFloat(searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999");
  const featuredOnly = searchParams.get("featured") === "true";

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesCategory = !category || p.category === category;
      const matchesBrand = !brand || p.brand?.slug === brand || p.brand?.name === brand;
      const productPrice = p.price ?? 0;
      const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;
      const matchesFeatured = !featuredOnly || p.featured;
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search) ||
        p.code?.toLowerCase().includes(search) ||
        p.tags?.some((t) => t.toLowerCase().includes(search));
      
      return matchesCategory && matchesSearch && matchesBrand && matchesPrice && matchesFeatured;
    });
  }, [allProducts, category, search, brand, minPrice, maxPrice, featuredOnly]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ShopFilters 
        activeCategory={category || undefined} 
        activeBrand={brand || undefined} 
        brands={allBrands}
        isPending={isPending}
        startTransition={startTransition}
      />

      <div className="relative mt-8 min-h-[400px]">
        {/* Loading Overlay */}
        <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-3">
                <FiLoader className="text-4xl text-[#333333] animate-spin" />
                <p className="text-sm font-medium tracking-widest uppercase text-[#333333]">Refreshing...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length > 0 ? (
          <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 transition-opacity duration-300 ${isPending ? 'opacity-30' : 'opacity-100'}`}>
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-300">
            <p className="text-5xl mb-4">✨</p>
            <p className="text-xl font-display font-normal tracking-wide text-[#333333]">No products found</p>
            <p className="text-sm mt-2 text-gray-500 font-light">Try a different category or search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
