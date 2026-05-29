import { useState } from 'react';
import { Link, NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import {
  FiGrid, FiPackage, FiShoppingBag, FiTool, FiUsers, FiZap, FiUserCheck,
  FiMenu, FiX, FiChevronLeft, FiLogOut, FiExternalLink, FiBookOpen, FiShield,
} from 'react-icons/fi';

const ADMIN_NAV = [
  { to: '/admin-coldtech-secure',           label: 'Dashboard',       icon: FiGrid,        end: true },
  { to: '/admin-coldtech-secure/customers', label: 'Customers',       icon: FiUserCheck },
  { to: '/admin-coldtech-secure/products',  label: 'Products',        icon: FiPackage },
  { to: '/admin-coldtech-secure/orders',    label: 'Orders',          icon: FiShoppingBag },
  { to: '/admin-coldtech-secure/services',  label: 'Service Tickets', icon: FiTool },
  { to: '/admin-coldtech-secure/staff',     label: 'Staff',           icon: FiUsers },
  { to: '/admin-coldtech-secure/offers',    label: 'Daily Offers',    icon: FiZap },
  { to: '/admin-coldtech-secure/blog',      label: 'Blog Posts',      icon: FiBookOpen },
  { to: '/admin-coldtech-secure/amc',       label: 'AMC Clients',     icon: FiShield },
];

const STAFF_NAV = [
  { to: '/admin-coldtech-secure', label: 'My Dashboard', icon: FiGrid, end: true },
];

// Routes staff are NOT allowed to access
const ADMIN_ONLY_PATHS = [
  '/admin-coldtech-secure/customers',
  '/admin-coldtech-secure/products',
  '/admin-coldtech-secure/orders',
  '/admin-coldtech-secure/services',
  '/admin-coldtech-secure/staff',
  '/admin-coldtech-secure/offers',
  '/admin-coldtech-secure/blog',
  '/admin-coldtech-secure/amc',
];

export function AdminLayout() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!['admin', 'staff'].includes(user?.role)) return <Navigate to="/" replace />;

  const isAdmin = user?.role === 'admin';

  // Block staff from admin-only routes
  if (!isAdmin && ADMIN_ONLY_PATHS.some(p => location.pathname.startsWith(p))) {
    return <Navigate to="/admin-coldtech-secure" replace />;
  }

  const NAV = isAdmin ? ADMIN_NAV : STAFF_NAV;
  const panelLabel = isAdmin ? 'Admin Panel' : 'Staff Panel';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <img src={logo} alt="Coldtech" className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
        <div>
          <p className="font-black text-white text-sm leading-none">Cold<span style={{ color:'#3AB6FF' }}>tech</span></p>
          <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest">{panelLabel}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[rgba(58,182,255,0.15)] text-[#3AB6FF] border border-[rgba(58,182,255,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }>
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <Link to="/" target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition">
          <FiExternalLink className="w-4 h-4" /> View Site
        </Link>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition">
          <FiLogOut className="w-4 h-4" /> Log Out
        </button>
        <div className="px-3 pt-2">
          <p className="text-xs text-slate-600 truncate">{user?.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 bg-[#0D1220] border-r border-white/5 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden">
            <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 h-full w-64 bg-[#0D1220] border-r border-white/5 z-50">
              <button onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white">
                <FiX className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#0B0F1A]/95 backdrop-blur border-b border-white/5 px-5 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
            <FiMenu className="w-4 h-4" />
          </button>
          <Link to="/" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition">
            <FiChevronLeft className="w-3.5 h-3.5" /> Back to site
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3AB6FF] to-[#2B0FA8] flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <span className="text-sm text-slate-400 hidden sm:block">{user?.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
