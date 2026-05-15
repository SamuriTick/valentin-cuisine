import { T } from '@/components/cuisine/translations';
import { HeroSection } from '@/components/cuisine/HeroSection';
import { AboutTab } from '@/components/cuisine/AboutTab';
import { SpecialtiesTab } from '@/components/cuisine/SpecialtiesTab';
import { GalleryTab } from '@/components/cuisine/GalleryTab';
import { OrderTab } from '@/components/cuisine/OrderTab';
import { MentoringSection } from '@/components/cuisine/MentoringSection';
export default function Home() {
  const t = T['en'];

  return (
    <>
      <HeroSection t={t} />
      <AboutTab t={t} />
      <SpecialtiesTab t={t} />
      <GalleryTab />
      <MentoringSection />
      <OrderTab />
    </>
  );
}
