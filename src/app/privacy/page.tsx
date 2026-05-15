import type { Metadata } from 'next';
import Link from 'next/link';
import { ContainerStandard } from '@/components/cuisine/ContainerStandard';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: "How Valentin's Cuisine handles your personal information.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: 'Who we are',
    body: "This website belongs to Valentin's Cuisine, a small home baking business run by Valentin Thang, based in Putney, London. You can reach us via the contact form on this site.",
  },
  {
    title: 'What information we collect',
    body: "When you use the contact or order form we collect your name, email address, and the message you submit. We only collect what you choose to give us.",
  },
  {
    title: 'How we use it',
    body: "We use your details solely to respond to your enquiry or fulfil your order. We do not use your information for marketing, and we do not sell or share it with any third party.",
  },
  {
    title: 'How long we keep it',
    body: "We keep your message for as long as needed to handle your enquiry. Once resolved, we do not retain it beyond what is reasonably necessary.",
  },
  {
    title: 'Cookies',
    body: "This site does not use tracking or advertising cookies. Essential cookies may be set by the hosting platform to keep the site running.",
  },
  {
    title: 'Your rights',
    body: "You can ask us to view, correct, or delete any personal data we hold about you at any time. Just get in touch via the contact form.",
  },
  {
    title: 'Contact',
    body: "Any questions about this policy? Use the contact form and we will get back to you within 24 hours.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-brand-light min-h-screen font-body">

      {/* Header */}
      <div className="bg-white pt-[72px] border-b border-brand-border">
        <ContainerStandard className="py-16 md:py-20">
          <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">Legal</p>
          <h1 className="font-display font-light text-[clamp(36px,5vw,56px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-0">
            Privacy <span className="font-semibold italic text-brand-teal">Policy</span>
          </h1>
          <div className="w-12 h-px bg-brand-border mt-5 mb-5" />
          <p className="font-body text-sm text-brand-muted">Last updated: May 2025</p>
        </ContainerStandard>
      </div>

      {/* Content */}
      <ContainerStandard className="py-16 md:py-20 max-w-[720px]">
        <div className="space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="font-display font-light text-[22px] text-brand-dark mb-3">{s.title}</h2>
              <p className="font-body text-[15px] text-brand-muted leading-[1.85]">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-brand-border">
          <Link
            href="/"
            className="font-body text-[11px] font-bold tracking-[1.5px] uppercase text-brand-teal no-underline"
          >
            ← Back home
          </Link>
        </div>
      </ContainerStandard>

    </div>
  );
}
