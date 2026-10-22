import { motion } from 'framer-motion';
import { Zap, Star, ChevronRight, Battery, Navigation } from 'lucide-react';

function StarParticle({ x, y, delay }) {
  return (
    <motion.div
      className="absolute w-0.5 h-0.5 rounded-full bg-cyan-400"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
      transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay }}
    />
  );
}

function MercedesSilhouette() {
  return (
    <div className="relative w-full max-w-2xl mx-auto h-48 flex items-center justify-center">
      {/* Car body SVG */}
      <svg viewBox="0 0 600 200" className="w-full h-full" fill="none">
        {/* Glow floor reflection */}
        <ellipse cx="300" cy="185" rx="220" ry="18" fill="#00F0FF" opacity="0.08" />
        <ellipse cx="300" cy="185" rx="160" ry="10" fill="#00F0FF" opacity="0.12" />
        <ellipse cx="300" cy="185" rx="100" ry="6" fill="#00E5A3" opacity="0.15" />

        {/* Car shadow */}
        <ellipse cx="300" cy="182" rx="200" ry="8" fill="#000" opacity="0.6" />

        {/* Main body */}
        <path
          d="M 60 155 Q 60 135 80 130 L 120 120 L 180 95 Q 220 70 290 68 Q 360 66 420 75 L 470 90 L 520 115 L 540 130 Q 555 138 555 155 Z"
          fill="#0a0e14"
          stroke="#1e293b"
          strokeWidth="1"
        />

        {/* Roof */}
        <path
          d="M 160 120 Q 180 90 230 75 Q 280 62 340 62 Q 390 62 430 78 L 460 95 L 420 90 Q 360 73 290 73 Q 220 73 180 95 Z"
          fill="#0d1218"
          stroke="#00F0FF"
          strokeWidth="0.5"
          opacity="0.6"
        />

        {/* Front headlight glow */}
        <circle cx="535" cy="137" r="12" fill="#00F0FF" opacity="0.3" />
        <circle cx="535" cy="137" r="6" fill="#00F0FF" opacity="0.6" />
        {/* LED strip */}
        <path d="M 510 128 Q 530 125 545 132" stroke="#00F0FF" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
        <path d="M 510 128 Q 530 125 545 132" stroke="#fff" strokeWidth="0.5" opacity="0.5" strokeLinecap="round" />

        {/* Animated LED headlight dots */}
        {[0, 1, 2, 3, 4].map(i => (
          <motion.circle
            key={i}
            cx={515 + i * 6}
            cy={132 - i * 1}
            r={1.2}
            fill="#00F0FF"
            opacity="0"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity, repeatDelay: 1.5 }}
          />
        ))}

        {/* Rear headlight */}
        <circle cx="68" cy="143" r="8" fill="#FF2244" opacity="0.4" />
        <circle cx="68" cy="143" r="4" fill="#FF2244" opacity="0.7" />

        {/* Wheels */}
        <circle cx="160" cy="168" r="22" fill="#080c12" stroke="#1e293b" strokeWidth="2" />
        <circle cx="160" cy="168" r="14" fill="#0a0e14" stroke="#2a3444" strokeWidth="1" />
        <circle cx="160" cy="168" r="6" fill="#00F0FF" opacity="0.5" />

        <circle cx="430" cy="168" r="22" fill="#080c12" stroke="#1e293b" strokeWidth="2" />
        <circle cx="430" cy="168" r="14" fill="#0a0e14" stroke="#2a3444" strokeWidth="1" />
        <circle cx="430" cy="168" r="6" fill="#00F0FF" opacity="0.5" />

        {/* Three-pointed star (roof center) */}
        <g transform="translate(295,80)">
          <circle r="8" fill="#0d1218" stroke="#C4B896" strokeWidth="0.8" />
          {[0, 120, 240].map(angle => (
            <line
              key={angle}
              x1="0"
              y1="0"
              x2={Math.cos((angle - 90) * Math.PI / 180) * 6}
              y2={Math.sin((angle - 90) * Math.PI / 180) * 6}
              stroke="#C4B896"
              strokeWidth="1.2"
              opacity="0.8"
            />
          ))}
        </g>

        {/* Ambient floor glow lines */}
        <motion.line
          x1="100" y1="183" x2="500" y2="183"
          stroke="#00F0FF"
          strokeWidth="1"
          opacity="0.2"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}

export function StartScreen({ onLaunch, onStartTour }) {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    id: i,
  }));

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 80%, #001a1f 0%, #03070C 60%)' }}
    >
      {/* Star pattern bg */}
      <div className="absolute inset-0 star-pattern opacity-40" />

      {/* Animated star particles */}
      {stars.map(s => <StarParticle key={s.id} x={s.x} y={s.y} delay={s.delay} />)}

      {/* Top gradient */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cyan-950/20 to-transparent" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-3xl w-full">

        {/* Brand + MBRDI badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-3 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/15 flex items-center justify-center">
              {/* MB star */}
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <circle cx="12" cy="12" r="10" fill="none" stroke="#C4B896" strokeWidth="0.8" />
                {[0, 120, 240].map(angle => (
                  <line
                    key={angle}
                    x1="12" y1="12"
                    x2={12 + Math.cos((angle - 90) * Math.PI / 180) * 8}
                    y2={12 + Math.sin((angle - 90) * Math.PI / 180) * 8}
                    stroke="#C4B896"
                    strokeWidth="1.2"
                  />
                ))}
              </svg>
            </div>
            <span className="text-xs font-bold tracking-[0.3em] text-white/50 uppercase">Mercedes-Benz EQ</span>
            <div className="h-4 w-px bg-white/15" />
            <span className="text-xs font-bold tracking-[0.2em] text-cyan-400/70 uppercase">MBRDI × T-Hub</span>
          </div>

          <motion.div
            className="px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-400/20"
            animate={{ borderColor: ['rgba(0,240,255,0.2)', 'rgba(0,240,255,0.4)', 'rgba(0,240,255,0.2)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-xs text-cyan-400/80 font-medium">Apple CarPlay Ultra Integration</span>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-2">
            EQ{' '}
            <span style={{ background: 'linear-gradient(135deg, #00F0FF 0%, #00E5A3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AURA
            </span>
          </h1>
          <p className="text-sm font-semibold text-white/50 tracking-widest uppercase">
            Zero-Anxiety Highway Co-Pilot
          </p>
        </motion.div>

        {/* Car silhouette */}
        <motion.div
          className="w-full mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <MercedesSilhouette />
        </motion.div>

        {/* Live stats row */}
        <motion.div
          className="flex items-center gap-4 mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { icon: Battery, label: 'SoC', value: '84%', sub: 'Ready', color: '#00E5A3' },
            { icon: Navigation, label: 'Range', value: '462 km', sub: 'Highway', color: '#00F0FF' },
            { icon: Zap, label: 'Mode', value: 'ECO+', sub: 'Active', color: '#00E5A3' },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className="flex flex-col items-center">
              <div
                className="px-4 py-2.5 rounded-2xl border mb-1"
                style={{ background: `${color}10`, borderColor: `${color}30` }}
              >
                <div className="flex items-center gap-1.5">
                  <Icon size={13} style={{ color }} />
                  <span className="text-sm font-black text-white">{value}</span>
                </div>
                <p className="text-xs text-white/35 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            onClick={onLaunch}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm text-black"
            style={{ background: 'linear-gradient(135deg, #00F0FF 0%, #00E5A3 100%)', boxShadow: '0 0 24px #00F0FF44' }}
            whileHover={{ scale: 1.03, boxShadow: '0 0 32px #00F0FF66' }}
            whileTap={{ scale: 0.97 }}
          >
            <Zap size={16} fill="currentColor" />
            Launch Apple CarPlay EQ Co-Pilot
            <ChevronRight size={16} />
          </motion.button>

          <motion.button
            onClick={onStartTour}
            className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-semibold text-sm border border-white/15 text-white/70 hover:text-white transition-colors bg-white/4 hover:bg-white/8"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Star size={14} />
            Interactive Tour
          </motion.button>
        </motion.div>

        <motion.p
          className="mt-6 text-xs text-white/25 tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Bengaluru → Hyderabad · NH-48 Ultra-Fast Corridor · 568 km
        </motion.p>
      </div>
    </div>
  );
}
