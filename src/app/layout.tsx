import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import HeaderSearch from "./dashboard/components/HeaderSearch";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KuppiHub - Student Learning Management",
  description: "Manage your academic modules and kuppi videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {/* Header */}
       <header className="p-4 bg-white shadow flex items-center justify-between">
  <h1 className="font-bold text-xl">KuppiHub</h1>
  <HeaderSearch />
</header>
        {/* Main content */}
        <main>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </main>
      </body>
    </html>
  );
}
