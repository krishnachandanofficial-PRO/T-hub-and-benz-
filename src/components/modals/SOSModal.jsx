import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModalBase } from '../ModalBase';
import { MOBILE_VAN_DATA } from '../../constants/data';
import { Truck, MapPin, Zap, Phone } from 'lucide-react';

function RadarPulse() {
  return (
    <div className="relative w-40 h-40 mx-auto flex items-center justify-center my-4">
      {/* Radar rings */}
      {[1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: `${i * 40}px`,
            height: `${i * 40}px`,
            borderColor: `rgba(0, 229, 163, ${0.4 - i * 0.1})`,
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      {/* Car position (center) */}
      <motion.div
        className="absolute z-20 w-5 h-5 rounded-full bg-red-500 border-2 border-red-300 flex items-center justify-center"
        animate={{ boxShadow: ['0 0 8px #ef4444aa', '0 0 20px #ef4444cc', '0 0 8px #ef4444aa'] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <span className="text-white text-xs">🚗</span>
      </motion.div>

      {/* Van position (moving toward center) */}
      <motion.div
        className="absolute z-20 w-5 h-5 rounded-full bg-teal-500 border-2 border-teal-300 flex items-center justify-center"
        initial={{ x: 52, y: -30 }}
        animate={{ x: 20, y: -12 }}
        transition={{ duration: 9, ease: 'linear', repeat: Infinity, repeatDelay: 2 }}
      >
        <span className="text-xs">🚐</span>
      </motion.div>

      {/* Radar sweep */}
      <motion.div
        className="absolute w-full h-full rounded-full overflow-hidden"
        style={{
          background: 'conic-gradient(from 0deg, transparent 340deg, rgba(0,229,163,0.18) 360deg)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function SOSModal({ isOpen, onClose, vehicleData }) {
  const [etaCountdown, setEtaCountdown] = useState(MOBILE_VAN_DATA.etaMin * 60);
  const [dispatched, setDispatched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEtaCountdown(MOBILE_VAN_DATA.etaMin * 60);
      setDispatched(false);
      return;
    }
    // Auto-dispatch after 1.5s
    const dispatchTimer = setTimeout(() => setDispatched(true), 1500);

    const interval = setInterval(() => {
      setEtaCountdown(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(dispatchTimer);
      clearInterval(interval);
    };
  }, [isOpen]);

  // Speak reassurance
  useEffect(() => {
    if (isOpen && 'speechSynthesis' in window) {
      setTimeout(() => {
        const utter = new SpeechSynthesisUtterance(
          'Stay calm. Your Mercedes EQ AURA system has detected a battery emergency. A mobile energy pod has been dispatched and will arrive in 9 minutes, delivering 40 kilowatt hours of emergency charge. You are safe. Help is on the way.'
        );
        utter.rate = 0.85;
        utter.pitch = 0.9;
        const voices = window.speechSynthesis.getVoices();
        const calm = voices.find(v => v.lang.startsWith('en')) || voices[0];
        if (calm) utter.voice = calm;
        window.speechSynthesis.speak(utter);
      }, 1000);
    }
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [isOpen]);

  const minutes = Math.floor(etaCountdown / 60);
  const seconds = etaCountdown % 60;

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Mobile Energy Pod · SOS Dispatch"
      subtitle="Mercedes-Benz Emergency Charging Services · You are Safe"
      accentColor="#00E5A3"
      width="max-w-md"
    >
      {/* Status */}
      <motion.div
        className="text-center mb-2"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs px-3 py-1.5 rounded-full font-bold"
          style={{ background: dispatched ? '#00E5A318' : '#FF6B3518', color: dispatched ? '#00E5A3' : '#FF6B35', border: `1px solid ${dispatched ? '#00E5A344' : '#FF6B3544'}` }}>
          {dispatched ? '🚐 POD DISPATCHED · EN ROUTE' : '📡 DISPATCHING...'}
        </span>
      </motion.div>

      {/* Radar */}
      <RadarPulse />

      {/* ETA countdown */}
      <div className="text-center mb-4">
        <p className="text-xs text-white/40 mb-1">Estimated Arrival</p>
        <motion.p
          className="text-4xl font-black text-teal-400"
          key={etaCountdown}
          animate={{ scale: [1.05, 1] }}
          transition={{ duration: 0.3 }}
        >
          {minutes}:{seconds.toString().padStart(2, '0')}
        </motion.p>
        <p className="text-xs text-white/40 mt-1">minutes remaining</p>
      </div>

      {/* Van details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { icon: Truck, label: 'Van ID', value: MOBILE_VAN_DATA.vanId, color: '#00E5A3' },
          { icon: Zap, label: 'Charge Delivery', value: `+${MOBILE_VAN_DATA.deliverKwh} kWh`, color: '#00F0FF' },
          { icon: MapPin, label: 'Your Location', value: MOBILE_VAN_DATA.gpsCoords, color: '#00E5A3' },
          { icon: Phone, label: 'Operator', value: 'MB Energy Services', color: '#C4B896' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white/4 border border-white/8 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon size={12} style={{ color }} />
              <p className="text-xs text-white/40">{label}</p>
            </div>
            <p className="text-xs font-bold text-white leading-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* Calm message */}
      <div
        className="rounded-2xl p-4 text-center"
        style={{ background: '#00E5A308', border: '1px solid #00E5A325' }}
      >
        <p className="text-xs text-teal-300 leading-relaxed font-medium">
          🌊 Stay calm. You are safe on {MOBILE_VAN_DATA.highway}. The Mercedes-Benz Mobile Energy Pod will deliver enough charge to reach the nearest fast-charger hub with 25% SoC remaining.
        </p>
      </div>
    </ModalBase>
  );
}
