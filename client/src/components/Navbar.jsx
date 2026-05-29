import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX, FiShoppingCart, FiPhone } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from "../assets/logo.png";

const LINKS = [
  { to: "/",                 label: "Home" },
  { to: "/shop",             label: "Shop" },
  { to: "/services/request", label: "Services" },
  { to: "/services/track",   label: "Track" },
  { to: "/blog",             label: "Blog" },
  { to: "/about",            label: "About" },
  { to: "/contact",          label: "Contact" },
];

export function Navbar() {
  const [open,      setOpen]      = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { count } = useCart();
  const location  = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleHome = (e) => {
    e.preventDefault();
    setOpen(false);
    if (location.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
    else navigate("/");
  };

  const linkCls = ({ isActive }) =>
    `relative px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-[#3AB6FF] font-semibold"
        : "text-slate-600 hover:text-[#3AB6FF]"
    }`;

  return (
    <motion.header
      initial={false}
      animate={scrolled ? "scrolled" : "top"}
      variants={{
        top:     { backgroundColor: "rgba(255,255,255,1)", boxShadow: "0 1px 0 0 #E2E8F0" },
        scrolled: { backgroundColor: "rgba(255,255,255,0.92)", boxShadow: "0 4px 24px rgba(15,23,42,0.08)" },
      }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 border-b border-slate-200/80"
      style={{ backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none" }}>

      {/* Top announcement bar */}
      <div className="hidden md:flex items-center justify-between px-6 lg:px-10 py-1.5 border-b border-slate-100 bg-slate-50/80 text-xs text-slate-500">
        <span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
          Free diagnosis for all repairs · 30-day warranty guaranteed
        </span>
        <a href="tel:+919529882920" className="flex items-center gap-1.5 font-semibold text-[#3AB6FF] hover:underline">
          <FiPhone className="w-3 h-3" /> +91 95298 82920
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-14">

        {/* Logo */}
        <a href="/" onClick={handleHome} className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="relative">
            <img src={logo} alt="Coldtech" className="w-8 h-8 rounded-lg object-cover" />
            <motion.div
              className="absolute inset-0 rounded-lg"
              style={{ background: "rgba(58,182,255,0.25)", filter: "blur(6px)" }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>
          <span className="font-black text-base" style={{ fontFamily: "var(--font-display)", color: "#0F172A" }}>
            Cold<span style={{ color: "#3AB6FF" }}>tech</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"}
              onClick={l.to === "/" ? handleHome : undefined}
              className={linkCls}>
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#3AB6FF]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Link to="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-[#3AB6FF] hover:border-[#3AB6FF]/40 hover:bg-[#3AB6FF]/5 transition-all duration-200">
            <FiShoppingCart className="h-4 w-4" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full text-[10px] font-black text-white px-1"
                  style={{ background: "#3AB6FF" }}>
                  {count > 9 ? "9+" : count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Desktop auth */}
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center gap-2">
              {(user?.role === "admin" || user?.role === "staff") && (
                <Link to="/admin-coldtech-secure"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
                  style={{ color:"#3AB6FF", border:"1px solid rgba(58,182,255,0.3)", background:"rgba(58,182,255,0.08)" }}>
                  Admin
                </Link>
              )}
              <Link to="/dashboard"
                className="px-3 py-1.5 rounded-lg text-sm text-slate-600 border border-slate-200 hover:border-[#3AB6FF] hover:text-[#3AB6FF] transition-all duration-200">
                Dashboard
              </Link>
              <button onClick={logout}
                className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-700 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary hidden lg:inline-flex text-sm px-4 py-1.5 min-h-[36px]">
              Login
            </Link>
          )}

          {/* Hamburger */}
          <motion.button
            onClick={() => setOpen(v => !v)}
            whileTap={{ scale: 0.92 }}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-[#3AB6FF]/40 hover:text-[#3AB6FF] transition-all">
            <AnimatePresence mode="wait" initial={false}>
              {open
                ? <motion.span key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><FiX className="h-5 w-5" /></motion.span>
                : <motion.span key="menu" initial={{ rotate: 90,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><FiMenu className="h-5 w-5" /></motion.span>
              }
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-slate-100">
            <div className="px-4 py-3 flex flex-col gap-1">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}>
                  <NavLink to={l.to} end={l.to === "/"}
                    onClick={l.to === "/" ? handleHome : () => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "text-[#3AB6FF] bg-[rgba(58,182,255,0.08)] font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-[#3AB6FF]"
                      }`}>
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <div className="pt-3 mt-1 border-t border-slate-100 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    {(user?.role === "admin" || user?.role === "staff") && (
                      <Link to="/admin-coldtech-secure" onClick={() => setOpen(false)}
                        className="px-4 py-3 rounded-xl text-sm font-bold text-center"
                        style={{ color:"#3AB6FF", background:"rgba(58,182,255,0.08)", border:"1px solid rgba(58,182,255,0.2)" }}>
                        Admin Panel
                      </Link>
                    )}
                    <Link to="/dashboard" onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-xl text-sm text-slate-600 border border-slate-200 text-center hover:border-[#3AB6FF]/40 transition-all">
                      Dashboard
                    </Link>
                    <button onClick={() => { logout(); setOpen(false); }}
                      className="px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors text-left">
                      Log out
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setOpen(false)}
                    className="btn-primary w-full text-center py-3 text-sm">
                    Login
                  </Link>
                )}
                {/* Mobile contact */}
                <a href="tel:+919529882920"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#3AB6FF] border border-[#3AB6FF]/25 bg-[#3AB6FF]/05">
                  <FiPhone className="w-4 h-4" /> +91 95298 82920
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
