'use client';

import { useState } from 'react';

export function KimchiOrderForm() {
  const PRICE_PER_JAR = 15;
  const [form, setForm] = useState({ name: '', email: '', jars: '1', dietary: '', delivery: '', address: '', details: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const jars = Number(form.jars);
      const total = jars * PRICE_PER_JAR;
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          occasion: `Kimchi order — ${jars} jar${jars > 1 ? 's' : ''} (£${total})${form.dietary ? ` · dietary: ${form.dietary}` : ''}${form.delivery ? ` · ${form.delivery}` : ''}${form.address ? ` · address: ${form.address}` : ''}`,
          details: form.details,
          jars,
          total,
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
        <p className="font-body text-xl font-semibold text-brand-dark mb-2">Order sent!</p>
        <p className="font-body text-sm text-brand-muted">Thanks {form.name} — I&apos;ll be in touch within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {status === 'error' && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 font-body text-[13px] rounded-md">
          Something went wrong — please try again.
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
        <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">How many jars?</label>
        <select
          value={form.jars}
          onChange={e => set('jars', e.target.value)}
          className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal cursor-pointer"
        >
          {Array.from({ length: 10 }, (_, i) => String(i + 1)).map(n => (
            <option key={n} value={n}>{n} jar{n !== '1' ? 's' : ''} · £{Number(n) * PRICE_PER_JAR}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Dietary needs</label>
        <div className="flex flex-wrap gap-2">
          {['None', 'Pescetarian', 'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Nut allergy'].map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => set('dietary', form.dietary === opt ? '' : opt)}
              className={`px-3 py-2 font-body text-[11px] font-bold tracking-[1px] uppercase rounded border transition-colors duration-200 ${
                form.dietary === opt
                  ? 'bg-brand-teal text-white border-brand-teal'
                  : 'bg-white text-brand-muted border-brand-border hover:border-brand-teal hover:text-brand-teal'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Collection or delivery?</label>
        <div className="flex flex-wrap gap-2">
          {['Collection (SW London)', 'Royal Mail delivery', 'Not sure yet'].map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => set('delivery', form.delivery === opt ? '' : opt)}
              className={`px-3 py-2 font-body text-[11px] font-bold tracking-[1px] uppercase rounded border transition-colors duration-200 ${
                form.delivery === opt
                  ? 'bg-brand-teal text-white border-brand-teal'
                  : 'bg-white text-brand-muted border-brand-border hover:border-brand-teal hover:text-brand-teal'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {form.delivery === 'Royal Mail delivery' && (
        <div>
          <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Delivery address *</label>
          <textarea
            required
            rows={3}
            placeholder="Full name, street, city, postcode"
            value={form.address}
            onChange={e => set('address', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal resize-y placeholder:text-brand-muted/50"
          />
        </div>
      )}

      <div>
        <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Anything else?</label>
        <textarea
          rows={3}
          placeholder="Timing, special requests..."
          value={form.details}
          onChange={e => set('details', e.target.value)}
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
        {status === 'sending' ? 'Sending…' : 'Send Order Request'}
      </button>

      <p className="font-body text-[12px] text-brand-muted text-center leading-[1.6]">
        Valentin replies within 24 hours. Payment on collection or agreed before delivery.
      </p>
    </form>
  );
}
