import { motion } from 'framer-motion'
import { ArrowRight, MailOpen } from 'lucide-react'
import { STAGES, letterLine, type Answers } from './data'
import Seal from './Seal'

type Props = {
  opened: number
  answers: Answers
  name: string
  setName: (n: string) => void
  onStart: () => void
  onReveal: () => void
}

// The sealed letter. Each broken seal lifts the letter a little higher out of the envelope.
export default function Vault({ opened, answers, name, setName, onStart, onReveal }: Props) {
  const all = opened >= STAGES.length
  const next = STAGES[Math.min(opened, STAGES.length - 1)]
  const lift = all ? 72 : opened * 13 // % of envelope height the letter rises above the envelope

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--zat-muted)]">{all ? 'All five seals are open' : `${opened} of 5 seals open`}</p>
        <h1 className="hero-heading font-black uppercase leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(2.6rem, 8vw, 6.5rem)' }}>Vault of potential</h1>
        <p className="max-w-md font-light leading-relaxed text-[var(--zat-muted)]" style={{ textWrap: 'balance' }}>
          {all
            ? 'Your letter is ready. Everything you unlocked is written inside.'
            : 'A letter about who you are is sealed inside. Answer each stage to earn its key, then crack the seal.'}
        </p>
      </div>

      {/* Envelope */}
      <motion.div className="w-[min(560px,92vw)]" initial={false} animate={{ paddingTop: `${lift * 0.69}%` }} transition={{ type: 'spring', stiffness: 60, damping: 14 }}>
      <div className="relative w-full" style={{ aspectRatio: '1.45', perspective: 1200 }}>
        {/* back */}
        <div className="absolute inset-0 z-[5] rounded-[28px] bg-[#1c1929] ring-1 ring-white/10" />
        {/* flap (behind the letter once open) */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[58%] origin-top"
          style={{ transformStyle: 'preserve-3d', zIndex: all ? -1 : 30 }}
          initial={false}
          animate={{ rotateX: all ? 178 : 0 }}
          transition={{ duration: 1.1, ease: [0.6, 0, 0.2, 1], delay: all ? 0.3 : 0 }}
        >
          <div className="h-full w-full" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: 'linear-gradient(180deg, #2a2540, #1f1b30)', borderRadius: '28px 28px 0 0' }} />
        </motion.div>

        {/* letter */}
        <motion.div
          className="absolute inset-x-[6%] z-0 rounded-[18px] bg-[#f6f4fb] p-5 text-[var(--zat-ink)] shadow-[0_-10px_40px_rgba(0,0,0,0.35)] sm:p-7"
          style={{ height: '92%' }}
          initial={false}
          animate={{ top: `${6 - lift}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 14 }}
        >
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] opacity-50">Sealed by ZAT · for</p>
          <p className="mt-1 text-xl font-semibold sm:text-2xl">Dear {name.trim() || 'you'},</p>
          <div className="mt-3 flex flex-col gap-2">
            {STAGES.map((s, i) => i < opened ? (
              <motion.p key={s.id} initial={{ opacity: 0, filter: 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ delay: 0.6 }} className="text-[13px] leading-snug sm:text-[15px]">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ background: s.color }} />{letterLine(s, answers)}
              </motion.p>
            ) : (
              <div key={s.id} className="flex gap-1.5 py-1.5" aria-hidden>
                <span className="h-2.5 rounded-full bg-[var(--zat-ink)]/10" style={{ width: `${35 + ((i * 17) % 40)}%` }} />
                <span className="h-2.5 rounded-full bg-[var(--zat-ink)]/10" style={{ width: `${18 + ((i * 11) % 25)}%` }} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* front pocket */}
        <div
          className="absolute inset-0 z-20 rounded-[28px]"
          style={{ clipPath: 'polygon(0 38%, 50% 72%, 100% 38%, 100% 100%, 0 100%)', background: 'linear-gradient(170deg, #26213a 0%, #16141f 80%)' }}
        />
        <div className="pointer-events-none absolute inset-0 z-20 rounded-[28px] ring-1 ring-inset ring-white/10" />

        {/* seals */}
        <div className="absolute inset-x-0 bottom-[7%] z-40 flex items-end justify-center gap-[2.5%]">
          {STAGES.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center gap-1.5" style={{ transform: `translateY(${[-6, -16, -22, -16, -6][i]}px)` }}>
              <Seal stage={s} open={i < opened} active={i === opened} size={58} onClick={i === opened ? onStart : undefined} />
              <span className="font-mono-ui hidden text-[9px] uppercase tracking-[0.16em] text-[var(--zat-muted)] sm:block">{s.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>
      </motion.div>

      {opened === 0 && (
        <label className="flex w-[min(420px,92vw)] flex-col gap-2">
          <span className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--zat-muted)]">Who is this letter for? (optional)</span>
          <input
            id="zat-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            maxLength={24}
            className="rounded-full border-2 border-white/10 bg-transparent px-5 py-3 text-lg text-[var(--zat-fg)] outline-none placeholder:text-white/25 focus:border-[var(--zat-violet)]"
          />
        </label>
      )}

      {all ? (
        <button type="button" onClick={onReveal} className="inline-flex items-center gap-3 rounded-full px-9 py-4 text-sm font-medium uppercase tracking-widest text-white sm:text-base" style={{ background: 'var(--zat-brand-gradient)', boxShadow: '0 10px 30px rgba(145,104,240,0.45)', outline: '2px solid #fff', outlineOffset: '-3px' }}>
          <MailOpen size={18} /> Read your letter
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <button type="button" onClick={onStart} className="inline-flex items-center gap-3 rounded-full px-9 py-4 text-sm font-medium uppercase tracking-widest text-white sm:text-base" style={{ background: 'var(--zat-brand-gradient)', boxShadow: '0 10px 30px rgba(145,104,240,0.35)', outline: '2px solid #fff', outlineOffset: '-3px' }}>
            {opened === 0 ? 'Begin' : 'Continue'} with {next.name} <ArrowRight size={18} />
          </button>
          <p className="text-sm text-[var(--zat-muted)]">Stage {opened + 1} · {next.tagline} · about 2 minutes</p>
        </div>
      )}
    </div>
  )
}
