import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DevClock } from "@/components/DevClock";
import { FlashToast } from "@/components/FlashToast";
import { GameBoot } from "@/components/GameBoot";
import { Nav } from "@/components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Observer Effect",
  description: "Predict what happens next. Win tokens. Top 3 each month win cash.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-observed focus:px-3 focus:py-2 focus:text-on-observed"
        >
          Skip to content
        </a>
        <GameBoot />
        <Nav />
        <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
          {children}
        </main>
        <DevClock />
        <FlashToast />
      </body>
    </html>
  );
}
