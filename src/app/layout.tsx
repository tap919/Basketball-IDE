import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Basketball to Biotech IDE | Statistical Translation Platform",
  description: "An IDE-like platform that translates NBA basketball statistics into biotech research concepts. Powered by local LLMs for privacy-first analysis.",
  keywords: ["NBA", "basketball", "biotech", "statistics", "IDE", "LLM", "Ollama", "translation", "analytics"],
  authors: [{ name: "Basketball-Biotech Labs" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Basketball to Biotech IDE",
    description: "Translate sports statistics into biotech research concepts",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
