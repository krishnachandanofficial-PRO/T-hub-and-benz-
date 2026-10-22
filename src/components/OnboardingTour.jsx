import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Car, Globe, Shield, Clock, Truck, BarChart3 } from 'lucide-react';
import { ONBOARDING_STEPS } from '../constants/data';

const ICON_MAP = { Car, Globe, Shield, Clock, Truck, BarChart3 };

const springConfig = { type: 'spring', stiffness: 400, damping: 32 };

export function OnboardingTour({ isOpen, onClose, step, setStep }) {
  const current = ONBOARDING_STEPS[step];
  const Icon = ICON_MAP[current.icon] || Shield;

  const goNext = () => {
    if (step < ONBOARDING_STEPS.length - 1) setStep(step + 1);
    else onClose();
  };
  const goPrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[160] flex items-center justify-center p-6 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-lg bg-slate-950/90 backdrop-blur-3xl border border-white/15 rounded-3xl p-8 pointer-events-auto shadow-2xl"
              initial={{ scale: 0.85, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 40, opacity: 0 }}
              transition={springConfig}
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X size={16} className="text-white/60" />
              </button>

              {/* Step indicator */}
              <div className="flex gap-1.5 mb-6">
                {ONBOARDING_STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className="h-1 rounded-full transition-all duration-300"
                    style={{
                      width: i === step ? '2rem' : '0.5rem',
                      background: i === step ? current.color : 'rgba(255,255,255,0.2)',
                    }}
                  />
                ))}
              </div>

              {/* Header */}
              <div className="flex items-start gap-4 mb-5">
                <motion.div
                  key={step}
                  initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="p-3 rounded-2xl shrink-0"
                  style={{ background: `${current.color}22`, border: `1px solid ${current.color}44` }}
                >
                  <Icon size={24} style={{ color: current.color }} />
                </motion.div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: current.color }}>
                    Step {current.step} of {ONBOARDING_STEPS.length}
                  </p>
                  <h2 className="text-xl font-bold text-white leading-tight">{current.title}</h2>
                  <p className="text-sm text-white/50 mt-0.5">{current.subtitle}</p>
                </div>
              </div>

              {/* Content */}
              <motion.div
                key={`content-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{current.description}</p>

                <div
                  className="flex items-start gap-2 px-4 py-3 rounded-2xl text-xs font-medium leading-snug"
                  style={{ background: `${current.color}12`, border: `1px solid ${current.color}30`, color: current.color }}
                >
                  <span className="mt-0.5">→</span>
                  <span>{current.highlight}</span>
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={goPrev}
                  disabled={step === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <motion.button
                  onClick={goNext}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-bold text-black transition-all"
                  style={{ background: current.color }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {step === ONBOARDING_STEPS.length - 1 ? 'Launch EQ Aura' : 'Next'}
                  <ChevronRight size={16} />
                </motion.button>
              </div>

              {/* Mercedes brand mark */}
              <p className="text-center text-xs text-white/20 mt-4 tracking-wider">
                MERCEDES-BENZ EQ AURA · MBRDI × T-HUB 2025
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
