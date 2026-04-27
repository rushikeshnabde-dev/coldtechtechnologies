import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import { describeAxiosNetworkFailure } from "../utils/networkErrorMessage";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import logo from "../assets/logo.png";
import { SEO } from "../components/SEO";

const inp = "w-full rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition border";

export function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = (() => {
    const s = location.state?.from?.pathname;
    if (s) return s;
    const n = new URLSearchParams(location.search).get("next");
    if (n === "admin") return "/admin-coldtech-secure";
    return "/dashboard";
  })();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  // ── Google OAuth ────────────────────────────────────────────────────────────
  async function handleGoogleSuccess(credentialResponse) {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { name, email: gEmail, picture } = decoded;
      console.log("Google user:", { name, email: gEmail, picture });

      // Send to backend, get back app JWT, persist session
      const loggedInUser = await loginWithGoogle(credentialResponse.credential);

      toast.success(`Welcome, ${loggedInUser.name}!`);
      navigate(
        loggedInUser.role === 'admin' || loggedInUser.role === 'staff'
          ? '/admin-coldtech-secure'
          : from,
        { replace: true }
      );
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Google sign-in failed. Please try again.");
    }
  }

  function handleGoogleError() {
    console.error("Google OAuth flow was cancelled or failed.");
    // Common cause: popup blocked by browser
    toast.error("Google sign-in failed. If a popup was blocked, please allow popups for this site.");
  }

  function validate() {
    const e = {};
    if (!email.trim())                                   e.email    = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email    = "Invalid email";
    if (!password)                                       e.password = "Password is required";
    return e;
  }

  async function submit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      toast.success("Welcome back!");
      if (loggedInUser?.role === 'admin' || loggedInUser?.role === 'staff') {
        navigate("/admin-coldtech-secure", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      const hint = describeAxiosNetworkFailure(err);
      toast.error(err.response?.data?.message || hint || "Login failed", { duration: hint ? 8000 : 4000 });
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background:"linear-gradient(135deg,#EBF6FF 0%,#dbeafe 50%,#F8FAFC 100%)" }}>
      <SEO title="Sign In" description="Sign in to your Coldtech Technologies account to manage orders, track service requests, and access your IT support dashboard." canonical="/login" noIndex={true} />
      <motion.div initial={{ opacity:0, y:24, scale:.97 }} animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:.5 }} className="w-full max-w-md">
        <div className="p-px rounded-3xl shadow-2xl" style={{ background:"linear-gradient(135deg,#3AB6FF,#2B0FA8)" }}>
          <div className="bg-white rounded-3xl p-8">

            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg"
                style={{ boxShadow:"0 8px 24px rgba(14,165,233,0.35)" }}>
                <img src={logo} alt="Coldtech" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 mb-1" style={{ fontFamily:"var(--font-display)" }}>Welcome back</h1>
              <p className="text-sm text-slate-500">Sign in to your ColdTech account</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({...p,email:""})); }}
                    placeholder="you@example.com"
                    className={inp + " pl-10 " + (errors.email ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100")} />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showPass ? "text" : "password"} value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(p => ({...p,password:""})); }}
                    placeholder="••••••••"
                    className={inp + " pl-10 pr-12 " + (errors.password ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100")} />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500 transition">
                    {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded accent-sky-500" />
                  <span className="text-xs text-slate-500">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-sky-500 hover:underline">Forgot password?</Link>
              </div>

              <motion.button type="submit" disabled={loading} whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white disabled:opacity-60"
                style={{ background:"linear-gradient(135deg,#3AB6FF,#1E90FF)", boxShadow:"0 4px 16px rgba(58,182,255,0.4)" }}>
                {loading ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <><FiLogIn className="w-4 h-4" /> Sign In</>}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              No account?{" "}
              <Link to="/register" className="font-bold text-sky-500 hover:underline">Create one</Link>
            </p>

            {/* ── Google Login ── */}
            <div className="mt-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">or continue with</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap={false}
                    theme="outline"
                    shape="rectangular"
                    size="large"
                    text="continue_with"
                    width="368"
                  />
                </div>
              ) : (
                <p className="text-center text-xs text-red-400">
                  Google login unavailable — client ID not configured.
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}