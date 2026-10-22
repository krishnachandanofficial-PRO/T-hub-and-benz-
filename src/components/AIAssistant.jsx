import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Settings, X, ChevronDown } from 'lucide-react';
import { AI_CANNED_RESPONSES, DEFAULT_AI_RESPONSE } from '../constants/data';

/* ── Strip all emoji glyphs and variation selectors ── */
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/[\p{Extended_Pictographic}\uFE00-\uFE0F\u200D\u200B]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ── Deep confident male voice speech synthesis ── */
function speak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const plain = cleanText(text)
      .replace(/\*\*/g, '')
      .replace(/[#_`*~]/g, '')
      .trim();
    if (!plain) return;

    const utter = new SpeechSynthesisUtterance(plain);
    utter.pitch = 0.6;
    utter.rate = 0.82;
    utter.volume = 0.88;

    const preferredNames = [
      'daniel',
      'alex',
      'thomas',
      'oliver',
      'fred',
      'george',
      'david',
      'james',
    ];
    const avoidFragments = [
      'female',
      'woman',
      'samantha',
      'victoria',
      'karen',
      'susan',
      'kate',
      'siri',
    ];

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      let chosen = null;
      for (const name of preferredNames) {
        chosen = voices.find((v) => v.name.toLowerCase().includes(name));
        if (chosen) break;
      }
      if (!chosen) {
        chosen = voices.find((v) => {
          const n = v.name.toLowerCase();
          return (
            !avoidFragments.some((f) => n.includes(f)) &&
            (v.lang.startsWith('en') || v.lang.startsWith('en-'))
          );
        });
      }
      if (chosen) utter.voice = chosen;
    }

    window.speechSynthesis.speak(utter);
  } catch (_) {
    // Graceful fallback if speech synthesis is blocked
  }
}

/* ── Offline response matcher (all emojis removed) ── */
function getOfflineResponse(input) {
  const lower = input.toLowerCase();
  for (const entry of AI_CANNED_RESPONSES) {
    if (entry.triggers.some((t) => lower.includes(t))) {
      return cleanText(entry.response);
    }
  }
  return cleanText(DEFAULT_AI_RESPONSE);
}

/* ── Animated Waveform Bars (8 bars) ── */
function WaveformBars({ active }) {
  const bars = [3, 6, 10, 7, 4, 9, 6, 3];
  return (
    <div
      className="flex items-center gap-0.5 h-4 select-none"
      aria-hidden="true"
    >
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: '2px',
            backgroundColor: active ? '#00F0FF' : 'rgba(0, 240, 255, 0.35)',
          }}
          animate={
            active
              ? {
                  height: [`${h}px`, `${Math.min(16, h * 1.8)}px`, `${h}px`],
                }
              : { height: `${Math.max(2, h * 0.45)}px` }
          }
          transition={
            active
              ? {
                  duration: 0.5 + i * 0.07,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                  delay: i * 0.04,
                }
              : { duration: 0.25 }
          }
        />
      ))}
    </div>
  );
}

/* ── Chat Message Bubble ── */
function ChatBubble({ msg }) {
  const isUser = msg.role === 'user';
  const parts = msg.text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-snug break-words ${
          isUser ? 'text-white font-medium' : 'text-white/85'
        }`}
        style={{
          backgroundColor: isUser
            ? 'rgba(0, 240, 255, 0.15)'
            : 'rgba(255, 255, 255, 0.05)',
          border: isUser
            ? '1px solid rgba(0, 240, 255, 0.25)'
            : '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <span key={i} className="font-bold text-cyan-300">
                {part.slice(2, -2)}
              </span>
            );
          }
          return part;
        })}
      </div>
    </motion.div>
  );
}

export function AIAssistant({
  isOpen,
  setIsOpen,
  openRouterKey,
  setOpenRouterKey,
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'MBUX Aura co-pilot ready. Ask any route or charging question.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [orbTapped, setOrbTapped] = useState(false);

  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOrbTap = () => {
    setOrbTapped(true);
    setTimeout(() => setOrbTapped(false), 500);
    setIsOpen((prev) => !prev);
  };

  const sendMessage = useCallback(
    async (text) => {
      const cleanInput = text.trim();
      if (!cleanInput) return;

      const userMsg = { role: 'user', text: cleanInput };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      let response = '';

      // Try OpenRouter if key is present
      if (openRouterKey && openRouterKey.trim()) {
        try {
          const res = await fetch(
            'https://openrouter.ai/api/v1/chat/completions',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${openRouterKey.trim()}`,
              },
              body: JSON.stringify({
                model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
                messages: [
                  {
                    role: 'system',
                    content:
                      'You are MBUX Aura, a calm, confident male highway co-pilot AI for a Mercedes-Benz EQS. Answer briefly, factually, and reassuringly. Strictly no emojis.',
                  },
                  ...messages.map((m) => ({ role: m.role, content: m.text })),
                  { role: 'user', content: cleanInput },
                ],
                max_tokens: 200,
              }),
            }
          );

          if (res.ok) {
            const data = await res.json();
            const raw = data?.choices?.[0]?.message?.content;
            if (raw) response = cleanText(raw);
          }
        } catch (_) {
          // Fall through to offline response on error
        }
      }

      if (!response) {
        response = getOfflineResponse(cleanInput);
      }

      setIsLoading(false);
      const assistantMsg = { role: 'assistant', text: response };
      setMessages((prev) => [...prev, assistantMsg]);

      // Voice playback
      setIsSpeaking(true);
      speak(response);
      const estimatedDuration = Math.max(2200, response.length * 62);
      setTimeout(() => setIsSpeaking(false), estimatedDuration);
    },
    [messages, openRouterKey]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="relative">
      {/* ── ORB BUTTON (38x38px) ── */}
      <motion.button
        type="button"
        title="MBUX Aura Voice Concierge"
        aria-label="MBUX Aura Voice Concierge"
        onClick={handleOrbTap}
        whileTap={{ scale: 0.88 }}
        animate={
          orbTapped
            ? { scale: [1, 1.25, 0.92, 1] }
            : { scale: 1 }
        }
        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        className="relative flex items-center justify-center rounded-full outline-none"
        style={{
          width: '38px',
          height: '38px',
          background:
            'radial-gradient(circle, rgba(0, 240, 255, 0.22) 0%, rgba(0, 229, 163, 0.08) 100%)',
          border: `1px solid ${
            isOpen || isSpeaking
              ? 'rgba(0, 240, 255, 0.55)'
              : 'rgba(0, 240, 255, 0.22)'
          }`,
          boxShadow: isSpeaking
            ? '0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.2)'
            : isOpen
            ? '0 0 14px rgba(0, 240, 255, 0.3)'
            : 'none',
        }}
      >
        {/* Pulsing rings when speaking */}
        {isSpeaking && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border border-cyan-400/25 pointer-events-none"
              animate={{ scale: [1, 1.7], opacity: [0.55, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-cyan-400/18 pointer-events-none"
              animate={{ scale: [1, 2.1], opacity: [0.45, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: 0.35,
                ease: 'easeOut',
              }}
            />
          </>
        )}
        <WaveformBars active={isSpeaking || orbTapped} />
      </motion.button>

      {/* ── CHAT DRAWER (280x320px) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="absolute left-0 top-12 z-50 flex flex-col shadow-2xl"
            style={{
              width: '280px',
              height: '320px',
              backgroundColor: 'rgba(4, 10, 20, 0.97)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(0, 240, 255, 0.16)',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/5 select-none shrink-0">
              <div className="flex items-center gap-2">
                <WaveformBars active={isSpeaking} />
                <div>
                  <p className="text-[11px] font-bold text-white/90 leading-tight">
                    MBUX Aura
                  </p>
                  <p className="text-[9px] text-cyan-400/70 font-medium leading-tight">
                    Highway Intelligence
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSettings((s) => !s)}
                  title="Aura Settings"
                  aria-label="Aura Settings"
                  className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <Settings size={12} className="text-white/45" />
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  aria-label="Close Assistant"
                  className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                >
                  <ChevronDown size={13} className="text-white/45" />
                </motion.button>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  className="overflow-hidden border-b border-white/5 shrink-0"
                >
                  <div className="px-3.5 py-2.5">
                    <p className="text-[9px] text-white/40 font-medium uppercase tracking-widest mb-1.5 leading-none">
                      OpenRouter API Key (Optional)
                    </p>
                    <input
                      type="password"
                      placeholder="sk-or-..."
                      value={openRouterKey || ''}
                      onChange={(e) => setOpenRouterKey?.(e.target.value)}
                      className="w-full rounded-xl px-2.5 py-1.5 text-[10px] text-white/80 outline-none"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    />
                    <p className="text-[9px] text-white/30 mt-1 leading-tight">
                      Uses nvidia/nemotron-3-ultra-550b · Fully functional offline
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages List */}
            <div
              className="flex-1 overflow-y-auto px-3.5 py-2 flex flex-col gap-2"
              style={{ scrollbarWidth: 'none' }}
            >
              {messages.map((msg, i) => (
                <ChatBubble key={i} msg={msg} />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="px-3 py-2 rounded-2xl"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-cyan-400/60"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: 'easeInOut',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input Row */}
            <div className="px-3 py-2.5 border-t border-white/5 shrink-0">
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-1.5"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your route..."
                  className="flex-1 text-xs text-white/85 bg-transparent outline-none placeholder:text-white/25"
                />
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.88 }}
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-colors outline-none"
                  style={{
                    backgroundColor: input.trim()
                      ? 'rgba(0, 240, 255, 0.18)'
                      : 'rgba(255, 255, 255, 0.04)',
                    border: input.trim()
                      ? '1px solid rgba(0, 240, 255, 0.35)'
                      : '1px solid transparent',
                  }}
                >
                  <Send
                    size={12}
                    className={
                      input.trim() ? 'text-cyan-400' : 'text-white/25'
                    }
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
