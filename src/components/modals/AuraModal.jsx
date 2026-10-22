import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModalBase } from '../ModalBase';
import { AURA_SCORE_DATA } from '../../constants/data';
import { Shield, CheckCircle, AlertTriangle, Layers, Zap, Eye, Database } from 'lucide-react';

function AnimatedBar({ value, color, delay = 0 }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-white/8 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 1.2, ease: 'easeOut', delay }}
      />
    </div>
  );
}

function ScoreRow({ label, value, weight, color, delay }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-white/60">{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/35">w={weight}</span>
          <span className="text-xs font-bold" style={{ color }}>{(value * 100).toFixed(0)}%</span>
        </div>
      </div>
      <AnimatedBar value={value} color={color} delay={delay} />
    </div>
  );
}

function DataLayerRow({ layer, label, status, detail, icon: Icon, color }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="p-2 rounded-xl shrink-0" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        <Icon size={14} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-semibold text-white/80">{label}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${color}18`, color }}
          >
            {status}
          </span>
        </div>
        <p className="text-xs text-white/40 leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}

export function AuraModal({ isOpen, onClose, chaosMode }) {
  const d = AURA_SCORE_DATA;
  const [activeTab, setActiveTab] = useState('formula');

  const score = 0.35 * d.ocpp + 0.30 * d.velocity + 0.25 * (1 - d.silentFail) + 0.10 * d.grid;
  const isSilentFail = chaosMode === 'silent_fail';
  const isDerating = chaosMode === 'derating';

  const tabs = [
    { id: 'formula', label: 'Formula' },
    { id: 'derating', label: 'kW Guard' },
    { id: 'silent', label: 'Silent Fail' },
    { id: 'planb', label: 'Plan B' },
    { id: 'pipeline', label: 'Pipeline' },
  ];

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Aura Assurance · Deep Telemetry"
      subtitle="4-Layer Mathematical Reliability Engine · MBRDI Engineering"
      accentColor="#00F0FF"
    >
      {/* Score pill */}
      <div className="flex items-center justify-center mb-5">
        <motion.div
          className="px-6 py-3 rounded-2xl border flex items-center gap-3"
          style={{ background: '#00F0FF10', border: '1px solid #00F0FF30' }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Shield size={18} className="text-cyan-400" />
          <div>
            <p className="text-xs text-white/50">Aura Flow Score</p>
            <p className="text-xl font-black text-cyan-400">{(score * 100).toFixed(1)}% Serene</p>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-white/4 p-1 rounded-2xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id ? 'bg-cyan-950 text-cyan-300 border border-cyan-400/30' : 'text-white/40 hover:text-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'formula' && (
            <div>
              <div className="bg-slate-900/60 border border-white/8 rounded-2xl px-4 py-4 mb-4">
                <p className="text-xs text-white/40 mb-1 font-mono">WEIGHTED SCORING FORMULA</p>
                <p className="text-sm font-bold text-cyan-300 font-mono leading-relaxed">
                  Aura = 0.35·S<sub className="text-cyan-500">OCPP</sub> + 0.30·S<sub className="text-cyan-500">Vel</sub> + 0.25·(1−P<sub className="text-cyan-500">Fail</sub>) + 0.10·S<sub className="text-cyan-500">Grid</sub>
                </p>
                <p className="text-xs text-cyan-400 mt-2 font-bold">
                  = 0.35×{d.ocpp.toFixed(2)} + 0.30×{d.velocity.toFixed(2)} + 0.25×{(1 - d.silentFail).toFixed(2)} + 0.10×{d.grid.toFixed(2)}
                  {' '}= <span className="text-white">{score.toFixed(3)}</span>
                </p>
              </div>

              <ScoreRow label="OCPP 2.0.1 Live Status Score" value={d.ocpp} weight="0.35" color="#00F0FF" delay={0} />
              <ScoreRow label="Session Velocity (kWh/min)" value={d.velocity} weight="0.30" color="#00E5A3" delay={0.15} />
              <ScoreRow label="Silent Fail Resilience (1-P)" value={1 - d.silentFail} weight="0.25" color="#00F0FF" delay={0.3} />
              <ScoreRow label="Grid Load-Shedding Score" value={d.grid} weight="0.10" color="#00E5A3" delay={0.45} />
            </div>
          )}

          {activeTab === 'derating' && (
            <div>
              <div className={`rounded-2xl border p-4 mb-4 ${isDerating ? 'border-red-400/40 bg-red-950/20' : 'border-emerald-400/30 bg-emerald-950/15'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={16} className={isDerating ? 'text-red-400' : 'text-emerald-400'} />
                  <span className={`text-sm font-bold ${isDerating ? 'text-red-300' : 'text-emerald-300'}`}>
                    {isDerating ? '⚡ DERATING DETECTED' : '✅ Full Power Confirmed'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Rated Output', value: `${d.ratedKw}kW`, sub: 'Advertised', color: '#94a3b8' },
                    { label: 'Actual Live', value: isDerating ? '22kW' : `${d.actualKw}kW`, sub: 'Measured OCPP', color: isDerating ? '#f87171' : '#00E5A3' },
                    { label: 'Delta', value: isDerating ? '-98kW' : `${d.ratedKw - d.actualKw}kW`, sub: 'Variance', color: isDerating ? '#f87171' : '#00F0FF' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-lg font-black" style={{ color: stat.color }}>{stat.value}</p>
                      <p className="text-xs font-semibold text-white/70 mt-0.5">{stat.label}</p>
                      <p className="text-xs text-white/30">{stat.sub}</p>
                    </div>
                  ))}
                </div>
                {isDerating && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 px-3 py-2 bg-amber-950/40 border border-amber-400/30 rounded-xl text-xs text-amber-300 font-medium"
                  >
                    🔄 Auto-routing to KM-120 Greenfield Hub B (120kW verified). ETA impact: +4 min only.
                  </motion.div>
                )}
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                EQ Aura monitors live OCPP 2.0.1 Meter Values every 30 seconds. If actual power falls below 80% of rated capacity for 3 consecutive readings, the Derating Guard triggers automatic rerouting — preventing a planned 20-min stop from becoming a 90-min ordeal.
              </p>
            </div>
          )}

          {activeTab === 'silent' && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Eye size={16} className="text-cyan-400" />
                <span className="text-sm font-bold text-white">Passive Silent Failure Detection</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-emerald-950/20 border border-emerald-400/25 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-black text-emerald-400">{d.unchargedWalkAways}</p>
                  <p className="text-xs text-emerald-300 font-semibold mt-1">Uncharged Walk-Aways</p>
                  <p className="text-xs text-white/35 mt-0.5">Last 6 Hours</p>
                </div>
                <div className="bg-cyan-950/20 border border-cyan-400/25 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-black text-cyan-400">{d.verifiedFastSessions}</p>
                  <p className="text-xs text-cyan-300 font-semibold mt-1">Verified Fast Sessions</p>
                  <p className="text-xs text-white/35 mt-0.5">120kW Confirmed</p>
                </div>
              </div>

              <div className="bg-white/3 border border-white/8 rounded-2xl p-4">
                <p className="text-xs font-semibold text-white/70 mb-3">Detection Signal Pipeline</p>
                {[
                  { label: 'GPS Dwell Time at Station Coords', detail: '5–8 min parked at charger → no session start = silent fail', ok: !isSilentFail },
                  { label: 'OBD-II State of Charge Delta', detail: 'SoC unchanged after 10 min at charger = failure signal', ok: !isSilentFail },
                  { label: 'OCPP Payment Handshake', detail: 'No Auth/StartSession response = offline charger', ok: !isSilentFail },
                  { label: 'UPI/Payment Receipt Correlation', detail: 'No payment debit at known time window = walk-away', ok: !isSilentFail },
                ].map((sig, i) => (
                  <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                    {sig.ok ? <CheckCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" /> : <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />}
                    <div>
                      <p className="text-xs font-medium text-white/70">{sig.label}</p>
                      <p className="text-xs text-white/35 mt-0.5">{sig.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'planb' && (
            <div>
              <p className="text-xs text-white/50 mb-4 leading-relaxed">
                Every route includes a pre-verified backup charger within the 15% emergency battery reserve. Driver is never informed of this unless needed — zero anxiety, maximum safety.
              </p>
              <div className="relative">
                {/* Primary */}
                <motion.div
                  className="border rounded-2xl p-4 mb-3"
                  style={{ background: '#00F0FF08', borderColor: `${isSilentFail ? '#f87171' : '#00F0FF'}40` }}
                  animate={isSilentFail ? { borderColor: ['#f8717144', '#00F0FF44'] } : {}}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white/80">Primary · Hub A</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isSilentFail ? 'bg-red-950/50 text-red-300 border border-red-400/30' : 'bg-emerald-950/40 text-emerald-300 border border-emerald-400/30'}`}>
                      {isSilentFail ? '❌ Silent Failure' : '✅ Verified Live'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">{d.primaryHub}</p>
                  <p className="text-xs text-white/40 mt-1">120kW · Bay #02 · Pre-locked 11:30–11:50 AM</p>
                </motion.div>

                {/* Arrow */}
                <div className="flex justify-center mb-3">
                  <div className="flex flex-col items-center gap-0.5">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-px h-2 bg-cyan-400/40"
                        animate={{ opacity: isSilentFail ? [0.3, 1, 0.3] : [0.4, 0.4] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                    <div className="text-xs text-white/30 mt-1">Plan B · {d.backupKmAhead} km ahead · Auto-switch</div>
                  </div>
                </div>

                {/* Backup */}
                <motion.div
                  className="border rounded-2xl p-4"
                  style={{
                    background: isSilentFail ? '#00E5A315' : '#00E5A308',
                    borderColor: `${isSilentFail ? '#00E5A3' : '#00E5A3'}30`,
                    boxShadow: isSilentFail ? '0 0 20px #00E5A330' : 'none',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white/80">Backup · Hub B</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-cyan-950/40 text-cyan-300 border border-cyan-400/30">
                      {isSilentFail ? '🔄 Now Active' : '✅ Pre-Verified'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">{d.backupHub}</p>
                  <p className="text-xs text-white/40 mt-1">120kW · 15% Emergency Reserve Buffer · Always Ready</p>
                </motion.div>

                {/* Emergency reserve indicator */}
                <div className="mt-4 bg-white/3 border border-white/8 rounded-2xl p-3 flex items-center gap-3">
                  <Shield size={14} className="text-cyan-400 shrink-0" />
                  <p className="text-xs text-white/50">
                    Emergency Battery Reserve: <span className="text-cyan-300 font-semibold">{d.emergencyReservePercent}% SoC always protected</span> — never depleted below threshold during routing calculations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div>
              <p className="text-xs text-white/40 mb-4">Live 4-Layer Data Collection Architecture</p>
              <DataLayerRow
                layer={1}
                label="Layer 1: Public Charger Registry"
                status="LIVE"
                detail="BEE EV Yatra API + OpenChargeMap: 27,700 stations indexed, 22,750 live-verified. Polling interval: 5 min."
                icon={Database}
                color="#00F0FF"
              />
              <DataLayerRow
                layer={2}
                label="Layer 2: Real-Time Protocol Bridge"
                status="ACTIVE"
                detail="OCPP 2.0.1 / OCPI 2.2.1 / UEI Beckn WebSocket streams. Sub-second session state updates."
                icon={Zap}
                color="#00E5A3"
              />
              <DataLayerRow
                layer={3}
                label="Layer 3: Passive Telemetry Radar"
                status="MONITORING"
                detail="OBD-II SoC delta + GPS dwell time correlation. Zero user action required to detect silent failures."
                icon={Eye}
                color="#00F0FF"
              />
              <DataLayerRow
                layer={4}
                label="Layer 4: Historical Intelligence"
                status="LEARNING"
                detail="Grid load-shedding schedule correlation + weather-adjusted demand forecasting. 18-month training data."
                icon={Layers}
                color="#00E5A3"
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </ModalBase>
  );
}
