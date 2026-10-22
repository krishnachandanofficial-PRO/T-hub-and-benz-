import { useState } from 'react';
import { motion } from 'framer-motion';
import { ModalBase } from '../ModalBase';
import { CHARGING_SLOT } from '../../constants/data';
import { Clock, Zap, MapPin, AlertTriangle } from 'lucide-react';

export function SlotLockModal({ isOpen, onClose, slotDelayed, setSlotDelayed, addToast }) {
  const [simulating, setSimulating] = useState(false);
  const slot = CHARGING_SLOT;

  const simulateDelay = async () => {
    setSimulating(true);
    await new Promise(r => setTimeout(r, 1800));
    setSlotDelayed(true);
    setSimulating(false);
    addToast('🔄 Slot auto-adjusted via OCPI 2.2.1 — no action needed!', 'success');
  };

  const startTime = slotDelayed ? slot.delayedStartTime : slot.startTime;
  const endTime = slotDelayed ? slot.delayedEndTime : slot.endTime;

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Smart Slot-Lock · ETA Sync"
      subtitle="Dynamic 20-Minute Ultra-Fast Charging Reservation"
      accentColor="#00E5A3"
    >
      {/* Main slot card */}
      <motion.div
        className="rounded-2xl border p-5 mb-4"
        style={{ background: '#00E5A310', borderColor: '#00E5A340' }}
        animate={slotDelayed ? { borderColor: ['#00E5A340', '#00F0FF40', '#00E5A340'] } : {}}
        transition={{ duration: 1.5, repeat: slotDelayed ? 3 : 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-teal-400" />
            <span className="text-sm font-bold text-white">Charging Slot Locked</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-teal-950/50 text-teal-300 border border-teal-400/30 font-semibold">
            {slotDelayed ? 'AUTO-ADJUSTED' : 'CONFIRMED'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-xs text-white/40 mb-1">Location</p>
            <p className="text-sm font-bold text-white">{slot.hub}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-xs text-white/40 mb-1">Bay</p>
            <p className="text-sm font-bold text-white">{slot.bay}</p>
          </div>
        </div>

        {/* Time slot with animated transition */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white/5 rounded-xl p-3 text-center">
            <p className="text-xs text-white/40 mb-1">Start</p>
            <motion.p
              key={startTime}
              initial={{ scale: 1.2, color: '#00F0FF' }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="text-lg font-black text-white"
            >
              {startTime}
            </motion.p>
          </div>
          <div className="text-center">
            <p className="text-xs text-teal-400 font-bold">20 min</p>
            <p className="text-xs text-white/30">{slot.powerKw}kW</p>
          </div>
          <div className="flex-1 bg-white/5 rounded-xl p-3 text-center">
            <p className="text-xs text-white/40 mb-1">End</p>
            <motion.p
              key={endTime}
              initial={{ scale: 1.2, color: '#00F0FF' }}
              animate={{ scale: 1, color: '#ffffff' }}
              className="text-lg font-black text-white"
            >
              {endTime}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Protocol info */}
      <div className="bg-white/3 border border-white/8 rounded-2xl p-4 mb-4">
        <p className="text-xs font-semibold text-white/60 mb-2">Dynamic Adjustment Protocol</p>
        <div className="flex items-start gap-2 text-xs text-white/40 leading-relaxed">
          <Zap size={12} className="text-cyan-400 mt-0.5 shrink-0" />
          <p>
            OCPI 2.2.1 + UEI Beckn protocol enables real-time slot migration. If ETA shifts by more than 8 minutes due to traffic, congestion, or detour, the reservation window slides automatically — no driver interaction required.
          </p>
        </div>
      </div>

      {/* Simulate button */}
      {!slotDelayed && (
        <motion.button
          onClick={simulateDelay}
          disabled={simulating}
          className="w-full py-3.5 rounded-2xl border font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: '#FF6B3515', borderColor: '#FF6B3540', color: '#FF6B35' }}
          whileHover={{ scale: simulating ? 1 : 1.02 }}
          whileTap={{ scale: simulating ? 1 : 0.98 }}
        >
          <AlertTriangle size={16} />
          {simulating ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
              Recalculating via OCPI...
            </>
          ) : (
            'Simulate +12 Min Highway Traffic Delay'
          )}
        </motion.button>
      )}

      {slotDelayed && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-teal-950/20 border border-teal-400/30 rounded-2xl p-4 text-center"
        >
          <p className="text-teal-400 font-bold text-sm mb-1">✅ Slot Seamlessly Adjusted</p>
          <p className="text-xs text-white/40">
            12-minute delay absorbed. New window: {slot.delayedStartTime}–{slot.delayedEndTime}. Zero driver stress. Zero rebooking fee.
          </p>
        </motion.div>
      )}
    </ModalBase>
  );
}
