import { motion } from 'framer-motion'
import { ArrowUpRight, RotateCcw } from 'lucide-react'
import { STAGES, letterLine, nextSteps, scores, stageKey, type Answers } from './data'
import { ICONS } from './Seal'

function Pentagon({ values }: { values: number[] }) {
  const cx = 150, cy = 150, R = 110
  const pt = (i: number, r: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
  }
  const poly = (r: (i: number) => number) => STAGES.map((_, i) => pt(i, r(i)).join(',')).join(' ')
  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[340px]" role="img" aria-label={`Your shape: ${STAGES.map((s, i) => `${s.name} ${values[i]}`).join(', ')}`}>
      <defs>
        <linearGradient id="pent" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9168f0" /><stop offset="0.5" stopColor="#5b8cf5" /><stop offset="1" stopColor="#22d3b4" /></linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f) => <polygon key={f} points={poly(() => R * f)} fill="none" stroke="rgba(240,238,246,0.12)" />)}
      {STAGES.map((_, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(240,238,246,0.08)" /> })}
      <motion.polygon
        points={poly((i) => (R * values[i]) / 100)}
        fill="url(#pent)" fillOpacity="0.35" stroke="url(#pent)" strokeWidth="2.5"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, type: 'spring', stiffness: 60 }}
        style={{ transformOrigin: '150px 150px' }}
      />
      {STAGES.map((s, i) => {
        const [x, y] = pt(i, (R * values[i]) / 100)
        const [lx, ly] = pt(i, R + 24)
        return (
          <g key={s.id}>
            <circle cx={x} cy={y} r="5" fill={s.color} />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#a29eb0" fontSize="11" fontFamily="JetBrains Mono, monospace" style={{ textTransform: 'uppercase' }}>{s.name.split(' ')[0]}</text>
          </g>
        )
      })}
    </svg>
  )
}

export default function Results({ answers, name, onReset }: { answers: Answers; name: string; onReset: () => void }) {
  const vals = scores(answers)
  const code = STAGES.map((s) => `${s.name[0]}${stageKey(s, answers).join('')}`)
  const steps = nextSteps(answers)

  return (
    <div className="flex w-full max-w-5xl flex-col gap-6">
      {/* The opened letter */}
      <motion.article
        initial={{ y: 80, opacity: 0, rotateX: 20 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative overflow-hidden rounded-[32px] bg-[#f6f4fb] p-7 text-[var(--zat-ink)] sm:p-12 md:rounded-[44px]"
      >
        <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: 'var(--zat-brand-gradient)' }} />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em] opacity-50">Vault of Potential · opened</p>
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em] opacity-50">Your code {code.join(' · ')}</p>
        </div>
        <h1 className="mt-6 font-black uppercase leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.6rem)' }}>Dear {name.trim() || 'you'},</h1>
        <div className="mt-6 flex max-w-3xl flex-col gap-4">
          {STAGES.map((s, i) => {
            const Icon = ICONS[s.id]
            return (
              <motion.p key={s.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.25 }} className="flex gap-3 text-lg leading-relaxed sm:text-2xl">
                <span className="mt-1.5 grid h-8 w-8 shrink-0 place-items-center rounded-full" style={{ background: s.color, color: '#0d0c12' }}><Icon size={16} strokeWidth={2.4} /></span>
                <span>{letterLine(s, answers)}</span>
              </motion.p>
            )
          })}
        </div>
        <p className="mt-8 text-lg font-semibold">With you on the way,<br /><span className="text-3xl font-black uppercase tracking-tight">ZAT</span></p>
      </motion.article>

      {/* Map + next steps */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} className="flex flex-col items-center gap-4 rounded-[32px] border border-white/10 bg-[var(--zat-panel)] p-6 sm:p-8">
          <div className="self-start">
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--zat-muted)]">Your map</p>
            <h2 className="text-2xl font-semibold uppercase">The shape of your potential</h2>
          </div>
          <Pentagon values={vals} />
          <p className="self-start text-sm text-[var(--zat-muted)]">A quick preview from 15 answers. The full ZAT Journey goes much deeper.</p>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }} className="flex flex-col gap-5 rounded-[32px] border border-white/10 bg-[var(--zat-panel)] p-6 sm:p-8">
          <div>
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--zat-muted)]">Your next steps · {String(answers.decision ?? '')}</p>
            <h2 className="text-2xl font-semibold uppercase">Start this week</h2>
          </div>
          <ol className="flex flex-col gap-3">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-4 rounded-2xl bg-white/[0.04] p-4">
                <span className="hero-heading text-3xl font-black leading-none">{String(i + 1).padStart(2, '0')}</span>
                <span className="leading-snug">{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-auto flex flex-wrap gap-3 pt-2">
            <a href="https://www.zat.pro/auth?tab=register" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium uppercase tracking-widest text-white" style={{ background: 'var(--zat-brand-gradient)', outline: '2px solid #fff', outlineOffset: '-3px' }}>
              Get the full report <ArrowUpRight size={16} />
            </a>
            <button type="button" onClick={onReset} className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-5 py-3 text-sm font-medium uppercase tracking-widest text-[var(--zat-fg)] hover:bg-white/10">
              <RotateCcw size={15} /> Reseal
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
