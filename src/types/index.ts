export interface ProductImage {
  url: string;
  width?: number;
  height?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  code: string;
  description?: { html: string };
  tags: string[];
  price?: number;
  image?: ProductImage;
  featured?: boolean;
  category?: string;
  brand?: Brand;
  gallery?: ProductImage[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderInput {
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  productIds: string[];
  customerEmail?: string;
  discountApplied?: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  mobile: string;
}

export interface WebsiteSettings {
  title: string;
  aboutContent?: { html: string };
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  headerImage?: { url: string };
  fburl?: string;
  instaUrl?: string;
  tiktokUrl?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  url: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
}
export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  userImage?: { url: string };
  product?: { name: string };
}
