import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

import { CarPlayDock } from './CarPlayDock';
import { NavPanel } from './NavPanel';
import { AIAssistant } from './AIAssistant';
import { RouteVisualization } from './RouteVisualization';
import { NotificationSystem } from './NotificationSystem';
import { ChaosBar } from './ChaosBar';
import { OnboardingTour } from './OnboardingTour';

import { AuraModal } from './modals/AuraModal';
import { SlotLockModal } from './modals/SlotLockModal';
import { LoungeModal } from './modals/LoungeModal';
import { SOSModal } from './modals/SOSModal';
import { BusinessModal } from './modals/BusinessModal';

/* ── Purple Aura Flow pill ── */
function AuraPill({ onAuraClick }) {
  return (
    <motion.button
      onClick={onAuraClick}
      whileTap={{ scale: 0.94 }}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 cursor-pointer"
      style={{
        background: 'rgba(88,28,255,0.15)',
        border: '1px solid rgba(139,92,246,0.30)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0"
      />
      <span className="text-[11px] font-semibold text-violet-300 whitespace-nowrap">
        Aura Flow 98.4%
      </span>
      <Activity size={10} className="text-violet-400 opacity-70 shrink-0" />
    </motion.button>
  );
}

/* ── Top HUD strip ── */
function TopHUD({ vehicleData, chaosMode, onAuraClick }) {
  return (
    <div
      className="flex items-center justify-between px-4 shrink-0"
      style={{
        height: '44px',
        background: 'rgba(0,0,0,0.50)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Left: model + SoC */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-white/60 tracking-wide">
          EQS 580 4MATIC
        </span>
        <span className="h-3 w-px bg-white/15" />
        <span className="text-[11px] text-cyan-400 font-medium">
          {vehicleData.socPercent}% &bull; {vehicleData.rangeKm} km
        </span>
      </div>

      {/* Center: Aura pill */}
      <AuraPill onAuraClick={onAuraClick} />

      {/* Right: speed + temp + chaos dot */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <span className="text-xs font-bold text-white">{vehicleData.speedKmh}</span>
          <span className="text-[9px] text-white/35 ml-0.5">km/h</span>
        </div>
        <span className="h-3 w-px bg-white/15" />
        <span className="text-[11px] text-white/45">{vehicleData.outsideTempC}&deg;C</span>
        {chaosMode && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-orange-400"
          />
        )}
      </div>
    </div>
  );
}

/* ── Main Screen ── */
export function MainScreen({
  vehicleData,
  routeData,
  rangeToggles,
  toggleRange,
  activeModal,
  openModal,
  closeModal,
  extraRangeKm,
  availableRangeKm,
  arrivalSocPercent,
  chaosMode,
  triggerChaos,
  resetChaos,
  slotDelayed,
  setSlotDelayed,
  isOnboardingOpen,
  setIsOnboardingOpen,
  onboardingStep,
  setOnboardingStep,
  startOnboarding,
  loungeCart,
  addToLoungeCart,
  loungeTotal,
  loungeOrdered,
  setLoungeOrdered,
  aiDrawerOpen,
  setAiDrawerOpen,
  openRouterKey,
  setOpenRouterKey,
  addToast,
  selectedICP,
  setSelectedICP,
}) {
  const [notifications, setNotifications] = useState([]);
  const notifIdRef = useRef(1000);

  const pushNotification = useCallback((notif) => {
    const id = notifIdRef.current++;
    setNotifications((prev) => [...prev, { ...notif, id }]);
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleNotifAction = useCallback(
    (notif) => {
      if (notif.actionModal) openModal(notif.actionModal);
    },
    [openModal]
  );

  /* Chaos handler — triggers state AND pushes notification */
  const handleChaos = useCallback(
    (type) => {
      triggerChaos(type);
      if (type === 'silent_fail') {
        pushNotification({
          type: 'info',
          title: 'Station Update — Hub A',
          body: 'Seamlessly rerouted to Backup Hub B · 8 km ahead',
          actionLabel: 'View Telemetry',
          actionModal: 'aura',
        });
      } else if (type === 'derating') {
        pushNotification({
          type: 'info',
          title: 'Power Advisory',
          body: '120 kW adjusted at Hub A · Switching to full-power hub',
          actionLabel: 'View Telemetry',
          actionModal: 'aura',
        });
      } else if (type === 'sos') {
        pushNotification({
          type: 'assist',
          title: 'Mobile Pod Dispatched',
          body: 'MB-EV-POD-KA-07 · ETA 9 min · +40 kWh delivery',
          actionLabel: 'Track Pod',
          actionModal: 'sos',
          autoDismiss: false,
        });
      }
    },
    [triggerChaos, pushNotification]
  );

  /* Dock open — slot/lounge become notifications; others open modal directly */
  const handleDockOpen = useCallback(
    (modal) => {
      if (modal === 'slot') {
        pushNotification({
          type: 'slot',
          title: 'Bay #02 Secured',
          body: '11:30–11:50 AM · KM-112 Express Plaza · 120 kW',
          actionLabel: 'Manage Slot',
          actionModal: 'slot',
        });
      } else if (modal === 'lounge') {
        pushNotification({
          type: 'lounge',
          title: 'Lounge Pre-Order Ready',
          body: 'Starbucks @ KM-112 · Ready at 11:28 AM',
          actionLabel: 'View Order',
          actionModal: 'lounge',
        });
      } else {
        openModal(modal);
      }
    },
    [pushNotification, openModal]
  );

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: '#03070C' }}
    >
      {/* Top HUD */}
      <TopHUD
        vehicleData={vehicleData}
        chaosMode={chaosMode}
        onAuraClick={() => openModal('aura')}
      />

      {/* Body row */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Left dock — flush to edge */}
        <CarPlayDock
          activeModal={activeModal}
          openModal={handleDockOpen}
          onMicTap={() => setAiDrawerOpen((o) => !o)}
        />

        {/* Left column: AI orb + NavPanel */}
        <div
          className="flex flex-col p-3 gap-3 overflow-hidden shrink-0"
          style={{ width: '288px' }}
        >
          {/* AI assistant orb row */}
          <div className="flex items-center gap-2.5">
            <AIAssistant
              isOpen={aiDrawerOpen}
              setIsOpen={setAiDrawerOpen}
              openRouterKey={openRouterKey}
              setOpenRouterKey={setOpenRouterKey}
            />
            <div>
              <p className="text-[10px] text-white/40 font-medium">MBUX Aura</p>
              <p className="text-[9px] text-cyan-400/50">Highway Intelligence</p>
            </div>
          </div>

          {/* NavPanel fills remaining space */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <NavPanel
              routeData={routeData}
              rangeToggles={rangeToggles}
              toggleRange={toggleRange}
              availableRangeKm={availableRangeKm}
              arrivalSocPercent={arrivalSocPercent}
              extraRangeKm={extraRangeKm}
              chaosMode={chaosMode}
            />
          </div>
        </div>

        {/* Center: Route visualization */}
        <div className="flex-1 relative min-w-0 overflow-hidden">
          {/* Sci-fi grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,240,255,0.022) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,240,255,0.022) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
          {/* Radial ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,240,255,0.04) 0%, transparent 70%)',
            }}
          />

          {/* Main visualization */}
          <RouteVisualization
            chaosMode={chaosMode}
            vehicleData={vehicleData}
            routeData={routeData}
          />

          {/* Bottom progress bar */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3/4 pointer-events-none">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9px] text-white/25 font-mono tracking-widest">BLR</span>
              <div className="flex-1 h-0.5 rounded-full bg-white/8 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #00F0FF, #00E5A3)',
                    width: `${((568 - routeData.remainingKm) / 568) * 100}%`,
                  }}
                />
              </div>
              <span className="text-[9px] text-white/25 font-mono tracking-widest">HYD</span>
            </div>
            <p className="text-center text-[9px] text-white/20 font-mono">
              {routeData.remainingKm} km remaining &bull; ETA {routeData.arrivalTime}
            </p>
          </div>
        </div>

        {/* Notification overlay — right side */}
        <NotificationSystem
          notifications={notifications}
          onDismiss={dismissNotification}
          onAction={handleNotifAction}
        />
      </div>

      {/* Chaos bar at bottom */}
      <div className="shrink-0">
        <ChaosBar
          triggerChaos={handleChaos}
          resetChaos={resetChaos}
          chaosMode={chaosMode}
          startOnboarding={startOnboarding}
          openModal={openModal}
        />
      </div>

      {/* Onboarding tour overlay */}
      <OnboardingTour
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        step={onboardingStep}
        setStep={setOnboardingStep}
      />

      {/* Modals */}
      <AuraModal
        isOpen={activeModal === 'aura'}
        onClose={closeModal}
        chaosMode={chaosMode}
      />
      <SlotLockModal
        isOpen={activeModal === 'slot'}
        onClose={closeModal}
        slotDelayed={slotDelayed}
        setSlotDelayed={setSlotDelayed}
        addToast={addToast}
      />
      <LoungeModal
        isOpen={activeModal === 'lounge'}
        onClose={closeModal}
        cart={loungeCart}
        addToCart={addToLoungeCart}
        total={loungeTotal}
        ordered={loungeOrdered}
        setOrdered={setLoungeOrdered}
      />
      <SOSModal
        isOpen={activeModal === 'sos'}
        onClose={closeModal}
        vehicleData={vehicleData}
      />
      <BusinessModal
        isOpen={activeModal === 'business'}
        onClose={closeModal}
        selectedICP={selectedICP}
        setSelectedICP={setSelectedICP}
      />
    </div>
  );
}
