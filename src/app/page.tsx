'use client';

import { useState } from 'react';

type Lang = 'en' | 'fr' | 'vi';
type Tab = 'about' | 'specialties' | 'gallery' | 'order';

const T = {
  en: {
    tagline: "Valentin's Cuisine",
    taglineSub: 'Aspiring Baker & Pastry Chef',
    heroEyebrow: 'Putney, London',
    heroTitle: ['Anyone can cook,', 'but only the', 'fearless can be great'],
    heroSub: 'Custom cakes, pastries & artisan food crafted with passion. Available weekends & school holidays.',
    heroCta: 'Order a Cake',
    heroLearn: 'About Me',
    navAbout: 'About',
    navSpecialties: 'Specialties',
    navGallery: 'Gallery',
    navOrder: 'Order',
    aboutEyebrow: 'My Story',
    aboutTitle: ['Baking from the', 'heart since I was young'],
    aboutBody1: "Hi, I'm Valentin — a 15-year-old baker and pastry chef based in Putney, London. My love for cooking started long before I could reach the kitchen counter, and it has never stopped.",
    aboutBody2: "From baking my first cake to organising children's cooking workshops, every experience has shaped my craft. I believe food is a language everyone speaks — and I'm here to make it delicious.",
    aboutQuote: '"Anyone can cook, but only the fearless can be great."',
    aboutQuoteCredit: '— Chef Gusteau, Ratatouille',
    statsLabel1: 'Junior Bake Off',
    statsDesc1: 'Standby — 24th out of 3,000 applicants',
    statsLabel2: 'Languages',
    statsDesc2: 'English · French · Vietnamese',
    statsLabel3: 'Youth Councillor',
    statsDesc3: 'Elected Kingston Youth Councillor',
    specTitle: 'What I Make',
    specEyebrow: 'Specialties',
    dishes: [
      { name: 'Custom Celebration Cakes', desc: 'Bespoke cakes decorated with strong attention to detail and presentation. Any occasion, any flavour.' },
      { name: 'Artisan Pastries', desc: 'From croissants to éclairs — classic French technique with a personal touch.' },
      { name: 'Kimchi', desc: 'Traditional fermentation, zero preservatives. My Vietnamese roots in every jar.' },
      { name: 'Sourdough', desc: 'Long-fermented, naturally leavened bread baked fresh to order.' },
      { name: 'Tarts & Quiches', desc: 'Seasonal fillings, buttery pastry. Perfect for gatherings and gifts.' },
      { name: 'Cooking Workshop Dishes', desc: 'Three-course menus crafted and taught at community cooking events.' },
    ],
    storyTitle1: 'Junior Bake Off',
    storyBody1: 'Selected as a standby contestant — placing 24th out of over 3,000 applicants. A milestone that confirmed baking is more than a hobby.',
    storyTitle2: 'Thermomix Workshops',
    storyBody2: 'Organised and animated a three-course Easter cooking class for 10 children in collaboration with Vorwerk at Clapham Junction.',
    storyTitle3: 'Self-Employed Baking',
    storyBody3: 'Ran a weekly custom cake order business from Putney — handling orders, decoration, customer communication, and delivery.',
    storyTitle4: 'Mémoire Saïgon',
    storyBody4: 'Kitchen and front-of-house assistant at a Vietnamese restaurant in Wales. Prep, plating, serving during busy periods.',
    orderEyebrow: 'Place an Order',
    orderTitle: 'Order a Custom Cake',
    orderBody: 'I take weekly custom cake orders. Tell me what you need and I\'ll get back to you within 24 hours. Available weekends and school holidays.',
    formName: 'Your Name',
    formEmail: 'Email',
    formPhone: 'Phone (optional)',
    formOccasion: 'Occasion',
    formDetails: 'Cake details — flavour, size, design, date needed',
    formSend: 'Send Request',
    contactTitle: 'Get in Touch',
    footerLine: '© 2025 Valentin\'s Cuisine · Putney, London',
  },
  fr: {
    tagline: "La Cuisine de Valentin",
    taglineSub: 'Pâtissier & Boulanger en Devenir',
    heroEyebrow: 'Putney, Londres',
    heroTitle: ['Tout le monde peut cuisiner,', 'mais seuls les', 'courageux sont grands'],
    heroSub: 'Gâteaux sur mesure, pâtisseries & plats artisanaux. Disponible les week-ends et pendant les vacances scolaires.',
    heroCta: 'Commander un Gâteau',
    heroLearn: 'À Propos',
    navAbout: 'À Propos',
    navSpecialties: 'Spécialités',
    navGallery: 'Galerie',
    navOrder: 'Commander',
    aboutEyebrow: 'Mon Histoire',
    aboutTitle: ['Pâtissier passionné', 'depuis tout petit'],
    aboutBody1: "Bonjour, je suis Valentin — pâtissier et boulanger de 15 ans basé à Putney, Londres. Mon amour de la cuisine a commencé bien avant que je puisse atteindre le plan de travail.",
    aboutBody2: "Des premiers gâteaux aux ateliers culinaires pour enfants, chaque expérience a façonné mon savoir-faire. La nourriture est un langage universel — et je suis là pour le rendre délicieux.",
    aboutQuote: '"Tout le monde peut cuisiner, mais seuls les courageux sont vraiment grands."',
    aboutQuoteCredit: '— Chef Gusteau, Ratatouille',
    statsLabel1: 'Junior Bake Off',
    statsDesc1: 'Finaliste — 24ème sur 3 000 candidats',
    statsLabel2: 'Langues',
    statsDesc2: 'Anglais · Français · Vietnamien',
    statsLabel3: 'Conseiller Jeunesse',
    statsDesc3: 'Élu au Conseil Jeunesse de Kingston',
    specTitle: 'Ce que je prépare',
    specEyebrow: 'Spécialités',
    dishes: [
      { name: 'Gâteaux de Fête sur Mesure', desc: 'Gâteaux personnalisés, décorés avec soin. Pour toutes occasions et toutes saveurs.' },
      { name: 'Pâtisseries Artisanales', desc: 'Des croissants aux éclairs — technique française classique avec une touche personnelle.' },
      { name: 'Kimchi', desc: 'Fermentation traditionnelle, zéro conservateurs. Mes racines vietnamiennes dans chaque pot.' },
      { name: 'Pain au Levain', desc: 'Pain à longue fermentation, levain naturel, cuit frais à la commande.' },
      { name: 'Tartes & Quiches', desc: 'Garnitures de saison, pâte beurrée. Parfait pour les réunions et les cadeaux.' },
      { name: 'Plats d\'Atelier', desc: 'Menus trois plats créés et enseignés lors d\'ateliers culinaires communautaires.' },
    ],
    storyTitle1: 'Junior Bake Off',
    storyBody1: 'Sélectionné finaliste — 24ème sur plus de 3 000 candidats. Une étape clé qui a confirmé que la pâtisserie est bien plus qu\'un loisir.',
    storyTitle2: 'Ateliers Thermomix',
    storyBody2: 'Organisé et animé un cours de cuisine de Pâques en trois plats pour 10 enfants en collaboration avec Vorwerk à Clapham Junction.',
    storyTitle3: 'Auto-entrepreneur',
    storyBody3: 'Géré une commande hebdomadaire de gâteaux depuis Putney — commandes, décoration, communication client et livraison.',
    storyTitle4: 'Mémoire Saïgon',
    storyBody4: 'Assistant en cuisine et en salle dans un restaurant vietnamien au Pays de Galles. Préparation, dressage et service.',
    orderEyebrow: 'Passer une Commande',
    orderTitle: 'Commandez un Gâteau',
    orderBody: 'Je prends des commandes hebdomadaires. Dites-moi ce dont vous avez besoin et je vous répondrai sous 24h. Disponible les week-ends et les vacances scolaires.',
    formName: 'Votre Nom',
    formEmail: 'Email',
    formPhone: 'Téléphone (optionnel)',
    formOccasion: 'Occasion',
    formDetails: 'Détails du gâteau — saveur, taille, design, date souhaitée',
    formSend: 'Envoyer la Demande',
    contactTitle: 'Me Contacter',
    footerLine: '© 2025 La Cuisine de Valentin · Putney, Londres',
  },
  vi: {
    tagline: 'Ẩm Thực Valentin',
    taglineSub: 'Đầu Bếp Bánh Ngọt Tương Lai',
    heroEyebrow: 'Putney, Luân Đôn',
    heroTitle: ['Ai cũng có thể nấu ăn,', 'nhưng chỉ người', 'dũng cảm mới vĩ đại'],
    heroSub: 'Bánh đặt theo yêu cầu, bánh ngọt & món thủ công. Nhận đặt hàng cuối tuần và kỳ nghỉ học.',
    heroCta: 'Đặt Bánh',
    heroLearn: 'Về Valentin',
    navAbout: 'Về Tôi',
    navSpecialties: 'Đặc Sản',
    navGallery: 'Thư Viện',
    navOrder: 'Đặt Hàng',
    aboutEyebrow: 'Câu Chuyện',
    aboutTitle: ['Nấu ăn bằng', 'trái tim từ nhỏ'],
    aboutBody1: 'Xin chào, tôi là Valentin — đầu bếp bánh 15 tuổi sống tại Putney, Luân Đôn. Niềm đam mê nấu ăn của tôi bắt đầu từ rất sớm và chưa bao giờ dừng lại.',
    aboutBody2: 'Từ chiếc bánh đầu tiên đến các lớp học nấu ăn cho trẻ em, mỗi trải nghiệm đều định hình kỹ năng của tôi. Tôi tin rằng thức ăn là ngôn ngữ mà ai cũng hiểu.',
    aboutQuote: '"Ai cũng có thể nấu ăn, nhưng chỉ những người dũng cảm mới thực sự vĩ đại."',
    aboutQuoteCredit: '— Bếp trưởng Gusteau, Ratatouille',
    statsLabel1: 'Junior Bake Off',
    statsDesc1: 'Lọt top — hạng 24 trong 3.000 thí sinh',
    statsLabel2: 'Ngôn Ngữ',
    statsDesc2: 'Tiếng Anh · Tiếng Pháp · Tiếng Việt',
    statsLabel3: 'Hội Đồng Thanh Niên',
    statsDesc3: 'Được bầu làm Ủy viên Thanh niên Kingston',
    specTitle: 'Những Gì Tôi Làm',
    specEyebrow: 'Đặc Sản',
    dishes: [
      { name: 'Bánh Sinh Nhật Theo Yêu Cầu', desc: 'Bánh được trang trí tỉ mỉ, tinh tế. Mọi dịp, mọi hương vị.' },
      { name: 'Bánh Ngọt Thủ Công', desc: 'Từ bánh sừng bò đến bánh éclair — kỹ thuật Pháp truyền thống với dấu ấn cá nhân.' },
      { name: 'Kim Chi', desc: 'Lên men truyền thống, không chất bảo quản. Nguồn cội Việt Nam trong từng hũ.' },
      { name: 'Bánh Mì Chua', desc: 'Lên men lâu, men tự nhiên. Nướng tươi theo đơn đặt hàng.' },
      { name: 'Bánh Tart & Quiche', desc: 'Nhân theo mùa, vỏ bánh bơ giòn. Lý tưởng cho tiệc và quà tặng.' },
      { name: 'Món Từ Lớp Học', desc: 'Thực đơn ba món tự tay chế biến và hướng dẫn tại các lớp học nấu ăn cộng đồng.' },
    ],
    storyTitle1: 'Junior Bake Off',
    storyBody1: 'Được chọn vào danh sách dự bị — hạng 24 trong hơn 3.000 thí sinh. Một cột mốc xác nhận rằng làm bánh là đam mê thực sự.',
    storyTitle2: 'Lớp Học Thermomix',
    storyBody2: 'Tổ chức và dẫn dắt lớp học nấu ăn Lễ Phục Sinh ba món cho 10 trẻ em cùng Vorwerk tại Clapham Junction.',
    storyTitle3: 'Tự Kinh Doanh',
    storyBody3: 'Điều hành đơn đặt bánh hàng tuần từ Putney — xử lý đơn hàng, trang trí, liên lạc khách hàng và giao bánh.',
    storyTitle4: 'Mémoire Saïgon',
    storyBody4: 'Trợ lý bếp và phục vụ tại nhà hàng Việt Nam ở Wales. Chuẩn bị nguyên liệu, trình bày món ăn và phục vụ khách.',
    orderEyebrow: 'Đặt Hàng',
    orderTitle: 'Đặt Bánh Theo Yêu Cầu',
    orderBody: 'Tôi nhận đặt bánh hàng tuần. Cho tôi biết bạn cần gì và tôi sẽ phản hồi trong 24 giờ. Phục vụ cuối tuần và kỳ nghỉ học.',
    formName: 'Tên của bạn',
    formEmail: 'Email',
    formPhone: 'Số điện thoại (tuỳ chọn)',
    formOccasion: 'Dịp đặc biệt',
    formDetails: 'Chi tiết bánh — hương vị, kích cỡ, thiết kế, ngày cần',
    formSend: 'Gửi Yêu Cầu',
    contactTitle: 'Liên Hệ',
    footerLine: '© 2025 Ẩm Thực Valentin · Putney, Luân Đôn',
  },
};

export default function Home() {
  const [lang, setLang] = useState<Lang>('en');
  const [tab, setTab] = useState<Tab>('about');
  const t = T[lang];

  return (
    <>
      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'var(--white)', borderBottom: '2px solid var(--gold)',
        boxShadow: '0 2px 24px rgba(184,150,46,0.10)',
      }}>
        <div style={{
          maxWidth: 1160, margin: '0 auto', padding: '0 40px',
          height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <a href="#hero" style={{
            fontFamily: "'DM Serif Display', serif", fontSize: 24, color: 'var(--green)',
            textDecoration: 'none', letterSpacing: 2, textTransform: 'uppercase',
            display: 'flex', flexDirection: 'column', lineHeight: 1.1,
          }}>
            {t.tagline}
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 11, fontStyle: 'italic', color: 'var(--gold)', letterSpacing: 1, fontWeight: 400 }}>
              {t.taglineSub}
            </span>
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* lang toggle */}
            <div style={{ display: 'flex', border: '1px solid var(--border)', overflow: 'hidden', borderRadius: 2 }}>
              {(['en', 'fr', 'vi'] as Lang[]).map(l => (
                <button key={l} onClick={() => setLang(l)} style={{
                  padding: '5px 10px', fontFamily: "'Nunito', sans-serif", fontSize: 10, fontWeight: 700,
                  letterSpacing: 1.5, textTransform: 'uppercase', background: lang === l ? 'var(--green)' : 'none',
                  color: lang === l ? '#fff' : 'var(--muted)', border: 'none', cursor: 'pointer',
                }}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button onClick={() => setTab('order')} style={{
              fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
              textTransform: 'uppercase', color: 'var(--white)', background: 'var(--green)',
              border: 'none', padding: '8px 18px', borderRadius: 2, cursor: 'pointer',
            }}>
              {t.navOrder}
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" style={{
        height: '100vh', minHeight: 600, maxHeight: 820,
        background: 'linear-gradient(to bottom, rgba(24,24,24,0.15) 0%, rgba(24,24,24,0.70) 100%), url(/img/hero-valentin.jpg) center/cover no-repeat',
        display: 'flex', alignItems: 'flex-end', paddingTop: 68,
      }}>
        <div style={{ maxWidth: 1160, width: '100%', margin: '0 auto', padding: '0 40px 72px' }}>
          <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: 'rgba(255,255,255,0.80)', marginBottom: 16 }}>
            {t.heroEyebrow}
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 'clamp(42px, 7vw, 62px)',
            color: '#fff', lineHeight: 1.1, letterSpacing: -1, marginBottom: 20,
          }}>
            {t.heroTitle[0]}<br />
            <em style={{ fontStyle: 'italic' }}>{t.heroTitle[1]}</em><br />
            {t.heroTitle[2]}
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', maxWidth: 420, lineHeight: 1.8, marginBottom: 32 }}>
            {t.heroSub}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => setTab('order')} style={{
              background: '#fff', color: 'var(--dark)', fontSize: 11, fontWeight: 600,
              letterSpacing: 1.5, textTransform: 'uppercase', padding: '13px 28px',
              border: 'none', cursor: 'pointer',
            }}>
              {t.heroCta}
            </button>
            <button onClick={() => setTab('about')} style={{
              background: 'transparent', color: '#fff', fontSize: 11, fontWeight: 400,
              letterSpacing: 1.5, textTransform: 'uppercase', padding: '13px 28px',
              border: '1px solid rgba(255,255,255,0.40)', cursor: 'pointer',
            }}>
              {t.heroLearn}
            </button>
          </div>
        </div>
      </section>

      {/* ── TABS BAR ── */}
      <div style={{
        position: 'sticky', top: 68, zIndex: 100,
        background: 'var(--white)', borderBottom: '1px solid var(--border)',
        overflowX: 'auto',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 40px', display: 'flex' }}>
          {([
            ['about', t.navAbout],
            ['specialties', t.navSpecialties],
            ['gallery', t.navGallery],
            ['order', t.navOrder],
          ] as [Tab, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: '16px 24px', fontFamily: "'Nunito', sans-serif", fontSize: 11,
              fontWeight: tab === key ? 600 : 400, letterSpacing: 1.5, textTransform: 'uppercase',
              color: tab === key ? 'var(--green)' : 'var(--muted)',
              background: 'none', border: 'none', borderBottom: `2px solid ${tab === key ? 'var(--green)' : 'transparent'}`,
              cursor: 'pointer', marginBottom: -1, transition: 'all 0.2s',
            }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── ABOUT TAB ── */}
      {tab === 'about' && (
        <div>
          {/* About hero grid */}
          <div style={{ background: 'var(--white)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {/* Placeholder image */}
            <div style={{
              minHeight: 520, background: 'var(--warm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{
                  width: 220, height: 220, borderRadius: '50%', background: 'var(--border)',
                  border: '4px solid var(--gold)', margin: '0 auto 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 60, color: 'var(--green)' }}>V</span>
                </div>
                <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: 'var(--dark)' }}>Valentin Thang</p>
                <p style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)', marginTop: 4 }}>
                  {t.taglineSub}
                </p>
              </div>
            </div>

            {/* Text */}
            <div style={{ padding: '72px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: 'var(--gold)', marginBottom: 12 }}>
                {t.aboutEyebrow}
              </p>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 3vw, 40px)',
                lineHeight: 1.2, color: 'var(--dark)', marginBottom: 6,
              }}>
                {t.aboutTitle[0]}<br />
                <em style={{ fontStyle: 'italic', color: 'var(--green)' }}>{t.aboutTitle[1]}</em>
              </h2>
              <div style={{ width: 32, height: 1, background: 'var(--gold)', margin: '18px 0' }} />
              <p style={{ fontSize: 16, color: 'var(--mid)', lineHeight: 1.8, marginBottom: 16 }}>
                {t.aboutBody1}
              </p>
              <p style={{ fontSize: 16, color: 'var(--mid)', lineHeight: 1.8 }}>
                {t.aboutBody2}
              </p>
              <blockquote style={{
                marginTop: 28, padding: '18px 24px',
                borderLeft: '2px solid var(--gold)', background: 'var(--warm)',
              }}>
                <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, fontStyle: 'italic', color: 'var(--mid)', lineHeight: 1.8 }}>
                  {t.aboutQuote}
                </p>
                <cite style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)', marginTop: 8, fontStyle: 'normal' }}>
                  {t.aboutQuoteCredit}
                </cite>
              </blockquote>
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <div style={{
              maxWidth: 1160, margin: '0 auto', padding: '64px 40px',
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1,
              background: 'var(--border)',
            }}>
              {[
                [t.statsLabel1, t.statsDesc1],
                [t.statsLabel2, t.statsDesc2],
                [t.statsLabel3, t.statsDesc3],
              ].map(([label, desc]) => (
                <div key={label} style={{ background: 'var(--cream)', padding: '40px 36px' }}>
                  <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: 'var(--green)', lineHeight: 1, marginBottom: 8 }}>
                    {label}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--mid)', lineHeight: 1.7, marginTop: 10 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Story blocks */}
          <div style={{ background: 'var(--warm)', borderTop: '1px solid var(--border)' }}>
            <div style={{
              maxWidth: 1160, margin: '0 auto', padding: '56px 40px',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
            }}>
              {[
                [t.storyTitle1, t.storyBody1],
                [t.storyTitle2, t.storyBody2],
                [t.storyTitle3, t.storyBody3],
                [t.storyTitle4, t.storyBody4],
              ].map(([title, body]) => (
                <div key={title}>
                  <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 18, color: 'var(--gold)', marginBottom: 10 }}>
                    Experience
                  </p>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: 'var(--dark)', marginBottom: 12, lineHeight: 1.3 }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--mid)', lineHeight: 1.9, fontWeight: 300 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SPECIALTIES TAB ── */}
      {tab === 'specialties' && (
        <div style={{ background: 'var(--cream)', minHeight: '60vh' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 40px' }}>
            <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: 'var(--gold)', marginBottom: 12 }}>
              {t.specEyebrow}
            </p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 3vw, 40px)', color: 'var(--dark)', marginBottom: 6 }}>
              {t.specTitle}
            </h2>
            <div style={{ width: 32, height: 1, background: 'var(--gold)', margin: '18px 0 40px' }} />
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1, background: 'var(--border)', border: '1px solid var(--border)',
            }}>
              {t.dishes.map((dish) => (
                <div key={dish.name} style={{ background: 'var(--white)', padding: '32px 28px', transition: 'background 0.2s' }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: 'var(--dark)', marginBottom: 12, lineHeight: 1.3 }}>
                    {dish.name}
                  </p>
                  <div style={{ width: 24, height: 1, background: 'var(--gold)', marginBottom: 14 }} />
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{dish.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ marginTop: 48, textAlign: 'center' }}>
              <button onClick={() => setTab('order')} style={{
                background: 'var(--green)', color: '#fff', fontSize: 11, fontWeight: 700,
                letterSpacing: 1.5, textTransform: 'uppercase', padding: '14px 32px',
                border: 'none', cursor: 'pointer', borderRadius: 2,
              }}>
                {t.heroCta}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── GALLERY TAB ── */}
      {tab === 'gallery' && (
        <div style={{ background: 'var(--cream)', minHeight: '60vh' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 40px' }}>
            <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: 'var(--gold)', marginBottom: 12 }}>
              Behind the scenes
            </p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 3vw, 40px)', color: 'var(--dark)', marginBottom: 6 }}>
              Gallery
            </h2>
            <div style={{ width: 32, height: 1, background: 'var(--gold)', margin: '18px 0 40px' }} />

            {/* Placeholder grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{
                  background: 'var(--warm)', aspectRatio: '1/1', borderRadius: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px dashed var(--border)',
                }}>
                  <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14, color: 'var(--muted)' }}>
                    Photo {i + 1}
                  </span>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
              Photos coming soon — follow on Instagram for updates
            </p>
          </div>
        </div>
      )}

      {/* ── ORDER TAB ── */}
      {tab === 'order' && (
        <div style={{ background: 'var(--cream)', minHeight: '60vh' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', padding: '72px 40px' }}>
            <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: 'var(--gold)', marginBottom: 12 }}>
              {t.orderEyebrow}
            </p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 3vw, 40px)', color: 'var(--dark)', marginBottom: 6 }}>
              {t.orderTitle}
            </h2>
            <div style={{ width: 32, height: 1, background: 'var(--gold)', margin: '18px 0' }} />
            <p style={{ fontSize: 15, color: 'var(--mid)', lineHeight: 1.8, marginBottom: 40 }}>
              {t.orderBody}
            </p>

            <form
              action={`mailto:valentin.thang@gmail.com`}
              method="get"
              encType="text/plain"
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              {[
                [t.formName, 'text', 'name'],
                [t.formEmail, 'email', 'email'],
                [t.formPhone, 'tel', 'phone'],
                [t.formOccasion, 'text', 'occasion'],
              ].map(([label, type, name]) => (
                <div key={name}>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    style={{
                      width: '100%', padding: '12px 16px', background: 'var(--white)',
                      border: '1px solid var(--border)', fontSize: 14, color: 'var(--dark)',
                      outline: 'none', fontFamily: "'Nunito', sans-serif",
                    }}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
                  {t.formDetails}
                </label>
                <textarea
                  name="details"
                  rows={5}
                  style={{
                    width: '100%', padding: '12px 16px', background: 'var(--white)',
                    border: '1px solid var(--border)', fontSize: 14, color: 'var(--dark)',
                    outline: 'none', fontFamily: "'Nunito', sans-serif", resize: 'vertical',
                  }}
                />
              </div>

              <button type="submit" style={{
                background: 'var(--green)', color: '#fff', fontSize: 11, fontWeight: 700,
                letterSpacing: 1.5, textTransform: 'uppercase', padding: '14px 32px',
                border: 'none', cursor: 'pointer', alignSelf: 'flex-start', borderRadius: 2,
              }}>
                {t.formSend}
              </button>
            </form>

            {/* Direct contact */}
            <div style={{ marginTop: 48, paddingTop: 40, borderTop: '1px solid var(--border)' }}>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: 'var(--dark)', marginBottom: 16 }}>
                {t.contactTitle}
              </p>
              <p style={{ fontSize: 14, color: 'var(--mid)', lineHeight: 2 }}>
                📧 <a href="mailto:valentin.thang@gmail.com" style={{ color: 'var(--green)' }}>valentin.thang@gmail.com</a><br />
                📞 <a href="tel:+447903964441" style={{ color: 'var(--green)' }}>+44 7903 964 441</a><br />
                📍 Putney, London
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer style={{
        background: 'var(--green)', color: 'rgba(255,255,255,0.60)',
        padding: '32px 40px', textAlign: 'center',
        fontFamily: "'Nunito', sans-serif", fontSize: 12, letterSpacing: 1,
      }}>
        <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: 'var(--gold)', marginBottom: 8 }}>
          {t.tagline}
        </p>
        <p>{t.footerLine}</p>
      </footer>
    </>
  );
}
