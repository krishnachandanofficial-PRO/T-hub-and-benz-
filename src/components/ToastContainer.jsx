import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

const TOAST_CONFIG = {
  success: { icon: CheckCircle, bg: 'bg-emerald-950/90', border: 'border-emerald-400/40', text: 'text-emerald-300', iconColor: 'text-emerald-400' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-950/90', border: 'border-amber-400/40', text: 'text-amber-200', iconColor: 'text-amber-400' },
  danger: { icon: XCircle, bg: 'bg-red-950/90', border: 'border-red-400/40', text: 'text-red-200', iconColor: 'text-red-400' },
  info: { icon: Info, bg: 'bg-slate-900/90', border: 'border-cyan-400/30', text: 'text-slate-200', iconColor: 'text-cyan-400' },
};

export function ToastContainer({ toasts }) {
  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          const cfg = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
          const Icon = cfg.icon;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className={`flex items-start gap-3 px-4 py-3 rounded-2xl border backdrop-blur-2xl shadow-2xl max-w-sm ${cfg.bg} ${cfg.border}`}
            >
              <Icon size={18} className={`mt-0.5 shrink-0 ${cfg.iconColor}`} />
              <p className={`text-sm font-medium leading-snug ${cfg.text}`}>{toast.message}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
