import { hygraphClient, hygraphSafeRequest } from "@/lib/hygraph";
import { GET_ALL_PRODUCTS, GET_HERO_SLIDES, GET_REVIEWS } from "@/lib/queries";
import { HeroSection } from "@/components/home/HeroSection";
import { MarqueeStrip } from "@/components/home/MarqueeStrip";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CtaBanner } from "@/components/home/CtaBanner";
import type { Product, HeroSlide, Review } from "@/types";

export const revalidate = 60;

async function getProducts(): Promise<Product[]> {
  try {
    const data = await hygraphSafeRequest<{ products: Product[] }>(GET_ALL_PRODUCTS);
    return data.products;
  } catch (err) {
    console.error("Home products fetch failed:", err);
    return [];
  }
}

async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const data = await hygraphSafeRequest<{ heroSlides: HeroSlide[] }>(GET_HERO_SLIDES);
    return data.heroSlides;
  } catch (err) {
    console.error("Home slides fetch failed:", err);
    return [];
  }
}

async function getReviews(): Promise<Review[]> {
  try {
    const data = await hygraphSafeRequest<{ reviews: Review[] }>(GET_REVIEWS);
    return data.reviews;
  } catch (err) {
    console.error("Home reviews fetch failed:", err);
    return [];
  }
}

export default async function HomePage() {
  const [products, heroSlides, reviews] = await Promise.all([
    getProducts(),
    getHeroSlides(),
    getReviews()
  ]);
  const featured = products.filter((p) => p.featured).slice(0, 6);
  const fallback = products.slice(0, 6);

  return (
    <>
      <HeroSection slides={heroSlides} />
      <MarqueeStrip />
      <FeaturedProducts products={featured.length > 0 ? featured : fallback} />
      <CategorySection />
      <MarqueeStrip dark />
      <TestimonialsSection reviews={reviews} />
      <CtaBanner />
    </>
  );
}
