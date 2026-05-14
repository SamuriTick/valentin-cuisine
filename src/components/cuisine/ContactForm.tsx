'use client';

import { useState } from 'react';

type Reason = 'food' | 'mentoring' | '';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', reason: '' as Reason, message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          occasion: form.reason === 'food' ? 'Food enquiry' : form.reason === 'mentoring' ? 'Mentoring' : 'General',
          details: form.message,
        }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="px-8 py-10 bg-brand-green-light border border-brand-border rounded-lg text-center">
        <p className="font-body text-xl font-semibold text-brand-dark mb-2">Message sent!</p>
        <p className="font-body text-sm text-brand-muted">Thanks {form.name} - Valentin will get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {status === 'error' && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 font-body text-[13px] rounded-md">
          Something went wrong - please try again.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={e => set('name', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal"
          />
        </div>
        <div>
          <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={e => set('email', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal"
          />
        </div>
      </div>

      <div>
        <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">What is this about?</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'food', label: 'Food order' },
            { value: 'mentoring', label: 'Mentoring' },
          ].map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => set('reason', value)}
              className={`px-4 py-3 font-body text-[11px] font-bold tracking-[1.5px] uppercase rounded-md border transition-colors duration-200 ${
                form.reason === value
                  ? 'bg-brand-teal text-white border-brand-teal'
                  : 'bg-white text-brand-muted border-brand-border hover:border-brand-teal hover:text-brand-teal'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Message *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={e => set('message', e.target.value)}
          placeholder={
            form.reason === 'food'
              ? 'What would you like? Flavour, size, date, any dietary needs...'
              : form.reason === 'mentoring'
              ? 'Tell me a bit about yourself and what you have in mind...'
              : 'Tell me what you need...'
          }
          className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal resize-y placeholder:text-brand-muted/50"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className={`w-full font-body text-[11px] font-bold tracking-[2px] uppercase text-white py-4 px-8 rounded transition-opacity duration-200 hover:opacity-85 ${
          status === 'sending' ? 'bg-brand-muted cursor-not-allowed' : 'bg-brand-teal cursor-pointer'
        }`}
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>

      <p className="font-body text-[12px] text-brand-muted text-center leading-[1.6]">
        Valentin replies within 24 hours. Available weekends and school holidays.
      </p>
    </form>
  );
}
