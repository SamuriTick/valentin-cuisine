'use client';

import { useState } from 'react';
import { MAIN_QUESTIONS, EXTRA_QUESTIONS, gridKey, type Answers, type Question } from '@/lib/feedbackQuestions';

const pill = (on: boolean) =>
  `font-body text-[13px] px-4 py-2.5 rounded-full border transition-colors duration-150 cursor-pointer ${
    on ? 'bg-brand-teal border-brand-teal text-white font-semibold' : 'bg-white border-brand-border text-brand-dark hover:border-brand-teal'
  }`;
const input = 'w-full px-4 py-3 bg-white border border-brand-border rounded-xl font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal placeholder:text-brand-muted/50';

type Props = { token?: string; needsName: boolean; previous?: Answers };

export function FeedbackForm({ token, needsName, previous }: Props) {
  const [answers, setAnswers] = useState<Answers>(previous ?? {});
  const [share, setShare] = useState(previous?.share === 'yes');
  const [review, setReview] = useState(typeof previous?.review === 'string' ? previous.review : '');
  const [name, setName] = useState('');
  const [more, setMore] = useState(!!previous);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = (key: string, value: string | string[] | undefined) =>
    setAnswers(a => {
      const next = { ...a };
      if (value === undefined || (Array.isArray(value) && value.length === 0)) delete next[key];
      else next[key] = value;
      return next;
    });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!answers.overall) { setError('Please tell me how it was overall (the first question).'); setStatus('error'); return; }
    if (needsName && !name.trim()) { setError('Please add your name.'); setStatus('error'); return; }
    setStatus('sending'); setError('');
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, name, answers: { ...answers, share, review } }),
    }).catch(() => null);
    if (res?.ok) { setStatus('done'); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const data = await res?.json().catch(() => ({}));
    setError(data?.error ?? 'Something went wrong. Please try again.');
    setStatus('error');
  }

  if (status === 'done') {
    return (
      <div className="px-8 py-12 bg-brand-green-light border border-brand-border rounded-2xl text-center">
        <p className="text-5xl mb-4">🙏</p>
        <p className="font-display text-[34px] text-brand-dark leading-tight mb-3">Thank you <span className="italic font-semibold text-brand-teal">so much!</span></p>
        <p className="font-body text-[15px] text-brand-muted leading-[1.7] max-w-md mx-auto m-0">
          I read every answer myself. Your feedback goes straight into the next batch.
        </p>
      </div>
    );
  }

  function renderQuestion(q: Question, n: number) {
    return (
      <fieldset key={q.key} className="border-0 p-0 m-0">
        <legend className="font-body text-[15px] font-semibold text-brand-dark mb-3">
          <span className="text-brand-teal mr-2">{n}.</span>{q.label}
        </legend>

        {q.kind === 'choice' && q.emoji && (
          <div className="grid grid-cols-5 gap-2">
            {q.options.map((o, i) => {
              const on = answers[q.key] === o;
              return (
                <button key={o} type="button" onClick={() => set(q.key, on ? undefined : o)}
                  className={`flex flex-col items-center gap-1 py-3 rounded-2xl border transition-all duration-150 cursor-pointer ${on ? 'bg-brand-green-light border-brand-teal scale-105' : 'bg-white border-brand-border hover:border-brand-teal'}`}>
                  <span className="text-[30px] leading-none">{q.emoji![i]}</span>
                  <span className={`font-body text-[11px] text-center leading-tight ${on ? 'text-brand-teal font-semibold' : 'text-brand-muted'}`}>{o}</span>
                </button>
              );
            })}
          </div>
        )}

        {q.kind === 'choice' && !q.emoji && (
          <div className="flex flex-wrap gap-2">
            {q.options.map(o => {
              const on = answers[q.key] === o;
              return <button key={o} type="button" onClick={() => set(q.key, on ? undefined : o)} className={pill(on)}>{o}</button>;
            })}
          </div>
        )}

        {q.kind === 'multi' && (
          <div className="flex flex-wrap gap-2">
            {q.options.map(o => {
              const picked = (answers[q.key] as string[] | undefined) ?? [];
              const on = picked.includes(o);
              return <button key={o} type="button" onClick={() => set(q.key, on ? picked.filter(x => x !== o) : [...picked, o])} className={pill(on)}>{o}</button>;
            })}
            <p className="w-full font-body text-[12px] text-brand-muted mt-1 mb-0">Pick as many as you like.</p>
          </div>
        )}

        {q.kind === 'grid' && (
          <div className="bg-white border border-brand-border rounded-2xl divide-y divide-brand-border">
            {q.rows.map(row => {
              const k = gridKey(q, row);
              return (
                <div key={row} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-3">
                  <span className="font-body text-[14px] text-brand-dark sm:w-24 shrink-0">{row}</span>
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    {q.options.map(o => {
                      const on = answers[k] === o;
                      return (
                        <button key={o} type="button" onClick={() => set(k, on ? undefined : o)}
                          className={`font-body text-[12px] px-2 py-2 rounded-full border transition-colors duration-150 cursor-pointer ${on ? 'bg-brand-teal border-brand-teal text-white font-semibold' : 'bg-white border-brand-border text-brand-dark hover:border-brand-teal'}`}>
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {q.kind === 'text' && (
          <textarea rows={3} value={(answers[q.key] as string) ?? ''} placeholder={q.placeholder}
            onChange={e => set(q.key, e.target.value || undefined)} className={`${input} resize-y`} />
        )}
      </fieldset>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-9">
      {needsName && (
        <div>
          <label className="block font-body text-[15px] font-semibold text-brand-dark mb-3">Your name</label>
          <input value={name} onChange={e => setName(e.target.value)} className={input} placeholder="So I know who it's from" />
        </div>
      )}

      {MAIN_QUESTIONS.map((q, i) => renderQuestion(q, i + 1))}

      {!more ? (
        <button type="button" onClick={() => setMore(true)}
          className="self-start font-body text-[13px] font-bold text-brand-teal bg-transparent border border-dashed border-brand-teal rounded-full px-5 py-3 cursor-pointer hover:bg-brand-green-light">
          + A few more questions (optional)
        </button>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div className="h-px bg-brand-border flex-1" />
            <span className="font-body text-[11px] tracking-[2px] uppercase text-brand-muted">A few more (optional)</span>
            <div className="h-px bg-brand-border flex-1" />
          </div>
          {EXTRA_QUESTIONS.map((q, i) => renderQuestion(q, MAIN_QUESTIONS.length + i + 1))}

          <div className="bg-white border border-brand-border rounded-2xl p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={share} onChange={e => setShare(e.target.checked)} className="mt-1 w-4 h-4 accent-[#c2412d]" />
              <span className="font-body text-[14px] text-brand-dark leading-[1.5]">
                <strong>Can I share your comment on the website?</strong>
                <span className="block text-[12px] text-brand-muted mt-0.5">Only your first name is shown.</span>
              </span>
            </label>
            {share && (
              <textarea rows={3} value={review} onChange={e => setReview(e.target.value)} placeholder="A sentence or two about the kimchi…"
                className={`${input} resize-y mt-4`} />
            )}
          </div>
        </>
      )}

      {status === 'error' && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 font-body text-[13px] rounded-xl">{error}</div>
      )}

      <button type="submit" disabled={status === 'sending'}
        className={`w-full font-body text-[14px] font-bold text-white py-4 px-8 rounded-full transition-opacity duration-200 hover:opacity-85 ${status === 'sending' ? 'bg-brand-muted cursor-not-allowed' : 'bg-brand-teal cursor-pointer'}`}>
        {status === 'sending' ? 'Sending…' : previous ? 'Update my feedback' : 'Send feedback'}
      </button>
    </form>
  );
}
