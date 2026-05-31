import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiLogIn, FiUserPlus, FiShield } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const SESSION_KEY = "coldtech_signin_prompt_shown";

export function SignInPromptModal() {
  const { isAuthenticated, loading } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 2500);

    return () => clearTimeout(timer);
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => { if (e.key === "Escape") setVisible(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  const dismiss = () => setVisible(false);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[900] bg-slate-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={dismiss}
          />

          {/* Modal card */}
          <div className="fixed inset-0 z-[901] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="w-full max-w-md pointer-events-auto"
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Gradient border wrapper */}
              <div className="p-px rounded-3xl shadow-2xl"
                style={{ background: "linear-gradient(135deg, #3AB6FF 0%, #2B0FA8 100%)" }}>
                <div className="bg-white rounded-3xl overflow-hidden">

                  {/* Top banner */}
                  <div className="px-6 pt-6 pb-5 text-center relative"
                    style={{ background: "linear-gradient(135deg, #EBF6FF 0%, #dbeafe 100%)" }}>

                    {/* Close button */}
                    <button onClick={dismiss}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition text-slate-500">
                      <FiX className="w-4 h-4" />
                    </button>

                    {/* Logo */}
                    <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto mb-3 shadow-lg"
                      style={{ boxShadow: "0 8px 24px rgba(14,165,233,0.3)" }}>
                      <img src={logo} alt="Coldtech" className="w-full h-full object-cover" />
                    </div>

                    <h2 className="text-xl font-black text-slate-900 mb-1"
                      style={{ fontFamily: "var(--font-display)" }}>
                      👋 Welcome to Coldtech!
                    </h2>
                    <p className="text-sm text-slate-500">
                      Sign in for the full experience
                    </p>
                  </div>

                  {/* Body */}
                  <div className="px-6 py-5">
                    {/* Benefits */}
                    <ul className="space-y-2 mb-5">
                      {[
                        "Track your repair status in real-time",
                        "Get faster support & priority service",
                        "View order history & service reports",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                          <FiShield className="w-4 h-4 flex-shrink-0 text-sky-500" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    {/* CTA buttons */}
                    <div className="flex gap-2.5">
                      <Link to="/login" onClick={dismiss}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white transition"
                        style={{ background: "linear-gradient(135deg, #3AB6FF, #1E90FF)", boxShadow: "0 4px 14px rgba(58,182,255,0.35)" }}>
                        <FiLogIn className="w-4 h-4" />
                        Sign In
                      </Link>
                      <Link to="/register" onClick={dismiss}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-sky-600 bg-sky-50 hover:bg-sky-100 transition border border-sky-200">
                        <FiUserPlus className="w-4 h-4" />
                        Create Account
                      </Link>
                    </div>

                    <button onClick={dismiss}
                      className="mt-3.5 w-full text-center text-xs text-slate-400 hover:text-slate-600 transition">
                      Maybe later
                    </button>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
