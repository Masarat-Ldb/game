// Prototype content for the ZAT "Vault of Potential" assessment.
// PLACEHOLDER QUESTIONS: swap for ZAT's real assessment items.

export type Question =
  | { id: string; kind: 'pick'; prompt: string; options: string[]; min: number; max: number }
  | { id: string; kind: 'single'; prompt: string; options: string[] }
  | { id: string; kind: 'duel'; prompt: string; options: [string, string] }
  | { id: string; kind: 'scale'; prompt: string; low: string; high: string }

export type Stage = {
  id: 'heart' | 'brain' | 'spirit' | 'map' | 'way'
  name: string
  tagline: string
  color: string
  questions: Question[]
}

export const STAGES: Stage[] = [
  {
    id: 'heart', name: 'Heart', tagline: 'What moves you', color: '#F45B78',
    questions: [
      { id: 'values', kind: 'pick', prompt: 'Which values feel most like you?', min: 3, max: 3, options: ['Freedom', 'Family', 'Growth', 'Impact', 'Security', 'Creativity', 'Adventure', 'Justice', 'Recognition', 'Peace'] },
      { id: 'saturday', kind: 'duel', prompt: 'On a free Saturday, you would rather…', options: ['Help a friend with their project', 'Start a project of your own'] },
      { id: 'meaning', kind: 'scale', prompt: 'How much does meaningful work matter to you?', low: 'A little', high: 'It’s everything' },
    ],
  },
  {
    id: 'brain', name: 'Brain', tagline: 'How you think', color: '#5B8CF5',
    questions: [
      { id: 'problem', kind: 'duel', prompt: 'Faced with a new problem, you first…', options: ['Break it into steps', 'Picture the big idea'] },
      { id: 'learn', kind: 'single', prompt: 'You learn best by…', options: ['Doing it hands-on', 'Reading and research', 'Watching someone do it', 'Talking it through'] },
      { id: 'uncertainty', kind: 'scale', prompt: 'How comfortable are you deciding with incomplete information?', low: 'Very uneasy', high: 'Totally fine' },
    ],
  },
  {
    id: 'spirit', name: 'Spirit', tagline: 'Who you’re becoming', color: '#22D3B4',
    questions: [
      { id: 'becoming', kind: 'pick', prompt: 'Who are you becoming? Pick the two that pull at you.', min: 2, max: 2, options: ['A leader', 'A creator', 'A healer', 'A builder', 'An explorer', 'A teacher', 'A specialist', 'A founder'] },
      { id: 'proud', kind: 'duel', prompt: 'In five years you’d be prouder of…', options: ['Mastering one craft', 'Exploring many paths'] },
      { id: 'clarity', kind: 'scale', prompt: 'How clear is your picture of the person you want to become?', low: 'Blurry', high: 'Crystal clear' },
    ],
  },
  {
    id: 'map', name: 'Strengths & gaps', tagline: 'Where you stand', color: '#9168F0',
    questions: [
      { id: 'strengths', kind: 'pick', prompt: 'What do people come to you for?', min: 2, max: 3, options: ['Advice', 'Ideas', 'Getting things done', 'Calm in chaos', 'Explaining things', 'Fixing problems', 'Making people laugh', 'Organising'] },
      { id: 'gaps', kind: 'pick', prompt: 'Where do you get stuck most often?', min: 1, max: 2, options: ['Starting', 'Finishing', 'Saying no', 'Speaking up', 'Staying focused', 'Asking for help'] },
      { id: 'confidence', kind: 'scale', prompt: 'How confident are you in your strengths?', low: 'Not yet', high: 'Very' },
    ],
  },
  {
    id: 'way', name: 'Next steps', tagline: 'Where you could go', color: '#FFC929',
    questions: [
      { id: 'decision', kind: 'single', prompt: 'What decision is in front of you right now?', options: ['Choosing what to study', 'Finding my first job', 'Changing careers', 'Growing where I am', 'Not sure yet'] },
      { id: 'time', kind: 'single', prompt: 'How much time can you give your growth each week?', options: ['Under 1 hour', '1 to 3 hours', '3 to 5 hours', 'More than 5 hours'] },
      { id: 'plan', kind: 'duel', prompt: 'You’d rather your plan be…', options: ['A clear step-by-step path', 'A few options to explore'] },
    ],
  },
]

export type Answers = Record<string, string | string[] | number>

// A 3-digit key derived from a stage's answers. Same answers, same key.
export function stageKey(stage: Stage, answers: Answers): number[] {
  const raw = stage.questions.map((q) => JSON.stringify(answers[q.id] ?? '')).join('|') + stage.id
  let h = 2166136261
  for (let i = 0; i < raw.length; i++) { h ^= raw.charCodeAt(i); h = Math.imul(h, 16777619) }
  h = Math.abs(h)
  return [h % 10, Math.floor(h / 10) % 10, Math.floor(h / 100) % 10]
}

const list = (a: unknown) => (Array.isArray(a) ? a : [])
const join = (xs: string[]) => xs.length <= 1 ? (xs[0] ?? '') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`
const lower = (xs: string[]) => xs.map((x) => x.toLowerCase())

// One line of the letter per unlocked seal.
export function letterLine(stage: Stage, a: Answers): string {
  switch (stage.id) {
    case 'heart': return `Your heart already knows what matters: ${join(lower(list(a.values)))}.`
    case 'brain': return a.problem === 'Break it into steps'
      ? 'Your mind turns big problems into clear steps. That is rarer than you think.'
      : 'Your mind sees the whole picture first. That is where new ideas start.'
    case 'spirit': return `You are becoming ${join(lower(list(a.becoming)))}, and you don’t need a box to get there.`
    case 'map': return `People come to you for ${join(lower(list(a.strengths)))}. Your growth edge is ${join(lower(list(a.gaps)))}.`
    case 'way': return 'You don’t need a label. You need a map, and now you have one. You can find the way.'
  }
}

export function scores(a: Answers): number[] {
  const s = (k: string) => (typeof a[k] === 'number' ? (a[k] as number) : 3)
  const timeIdx = ['Under 1 hour', '1 to 3 hours', '3 to 5 hours', 'More than 5 hours'].indexOf(String(a.time))
  return [s('meaning') * 20, s('uncertainty') * 20, s('clarity') * 20, s('confidence') * 20, 40 + Math.max(0, timeIdx) * 20]
}

export function nextSteps(a: Answers): string[] {
  const steps: Record<string, string[]> = {
    'Choosing what to study': ['List three subjects that match your top values', 'Talk to one student in each of them this month', 'Pick the one that fits your Spirit words best'],
    'Finding my first job': ['Turn your top strengths into three lines for your CV', 'Find five roles that need exactly those strengths', 'Practise a story for each strength before interviews'],
    'Changing careers': ['Map which strengths travel to your new field', 'Run a small test project in that field', 'Close your growth edge with one focused course'],
    'Growing where I am': ['Ask your manager for one stretch task that uses your strengths', 'Work on your growth edge for 20 minutes a day', 'Review your progress with ZAT in 30 days'],
    'Not sure yet': ['Re-read your Heart values and circle the one that matters most', 'Try one small experiment that matches it this week', 'Take the full ZAT Journey to sharpen the picture'],
  }
  return steps[String(a.decision)] ?? steps['Not sure yet']
}
