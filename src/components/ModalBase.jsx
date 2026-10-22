import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const springConfig = { type: 'spring', stiffness: 400, damping: 32 };

export function ModalBase({ isOpen, onClose, title, subtitle, children, width = 'max-w-2xl', accentColor = '#00F0FF' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal container */}
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`relative w-full ${width} bg-slate-950/95 backdrop-blur-3xl border border-white/12 rounded-3xl overflow-hidden pointer-events-auto shadow-2xl max-h-[90vh] flex flex-col`}
              style={{ boxShadow: `0 0 60px ${accentColor}18, 0 32px 80px rgba(0,0,0,0.8)` }}
              initial={{ scale: 0.88, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 30, opacity: 0 }}
              transition={springConfig}
            >
              {/* Accent top bar */}
              <div
                className="h-0.5 w-full"
                style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
              />

              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-white/8 shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">{title}</h2>
                  {subtitle && <p className="text-xs text-white/45 mt-0.5">{subtitle}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors ml-4 shrink-0"
                >
                  <X size={16} className="text-white/60" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto flex-1 px-6 py-5 scrollbar-hide">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
