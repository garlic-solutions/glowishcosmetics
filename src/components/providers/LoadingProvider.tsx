"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const LoadingContext = createContext({
  loading: false,
  setLoading: (val: boolean) => {},
});

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true); // Enable loading on initial mount
  const pathname = usePathname();

  // 1. Initial Page Load and Pathname Change Handler
  useEffect(() => {
    // Keep the loading screen visible for a short, premium transition duration
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timeout);
  }, [pathname]);

  // 2. Global Link Click Listener to trigger transition
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      try {
        const target = event.target as HTMLElement;
        const anchor = target.closest("a");

        if (!anchor) return;

        const href = anchor.getAttribute("href");
        const targetAttr = anchor.getAttribute("target");

        // Ignore external links, hash-links, mails, phone numbers, target="_blank", or keyboard mod-keys
        if (
          !href ||
          href.startsWith("#") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:") ||
          targetAttr === "_blank" ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.button !== 0 // Only handle regular left-clicks
        ) {
          return;
        }

        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(href, window.location.href);

        // Verify same origin
        if (currentUrl.origin !== targetUrl.origin) {
          return;
        }

        // Ignore if clicking on exact same path with same search parameters
        if (
          currentUrl.pathname === targetUrl.pathname &&
          currentUrl.search === targetUrl.search
        ) {
          return;
        }

        // Trigger transition screen
        setLoading(true);
      } catch (err) {
        // Fallback safety
      }
    };

    const handlePopState = () => {
      setLoading(true);
    };

    document.addEventListener("click", handleAnchorClick);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {/* Full-screen loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-[99999] flex flex-col items-center justify-center transition-all duration-300 animate-fade-in">
          <div className="flex flex-col items-center gap-6">
            {/* Premium Fading Brand Logo */}
            <div className="relative w-28 h-28 animate-float">
              <Image
                src="/images/logo/logo.webp"
                alt="Glowish Cosmetics"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            {/* Elegant Circular Spinner with Pink Accent */}
            <div className="relative w-12 h-12 flex items-center justify-center mt-2">
              <div className="absolute inset-0 rounded-full border-2 border-pink-100"></div>
              <div className="absolute inset-0 rounded-full border-2 border-t-pink-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            </div>

            {/* Glowing Brand Tagline */}
            <p className="font-display tracking-[0.3em] uppercase text-[10px] text-gray-400 font-semibold animate-pulse mt-2">
              Beauty That Blooms
            </p>
          </div>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
}
