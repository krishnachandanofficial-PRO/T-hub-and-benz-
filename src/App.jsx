import { AnimatePresence, motion } from 'framer-motion';
import { useAppState } from './hooks/useAppState';
import { StartScreen } from './components/StartScreen';
import { MainScreen } from './components/MainScreen';
import { ToastContainer } from './components/ToastContainer';

export default function App() {
  const state = useAppState();

  const handleLaunch = () => {
    state.setScreen('main');
    state.startOnboarding();
  };

  const handleStartTour = () => {
    state.startOnboarding();
    if (state.screen === 'start') {
      state.setScreen('main');
    }
  };

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      style={{ background: '#03070C', fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(0,240,255,0.03) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(0,229,163,0.03) 0%, transparent 60%)',
        }}
      />

      <AnimatePresence mode="wait">
        {state.screen === 'start' ? (
          <motion.div
            key="start"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5 }}
          >
            <StartScreen onLaunch={handleLaunch} onStartTour={handleStartTour} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <MainScreen
              vehicleData={state.vehicleData}
              routeData={state.routeData}
              rangeToggles={state.rangeToggles}
              toggleRange={state.toggleRange}
              activeModal={state.activeModal}
              openModal={state.openModal}
              closeModal={state.closeModal}
              extraRangeKm={state.extraRangeKm}
              availableRangeKm={state.availableRangeKm}
              arrivalSocPercent={state.arrivalSocPercent}
              chaosMode={state.chaosMode}
              triggerChaos={state.triggerChaos}
              resetChaos={state.resetChaos}
              slotDelayed={state.slotDelayed}
              setSlotDelayed={state.setSlotDelayed}
              isOnboardingOpen={state.isOnboardingOpen}
              setIsOnboardingOpen={state.setIsOnboardingOpen}
              onboardingStep={state.onboardingStep}
              setOnboardingStep={state.setOnboardingStep}
              startOnboarding={state.startOnboarding}
              loungeCart={state.loungeCart}
              addToLoungeCart={state.addToLoungeCart}
              loungeTotal={state.loungeTotal}
              loungeOrdered={state.loungeOrdered}
              setLoungeOrdered={state.setLoungeOrdered}
              aiDrawerOpen={state.aiDrawerOpen}
              setAiDrawerOpen={state.setAiDrawerOpen}
              openRouterKey={state.openRouterKey}
              setOpenRouterKey={state.setOpenRouterKey}
              addToast={state.addToast}
              selectedICP={state.selectedICP}
              setSelectedICP={state.setSelectedICP}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer toasts={state.toasts} />
    </div>
  );
}
