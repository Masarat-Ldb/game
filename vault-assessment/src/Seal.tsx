import { motion } from 'framer-motion'
import { Brain, Heart, Map, Route, Sparkles, Lock } from 'lucide-react'
import type { Stage } from './data'

export const ICONS = { heart: Heart, brain: Brain, spirit: Sparkles, map: Map, way: Route }

// A wax seal. Locked = dull wax with a lock; open = split in two halves that drift apart.
export default function Seal({ stage, open, active, size = 72, onClick }: { stage: Stage; open: boolean; active?: boolean; size?: number; onClick?: () => void }) {
  const Icon = ICONS[stage.id]
  const wax = open ? stage.color : '#3a3550'
  const id = `wax-${stage.id}-${open ? 'o' : 'c'}`
  const body = (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden className="block">
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#ffffff" stopOpacity={open ? 0.7 : 0.25} />
          <stop offset="0.35" stopColor={wax} />
          <stop offset="1" stopColor="#0d0c12" stopOpacity="0.85" />
        </radialGradient>
      </defs>
      {/* wavy wax edge */}
      <path
        d="M50 4 C58 4 60 10 67 11 C74 12 79 8 84 14 C89 20 86 26 89 32 C92 38 98 42 96 50 C94 58 89 61 89 68 C89 75 92 81 86 86 C80 91 74 87 67 89 C60 91 57 97 50 96 C43 95 40 90 33 89 C26 88 20 92 15 86 C10 80 13 74 11 67 C9 60 3 57 4 50 C5 43 11 40 11 33 C11 26 8 20 14 15 C20 10 26 13 33 11 C40 9 42 4 50 4 Z"
        fill={`url(#${id})`}
      />
      <circle cx="50" cy="50" r="30" fill="none" stroke="#ffffff" strokeOpacity={open ? 0.45 : 0.15} strokeWidth="2" />
    </svg>
  )
  const glyph = open ? <Icon size={size * 0.34} strokeWidth={2.2} /> : <Lock size={size * 0.28} strokeWidth={2.2} />
  const Comp = onClick ? motion.button : motion.div
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-label={`${stage.name} seal, ${open ? 'open' : 'sealed'}`}
      className={`relative grid place-items-center rounded-full ${onClick ? 'cursor-pointer' : ''}`}
      style={{ width: size, height: size, filter: open ? `drop-shadow(0 0 ${size / 5}px ${stage.color}88)` : 'none' }}
      animate={active && !open ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={active && !open ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
      whileHover={onClick ? { scale: 1.08 } : undefined}
    >
      {open ? (
        <>
          <motion.div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 55% 0, 45% 100%, 0 100%)' }} initial={{ x: 0, rotate: 0 }} animate={{ x: -size * 0.06, rotate: -8 }} transition={{ type: 'spring', stiffness: 140, damping: 12 }}>{body}</motion.div>
          <motion.div className="absolute inset-0" style={{ clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 45% 100%)' }} initial={{ x: 0, rotate: 0 }} animate={{ x: size * 0.06, rotate: 8 }} transition={{ type: 'spring', stiffness: 140, damping: 12 }}>{body}</motion.div>
        </>
      ) : <div className="absolute inset-0">{body}</div>}
      <span className="relative" style={{ color: open ? '#0d0c12' : '#a29eb0' }}>{glyph}</span>
      {active && !open && <span className="absolute -inset-1.5 rounded-full border-2" style={{ borderColor: stage.color }} />}
    </Comp>
  )
}
