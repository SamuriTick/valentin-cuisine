'use client';

import { useState } from 'react';

interface Variant { amount: string; unit: string; price: string }

interface Props {
  pricePerJar?: number
  variants?: Variant[]
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const BANK_NAME = 'MSTR Valentin Thang'
const BANK_SORT = '20-90-74'
const BANK_ACCOUNT = '33552330'

export function KimchiOrderForm({ pricePerJar = 15, variants = [] }: Props) {
  const hasVariants = variants.length > 0

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    jars: '1',
    variantIndex: '0',
    dietary: '',
    details: '',
  });
  const [emailError, setEmailError] = useState('');
  const [paidTotal, setPaidTotal] = useState(0);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }
  function withPound(s: string): string { const t = s.trim(); return t.startsWith('£') ? t : `£${t}` }

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
      return `${jars}× ${v?.amount ?? ''}${v?.unit ?? ''} (${v?.price ? withPound(v.price) : ''})`
    }
    return `${jars} jar${jars > 1 ? 's' : ''} × £${pricePerJar} = £${getTotal()}`
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(form.email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    setStatus('sending');
    try {
      const jars = parseInt(form.jars, 10);
      const total = getTotal();
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email.trim(),
          phone: form.phone.trim(),
          occasion: `Kimchi order — ${getOrderLabel()}${form.dietary ? ` · dietary: ${form.dietary}` : ''}} · Collection (Putney)`,
          details: form.details,
          jars,
          total,
        }),
      });
      if (res.ok) setPaidTotal(total);
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="px-8 py-10 bg-brand-green-light border border-brand-border rounded-2xl text-center">
        <p className="font-body text-xl font-semibold text-brand-dark mb-2">Order sent!</p>
        <p className="font-body text-sm text-brand-muted mb-6">Thanks {form.name}! To confirm your order, please pay by bank transfer:</p>
        <div className="mx-auto max-w-sm text-left bg-white border border-brand-border rounded-xl divide-y divide-brand-border">
          {[
            ['Name', BANK_NAME],
            ['Sort code', BANK_SORT],
            ['Account', BANK_ACCOUNT],
            ['Amount', `£${paidTotal % 1 === 0 ? paidTotal.toFixed(0) : paidTotal.toFixed(2)}`],
            ['Reference', form.name],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 px-4 py-3">
              <span className="font-body text-[13px] text-brand-muted">{k}</span>
              <span className="font-body text-sm text-brand-dark font-semibold text-right">{v}</span>
            </div>
          ))}
        </div>
        <p className="font-body text-[12px] text-brand-muted mt-6">These details are also in your confirmation email. Once I see your payment, your order will be ready to collect on the 25th at The Panda&apos;s Pantry in Putney, SW London.</p>
      </div>
    );
  }

  const total = getTotal()

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {status === 'error' && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 font-body text-[13px] rounded-xl">
          Something went wrong — please try again.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-body text-[13px] text-brand-muted mb-2">Name *</label>
          <input type="text" required value={form.name} onChange={e => set('name', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal" />
        </div>
        <div>
          <label className="block font-body text-[13px] text-brand-muted mb-2">Email *</label>
          <input type="email" required value={form.email} onChange={e => { set('email', e.target.value); setEmailError('') }}
            className={`w-full px-4 py-3 bg-white border rounded-xl font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal ${emailError ? 'border-red-400' : 'border-brand-border'}`} />
          {emailError && <p className="font-body text-[12px] text-red-600 mt-1">{emailError}</p>}
        </div>
      </div>

      <div>
        <label className="block font-body text-[13px] text-brand-muted mb-2">Phone number</label>
        <input type="tel" placeholder="Optional" value={form.phone} onChange={e => set('phone', e.target.value)}
          className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal placeholder:text-brand-muted/50" />
      </div>

      {hasVariants && (
        <div>
          <label className="block font-body text-[13px] text-brand-muted mb-2">Size</label>
          <select value={form.variantIndex} onChange={e => set('variantIndex', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal cursor-pointer">
            {variants.map((v, i) => (
              <option key={i} value={i}>{v.amount}{v.unit} ({withPound(v.price)})</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block font-body text-[13px] text-brand-muted mb-2">
          {hasVariants ? 'How many?' : 'How many jars?'}
        </label>
        <select value={form.jars} onChange={e => set('jars', e.target.value)}
          className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal cursor-pointer">
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
        <label className="block font-body text-[13px] text-brand-muted mb-2">Dietary requirements</label>
        <input type="text" placeholder="Any dietary needs or allergies?" value={form.dietary} onChange={e => set('dietary', e.target.value)}
          className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal placeholder:text-brand-muted/50" />
      </div>

      <div className="px-4 py-3 bg-brand-green-light border border-brand-border rounded-xl font-body text-[13px] text-brand-dark">
        Collection only, from The Panda&apos;s Pantry in Putney (SW London). Ready to collect on the 25th.
      </div>

      <div>
        <label className="block font-body text-[13px] text-brand-muted mb-2">Anything else?</label>
        <textarea rows={3} placeholder="Timing, special requests..." value={form.details} onChange={e => set('details', e.target.value)}
          className="w-full px-4 py-3 bg-white border border-brand-border rounded-xl font-body text-sm text-brand-dark outline-none transition-colors duration-200 focus:border-brand-teal resize-y placeholder:text-brand-muted/50" />
      </div>

      <button type="submit" disabled={status === 'sending'}
        className={`w-full font-body text-[13px] font-bold text-white py-4 px-8 rounded-full transition-opacity duration-200 hover:opacity-85 ${status === 'sending' ? 'bg-brand-muted cursor-not-allowed' : 'bg-brand-teal cursor-pointer'}`}>
        {status === 'sending' ? 'Sending…' : 'Send Order Request'}
      </button>

      <p className="font-body text-[12px] text-brand-muted text-center leading-[1.6]">
        Valentin replies within 24 hours. Pay by bank transfer: details shown after you send your order.
      </p>
    </form>
  );
}
