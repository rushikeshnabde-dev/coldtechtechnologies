import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Wrench, Users, Zap,
  Image, MessageSquare, Camera, BookOpen, Shield, DollarSign,
  FileText, Book, CreditCard, BarChart3, ChevronLeft, ChevronRight,
  ExternalLink, LogOut, Sparkles, Settings,
} from 'lucide-react';
import logo from '../assets/logo.png';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { to: '/admin-coldtech-secure', label: 'Dashboard', icon: LayoutDashboard, end: true, color: '#3AB6FF' },
      { to: '/admin-coldtech-secure/customers', label: 'Customers', icon: Users, color: '#A78BFA' },
      { to: '/admin-coldtech-secure/products', label: 'Products', icon: Package, color: '#4FD1C5' },
      { to: '/admin-coldtech-secure/orders', label: 'Orders', icon: ShoppingCart, color: '#F59E0B' },
      { to: '/admin-coldtech-secure/services', label: 'Service Tickets', icon: Wrench, color: '#FB923C' },
    ],
  },
  {
    label: 'Management',
    items: [
      { to: '/admin-coldtech-secure/staff', label: 'Staff', icon: Users, color: '#34D399' },
      { to: '/admin-coldtech-secure/offers', label: 'Daily Offers', icon: Zap, color: '#FBBF24' },
      { to: '/admin-coldtech-secure/banners', label: 'Banners', icon: Image, color: '#60A5FA' },
      { to: '/admin-coldtech-secure/team', label: 'Team', icon: Users, color: '#C084FC' },
      { to: '/admin-coldtech-secure/testimonials', label: 'Testimonials', icon: MessageSquare, color: '#F472B6' },
      { to: '/admin-coldtech-secure/gallery', label: 'Work Gallery', icon: Camera, color: '#4ADE80' },
      { to: '/admin-coldtech-secure/blog', label: 'Blog Posts', icon: BookOpen, color: '#38BDF8' },
      { to: '/admin-coldtech-secure/ai-blog', label: 'AI Blog', icon: Sparkles, color: '#818CF8', badge: 'AI' },
      { to: '/admin-coldtech-secure/amc', label: 'AMC Clients', icon: Shield, color: '#6EE7B7' },
    ],
  },
  {
    label: 'Accounting',
    items: [
      { to: '/admin-coldtech-secure/expenses', label: 'Expenses', icon: DollarSign, color: '#F87171' },
      { to: '/admin-coldtech-secure/invoices', label: 'Invoices', icon: FileText, color: '#3AB6FF' },
      { to: '/admin-coldtech-secure/accounting/parties', label: 'Parties', icon: Users, color: '#A78BFA' },
      { to: '/admin-coldtech-secure/accounting/ledgers', label: 'Ledgers', icon: Book, color: '#4FD1C5' },
      { to: '/admin-coldtech-secure/accounting/products', label: 'Acc. Products', icon: Package, color: '#FB923C' },
      { to: '/admin-coldtech-secure/accounting/invoices', label: 'Acc. Invoices', icon: FileText, color: '#60A5FA' },
      { to: '/admin-coldtech-secure/accounting/payments', label: 'Payments', icon: CreditCard, color: '#34D399' },
      { to: '/admin-coldtech-secure/accounting/reports', label: 'Reports', icon: BarChart3, color: '#FBBF24' },
      { to: '/admin-coldtech-secure/invoice-preview', label: 'Invoice Template', icon: FileText, color: '#C084FC' },
    ],
  },
];

export function ModernSidebar({ isCollapsed, onToggle, onLogout, userEmail, isAdmin = true }) {
  const userName = userEmail?.split('@')[0] || 'Admin';

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen z-40 overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(180deg, #080D1E 0%, #060917 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div key="expanded" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }}
              className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-[#3AB6FF]/20 shadow-lg shadow-[#3AB6FF]/10">
                <img src={logo} alt="Coldtech" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white text-sm leading-tight">Coldtech</p>
                <p className="text-xs leading-tight" style={{ color: '#3AB6FF' }}>{isAdmin ? 'Admin Panel' : 'Staff Panel'}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="collapsed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="mx-auto">
              <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-[#3AB6FF]/20 shadow-lg shadow-[#3AB6FF]/10">
                <img src={logo} alt="Coldtech" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
        style={{ background: '#0D1524', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
      >
        <motion.div animate={{ rotate: isCollapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
          <ChevronRight className="w-3 h-3 text-slate-400" />
        </motion.div>
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
        {NAV_SECTIONS.map((section, sIdx) => {
          if (!isAdmin && section.label !== 'Overview') return null;
          return (
            <div key={sIdx} className="mb-5">
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2"
                    style={{ color: 'rgba(255,255,255,0.25)' }}
                  >
                    {section.label}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  if (!isAdmin && item.to !== '/admin-coldtech-secure') return null;
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      title={isCollapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 group
                        ${isCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                        ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.div
                              layoutId="activeNav"
                              className="absolute inset-0 rounded-xl"
                              style={{ background: `linear-gradient(135deg, ${item.color}18, ${item.color}08)`, border: `1px solid ${item.color}25` }}
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                          )}
                          <div className={`relative flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${isActive ? 'shadow-lg' : 'group-hover:scale-105'}`}
                            style={{
                              background: isActive ? `${item.color}20` : 'transparent',
                              boxShadow: isActive ? `0 0 12px ${item.color}30` : 'none',
                            }}>
                            <Icon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? item.color : 'currentColor' }} />
                          </div>
                          {!isCollapsed && (
                            <span className="relative flex-1 truncate">{item.label}</span>
                          )}
                          {!isCollapsed && item.badge && (
                            <span className="relative text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                              style={{ background: `${item.color}25`, color: item.color }}>
                              {item.badge}
                            </span>
                          )}
                          {isActive && !isCollapsed && (
                            <motion.div
                              layoutId="activeDot"
                              className="relative w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 flex-shrink-0 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
        <Link
          to="/"
          target="_blank"
          title={isCollapsed ? 'View Site' : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white transition-all duration-200 hover:bg-white/5 ${isCollapsed ? 'justify-center' : ''}`}
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>View Site</span>}
        </Link>
        <button
          onClick={onLogout}
          title={isCollapsed ? 'Log Out' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 transition-all duration-200 hover:bg-red-500/5 ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>Log Out</span>}
        </button>

        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-3 mx-1 p-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #3AB6FF, #6B48FF)' }}>
                {userName[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate capitalize">{userName}</p>
                <p className="text-[10px] truncate" style={{ color: '#3AB6FF' }}>{isAdmin ? 'Administrator' : 'Staff'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}
