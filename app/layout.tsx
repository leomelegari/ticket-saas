import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import Header from "@/components/header";
import SyncUserWithConvex from "@/components/sync-user-with-convex";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const parkinSans = localFont({
  src: "./fonts/Parkinsans-VariableFont_wght.ttf",
  variable: "--font-parkin-sans",
  weight: "100 200 300 400 500 600 700 800 900",
});

const redHatSans = localFont({
  src: "./fonts/RedHatDisplay-VariableFont_wght.ttf",
  variable: "--font-redhat-sans",
  weight: "100 200 300 400 500 600 700 800 900",
});

const nunitoSans = localFont({
  src: "./fonts/NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf",
  variable: "--font-nunito-sans",
  weight: "100 200 300 400 500 600 700 800 900",
});

export const metadata: Metadata = {
  title: "Event Hive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // needed to suppres the warning, some incompatibility with clerk occurred
    <html suppressHydrationWarning lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          <ClerkProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Header />
              <SyncUserWithConvex />
              <Toaster />
              {children}
            </ThemeProvider>
          </ClerkProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
