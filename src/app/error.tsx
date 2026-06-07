"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-pink-50/30 flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="text-7xl sm:text-8xl mb-6 select-none animate-bounce">🥀</div>
      <p className="text-[#835a71] tracking-widest uppercase text-xs font-semibold mb-2">System Alert</p>
      <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-wide text-[#333333] mb-4">
        Something Went Wrong
      </h1>
      <p className="text-gray-500 text-sm sm:text-base mb-8 max-w-md leading-relaxed font-light">
        We ran into an unexpected error while loading this page. Our team has been notified.
        Please try again or head back to our store.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center">
        <button
          onClick={() => reset()}
          className="btn-primary text-xs tracking-widest px-8 py-3.5"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="btn-outline bg-white text-xs tracking-widest px-8 py-3.5 text-center"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
