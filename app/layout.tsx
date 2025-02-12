import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";

import { ModalProvider } from "@/providers/modal-provider";
import { Navbar } from "@/components/navbar/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pixel Art Editor",
  description: "Made with Tauri v2 & NextJS v15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="h-full w-full pt-7 dark:bg-[#1f1f1f]">
          <TooltipProvider delayDuration={300}>
            <Navbar />
            {children}
            <Toaster
              position="bottom-center"
              theme="light"
              richColors
              pauseWhenPageIsHidden
            />
            <ModalProvider />
          </TooltipProvider>
        </main>
      </body>
    </html>
  );
}
