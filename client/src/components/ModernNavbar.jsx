import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, ChevronDown, Moon, Sun, Settings, User, HelpCircle, LogOut, Command } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ModernNavbar({ userName, userAvatar, isCollapsed }) {
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const notifications = [
    { id: 1, text: 'New order received', sub: 'Order #A4F2B1 from Rajesh Kumar', time: '5 mins ago', unread: true, color: '#3AB6FF' },
    { id: 2, text: 'Payment confirmed', sub: '₹12,500 received via UPI', time: '1 hour ago', unread: true, color: '#4ADE80' },
    { id: 3, text: 'Service ticket updated', sub: 'Ticket #ST0042 moved to Repairing', time: '2 hours ago', unread: false, color: '#F59E0B' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;
  const initials = userName?.[0]?.toUpperCase() || 'A';

  const leftOffset = isCollapsed ? 72 : 256;

  return (
    <motion.header
      animate={{ left: leftOffset }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 right-0 h-16 z-30"
      style={{
        background: 'rgba(6, 9, 23, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="h-full px-6 flex items-center justify-between gap-4">

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <motion.div
            animate={{ boxShadow: searchFocused ? '0 0 0 2px rgba(58,182,255,0.3), 0 4px 20px rgba(58,182,255,0.1)' : 'none' }}
            className="relative rounded-xl overflow-hidden transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${searchFocused ? 'rgba(58,182,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search orders, customers, products..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-10 pr-16 py-2.5 bg-transparent text-sm text-slate-300 placeholder-slate-600 focus:outline-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
              <kbd className="text-[10px] text-slate-600 px-1.5 py-0.5 rounded border border-slate-700 font-mono">⌘K</kbd>
            </div>
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">

          {/* Live Clock */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-500"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono tabular-nums">{time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2.5 rounded-xl text-slate-400 hover:text-white transition-all duration-200 hover:bg-white/5"
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            <AnimatePresence mode="wait">
              {theme === 'light' ? (
                <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="w-4.5 h-4.5" />
                </motion.div>
              ) : (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="w-4.5 h-4.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(v => !v); setShowProfileMenu(false); }}
              className="relative p-2.5 rounded-xl text-slate-400 hover:text-white transition-all duration-200 hover:bg-white/5"
            >
              <Bell className="w-4.5 h-4.5" />
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute top-1.5 right-1.5 w-4 h-4 text-[10px] font-bold flex items-center justify-center rounded-full text-white"
                    style={{ background: '#EF4444', boxShadow: '0 0 8px rgba(239,68,68,0.5)' }}
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-80 rounded-2xl z-50 overflow-hidden"
                    style={{ background: '#0C1429', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 48px rgba(0,0,0,0.5)' }}
                  >
                    <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <h3 className="font-bold text-white text-sm">Notifications</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(58,182,255,0.15)', color: '#3AB6FF' }}>
                        {unreadCount} new
                      </span>
                    </div>
                    <div>
                      {notifications.map((n, i) => (
                        <motion.div
                          key={n.id}
                          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="flex gap-3 px-5 py-3.5 cursor-pointer transition-colors hover:bg-white/3"
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        >
                          <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.unread ? n.color : 'transparent', border: `1px solid ${n.color}`, boxShadow: n.unread ? `0 0 6px ${n.color}` : 'none' }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white">{n.text}</p>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">{n.sub}</p>
                            <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{n.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="px-5 py-3 text-center">
                      <button className="text-xs font-semibold transition-colors" style={{ color: '#3AB6FF' }}>
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="w-px h-6 mx-1" style={{ background: 'rgba(255,255,255,0.08)' }} />

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { setShowProfileMenu(v => !v); setShowNotifications(false); }}
              className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-white/5"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #3AB6FF 0%, #6B48FF 100%)', boxShadow: '0 0 12px rgba(58,182,255,0.3)' }}>
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-white leading-tight">{userName || 'Admin'}</p>
                <p className="text-[11px] leading-tight" style={{ color: '#3AB6FF' }}>Administrator</p>
              </div>
              <motion.div animate={{ rotate: showProfileMenu ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </motion.div>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-56 rounded-2xl z-50 overflow-hidden"
                    style={{ background: '#0C1429', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 48px rgba(0,0,0,0.5)' }}
                  >
                    <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <p className="text-sm font-bold text-white">{userName}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#3AB6FF' }}>Administrator</p>
                    </div>
                    <div className="p-2">
                      {[
                        { icon: User, label: 'Profile Settings' },
                        { icon: Settings, label: 'Account Settings' },
                        { icon: HelpCircle, label: 'Help & Support' },
                      ].map(({ icon: Icon, label }) => (
                        <button key={label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-150">
                          <Icon className="w-4 h-4" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
