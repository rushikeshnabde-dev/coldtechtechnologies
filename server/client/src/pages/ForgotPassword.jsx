import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiMail, FiArrowLeft, FiSend, FiCheckCircle } from "react-icons/fi";

function Orb({ style }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none blur-3xl opacity-30"
      style={style}
      animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
      transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const ORBS = [
  { width: 280, height: 280, top: "-60px",   left: "-60px",  background: "#00A6C4" },
  { width: 220, height: 220, bottom: "-50px", right: "-50px", background: "#1A2C3E" },
];

const inp = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-page)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] transition";

export function ForgotPassword() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!email.trim())                                    { setError("Email is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))       { setError("Enter a valid email"); return; }
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate API
    setLoading(false);
    setSent(true);
    toast.success("Reset link sent if account exists!");
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)" }}>
      {ORBS.map((s, i) => <Orb key={i} style={s} />)}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #1A2C3E 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="relative z-10 w-full max-w-md">
        <div className="p-px rounded-3xl shadow-2xl" style={{ background: "linear-gradient(135deg, #00A6C4, #1A2C3E)" }}>
          <div className="bg-white rounded-3xl p-8">

            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: "linear-gradient(135deg, #1A2C3E, #00A6C4)" }}>
                      <FiMail className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-text)]">Forgot password?</h1>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Enter your email and we'll send a reset link</p>
                  </div>

                  <form onSubmit={submit} className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-[var(--color-text-muted)]">Email Address</label>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                        <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com"
                          className={inp + " pl-10 " + (error ? "border-red-400" : "")} />
                      </div>
                      {error && <p className="text-xs text-red-500">{error}</p>}
                    </div>

                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #1A2C3E, #00A6C4)" }}>
                      {loading
                        ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        : <><FiSend className="w-4 h-4" /> Send Reset Link</>}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                    <FiCheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">Check your inbox</h2>
                  <p className="text-sm text-[var(--color-text-muted)] mb-6">
                    If <span className="font-medium text-[var(--color-text)]">{email}</span> is registered, you'll receive a reset link shortly.
                  </p>
                  <button onClick={() => { setSent(false); setEmail(""); }}
                    className="text-sm font-medium hover:underline" style={{ color: "#00A6C4" }}>
                    Try a different email
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-cyan)] transition">
                <FiArrowLeft className="w-3.5 h-3.5" /> Back to login
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}