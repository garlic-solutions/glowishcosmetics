import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Product } from "@/types";

interface Props {
  products: Product[];
}

export function FeaturedProducts({ products }: Props) {
  return (
    <section className="py-12 sm:py-20 bg-[#fff0f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <p className="text-[#333333]/60 tracking-widest uppercase text-xs font-normal mb-2">Bestsellers</p>
            <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-wide text-[#333333]">
              Our Most Loved Essentials
            </h2>
          </div>
          <Link href="/shop" className="flex items-center gap-2 text-[#333333] font-normal tracking-widest uppercase text-xs hover:gap-3 transition-all">
            Shop All <span>→</span>
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((p) => <ProductCard key={p.id} product={p} hideAddToCart />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-none border border-[#333333]/5 overflow-hidden shadow-sm animate-pulse">
                <div className="h-44 sm:h-56 bg-gray-200" />
                <div className="p-3 sm:p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:mt-12">
          <Link href="/shop" className="btn-primary bg-[#333333] inline-flex items-center gap-2">
            View Full Collection <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
