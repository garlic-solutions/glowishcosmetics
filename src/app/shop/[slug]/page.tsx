import { hygraphClient, hygraphSafeRequest } from "@/lib/hygraph";
import { GET_PRODUCT_BY_SLUG, GET_ALL_PRODUCTS } from "@/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { ProductGallery } from "@/components/ui/ProductGallery";
import { FiTag } from "react-icons/fi";
import type { Product } from "@/types";
import { lkr, usdLabel } from "@/lib/currency";

export async function generateStaticParams() {
  try {
    const data = await hygraphSafeRequest<{ products: { slug: string }[] }>(GET_ALL_PRODUCTS);
    return data.products.map((p) => ({ slug: p.slug }));
  } catch (err) {
    console.error("Static params fetch failed:", err);
    return [];
  }
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const data = await hygraphSafeRequest<{ product: Product }>(GET_PRODUCT_BY_SLUG, { slug });
    return data.product ?? null;
  } catch (err) {
    console.error("Product fetch failed:", err);
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) return notFound();

  const categoryLabel = product.category ? {
    SkinCare: "Skin Care",
    Fragrance: "Fragrance",
    Hair: "Hair",
    Makeup: "Makeup",
  }[product.category] || product.category : null;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-gray-400 mb-8 font-medium">
          <Link href="/shop" className="hover:text-[#333333] transition-colors">Shop</Link>
          {categoryLabel && (
            <>
              <span className="text-[8px] opacity-50">/</span>
              <Link 
                href={`/shop?category=${product.category}`} 
                className="hover:text-[#333333] transition-colors"
              >
                {categoryLabel}
              </Link>
            </>
          )}
          <span className="text-[8px] opacity-50">/</span>
          <span className="text-[#333333] truncate max-w-[150px] sm:max-w-none">{product.name}</span>
        </nav>

        <div className="bg-white rounded-none border border-[#333333]/10 shadow-sm overflow-hidden grid md:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="w-full flex">
            <ProductGallery 
              thumbnail={product.image} 
              gallery={product.gallery} 
              productName={product.name} 
            />
          </div>

          {/* Details */}
          <div className="p-8 flex flex-col justify-center">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags?.map((tag) => (
                <span key={tag} className="tag-badge">{tag}</span>
              ))}
            </div>

            <div className="flex flex-col gap-1.5 mb-2">
              {product.brand && (
                <Link
                  href={`/shop?brand=${product.brand.slug || product.brand.name}`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#835a71] font-medium tracking-wide uppercase hover:underline w-fit"
                >
                  <FiTag className="text-[11px]" />
                  <span>{product.brand.name}</span>
                </Link>
              )}
              <p className="text-xs text-gray-400 font-mono mb-1">{product.code}</p>
            </div>
            <h1 className="font-display text-3xl font-normal tracking-wide text-[#333333] mb-4">{product.name}</h1>

            {product.price != null && (
              <div className="mb-4">
                <p className="text-2xl font-medium tracking-wide text-[#333333]">{lkr(product.price)}</p>
                <p className="text-sm text-gray-400 mt-0.5">{usdLabel(product.price)} USD</p>
              </div>
            )}
          </div>
        </div>

        {product.description?.html && (
          <div className="mt-8 bg-white p-8 sm:p-12 border border-[#333333]/10 shadow-sm">
            <h2 className="font-display text-xl font-normal tracking-wide text-[#333333] mb-6">Description</h2>
            <div
              className="text-gray-600 font-light tracking-wide text-sm leading-relaxed prose prose-stone max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description.html }}
            />
          </div>
        )}
        
        {/* Spacer for bottom bar */}
        <div className="h-24"></div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#333333]/10 p-3 sm:p-4 z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <h3 className="text-sm font-medium text-[#333333] truncate max-w-xs">{product.name}</h3>
            {product.price != null && (
              <p className="text-xs text-gray-500 font-medium mt-0.5">{lkr(product.price)}</p>
            )}
          </div>
          <div className="flex gap-3 w-full sm:w-auto justify-center">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
