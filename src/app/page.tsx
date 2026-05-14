'use client';

import { useState } from 'react';
import { T, Lang } from '@/components/cuisine/translations';
import { CuisineNav } from '@/components/cuisine/CuisineNav';
import { HeroSection } from '@/components/cuisine/HeroSection';
import { AboutTab } from '@/components/cuisine/AboutTab';
import { SpecialtiesTab } from '@/components/cuisine/SpecialtiesTab';
import { GalleryTab } from '@/components/cuisine/GalleryTab';
import { OrderTab } from '@/components/cuisine/OrderTab';
import { CuisineFooter } from '@/components/cuisine/CuisineFooter';

export default function Home() {
  const [lang, setLang] = useState<Lang>('en');
  const t = T[lang];

  return (
    <>
      <CuisineNav t={t} lang={lang} setLang={setLang} />
      <HeroSection t={t} />
      <AboutTab t={t} />
      <SpecialtiesTab t={t} />
      <GalleryTab />
      <OrderTab t={t} />
      <CuisineFooter t={t} />
    </>
  );
}
