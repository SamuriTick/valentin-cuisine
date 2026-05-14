'use client';

import { ContainerStandard } from './ContainerStandard';

export function GalleryTab() {
  return (
    <div id="gallery" className="bg-brand-dark scroll-mt-[72px]">
      <ContainerStandard className="py-12 md:py-16">

        <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none text-center">Behind the scenes</p>
        <h2 className="font-display font-light text-[clamp(28px,3.5vw,44px)] text-white leading-[1.1] tracking-[-1px] text-center">
          <span className="font-semibold italic text-brand-teal">Gallery</span>
        </h2>
        <div className="w-12 h-px bg-white/15 mx-auto mt-5 mb-10" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-brand-card-dark border border-brand-card-border rounded-lg aspect-[4/3] flex items-center justify-center transition-colors duration-200 hover:border-white/20"
            >
              <span className="font-body text-[11px] text-brand-muted tracking-[1.5px] uppercase">
                Photo {i + 1}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 font-body text-[13px] text-brand-muted italic">
          Photos coming soon &middot; Follow{' '}
          <a
            href="https://instagram.com/valentincuisine"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-teal no-underline"
          >
            @valentincuisine
          </a>{' '}
          on Instagram
        </p>

      </ContainerStandard>
    </div>
  );
}
