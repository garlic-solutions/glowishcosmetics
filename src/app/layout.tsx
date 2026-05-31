import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/providers/Providers";
import { Toaster } from "react-hot-toast";
import { hygraphClient, hygraphSafeRequest } from "@/lib/hygraph";
import { GET_WEBSITE_SETTINGS } from "@/lib/queries";
import type { WebsiteSettings } from "@/types";

export const revalidate = 60;

async function getSettings(): Promise<WebsiteSettings | null> {
  try {
    const data = await hygraphSafeRequest<any>(GET_WEBSITE_SETTINGS);
    const settings = data.websiteSettings?.[0] || data.websiteSetting || null;
    return settings;
  } catch (error) {
    console.error("Layout settings fetch failed:", error);
    return null;
  }
}

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteTitle = settings?.title || "Glowish Cosmetics";
  const siteDescription = "Discover premium, authentic Korean cosmetics imported directly to Sri Lanka. Shop clean, vegan, and glow-inducing makeup and skincare collections crafted for every skin type with reliable delivery across Sri Lanka. Make yourself beautiful.";
  
  const baseUrl = process.env.NEXTAUTH_URL 
    ? (process.env.NEXTAUTH_URL.startsWith("http") ? process.env.NEXTAUTH_URL : `https://${process.env.NEXTAUTH_URL}`)
    : "http://localhost:3000";

  return {
    title: {
      default: `${siteTitle} | Make yourself beautiful`,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    keywords: [
      "glowish cosmetics",
      "korean beauty",
      "k-beauty",
      "skincare",
      "makeup",
      "fragrance",
      "vegan cosmetics",
      "clean beauty",
      "korean makeup",
      "korean cosmetics Sri Lanka",
      "buy korean skincare Sri Lanka",
      "authentic k-beauty Sri Lanka",
      "glowish cosmetics Sri Lanka",
      "korean makeup Sri Lanka",
      "sri lanka skincare shop",
    ],
    authors: [{ name: siteTitle }],
    creator: siteTitle,
    publisher: siteTitle,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      ],
      shortcut: "/favicon.ico",
      apple: "/images/logo/logo.webp",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      title: `${siteTitle} | Make yourself beautiful`,
      description: siteDescription,
      siteName: siteTitle,
      images: [
        {
          url: "/images/logo/logo.webp",
          width: 800,
          height: 600,
          alt: `${siteTitle} Logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteTitle} | Make yourself beautiful`,
      description: siteDescription,
      images: ["/images/logo/logo.webp"],
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar title={settings?.title} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "font-sans",
              style: {
                background: "#ffffff",
                color: "#333333",
                border: "1px solid rgba(51, 51, 51, 0.1)",
                borderRadius: "0px",
                padding: "12px 20px",
                fontSize: "14px",
                letterSpacing: "0.025em",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              },
              success: {
                iconTheme: {
                  primary: "#333333",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
