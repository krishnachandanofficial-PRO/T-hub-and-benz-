import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Zap, RotateCcw, Play } from 'lucide-react';

export function ChaosBar({ triggerChaos, resetChaos, chaosMode, startOnboarding, openModal }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const buttons = [
    {
      id: 'silent_fail',
      label: 'Simulate Silent Charger Failure',
      icon: Shield,
      color: '#f59e0b',
      chaos: 'silent_fail',
    },
    {
      id: 'derating',
      label: 'Simulate Power Derating: 120kW → 22kW',
      icon: Zap,
      color: '#f87171',
      chaos: 'derating',
    },
    {
      id: 'sos',
      label: 'Simulate 0% Battery → Dispatch Mobile Van',
      icon: AlertTriangle,
      color: '#FF6B35',
      chaos: 'sos',
    },
    {
      id: 'tour',
      label: 'Open Interactive Tour',
      icon: Play,
      color: '#00F0FF',
      chaos: null,
    },
  ];

  return (
    <React.Fragment>
      {/* Toggle tab */}
      <div className="flex justify-center">
        <motion.button
          onClick={() => setIsExpanded(v => !v)}
          className="px-4 py-1.5 rounded-t-xl bg-slate-900/90 border border-white/10 border-b-0 text-xs text-white/50 hover:text-white/80 transition-colors flex items-center gap-2"
          whileHover={{ y: -1 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Judge Chaos Monkey
          <span className="text-white/25">{isExpanded ? '▼' : '▲'}</span>
        </motion.button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        className="overflow-hidden"
      >
        <div className="bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {buttons.map(btn => {
              const Icon = btn.icon;
              const isActive = chaosMode === btn.chaos;

              return (
                <motion.button
                  key={btn.id}
                  onClick={() => {
                    if (btn.chaos) triggerChaos(btn.chaos);
                    else startOnboarding();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all"
                  style={{
                    background: isActive ? `${btn.color}20` : 'rgba(255,255,255,0.04)',
                    borderColor: isActive ? `${btn.color}50` : 'rgba(255,255,255,0.08)',
                    color: isActive ? btn.color : 'rgba(255,255,255,0.55)',
                    boxShadow: isActive ? `0 0 12px ${btn.color}30` : 'none',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon size={13} />
                  {btn.label}
                </motion.button>
              );
            })}

            {chaosMode && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={resetChaos}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/15 text-xs font-semibold text-white/50 hover:text-white/80 transition-colors"
              >
                <RotateCcw size={12} />
                Reset
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </React.Fragment>
  );
}


