import { prisma } from './prisma'
import { t as defaults } from '@/components/cuisine/translations'

export type ContentMap = Record<string, string>

export async function getContentMap(lang = 'en'): Promise<ContentMap> {
  const rows = await prisma.siteContent.findMany({ where: { lang } })
  return Object.fromEntries(rows.map(r => [r.key, r.value]))
}

export function mergeContent(map: ContentMap) {
  return {
    ...defaults,
    // Hero
    heroEyebrow: map['hero.eyebrow'] ?? defaults.heroEyebrow,
    heroTitle: [
      map['hero.title1'] ?? defaults.heroTitle[0] ?? '',
      map['hero.title2'] ?? defaults.heroTitle[1] ?? '',
      map['hero.title3'] ?? defaults.heroTitle[2] ?? '',
    ],
    heroTitleHighlight: map['hero.title.highlight'] ?? defaults.heroTitleHighlight,
    heroSub:   map['hero.sub']   ?? defaults.heroSub,
    heroCta:   map['hero.cta']   ?? defaults.heroCta,
    heroLearn: map['hero.learn'] ?? defaults.heroLearn,
    // About
    aboutAvatar:      map['about.avatar']        ?? defaults.aboutAvatar,
    taglineSub:       map['about.tagline_sub']  ?? defaults.taglineSub,
    aboutEyebrow:     map['about.eyebrow']      ?? defaults.aboutEyebrow,
    aboutTitle: [
      map['about.title1'] ?? defaults.aboutTitle[0] ?? '',
      map['about.title2'] ?? defaults.aboutTitle[1] ?? '',
    ],
    aboutBody1:       map['about.body1']        ?? defaults.aboutBody1,
    aboutBody2:       map['about.body2']        ?? defaults.aboutBody2,
    aboutQuote:       map['about.quote']        ?? defaults.aboutQuote,
    aboutQuoteCredit: map['about.quote_credit'] ?? defaults.aboutQuoteCredit,
    statsLabel1: map['stats.label1'] ?? defaults.statsLabel1,
    statsDesc1:  map['stats.desc1']  ?? defaults.statsDesc1,
    statsLabel2: map['stats.label2'] ?? defaults.statsLabel2,
    statsDesc2:  map['stats.desc2']  ?? defaults.statsDesc2,
    statsLabel3: map['stats.label3'] ?? defaults.statsLabel3,
    statsDesc3:  map['stats.desc3']  ?? defaults.statsDesc3,
    storyTitle1: map['story.title1'] ?? defaults.storyTitle1,
    storyBody1:  map['story.body1']  ?? defaults.storyBody1,
    storyTitle2: map['story.title2'] ?? defaults.storyTitle2,
    storyBody2:  map['story.body2']  ?? defaults.storyBody2,
    storyTitle3: map['story.title3'] ?? defaults.storyTitle3,
    storyBody3:  map['story.body3']  ?? defaults.storyBody3,
    storyTitle4: map['story.title4'] ?? defaults.storyTitle4,
    storyBody4:  map['story.body4']  ?? defaults.storyBody4,
    // Specialties
    specEyebrow: map['spec.eyebrow'] ?? defaults.specEyebrow,
    specTitle:   map['spec.title']   ?? defaults.specTitle,
    dishes: defaults.dishes.map((dish, i) => ({
      name: map[`dish.${i}.name`] ?? dish.name,
      desc: map[`dish.${i}.desc`] ?? dish.desc,
    })),
    // Order
    orderEyebrowAlt: map['order.eyebrow'] ?? defaults.orderEyebrowAlt,
    orderTitleAlt:   map['order.title']   ?? defaults.orderTitleAlt,
    orderBodyAlt:    map['order.body']    ?? defaults.orderBodyAlt,
    orderBullet1:    map['order.bullet1'] ?? defaults.orderBullet1,
    orderBullet2:    map['order.bullet2'] ?? defaults.orderBullet2,
    orderBullet3:    map['order.bullet3'] ?? defaults.orderBullet3,
    // Mentoring
    mentorEyebrow:   map['mentor.eyebrow']      ?? defaults.mentorEyebrow,
    mentorTitle1:    map['mentor.title1']        ?? defaults.mentorTitle1,
    mentorTitle2:    map['mentor.title2']        ?? defaults.mentorTitle2,
    mentorBody1:     map['mentor.body1']         ?? defaults.mentorBody1,
    mentorBody2:     map['mentor.body2']         ?? defaults.mentorBody2,
    mentorItem1Label: map['mentor.item1.label']  ?? defaults.mentorItem1Label,
    mentorItem1Body:  map['mentor.item1.body']   ?? defaults.mentorItem1Body,
    mentorItem2Label: map['mentor.item2.label']  ?? defaults.mentorItem2Label,
    mentorItem2Body:  map['mentor.item2.body']   ?? defaults.mentorItem2Body,
    mentorItem3Label: map['mentor.item3.label']  ?? defaults.mentorItem3Label,
    mentorItem3Body:  map['mentor.item3.body']   ?? defaults.mentorItem3Body,
    // Gallery
    galleryEyebrow: map['gallery.eyebrow'] ?? defaults.galleryEyebrow,
    galleryTitle:   map['gallery.title']   ?? defaults.galleryTitle,
  }
}
