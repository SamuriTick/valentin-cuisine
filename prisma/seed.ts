import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed default site content (homepage copy, editable from admin)
  const contentItems = [
    { key: 'hero.eyebrow',  lang: 'en', value: 'Putney, London' },
    { key: 'hero.eyebrow',  lang: 'fr', value: 'Putney, Londres' },
    { key: 'hero.eyebrow',  lang: 'vi', value: 'Putney, Luân Đôn' },
    { key: 'hero.line1',    lang: 'en', value: 'Anyone can cook,' },
    { key: 'hero.line1',    lang: 'fr', value: 'Tout le monde peut cuisiner,' },
    { key: 'hero.line1',    lang: 'vi', value: 'Ai cũng có thể nấu ăn,' },
    { key: 'hero.line2',    lang: 'en', value: 'but only the' },
    { key: 'hero.line2',    lang: 'fr', value: 'mais seuls les' },
    { key: 'hero.line2',    lang: 'vi', value: 'nhưng chỉ người' },
    { key: 'hero.line3',    lang: 'en', value: 'fearless can be great' },
    { key: 'hero.line3',    lang: 'fr', value: 'courageux sont grands' },
    { key: 'hero.line3',    lang: 'vi', value: 'dũng cảm mới vĩ đại' },
    { key: 'hero.sub',      lang: 'en', value: 'Custom cakes, pastries & artisan food crafted with passion. Available weekends & school holidays.' },
    { key: 'hero.sub',      lang: 'fr', value: 'Gâteaux sur mesure, pâtisseries & plats artisanaux. Disponible les week-ends et pendant les vacances scolaires.' },
    { key: 'hero.sub',      lang: 'vi', value: 'Bánh đặt theo yêu cầu, bánh ngọt & món thủ công. Nhận đặt hàng cuối tuần và kỳ nghỉ học.' },
    { key: 'about.body1',   lang: 'en', value: "Hi, I'm Valentin — a 15-year-old baker and pastry chef based in Putney, London. My love for cooking started long before I could reach the kitchen counter, and it has never stopped." },
    { key: 'about.body2',   lang: 'en', value: "From baking my first cake to organising children's cooking workshops, every experience has shaped my craft. I believe food is a language everyone speaks — and I'm here to make it delicious." },
    { key: 'about.quote',   lang: 'en', value: '"Anyone can cook, but only the fearless can be great."' },
    { key: 'about.quote',   lang: 'fr', value: '"Tout le monde peut cuisiner, mais seuls les courageux sont vraiment grands."' },
    { key: 'about.quote',   lang: 'vi', value: '"Ai cũng có thể nấu ăn, nhưng chỉ những người dũng cảm mới thực sự vĩ đại."' },
    { key: 'site.tagline',  lang: 'en', value: "Valentin's Cuisine" },
    { key: 'site.tagline',  lang: 'fr', value: 'La Cuisine de Valentin' },
    { key: 'site.tagline',  lang: 'vi', value: 'Ẩm Thực Valentin' },
    { key: 'site.subtitle', lang: 'en', value: 'Aspiring Baker & Pastry Chef' },
    { key: 'site.subtitle', lang: 'fr', value: 'Pâtissier & Boulanger en Devenir' },
    { key: 'site.subtitle', lang: 'vi', value: 'Đầu Bếp Bánh Ngọt Tương Lai' },
  ]

  for (const item of contentItems) {
    await prisma.siteContent.upsert({
      where: { key_lang: { key: item.key, lang: item.lang } },
      update: { value: item.value },
      create: item,
    })
  }
  console.log('✅ Seeded site content')

  // Seed default references
  await prisma.reference.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Uyen Nguyen',      role: 'Owner',                  company: 'Mémoire Saïgon',       phone: '07537 993988', displayOrder: 1 },
      { name: 'Alex Quennel',     role: 'Youth Council Organiser', company: 'Kingston Council',     phone: '020 8288 7511', displayOrder: 2 },
      { name: 'Dorota Trawinska', role: 'Thermomix Advisor',       company: 'Thermomix West London', phone: '07710 694296', displayOrder: 3 },
    ],
  })
  console.log('✅ Seeded references')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
