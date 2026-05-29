import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, ShoppingBag, FileText, Wrench, Package,
  CreditCard, BarChart3, Settings, Bell, Search, ChevronLeft,
  ChevronRight, LogOut, Plus, Zap, Command, Building2, X,
  Receipt, Layers, DollarSign, Tag, BookOpen, Image, Star,
  Briefcase, Calendar, HelpCircle, Shield, Menu, ArrowUpRight,
  Keyboard, LayoutGrid,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Core',
    items: [
      { id: 'dashboard',  label: 'Dashboard',    icon: LayoutDashboard, path: '/admin/premium-dashboard' },
      { id: 'analytics',  label: 'Analytics',    icon: BarChart3,       path: '/admin/reports' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { id: 'orders',     label: 'Orders',       icon: ShoppingBag,     path: '/admin/orders' },
      { id: 'products',   label: 'Products',     icon: Package,         path: '/admin/products' },
      { id: 'customers',  label: 'Customers',    icon: Users,           path: '/admin/customers' },
      { id: 'inventory',  label: 'Inventory',    icon: Layers,          path: '/admin/accounting-products' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { id: 'invoices',   label: 'Invoices',     icon: FileText,        path: '/admin/invoices' },
      { id: 'payments',   label: 'Payments',     icon: CreditCard,      path: '/admin/payments' },
      { id: 'expenses',   label: 'Expenses',     icon: Receipt,         path: '/admin/expenses' },
      { id: 'ledgers',    label: 'Ledgers',      icon: BookOpen,        path: '/admin/ledgers' },
      { id: 'parties',    label: 'Parties',      icon: Briefcase,       path: '/admin/parties' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { id: 'services',   label: 'Services',     icon: Wrench,          path: '/admin/services' },
      { id: 'staff',      label: 'Staff',        icon: Shield,          path: '/admin/staff' },
      { id: 'offers',     label: 'Offers',       icon: Tag,             path: '/admin/offers' },
    ],
  },
  {
    label: 'Content',
    items: [
      { id: 'blog',       label: 'Blog',         icon: BookOpen,        path: '/admin/blog' },
      { id: 'banners',    label: 'Banners',      icon: Image,           path: '/admin/banners' },
      { id: 'testimonials', label: 'Reviews',    icon: Star,            path: '/admin/testimonials' },
    ],
  },
];

const QUICK_ACTIONS = [
  { label: 'New Invoice',    icon: FileText,  path: '/admin/advanced-invoice', color: '#3B82F6' },
  { label: 'New Customer',   icon: Users,     path: '/admin/customers/new',    color: '#10B981' },
  { label: 'New Order',      icon: ShoppingBag, path: '/admin/orders/new',     color: '#F59E0B' },
  { label: 'New Expense',    icon: Receipt,   path: '/admin/expenses/new',     color: '#EF4444' },
  { label: 'Service Ticket', icon: Wrench,    path: '/admin/services/new',     color: '#8B5CF6' },
  { label: 'Add Stock',      icon: Package,   path: '/admin/accounting-products/new', color: '#06B6D4' },
  { label: 'View Reports',   icon: BarChart3, path: '/admin/reports',          color: '#F97316' },
  { label: 'Dashboard',      icon: LayoutDashboard, path: '/admin/premium-dashboard', color: '#6366F1' },
];

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = n => String(n).padStart(2, '0');
  const h = time.getHours(), m = time.getMinutes(), s = time.getSeconds();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const dateStr = time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  return (
    <div className="flex flex-col items-end">
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#F9FAFB', letterSpacing: '0.04em' }}>
        {pad(h12)}:{pad(m)}:{pad(s)} <span style={{ color: '#3B82F6', fontSize: '0.6875rem' }}>{ampm}</span>
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#6B7280' }}>{dateStr}</span>
    </div>
  );
}

function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const allItems = QUICK_ACTIONS.map(a => ({ ...a, type: 'action' })).concat(
    NAV_GROUPS.flatMap(g => g.items.map(i => ({ ...i, type: 'nav', color: '#9CA3AF' })))
  );

  const filtered = query.trim()
    ? allItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : QUICK_ACTIONS.map(a => ({ ...a, type: 'action' }));

  const handleSelect = useCallback((item) => {
    navigate(item.path);
    onClose();
  }, [navigate, onClose]);

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmd-palette-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className="cmd-palette-panel"
            initial={{ opacity: 0, scale: 0.95, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Search size={16} style={{ color: '#6B7280', flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search commands, pages, actions…"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: '#F9FAFB', fontSize: '0.9375rem', fontFamily: 'var(--font-body)',
                }}
              />
              <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '0.375rem', padding: '0.25rem 0.5rem', color: '#9CA3AF', cursor: 'pointer', fontSize: '0.75rem' }}>
                ESC
              </button>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '0.5rem' }}>
              {!query.trim() && (
                <p style={{ fontSize: '0.6875rem', color: '#4B5563', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.5rem 0.75rem 0.25rem' }}>
                  Quick Actions
                </p>
              )}
              {filtered.length === 0 && (
                <p style={{ color: '#6B7280', padding: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>No results for "{query}"</p>
              )}
              {filtered.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(item)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: 'none',
                    background: 'transparent', cursor: 'pointer', color: '#D1D5DB',
                    fontSize: '0.875rem', textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.12)'; e.currentTarget.style.color = '#F9FAFB'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#D1D5DB'; }}
                >
                  <span style={{
                    width: 32, height: 32, borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${item.color}18`, flexShrink: 0,
                  }}>
                    <item.icon size={15} style={{ color: item.color }} />
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <ArrowUpRight size={13} style={{ color: '#4B5563' }} />
                </button>
              ))}
            </div>
            <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem' }}>
              {[['↑↓', 'navigate'], ['↵', 'select'], ['esc', 'dismiss']].map(([key, action]) => (
                <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.6875rem', color: '#6B7280' }}>
                  <kbd style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.25rem', padding: '0.125rem 0.375rem', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#9CA3AF' }}>{key}</kbd>
                  {action}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function DashboardLayout({ children, title = 'Dashboard' }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const SIDEBAR_W = sidebarCollapsed ? 72 : 260;

  useEffect(() => {
    const handler = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(v => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const isActive = path => location.pathname === path || location.pathname.startsWith(path + '/');

  const SidebarInner = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: sidebarCollapsed ? '1.25rem 0' : '1.25rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '0.625rem', flexShrink: 0,
          background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 16px rgba(59,130,246,0.4)',
          margin: sidebarCollapsed ? '0 auto' : undefined,
        }}>
          <Zap size={18} color="#fff" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }}>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.01em', lineHeight: 1.2 }}>COLDTECH</div>
              <div style={{ fontSize: '0.625rem', color: '#6B7280', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Technologies</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav groups */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: sidebarCollapsed ? '0 0.5rem' : '0 0.75rem', paddingBottom: '1rem' }}>
        {NAV_GROUPS.map(group => (
          <div key={group.label} style={{ marginBottom: '0.25rem' }}>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ fontSize: '0.625rem', color: '#4B5563', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.875rem 0.75rem 0.375rem' }}
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            {sidebarCollapsed && <div style={{ height: '0.5rem' }} />}
            {group.items.map(item => {
              const active = isActive(item.path);
              return (
                <Link key={item.id} to={item.path} style={{ textDecoration: 'none', display: 'block', marginBottom: '2px' }}>
                  <motion.div
                    whileHover={{ x: sidebarCollapsed ? 0 : 2 }}
                    className={active ? 'sidebar-item-active sidebar-item-glow' : ''}
                    style={{
                      display: 'flex', alignItems: 'center',
                      gap: sidebarCollapsed ? 0 : '0.75rem',
                      padding: sidebarCollapsed ? '0.625rem 0' : '0.5rem 0.75rem',
                      borderRadius: '0.75rem',
                      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                      cursor: 'pointer',
                      color: active ? '#F9FAFB' : '#6B7280',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#D1D5DB'; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; } }}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-glow-pill"
                        style={{
                          position: 'absolute', inset: 0, borderRadius: '0.75rem',
                          background: 'rgba(59,130,246,0.1)',
                          boxShadow: 'inset 0 0 20px rgba(59,130,246,0.06)',
                        }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <item.icon
                      size={17}
                      style={{ color: active ? '#3B82F6' : 'inherit', flexShrink: 0, filter: active ? 'drop-shadow(0 0 6px rgba(59,130,246,0.6))' : undefined }}
                    />
                    <AnimatePresence>
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          style={{ fontSize: '0.8125rem', fontWeight: active ? 600 : 500, letterSpacing: '-0.01em', whiteSpace: 'nowrap', position: 'relative' }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom: settings + collapse */}
      <div style={{ padding: sidebarCollapsed ? '0.75rem 0.5rem' : '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Link to="/admin/settings" style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: sidebarCollapsed ? '0.625rem 0' : '0.5rem 0.75rem',
            borderRadius: '0.75rem', cursor: 'pointer', color: '#6B7280',
            justifyContent: sidebarCollapsed ? 'center' : undefined,
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#D1D5DB'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.background = 'transparent'; }}
          >
            <Settings size={17} />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontSize: '0.8125rem', fontWeight: 500 }}>Settings</motion.span>
              )}
            </AnimatePresence>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0F1C', backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.07), transparent 70%)' }}>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: SIDEBAR_W }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="admin-sidebar no-print"
        style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 40, overflow: 'hidden' }}
      >
        <SidebarInner />
        <button
          onClick={() => setSidebarCollapsed(v => !v)}
          style={{
            position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)',
            width: 24, height: 24, borderRadius: '50%',
            background: '#1F2937', border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#9CA3AF', zIndex: 41, transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#374151'; e.currentTarget.style.color = '#F9FAFB'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#1F2937'; e.currentTarget.style.color = '#9CA3AF'; }}
        >
          {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50 }}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="admin-sidebar"
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 260, zIndex: 51 }}
            >
              <SidebarInner />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <motion.div
        animate={{ marginLeft: SIDEBAR_W }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}
      >
        {/* Floating Top Navigation */}
        <div className="no-print" style={{ position: 'sticky', top: 16, zIndex: 30, padding: '0 1rem' }}>
          <div className="glass-nav-float" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.25rem' }}>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileSidebarOpen(v => !v)}
              style={{ display: 'none', background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '0.25rem' }}
              className="mobile-menu-btn"
            >
              <Menu size={20} />
            </button>

            {/* Page title */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#F9FAFB', letterSpacing: '-0.01em', margin: 0 }}>{title}</h1>
            </div>

            {/* Search bar (Cmd+K) */}
            <button
              onClick={() => setCmdOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                padding: '0.5rem 0.875rem', borderRadius: '0.625rem',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer', color: '#6B7280', transition: 'all 0.15s',
                minWidth: 200,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; e.currentTarget.style.background = 'rgba(59,130,246,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            >
              <Search size={14} />
              <span style={{ fontSize: '0.8125rem', flex: 1, textAlign: 'left' }}>Search…</span>
              <kbd style={{
                display: 'flex', alignItems: 'center', gap: '2px',
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.3rem', padding: '0.125rem 0.375rem',
                fontSize: '0.625rem', color: '#6B7280', fontFamily: 'var(--font-mono)',
              }}>
                <Command size={10} />K
              </kbd>
            </button>

            {/* Quick action */}
            <button
              className="btn-admin-primary"
              onClick={() => setCmdOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', whiteSpace: 'nowrap' }}
            >
              <Plus size={14} />
              <span style={{ fontSize: '0.8125rem' }}>New</span>
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotifOpen(v => !v)}
                style={{
                  width: 36, height: 36, borderRadius: '0.625rem',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#9CA3AF', position: 'relative',
                }}
              >
                <Bell size={16} />
                <span style={{
                  position: 'absolute', top: 6, right: 6, width: 7, height: 7,
                  background: '#EF4444', borderRadius: '50%', border: '1.5px solid #111827',
                }} />
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    style={{
                      position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
                      width: 320, background: 'rgba(17,24,39,0.97)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.875rem',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.6)', zIndex: 99,
                    }}
                  >
                    <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F9FAFB' }}>Notifications</span>
                      <button onClick={() => setNotifOpen(false)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}><X size={14} /></button>
                    </div>
                    {[
                      { text: 'Invoice #COLDTECH-2025-0042 overdue', sub: '3 hours ago', color: '#EF4444' },
                      { text: 'New service ticket: HP Laptop repair', sub: '5 hours ago', color: '#F59E0B' },
                      { text: 'Payment received ₹18,500 from Infosys', sub: '1 day ago', color: '#10B981' },
                    ].map((n, i) => (
                      <div key={i} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.color, marginTop: 4, flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: '0.8125rem', color: '#D1D5DB', margin: 0 }}>{n.text}</p>
                          <p style={{ fontSize: '0.6875rem', color: '#6B7280', margin: '2px 0 0', fontFamily: 'var(--font-mono)' }}>{n.sub}</p>
                        </div>
                      </div>
                    ))}
                    <div style={{ padding: '0.625rem 1rem' }}>
                      <button style={{ width: '100%', background: 'transparent', border: 'none', color: '#3B82F6', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 500 }}>View all notifications</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Company switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem', borderRadius: '0.625rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Building2 size={14} style={{ color: '#3B82F6' }} />
              <span style={{ fontSize: '0.8125rem', color: '#D1D5DB', fontWeight: 500 }}>COLDTECH HQ</span>
              <ChevronRight size={12} style={{ color: '#6B7280' }} />
            </div>

            {/* Clock */}
            <LiveClock />

            {/* Avatar */}
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700, color: '#fff',
              flexShrink: 0, boxShadow: '0 0 12px rgba(59,130,246,0.3)',
            }}>
              A
            </div>
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, padding: '1.5rem 1.5rem 2rem' }}>
          {children}
        </main>
      </motion.div>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
