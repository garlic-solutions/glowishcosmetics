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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteTitle = settings?.title || "Glowish Cosmetics";

  return {
    title: `${siteTitle} | Beauty That Blooms`,
    description: "Discover premium Korean cosmetics crafted for every skin type.",
    icons: {
      icon: "/images/favicon.ico",
    },
    openGraph: {
      title: siteTitle,
      description: "Beauty That Blooms",
      type: "website",
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
