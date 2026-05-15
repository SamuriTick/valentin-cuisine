import type { Metadata } from 'next';
import { ContactForm } from '@/components/cuisine/ContactForm';
import { ContainerStandard } from '@/components/cuisine/ContainerStandard';
import { getContentMap } from '@/lib/siteContent';

export const metadata: Metadata = {
  title: "Get in Touch · Valentin's Cuisine",
  description: "Order food, ask a question, or reach out about mentoring Valentin. Based in Putney, London.",
};

const FOOD_DEFAULTS = [
  { label: 'Kimchi', body: 'Hand-made, blended with a Vietnamese twist. £15 for 2kg in a glass jar. SW London collection or Royal Mail.' },
  { label: 'Custom cakes', body: 'Celebration cakes made to order. Tell me the flavour, design, and date and I will handle the rest.' },
  { label: 'Sourdough & pastries', body: 'I bake to order on weekends and school holidays. Ask and I will tell you what is available.' },
]

export default async function ContactPage() {
  const map = await getContentMap()

  const heroEyebrow = map['contact.hero.eyebrow'] ?? 'Putney, London'
  const heroTitle   = map['contact.hero.title']   ?? 'touch.'
  const heroDesc    = map['contact.hero.desc']    ?? 'Whether you want to order food or talk about mentoring me, use the form below. I reply within 24 hours.'
  const foodItems = FOOD_DEFAULTS.map((item, i) => ({
    label: map[`contact.food.${i}.label`] ?? item.label,
    body:  map[`contact.food.${i}.body`]  ?? item.body,
  }))
  const mentorBody = map['contact.mentor.body'] ?? "I am 13 and I genuinely love learning from people who know more than me. If you work in food, hospitality, business, or anything creative and you are open to a conversation, I would love that. No agenda, just curiosity."

  return (
    <div className="bg-brand-light min-h-screen font-body">

      {/* Header */}
      <div className="bg-white pt-[72px] border-b border-brand-border">
        <ContainerStandard className="py-16 md:py-20">
          <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">{heroEyebrow}</p>
          <h1 className="font-display font-light text-[clamp(36px,5vw,60px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-4">
            Get in <span className="font-semibold italic text-brand-teal">{heroTitle}</span>
          </h1>
          <div className="w-12 h-px bg-brand-border mb-5" />
          <p className="font-body text-sm text-brand-muted leading-[1.85] max-w-[480px]">
            {heroDesc}
          </p>
        </ContainerStandard>
      </div>

      {/* Form section */}
      <section>
        <ContainerStandard className="py-16 grid grid-cols-1 md:grid-cols-2 gap-col-gap items-start">

          {/* Left: context */}
          <div>
            <div className="mb-10">
              <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted mb-4">About food</p>
              <div className="space-y-4">
                {foodItems.map(({ label, body }) => (
                  <div key={label} className="bg-white border border-brand-border rounded-lg px-5 py-4">
                    <p className="font-body text-sm font-semibold text-brand-dark mb-1">{label}</p>
                    <p className="font-body text-sm text-brand-muted leading-[1.7]">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted mb-4">About mentoring</p>
              <div className="bg-brand-green-light border border-brand-border rounded-lg px-5 py-5">
                <p className="font-body text-sm text-brand-muted leading-[1.8]">{mentorBody}</p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted mb-5">Send a message</p>
            <ContactForm />
          </div>

        </ContainerStandard>
      </section>

    </div>
  );
}
