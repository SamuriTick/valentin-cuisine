'use client';

import { useState } from 'react';

interface FAQ { q: string; a: string }

const DEFAULT_FAQS: FAQ[] = [
  {
    q: 'How long does it keep?',
    a: '3 to 4 months refrigerated is the standard recommendation. But kimchi can technically last years: I\'ve heard of people with two-year-old jars still going. The longer it ferments, the more sour and complex it gets. Old kimchi is best for cooking (fried rice, pancakes, sauce for fish).',
  },
  {
    q: 'Is it ready to eat when I get it?',
    a: 'Yes. But you\'re getting it 2 to 3 days old, which is good. One week old is noticeably better: the fermentation has properly kicked in. I prefer it at least a week in. Leave it in the fridge, it\'ll keep improving.',
  },
  {
    q: 'What\'s different about this recipe?',
    a: 'Most kimchi uses a tapioca base and layers the paste into the cabbage. I blend everything together: the sauce gets further into the vegetable, the flavour is deeper and more even throughout. I also use dried Vietnamese shrimp from my mum\'s fridge instead of fermented shrimp. More umami, more depth.',
  },
  {
    q: 'Do you deliver?',
    a: 'SW London collection (Putney) is the easiest option. I can also come to you for a small fee (£3). Door-to-door delivery by one of my people is also possible (£6). Choose your preference in the order form.',
  },
  {
    q: 'Can I get a vegan version?',
    a: 'Yes. The standard recipe uses fish sauce and soy sauce. For vegan, I remove the fish sauce and any other meat products. Pescetarians are fine with the standard recipe.',
  },
  {
    q: 'Help: my jar is overflowing.',
    a: 'That\'s the fermentation working. Kimchi releases CO2 as it ferments and the liquid rises. Don\'t fill the jar completely to the top: leave a bit of room. If it\'s already bubbling over, open the lid carefully, let the gas escape, press the cabbage down below the brine, and seal it again.',
  },
  {
    q: 'I\'ve eaten all the cabbage but there\'s sauce left. What do I do?',
    a: 'Cook with it. The kimchi sauce works brilliantly with beef, with fish (mackerel especially), cooked in a pan with butter and served over rice. Don\'t throw it away.',
  },
  {
    q: 'Why does making it make you cry?',
    a: 'Lots of onions. Also garlic and ginger. When I blend the paste, the fumes are intense. My eyes are genuinely dying. The result is worth it.',
  },
];

export function KimchiFAQs({ faqs }: { faqs?: FAQ[] }) {
  const items = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS
  const [open, setOpen] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setOpen(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  return (
    <div className="divide-y divide-brand-border">
      {items.map(({ q, a }, i) => (
        <div key={i}>
          <button
            onClick={() => toggle(i)}
            className="w-full text-left flex items-center justify-between gap-6 py-6 group"
          >
            <span className="font-display font-light text-[clamp(22px,3vw,32px)] text-brand-dark leading-snug group-hover:text-brand-teal transition-colors duration-200">
              {q}
            </span>
            <span className="flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={`transition-transform duration-200 ${open.has(i) ? 'rotate-180' : ''}`}>
                <path d="M5 7.5l5 5 5-5" stroke="#b03060" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          {open.has(i) && (
            <p className="font-body text-base text-brand-muted leading-[1.85] pb-6 max-w-[720px]">
              {a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
