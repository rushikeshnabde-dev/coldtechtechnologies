import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from "../assets/logo.png";

export function Navbar() {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isAuthenticated, user, logout } = useAuth();
  const { count } = useCart();

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 10);
      const el = document.documentElement;
      setProgress(Math.min((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100, 100));
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { to: "/shop",             label: "Shop" },
    { to: "/services/request", label: "Services" },
    { to: "/services/track",   label: "Track" },
    { to: "/blog",             label: "Blog" },
    { to: "/about",            label: "About" },
    { to: "/contact",          label: "Contact" },
  ];

  const linkCls = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "text-[#3AB6FF] bg-[rgba(58,182,255,0.1)] font-semibold"
        : "text-slate-600 hover:text-[#3AB6FF] hover:bg-[rgba(58,182,255,0.07)]"
    }`;

  return (
    <>
      <div id="scroll-progress" style={{ width: `${progress}%` }} />
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md shadow-slate-200/60" : ""}`}
        style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid #E2E8F0" }}>
        <div className="ct-container flex items-center justify-between gap-4 py-3">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img src={logo} alt="Coldtech Logo" className="w-9 h-9 rounded-xl object-cover" />
            <span className="font-black text-lg" style={{ fontFamily: "var(--font-display)", color: "#0F172A" }}>
              Cold<span style={{ color: "#3AB6FF" }}>tech</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map(l => <NavLink key={l.to} to={l.to} className={linkCls}>{l.label}</NavLink>)}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-[#3AB6FF] hover:border-[#3AB6FF] transition bg-white">
              <FiShoppingCart className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-black text-white"
                  style={{ background: "linear-gradient(135deg,#3AB6FF,#1E90FF)" }}>
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="hidden items-center gap-2 lg:flex">
                {(user?.role === "admin" || user?.role === "staff") && (
                  <Link to="/admin-coldtech-secure"
                    className="px-3 py-2 rounded-xl text-xs font-bold transition"
                    style={{ color:"#3AB6FF", border:"1px solid rgba(58,182,255,0.3)", background:"rgba(58,182,255,0.08)" }}>
                    {user?.role === "admin" ? "Admin" : "Staff Panel"}
                  </Link>
                )}
                <Link to="/dashboard"
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:border-[#3AB6FF] hover:text-[#3AB6FF] transition bg-white">
                  Dashboard
                </Link>
                <button onClick={logout}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-700 transition">
                  Log out
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary hidden lg:inline-flex text-sm px-5 py-2">
                Login
              </Link>
            )}

            <button onClick={() => setOpen(v => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 lg:hidden bg-white">
              {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden">
              <button className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
              <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                className="absolute right-0 top-0 h-full w-72 overflow-auto bg-white"
                style={{ borderLeft: "1px solid #E2E8F0", boxShadow: "-8px 0 32px rgba(15,23,42,0.1)" }}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                    <img src={logo} alt="Coldtech Logo" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="font-black text-slate-900">Cold<span style={{ color:"#3AB6FF" }}>tech</span></span>
                  </Link>
                  <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700">
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-col gap-1 px-4 py-4">
                  {links.map(l => (
                    <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `px-4 py-3 rounded-xl text-sm font-medium transition ${isActive ? "text-[#3AB6FF] bg-[rgba(58,182,255,0.1)]" : "text-slate-600 hover:text-[#3AB6FF] hover:bg-[rgba(58,182,255,0.07)]"}`}>
                      {l.label}
                    </NavLink>
                  ))}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                    {isAuthenticated ? (
                      <>
                        <Link to="/dashboard" onClick={() => setOpen(false)}
                          className="px-4 py-3 rounded-xl text-sm font-medium text-slate-600 border border-slate-200">
                          Dashboard
                        </Link>
                        <button onClick={() => { logout(); setOpen(false); }}
                          className="px-4 py-3 rounded-xl text-sm font-medium text-slate-400 text-left">
                          Log out
                        </button>
                      </>
                    ) : (
                      <Link to="/login" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
                        Login
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
