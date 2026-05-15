import { getContentMap, mergeContent } from '@/lib/siteContent';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
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

  return (
    <>
      <HeroSection t={t} heroImage={heroImage} />
      <AboutTab t={t} />
      <SpecialtiesTab t={t} />
      <GalleryTab t={t} photos={galleryPhotos} />
      <MentoringSection t={t} />
      <OrderTab t={t} />
    </>
  );
}
