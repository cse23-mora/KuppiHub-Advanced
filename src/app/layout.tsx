import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
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
     <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}>
  <Header />
  
  <main className="flex-1">
    <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
  </main>

  <Footer />
</body>

    </html>
  );
}
