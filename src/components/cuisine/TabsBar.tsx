'use client';

import { Tab } from './translations';

interface Props {
  tab: Tab;
  setTab: (t: Tab) => void;
}

const TABS: [Tab, string][] = [
  ['about', 'About'],
  ['specialties', 'Specialties'],
  ['gallery', 'Media'],
  ['order', 'Order'],
];

export function TabsBar({ tab, setTab }: Props) {
  return (
    <div className="sticky top-[68px] z-[100] bg-white border-b border-brand-border overflow-x-auto">
      <div className="max-w-[860px] mx-auto px-[clamp(24px,8vw,80px)] flex">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`font-body text-[11px] tracking-[1.5px] uppercase px-[clamp(12px,3vw,24px)] py-[clamp(12px,2vw,16px)] bg-transparent border-0 cursor-pointer transition-all duration-200 -mb-px border-b-2 ${
              tab === key
                ? 'font-semibold text-brand-teal border-brand-teal'
                : 'font-normal text-brand-muted border-transparent'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
