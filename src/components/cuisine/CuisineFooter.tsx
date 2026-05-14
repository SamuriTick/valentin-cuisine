'use client';

import { ContainerStandard } from './ContainerStandard';
import { Translations } from './translations';

interface Props { t: Translations }

export function CuisineFooter({ t }: Props) {
  return (
    <footer className="bg-white border-t border-brand-border text-center py-12 md:py-16">
      <ContainerStandard>

        <p className="font-display font-light italic text-[clamp(22px,3.5vw,36px)] text-brand-dark mb-4 leading-none tracking-tight">
          Valentin&rsquo;s Cuisine
        </p>

        <div className="w-14 h-px mx-auto mb-5 bg-brand-border" />

        <p className="font-body text-[11px] tracking-[2px] uppercase mb-7 text-brand-muted">
          {t.taglineSub}
        </p>

        <div className="w-full h-px mb-7 bg-brand-border" />

        <p className="font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted leading-loose">
          {t.footerLine} &middot; Made with love
        </p>

      </ContainerStandard>
    </footer>
  );
}
