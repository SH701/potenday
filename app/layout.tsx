"use client";

import "./globals.css";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import SyncUser from "@/components/etc/SyncUser";
import { Providers } from "./providers";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return (
    <ClerkProvider>
      <html lang="ko">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#ffffff" />
        </head>
        <body className="antialiased">
          <Providers>
            <SignedIn>
              <SyncUser />
            </SignedIn>
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
