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
            <SignedIn>
              <SyncUser />
            </SignedIn>
            {children}
          </QueryProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
