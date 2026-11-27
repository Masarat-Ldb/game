import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Stage } from './data'
import Seal from './Seal'

// Combination lock: roll three wheels to the key the stage just earned.
export default function Lock({ stage, keyDigits, onUnlocked }: { stage: Stage; keyDigits: number[]; onUnlocked: () => void }) {
  const [wheels, setWheels] = useState<number[]>(() => keyDigits.map((d) => (d + 3 + Math.floor(Math.random() * 5)) % 10))
  const [focus, setFocus] = useState(0)
  const solved = wheels.every((w, i) => w === keyDigits[i])
  const [opened, setOpened] = useState(false)

  const roll = (i: number, dir: 1 | -1) => setWheels((ws) => ws.map((w, k) => (k === i ? (w + dir + 10) % 10 : w)))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (opened) return
      if (/^[0-9]$/.test(e.key)) { setWheels((ws) => ws.map((w, k) => (k === focus ? Number(e.key) : w))); setFocus((f) => Math.min(2, f + 1)) }
      if (e.key === 'ArrowUp') roll(focus, 1)
      if (e.key === 'ArrowDown') roll(focus, -1)
      if (e.key === 'ArrowLeft') setFocus((f) => Math.max(0, f - 1))
      if (e.key === 'ArrowRight') setFocus((f) => Math.min(2, f + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focus, opened])

  useEffect(() => {
    if (solved && !opened) { const t = setTimeout(() => setOpened(true), 350); return () => clearTimeout(t) }
  }, [solved, opened])
  useEffect(() => {
    if (opened) { const t = setTimeout(onUnlocked, 2000); return () => clearTimeout(t) }
  }, [opened, onUnlocked])

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--zat-muted)]">Seal {stage.name} · key earned</p>
        <div className="flex gap-2">
          {keyDigits.map((d, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.25 + i * 0.25 }}
              className="font-mono-ui grid h-12 w-10 place-items-center rounded-xl border text-2xl"
              style={{ borderColor: `${stage.color}66`, color: stage.color, background: `${stage.color}14` }}
            >
              {d}
            </motion.span>
          ))}
        </div>
        <p className="max-w-xs text-sm font-light text-[var(--zat-muted)]">This key came from your answers. Roll the wheels to match it and break the seal.</p>
      </div>

      <div className="relative flex items-center gap-5 rounded-[36px] border border-white/10 bg-[var(--zat-panel)] px-6 py-5 sm:gap-7 sm:px-8">
        {wheels.map((w, i) => {
          const ok = w === keyDigits[i]
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <button type="button" aria-label={`Wheel ${i + 1} up`} onClick={() => { setFocus(i); roll(i, 1) }} className="rounded-full p-1.5 text-[var(--zat-muted)] hover:bg-white/10 hover:text-[var(--zat-fg)]"><ChevronUp size={22} /></button>
              <div
                onClick={() => setFocus(i)}
                className="relative h-20 w-14 overflow-hidden rounded-2xl border-2 bg-[var(--zat-bg)] sm:h-24 sm:w-16"
                style={{ borderColor: ok ? stage.color : focus === i ? 'rgba(240,238,246,0.5)' : 'rgba(240,238,246,0.12)', boxShadow: ok ? `0 0 24px ${stage.color}55` : 'none' }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={w}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute inset-0 grid place-items-center text-4xl font-semibold tabular-nums sm:text-5xl"
                    style={{ color: ok ? stage.color : 'var(--zat-fg)' }}
                  >
                    {w}
                  </motion.span>
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--zat-bg)] via-transparent to-[var(--zat-bg)] opacity-60" />
              </div>
              <button type="button" aria-label={`Wheel ${i + 1} down`} onClick={() => { setFocus(i); roll(i, -1) }} className="rounded-full p-1.5 text-[var(--zat-muted)] hover:bg-white/10 hover:text-[var(--zat-fg)]"><ChevronDown size={22} /></button>
            </div>
          )
        })}
      </div>

      <motion.div animate={opened ? { scale: [1, 1.25, 1.1] } : {}} transition={{ duration: 0.6 }}>
        <Seal stage={stage} open={opened} active={!opened} size={96} />
      </motion.div>
      <p className="h-5 text-sm font-medium" style={{ color: opened ? stage.color : 'var(--zat-muted)' }}>
        {opened ? `${stage.name} unsealed. A new line of your letter is revealed…` : solved ? 'Click…' : 'Tip: type the digits or use the arrows'}
      </p>
    </div>
  )
}
