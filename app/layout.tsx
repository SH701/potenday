import "./globals.css";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import SyncUser from "@/components/etc/SyncUser";
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
          <meta name="theme-color" content="#ffffff" />
        </head>
        <body className="antialiased">
          <Providers>
            <SignedIn>
              <SyncUser />
            </SignedIn>
            {children}
            <SWRegister />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
