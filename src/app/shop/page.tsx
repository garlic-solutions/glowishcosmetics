import { hygraphClient, hygraphSafeRequest } from "@/lib/hygraph";
import { GET_ALL_PRODUCTS, GET_ALL_BRANDS } from "@/lib/queries";
import { ProductCard } from "@/components/ui/ProductCard";
import { ShopFilters } from "@/components/shop/ShopFilters";
import type { Product, Brand } from "@/types";
import { ShopContainer } from "@/components/shop/ShopContainer";

export const revalidate = 60;

async function getProducts(): Promise<Product[]> {
  try {
    const data = await hygraphSafeRequest<{ products: Product[] }>(GET_ALL_PRODUCTS);
    return data.products;
  } catch (err) {
    console.error("Shop products fetch failed:", err);
    return [];
  }
}

async function getBrands(): Promise<Brand[]> {
  try {
    const data = await hygraphSafeRequest<{ brands: Brand[] }>(GET_ALL_BRANDS);
    return data.brands;
  } catch (err) {
    console.error("Shop brands fetch failed:", err);
    return [];
  }
}

export default async function ShopPage() {
  const [allProducts, allBrands] = await Promise.all([getProducts(), getBrands()]);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-[#333333]/10 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="section-title">Our Products</h1>
          <p className="section-subtitle mb-0">
            {allProducts.length} product{allProducts.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      <ShopContainer allProducts={allProducts} allBrands={allBrands} />
    </div>
  );
}
