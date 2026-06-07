"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical root error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-pink-50/30 flex flex-col items-center justify-center text-center px-4 py-16 font-sans text-[#333333]">
        <div className="text-7xl sm:text-8xl mb-6 select-none animate-pulse">🥀</div>
        <p className="text-[#835a71] tracking-widest uppercase text-xs font-semibold mb-2">Critical System Error</p>
        <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-wide text-[#333333] mb-4">
          A Fatal Error Occurred
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mb-8 max-w-md leading-relaxed font-light font-sans">
          A critical system error occurred and the application had to halt.
          Please try reloading the application.
        </p>
        <button
          onClick={() => reset()}
          className="bg-[#333333] hover:bg-[#1a1a1a] text-white font-normal tracking-widest uppercase text-xs px-8 py-3.5 rounded-none transition-all duration-200 shadow-sm active:scale-95"
        >
          Reload Application
        </button>
      </body>
    </html>
  );
}
