import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiZap, FiClock } from "react-icons/fi";
import { api } from "../services/api";

function useCountdown(endDate) {
  const calc = useCallback(() => {
    if (!endDate) return null;
    const diff = new Date(endDate) - new Date();
    if (diff <= 0) return null;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s };
  }, [endDate]);

  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, [calc]);
  return time;
}

function pad(n) { return String(n).padStart(2, "0"); }

export function OfferBar() {
  const [offer, setOffer]     = useState(null);
  const [visible, setVisible] = useState(true);
  const [loaded, setLoaded]   = useState(false);
  const countdown = useCountdown(offer?.endDate);

  useEffect(() => {
    api.get("/offers/today")
      .then(res => { setOffer(res.data.offer || null); })
      .catch(() => setOffer(null))
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || !offer || !visible) return null;

  const isToday = offer.badge?.toLowerCase().includes("today");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-50 overflow-hidden"
        style={{ background: "linear-gradient(90deg, #2B0FA8 0%, #1E90FF 50%, #3AB6FF 100%)" }}
      >
        <div className="relative flex items-center justify-center gap-3 px-4 py-2.5 text-white text-sm">
          {/* Animated background shimmer */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)" }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Icon */}
          <FiZap className="w-4 h-4 flex-shrink-0 text-yellow-300" />

          {/* Badge */}
          {offer.badge && (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-yellow-400 text-yellow-900 flex-shrink-0">
              {offer.badge}
            </span>
          )}

          {/* Content */}
          <p className="font-semibold text-center leading-tight">
            {offer.title}
            {offer.discount && (
              <span className="ml-2 font-black text-yellow-300">{offer.discount}</span>
            )}
          </p>

          {/* Countdown */}
          {countdown && (
            <span className="hidden md:flex items-center gap-1 text-xs font-mono bg-white/15 px-2.5 py-1 rounded-full flex-shrink-0">
              <FiClock className="w-3 h-3" />
              {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
            </span>
          )}

          {/* CTA */}
          {offer.link && (
            <Link to={offer.link}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white text-[#2B0FA8] hover:bg-yellow-300 hover:text-[#2B0FA8] transition flex-shrink-0">
              Claim Now →
            </Link>
          )}

          {/* Close */}
          <button onClick={() => setVisible(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition flex-shrink-0">
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
