import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiLock, FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export function ActivateAccount() {
  const [params]   = useSearchParams();
  const navigate   = useNavigate();
  const { persist } = useAuth();
  const token      = params.get("token");

  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [done,      setDone]      = useState(false);
  const [error,     setError]     = useState("");

  useEffect(() => {
    if (!token) setError("Invalid activation link. Please contact support.");
  }, [token]);

  async function submit(e) {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setError(""); setLoading(true);
    try {
      const { data } = await api.post("/amc/activate", { token, password });
      // Log user in automatically
      if (data.token && data.user) {
        const { setAuthToken } = await import("../services/api");
        setAuthToken(data.token);
        localStorage.setItem("coldtech_auth", JSON.stringify({ token: data.token, user: data.user }));
      }
      setDone(true);
      toast.success("Account activated! Welcome to Coldtech.");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Activation failed. Link may have expired.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg,#EBF6FF 0%,#dbeafe 50%,#F8FAFC 100%)" }}>
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}
        className="w-full max-w-md">
        <div className="p-px rounded-3xl shadow-2xl" style={{ background:"linear-gradient(135deg,#3AB6FF,#2B0FA8)" }}>
          <div className="bg-white rounded-3xl p-8">
            <div className="text-center mb-8">
              <img src={logo} alt="Coldtech" className="w-14 h-14 rounded-2xl object-cover mx-auto mb-4 shadow-lg" />
              <h1 className="text-2xl font-black text-slate-900 mb-1">Activate Your Account</h1>
              <p className="text-sm text-slate-500">Set a password to access your Coldtech dashboard</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
            )}

            {done ? (
              <div className="text-center py-6">
                <FiCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="font-bold text-slate-800">Account activated!</p>
                <p className="text-sm text-slate-500 mt-1">Redirecting to your dashboard…</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">New Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type={showPass ? "text" : "password"} value={password}
                      onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition" />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500 transition">
                      {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type={showPass ? "text" : "password"} value={confirm}
                      onChange={e => setConfirm(e.target.value)} placeholder="Repeat password"
                      className="w-full pl-10 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition" />
                  </div>
                </div>
                <motion.button type="submit" disabled={loading || !token} whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white disabled:opacity-60"
                  style={{ background:"linear-gradient(135deg,#3AB6FF,#1E90FF)", boxShadow:"0 4px 16px rgba(58,182,255,0.4)" }}>
                  {loading ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : "Activate & Login"}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
