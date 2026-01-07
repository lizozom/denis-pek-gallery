import "./globals.css";
import { headers } from "next/headers";
import {  Cormorant_Garamond, Inter } from "next/font/google";


const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("x-invoke-path") || "";

  // Admin routes are always LTR
  const isAdmin = pathname.startsWith("/admin");

  // Extract locale from pathname (e.g., /he/... or /en/...)
  const localeMatch = pathname.match(/^\/?(he|en)/);
  const locale = isAdmin ? "en" : (localeMatch ? localeMatch[1] : "he");
  const dir = isAdmin ? "ltr" : (locale === "he" ? "rtl" : "ltr");

  return (
    <html lang={locale} dir={dir}>
      <body className={`${cormorantGaramond.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
