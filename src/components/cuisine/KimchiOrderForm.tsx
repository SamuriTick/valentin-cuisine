'use client';

import { useState } from 'react';

interface Variant { amount: string; unit: string; price: string }

interface Props {
  pricePerJar?: number
  variants?: Variant[]
}

export function KimchiOrderForm({ pricePerJar = 15, variants = [] }: Props) {
  const hasVariants = variants.length > 0

  const [form, setForm] = useState({
    name: '', email: '',
    jars: '1',
    variantIndex: '0',
    dietary: '', delivery: '',
    addrLine1: '', addrLine2: '', addrCity: '', addrPostcode: '',
    details: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  function getLinePrice(): number {
    if (hasVariants) {
      const v = variants[parseInt(form.variantIndex, 10)]
      return v ? parseFloat(v.price.replace(/[^0-9.]/g, '')) || 0 : 0
    }
    return pricePerJar
  }

  function getTotal(): number {
    return getLinePrice() * parseInt(form.jars, 10)
  }

  function getOrderLabel(): string {
    const jars = parseInt(form.jars, 10)
    if (hasVariants) {
      const v = variants[parseInt(form.variantIndex, 10)]
      return `${jars}× ${v?.amount ?? ''}${v?.unit ?? ''} (${v?.price ?? ''})`
    }
    return `${jars} jar${jars > 1 ? 's' : ''} × £${pricePerJar} = £${getTotal()}`
  }

  function getAddressString(): string {
    const parts = [form.addrLine1, form.addrLine2, form.addrCity, form.addrPostcode].filter(Boolean)
    return parts.join(', ')
  }

  const needsAddress = form.delivery === 'Collection near you (£3)' || form.delivery === 'Delivery'

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const jars = parseInt(form.jars, 10);
      const total = getTotal();
      const address = getAddressString()
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          occasion: `Kimchi order — ${getOrderLabel()}${form.dietary ? ` · dietary: ${form.dietary}` : ''}${form.delivery ? ` · ${form.delivery}` : ''}${address ? ` · address: ${address}` : ''}`,
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
        <p className="font-body text-sm text-brand-muted">Thanks {form.name}, I&apos;ll be in touch within 24 hours.</p>
      </div>
    );
  }

  const total = getTotal()

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
          <input type="text" required value={form.name} onChange={e => set('name', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal" />
        </div>
        <div>
          <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Email *</label>
          <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal" />
        </div>
      </div>

      {hasVariants && (
        <div>
          <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Size</label>
          <select value={form.variantIndex} onChange={e => set('variantIndex', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal cursor-pointer">
            {variants.map((v, i) => (
              <option key={i} value={i}>{v.amount}{v.unit} ({v.price})</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">
          {hasVariants ? 'How many?' : 'How many jars?'}
        </label>
        <select value={form.jars} onChange={e => set('jars', e.target.value)}
          className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal cursor-pointer">
          {Array.from({ length: 10 }, (_, i) => String(i + 1)).map(n => {
            const label = hasVariants
              ? n
              : `${n} jar${n !== '1' ? 's' : ''}`
            return <option key={n} value={n}>{label}</option>
          })}
        </select>
        {total > 0 && (
          <p className="font-body text-[12px] text-brand-muted mt-2">
            Total: <strong className="text-brand-dark">£{total % 1 === 0 ? total.toFixed(0) : total.toFixed(2)}</strong>
          </p>
        )}
      </div>

      <div>
        <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Dietary requirements</label>
        <input type="text" placeholder="Any dietary needs or allergies?" value={form.dietary} onChange={e => set('dietary', e.target.value)}
          className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal placeholder:text-brand-muted/50" />
      </div>

      <div>
        <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Collection or delivery</label>
        <div className="flex flex-wrap gap-2">
          {['Collection SW London', 'Collection near you (£3)', 'Delivery'].map(opt => (
            <button key={opt} type="button" onClick={() => set('delivery', form.delivery === opt ? '' : opt)}
              className={`px-3 py-2 font-body text-[11px] font-bold tracking-[1px] uppercase rounded border transition-colors duration-200 ${form.delivery === opt ? 'bg-brand-teal text-white border-brand-teal' : 'bg-white text-brand-muted border-brand-border hover:border-brand-teal hover:text-brand-teal'}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {needsAddress && (
        <div className="flex flex-col gap-3">
          <div>
            <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Address line 1 *</label>
            <input type="text" required placeholder="House number and street" value={form.addrLine1} onChange={e => set('addrLine1', e.target.value)}
              className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal placeholder:text-brand-muted/50" />
          </div>
          <div>
            <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Address line 2</label>
            <input type="text" placeholder="Flat, building, etc. (optional)" value={form.addrLine2} onChange={e => set('addrLine2', e.target.value)}
              className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal placeholder:text-brand-muted/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">City *</label>
              <input type="text" required placeholder="London" value={form.addrCity} onChange={e => set('addrCity', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal placeholder:text-brand-muted/50" />
            </div>
            <div>
              <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Postcode *</label>
              <input type="text" required placeholder="SW15 1AA" value={form.addrPostcode} onChange={e => set('addrPostcode', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal placeholder:text-brand-muted/50" />
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block font-body text-[11px] tracking-[1.5px] uppercase text-brand-muted mb-2">Anything else?</label>
        <textarea rows={3} placeholder="Timing, special requests..." value={form.details} onChange={e => set('details', e.target.value)}
          className="w-full px-4 py-3 bg-white border border-brand-border rounded-md font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal resize-y placeholder:text-brand-muted/50" />
      </div>

      <button type="submit" disabled={status === 'sending'}
        className={`w-full font-body text-[11px] font-bold tracking-[2px] uppercase text-white py-4 px-8 rounded transition-opacity duration-200 hover:opacity-85 ${status === 'sending' ? 'bg-brand-muted cursor-not-allowed' : 'bg-brand-teal cursor-pointer'}`}>
        {status === 'sending' ? 'Sending…' : 'Send Order Request'}
      </button>

      <p className="font-body text-[12px] text-brand-muted text-center leading-[1.6]">
        Valentin replies within 24 hours. Payment on collection or agreed before delivery.
      </p>
    </form>
  );
}
