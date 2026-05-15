import type { Metadata } from "next";
import "./globals.css";
import { NavWrapper } from "@/components/cuisine/NavWrapper";
import { FooterWrapper } from "@/components/cuisine/FooterWrapper";

export const metadata: Metadata = {
  title: "Valentin's Cuisine | Aspiring Baker & Pastry Chef — Putney, London",
  description: "Custom cakes, pastries, and artisan food by Valentin Thang. Based in Putney, London. Weekend and school holiday availability.",
  keywords: ["custom cakes London", "Putney baker", "artisan pastry", "cake orders London", "young chef London"],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "Valentin's Cuisine",
    description: "Custom cakes, pastries & artisan food by Valentin Thang — Putney, London",
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
      <body>
        <NavWrapper />
        {children}
        <FooterWrapper />
      </body>
    </html>
  );
}
