// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ScrollToTopButton from "./components/ScrollToTopButton";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});






// export const metadata = {
//   title: 'Kuppi Hub - Study Smarter, Together!',
//   description: 'Student-made tutorials to help you study smarter.',
//   keywords: 'study, student help, peer learning, tutorials, exam tips, student platform, education, Kuppi Hub',
//   openGraph: {
//     title: 'Kuppi Hub - Study Smarter, Together!',
//     description: 'A student-driven platform with peer-made resources to help you succeed in your studies.',
//     url: 'https://kuppihub.cse23.org',
//     type: 'website',
//     images: [
//       {
//         url: 'https://kuppihub.cse23.org/logo.png',
//         width: 100,
//         height: 100,
//       },
//     ],
//   },
//   twitter: {
//     card: 'summary',
//     title: 'Kuppi Hub - Study Smarter, Together!',
//     description: 'Peer tutorials and study help by students, for students.',
//     images: ['https://kuppihub.cse23.org/logo.png'],
//   },
// };














export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>


     <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}>
  <Header />
  
  <main className="flex-1">
    <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
  </main>

  <Footer />
  <ScrollToTopButton />
</body>

    </html>
  );
}
