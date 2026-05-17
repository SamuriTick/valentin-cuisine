'use client'

import { useState } from 'react'
import { ContainerStandard } from './ContainerStandard'

interface WeightVariant { amount: string; unit: string; price: string }

interface Product {
  id: number
  name: string
  description: string | null
  price: string | null
  imageUrl: string | null
  category: string
  orderNote: string | null
  weights: WeightVariant[]
}

interface CartItem {
  productId: number
  name: string
  variantLabel: string | null
  price: string
  priceNum: number
  quantity: number
}

function parsePrice(raw: string | null): number {
  if (!raw) return 0
  return parseFloat(raw.replace(/[^0-9.]/g, '')) || 0
}

function formatPrice(n: number): string {
  return `£${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`
}

// ─── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAdd }: { product: Product; onAdd: (item: CartItem) => void }) {
  const hasVariants = product.weights.length > 0
  const [selectedVariant, setSelectedVariant] = useState<number>(0)
  const [qty, setQty] = useState('1')
  const [qtyError, setQtyError] = useState(false)

  const variant = hasVariants ? product.weights[selectedVariant] : null
  const displayPrice = variant ? variant.price : product.price

  function handleQtyChange(val: string) {
    // Only allow digits
    const cleaned = val.replace(/[^0-9]/g, '')
    setQty(cleaned)
    setQtyError(false)
  }

  function handleAdd() {
    const n = parseInt(qty, 10)
    if (!n || n < 1) { setQtyError(true); return }

    const priceStr = variant ? variant.price : (product.price ?? '0')
    onAdd({
      productId: product.id,
      name: product.name,
      variantLabel: variant ? `${variant.amount}${variant.unit}` : null,
      price: priceStr,
      priceNum: parsePrice(priceStr),
      quantity: n,
    })
    setQty('1')
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e8e3dc',
      borderRadius: 12,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Image */}
      {product.imageUrl ? (
        <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#f4f1ed' }}>
          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      ) : (
        <div style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg, #f4f1ed, #e8e3dc)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 48, color: '#b03060', opacity: 0.4 }}>V</span>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Category pill */}
        <span style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: '#b03060', fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>
          {product.category}
        </span>

        {/* Name + price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 500, color: '#1a1a1a', margin: 0, lineHeight: 1.2 }}>
            {product.name}
          </h3>
          {displayPrice && (
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: '#1a1a1a', whiteSpace: 'nowrap', fontWeight: 500 }}>
              {displayPrice}
            </span>
          )}
        </div>

        {product.description && (
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: '#7a7060', lineHeight: 1.7, margin: 0 }}>
            {product.description}
          </p>
        )}

        {product.orderNote && (
          <p style={{ fontSize: 11, color: '#aaa', fontStyle: 'italic', fontFamily: "'Nunito', sans-serif", margin: 0 }}>
            {product.orderNote}
          </p>
        )}

        <div style={{ flex: 1 }} />

        {/* Weight variant dropdown */}
        {hasVariants && (
          <div>
            <label style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7a7060', fontFamily: "'Nunito', sans-serif", display: 'block', marginBottom: 6 }}>
              Size
            </label>
            <select
              value={selectedVariant}
              onChange={e => setSelectedVariant(Number(e.target.value))}
              style={{
                width: '100%', padding: '9px 12px', border: '1px solid #e8e3dc', borderRadius: 6,
                fontSize: 14, fontFamily: "'Nunito', sans-serif", color: '#1a1a1a',
                background: '#fff', cursor: 'pointer', outline: 'none',
              }}
            >
              {product.weights.map((w, i) => (
                <option key={i} value={i}>
                  {w.amount}{w.unit} — {w.price}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quantity + Add to basket */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7a7060', fontFamily: "'Nunito', sans-serif" }}>
              Qty
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={qty}
              onChange={e => handleQtyChange(e.target.value)}
              onBlur={() => { if (!qty || parseInt(qty) < 1) setQtyError(true) }}
              style={{
                width: 60, padding: '9px 10px', border: `1px solid ${qtyError ? '#b03060' : '#e8e3dc'}`,
                borderRadius: 6, fontSize: 14, fontFamily: "'Nunito', sans-serif",
                textAlign: 'center', color: '#1a1a1a', outline: 'none',
              }}
              placeholder="1"
            />
            {qtyError && <span style={{ fontSize: 11, color: '#b03060', fontFamily: "'Nunito', sans-serif" }}>Numbers only</span>}
          </div>

          <button
            onClick={handleAdd}
            style={{
              flex: 1, marginTop: 21, padding: '10px 16px',
              background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 6,
              fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700,
              letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Add to basket
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Basket ───────────────────────────────────────────────────────────────────
function Basket({ items, onUpdate, onRemove, onClose }: {
  items: CartItem[]
  onUpdate: (productId: number, variantLabel: string | null, qty: number) => void
  onRemove: (productId: number, variantLabel: string | null) => void
  onClose: () => void
}) {
  const total = items.reduce((sum, i) => sum + i.priceNum * i.quantity, 0)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />

      {/* Panel */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 400,
        background: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e8e3dc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 500, color: '#1a1a1a', margin: 0 }}>Your basket</h2>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: '#aaa', margin: '2px 0 0' }}>
              {items.length === 0 ? 'Empty' : `${items.reduce((s, i) => s + i.quantity, 0)} item${items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#888', lineHeight: 1, padding: 4 }}>×</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: '#aaa', textAlign: 'center', marginTop: 40 }}>
              Nothing here yet — add something from the shop.
            </p>
          ) : (
            items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid #f4f1ed' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 500, color: '#1a1a1a', margin: '0 0 2px' }}>
                    {item.name}
                  </p>
                  {item.variantLabel && (
                    <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: '#7a7060', margin: '0 0 6px' }}>
                      {item.variantLabel}
                    </p>
                  )}
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: '#b03060', margin: 0, fontWeight: 600 }}>
                    {item.priceNum > 0 ? formatPrice(item.priceNum * item.quantity) : item.price}
                  </p>
                </div>

                {/* Qty control */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    onClick={() => item.quantity <= 1 ? onRemove(item.productId, item.variantLabel) : onUpdate(item.productId, item.variantLabel, item.quantity - 1)}
                    style={{ width: 28, height: 28, border: '1px solid #e8e3dc', borderRadius: 4, background: '#fff', cursor: 'pointer', fontSize: 16, lineHeight: 1, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >−</button>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={item.quantity}
                    onChange={e => {
                      const cleaned = e.target.value.replace(/[^0-9]/g, '')
                      const n = parseInt(cleaned, 10)
                      if (cleaned === '') return
                      if (n < 1) onRemove(item.productId, item.variantLabel)
                      else onUpdate(item.productId, item.variantLabel, n)
                    }}
                    style={{
                      width: 40, height: 28, textAlign: 'center', border: '1px solid #e8e3dc',
                      borderRadius: 4, fontFamily: "'Nunito', sans-serif", fontSize: 14, color: '#1a1a1a',
                      outline: 'none',
                    }}
                  />

                  <button
                    onClick={() => onUpdate(item.productId, item.variantLabel, item.quantity + 1)}
                    style={{ width: 28, height: 28, border: '1px solid #e8e3dc', borderRadius: 4, background: '#fff', cursor: 'pointer', fontSize: 16, lineHeight: 1, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >+</button>

                  <button
                    onClick={() => onRemove(item.productId, item.variantLabel)}
                    style={{ marginLeft: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 16, lineHeight: 1, padding: 0 }}
                  >✕</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e8e3dc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: '#7a7060' }}>Total</span>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 500, color: '#1a1a1a' }}>
                {total > 0 ? formatPrice(total) : '—'}
              </span>
            </div>
            <a
              href={`/contact?order=${encodeURIComponent(items.map(i => `${i.quantity}× ${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ''} @ ${i.price}`).join(', '))}`}
              style={{
                display: 'block', width: '100%', padding: '13px 0', textAlign: 'center',
                background: '#1a1a1a', color: '#fff', borderRadius: 7, textDecoration: 'none',
                fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '1.5px',
                textTransform: 'uppercase',
              }}
            >
              Place order
            </a>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, color: '#aaa', textAlign: 'center', marginTop: 10 }}>
              You'll be taken to the contact form to confirm.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ShopClient({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [basketOpen, setBasketOpen] = useState(false)
  const [addedId, setAddedId] = useState<number | null>(null)

  function addItem(item: CartItem) {
    setCart(prev => {
      const existing = prev.find(c => c.productId === item.productId && c.variantLabel === item.variantLabel)
      if (existing) {
        return prev.map(c =>
          c.productId === item.productId && c.variantLabel === item.variantLabel
            ? { ...c, quantity: c.quantity + item.quantity }
            : c
        )
      }
      return [...prev, item]
    })
    setAddedId(item.productId)
    setTimeout(() => setAddedId(null), 1500)
  }

  function updateItem(productId: number, variantLabel: string | null, qty: number) {
    setCart(prev => prev.map(c =>
      c.productId === productId && c.variantLabel === variantLabel ? { ...c, quantity: qty } : c
    ))
  }

  function removeItem(productId: number, variantLabel: string | null) {
    setCart(prev => prev.filter(c => !(c.productId === productId && c.variantLabel === variantLabel)))
  }

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  return (
    <div style={{ background: '#f4f1ed', minHeight: '100vh' }}>
      {/* Hero bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e3dc', paddingTop: 72 }}>
        <ContainerStandard className="py-8 md:py-12">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 18, color: '#b03060', margin: '0 0 8px', letterSpacing: 0.3 }}>
                Putney, London
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 300, color: '#1a1a1a', margin: 0, lineHeight: 1.1, letterSpacing: '-1px' }}>
                The <span style={{ fontWeight: 600, fontStyle: 'italic', color: '#b03060' }}>Shop</span>
              </h1>
            </div>

            {/* Basket button */}
            <button
              onClick={() => setBasketOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px',
                background: cartCount > 0 ? '#1a1a1a' : '#fff',
                color: cartCount > 0 ? '#fff' : '#1a1a1a',
                border: '1px solid #1a1a1a', borderRadius: 7, cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 700,
                transition: 'all 0.2s',
              }}
            >
              <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
                <path d="M1 1h2.5l2 8h9l2-6H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8" cy="14.5" r="1" fill="currentColor"/>
                <circle cx="14" cy="14.5" r="1" fill="currentColor"/>
              </svg>
              Basket
              {cartCount > 0 && (
                <span style={{
                  background: '#b03060', color: '#fff', borderRadius: '99px',
                  fontSize: 11, fontWeight: 700, padding: '1px 7px', lineHeight: '18px',
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </ContainerStandard>
      </div>

      {/* Products grid */}
      <ContainerStandard className="py-10 md:py-14">
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, color: '#7a7060', fontStyle: 'italic' }}>
              Nothing available right now — check back soon.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {products.map(p => (
              <div key={p.id} style={{ position: 'relative' }}>
                {addedId === p.id && (
                  <div style={{
                    position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
                    background: '#1a1a1a', color: '#fff', borderRadius: 5, padding: '5px 14px',
                    fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700,
                    letterSpacing: '1px', textTransform: 'uppercase', zIndex: 10, whiteSpace: 'nowrap',
                    animation: 'fadeIn 0.15s ease',
                  }}>
                    Added ✓
                  </div>
                )}
                <ProductCard product={p} onAdd={addItem} />
              </div>
            ))}
          </div>
        )}
      </ContainerStandard>

      {/* Basket drawer */}
      {basketOpen && (
        <Basket
          items={cart}
          onUpdate={updateItem}
          onRemove={removeItem}
          onClose={() => setBasketOpen(false)}
        />
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(-4px) } to { opacity: 1; transform: translateX(-50%) translateY(0) } }
      `}</style>
    </div>
  )
}
