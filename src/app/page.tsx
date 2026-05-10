'use client';

import { useState } from 'react';
import { T, Lang, Tab } from '@/components/cuisine/translations';
import { CuisineNav } from '@/components/cuisine/CuisineNav';
import { HeroSection } from '@/components/cuisine/HeroSection';
import { TabsBar } from '@/components/cuisine/TabsBar';
import { AboutTab } from '@/components/cuisine/AboutTab';
import { SpecialtiesTab } from '@/components/cuisine/SpecialtiesTab';
import { GalleryTab } from '@/components/cuisine/GalleryTab';
import { OrderTab } from '@/components/cuisine/OrderTab';
import { CuisineFooter } from '@/components/cuisine/CuisineFooter';

export default function Home() {
  const [lang, setLang] = useState<Lang>('en');
  const [tab, setTab] = useState<Tab>('about');
  const t = T[lang];

  return (
    <>
      <CuisineNav t={t} lang={lang} setLang={setLang} setTab={setTab} />
      <HeroSection t={t} setTab={setTab} />
      <TabsBar t={t} tab={tab} setTab={setTab} />

      {tab === 'about'       && <AboutTab t={t} />}
      {tab === 'specialties' && <SpecialtiesTab t={t} setTab={setTab} />}
      {tab === 'gallery'     && <GalleryTab />}
      {tab === 'order'       && <OrderTab t={t} />}

      <CuisineFooter t={t} />
    </>
  );
}
