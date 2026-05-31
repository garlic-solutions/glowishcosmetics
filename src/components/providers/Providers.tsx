"use client";
import { SessionProvider } from "next-auth/react";
import { SecurityProvider } from "./SecurityProvider";
import { LoadingProvider } from "./LoadingProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LoadingProvider>
        <SecurityProvider>{children}</SecurityProvider>
      </LoadingProvider>
    </SessionProvider>
  );
}


