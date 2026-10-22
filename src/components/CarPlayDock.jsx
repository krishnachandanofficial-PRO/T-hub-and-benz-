import { motion } from 'framer-motion';
import { Home, Map, ShoppingBag, BarChart3, Shield, Mic } from 'lucide-react';

const DOCK_BUTTONS = [
  { id: 'home', Icon: Home, label: 'Home', modal: null },
  { id: 'nav', Icon: Map, label: 'Nav', modal: null },
  { id: 'lounge', Icon: ShoppingBag, label: 'Lounge', modal: 'lounge' },
  { id: 'business', Icon: BarChart3, label: 'Deck', modal: 'business' },
  { id: 'assist', Icon: Shield, label: 'Assist', modal: 'sos' },
  { id: 'voice', Icon: Mic, label: 'Voice', modal: null },
];

export function CarPlayDock({ activeModal, openModal, onMicTap }) {
  return (
    <aside
      aria-label="CarPlay Navigation Dock"
      className="flex flex-col items-center justify-between py-4 shrink-0 relative z-20"
      style={{
        width: '52px',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.07)',
      }}
    >
      {/* Top: Digital clock and network/EV status badges */}
      <div className="flex flex-col items-center gap-1 mb-2 select-none">
        <span
          className="text-white/90 font-semibold tracking-tight text-[11px] leading-none"
          style={{ letterSpacing: '-0.3px' }}
        >
          10:42
        </span>
        <div className="flex flex-col items-center gap-0.5 mt-0.5">
          <span className="text-[8px] font-semibold tracking-wider text-white/40 leading-none">
            5G
          </span>
          <span className="text-[8px] font-semibold tracking-wider text-cyan-400/80 leading-none">
            EV
          </span>
        </div>
      </div>

      {/* Middle: 6 squircle icon buttons */}
      <div className="flex flex-col items-center gap-2 flex-1 justify-center">
        {DOCK_BUTTONS.map(({ id, Icon, label, modal }) => {
          const isVoice = id === 'voice';
          const isActive = Boolean(modal && activeModal === modal);

          const iconColor = isActive
            ? '#00F0FF'
            : isVoice
            ? '#00E5A3'
            : 'rgba(255, 255, 255, 0.55)';

          return (
            <motion.button
              key={id}
              type="button"
              title={label}
              aria-label={label}
              whileTap={{ scale: 0.88 }}
              whileHover={{ scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              onClick={() => {
                if (isVoice) {
                  onMicTap?.();
                  return;
                }
                if (modal) {
                  openModal?.(modal);
                } else {
                  openModal?.(null);
                }
              }}
              className="relative flex items-center justify-center outline-none transition-colors"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: isActive
                  ? 'rgba(0, 240, 255, 0.18)'
                  : 'rgba(255, 255, 255, 0.06)',
                border: isActive
                  ? '1px solid rgba(0, 240, 255, 0.35)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isActive ? '0 0 12px rgba(0, 240, 255, 0.25)' : 'none',
              }}
            >
              <Icon
                size={15}
                color={iconColor}
                strokeWidth={isActive ? 2 : 1.7}
              />

              {/* Active indicator line on right edge */}
              {isActive && (
                <motion.div
                  layoutId="dock-active-indicator"
                  className="absolute -right-px top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-cyan-400"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Bottom: Subtle dot status indicator */}
      <div
        className="w-1 h-1 rounded-full bg-white/15 mt-2"
        aria-hidden="true"
      />
    </aside>
  );
}
