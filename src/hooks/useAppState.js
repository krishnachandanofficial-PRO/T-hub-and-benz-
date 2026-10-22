import { useState, useCallback } from 'react';
import { VEHICLE_DATA, ROUTE_DATA, RANGE_TOGGLES } from '../constants/data';

export function useAppState() {
  const [screen, setScreen] = useState('start');
  const [activeModal, setActiveModal] = useState(null);
  const [rangeToggles, setRangeToggles] = useState({});
  const [vehicleData, setVehicleData] = useState(VEHICLE_DATA);
  const [routeData, setRouteData] = useState(ROUTE_DATA);
  const [slotDelayed, setSlotDelayed] = useState(false);
  const [chaosMode, setChaosMode] = useState(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [selectedICP, setSelectedICP] = useState('b2c');
  const [loungeCart, setLoungeCart] = useState([]);
  const [loungeOrdered, setLoungeOrdered] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [energyOrbSpeed, setEnergyOrbSpeed] = useState(1);

  const extraRangeKm = RANGE_TOGGLES.reduce((sum, toggle) => {
    return sum + (rangeToggles[toggle.id] ? toggle.addKm : 0);
  }, 0);

  const availableRangeKm = vehicleData.rangeKm + extraRangeKm;
  const arrivalSocPercent = Math.min(
    95,
    vehicleData.arrivalSocPercent + Math.round(extraRangeKm * 0.18)
  );

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const toggleRange = useCallback(
    (id) => {
      setRangeToggles((prev) => {
        const isNowEnabled = !prev[id];
        const toggle = RANGE_TOGGLES.find((t) => t.id === id);
        if (toggle) {
          const msg = isNowEnabled
            ? `${toggle.label} on — +${toggle.addKm} km recovered`
            : `${toggle.label} off — -${toggle.addKm} km`;
          setTimeout(() => addToast(msg, isNowEnabled ? 'success' : 'info', 3500), 0);
        }
        return { ...prev, [id]: isNowEnabled };
      });
    },
    [addToast]
  );

  const openModal = useCallback((modalId) => {
    setActiveModal(modalId);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const triggerChaos = useCallback(
    (type) => {
      setChaosMode(type);
      if (type === 'silent_fail') {
        addToast('Station update at Hub A — Rerouting to Backup Hub B', 'warning', 5000);
        setTimeout(() => {
          addToast(
            'Slot transferred to KM-120 Greenfield Hub B — No trip impact.',
            'success',
            5000
          );
        }, 2500);
        setActiveModal('aura');
      } else if (type === 'derating') {
        addToast(
          'Power advisory: 120 kW adjusted at Hub A — Switching to full-power hub.',
          'warning',
          5000
        );
        setActiveModal('aura');
      } else if (type === 'sos') {
        setVehicleData((prev) => ({ ...prev, socPercent: 0, rangeKm: 0 }));
        addToast('Rapid Assist activated — Mobile Energy Pod on its way.', 'danger', 6000);
        setActiveModal('sos');
      }
    },
    [addToast]
  );

  const resetChaos = useCallback(() => {
    setChaosMode(null);
    setVehicleData(VEHICLE_DATA);
  }, []);

  const startOnboarding = useCallback(() => {
    setOnboardingStep(0);
    setIsOnboardingOpen(true);
  }, []);

  const addToLoungeCart = useCallback((item) => {
    setLoungeCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) => (i.name === item.name ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const loungeTotal = loungeCart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return {
    screen,
    setScreen,
    activeModal,
    openModal,
    closeModal,
    rangeToggles,
    toggleRange,
    vehicleData,
    setVehicleData,
    routeData,
    setRouteData,
    slotDelayed,
    setSlotDelayed,
    chaosMode,
    setChaosMode,
    triggerChaos,
    resetChaos,
    isOnboardingOpen,
    setIsOnboardingOpen,
    onboardingStep,
    setOnboardingStep,
    startOnboarding,
    toasts,
    addToast,
    extraRangeKm,
    availableRangeKm,
    arrivalSocPercent,
    selectedICP,
    setSelectedICP,
    loungeCart,
    setLoungeCart,
    addToLoungeCart,
    loungeTotal,
    loungeOrdered,
    setLoungeOrdered,
    aiDrawerOpen,
    setAiDrawerOpen,
    openRouterKey,
    setOpenRouterKey,
    energyOrbSpeed,
    setEnergyOrbSpeed,
  };
}
