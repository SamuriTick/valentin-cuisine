// Kimchi feedback form questions, shared by the public form, the save API and the admin results.

export type Question =
  | { key: string; label: string; kind: 'choice'; options: string[]; emoji?: string[] }
  | { key: string; label: string; kind: 'multi'; options: string[] }
  | { key: string; label: string; kind: 'grid'; rows: string[]; options: string[] }
  | { key: string; label: string; kind: 'text'; placeholder?: string }

export type Answers = Record<string, string | string[]>

const AMOUNT = ['Too little', 'Just right', 'Too much']
const YES_NO = ['Yes', 'Maybe', 'No']

export const OVERALL_OPTIONS = ['Not for me', 'OK', 'Good', 'Really good', 'Amazing']

export const MAIN_QUESTIONS: Question[] = [
  { key: 'overall', label: 'How was it overall?', kind: 'choice', options: OVERALL_OPTIONS, emoji: ['😞', '😐', '🙂', '😋', '🤩'] },
  { key: 'taste', label: 'How was the taste?', kind: 'grid', rows: ['Spicy', 'Salty', 'Sour', 'Garlicky'], options: AMOUNT },
  { key: 'price', label: 'Was the price fair?', kind: 'choice', options: ['Too expensive', 'Fair', 'Good value', 'Bargain'] },
  { key: 'pay1kg', label: 'What would you pay for a 1kg jar?', kind: 'choice', options: ['£8', '£10', '£12', '£15+'] },
  { key: 'size', label: 'Was the jar size right?', kind: 'choice', options: ['Too small', 'Just right', 'Too big'] },
  { key: 'again', label: 'Would you order again?', kind: 'choice', options: YES_NO },
]

export const EXTRA_QUESTIONS: Question[] = [
  { key: 'collection', label: 'How was collecting it?', kind: 'choice', options: ['Easy', 'OK', 'Difficult'] },
  { key: 'fresh', label: 'How fresh did it feel when you got it?', kind: 'choice', options: ['Too fresh', 'Just right', 'Too fermented'] },
  { key: 'ateWith', label: 'What did you eat it with?', kind: 'multi', options: ['Rice', 'Noodles', 'Ramen', 'Eggs', 'Meat', 'Fried rice', 'On its own', 'Other'] },
  { key: 'recommend', label: 'Would you recommend it to a friend?', kind: 'choice', options: YES_NO },
  { key: 'heard', label: 'How did you hear about us?', kind: 'choice', options: ['Friend', 'WhatsApp', 'Passing by', 'Other'] },
  { key: 'ideas', label: 'What else would you like me to make?', kind: 'text', placeholder: 'Other kimchi, sauces, cakes…' },
  { key: 'change', label: 'Anything else?', kind: 'text', placeholder: 'Anything you would change, or anything at all…' },
]

export const ALL_QUESTIONS = [...MAIN_QUESTIONS, ...EXTRA_QUESTIONS]

// Grid answers are stored per row, e.g. "taste.Spicy"
export const gridKey = (q: { key: string }, row: string) => `${q.key}.${row}`

// Keep only known questions and allowed options; returns null if the required "overall" is missing
export function cleanAnswers(raw: unknown): Answers | null {
  if (!raw || typeof raw !== 'object') return null
  const input = raw as Record<string, unknown>
  const out: Answers = {}
  for (const q of ALL_QUESTIONS) {
    if (q.kind === 'grid') {
      for (const row of q.rows) {
        const v = input[gridKey(q, row)]
        if (typeof v === 'string' && q.options.includes(v)) out[gridKey(q, row)] = v
      }
    } else if (q.kind === 'multi') {
      const v = input[q.key]
      if (Array.isArray(v)) {
        const picked = v.filter((x): x is string => typeof x === 'string' && q.options.includes(x))
        if (picked.length) out[q.key] = picked
      }
    } else if (q.kind === 'text') {
      const v = input[q.key]
      if (typeof v === 'string' && v.trim()) out[q.key] = v.trim().slice(0, 2000)
    } else {
      const v = input[q.key]
      if (typeof v === 'string' && q.options.includes(v)) out[q.key] = v
    }
  }
  if (input.share === true) out.share = 'yes'
  if (typeof input.review === 'string' && input.review.trim()) out.review = input.review.trim().slice(0, 2000)
  return out.overall ? out : null
}
