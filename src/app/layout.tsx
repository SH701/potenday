<<<<<<< HEAD
import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import SyncUser from "@/components/etc/SyncUser";
import { QueryProviders } from "./providers";

export const metadata: Metadata = {
  title: "SeoulCourse",
  description: "서울 여행 코스 추천 앱",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ko">
        <body className={` antialiased `}>
          <QueryProviders>
=======
import "./globals.css";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import SyncUser from "@/src/components/etc/SyncUser";
import { Providers } from "./providers";
import { SWRegister } from "./sw-register";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ko">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icons/icon-180.png" />
          <meta name="theme-color" content="#ffffff" />
        </head>
        <body className="antialiased">
          <Providers>
>>>>>>> 55c74ae (Refactor: 폴더 구조 정리)
            <SignedIn>
              <SyncUser />
            </SignedIn>
            {children}
<<<<<<< HEAD
          </QueryProviders>
=======
            <SWRegister />
          </Providers>
>>>>>>> 55c74ae (Refactor: 폴더 구조 정리)
        </body>
      </html>
    </ClerkProvider>
  );
}
