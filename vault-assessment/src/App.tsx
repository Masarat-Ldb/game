import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { STAGES, stageKey, type Answers } from './data'
import Vault from './Vault'
import StageRunner from './StageRunner'
import Lock from './Lock'
import Results from './Results'
import Seal from './Seal'

type View = 'vault' | 'stage' | 'lock' | 'results'
type Saved = { opened: number; answers: Answers; name: string }
const KEY = 'zat-vault-v1'

function load(): Saved {
  try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r) } catch { /* storage unavailable */ }
  return { opened: 0, answers: {}, name: '' }
}

function Burst({ color }: { color: string }) {
  const bits = useMemo(() => Array.from({ length: 36 }, (_, i) => ({ a: (i / 36) * Math.PI * 2 + Math.random() * 0.3, d: 120 + Math.random() * 160, c: i % 3 === 0 ? '#f0eef6' : color, s: 4 + Math.random() * 6 })), [color])
  return (
    <div className="pointer-events-none fixed left-1/2 top-1/2 z-50">
      {bits.map((b, i) => (
        <motion.span key={i} className="absolute rounded-full" style={{ width: b.s, height: b.s, background: b.c }}
          initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: Math.cos(b.a) * b.d, y: Math.sin(b.a) * b.d + 60, opacity: 0 }} transition={{ duration: 1.4, ease: 'easeOut' }} />
      ))}
    </div>
  )
}

export default function App() {
  const [saved, setSaved] = useState<Saved>(load)
  const [view, setView] = useState<View>(() => (load().opened >= STAGES.length ? 'results' : 'vault'))
  const [burst, setBurst] = useState(0)
  const { opened, answers, name } = saved
  const stage = STAGES[Math.min(opened, STAGES.length - 1)]

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(saved)) } catch { /* ignore */ } }, [saved])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [view])

  const setAnswer = (id: string, v: Answers[string]) => setSaved((s) => ({ ...s, answers: { ...s.answers, [id]: v } }))
  const unlocked = useCallback(() => {
    setBurst((b) => b + 1)
    setSaved((s) => ({ ...s, opened: s.opened + 1 }))
    setView('vault')
  }, [])
  const reset = () => { setSaved({ opened: 0, answers: {}, name: '' }); setView('vault') }

  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* ambience */}
      <div className="pointer-events-none fixed inset-0" aria-hidden>
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] max-w-[180%] -translate-x-1/2 rounded-full opacity-25 blur-[120px]" style={{ background: view === 'stage' || view === 'lock' ? stage.color : 'var(--zat-brand-gradient)', transition: 'background 0.8s' }} />
        <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'radial-gradient(rgba(240,238,246,0.5) 1px, transparent 1px)', backgroundSize: '44px 44px', maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)' }} />
      </div>

      <header className="relative z-10 flex items-center justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-7">
        <button type="button" onClick={() => setView(opened >= STAGES.length ? 'results' : 'vault')} className="text-2xl font-black uppercase tracking-tight">ZAT</button>
        <nav aria-label="Seals" className="flex items-center gap-1.5 sm:gap-2.5">
          {STAGES.map((s, i) => <Seal key={s.id} stage={s} open={i < opened} active={i === opened && view !== 'results'} size={30} />)}
        </nav>
        <span className="font-mono-ui hidden text-[11px] uppercase tracking-[0.18em] text-[var(--zat-muted)] sm:block">~12 min · {opened}/5</span>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-start justify-center px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <AnimatePresence mode="wait">
          <motion.div key={view + opened} className="flex w-full justify-center"
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }} transition={{ duration: 0.45 }}>
            {view === 'vault' && <Vault opened={opened} answers={answers} name={name} setName={(n) => setSaved((s) => ({ ...s, name: n }))} onStart={() => setView('stage')} onReveal={() => setView('results')} />}
            {view === 'stage' && (
              <div className="flex w-full flex-col items-center gap-8">
                <div className="flex w-full max-w-3xl items-center gap-4">
                  <Seal stage={stage} open={false} active size={52} />
                  <div>
                    <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em]" style={{ color: stage.color }}>Stage {opened + 1} of 5</p>
                    <p className="text-2xl font-semibold uppercase leading-tight">{stage.name} <span className="font-light normal-case text-[var(--zat-muted)]">· {stage.tagline}</span></p>
                  </div>
                </div>
                <StageRunner key={stage.id} stage={stage} answers={answers} setAnswer={setAnswer} onDone={() => setView('lock')} onExit={() => setView('vault')} />
              </div>
            )}
            {view === 'lock' && <Lock stage={stage} keyDigits={stageKey(stage, answers)} onUnlocked={unlocked} />}
            {view === 'results' && <Results answers={answers} name={name} onReset={reset} />}
          </motion.div>
        </AnimatePresence>
      </main>
      {burst > 0 && <Burst key={burst} color={STAGES[Math.max(0, opened - 1)].color} />}
    </div>
  )
}
