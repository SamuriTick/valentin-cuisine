import Link from 'next/link';
import { ContainerStandard } from './ContainerStandard';

export function MentoringSection() {
  return (
    <section className="bg-white border-t border-brand-border">
      <ContainerStandard className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          <div>
            <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">Something different</p>
            <h2 className="font-display font-light text-[clamp(28px,3.5vw,44px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-0">
              I would love a<br />
              <span className="font-semibold italic text-brand-teal">mentor.</span>
            </h2>
            <div className="w-12 h-px bg-brand-border mt-5 mb-5" />
            <p className="font-body text-sm text-brand-muted leading-[1.85] mb-4">
              I am 13, I have run a cake business, worked in a restaurant, taught cooking to kids,
              and applied to Junior Bake Off. I love what I do. But I am still figuring a lot of things out.
            </p>
            <p className="font-body text-sm text-brand-muted leading-[1.85]">
              If you work in food, hospitality, business, or anything creative and you are open to
              a conversation, I would genuinely love that. I am curious about everything and I ask
              a lot of questions.
            </p>
          </div>

          <div className="bg-brand-light border border-brand-border rounded-lg p-8">
            <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted mb-4">What I am looking for</p>
            <div className="space-y-4 mb-8">
              {[
                { label: 'Someone to talk to', body: "I want to hear how people got to where they are. The path, the mistakes, the parts they did not expect." },
                { label: 'Honest feedback', body: "On my work, my ideas, my direction. I would rather hear something hard than something polite." },
                { label: 'Connections', body: "I am 13 and I do not know many people yet. I am trying to change that." },
              ].map(({ label, body }) => (
                <div key={label} className="flex gap-4">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-teal flex-shrink-0" />
                  <div>
                    <p className="font-body text-sm font-semibold text-brand-dark mb-1">{label}</p>
                    <p className="font-body text-[13px] text-brand-muted leading-[1.7]">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/contact"
              className="inline-block font-body text-[11px] font-bold tracking-[2px] uppercase text-white bg-brand-teal no-underline px-8 py-3 rounded hover:opacity-85 transition-opacity duration-200"
            >
              Get in Touch
            </Link>
          </div>

        </div>
      </ContainerStandard>
    </section>
  );
}
