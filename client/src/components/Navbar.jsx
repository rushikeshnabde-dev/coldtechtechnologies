import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX, FiShoppingCart } from "react-icons/fi";
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
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { count } = useCart();
  const location  = useLocation();
  const navigate  = useNavigate();

  const handleHome = (e) => {
    e.preventDefault();
    setOpen(false);
    if (location.pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
    else navigate("/");
  };

  const linkCls = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? "text-[#3AB6FF] font-semibold" : "text-slate-600 hover:text-[#3AB6FF]"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-14">

        {/* Logo */}
        <a href="/" onClick={handleHome} className="flex items-center gap-2 flex-shrink-0">
          <img src={logo} alt="Coldtech" className="w-8 h-8 rounded-lg object-cover" />
          <span className="font-black text-base" style={{ fontFamily: "var(--font-display)", color: "#0F172A" }}>
            Cold<span style={{ color: "#3AB6FF" }}>tech</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"}
              onClick={l.to === "/" ? handleHome : undefined}
              className={linkCls}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Link to="/cart" className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-[#3AB6FF] transition">
            <FiShoppingCart className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full text-[10px] font-black text-white px-1"
                style={{ background: "#3AB6FF" }}>
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>

          {/* Desktop auth */}
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center gap-2">
              {(user?.role === "admin" || user?.role === "staff") && (
                <Link to="/admin-coldtech-secure"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{ color:"#3AB6FF", border:"1px solid rgba(58,182,255,0.3)", background:"rgba(58,182,255,0.08)" }}>
                  Admin
                </Link>
              )}
              <Link to="/dashboard" className="px-3 py-1.5 rounded-lg text-sm text-slate-600 border border-slate-200 hover:border-[#3AB6FF] hover:text-[#3AB6FF] transition">
                Dashboard
              </Link>
              <button onClick={logout} className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-700 transition">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary hidden lg:inline-flex text-sm px-4 py-1.5">
              Login
            </Link>
          )}

          {/* Hamburger */}
          <button onClick={() => setOpen(v => !v)}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600">
            {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden bg-white border-t border-slate-100">
            <div className="px-4 py-3 flex flex-col gap-1">
              {LINKS.map(l => (
                <NavLink key={l.to} to={l.to} end={l.to === "/"}
                  onClick={l.to === "/" ? handleHome : () => setOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium transition ${
                      isActive ? "text-[#3AB6FF] bg-[rgba(58,182,255,0.08)]" : "text-slate-600 hover:bg-slate-50"
                    }`}>
                  {l.label}
                </NavLink>
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
                      className="px-4 py-3 rounded-xl text-sm text-slate-600 border border-slate-200 text-center">
                      Dashboard
                    </Link>
                    <button onClick={() => { logout(); setOpen(false); }}
                      className="px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition text-left">
                      Log out
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setOpen(false)}
                    className="btn-primary w-full text-center py-3 text-sm">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
