import type { Metadata } from "next";
import "./globals.css";
import { NavWrapper } from "@/components/cuisine/NavWrapper";
import { FooterWrapper } from "@/components/cuisine/FooterWrapper";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://valentincuisine.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Valentin's Cuisine | Aspiring Baker & Pastry Chef — Putney, London",
    template: "%s · Valentin's Cuisine",
  },
  description: "Custom cakes, pastries, and artisan food by Valentin Thang. Based in Putney, London. Weekend and school holiday availability.",
  keywords: ["custom cakes London", "Putney baker", "artisan pastry", "cake orders London", "young chef London", "kimchi London", "handmade kimchi Putney"],
  authors: [{ name: 'Valentin Thang' }],
  creator: 'Valentin Thang',
  applicationName: "Valentin's Cuisine",
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "Valentin's Cuisine",
    description: "Custom cakes, pastries & artisan food by Valentin Thang — Putney, London",
    type: "website",
    url: BASE_URL,
    siteName: "Valentin's Cuisine",
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Valentin's Cuisine",
    description: "Custom cakes, pastries & artisan food by Valentin Thang — Putney, London",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NavWrapper />
        {children}
        <FooterWrapper />
      </body>
    </html>
  );
}
