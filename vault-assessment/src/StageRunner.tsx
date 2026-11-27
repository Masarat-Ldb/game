import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import type { Answers, Question, Stage } from './data'

function Pick({ q, value, onChange, color }: { q: Extract<Question, { kind: 'pick' }>; value: string[]; onChange: (v: string[]) => void; color: string }) {
  const toggle = (o: string) => {
    if (value.includes(o)) onChange(value.filter((v) => v !== o))
    else if (value.length < q.max) onChange([...value, o])
    else onChange([...value.slice(1), o])
  }
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--zat-muted)]">
        {q.min === q.max ? `Choose ${q.max}` : `Choose ${q.min} to ${q.max}`} · {value.length} selected
      </p>
      <div className="flex flex-wrap gap-2.5">
        {q.options.map((o) => {
          const on = value.includes(o)
          return (
            <motion.button
              key={o}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => toggle(o)}
              aria-pressed={on}
              className="inline-flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-base transition-colors sm:text-lg"
              style={{ borderColor: on ? color : 'rgba(240,238,246,0.14)', background: on ? `${color}22` : 'transparent', color: on ? '#fff' : 'var(--zat-fg)' }}
            >
              {on && <Check size={16} style={{ color }} />}{o}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

function Single({ q, value, onChange, color }: { q: Extract<Question, { kind: 'single' }>; value?: string; onChange: (v: string) => void; color: string }) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {q.options.map((o, i) => {
        const on = value === o
        return (
          <motion.button key={o} type="button" whileTap={{ scale: 0.97 }} onClick={() => onChange(o)} aria-pressed={on}
            className="flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left text-base transition-colors sm:text-lg"
            style={{ borderColor: on ? color : 'rgba(240,238,246,0.12)', background: on ? `${color}1f` : 'rgba(240,238,246,0.03)' }}>
            <span className="font-mono-ui grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs" style={{ borderColor: on ? color : 'rgba(240,238,246,0.2)', color: on ? color : 'var(--zat-muted)' }}>{String.fromCharCode(65 + i)}</span>
            {o}
          </motion.button>
        )
      })}
    </div>
  )
}

function Duel({ q, value, onChange, color }: { q: Extract<Question, { kind: 'duel' }>; value?: string; onChange: (v: string) => void; color: string }) {
  return (
    <div className="relative grid gap-3 sm:grid-cols-2">
      {q.options.map((o, i) => {
        const on = value === o
        const dim = value && !on
        return (
          <motion.button key={o} type="button" whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} onClick={() => onChange(o)} aria-pressed={on}
            animate={{ opacity: dim ? 0.45 : 1, scale: on ? 1.02 : 1 }}
            className="flex min-h-[150px] flex-col justify-between rounded-[28px] border-2 p-5 text-left sm:min-h-[200px] sm:p-6"
            style={{ borderColor: on ? color : 'rgba(240,238,246,0.12)', background: on ? `linear-gradient(150deg, ${color}40, transparent 70%)` : 'rgba(240,238,246,0.03)' }}>
            <span className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--zat-muted)]">Option {i === 0 ? 'A' : 'B'}</span>
            <span className="text-2xl font-semibold leading-tight sm:text-3xl">{o}</span>
          </motion.button>
        )
      })}
      <span className="font-mono-ui pointer-events-none absolute left-1/2 top-1/2 hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-[var(--zat-bg)] text-xs text-[var(--zat-muted)] sm:grid">or</span>
    </div>
  )
}

function Scale({ q, value, onChange, color }: { q: Extract<Question, { kind: 'scale' }>; value?: number; onChange: (v: number) => void; color: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((n) => {
          const on = value === n
          return (
            <motion.button key={n} type="button" whileTap={{ scale: 0.92 }} onClick={() => onChange(n)} aria-pressed={on} aria-label={`${n} of 5`}
              className="flex h-20 items-end justify-center rounded-2xl border-2 pb-3 text-xl font-semibold sm:h-28"
              style={{ borderColor: on ? color : 'rgba(240,238,246,0.12)', background: value && n <= value ? `linear-gradient(to top, ${color}${on ? '66' : '2a'}, transparent ${40 + n * 12}%)` : 'rgba(240,238,246,0.03)' }}>
              {n}
            </motion.button>
          )
        })}
      </div>
      <div className="flex justify-between text-sm text-[var(--zat-muted)]"><span>{q.low}</span><span>{q.high}</span></div>
    </div>
  )
}

export function answered(q: Question, v: Answers[string] | undefined) {
  if (q.kind === 'pick') return Array.isArray(v) && v.length >= q.min
  return v !== undefined && v !== ''
}

export default function StageRunner({ stage, answers, setAnswer, onDone, onExit }: { stage: Stage; answers: Answers; setAnswer: (id: string, v: Answers[string]) => void; onDone: () => void; onExit: () => void }) {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const q = stage.questions[i]
  const ok = answered(q, answers[q.id])
  const go = (d: 1 | -1) => {
    if (d === 1 && i === stage.questions.length - 1) return onDone()
    if (d === -1 && i === 0) return onExit()
    setDir(d); setI(i + d)
  }

  return (
    <div className="flex w-full max-w-3xl flex-col gap-8">
      <div className="flex items-center gap-3">
        {stage.questions.map((_, k) => (
          <div key={k} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full rounded-full" style={{ background: stage.color }} initial={false} animate={{ width: k < i || (k === i && ok) ? '100%' : k === i ? '35%' : '0%' }} />
          </div>
        ))}
        <span className="font-mono-ui text-xs tabular-nums text-[var(--zat-muted)]">{i + 1}/{stage.questions.length}</span>
      </div>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={q.id} custom={dir}
          initial={{ opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -40 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col gap-7">
          <h2 className="font-semibold leading-[1.1] tracking-tight" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.9rem)', textWrap: 'balance' }}>{q.prompt}</h2>
          {q.kind === 'pick' && <Pick q={q} value={(answers[q.id] as string[]) ?? []} onChange={(v) => setAnswer(q.id, v)} color={stage.color} />}
          {q.kind === 'single' && <Single q={q} value={answers[q.id] as string} onChange={(v) => setAnswer(q.id, v)} color={stage.color} />}
          {q.kind === 'duel' && <Duel q={q} value={answers[q.id] as string} onChange={(v) => setAnswer(q.id, v)} color={stage.color} />}
          {q.kind === 'scale' && <Scale q={q} value={answers[q.id] as number} onChange={(v) => setAnswer(q.id, v)} color={stage.color} />}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <button type="button" onClick={() => go(-1)} className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium uppercase tracking-widest text-[var(--zat-muted)] hover:text-[var(--zat-fg)]">
          <ArrowLeft size={16} /> {i === 0 ? 'Vault' : 'Back'}
        </button>
        <button type="button" disabled={!ok} onClick={() => go(1)}
          className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
          style={{ background: 'var(--zat-brand-gradient)', boxShadow: '0 6px 20px rgba(145,104,240,0.35)' }}>
          {i === stage.questions.length - 1 ? 'Earn the key' : 'Next'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
