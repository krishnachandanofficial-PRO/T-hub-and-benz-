import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShoppingBag, Shield, Info, X, ChevronRight } from 'lucide-react';

const NOTIFICATION_TYPES = {
  slot: {
    Icon: Zap,
    label: 'Slot Secured',
    borderColor: 'rgba(0, 240, 255, 0.3)',
    iconBg: 'rgba(0, 240, 255, 0.12)',
    iconColor: '#00F0FF',
    labelColor: '#67E8F9',
    bgColor: 'rgba(5, 15, 30, 0.95)',
    barColor: '#00F0FF',
  },
  lounge: {
    Icon: ShoppingBag,
    label: 'Lounge Ready',
    borderColor: 'rgba(251, 191, 36, 0.28)',
    iconBg: 'rgba(251, 191, 36, 0.12)',
    iconColor: '#FBBF24',
    labelColor: '#FCD34D',
    bgColor: 'rgba(18, 12, 4, 0.95)',
    barColor: '#FBBF24',
  },
  assist: {
    Icon: Shield,
    label: 'Rapid Assist',
    borderColor: 'rgba(255, 107, 53, 0.32)',
    iconBg: 'rgba(255, 107, 53, 0.12)',
    iconColor: '#FF6B35',
    labelColor: '#FDBA74',
    bgColor: 'rgba(20, 8, 2, 0.95)',
    barColor: '#FF6B35',
  },
  info: {
    Icon: Info,
    label: 'Update',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    iconBg: 'rgba(255, 255, 255, 0.08)',
    iconColor: 'rgba(255, 255, 255, 0.7)',
    labelColor: 'rgba(255, 255, 255, 0.55)',
    bgColor: 'rgba(6, 10, 18, 0.95)',
    barColor: 'rgba(255, 255, 255, 0.4)',
  },
};

function NotificationCard({ notification, onDismiss, onAction }) {
  const cfg = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.info;
  const IconComponent = cfg.Icon;
  const isAssist = notification.type === 'assist';
  const durationSec = isAssist ? 12 : 8;
  const timerRef = useRef(null);

  useEffect(() => {
    if (notification.autoDismiss !== false) {
      timerRef.current = setTimeout(() => {
        onDismiss?.(notification.id);
      }, durationSec * 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [notification.id, notification.type, notification.autoDismiss, durationSec, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 120, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 120, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className="relative rounded-2xl overflow-hidden select-none shadow-2xl"
      style={{
        width: '224px',
        backgroundColor: cfg.bgColor,
        border: `1px solid ${cfg.borderColor}`,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.65)',
      }}
    >
      {/* Auto-dismiss linear progress indicator */}
      {notification.autoDismiss !== false && (
        <motion.div
          className="absolute top-0 left-0 h-0.5"
          style={{ backgroundColor: cfg.barColor, opacity: 0.55 }}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: durationSec, ease: 'linear' }}
        />
      )}

      <div className="p-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: cfg.iconBg }}
            >
              <IconComponent size={14} color={cfg.iconColor} strokeWidth={2} />
            </div>
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-widest leading-tight"
                style={{ color: cfg.labelColor }}
              >
                {cfg.label}
              </p>
            </div>
          </div>

          {/* Close button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            onClick={() => onDismiss?.(notification.id)}
            title="Dismiss notification"
            aria-label="Dismiss notification"
            className="w-5 h-5 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors shrink-0 mt-0.5 outline-none"
          >
            <X size={10} className="text-white/45" />
          </motion.button>
        </div>

        {/* Content body */}
        <p className="text-xs font-bold text-white leading-snug mb-0.5">
          {notification.title}
        </p>
        <p className="text-[11px] text-white/45 leading-snug">
          {notification.body}
        </p>

        {/* Action Button */}
        {notification.actionLabel && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onAction?.(notification);
              onDismiss?.(notification.id);
            }}
            className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold transition-opacity hover:opacity-80 outline-none"
            style={{ color: cfg.labelColor }}
          >
            <span>{notification.actionLabel}</span>
            <ChevronRight size={11} strokeWidth={2.2} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export function NotificationSystem({ notifications, onDismiss, onAction }) {
  return (
    <div
      aria-live="polite"
      className="absolute right-3 top-16 bottom-16 z-50 flex flex-col items-end gap-2.5 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {notifications?.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <NotificationCard
              notification={notification}
              onDismiss={onDismiss}
              onAction={onAction}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
