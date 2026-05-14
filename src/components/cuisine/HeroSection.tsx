'use client';

import { ContainerStandard } from './ContainerStandard';
import { Translations } from './translations';

interface Props { t: Translations }

export function HeroSection({ t }: Props) {
  return (
    <div className="bg-white pt-[72px]">
      <section id="hero" className="md:min-h-[calc(100vh-72px)] md:flex md:items-center">
        <ContainerStandard className="py-8 md:py-[clamp(12px,2vw,24px)] grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[clamp(32px,5vw,64px)] items-center w-full">

          {/* On mobile: image first, text second */}

          {/* Photo */}
          <div className="relative overflow-hidden rounded-xl h-[56vw] min-h-[240px] max-h-[360px] md:order-last md:h-auto md:min-h-[700px] md:max-h-none">
            <img
              src="/valentin-hero.jpg"
              alt="Valentin in the kitchen"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center">
            <p className="font-accent text-[clamp(14px,2.5vw,22px)] text-brand-teal mb-3 md:mb-4 leading-none">
              {t.heroEyebrow}
            </p>

            <h1 className="font-display font-light text-[clamp(28px,3.5vw,44px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-4 md:mb-6">
              {t.heroTitle[0]}<br />
              {t.heroTitle[1]}<br />
              <span className="font-semibold italic text-brand-teal">{t.heroTitle[2]}</span>
            </h1>

            <div className="w-12 h-px bg-brand-border mb-4 md:mb-6" />

            <p className="font-body text-sm text-brand-muted leading-[1.85] max-w-[380px] mb-6 md:mb-10">
              {t.heroSub}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#order"
                className="font-body text-[11px] font-bold tracking-[2.5px] uppercase bg-brand-teal text-white px-8 py-4 rounded no-underline text-center"
              >
                {t.heroCta}
              </a>
              <a
                href="#about"
                className="font-body text-[11px] font-normal tracking-[2.5px] uppercase px-8 py-4 rounded no-underline text-center border border-brand-border text-brand-muted bg-transparent"
              >
                {t.heroLearn}
              </a>
            </div>
          </div>

        </ContainerStandard>
      </section>
    </div>
  );
}
