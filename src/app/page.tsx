import type { Metadata } from 'next';
import { getContentMap, mergeContent } from '@/lib/siteContent';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    absolute: "Valentin's Cuisine | Aspiring Baker & Pastry Chef — Putney, London",
  },
  description: "Custom cakes, pastries, and artisan food by Valentin Thang, aged 13. Based in Putney, London. Weekend and school holiday availability.",
  alternates: { canonical: '/' },
};

import { HeroSection } from '@/components/cuisine/HeroSection';
import { AboutTab } from '@/components/cuisine/AboutTab';
import { SpecialtiesTab } from '@/components/cuisine/SpecialtiesTab';
import { GalleryTab } from '@/components/cuisine/GalleryTab';
import { OrderTab } from '@/components/cuisine/OrderTab';
import { MentoringSection } from '@/components/cuisine/MentoringSection';

export default async function Home() {
  const [map, galleryItems] = await Promise.all([
    getContentMap(),
    prisma.mediaItem.findMany({
      where: { fileType: 'image' },
      orderBy: { uploadedAt: 'asc' },
      take: 12,
      select: { id: true, filePath: true, altText: true },
    }),
  ])
  const t = mergeContent(map)
  const heroImage = map['hero.image'] ?? '/valentin-hero.jpg'
  const galleryPhotos = galleryItems.map((item, i) => ({
    url: map[`gallery.photo.${i}`] ?? item.filePath,
    alt: item.altText ?? '',
  }))

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Valentin Thang',
    jobTitle: 'Aspiring Baker & Pastry Chef',
    description: 'Young baker and pastry chef based in Putney, London, creating custom cakes, pastries, kimchi, and artisan food.',
    url: 'https://valentincuisine.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Putney',
      addressRegion: 'London',
      addressCountry: 'GB',
    },
  }

  const businessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name: "Valentin's Cuisine",
    description: 'Custom cakes, pastries, kimchi and artisan food made to order by Valentin Thang.',
    url: 'https://valentincuisine.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Putney',
      addressRegion: 'London',
      addressCountry: 'GB',
    },
    priceRange: '£',
    servesCuisine: ['British', 'Korean', 'Pastry'],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />
      <HeroSection t={t} heroImage={heroImage} />
      <AboutTab t={t} />
      <SpecialtiesTab t={t} />
      <GalleryTab t={t} photos={galleryPhotos} />
      <MentoringSection t={t} />
      <OrderTab t={t} />
    </>
  );
}
