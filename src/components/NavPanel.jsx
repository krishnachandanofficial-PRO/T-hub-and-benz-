import { motion } from 'framer-motion';
import {
  Navigation2,
  BatteryCharging,
  Gauge,
  Wind,
  Zap,
  Monitor,
  ArrowRight,
} from 'lucide-react';
import { RANGE_TOGGLES } from '../constants/data';

const TOGGLE_ICON_MAP = {
  Wind,
  Zap,
  Gauge,
  Monitor,
};

function StatBox({ label, value, sub, accentColor }) {
  return (
    <div
      className="flex-1 rounded-2xl px-3 py-2.5 flex flex-col justify-between"
      style={{
        backgroundColor: 'rgba(0, 240, 255, 0.04)',
        border: '1px solid rgba(0, 240, 255, 0.08)',
      }}
    >
      <span className="text-[10px] text-white/35 font-medium uppercase tracking-widest leading-none mb-1">
        {label}
      </span>
      <span
        className="font-bold leading-none"
        style={{ fontSize: '18px', color: accentColor || '#FFFFFF' }}
      >
        {value}
      </span>
      {sub ? (
        <span className="text-[10px] text-white/30 mt-1 font-medium leading-none">
          {sub}
        </span>
      ) : null}
    </div>
  );
}

export function NavPanel({
  routeData,
  rangeToggles,
  toggleRange,
  availableRangeKm,
  arrivalSocPercent,
  extraRangeKm,
  chaosMode,
}) {
  const {
    remainingKm = 184,
    timeRemainingMin = 108,
    nextTurn = 'Bear Left → NH-48 Ultra-Fast Corridor',
    nextTurnKm = 3.8,
    nextChargingHub = 'KM-112 Express Plaza',
    nextChargingKm = 72,
    arrivalTime = '12:18 PM',
  } = routeData || {};

  const hours = Math.floor(timeRemainingMin / 60);
  const mins = timeRemainingMin % 60;
  const etaText = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <div className="flex flex-col gap-2.5 h-full select-none">
      {/* ── BIG NAV CARD (Takes most space) ── */}
      <div
        className="rounded-3xl p-4 flex flex-col justify-between"
        style={{
          flex: '1 1 0',
          minHeight: 0,
          backgroundColor: 'rgba(5, 15, 35, 0.92)',
          border: '1px solid rgba(0, 240, 255, 0.12)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Next Manoeuvre Section */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-2">
            <Navigation2 size={13} className="text-cyan-400 shrink-0" strokeWidth={2} />
            <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-widest leading-none">
              Next Manoeuvre
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <ArrowRight
              size={22}
              className="text-white mt-0.5 shrink-0"
              style={{ transform: 'rotate(-45deg)' }}
              strokeWidth={2.5}
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-tight">
                {nextTurn}
              </p>
              <p className="text-xs text-white/40 mt-1 font-medium">
                {nextTurnKm} km ahead
              </p>
            </div>
          </div>
        </div>

        {/* Subtle Separator */}
        <div className="h-px bg-white/5 my-1" />

        {/* Stats Row */}
        <div className="flex gap-2">
          <StatBox
            label="Distance"
            value={`${remainingKm}`}
            sub="km remain"
            accentColor="#00F0FF"
          />
          <StatBox
            label="ETA"
            value={etaText}
            sub={arrivalTime}
            accentColor="#FFFFFF"
          />
          <StatBox
            label="Arrival SoC"
            value={`${arrivalSocPercent}%`}
            sub="projected"
            accentColor="#00E5A3"
          />
        </div>

        {/* Next Charge Hub Box */}
        <div
          className="rounded-2xl px-3 py-2.5 flex items-center gap-2.5"
          style={{
            backgroundColor: 'rgba(0, 229, 163, 0.06)',
            border: '1px solid rgba(0, 229, 163, 0.14)',
          }}
        >
          <BatteryCharging size={15} className="text-teal-400 shrink-0" strokeWidth={1.8} />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-teal-400 font-semibold uppercase tracking-widest leading-none">
              Next Charge Hub
            </p>
            <p className="text-xs text-white font-semibold leading-tight truncate mt-1">
              {nextChargingHub}
            </p>
            <p className="text-[10px] text-white/40 mt-0.5">
              {nextChargingKm} km · 20 min slot pre-locked
            </p>
          </div>
        </div>

        {/* Calm Chaos Mode Status Indicator */}
        {chaosMode && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="rounded-2xl px-3 py-2 text-center"
            style={{
              backgroundColor: 'rgba(255, 107, 53, 0.08)',
              border: '1px solid rgba(255, 107, 53, 0.22)',
            }}
          >
            <p className="text-[11px] text-orange-400 font-semibold leading-snug">
              {chaosMode === 'silent_fail' && 'Station update — Rerouting to Hub B'}
              {chaosMode === 'derating' && 'Power advisory — Switching to full-power hub'}
              {chaosMode === 'sos' && 'Mobile Pod dispatched · 9 min ETA'}
              {!['silent_fail', 'derating', 'sos'].includes(chaosMode) && 'Optimizing highway corridor'}
            </p>
          </motion.div>
        )}
      </div>

      {/* ── SMALL RANGE CARD (Compact) ── */}
      <div
        className="rounded-2xl p-3 flex flex-col gap-2 shrink-0"
        style={{
          backgroundColor: 'rgba(0, 10, 18, 0.85)',
          border: '1px solid rgba(0, 229, 163, 0.18)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Gauge size={12} className="text-teal-400" strokeWidth={2} />
            <span className="text-[10px] text-teal-400 font-semibold uppercase tracking-widest leading-none">
              Range Boost
            </span>
          </div>
          {extraRangeKm > 0 && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className="text-[10px] font-bold text-teal-300 px-1.5 py-0.5 rounded-lg leading-none"
              style={{ backgroundColor: 'rgba(0, 229, 163, 0.14)' }}
            >
              +{extraRangeKm} km
            </motion.span>
          )}
        </div>

        {/* 4 Toggle Rows */}
        <div className="flex flex-col gap-1.5">
          {RANGE_TOGGLES.map((toggle) => {
            const ToggleIcon = TOGGLE_ICON_MAP[toggle.icon] || Zap;
            const isOn = Boolean(rangeToggles?.[toggle.id]);

            return (
              <motion.button
                key={toggle.id}
                type="button"
                onClick={() => toggleRange?.(toggle.id)}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                className="flex items-center gap-2 w-full text-left rounded-xl px-2.5 py-2 transition-colors outline-none"
                style={{
                  backgroundColor: isOn
                    ? 'rgba(0, 229, 163, 0.09)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isOn
                    ? '1px solid rgba(0, 229, 163, 0.22)'
                    : '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <ToggleIcon
                  size={12}
                  style={{
                    color: isOn ? toggle.color : 'rgba(255, 255, 255, 0.3)',
                  }}
                  strokeWidth={2}
                  className="shrink-0"
                />

                <p
                  className="text-[10px] font-medium leading-tight flex-1 min-w-0 truncate"
                  style={{
                    color: isOn
                      ? 'rgba(255, 255, 255, 0.88)'
                      : 'rgba(255, 255, 255, 0.38)',
                  }}
                >
                  {toggle.label}
                </p>

                {/* Mini toggle switch pill: 22x13px with 9x9 animated white dot */}
                <div
                  className="shrink-0 rounded-full relative transition-colors"
                  style={{
                    width: '22px',
                    height: '13px',
                    backgroundColor: isOn
                      ? toggle.color
                      : 'rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <motion.div
                    animate={{ x: isOn ? 11 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                    className="absolute top-0.5 rounded-full bg-white shadow-sm"
                    style={{ width: '9px', height: '9px' }}
                  />
                </div>

                <span
                  className="text-[9px] font-bold shrink-0 ml-1 leading-none"
                  style={{
                    color: isOn ? toggle.color : 'rgba(255, 255, 255, 0.22)',
                  }}
                >
                  +{toggle.addKm}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Bottom: Available Range */}
        <div
          className="flex items-center justify-between rounded-xl px-2.5 py-1.5"
          style={{ backgroundColor: 'rgba(0, 240, 255, 0.05)' }}
        >
          <span className="text-[10px] text-white/40 font-medium">
            Available Range
          </span>
          <span className="text-xs font-bold text-cyan-300">
            {availableRangeKm} km
          </span>
        </div>
      </div>
    </div>
  );
}
