import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Valentin's Cuisine | Aspiring Baker & Pastry Chef — Putney, London",
  description: "Custom cakes, pastries, and artisan food by Valentin Thang. Based in Putney, London. Weekend and school holiday availability.",
  keywords: ["custom cakes London", "Putney baker", "artisan pastry", "cake orders London", "young chef London"],
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Nunito:wght@300;400;500;600;700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
