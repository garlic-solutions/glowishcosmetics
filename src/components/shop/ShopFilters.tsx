"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useCallback, useTransition } from "react";
import { FiDroplet, FiStar, FiWind, FiFeather, FiFilter, FiX, FiCheck, FiLoader, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import type { Brand } from "@/types";

const CATEGORIES = [
  { apiId: "SkinCare",  label: "Skin Care",  icon: FiDroplet },
  { apiId: "Fragrance", label: "Fragrance",  icon: FiWind },
  { apiId: "Hair",      label: "Hair",       icon: FiFeather },
  { apiId: "Makeup",    label: "Makeup",     icon: FiStar },
];

interface Props {
  activeCategory?: string;
  activeBrand?: string;
  brands?: Brand[];
  isPending: boolean;
  startTransition: (callback: () => void) => void;
}

export function ShopFilters({ activeCategory, activeBrand, brands = [], isPending, startTransition }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
          if (value === null) params.delete(key);
          else params.set(key, value);
        });
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    updateParams({ search: val || null });
  };

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname);
      setIsOpen(false);
    });
  };

  return (
    <>
      <div className="relative">
        {/* Loading bar */}
        <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -top-4 left-0 right-0 h-0.5 bg-[#333333] origin-left z-20"
            />
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          {/* Quick category filter chips */}
          <div className="flex flex-wrap gap-2">
            <button
              disabled={isPending}
              onClick={() => updateParams({ category: null })}
              className={`px-4 py-2 rounded-none text-sm font-normal tracking-wide transition-colors ${
                !activeCategory
                  ? "bg-[#333333] text-white shadow-sm"
                  : "bg-white text-[#333333] border border-[#333333]/20 hover:bg-gray-50"
              } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              All Products
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.apiId}
                disabled={isPending}
                onClick={() => updateParams({ category: cat.apiId })}
                className={`px-4 py-2 rounded-none text-sm font-normal tracking-wide transition-colors flex items-center gap-1.5 ${
                  activeCategory === cat.apiId
                    ? "bg-[#333333] text-white shadow-sm"
                    : "bg-white text-[#333333] border border-[#333333]/20 hover:bg-gray-50"
                } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <cat.icon className="text-base" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search and Advanced Filter Toggle */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-72">
              <input
                type="search"
                placeholder="Search products..."
                defaultValue={searchParams.get("search") ?? ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch(e as any);
                }}
                onBlur={handleSearch}
                className="border border-[#333333]/20 rounded-none px-5 py-2.5 text-sm font-normal focus:outline-none focus:border-[#333333] bg-white w-full pr-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {isPending ? (
                  <FiLoader className="animate-spin text-lg" />
                ) : (
                  <FiSearch className="text-lg" />
                )}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 border border-[#333333] text-[#333333] text-sm font-medium hover:bg-[#333333] hover:text-white transition-colors"
            >
              <FiFilter className="text-lg" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[101] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-display text-xl text-[#333333]">Filters</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Categories */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#333333]/60 mb-4">Categories</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.apiId}
                        onClick={() => updateParams({ category: cat.apiId })}
                        className={`flex items-center justify-between px-4 py-3 border transition-colors ${
                          activeCategory === cat.apiId
                            ? "border-[#333333] bg-[#333333]/5 text-[#333333]"
                            : "border-gray-100 hover:border-gray-200 text-gray-600"
                        }`}
                      >
                        <span className="text-sm">{cat.label}</span>
                        {activeCategory === cat.apiId && <FiCheck className="text-sm" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#333333]/60 mb-4">Brands</h3>
                  <select
                    value={activeBrand || ""}
                    onChange={(e) => updateParams({ brand: e.target.value || null })}
                    className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#333333] appearance-none bg-no-repeat bg-right"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                  >
                    <option value="">All Brands</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.slug || b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#333333]/60 mb-4">Price Range</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      defaultValue={searchParams.get("minPrice") || ""}
                      onBlur={(e) => updateParams({ minPrice: e.target.value || null })}
                      className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#333333]"
                    />
                    <span className="text-gray-300">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      defaultValue={searchParams.get("maxPrice") || ""}
                      onBlur={(e) => updateParams({ maxPrice: e.target.value || null })}
                      className="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#333333]"
                    />
                  </div>
                </div>

                {/* Options */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#333333]/60 mb-4">Availability</h3>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={searchParams.get("featured") === "true"}
                      onChange={(e) => updateParams({ featured: e.target.checked ? "true" : null })}
                      className="w-4 h-4 accent-[#333333]"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-[#333333] transition-colors">Featured Products Only</span>
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button
                  onClick={clearAll}
                  className="flex-1 py-3 text-sm font-medium border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 text-sm font-medium bg-[#333333] text-white hover:bg-[#444444] transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
