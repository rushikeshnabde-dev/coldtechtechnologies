import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { describeAxiosNetworkFailure } from "../utils/networkErrorMessage";
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiUserPlus } from "react-icons/fi";
import logo from "../assets/logo.png";

const inp = "w-full rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition border";
const inpCls = (err) => inp + " pl-10 " + (err ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100");

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name:"", email:"", phone:"", password:"" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const set = (k, v) => { setForm(p => ({...p,[k]:v})); setErrors(p => ({...p,[k]:""})); };

  function validate() {
    const e = {};
    if (!form.name.trim())                                      e.name     = "Full name is required";
    if (!form.email.trim())                                     e.email    = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))   e.email    = "Invalid email";
    if (!form.password)                                         e.password = "Password is required";
    else if (form.password.length < 6)                          e.password = "Minimum 6 characters";
    return e;
  }

  async function submit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created! Welcome to ColdTech.");
      navigate("/dashboard", { replace:true });
    } catch (err) {
      const hint = describeAxiosNetworkFailure(err);
      toast.error(err.response?.data?.message || hint || "Registration failed", { duration: hint ? 8000 : 4000 });
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background:"linear-gradient(135deg,#F0FDF4 0%,#E0F2FE 50%,#F8FAFC 100%)" }}>
      <motion.div initial={{ opacity:0, y:24, scale:.97 }} animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:.5 }} className="w-full max-w-md">
        <div className="p-px rounded-3xl shadow-2xl" style={{ background:"linear-gradient(135deg,#10B981,#0EA5E9,#1E293B)" }}>
          <div className="bg-white rounded-3xl p-8">

            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg"
                style={{ boxShadow:"0 8px 24px rgba(16,185,129,0.35)" }}>
                <img src={logo} alt="Coldtech" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 mb-1" style={{ fontFamily:"var(--font-display)" }}>Create account</h1>
              <p className="text-sm text-slate-500">Join ColdTech to shop and track services</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {[
                { k:"name",  label:"Full Name",        icon:FiUser,  type:"text",  ph:"John Doe" },
                { k:"email", label:"Email Address",    icon:FiMail,  type:"email", ph:"you@example.com" },
                { k:"phone", label:"Phone (optional)", icon:FiPhone, type:"tel",   ph:"+91 98765 43210" },
              ].map(({ k, label, icon:Icon, type, ph }) => (
                <div key={k}>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type={type} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph}
                      className={inpCls(errors[k])} />
                  </div>
                  {errors[k] && <p className="text-xs text-red-500 mt-1">{errors[k]}</p>}
                </div>
              ))}

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showPass ? "text" : "password"} value={form.password}
                    onChange={e => set("password", e.target.value)} placeholder="Min. 6 characters"
                    className={inpCls(errors.password) + " pr-12"} />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500 transition">
                    {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <motion.button type="submit" disabled={loading} whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white disabled:opacity-60"
                style={{ background:"linear-gradient(135deg,#10B981,#0EA5E9)", boxShadow:"0 4px 16px rgba(16,185,129,0.35)" }}>
                {loading ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <><FiUserPlus className="w-4 h-4" /> Create Account</>}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-sky-500 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}