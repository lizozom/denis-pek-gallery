import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "Denis Pek Gallery",
    template: "%s | Denis Pek Gallery"
  },
  description: "Professional photography gallery showcasing the work of Denis Pek. Explore stunning photographs across various categories.",
  keywords: ["photography", "gallery", "Denis Pek", "photos", "art", "portfolio"],
  authors: [{ name: "Denis Pek" }],
  creator: "Denis Pek",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://denispek.com",
    siteName: "Denis Pek Gallery",
    title: "Denis Pek Gallery",
    description: "Professional photography gallery showcasing the work of Denis Pek",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Denis Pek Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Denis Pek Gallery",
    description: "Professional photography gallery showcasing the work of Denis Pek",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
        {children}
      </body>
    </html>
  );
}
