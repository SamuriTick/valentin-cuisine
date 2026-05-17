import type { Metadata } from 'next';
import { ContainerStandard } from '@/components/cuisine/ContainerStandard';
import { KimchiOrderForm } from '@/components/cuisine/KimchiOrderForm';
import { KimchiFAQs } from '@/components/cuisine/KimchiFAQs';
import { getContentMap } from '@/lib/siteContent';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Hand-Made Kimchi — Putney, London",
  description: 'Spicy, tangy, umami-rich kimchi made fresh to order. Blended (not layered) for deeper flavour. £15 for 2kg in a glass jar. SW London collection or delivery.',
  openGraph: {
    title: "Valentin's Hand-Made Kimchi — Putney, London",
    description: 'Spicy, tangy, umami-rich kimchi made fresh to order. £15 for 2kg in a glass jar.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Valentin's Hand-Made Kimchi — Putney, London",
    description: 'Spicy, tangy, umami-rich kimchi made fresh to order. £15 for 2kg in a glass jar.',
  },
};

const TASTE_DEFAULTS = [
  { label: 'Spicy', desc: 'The kick has to be there: that\'s non-negotiable. It\'ll attack your mouth a little.' },
  { label: 'Umami', desc: 'Dried Vietnamese shrimp adds a depth you won\'t get from fermented shrimp. The secret.' },
  { label: 'Salty', desc: 'Fish sauce, soy sauce, and brine from the fermentation itself.' },
  { label: 'Sweet', desc: 'Just a tiny bit. Barely there, but you\'d miss it if it wasn\'t.' },
];

const PAIRINGS_DEFAULTS = [
  { label: 'Bulgogi beef', desc: 'Bulgogi is sweet. Kimchi is spicy and salty. The spice cuts through the sweetness. Best combination.' },
  { label: 'Egg & rice (for beginners)', desc: 'Never tried Asian food? Start here. Kimchi + a fried egg + plain rice. Gets you into soy sauce and fish sauce while keeping it familiar.' },
  { label: 'Sunday roast', desc: 'Yorkshire pudding, roast potatoes, kimchi on the side. I think you should try it. I\'m probably right.' },
  { label: 'Sausages', desc: 'Another good British entry point. Savoury + spicy. Works.' },
  { label: 'Kimchi fried rice', desc: 'Use the older kimchi for this: the sour, funky stuff. Chop it up, fry with rice and egg. Perfect one-pan meal.' },
  { label: 'Fresh mackerel', desc: 'I caught mackerel in Weymouth, came home, cooked it in butter with leftover kimchi sauce, ate it on rice with an egg. Still one of the best things I\'ve eaten.' },
];

const STORAGE_STAGES_DEFAULTS = [
  { stage: 'Days 1-3 (fresh)', note: 'Clean, crunchy, mild tang. Perfectly good to eat right away.' },
  { stage: '1 week', note: 'Fermentation kicks in. Flavour deepens noticeably. My preferred stage.' },
  { stage: '1-3 months', note: 'Sour, complex, intensely flavoured. Excellent for cooking.' },
  { stage: '3+ months', note: 'Funky and deeply fermented. Make kimchi fried rice or kimchi pancakes. Don\'t throw it out.' },
];

const ORDER_STEPS_DEFAULTS = [
  { title: 'Fill in the form', body: 'Name, email, how many jars. Mention dietary needs or how you want to collect.' },
  { title: 'I confirm', body: "I'm a student: weekends and school holidays work best. I reply within 24 hours." },
  { title: 'Come collect or I deliver', body: 'SW London collection is easiest. I can also come to you (£3) or deliver by post (£6): just choose in the form.' },
];

const FAQS_DEFAULTS = [
  { q: 'How long does it keep?', a: '3 to 4 months refrigerated is the standard recommendation. But kimchi can technically last years: I\'ve heard of people with two-year-old jars still going. The longer it ferments, the more sour and complex it gets. Old kimchi is best for cooking (fried rice, pancakes, sauce for fish).' },
  { q: 'Is it ready to eat when I get it?', a: 'Yes. But you\'re getting it 2 to 3 days old, which is good. One week old is noticeably better: the fermentation has properly kicked in. I prefer it at least a week in. Leave it in the fridge, it\'ll keep improving.' },
  { q: "What's different about this recipe?", a: "Most kimchi uses a tapioca base and layers the paste into the cabbage. I blend everything together: the sauce gets further into the vegetable, the flavour is deeper and more even throughout. I also use dried Vietnamese shrimp from my mum's fridge instead of fermented shrimp. More umami, more depth." },
  { q: 'Do you deliver?', a: 'SW London collection (Putney) is the easiest option. I can also come to you for a small fee (£3). Post delivery is also possible (£6). Choose your preference in the order form.' },
  { q: 'Can I get a vegan version?', a: 'Yes. The standard recipe uses fish sauce and soy sauce. For vegan, I remove the fish sauce and any other meat products. Pescetarians are fine with the standard recipe.' },
  { q: 'Help: my jar is overflowing.', a: "That's the fermentation working. Kimchi releases CO2 as it ferments and the liquid rises. Don't fill the jar completely to the top: leave a bit of room. If it's already bubbling over, open the lid carefully, let the gas escape, press the cabbage down below the brine, and seal it again." },
  { q: "I've eaten all the cabbage but there's sauce left. What do I do?", a: "Cook with it. The kimchi sauce works brilliantly with beef, with fish (mackerel especially), cooked in a pan with butter and served over rice. Don't throw it away." },
  { q: 'Why does making it make you cry?', a: 'Lots of onions. Also garlic and ginger. When I blend the paste, the fumes are intense. My eyes are genuinely dying. The result is worth it.' },
];

export default async function KimchiPage() {
  const [map, linkedProduct] = await Promise.all([
    getContentMap(),
    prisma.product.findFirst({ where: { pageUrl: '/kimchi', available: true } }),
  ])

  const linkedWeights: { amount: string; unit: string; price: string }[] = linkedProduct?.weights
    ? (() => { try { return JSON.parse(linkedProduct.weights) } catch { return [] } })()
    : []

  // Hero
  const heroImage    = map['kimchi.hero.image']   ?? ''
  const heroCropRaw  = map['kimchi.hero.image.crop']
  const heroCrop     = heroCropRaw ? (() => { const p = heroCropRaw.split(' ').map(Number); return { x: p[0] ?? 50, y: p[1] ?? 50, zoom: p[2] ?? 1 } })() : null
  const heroEyebrow  = map['kimchi.hero.eyebrow'] ?? 'Hand-made in Putney, London'
  const heroTitle1   = map['kimchi.hero.title1']  ?? 'Spicy. Salty.'
  const heroTitle2   = map['kimchi.hero.title2']  ?? 'Umami-rich.'
  const heroDesc     = map['kimchi.hero.desc']    ?? "Not your standard recipe: blended, not layered, with a Vietnamese twist. Made fresh to order. Goes with literally everything."
  const heroPrice    = map['kimchi.hero.price']   ?? '£15'
  const heroPriceSub = map['kimchi.hero.price_sub'] ?? 'for 2kg · glass jar · no microplastics'

  // Quote
  const valentinQuote = map['kimchi.quote'] ?? "I haven't been making kimchi for a while because I'm a kid and I'm still in school. But now I have time, so buy my kimchi. It's probably going to sell out in a few weeks."

  // Taste profile
  const tasteEyebrow = map['kimchi.taste.eyebrow'] ?? 'What it tastes like'
  const tasteTitle1  = map['kimchi.taste.title1']  ?? 'Four things happening'
  const tasteTitle2  = map['kimchi.taste.title2']  ?? 'at once.'
  const taste = TASTE_DEFAULTS.map((item, i) => ({
    label: map[`kimchi.taste.${i}.label`] ?? item.label,
    desc:  map[`kimchi.taste.${i}.desc`]  ?? item.desc,
  }))

  // Recipe
  const recipeEyebrow = map['kimchi.recipe.eyebrow'] ?? 'The recipe'
  const recipeTitle1  = map['kimchi.recipe.title1']  ?? 'Not traditional.'
  const recipeTitle2  = map['kimchi.recipe.title2']  ?? 'Better.'
  const recipeBody1   = map['kimchi.recipe.body1']   ?? 'Most kimchi uses a tapioca base and layers the paste into the cabbage. I blend everything together: the sauce gets further into the vegetable, the flavour is deeper and more even throughout.'
  const recipeBody2   = map['kimchi.recipe.body2']   ?? "I also use dried Vietnamese shrimp from my mum's fridge instead of fermented shrimp. More umami, more depth."

  // Pairings
  const pairingsTitle1 = map['kimchi.pairings.title1'] ?? 'Kimchi goes with'
  const pairingsTitle2 = map['kimchi.pairings.title2'] ?? 'anything savoury.'
  const pairings = PAIRINGS_DEFAULTS.map((item, i) => ({
    label: map[`kimchi.pairings.${i}.label`] ?? item.label,
    desc:  map[`kimchi.pairings.${i}.desc`]  ?? item.desc,
  }))

  // Storage
  const storageEyebrow  = map['kimchi.storage.eyebrow'] ?? 'Storage guide'
  const storageTitle1   = map['kimchi.storage.title1']  ?? 'The longer,'
  const storageTitle2   = map['kimchi.storage.title2']  ?? 'the better.'
  const storageBody     = map['kimchi.storage.body']    ?? 'Kimchi ferments over time. The flavour deepens, the tang increases. What starts as fresh and crunchy slowly becomes something more complex and more useful in the kitchen.'
  const storageStages   = STORAGE_STAGES_DEFAULTS.map((item, i) => ({
    stage: map[`kimchi.storage.stage.${i}.stage`] ?? item.stage,
    note:  map[`kimchi.storage.stage.${i}.note`]  ?? item.note,
  }))
  const storageTip1Title = map['kimchi.storage.tip1.title'] ?? "CO2 tip: don't overfill"
  const storageTip1Body  = map['kimchi.storage.tip1.body']  ?? "Fermenting kimchi produces CO2, which makes the liquid rise. If you fill the jar right to the top, it will overflow. Leave a couple of centimetres of space at the top when you first open it. Press the cabbage below the brine level and seal it again. If it bubbles over, just open the lid briefly to release the gas."
  const storageTip2Title = map['kimchi.storage.tip2.title'] ?? 'Fridge vs counter'
  const storageTip2Body  = map['kimchi.storage.tip2.body']  ?? "Leave it on the counter for a day or two to kickstart fermentation quickly, then move it to the fridge to slow it down. In the fridge it keeps for 3 to 4 months. On the counter it will ferment much faster: check it daily."

  // Order section
  const orderEyebrow = map['kimchi.order.eyebrow'] ?? 'Get yours'
  const orderTitle   = map['kimchi.order.title']   ?? 'Place an order'
  const orderSteps   = ORDER_STEPS_DEFAULTS.map((item, i) => ({
    title: map[`kimchi.order.step.${i}.title`] ?? item.title,
    body:  map[`kimchi.order.step.${i}.body`]  ?? item.body,
  }))

  // FAQs
  const faqs = FAQS_DEFAULTS.map((item, i) => ({
    q: map[`kimchi.faq.${i}.q`] ?? item.q,
    a: map[`kimchi.faq.${i}.a`] ?? item.a,
  }))

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: "Valentin's Hand-Made Kimchi",
    description: heroDesc,
    brand: { '@type': 'Brand', name: "Valentin's Cuisine" },
    offers: {
      '@type': 'Offer',
      price: '15.00',
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Person', name: 'Valentin Thang' },
    },
  }

  return (
    <div className="bg-brand-light min-h-screen font-body">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      {/* Hero */}
      <div className="bg-white pt-[72px]">
        <section className="md:min-h-[calc(100vh-72px)] md:flex md:items-center">
          <ContainerStandard className="py-10 md:py-hero grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-col-gap items-center w-full">

            <div className="relative overflow-hidden rounded-xl h-[56vw] min-h-[240px] max-h-[360px] md:order-last md:h-auto md:min-h-[600px] md:max-h-none bg-brand-light border border-brand-border flex items-center justify-center">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt="Kimchi"
                  className="w-full h-full object-cover"
                  style={heroCrop ? {
                    objectPosition: `${heroCrop.x}% ${heroCrop.y}%`,
                    transform: heroCrop.zoom > 1 ? `scale(${heroCrop.zoom})` : undefined,
                    transformOrigin: `${heroCrop.x}% ${heroCrop.y}%`,
                  } : undefined}
                />
              ) : (
                <div className="text-center px-8">
                  <p className="font-display text-[clamp(72px,14vw,120px)] text-brand-teal leading-none">김치</p>
                  <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted mt-3">Kimchi · 2kg · Glass jar</p>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <p className="font-accent text-[clamp(22px,3.5vw,32px)] text-brand-teal mb-3 md:mb-4 leading-none">{heroEyebrow}</p>
              <h1 className="font-display font-light text-[clamp(36px,5vw,64px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-4 md:mb-6">
                {heroTitle1}<br />
                <span className="font-semibold italic text-brand-teal">{heroTitle2}</span>
              </h1>
              <div className="w-12 h-px bg-brand-border mb-5" />
              <p className="font-body text-base text-brand-muted leading-[1.85] mb-6 max-w-[420px]">{heroDesc}</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="font-display text-[clamp(32px,4vw,44px)] text-brand-dark leading-none">{heroPrice}</span>
                <span className="font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted">{heroPriceSub}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#order" className="font-body text-[11px] font-bold tracking-[2.5px] uppercase bg-brand-teal text-white no-underline px-8 py-4 rounded text-center hover:opacity-85 transition-opacity duration-200">
                  Order Now
                </a>
                <a href="#about" className="font-body text-[11px] font-normal tracking-[2.5px] uppercase no-underline px-8 py-4 rounded text-center border border-brand-border text-brand-muted hover:border-brand-teal hover:text-brand-teal transition-colors duration-200">
                  The Story
                </a>
              </div>
            </div>

          </ContainerStandard>
        </section>
      </div>

      {/* Quote */}
      <section id="about" className="bg-brand-light border-t border-brand-border scroll-mt-[72px]">
        <ContainerStandard className="py-section-sm">
          <blockquote className="max-w-[680px] mx-auto text-center">
            <p className="font-display font-light text-[clamp(20px,3.5vw,30px)] text-brand-dark leading-[1.55] tracking-tight mb-6">
              &ldquo;{valentinQuote}&rdquo;
            </p>
            <cite className="font-body text-[11px] tracking-[2px] uppercase text-brand-teal not-italic">
              Valentin Thang, aged 13 &middot; Putney, London
            </cite>
          </blockquote>
        </ContainerStandard>
      </section>

      {/* Taste profile */}
      <section className="bg-white border-t border-brand-border">
        <ContainerStandard className="py-section">
          <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">{tasteEyebrow}</p>
          <h2 className="font-display font-light text-[clamp(28px,4vw,44px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-0">
            {tasteTitle1}<br />
            <span className="font-semibold italic text-brand-teal">{tasteTitle2}</span>
          </h2>
          <div className="w-10 h-px bg-brand-border mt-5 mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {taste.map(({ label, desc }) => (
              <div key={label} className="bg-brand-light border border-brand-border rounded-lg p-6 hover:bg-brand-green-light transition-colors duration-200">
                <p className="font-body text-base font-bold text-brand-dark mb-2 tracking-tight">{label}</p>
                <div className="w-6 h-px bg-brand-border mb-3" />
                <p className="font-body text-sm text-brand-muted leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>
        </ContainerStandard>
      </section>

      {/* Recipe */}
      <section className="bg-brand-green-light border-t border-brand-border">
        <ContainerStandard className="py-section grid grid-cols-1 md:grid-cols-2 gap-col-gap items-start">

          <div>
            <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">{recipeEyebrow}</p>
            <h2 className="font-display font-light text-[clamp(26px,4vw,40px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-5">
              {recipeTitle1}<br />
              <span className="font-semibold italic text-brand-teal">{recipeTitle2}</span>
            </h2>
            <div className="w-10 h-px bg-brand-border mb-6" />
            <p className="font-body text-sm text-brand-muted leading-[1.85] mb-4">{recipeBody1}</p>
            <p className="font-body text-sm text-brand-muted leading-[1.85]">{recipeBody2}</p>
          </div>

          <div className="bg-white border border-brand-border rounded-lg p-6 md:p-8">
            <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted mb-4">What&rsquo;s in it</p>
            {[
              ['Napa cabbage', 'One whole big head per 2kg jar'],
              ['Gochugaru + chilli blend', 'Blended smooth into the paste'],
              ['Garlic & ginger', 'Also blended. Will make your eyes water.'],
              ['Lots of onions', 'A lot of onions. You have been warned.'],
              ['Soy sauce', 'Salt and depth'],
              ['Fish sauce', 'Umami base (omit for vegan)'],
              ['Dried Vietnamese shrimp', 'The secret. Replaces fermented shrimp: more umami'],
              ['Vinegar', 'Balances the fermentation'],
            ].map(([name, note]) => (
              <div key={name} className="flex flex-col py-3 border-b border-brand-border last:border-0">
                <p className="font-body text-sm font-semibold text-brand-dark">{name}</p>
                <p className="font-body text-sm text-brand-muted mt-0.5">{note}</p>
              </div>
            ))}
          </div>

        </ContainerStandard>
      </section>

      {/* Pairings */}
      <section className="bg-white border-t border-brand-border">
        <ContainerStandard className="py-section">
          <h2 className="font-display font-light text-[clamp(26px,4vw,40px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-0 text-center">
            {pairingsTitle1} <span className="font-semibold italic text-brand-teal">{pairingsTitle2}</span>
          </h2>
          <div className="w-10 h-px bg-brand-border mx-auto mt-5 mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pairings.map(({ label, desc }) => (
              <div key={label} className="bg-brand-light border border-brand-border rounded-lg p-5 hover:bg-brand-green-light transition-colors duration-200">
                <p className="font-body text-sm font-bold text-brand-dark mb-2">{label}</p>
                <div className="w-6 h-px bg-brand-border mb-2.5" />
                <p className="font-body text-sm text-brand-muted leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-brand-light border border-brand-border rounded-lg px-6 py-6 md:px-8 md:py-7 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <p className="font-accent text-[clamp(14px,2vw,18px)] text-brand-teal mb-3 leading-none">Pro tip: leftover kimchi sauce</p>
              <p className="font-body text-sm text-brand-muted leading-[1.75]">
                Eaten all the cabbage but still have sauce left? Don&rsquo;t throw it away. Cook it with beef or fish.
                Mackerel works especially well: fry in butter, add the kimchi sauce, serve on rice with a fried egg.
                I tested this after a fishing trip to Weymouth. Still one of the best things I&rsquo;ve eaten.
              </p>
            </div>
            <div className="bg-white border border-brand-border rounded-lg p-5 text-center">
              <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted mb-2">The formula</p>
              <p className="font-display font-light text-[28px] text-brand-dark leading-snug">
                Sauce + fish<br />+ butter + rice
              </p>
            </div>
          </div>

          <blockquote className="mt-8 mx-auto max-w-[520px] bg-brand-light border border-brand-border rounded-lg px-6 py-5 text-center">
            <p className="font-body text-sm italic text-brand-dark leading-[1.8] mb-2">
              &ldquo;If you&rsquo;re depressed, buy kimchi. If you&rsquo;re lonely, buy kimchi.
              Just buy kimchi: because kimchi will make you happy.&rdquo;
            </p>
            <cite className="font-body text-[11px] tracking-[1.8px] uppercase text-brand-muted not-italic">Valentin, aged 13</cite>
          </blockquote>
        </ContainerStandard>
      </section>

      {/* Storage */}
      <section className="bg-brand-green-light border-t border-brand-border">
        <ContainerStandard className="py-section">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="md:col-span-1">
              <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">{storageEyebrow}</p>
              <h2 className="font-display font-light text-[clamp(24px,3.5vw,36px)] text-brand-dark leading-[1.1] tracking-[-1px]">
                {storageTitle1}<br />
                <span className="font-semibold italic text-brand-teal">{storageTitle2}</span>
              </h2>
              <div className="w-10 h-px bg-brand-border mt-5 mb-5" />
              <p className="font-body text-sm text-brand-muted leading-[1.75]">{storageBody}</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {storageStages.map(({ stage, note }) => (
                <div key={stage} className="bg-brand-light border border-brand-border rounded-lg p-5">
                  <p className="font-body text-[11px] font-bold tracking-[1.5px] uppercase text-brand-teal mb-2">{stage}</p>
                  <p className="font-body text-sm text-brand-muted leading-[1.7]">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-light border border-brand-border rounded-lg px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-accent text-[clamp(18px,2.5vw,26px)] text-brand-teal mb-3 leading-none">{storageTip1Title}</p>
              <p className="font-body text-sm text-brand-muted leading-[1.75]">{storageTip1Body}</p>
            </div>
            <div>
              <p className="font-accent text-[clamp(18px,2.5vw,26px)] text-brand-teal mb-3 leading-none">{storageTip2Title}</p>
              <p className="font-body text-sm text-brand-muted leading-[1.75]">{storageTip2Body}</p>
            </div>
          </div>
        </ContainerStandard>
      </section>

      {/* Order */}
      <section id="order" className="bg-brand-light border-t border-brand-border scroll-mt-[72px]">
        <ContainerStandard className="py-section grid grid-cols-1 md:grid-cols-2 gap-col-gap items-start">

          <div>
            <p className="font-accent text-[clamp(22px,3vw,32px)] text-brand-teal mb-3 leading-none">{orderEyebrow}</p>
            <h2 className="font-display font-light text-[clamp(26px,4vw,40px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-0">
              <span className="font-semibold italic text-brand-teal">{orderTitle}</span>
            </h2>
            <div className="w-10 h-px bg-brand-border mt-5 mb-6" />

            <div className="space-y-5 mb-8">
              {orderSteps.map(({ title, body }, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-green-light border border-brand-border rounded flex items-center justify-center">
                    <span className="font-display text-xl font-normal text-brand-teal leading-none">{i + 1}</span>
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-brand-dark mb-1">{title}</p>
                    <p className="font-body text-sm text-brand-muted leading-[1.7]">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-brand-green-light border border-brand-border rounded-lg px-5 py-5 mb-6">
              <p className="font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Pricing</p>
              {linkedWeights.length > 0 ? (
                <div className="space-y-2">
                  {linkedWeights.map((w, i) => (
                    <div key={i} className="flex items-baseline gap-3">
                      <p className="font-display text-[36px] font-normal text-brand-dark leading-none">{w.price}</p>
                      <p className="font-body text-sm text-brand-muted">for {w.amount}{w.unit}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-baseline gap-3">
                  <p className="font-display text-[48px] font-normal text-brand-dark leading-none">
                    {linkedProduct?.price ?? heroPrice}
                  </p>
                  <p className="font-body text-sm text-brand-muted">per 2kg jar</p>
                </div>
              )}
              <p className="font-body text-sm text-brand-muted mt-2">One whole nappa cabbage · glass jar · no microplastics</p>
            </div>
          </div>

          <div>
            <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted mb-5">Order form</p>
            <KimchiOrderForm
              pricePerJar={linkedProduct?.price ? parseFloat(linkedProduct.price.replace(/[^0-9.]/g, '')) || 15 : 15}
              variants={linkedWeights}
            />

            <div className="mt-6 bg-brand-green-light border border-brand-border rounded-lg px-5 py-4">
              <p className="font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-3">Dietary options</p>
              <div className="space-y-2">
                {[
                  ['Standard', 'Fish sauce, soy sauce, dried shrimp: full recipe'],
                  ['Pescetarian', 'Same as standard: all fish-based, no meat'],
                  ['Vegan', 'Fish sauce and meat products removed: just ask'],
                ].map(([diet, note]) => (
                  <div key={diet} className="flex gap-3 items-start">
                    <span className="font-body text-[11px] font-bold tracking-[1px] uppercase text-brand-teal w-[90px] flex-shrink-0 pt-[1px]">{diet}</span>
                    <span className="font-body text-sm text-brand-muted leading-[1.6]">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </ContainerStandard>
      </section>

      {/* FAQs */}
      <section className="bg-white border-t border-brand-border">
        <ContainerStandard className="py-section">
          <p className="font-accent text-[clamp(22px,3vw,32px)] text-brand-teal mb-3 leading-none">You ask, I answer</p>
          <div className="w-12 h-px bg-brand-border mb-2" />
          <KimchiFAQs faqs={faqs} />
        </ContainerStandard>
      </section>

      {/* Bottom CTA */}
      <section className="bg-brand-light border-t border-brand-border text-center">
        <ContainerStandard className="py-section">
          <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">Order today</p>
          <h2 className="font-display font-light text-[clamp(28px,4vw,44px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-0">
            Just get the <span className="font-semibold italic text-brand-teal">kimchi.</span>
          </h2>
          <div className="w-12 h-px bg-brand-border mx-auto mt-5 mb-5" />
          <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted mb-8">
            {linkedProduct?.price ?? heroPrice} &middot; 2kg &middot; Glass jar &middot; Made fresh to order &middot; SW London
          </p>
          <a href="#order" className="font-body text-[11px] font-bold tracking-[2.5px] uppercase bg-brand-teal text-white no-underline px-10 py-4 rounded inline-block hover:opacity-85 transition-opacity duration-200">
            Order Now
          </a>
        </ContainerStandard>
      </section>

    </div>
  );
}
