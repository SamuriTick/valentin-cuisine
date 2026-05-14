'use client';

import { useState } from 'react';

const FAQS = [
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
    a: 'SW London collection (Putney) is the easiest option: I may be able to offer a small discount for this. Royal Mail delivery is possible but not guaranteed, depends on logistics. Mention what you need in the form and I\'ll let you know.',
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

export function KimchiFAQs() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-brand-border">
      {FAQS.map(({ q, a }, i) => (
        <div key={q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left flex items-center justify-between gap-6 py-6 group"
          >
            <span className="font-display font-light text-[clamp(22px,3vw,32px)] text-brand-dark leading-snug group-hover:text-brand-teal transition-colors duration-200">
              {q}
            </span>
            <span className={`flex-shrink-0 w-6 h-6 rounded-full border border-brand-border flex items-center justify-center transition-colors duration-200 ${open === i ? 'bg-brand-teal border-brand-teal' : 'bg-white'}`}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}>
                <path d="M5 1v8M1 5h8" stroke={open === i ? '#fff' : '#b03060'} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </button>
          {open === i && (
            <p className="font-body text-base text-brand-muted leading-[1.85] pb-6 max-w-[720px]">
              {a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
