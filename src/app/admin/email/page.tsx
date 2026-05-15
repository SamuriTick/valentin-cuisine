"use client"

import { useState, useEffect, useCallback } from "react"
import { s } from "@/components/admin/AdminUI"

type Tab = "templates" | "subscribers" | "sent"

type Template = {
  slug: string
  name: string
  subject: string
  body: string
}

type Signup = {
  id: number
  name: string
  email: string
  location: string | null
  wantsToTry: string | null
  optIn: boolean
  createdAt: string
}

type Campaign = {
  id: number
  subject: string
  body: string
  recipientCount: number
  sentAt: string
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'template'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

const PLACEHOLDER_BODY = `<p>Hi {{name}},</p>

<p>Write your message here.</p>

<p>Cheers,<br />Valentin</p>`

export default function EmailPage() {
  const [tab, setTab] = useState<Tab>("templates")
  const [templates, setTemplates] = useState<Template[]>([])
  const [subscribers, setSubscribers] = useState<Signup[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)

  // Template editing
  const [editingTpl, setEditingTpl] = useState<Template | null>(null)
  const [editForm, setEditForm] = useState({ name: '', subject: '', body: '' })
  const [tplSaving, setTplSaving] = useState(false)
  const [tplError, setTplError] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  // Compose / send
  const [composing, setComposing] = useState(false)
  const [composeForm, setComposeForm] = useState({ subject: '', htmlBody: '' })
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState('')
  const [sendError, setSendError] = useState('')
  const [showSendPreview, setShowSendPreview] = useState(false)

  const loadTemplates = useCallback(async () => {
    const res = await fetch('/api/admin/email/templates')
    if (res.ok) setTemplates(await res.json())
  }, [])

  const loadSubscribers = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/email/subscribers')
    if (res.ok) setSubscribers(await res.json())
    setLoading(false)
  }, [])

  const loadCampaigns = useCallback(async () => {
    const res = await fetch('/api/admin/email/campaigns')
    if (res.ok) setCampaigns(await res.json())
  }, [])

  useEffect(() => {
    loadTemplates()
    loadSubscribers()
    loadCampaigns()
  }, [loadTemplates, loadSubscribers, loadCampaigns])

  // ── Template CRUD ──────────────────────────────────────────────────────────

  function openNewTemplate() {
    const blank: Template = { slug: '', name: '', subject: '', body: PLACEHOLDER_BODY }
    setEditingTpl(blank)
    setEditForm({ name: '', subject: '', body: PLACEHOLDER_BODY })
    setTplError('')
    setShowPreview(false)
  }

  function openEditTemplate(tpl: Template) {
    setEditingTpl(tpl)
    setEditForm({ name: tpl.name, subject: tpl.subject, body: tpl.body })
    setTplError('')
    setShowPreview(false)
  }

  async function saveTemplate() {
    if (!editForm.name.trim()) { setTplError('Template name is required.'); return }
    setTplSaving(true); setTplError('')
    const slug = editingTpl?.slug || slugify(editForm.name)
    const res = await fetch('/api/admin/email/templates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, ...editForm }),
    })
    if (!res.ok) { setTplError('Failed to save template.'); setTplSaving(false); return }
    await loadTemplates()
    setEditingTpl(null)
    setTplSaving(false)
  }

  async function deleteTemplate(slug: string) {
    if (!confirm('Delete this template?')) return
    await fetch(`/api/admin/email/templates?slug=${slug}`, { method: 'DELETE' })
    await loadTemplates()
  }

  // ── Compose / send ─────────────────────────────────────────────────────────

  function openCompose(tpl?: Template) {
    setComposeForm({ subject: tpl?.subject ?? '', htmlBody: tpl?.body ?? '' })
    setSendResult(''); setSendError(''); setShowSendPreview(false)
    setComposing(true)
  }

  async function handleSend() {
    if (!composeForm.subject.trim() || !composeForm.htmlBody.trim()) {
      setSendError('Subject and body are required.'); return
    }
    setSending(true); setSendError(''); setSendResult('')
    try {
      const res = await fetch('/api/admin/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(composeForm),
      })
      const data = await res.json()
      if (!res.ok) {
        setSendError(data.error ?? 'Failed to send.')
      } else {
        setSendResult(`Sent to ${data.sent} subscriber${data.sent !== 1 ? 's' : ''}.${data.failed ? ` ${data.failed} failed.` : ''}`)
        await loadCampaigns()
      }
    } catch { setSendError('Network error. Please try again.') }
    setSending(false)
  }

  // ── Shared styles ──────────────────────────────────────────────────────────

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 18px', fontSize: '13px',
    fontWeight: active ? 700 : 400,
    color: active ? '#1a1a1a' : '#7A7060',
    background: active ? '#fff' : 'transparent',
    border: '1px solid', borderColor: active ? '#e8e3dc' : 'transparent',
    borderBottom: active ? '1px solid #fff' : '1px solid #e8e3dc',
    borderRadius: '6px 6px 0 0', cursor: 'pointer', marginBottom: '-1px',
    position: 'relative', fontFamily: "'Nunito', sans-serif",
  })

  const inputStyle: React.CSSProperties = {
    ...s.input as React.CSSProperties,
    fontFamily: "'Nunito', sans-serif",
  }

  const textareaStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', border: '1px solid #DDD8CC',
    borderRadius: '6px', fontSize: '13px', fontFamily: "monospace",
    background: '#faf8f5', color: '#1a1a1a', boxSizing: 'border-box',
    resize: 'vertical', minHeight: '280px', lineHeight: '1.6',
  }

  return (
    <div style={{ maxWidth: '960px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={s.heading as React.CSSProperties}>Email</h1>
        <button style={s.btnGold as React.CSSProperties} onClick={() => openCompose()}>
          Compose & send
        </button>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e8e3dc' }}>
        <button style={tabStyle(tab === 'templates')} onClick={() => setTab('templates')}>
          Templates {templates.length > 0 && `(${templates.length})`}
        </button>
        <button style={tabStyle(tab === 'subscribers')} onClick={() => setTab('subscribers')}>
          Subscribers {subscribers.length > 0 && `(${subscribers.length})`}
        </button>
        <button style={tabStyle(tab === 'sent')} onClick={() => setTab('sent')}>
          Sent {campaigns.length > 0 && `(${campaigns.length})`}
        </button>
      </div>

      {/* Tab content */}
      <div style={{ ...(s.card as React.CSSProperties), borderTopLeftRadius: 0, marginTop: 0 }}>

        {/* ── Templates ── */}
        {tab === 'templates' && (
          <div>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8e3dc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 13, color: '#7A7060', margin: 0 }}>
                Save your go-to emails as templates — edit once, send any time.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={async () => {
                    await fetch('/api/admin/email/seed-defaults', { method: 'POST' })
                    await loadTemplates()
                  }}
                  style={{ ...(s.btnGhost as React.CSSProperties), fontSize: 12 }}
                >
                  Load defaults
                </button>
                <button onClick={openNewTemplate} style={s.btnPrimary as React.CSSProperties}>
                  + New template
                </button>
              </div>
            </div>

            {templates.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center' }}>
                <p style={{ fontSize: 15, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: '#1a1a1a', marginBottom: 6 }}>
                  No templates yet
                </p>
                <p style={{ fontSize: 13, color: '#7A7060', marginBottom: 20 }}>
                  Load the built-in contact and order confirmation templates, or create your own.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={async () => {
                      await fetch('/api/admin/email/seed-defaults', { method: 'POST' })
                      await loadTemplates()
                    }}
                    style={s.btnGold as React.CSSProperties}
                  >
                    Load built-in templates
                  </button>
                  <button onClick={openNewTemplate} style={s.btnPrimary as React.CSSProperties}>
                    Create from scratch
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1px', background: '#e8e3dc' }}>
                {templates.map(tpl => (
                  <div key={tpl.slug} style={{ background: '#fff', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{tpl.name}</p>
                      <p style={{ fontSize: 12, color: '#7A7060', margin: '0 0 6px', fontFamily: "'Nunito', sans-serif" }}>
                        Subject: {tpl.subject || <em>no subject</em>}
                      </p>
                      <p style={{ fontSize: 12, color: '#7A7060', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 480, fontFamily: "'Nunito', sans-serif" }}>
                        {tpl.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120)}…
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => openEditTemplate(tpl)} style={{ ...(s.btnGhost as React.CSSProperties), fontSize: 12 }}>
                        Edit
                      </button>
                      <button onClick={() => openCompose(tpl)} style={{ ...(s.btnPrimary as React.CSSProperties), fontSize: 12 }}>
                        Send
                      </button>
                      <button onClick={() => deleteTemplate(tpl.slug)} style={{ fontSize: 12, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Subscribers ── */}
        {tab === 'subscribers' && (
          loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#7A7060' }}>Loading...</div>
          ) : subscribers.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#7A7060' }}>
              No subscribers yet. People who fill in the waiting list form will appear here.
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={s.tableHead as React.CSSProperties}>
                  <tr>
                    <th style={s.th as React.CSSProperties}>Name</th>
                    <th style={s.th as React.CSSProperties}>Email</th>
                    <th style={s.th as React.CSSProperties}>Location</th>
                    <th style={s.th as React.CSSProperties}>Wants to try</th>
                    <th style={s.th as React.CSSProperties}>Updates</th>
                    <th style={s.th as React.CSSProperties}>Signed up</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map(sub => (
                    <tr key={sub.id}>
                      <td style={s.td as React.CSSProperties}><strong>{sub.name}</strong></td>
                      <td style={{ ...(s.td as React.CSSProperties), fontSize: '13px' }}>
                        <a href={`mailto:${sub.email}`} style={{ color: '#1E3A1E', textDecoration: 'none' }}>{sub.email}</a>
                      </td>
                      <td style={{ ...(s.td as React.CSSProperties), color: '#7A7060', fontSize: '13px' }}>{sub.location || '—'}</td>
                      <td style={{ ...(s.td as React.CSSProperties), color: '#7A7060', fontSize: '13px' }}>{sub.wantsToTry || '—'}</td>
                      <td style={{ ...(s.td as React.CSSProperties), fontSize: '13px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, background: sub.optIn ? '#DCFCE7' : '#F3F4F6', color: sub.optIn ? '#166534' : '#6B7280' }}>
                          {sub.optIn ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td style={{ ...(s.td as React.CSSProperties), color: '#7A7060', fontSize: '13px' }}>{formatDate(sub.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* ── Sent ── */}
        {tab === 'sent' && (
          campaigns.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#7A7060' }}>
              No campaigns sent yet. Compose an email and send it to your subscribers.
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={s.tableHead as React.CSSProperties}>
                  <tr>
                    <th style={s.th as React.CSSProperties}>Subject</th>
                    <th style={s.th as React.CSSProperties}>Recipients</th>
                    <th style={s.th as React.CSSProperties}>Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(c => (
                    <tr key={c.id}>
                      <td style={s.td as React.CSSProperties}><strong>{c.subject}</strong></td>
                      <td style={{ ...(s.td as React.CSSProperties), color: '#7A7060', fontSize: '13px' }}>{c.recipientCount}</td>
                      <td style={{ ...(s.td as React.CSSProperties), color: '#7A7060', fontSize: '13px' }}>{formatDate(c.sentAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* ── Template edit modal ── */}
      {editingTpl !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }}>
          <div style={{ background: '#F8F5EE', borderRadius: 12, width: '100%', maxWidth: 760, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

            {/* Modal header */}
            <div style={{ padding: '20px 28px', borderBottom: '1px solid #e8e3dc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: 0, fontFamily: "'Nunito', sans-serif" }}>
                {editingTpl.slug ? 'Edit template' : 'New template'}
              </h2>
              <button onClick={() => setEditingTpl(null)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: '24px 28px' }}>
              {tplError && (
                <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '8px 12px', borderRadius: 6, fontSize: 13, marginBottom: 16 }}>
                  {tplError}
                </div>
              )}

              <div style={s.row as React.CSSProperties}>
                <label style={s.label as React.CSSProperties}>Template name</label>
                <input
                  style={inputStyle}
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Kimchi Batch Ready"
                />
              </div>

              <div style={s.row as React.CSSProperties}>
                <label style={s.label as React.CSSProperties}>Email subject</label>
                <input
                  style={inputStyle}
                  value={editForm.subject}
                  onChange={e => setEditForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="e.g. Fresh kimchi is available for collection"
                />
              </div>

              <div style={s.row as React.CSSProperties}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ ...(s.label as React.CSSProperties), marginBottom: 0 }}>Body (HTML)</label>
                  <button
                    onClick={() => setShowPreview(p => !p)}
                    style={{ fontSize: 12, color: '#b03060', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}
                  >
                    {showPreview ? 'Edit' : 'Preview'}
                  </button>
                </div>
                {showPreview ? (
                  <div style={{ border: '1px solid #DDD8CC', borderRadius: 6, padding: '16px 20px', background: '#fff', minHeight: 280, fontSize: 14, lineHeight: 1.7, color: '#1a1a1a' }}
                    dangerouslySetInnerHTML={{ __html: editForm.body }}
                  />
                ) : (
                  <textarea
                    style={textareaStyle}
                    value={editForm.body}
                    onChange={e => setEditForm(f => ({ ...f, body: e.target.value }))}
                    placeholder={PLACEHOLDER_BODY}
                  />
                )}
                <p style={{ fontSize: 11, color: '#7A7060', marginTop: 6, fontFamily: "'Nunito', sans-serif" }}>
                  Use HTML for formatting. Use <code style={{ background: '#f4f1ed', padding: '1px 4px', borderRadius: 3 }}>{'{{name}}'}</code> to include the subscriber's name.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                <button onClick={() => setEditingTpl(null)} style={s.btnGhost as React.CSSProperties} disabled={tplSaving}>
                  Cancel
                </button>
                <button onClick={saveTemplate} disabled={tplSaving} style={{ ...(s.btnPrimary as React.CSSProperties), opacity: tplSaving ? 0.6 : 1 }}>
                  {tplSaving ? 'Saving…' : 'Save template'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Compose & send modal ── */}
      {composing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }}>
          <div style={{ background: '#F8F5EE', borderRadius: 12, width: '100%', maxWidth: 760, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

            {/* Modal header */}
            <div style={{ padding: '20px 28px', borderBottom: '1px solid #e8e3dc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: 0, fontFamily: "'Nunito', sans-serif" }}>
                  Send email
                </h2>
                <p style={{ fontSize: 12, color: '#7A7060', margin: '4px 0 0', fontFamily: "'Nunito', sans-serif" }}>
                  Sending to {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button onClick={() => setComposing(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: '24px 28px' }}>
              {/* Template picker */}
              {templates.length > 0 && !sendResult && (
                <div style={s.row as React.CSSProperties}>
                  <label style={s.label as React.CSSProperties}>Load from template</label>
                  <select
                    style={s.select as React.CSSProperties}
                    defaultValue=""
                    onChange={e => {
                      const tpl = templates.find(t => t.slug === e.target.value)
                      if (tpl) setComposeForm({ subject: tpl.subject, htmlBody: tpl.body })
                    }}
                  >
                    <option value="">— Start fresh —</option>
                    {templates.map(t => <option key={t.slug} value={t.slug}>{t.name}</option>)}
                  </select>
                </div>
              )}

              {sendError && (
                <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '8px 12px', borderRadius: 6, fontSize: 13, marginBottom: 16 }}>
                  {sendError}
                </div>
              )}

              {sendResult ? (
                <div style={{ background: '#F0FDF4', color: '#166534', padding: '16px 20px', borderRadius: 8, fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
                  {sendResult}
                </div>
              ) : (
                <>
                  <div style={s.row as React.CSSProperties}>
                    <label style={s.label as React.CSSProperties}>Subject</label>
                    <input
                      style={inputStyle}
                      value={composeForm.subject}
                      onChange={e => setComposeForm(f => ({ ...f, subject: e.target.value }))}
                      placeholder="e.g. Kimchi is ready for collection"
                    />
                  </div>

                  <div style={s.row as React.CSSProperties}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <label style={{ ...(s.label as React.CSSProperties), marginBottom: 0 }}>Body (HTML)</label>
                      <button
                        onClick={() => setShowSendPreview(p => !p)}
                        style={{ fontSize: 12, color: '#b03060', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}
                      >
                        {showSendPreview ? 'Edit' : 'Preview'}
                      </button>
                    </div>
                    {showSendPreview ? (
                      <div style={{ border: '1px solid #DDD8CC', borderRadius: 6, padding: '16px 20px', background: '#fff', minHeight: 220, fontSize: 14, lineHeight: 1.7, color: '#1a1a1a' }}
                        dangerouslySetInnerHTML={{ __html: composeForm.htmlBody }}
                      />
                    ) : (
                      <textarea
                        style={{ ...textareaStyle, minHeight: 220 }}
                        value={composeForm.htmlBody}
                        onChange={e => setComposeForm(f => ({ ...f, htmlBody: e.target.value }))}
                        placeholder="Write your message here. HTML is supported."
                      />
                    )}
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                <button onClick={() => { setComposing(false); setSendResult(''); setSendError('') }} style={s.btnGhost as React.CSSProperties} disabled={sending}>
                  {sendResult ? 'Close' : 'Cancel'}
                </button>
                {!sendResult && (
                  <button onClick={handleSend} disabled={sending} style={{ ...(s.btnPrimary as React.CSSProperties), opacity: sending ? 0.6 : 1 }}>
                    {sending ? 'Sending…' : `Send to ${subscribers.length} subscriber${subscribers.length !== 1 ? 's' : ''}`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
