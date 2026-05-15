import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ContainerStandard } from '@/components/cuisine/ContainerStandard';


export const metadata: Metadata = {
  title: "Shop · Valentin's Cuisine",
  description: 'Order custom cakes, kimchi, pastries and sourdough from Valentin. Based in Putney, London. Available weekends and school holidays.',
};

export const dynamic = 'force-dynamic';

const CATEGORIES = ['cake', 'pastry', 'bread', 'fermented', 'seasonal'];
const CATEGORY_LABELS: Record<string, string> = {
  cake: 'Cakes',
  pastry: 'Pastries',
  bread: 'Bread',
  fermented: 'Fermented',
  seasonal: 'Seasonal',
};

export default async function ShopPage({ searchParams }: { searchParams: { category?: string } }) {
  const activeCategory = searchParams.category || 'all';

  const products = await prisma.product.findMany({
    where: {
      available: true,
      ...(activeCategory !== 'all' ? { category: activeCategory } : {}),
    },
    orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }],
  });

  return (
    <div className="bg-brand-light min-h-screen font-body">


      {/* Header */}
      <div className="bg-white pt-[68px] border-b border-brand-border">
        <ContainerStandard className="py-14 md:py-20">
          <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">Putney, London</p>
          <h1 className="font-display font-light text-[clamp(36px,5vw,56px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-0">
            Made fresh,<br />
            <span className="font-semibold italic text-brand-teal">to order.</span>
          </h1>
          <div className="w-12 h-px bg-brand-border mt-5 mb-5" />
          <p className="font-body text-sm text-brand-muted leading-[1.85] mb-8 max-w-[480px]">
            Available weekends and school holidays. Orders confirmed within 24 hours.
          </p>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {['all', ...CATEGORIES].map(cat => (
              <Link
                key={cat}
                href={cat === 'all' ? '/shop' : `/shop?category=${cat}`}
                className={`font-body text-[11px] font-bold tracking-[1.5px] uppercase no-underline px-4 py-2 rounded border transition-colors duration-200 ${
                  activeCategory === cat
                    ? 'bg-brand-teal text-white border-brand-teal'
                    : 'bg-white text-brand-muted border-brand-border hover:border-brand-teal hover:text-brand-teal'
                }`}
              >
                {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
              </Link>
            ))}
          </div>
        </ContainerStandard>
      </div>

      {/* Products */}
      <ContainerStandard className="py-12 md:py-16">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display font-light text-[clamp(24px,3vw,36px)] text-brand-dark mb-3">
              Coming soon
            </p>
            <div className="w-10 h-px bg-brand-border mx-auto mb-5" />
            <p className="font-body text-sm text-brand-muted mb-6">
              In the meantime, send a custom order.
            </p>
            <Link
              href="/contact"
              className="inline-block font-body text-[11px] font-bold tracking-[2px] uppercase text-white bg-brand-teal no-underline px-8 py-3 rounded hover:opacity-85 transition-opacity duration-200"
            >
              Get in Touch
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-white border border-brand-border rounded-lg overflow-hidden hover:border-brand-teal transition-colors duration-200">

                {product.imageUrl ? (
                  <div className="overflow-hidden aspect-[4/3]">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover block"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-brand-light flex items-center justify-center">
                    <p className="font-display text-[72px] font-light text-brand-border leading-none">V</p>
                  </div>
                )}

                <div className="p-6">
                  <p className="font-body text-[10px] tracking-[2px] uppercase text-brand-teal mb-2">
                    {CATEGORY_LABELS[product.category] || product.category}
                    {product.featured && ' · Featured'}
                  </p>
                  <h2 className="font-display font-light text-[20px] text-brand-dark leading-[1.3] mb-2">
                    {product.name}
                  </h2>
                  {product.description && (
                    <p className="font-body text-sm text-brand-muted leading-[1.7] mb-4">{product.description}</p>
                  )}
                  {product.orderNote && (
                    <p className="font-body text-sm text-brand-muted italic mb-4">{product.orderNote}</p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-brand-border">
                    <span className="font-display text-[22px] font-light text-brand-dark leading-none">
                      {product.price || 'Ask for price'}
                    </span>
                    <Link
                      href={`/contact`}
                      className="font-body text-[10px] font-bold tracking-[1.5px] uppercase text-white bg-brand-teal no-underline px-4 py-2 rounded hover:opacity-85 transition-opacity duration-200"
                    >
                      Order
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </ContainerStandard>

      {/* Bottom CTA */}
      <section className="bg-white border-t border-brand-border text-center">
        <ContainerStandard className="py-12">
          <p className="font-accent text-[clamp(16px,2vw,22px)] text-brand-teal mb-3 leading-none">Something specific in mind?</p>
          <h2 className="font-display font-light text-[clamp(26px,3.5vw,40px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-0">
            Custom orders <span className="font-semibold italic text-brand-teal">welcome.</span>
          </h2>
          <div className="w-12 h-px bg-brand-border mx-auto mt-5 mb-5" />
          <p className="font-body text-sm text-brand-muted mb-8 max-w-[420px] mx-auto leading-[1.85]">
            Tell me the flavour, the size, the occasion. I will handle the rest.
          </p>
          <Link
            href="/contact"
            className="inline-block font-body text-[11px] font-bold tracking-[2.5px] uppercase text-white bg-brand-teal no-underline px-10 py-4 rounded hover:opacity-85 transition-opacity duration-200"
          >
            Get in Touch
          </Link>
        </ContainerStandard>
      </section>


    </div>
  );
}
