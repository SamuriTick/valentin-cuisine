import type { Metadata } from 'next';
import { ContainerStandard } from '@/components/cuisine/ContainerStandard';
import { FeedbackForm } from '@/components/cuisine/FeedbackForm';
import { prisma } from '@/lib/prisma';
import { orderIdFromToken } from '@/lib/feedbackToken';
import { orderSummary } from '@/lib/customerEmails';
import { type Answers } from '@/lib/feedbackQuestions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'How was your kimchi?',
  description: "Tell Valentin what you thought of your kimchi. It takes under a minute.",
  robots: { index: false, follow: false },
};

export default async function FeedbackPage({ searchParams }: { searchParams: Promise<{ o?: string }> }) {
  const { o: token } = await searchParams
  const orderId = await orderIdFromToken(token)
  const order = orderId ? await prisma.order.findUnique({ where: { id: orderId } }) : null
  const existing = order ? await prisma.feedback.findUnique({ where: { orderId: order.id } }) : null
  let previous: Answers | undefined
  try { previous = existing ? JSON.parse(existing.answers) : undefined } catch { /* start fresh */ }
  const firstName = order?.name.trim().split(/\s+/)[0]

  return (
    <div className="bg-brand-light min-h-screen font-body">
      <div className="bg-white pt-[72px] border-b border-brand-border">
        <ContainerStandard className="py-12 md:py-16 max-w-[720px]">
          <p className="font-body text-[11px] tracking-[2px] uppercase text-brand-teal mb-3">Feedback</p>
          <h1 className="font-display font-light text-[clamp(36px,5vw,56px)] text-brand-dark leading-[1.1] tracking-[-1px] mb-0">
            {firstName ? <>{firstName}, how was your </> : <>How was your </>}
            <span className="font-semibold italic text-brand-teal">kimchi?</span>
          </h1>
          <div className="w-12 h-px bg-brand-border mt-5 mb-5" />
          <p className="font-body text-[15px] text-brand-muted leading-[1.7] m-0">
            {order ? <>Your order: {orderSummary(order.items)}. </> : null}
            It takes under a minute, and every answer helps me make the next batch better. Thank you!
          </p>
        </ContainerStandard>
      </div>

      <ContainerStandard className="py-10 md:py-14 max-w-[720px]">
        <FeedbackForm token={order ? token : undefined} needsName={!order} previous={previous} />
      </ContainerStandard>
    </div>
  );
}
