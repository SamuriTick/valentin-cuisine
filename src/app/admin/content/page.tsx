'use client'

import { useState, useEffect } from 'react'
import { EditProvider } from '@/components/admin/visual/EditContext'
import { HeroSection } from '@/components/cuisine/HeroSection'
import { AboutTab } from '@/components/cuisine/AboutTab'
import { SpecialtiesTab } from '@/components/cuisine/SpecialtiesTab'
import { GalleryTab } from '@/components/cuisine/GalleryTab'
import { MentoringSection } from '@/components/cuisine/MentoringSection'
import { OrderTab } from '@/components/cuisine/OrderTab'
import { t as defaults } from '@/components/cuisine/translations'
import { KimchiEditSections, type KimchiContent } from '@/components/cuisine/KimchiEditSections'
import { ContactEditSections, type ContactContent } from '@/components/cuisine/ContactEditSections'

const KIMCHI_DEFAULTS: KimchiContent = {
  heroImage: '',
  heroEyebrow: 'Hand-made in Putney, London',
  heroTitle1: 'Spicy. Salty.',
  heroTitle2: 'Umami-rich.',
  heroDesc: "Not your standard recipe: blended, not layered, with a Vietnamese twist. Made fresh to order. Goes with literally everything.",
  heroPrice: '£15',
  heroPriceSub: 'for 2kg · glass jar · no microplastics',
  quote: "I haven't been making kimchi for a while because I'm a kid and I'm still in school. But now I have time, so buy my kimchi. It's probably going to sell out in a few weeks.",
  tasteEyebrow: 'What it tastes like',
  tasteTitle1: 'Four things happening',
  tasteTitle2: 'at once.',
  taste: [
    { label: 'Spicy', desc: "The kick has to be there: that's non-negotiable. It'll attack your mouth a little." },
    { label: 'Umami', desc: "Dried Vietnamese shrimp adds a depth you won't get from fermented shrimp. The secret." },
    { label: 'Salty', desc: "Fish sauce, soy sauce, and brine from the fermentation itself." },
    { label: 'Sweet', desc: "Just a tiny bit. Barely there, but you'd miss it if it wasn't." },
  ],
}

const CONTACT_DEFAULTS: ContactContent = {
  heroEyebrow: 'Putney, London',
  heroTitlePrefix: 'Get in',
  heroTitle: 'touch.',
  heroDesc: 'Whether you want to order food or talk about mentoring me, use the form below. I reply within 24 hours.',
  foodItems: [
    { label: 'Kimchi', body: 'Hand-made, blended with a Vietnamese twist. £15 for 2kg in a glass jar. SW London collection or Royal Mail.' },
    { label: 'Custom cakes', body: 'Celebration cakes made to order. Tell me the flavour, design, and date and I will handle the rest.' },
    { label: 'Sourdough & pastries', body: 'I bake to order on weekends and school holidays. Ask and I will tell you what is available.' },
  ],
  mentorBody: "I am 13 and I genuinely love learning from people who know more than me. If you work in food, hospitality, business, or anything creative and you are open to a conversation, I would love that. No agenda, just curiosity.",
}

const PAGES = [
  { id: 'home',    label: 'Home' },
  { id: 'kimchi',  label: 'Kimchi' },
  { id: 'contact', label: 'Contact' },
]

export default function VisualContentEditor() {
  const [page, setPage] = useState<'home' | 'kimchi' | 'contact'>('home')
  const [editMode, setEditMode] = useState(false)
  const [content, setContent] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [galleryPhotos, setGalleryPhotos] = useState<{ url: string; alt: string }[]>([])

  useEffect(() => {
    fetch('/api/admin/content')
      .then(r => r.ok ? r.json() : [])
      .then((rows: { key: string; lang: string; value: string }[]) => {
        const map: Record<string, string> = {}
        for (const row of rows) if (row.lang === 'en') map[row.key] = row.value
        setContent(map)
      })
    fetch('/api/media?fileType=image')
      .then(r => r.ok ? r.json() : [])
      .then((items: { filePath?: string; url?: string; altText?: string; filename?: string }[]) => {
        setGalleryPhotos(items.map(i => ({ url: i.filePath ?? i.url ?? i.filename ?? '', alt: i.altText ?? '' })))
      })
  }, [])

  async function saveField(key: string, value: string) {
    setStatus('saving')
    setContent(c => ({ ...c, [key]: value }))
    await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ key, lang: 'en', value }]),
    })
    setStatus('saved')
    setTimeout(() => setStatus('idle'), 2000)
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Build merged translation object
  const t = {
    ...defaults,
    heroEyebrow: content['hero.eyebrow'] ?? defaults.heroEyebrow,
    heroTitle: [
      content['hero.title1'] ?? defaults.heroTitle[0],
      content['hero.title2'] ?? defaults.heroTitle[1],
      content['hero.title3'] ?? defaults.heroTitle[2],
    ],
    heroSub:   content['hero.sub']   ?? defaults.heroSub,
    heroCta:   content['hero.cta']   ?? defaults.heroCta,
    heroLearn: content['hero.learn'] ?? defaults.heroLearn,
    aboutAvatar:      content['about.avatar']        ?? defaults.aboutAvatar,
    taglineSub:       content['about.tagline_sub']  ?? defaults.taglineSub,
    aboutEyebrow:     content['about.eyebrow']      ?? defaults.aboutEyebrow,
    aboutTitle: [
      content['about.title1'] ?? defaults.aboutTitle[0],
      content['about.title2'] ?? defaults.aboutTitle[1],
    ],
    aboutBody1:       content['about.body1']        ?? defaults.aboutBody1,
    aboutBody2:       content['about.body2']        ?? defaults.aboutBody2,
    aboutQuote:       content['about.quote']        ?? defaults.aboutQuote,
    aboutQuoteCredit: content['about.quote_credit'] ?? defaults.aboutQuoteCredit,
    statsLabel1: content['stats.label1'] ?? defaults.statsLabel1,
    statsDesc1:  content['stats.desc1']  ?? defaults.statsDesc1,
    statsLabel2: content['stats.label2'] ?? defaults.statsLabel2,
    statsDesc2:  content['stats.desc2']  ?? defaults.statsDesc2,
    statsLabel3: content['stats.label3'] ?? defaults.statsLabel3,
    statsDesc3:  content['stats.desc3']  ?? defaults.statsDesc3,
    storyTitle1: content['story.title1'] ?? defaults.storyTitle1,
    storyBody1:  content['story.body1']  ?? defaults.storyBody1,
    storyTitle2: content['story.title2'] ?? defaults.storyTitle2,
    storyBody2:  content['story.body2']  ?? defaults.storyBody2,
    storyTitle3: content['story.title3'] ?? defaults.storyTitle3,
    storyBody3:  content['story.body3']  ?? defaults.storyBody3,
    storyTitle4: content['story.title4'] ?? defaults.storyTitle4,
    storyBody4:  content['story.body4']  ?? defaults.storyBody4,
    specEyebrow: content['spec.eyebrow'] ?? defaults.specEyebrow,
    specTitle:   content['spec.title']   ?? defaults.specTitle,
    dishes: defaults.dishes.map((dish, i) => ({
      name: content[`dish.${i}.name`] ?? dish.name,
      desc: content[`dish.${i}.desc`] ?? dish.desc,
    })),
    // Order
    orderEyebrowAlt: content['order.eyebrow'] ?? defaults.orderEyebrowAlt,
    orderTitleAlt:   content['order.title']   ?? defaults.orderTitleAlt,
    orderBodyAlt:    content['order.body']    ?? defaults.orderBodyAlt,
    orderBullet1:    content['order.bullet1'] ?? defaults.orderBullet1,
    orderBullet2:    content['order.bullet2'] ?? defaults.orderBullet2,
    orderBullet3:    content['order.bullet3'] ?? defaults.orderBullet3,
    // Mentoring
    mentorEyebrow:    content['mentor.eyebrow']      ?? defaults.mentorEyebrow,
    mentorTitle1:     content['mentor.title1']        ?? defaults.mentorTitle1,
    mentorTitle2:     content['mentor.title2']        ?? defaults.mentorTitle2,
    mentorBody1:      content['mentor.body1']         ?? defaults.mentorBody1,
    mentorBody2:      content['mentor.body2']         ?? defaults.mentorBody2,
    mentorItem1Label: content['mentor.item1.label']   ?? defaults.mentorItem1Label,
    mentorItem1Body:  content['mentor.item1.body']    ?? defaults.mentorItem1Body,
    mentorItem2Label: content['mentor.item2.label']   ?? defaults.mentorItem2Label,
    mentorItem2Body:  content['mentor.item2.body']    ?? defaults.mentorItem2Body,
    mentorItem3Label: content['mentor.item3.label']   ?? defaults.mentorItem3Label,
    mentorItem3Body:  content['mentor.item3.body']    ?? defaults.mentorItem3Body,
    // Gallery
    galleryEyebrow: content['gallery.eyebrow'] ?? defaults.galleryEyebrow,
    galleryTitle:   content['gallery.title']   ?? defaults.galleryTitle,
  }

  const heroImage = content['hero.image'] ?? '/valentin-hero.jpg'

  const kimchiContent: KimchiContent = {
    heroImage:   content['kimchi.hero.image']   ?? KIMCHI_DEFAULTS.heroImage,
    heroEyebrow: content['kimchi.hero.eyebrow'] ?? KIMCHI_DEFAULTS.heroEyebrow,
    heroTitle1:  content['kimchi.hero.title1']  ?? KIMCHI_DEFAULTS.heroTitle1,
    heroTitle2:  content['kimchi.hero.title2']  ?? KIMCHI_DEFAULTS.heroTitle2,
    heroDesc:    content['kimchi.hero.desc']    ?? KIMCHI_DEFAULTS.heroDesc,
    heroPrice:   content['kimchi.hero.price']   ?? KIMCHI_DEFAULTS.heroPrice,
    heroPriceSub: content['kimchi.hero.price_sub'] ?? KIMCHI_DEFAULTS.heroPriceSub,
    quote:       content['kimchi.quote']        ?? KIMCHI_DEFAULTS.quote,
    tasteEyebrow: content['kimchi.taste.eyebrow'] ?? KIMCHI_DEFAULTS.tasteEyebrow,
    tasteTitle1: content['kimchi.taste.title1'] ?? KIMCHI_DEFAULTS.tasteTitle1,
    tasteTitle2: content['kimchi.taste.title2'] ?? KIMCHI_DEFAULTS.tasteTitle2,
    taste: KIMCHI_DEFAULTS.taste.map((item, i) => ({
      label: content[`kimchi.taste.${i}.label`] ?? item.label,
      desc:  content[`kimchi.taste.${i}.desc`]  ?? item.desc,
    })),
  }

  const contactContent: ContactContent = {
    heroEyebrow:     content['contact.hero.eyebrow']       ?? CONTACT_DEFAULTS.heroEyebrow,
    heroTitlePrefix: content['contact.hero.title_prefix']  ?? CONTACT_DEFAULTS.heroTitlePrefix,
    heroTitle:       content['contact.hero.title']         ?? CONTACT_DEFAULTS.heroTitle,
    heroDesc:    content['contact.hero.desc']    ?? CONTACT_DEFAULTS.heroDesc,
    foodItems: CONTACT_DEFAULTS.foodItems.map((item, i) => ({
      label: content[`contact.food.${i}.label`] ?? item.label,
      body:  content[`contact.food.${i}.body`]  ?? item.body,
    })),
    mentorBody: content['contact.mentor.body'] ?? CONTACT_DEFAULTS.mentorBody,
  }

  return (
    <div className="admin-content-page" style={{ margin: '-36px -40px', paddingTop: 52 }}>

      {/* Fixed control bar */}
      <div className="admin-content-bar" style={{
        position: 'fixed', top: 0, left: 220, right: 0, zIndex: 100,
        background: '#1a1a1a', color: '#fff',
        padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 52,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontStyle: 'italic', color: '#e8e3dc', marginRight: 20 }}>
            Site Content
          </span>
          {PAGES.map(p => (
            <button key={p.id} onClick={() => { setPage(p.id as typeof page); scrollToTop() }} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, padding: '0 12px', height: 52,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              borderBottom: page === p.id ? '2px solid #fff' : '2px solid transparent',
              color: page === p.id ? '#fff' : 'rgba(255,255,255,0.45)',
              transition: 'color 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = page === p.id ? '#fff' : 'rgba(255,255,255,0.45)')}
            >
              {p.label}
            </button>
          ))}
          {editMode && (
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginLeft: 16 }}>
              · Click any text or photo to edit
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {status === 'saving' && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Saving…</span>}
          {status === 'saved'  && <span style={{ fontSize: 12, color: '#6ee7b7' }}>Saved ✓</span>}
          <button
            onClick={() => setEditMode(e => !e)}
            style={{
              padding: '8px 20px', borderRadius: 6, fontSize: 12, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', border: 'none',
              background: editMode ? '#b03060' : '#fff',
              color: editMode ? '#fff' : '#1a1a1a',
              transition: 'all 0.2s',
            }}
          >
            {editMode ? 'Exit edit mode' : 'Enter edit mode'}
          </button>
        </div>
      </div>

      {/* Page sections */}
      <EditProvider value={{ editMode, onFieldUpdate: saveField, onImageUpdate: saveField }}>
        {page === 'home' && (
          <>
            <HeroSection t={t as any} heroImage={heroImage} noNavOffset />
            <AboutTab t={t as any} />
            <SpecialtiesTab t={t as any} />
            <GalleryTab t={t as any} photos={galleryPhotos.map((p, i) => ({
              url: content[`gallery.photo.${i}`] ?? p.url,
              alt: p.alt,
            }))} />
            <MentoringSection t={t as any} />
            <OrderTab t={t as any} />
          </>
        )}
        {page === 'kimchi' && (
          <KimchiEditSections t={kimchiContent} />
        )}
        {page === 'contact' && (
          <ContactEditSections t={contactContent} />
        )}
      </EditProvider>
    </div>
  )
}
