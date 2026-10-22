import { useState } from 'react';
import { motion } from 'framer-motion';
import { ModalBase } from '../ModalBase';
import { LOUNGE_ORDER } from '../../constants/data';
import { ShoppingCart, Plus, Minus, Check, Clock } from 'lucide-react';

export function LoungeModal({ isOpen, onClose, cart, addToCart, total, ordered, setOrdered }) {
  const [confirming, setConfirming] = useState(false);

  const handleOrder = async () => {
    setConfirming(true);
    await new Promise(r => setTimeout(r, 1500));
    setOrdered(true);
    setConfirming(false);
  };

  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="Highway Lounge Pre-Order"
      subtitle="Synced to your arrival ETA · Starbucks & Artisan Lounge"
      accentColor="#C4B896"
    >
      {/* Lounge header */}
      <div className="rounded-2xl border border-white/10 p-4 mb-5 bg-white/3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-white">{LOUNGE_ORDER.hub}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-white/45 mt-2">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-amber-400" />
            <span>Arrival ETA: <span className="text-amber-300 font-semibold">{LOUNGE_ORDER.arrivalEta}</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-300">Ready on arrival · No wait</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-white/30 bg-amber-950/15 border border-amber-400/15 rounded-xl px-3 py-2">
          💼 {LOUNGE_ORDER.affiliatePercent}% affiliate commission per order flows to EQ Aura revenue stream
        </div>
      </div>

      {!ordered ? (
        <>
          {/* Menu items */}
          <div className="space-y-3 mb-5">
            {LOUNGE_ORDER.items.map(item => {
              const cartItem = cart.find(i => i.name === item.name);
              const qty = cartItem?.qty || 0;
              return (
                <motion.div
                  key={item.name}
                  className="flex items-center justify-between p-4 rounded-2xl border border-white/8 bg-white/3"
                  whileHover={{ borderColor: 'rgba(196,184,150,0.25)' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-white/40">₹{item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {qty > 0 && (
                      <>
                        <button
                          onClick={() => {
                            /* Remove from cart — handled in parent */
                          }}
                          className="p-1.5 rounded-full bg-white/8 hover:bg-white/15 transition-colors"
                        >
                          <Minus size={12} className="text-white/60" />
                        </button>
                        <span className="w-5 text-center text-sm font-bold text-white">{qty}</span>
                      </>
                    )}
                    <motion.button
                      onClick={() => addToCart(item)}
                      className="p-1.5 rounded-full transition-colors"
                      style={{
                        background: qty > 0 ? '#C4B89622' : '#C4B89614',
                        border: `1px solid #C4B896${qty > 0 ? '50' : '25'}`,
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.92 }}
                    >
                      <Plus size={12} style={{ color: '#C4B896' }} />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Cart summary */}
          {itemCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-950/15 border border-amber-400/20 rounded-2xl p-4 mb-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={14} className="text-amber-400" />
                  <span className="text-sm font-semibold text-white">{itemCount} item{itemCount > 1 ? 's' : ''}</span>
                </div>
                <span className="text-sm font-black text-amber-300">₹{total}</span>
              </div>
              <motion.button
                onClick={handleOrder}
                disabled={confirming}
                className="w-full py-3 rounded-xl text-sm font-bold text-black transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: '#C4B896' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {confirming ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                    Syncing to your ETA...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={14} />
                    Pre-Order Now · Ready at {LOUNGE_ORDER.arrivalEta}
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {itemCount === 0 && (
            <div className="text-center py-4">
              <p className="text-xs text-white/30">Tap + to add items — ready when you arrive, no waiting</p>
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-400/30 flex items-center justify-center mx-auto mb-4"
          >
            <Check size={32} className="text-emerald-400" />
          </motion.div>
          <h3 className="text-lg font-bold text-white mb-2">Order Confirmed!</h3>
          <p className="text-sm text-white/50 mb-4">
            Your order will be ready at {LOUNGE_ORDER.arrivalEta} — 2 minutes before you arrive.
          </p>
          <div className="bg-white/3 border border-white/8 rounded-2xl p-4">
            {cart.map(item => (
              <div key={item.name} className="flex justify-between text-xs text-white/60 py-1">
                <span>{item.emoji} {item.name} ×{item.qty}</span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}
            <div className="border-t border-white/10 mt-2 pt-2 flex justify-between text-sm font-bold text-white">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </motion.div>
      )}
    </ModalBase>
  );
}
