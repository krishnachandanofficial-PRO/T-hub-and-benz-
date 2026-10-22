import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModalBase } from '../ModalBase';
import { COMPETITOR_DATA } from '../../constants/data';
import { Check, X, Users, Truck, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';

function CompetitorTable({ data }) {
  const cols = [
    { key: 'eqAura', label: 'EQ Aura', color: '#00F0FF', highlight: true },
    { key: 'statiq', label: 'Statiq', color: '#64748b' },
    { key: 'chargeZone', label: 'ChargeZone', color: '#64748b' },
    { key: 'plugShare', label: 'PlugShare', color: '#64748b' },
  ];

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-left text-white/40 font-medium pb-3 pr-3 w-40">Feature</th>
            {cols.map(col => (
              <th key={col.key} className={`text-center pb-3 px-2 font-bold ${col.highlight ? '' : 'text-white/40'}`}
                style={{ color: col.highlight ? col.color : undefined }}>
                {col.label}
                {col.highlight && <span className="block text-xs font-normal text-cyan-400/60">⭐ MBRDI</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t border-white/5">
              <td className="py-2.5 pr-3 text-white/60 leading-tight">{row.feature}</td>
              {cols.map(col => (
                <td key={col.key} className="py-2.5 px-2 text-center">
                  {row[col.key] ? (
                    <div className="flex justify-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${col.highlight ? 'bg-cyan-950/60 border border-cyan-400/40' : 'bg-emerald-950/40'}`}>
                        <Check size={10} style={{ color: col.highlight ? '#00F0FF' : '#6ee7b7' }} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center bg-red-950/30 border border-red-400/15">
                        <X size={10} className="text-red-400/60" />
                      </div>
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RevenueCalculator() {
  const [slotFee, setSlotFee] = useState(49);
  const [tripsPerMonth, setTripsPerMonth] = useState(50000);
  const [cpoPercent, setCpoPercent] = useState(6);
  const [kwhPerSession, setKwhPerSession] = useState(30);
  const [sessions, setSessions] = useState(30000);
  const [affiliatePercent, setAffiliatePercent] = useState(12);
  const [orderValue, setOrderValue] = useState(300);
  const [loungeTrips, setLoungeTrips] = useState(15000);

  const b2cRevenue = slotFee * tripsPerMonth;
  const b2bRevenue = (cpoPercent / 100) * kwhPerSession * 12 * sessions; // ₹12/kWh approx
  const apiRevenue = 5000000; // Fixed SaaS
  const loungeRevenue = (affiliatePercent / 100) * orderValue * loungeTrips;
  const totalARR = (b2cRevenue + b2bRevenue + apiRevenue + loungeRevenue) * 12;

  const formatCr = (n) => `₹${(n / 10000000).toFixed(1)} Cr`;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: '① B2C Slot Lock (Monthly)', value: b2cRevenue, color: '#00F0FF' },
          { label: '② B2B CPO Commission (Monthly)', value: b2bRevenue, color: '#00E5A3' },
          { label: '③ OEM API SaaS (Monthly)', value: apiRevenue / 12, color: '#C4B896' },
          { label: '④ Lounge Commerce (Monthly)', value: loungeRevenue, color: '#00F0FF' },
        ].map(stream => (
          <div key={stream.label} className="bg-white/3 border border-white/8 rounded-2xl p-3">
            <p className="text-xs text-white/40 mb-1 leading-tight">{stream.label}</p>
            <p className="text-base font-black" style={{ color: stream.color }}>
              {formatCr(stream.value * 12)}/yr
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-cyan-950/30 to-teal-950/30 border border-cyan-400/20 rounded-2xl p-4 mb-4 text-center">
        <p className="text-xs text-white/50 mb-1">Projected Total ARR</p>
        <p className="text-3xl font-black text-cyan-400">{formatCr(totalARR)}</p>
        <p className="text-xs text-white/30 mt-1">at {(tripsPerMonth / 1000).toFixed(0)}k B2C trips/month</p>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-white/50">B2C Slot Lock Fee</label>
            <span className="text-xs font-bold text-cyan-400">₹{slotFee}/trip</span>
          </div>
          <input type="range" min={49} max={99} value={slotFee} onChange={e => setSlotFee(+e.target.value)} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-white/50">CPO Commission Rate</label>
            <span className="text-xs font-bold text-teal-400">{cpoPercent}% per kWh</span>
          </div>
          <input type="range" min={5} max={8} value={cpoPercent} step={0.5} onChange={e => setCpoPercent(+e.target.value)} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-white/50">Lounge Affiliate %</label>
            <span className="text-xs font-bold text-cyan-400">{affiliatePercent}%</span>
          </div>
          <input type="range" min={10} max={15} value={affiliatePercent} onChange={e => setAffiliatePercent(+e.target.value)} className="w-full" />
        </div>
      </div>
    </div>
  );
}

export function BusinessModal({ isOpen, onClose, selectedICP, setSelectedICP }) {
  const [activeSection, setActiveSection] = useState('problem');

  const sections = [
    { id: 'problem', label: 'India Problem' },
    { id: 'icp', label: 'ICP' },
    { id: 'competitors', label: 'Competitors' },
    { id: 'revenue', label: 'Revenue' },
  ];

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="MBRDI · T-Hub Pitch Deck"
      subtitle="EQ Aura · Zero-Anxiety Highway EV Infrastructure · India 2025"
      accentColor="#C4B896"
      width="max-w-2xl"
    >
      {/* Section tabs */}
      <div className="flex gap-1 mb-5 bg-white/4 p-1 rounded-2xl">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
              activeSection === s.id
                ? 'bg-amber-950/50 text-amber-300 border border-amber-400/30'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {activeSection === 'problem' && (
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Validated India EV Problem</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { value: '27,700', label: 'Public Stations', sub: 'Across India (BEE, 2024)', color: '#64748b' },
                  { value: '~22,750', label: 'Working Now', sub: '82% uptime (unverified)', color: '#f59e0b' },
                  { value: '~4,950', label: 'Silent Failures', sub: 'No app catches these', color: '#ef4444' },
                  { value: '120kW+', label: 'Target Corridor', sub: 'Highway ultra-fast only', color: '#00F0FF' },
                ].map(s => (
                  <div key={s.label} className="bg-white/3 border border-white/8 rounded-2xl p-4">
                    <p className="text-2xl font-black mb-1" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs font-semibold text-white/70">{s.label}</p>
                    <p className="text-xs text-white/35 mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>
              <div className="bg-amber-950/15 border border-amber-400/20 rounded-2xl p-4">
                <p className="text-xs text-amber-200 leading-relaxed font-medium">
                  ⚡ A highway EV traveller stopping for a &quot;20-minute ultra-fast charge&quot; can wait 90+ minutes if the charger is quietly derated to 22kW or broken with no visible indicator. EQ Aura is the only platform with passive detection that catches this <strong>before the driver plugs in</strong>.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'icp' && (
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Ideal Customer Persona</h3>
              <div className="flex gap-2 mb-4 bg-white/4 p-1 rounded-2xl">
                {[
                  { id: 'b2c', label: 'B2C Traveller', icon: Users },
                  { id: 'b2b', label: 'B2B Fleet', icon: Truck },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedICP(id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
                      selectedICP === id
                        ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-400/30'
                        : 'text-white/40'
                    }`}
                  >
                    <Icon size={12} />
                    {label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedICP}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  {selectedICP === 'b2c' ? (
                    <div className="space-y-3">
                      <div className="bg-white/3 border border-white/8 rounded-2xl p-4">
                        <p className="text-sm font-bold text-white mb-2">Inter-City Highway EV Traveller</p>
                        <p className="text-xs text-white/50 mb-3">Weekend & holiday highway trips, tech-forward, premium EV owners, range-conscious.</p>
                        <div className="space-y-1.5">
                          {[
                            'Tata Nexon EV Max / Punch EV owners',
                            'MG ZS EV & Comet EV drivers',
                            'Mahindra BE 6E / XEV 9E early adopters',
                            'BYD Atto 3 & Seal luxury commuters',
                            'Mercedes-Benz EQS, EQE, EQB owners',
                          ].map(persona => (
                            <div key={persona} className="flex items-center gap-2 text-xs text-white/60">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                              {persona}
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/8">
                          <p className="text-xs text-cyan-400 font-semibold">Pain Point → EQ Aura Solution</p>
                          <p className="text-xs text-white/40 mt-1">"I don't know if the charger actually works" → Aura Score + Pre-verified slot + Plan B buffer</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-white/3 border border-white/8 rounded-2xl p-4">
                        <p className="text-sm font-bold text-white mb-2">Inter-City Electric Cab & Shuttle Fleet</p>
                        <p className="text-xs text-white/50 mb-3">Fleet operators, EV logistics companies, SLA-driven route planners.</p>
                        <div className="space-y-1.5">
                          {[
                            'BluSmart / EV Taxi fleet operators (50+ vehicles)',
                            'Shuttl & corporate EV shuttle operators',
                            'Amazon & Flipkart EV delivery fleet',
                            'State EV bus operators (KSRTC, TSRTC)',
                            'Highway logistics & cold-chain EV fleets',
                          ].map(persona => (
                            <div key={persona} className="flex items-center gap-2 text-xs text-white/60">
                              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                              {persona}
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/8">
                          <p className="text-xs text-teal-400 font-semibold">B2B Revenue Model</p>
                          <p className="text-xs text-white/40 mt-1">CPO Roaming Commission 5–8% per kWh + OEM Telemetry API SaaS (₹2–5L/month per fleet)</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {activeSection === 'competitors' && (
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Competitor Matrix</h3>
              <CompetitorTable data={COMPETITOR_DATA} />
              <div className="mt-4 bg-cyan-950/15 border border-cyan-400/20 rounded-2xl p-3">
                <p className="text-xs text-cyan-300 font-semibold mb-1">EQ Aura's 4 Unique Moats</p>
                <p className="text-xs text-white/45 leading-relaxed">
                  Only EQ Aura combines Silent Failure Detection + True kW Derating Alerts + Dynamic Slot Locking + Mobile Van SOS. No competitor has all four. This is the defensible wedge in India's highway EV corridor market.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'revenue' && (
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Interactive Revenue Calculator</h3>
              <RevenueCalculator />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </ModalBase>
  );
}
