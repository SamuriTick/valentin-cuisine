import { prisma } from '@/lib/prisma'

export interface SiteSetting {
  key: string
  value: string | null
  type: string
  description?: string | null
}

export interface SiteSettings {
  site_title: string
  site_description: string
  contact_phone: string
  contact_email: string
  address: string
  social_facebook: string
  social_twitter: string
  social_instagram: string
  booking_enabled: boolean
  maintenance_mode: boolean
  residents_served: string
  weekly_programs: string
  opening_hours_text: string
  opening_hours_details: string
  hero_subtitle: string
  hero_description: string
  hero_background_image: string
  hero_cta_button_text: string
  hero_cta_button_link: string
  banner_programs_image: string
  [key: string]: any
}

// Cache for settings to avoid repeated database calls
let settingsCache: Map<string, any> | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 30 * 1000 // 30 seconds for faster updates

export async function getSettings(): Promise<SiteSettings> {
  // During build time, return default settings without database connection
  const isDuringBuild = process.env.NODE_ENV === 'production' && 
    (process.env.SKIP_DATABASE_DURING_BUILD === 'true' || 
     !process.env.DATABASE_URL || 
     process.env.DATABASE_URL.includes('dummy'))

  if (isDuringBuild) {
    console.log('Build time detected, returning default settings without database connection')
    return getDefaultSettings()
  }

  const now = Date.now()
  
  // Return cached settings if still valid
  if (settingsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return Object.fromEntries(settingsCache) as SiteSettings
  }

  try {
    const settings = await prisma.siteSetting.findMany()
    
    // Create settings map with default values
    const settingsMap = new Map<string, any>([
      ['site_title', 'West Acton Community Centre'],
      ['site_description', 'A vibrant community centre serving West Acton and surrounding areas'],
      ['contact_phone', '+44 20 1234 5678'],
      ['contact_email', 'info@westactoncc.org.uk'],
      ['address', 'West Acton Community Centre, High Street, London W3'],
      ['social_facebook', ''],
      ['social_twitter', ''],
      ['social_instagram', ''],
      ['booking_enabled', true],
      ['maintenance_mode', false],
      ['residents_served', '2,000+'],
      ['weekly_programs', '15+'],
      ['opening_hours_text', '7 days'],
      ['opening_hours_details', 'Open Monday to Sunday, 7am-11pm'],
      ['hero_subtitle', 'Your local hub for education, leisure, and recreational programmes. We serve over 2,000 residents in West Acton with 15+ regular programmes every week.'],
      ['hero_description', 'From Stay & Play sessions for young families to martial arts, fitness classes, and cultural groups — we\'re here to bring our community together and support wellbeing for all ages.'],
      ['hero_background_image', '/img/entrance.jpeg'],
      ['hero_cta_button_text', 'EXPLORE OUR PROGRAMS'],
      ['hero_cta_button_link', '/programs'],
      ['banner_programs_image', '/img/all-programs.jpeg']
    ])

    // Override with database values
    settings.forEach((setting: SiteSetting) => {
      let parsedValue: any = setting.value
      
      // Parse based on type
      switch (setting.type) {
        case 'boolean':
          parsedValue = setting.value === 'true'
          break
        case 'number':
          parsedValue = setting.value ? parseFloat(setting.value) : 0
          break
        case 'json':
          try {
            parsedValue = setting.value ? JSON.parse(setting.value) : null
          } catch {
            parsedValue = null
          }
          break
        default:
          // Keep as string
          parsedValue = setting.value
          break
      }
      
      settingsMap.set(setting.key, parsedValue)
    })

    // Update cache
    settingsCache = settingsMap
    cacheTimestamp = now

    return Object.fromEntries(settingsMap) as SiteSettings
  } catch (error) {
    console.error('Failed to load site settings:', error)
    
    // Return default settings on error
    return getDefaultSettings()
  }
}

function getDefaultSettings(): SiteSettings {
  return {
    site_title: 'West Acton Community Centre',
    site_description: 'A vibrant community centre serving West Acton and surrounding areas',
    contact_phone: '+44 20 1234 5678',
    contact_email: 'info@westactoncc.org.uk',
    address: 'West Acton Community Centre, High Street, London W3',
    social_facebook: '',
    social_twitter: '',
    social_instagram: '',
    booking_enabled: true,
    maintenance_mode: false,
    residents_served: '2,000+',
    weekly_programs: '15+',
    opening_hours_text: '7 days',
    opening_hours_details: 'Open Monday to Sunday, 7am-11pm',
    hero_subtitle: 'Your local hub for education, leisure, and recreational programmes. We serve over 2,000 residents in West Acton with 15+ regular programmes every week.',
    hero_description: 'From Stay & Play sessions for young families to martial arts, fitness classes, and cultural groups — we\'re here to bring our community together and support wellbeing for all ages.',
    hero_background_image: '/img/entrance.jpeg',
    hero_cta_button_text: 'Explore Our Facilities',
    hero_cta_button_link: '/facilities',
    banner_programs_image: '/img/all-programs.jpeg'
  }
}

export async function getSetting(key: string, defaultValue: any = null): Promise<any> {
  const settings = await getSettings()
  return settings[key] ?? defaultValue
}

// Client-side settings fetch function for use in React components
export async function fetchClientSettings(): Promise<SiteSettings> {
  try {
    const response = await fetch('/api/settings')
    if (!response.ok) throw new Error('Failed to fetch settings')
    
    const settingsArray = await response.json()
    const settingsMap = new Map<string, any>([
      ['site_title', 'West Acton Community Centre'],
      ['site_description', 'A vibrant community centre serving West Acton and surrounding areas'],
      ['contact_phone', '+44 20 1234 5678'],
      ['contact_email', 'info@westactoncc.org.uk'],
      ['address', 'West Acton Community Centre, High Street, London W3'],
      ['social_facebook', ''],
      ['social_twitter', ''],
      ['social_instagram', ''],
      ['booking_enabled', true],
      ['maintenance_mode', false],
      ['residents_served', '2,000+'],
      ['weekly_programs', '15+'],
      ['opening_hours_text', '7 days'],
      ['opening_hours_details', 'Open Monday to Sunday, 7am-11pm'],
      ['hero_subtitle', 'Your local hub for education, leisure, and recreational programmes. We serve over 2,000 residents in West Acton with 15+ regular programmes every week.'],
      ['hero_description', 'From Stay & Play sessions for young families to martial arts, fitness classes, and cultural groups — we\'re here to bring our community together and support wellbeing for all ages.'],
      ['hero_background_image', '/img/entrance.jpeg'],
      ['hero_cta_button_text', 'Explore Our Facilities'],
      ['hero_cta_button_link', '/facilities'],
      ['banner_programs_image', '/img/all-programs.jpeg']
    ])

    settingsArray.forEach((setting: any) => {
      let value = setting.value
      
      switch (setting.type) {
        case 'boolean':
          value = value === 'true'
          break
        case 'number':
          value = value ? parseFloat(value) : 0
          break
        case 'json':
          try {
            value = value ? JSON.parse(value) : null
          } catch {
            value = null
          }
          break
      }
      
      settingsMap.set(setting.key, value)
    })

    return Object.fromEntries(settingsMap) as SiteSettings
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return getDefaultSettings()
  }
}

// Clear settings cache (useful after updates)
export function clearSettingsCache() {
  settingsCache = null
  cacheTimestamp = 0
}