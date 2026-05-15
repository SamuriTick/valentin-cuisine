
import Link from 'next/link';
import { prisma } from '@/lib/prisma';




export const dynamic = 'force-dynamic';

const ACHIEVEMENTS = [
{ year: '2025', title: 'Self-Employed Baking Business', role: 'Founder', location: 'Putney, London', desc: 'Weekly custom cake orders — handling design, baking, customer communication and delivery.' },
  { year: '2025', title: 'Kingston Youth Councillor', role: 'Elected Member', location: 'Kingston, London', desc: 'Elected to represent young people in Kingston upon Thames.' },
  { year: '2024', title: 'Thermomix West London', role: 'Cooking Workshop Organiser', location: 'Clapham Junction', desc: 'Organised Easter cooking event for children; animated 3-course class for 10 children.' },
  { year: '2024', title: 'WOW Banh Mi', role: 'Kitchen Assistant & Barista', location: 'Manchester', desc: 'Fast-paced kitchen service — 10% boost in customer satisfaction.' },
  { year: '2024', title: 'Junior Bake Off Standby', role: '24th / 3,000 applicants', location: 'UK', desc: 'Selected as standby contestant for Junior Bake Off.' },
  { year: '2023', title: 'JMC Silver', role: 'Award', location: 'UK', desc: 'Junior Maths Challenge Silver award.' },
  { year: '2023', title: 'Bonu Cakes and Tea', role: 'Kitchen Assistant & Barista', location: 'Central London', desc: 'Prepared cakes from scratch; upsold clients by 15%.' },
  { year: '2021', title: 'Red Tag Taekwondo', role: 'Martial Arts', location: 'London', desc: '' },
];

export default async function CredentialsPage() {
  

  const [credentialPosts, references, cvFile] = await Promise.all([
    prisma.post.findMany({
      where: { published: true, category: { in: ['achievement', 'experience'] } },
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.reference.findMany({
      where: { active: true },
      orderBy: { displayOrder: 'asc' },
    }),
    prisma.mediaItem.findFirst({
      where: { tags: { contains: 'cv' }, fileType: 'application/pdf' },
      orderBy: { uploadedAt: 'desc' },
    }),
  ]);

  return (
    <>
      <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--cream)' }}>

        {/* Header */}
        <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: 'clamp(40px, 6vw, 56px) clamp(16px, 5vw, 40px) 40px' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', gap: 24 }}>
            <div>
              <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 22, color: 'var(--gold)', marginBottom: 12 }}>Valentin Thang</p>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(32px, 4vw, 48px)', color: 'var(--dark)', marginBottom: 6 }}>
                Credentials
              </h1>
              <div style={{ width: 32, height: 1, background: 'var(--gold)', margin: '18px 0 16px' }} />
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>
                Aspiring Baker & Pastry Chef, 13 · Putney, London · English · French · Vietnamese
              </p>
            </div>
            {cvFile && (
              <a href={cvFile.filePath} download style={{
                fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                textTransform: 'uppercase', color: 'var(--white)', background: 'var(--green)',
                textDecoration: 'none', padding: '12px 24px', borderRadius: 2, whiteSpace: 'nowrap',
              }}>
                Download CV ↓
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]" style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(40px, 6vw, 56px) clamp(16px, 5vw, 40px) 80px', gap: 'clamp(40px, 5vw, 64px)', alignItems: 'start' }}>

          {/* Timeline */}
          <div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: 'var(--dark)', marginBottom: 32 }}>
              Experience & Achievements
            </h2>
            <div style={{ position: 'relative' }}>
              <div className="hidden md:block" style={{ position: 'absolute', left: 52, top: 0, bottom: 0, width: 1, background: 'var(--border)' }} />
              <div className="block md:hidden" style={{ position: 'absolute', left: 30, top: 0, bottom: 0, width: 1, background: 'var(--border)' }} />
              {ACHIEVEMENTS.map((item, i) => (
                <div key={i} className="grid grid-cols-[60px_1fr] md:grid-cols-[104px_1fr]" style={{ gap: 24, marginBottom: 36 }}>
                  <div style={{ textAlign: 'right', paddingTop: 4 }}>
                    <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: 'var(--green)' }}>{item.year}</span>
                  </div>
                  <div style={{ position: 'relative', paddingLeft: 24 }}>
                    <div style={{
                      position: 'absolute', left: -5, top: 6, width: 10, height: 10,
                      borderRadius: '50%', background: 'var(--gold)', border: '2px solid var(--white)',
                    }} />
                    <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: 'var(--dark)', marginBottom: 2 }}>{item.title}</h3>
                    <p style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>
                      {item.role} {item.location && `· ${item.location}`}
                    </p>
                    {item.desc && <p style={{ fontSize: 14, color: 'var(--mid)', lineHeight: 1.7 }}>{item.desc}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic credential posts */}
            {credentialPosts.length > 0 && (
              <div style={{ marginTop: 48, paddingTop: 48, borderTop: '1px solid var(--border)' }}>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: 'var(--dark)', marginBottom: 24 }}>From the Blog</h2>
                {credentialPosts.map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 20 }}>
                    <div style={{ padding: '16px 20px', background: 'var(--white)', border: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>{post.category}</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: 'var(--dark)' }}>{post.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* References sidebar */}
          <div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: 'var(--dark)', marginBottom: 8 }}>
              References
            </h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28, fontStyle: 'italic' }}>
              Available upon request — contact directly to verify
            </p>

            {(references.length > 0 ? references : [
              { id: 1, name: 'Uyen Nguyen', role: 'Owner', company: 'Mémoire Saïgon', phone: '07537 993988', email: null, website: null, quote: null },
              { id: 2, name: 'Alex Quennel', role: 'Youth Council Organiser', company: 'Kingston Council', phone: '020 8288 7511', email: null, website: null, quote: null },
              { id: 3, name: 'Dorota Trawinska', role: 'Thermomix Advisor', company: 'Thermomix West London', phone: '07710 694296', email: null, website: null, quote: null },
            ]).map((ref: any) => (
              <div key={ref.id} style={{ marginBottom: 24, padding: '20px 24px', background: 'var(--white)', border: '1px solid var(--border)' }}>
                {ref.quote && (
                  <blockquote style={{ borderLeft: '2px solid var(--gold)', paddingLeft: 14, marginBottom: 14 }}>
                    <p style={{ fontSize: 14, color: 'var(--mid)', fontStyle: 'italic', lineHeight: 1.7 }}>"{ref.quote}"</p>
                  </blockquote>
                )}
                <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: 'var(--dark)' }}>{ref.name}</p>
                <p style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>
                  {ref.role}{ref.company && ` · ${ref.company}`}
                </p>
                {ref.phone && (
                  <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 8 }}>
                    <a href={`tel:${ref.phone}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{ref.phone}</a>
                  </p>
                )}
                {ref.website && (
                  <p style={{ fontSize: 14, marginTop: 4 }}>
                    <a href={ref.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)' }}>{ref.website}</a>
                  </p>
                )}
              </div>
            ))}

            {/* Education */}
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: 'var(--dark)', margin: '40px 0 20px' }}>
              Education
            </h2>
            {[
              { school: 'Tiffin Boys School', type: 'Secondary School', years: '2024 – Present' },
              { school: 'Brandlehow Primary School', type: 'Primary School', years: '2017 – 2024' },
            ].map(edu => (
              <div key={edu.school} style={{ marginBottom: 16, padding: '16px 20px', background: 'var(--white)', border: '1px solid var(--border)' }}>
                <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, color: 'var(--dark)' }}>{edu.school}</p>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{edu.type} · {edu.years}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  );
}
