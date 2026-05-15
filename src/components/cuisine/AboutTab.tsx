'use client';

import { ContainerStandard } from './ContainerStandard';
import { Translations } from './translations';

interface Props { t: Translations }

export function AboutTab({ t }: Props) {
  return (
    <div id="about" className="scroll-mt-[72px]">

      {/* Section 1 · Intro */}
      <div className="bg-brand-light border-t border-brand-border">
        <ContainerStandard className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">

          {/* Portrait */}
          <div className="flex flex-col items-center text-center">
            <div className="w-[160px] h-[160px] rounded-full bg-white border border-brand-border mx-auto mb-5 flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <span className="font-display text-[72px] font-normal text-brand-teal leading-none">V</span>
            </div>
            <p className="font-display text-[22px] font-normal text-brand-dark mb-1">Valentin Thang</p>
            <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted">{t.taglineSub}</p>
          </div>

          {/* Text */}
          <div>
            <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">{t.aboutEyebrow}</p>
            <h2 className="font-display font-light text-[clamp(28px,3.5vw,44px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-0">
              {t.aboutTitle[0]}<br />
              <span className="font-semibold italic text-brand-teal">{t.aboutTitle[1]}</span>
            </h2>
            <div className="w-12 h-px bg-brand-border mt-5 mb-5" />
            <p className="font-body text-sm text-brand-muted leading-[1.85] mb-4">{t.aboutBody1}</p>
            <p className="font-body text-sm text-brand-muted leading-[1.85] mb-6">{t.aboutBody2}</p>
            <blockquote className="m-0 px-6 py-5 bg-white border border-brand-border rounded-lg">
              <p className="font-display text-[18px] font-light italic text-brand-dark leading-[1.6] mb-2">{t.aboutQuote}</p>
              <cite className="font-body block text-[11px] tracking-[1.8px] uppercase text-brand-muted not-italic">{t.aboutQuoteCredit}</cite>
            </blockquote>
          </div>

        </ContainerStandard>
      </div>

      {/* Section 2 · Stats */}
      <div className="bg-white border-t border-brand-border">
        <ContainerStandard className="py-10 md:py-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {([
            [t.statsLabel1, t.statsDesc1],
            [t.statsLabel2, t.statsDesc2],
            [t.statsLabel3, t.statsDesc3],
          ] as [string, string][]).map(([label, desc]) => (
            <div key={label} className="text-center px-4 py-2">
              <p className="font-display font-normal text-[clamp(28px,4vw,44px)] text-brand-teal leading-none mb-3">{label}</p>
              <p className="font-body text-[13px] text-brand-muted leading-[1.7]">{desc}</p>
            </div>
          ))}
        </ContainerStandard>
      </div>

      {/* Section 3 · Story cards */}
      <div className="bg-brand-light border-t border-brand-border">
        <ContainerStandard className="py-10 md:py-12">
          <p className="font-accent text-[clamp(22px,3vw,36px)] text-brand-teal mb-3 leading-none text-center">Highlights</p>
          <div className="w-12 h-px bg-brand-border mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              [t.storyTitle1, t.storyBody1],
              [t.storyTitle2, t.storyBody2],
              [t.storyTitle3, t.storyBody3],
              [t.storyTitle4, t.storyBody4],
            ] as [string, string][]).map(([title, body]) => (
              <div key={title} className="bg-white rounded-lg border border-brand-border px-6 py-6">
                <h3 className="font-display font-semibold text-[18px] text-brand-dark leading-snug mb-3">{title}</h3>
                <div className="w-7 h-px bg-brand-border mb-4" />
                <p className="font-body text-[13px] text-brand-muted leading-[1.75]">{body}</p>
              </div>
            ))}
          </div>
        </ContainerStandard>
      </div>

    </div>
  );
}
