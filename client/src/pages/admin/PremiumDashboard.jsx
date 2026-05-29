import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart,
} from 'recharts';
import {
  Plus, FileText, Users, Receipt, Wrench, Package, BarChart3,
  TrendingUp, ArrowUpRight, MoreHorizontal, CheckCircle2, Clock,
  AlertCircle, RefreshCw, Zap, ChevronRight, Star, ExternalLink,
  ShoppingBag, DollarSign, Activity,
} from 'lucide-react';
import DashboardLayout from '../../components/admin/DashboardLayout';
import KPISection from '../../components/admin/KPISection';

/* ─── Chart Data ─── */
const REVENUE_DATA = [
  { month: 'Jan', revenue: 820000, profit: 230000, expenses: 590000 },
  { month: 'Feb', revenue: 1140000, profit: 320000, expenses: 820000 },
  { month: 'Mar', revenue: 980000, profit: 275000, expenses: 705000 },
  { month: 'Apr', revenue: 1520000, profit: 428000, expenses: 1092000 },
  { month: 'May', revenue: 1380000, profit: 385000, expenses: 995000 },
  { month: 'Jun', revenue: 1720000, profit: 490000, expenses: 1230000 },
  { month: 'Jul', revenue: 1960000, profit: 558000, expenses: 1402000 },
  { month: 'Aug', revenue: 2100000, profit: 612000, expenses: 1488000 },
  { month: 'Sep', revenue: 1840000, profit: 524000, expenses: 1316000 },
  { month: 'Oct', revenue: 2240000, profit: 648000, expenses: 1592000 },
  { month: 'Nov', revenue: 2420000, profit: 702000, expenses: 1718000 },
  { month: 'Dec', revenue: 2680000, profit: 778000, expenses: 1902000 },
];

const CUSTOMER_DATA = [
  { month: 'Jan', new: 42, returning: 120, churned: 8 },
  { month: 'Feb', new: 58, returning: 148, churned: 12 },
  { month: 'Mar', new: 51, returning: 162, churned: 7 },
  { month: 'Apr', new: 74, returning: 190, churned: 15 },
  { month: 'May', new: 68, returning: 204, churned: 9 },
  { month: 'Jun', new: 82, returning: 228, churned: 11 },
];

const TICKET_DATA = [
  { week: 'W1', opened: 28, closed: 24, pending: 12 },
  { week: 'W2', opened: 34, closed: 31, pending: 15 },
  { week: 'W3', opened: 22, closed: 26, pending: 11 },
  { week: 'W4', opened: 38, closed: 35, pending: 14 },
];

/* ─── Top Customers ─── */
const TOP_CUSTOMERS = [
  { name: 'Infosys Ltd', segment: 'Enterprise', ltv: '₹12,84,000', status: 'active', orders: 48, initials: 'IL', color: '#3B82F6' },
  { name: 'TCS Digital', segment: 'Enterprise', ltv: '₹9,42,500', status: 'active', orders: 36, initials: 'TD', color: '#8B5CF6' },
  { name: 'Wipro Tech', segment: 'Mid-market', ltv: '₹6,18,200', status: 'active', orders: 24, initials: 'WT', color: '#10B981' },
  { name: 'HCL Systems', segment: 'Mid-market', ltv: '₹4,92,000', status: 'inactive', orders: 18, initials: 'HS', color: '#F59E0B' },
  { name: 'Mphasis Corp', segment: 'SMB', ltv: '₹2,44,800', status: 'active', orders: 12, initials: 'MC', color: '#06B6D4' },
];

/* ─── Service Tickets ─── */
const SERVICE_TICKETS = [
  { id: 'SVC-0284', device: 'Dell OptiPlex 7090', issue: 'Motherboard failure', tech: 'Rahul K.', eta: '2h', progress: 75, status: 'in-progress', priority: 'high' },
  { id: 'SVC-0283', device: 'HP LaserJet Pro MFP', issue: 'Paper jam & roller', tech: 'Priya S.', eta: '30m', progress: 90, status: 'in-progress', priority: 'medium' },
  { id: 'SVC-0282', device: 'Lenovo ThinkPad E14', issue: 'Keyboard not responding', tech: 'Amit D.', eta: '4h', progress: 40, status: 'in-progress', priority: 'low' },
  { id: 'SVC-0281', device: 'Canon PIXMA G3070', issue: 'Print head clog', tech: 'Sneha P.', eta: '1h', progress: 60, status: 'in-progress', priority: 'medium' },
  { id: 'SVC-0280', device: 'Samsung 27" Monitor', issue: 'Backlight failure', tech: 'Rahul K.', eta: 'Done', progress: 100, status: 'completed', priority: 'low' },
];

/* ─── Inventory ─── */
const INVENTORY_ITEMS = [
  { name: 'Dell Laptops', sku: 'DELL-LAP-INS', stock: 4, reorder: 10, value: '₹3,20,000', trend: -18 },
  { name: 'HP Printers', sku: 'HP-PRN-LJ', stock: 2, reorder: 5, value: '₹84,000', trend: -40 },
  { name: 'Epson Cartridges', sku: 'EPS-CART-003', stock: 128, reorder: 50, value: '₹38,400', trend: +5 },
  { name: 'UPS 600VA', sku: 'UPS-600-APC', stock: 7, reorder: 15, value: '₹1,26,000', trend: -12 },
];

/* ─── Activity Feed ─── */
const ACTIVITY = [
  { type: 'payment', text: 'Payment ₹18,500 received from Infosys Ltd', time: '2 min', icon: DollarSign, color: '#10B981', meta: 'INV-0042' },
  { type: 'invoice', text: 'Invoice COLDTECH-2025-0042 generated', time: '14 min', icon: FileText, color: '#3B82F6', meta: 'Draft' },
  { type: 'ticket', text: 'Service ticket SVC-0284 opened – Dell OptiPlex', time: '1 hr', icon: Wrench, color: '#F59E0B', meta: 'High' },
  { type: 'customer', text: 'New customer Mphasis Corp onboarded', time: '2 hr', icon: Users, color: '#8B5CF6', meta: 'SMB' },
  { type: 'stock', text: 'Low stock alert: HP LaserJet (2 remaining)', time: '3 hr', icon: Package, color: '#EF4444', meta: 'Alert' },
  { type: 'order', text: 'Order #ORD-1924 dispatched to TCS Digital', time: '5 hr', icon: ShoppingBag, color: '#06B6D4', meta: 'Shipped' },
];

/* ─── Kanban ─── */
const KANBAN_INITIAL = {
  pending: [
    { id: 'k1', title: 'Deploy CRM module update', tag: 'Dev', priority: 'high', due: 'Jun 3' },
    { id: 'k2', title: 'Quarterly GST filing prep', tag: 'Finance', priority: 'medium', due: 'Jun 10' },
    { id: 'k3', title: 'Staff performance reviews', tag: 'HR', priority: 'low', due: 'Jun 15' },
  ],
  inProgress: [
    { id: 'k4', title: 'Infosys annual contract renewal', tag: 'Sales', priority: 'high', due: 'Jun 1' },
    { id: 'k5', title: 'Inventory audit Q2', tag: 'Ops', priority: 'medium', due: 'Jun 5' },
  ],
  review: [
    { id: 'k6', title: 'New invoice template rollout', tag: 'Finance', priority: 'medium', due: 'May 31' },
    { id: 'k7', title: 'Security audit report', tag: 'IT', priority: 'high', due: 'May 30' },
  ],
  completed: [
    { id: 'k8', title: 'WhatsApp integration testing', tag: 'Dev', priority: 'low', due: 'May 28' },
    { id: 'k9', title: 'May payroll processed', tag: 'HR', priority: 'medium', due: 'May 29' },
  ],
};

const KANBAN_COLS = [
  { key: 'pending',    label: 'Pending',     color: '#6B7280', count: 3 },
  { key: 'inProgress', label: 'In Progress', color: '#3B82F6', count: 2 },
  { key: 'review',     label: 'Review',      color: '#F59E0B', count: 2 },
  { key: 'completed',  label: 'Completed',   color: '#10B981', count: 2 },
];

const PRIORITY_STYLES = {
  high:   { bg: 'rgba(239,68,68,0.12)',   color: '#EF4444',  border: 'rgba(239,68,68,0.25)' },
  medium: { bg: 'rgba(245,158,11,0.12)',  color: '#F59E0B',  border: 'rgba(245,158,11,0.25)' },
  low:    { bg: 'rgba(107,114,128,0.12)', color: '#9CA3AF',  border: 'rgba(107,114,128,0.25)' },
};

const TAG_COLORS = {
  Dev: '#3B82F6', Finance: '#10B981', HR: '#8B5CF6',
  Sales: '#F97316', Ops: '#06B6D4', IT: '#EF4444',
};

/* ─── Custom Recharts Tooltip ─── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#111827', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '0.625rem', padding: '0.75rem 1rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
    }}>
      <p style={{ color: '#9CA3AF', marginBottom: '0.5rem', fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ color: '#D1D5DB' }}>{p.name}:</span>
          <span style={{ color: '#F9FAFB', fontWeight: 600 }}>
            {typeof p.value === 'number' && p.value > 10000
              ? `₹${(p.value / 100000).toFixed(2)}L`
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Section Header ─── */
function SectionHeader({ title, subtitle, action, actionLabel }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <div>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#F9FAFB', margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
        {subtitle && <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0.125rem 0 0' }}>{subtitle}</p>}
      </div>
      {action && (
        <Link to={action} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#3B82F6', textDecoration: 'none', fontWeight: 500 }}>
          {actionLabel || 'View all'} <ChevronRight size={13} />
        </Link>
      )}
    </div>
  );
}

/* ─── Card wrapper ─── */
function AdminCard({ children, style = {} }) {
  return (
    <div style={{
      background: 'rgba(31,41,55,0.6)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '1rem',
      padding: '1.25rem',
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── Chart tab selector ─── */
function ChartTabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', padding: '0.25rem' }}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          style={{
            padding: '0.3125rem 0.75rem', borderRadius: '0.375rem',
            border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
            background: active === tab.key ? 'rgba(59,130,246,0.2)' : 'transparent',
            color: active === tab.key ? '#3B82F6' : '#6B7280',
            transition: 'all 0.15s',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Quick Actions Float Bar ─── */
const QUICK_ACTION_ITEMS = [
  { label: 'Invoice', icon: FileText, color: '#3B82F6', path: '/admin/advanced-invoice' },
  { label: 'Customer', icon: Users, color: '#10B981', path: '/admin/customers' },
  { label: 'Expense', icon: Receipt, color: '#EF4444', path: '/admin/expenses' },
  { label: 'Ticket', icon: Wrench, color: '#F59E0B', path: '/admin/services' },
  { label: 'Stock', icon: Package, color: '#06B6D4', path: '/admin/accounting-products' },
];

function QuickActionsBar() {
  return (
    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
      {QUICK_ACTION_ITEMS.map((item, i) => (
        <Link key={i} to={item.path} style={{ textDecoration: 'none' }}>
          <motion.div
            whileHover={{ y: -2, boxShadow: `0 8px 24px ${item.color}30` }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 0.875rem', borderRadius: '0.625rem',
              background: `${item.color}12`,
              border: `1px solid ${item.color}25`,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            <item.icon size={14} style={{ color: item.color }} />
            <span style={{ fontSize: '0.8125rem', color: '#D1D5DB', fontWeight: 500 }}>+ {item.label}</span>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function PremiumDashboard() {
  const [chartTab, setChartTab] = useState('revenue');
  const [kanban, setKanban] = useState(KANBAN_INITIAL);
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const handleDragStart = useCallback((colKey, cardId) => {
    setDragging({ colKey, cardId });
  }, []);

  const handleDrop = useCallback((targetCol) => {
    if (!dragging || dragging.colKey === targetCol) { setDragging(null); setDragOver(null); return; }
    setKanban(prev => {
      const sourceItems = [...prev[dragging.colKey]];
      const idx = sourceItems.findIndex(c => c.id === dragging.cardId);
      if (idx === -1) return prev;
      const [card] = sourceItems.splice(idx, 1);
      return { ...prev, [dragging.colKey]: sourceItems, [targetCol]: [...prev[targetCol], card] };
    });
    setDragging(null);
    setDragOver(null);
  }, [dragging]);

  const fmt = n => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n / 1000).toFixed(0)}K`;

  return (
    <DashboardLayout title="Executive Dashboard">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Quick actions bar */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F9FAFB', margin: 0 }}>Good morning, Admin</h2>
              <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0.125rem 0 0', fontFamily: 'var(--font-mono)' }}>Here's what's happening with COLDTECH today.</p>
            </div>
            <QuickActionsBar />
          </div>
        </motion.div>

        {/* KPI Section */}
        <KPISection />

        {/* Analytics Panel */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          {/* Revenue / Profit chart */}
          <AdminCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#F9FAFB', margin: 0 }}>Revenue & Profit Analysis</h3>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '0.125rem 0 0' }}>12-month performance overview</p>
              </div>
              <ChartTabs
                tabs={[{ key: 'revenue', label: 'Revenue' }, { key: 'customers', label: 'Customers' }, { key: 'tickets', label: 'Tickets' }]}
                active={chartTab}
                onChange={setChartTab}
              />
            </div>

            <AnimatePresence mode="wait">
              {chartTab === 'revenue' && (
                <motion.div key="rev" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ResponsiveContainer width="100%" height={260}>
                    <ComposedChart data={REVENUE_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={v => fmt(v)} tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} width={48} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#9CA3AF', paddingTop: '0.5rem' }} />
                      <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#gradRev)" dot={false} activeDot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }} />
                      <Area type="monotone" dataKey="profit" name="Profit" stroke="#10B981" strokeWidth={2} fill="url(#gradProfit)" dot={false} activeDot={{ r: 4, fill: '#10B981', strokeWidth: 0 }} />
                      <Bar dataKey="expenses" name="Expenses" fill="rgba(239,68,68,0.2)" radius={[3, 3, 0, 0]} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
              {chartTab === 'customers' && (
                <motion.div key="cust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={CUSTOMER_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} width={32} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#9CA3AF', paddingTop: '0.5rem' }} />
                      <Bar dataKey="new" name="New" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="returning" name="Returning" fill="#10B981" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="churned" name="Churned" fill="#EF4444" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
              {chartTab === 'tickets' && (
                <motion.div key="tick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={TICKET_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="week" tick={{ fill: '#6B7280', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6B7280', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} width={32} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#9CA3AF', paddingTop: '0.5rem' }} />
                      <Line type="monotone" dataKey="opened" name="Opened" stroke="#EF4444" strokeWidth={2} dot={{ r: 4, fill: '#EF4444', strokeWidth: 0 }} />
                      <Line type="monotone" dataKey="closed" name="Closed" stroke="#10B981" strokeWidth={2} dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }} />
                      <Line type="monotone" dataKey="pending" name="Pending" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4, fill: '#F59E0B', strokeWidth: 0 }} strokeDasharray="5 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
            </AnimatePresence>
          </AdminCard>

          {/* Activity Feed */}
          <AdminCard style={{ display: 'flex', flexDirection: 'column' }}>
            <SectionHeader title="Live Activity" subtitle="Real-time ops stream" action="/admin/ledgers" actionLabel="Ledger" />
            <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
              <div className="timeline-line" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {ACTIVITY.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{ display: 'flex', gap: '0.875rem', padding: '0.75rem 0', paddingLeft: '0.25rem', position: 'relative' }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: `${item.color}18`,
                      border: `1px solid ${item.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 1,
                    }}>
                      <item.icon size={13} style={{ color: item.color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.75rem', color: '#D1D5DB', margin: 0, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.text}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.125rem' }}>
                        <span style={{ fontSize: '0.625rem', color: '#4B5563', fontFamily: 'var(--font-mono)' }}>{item.time}</span>
                        <span style={{ fontSize: '0.6rem', color: item.color, background: `${item.color}15`, padding: '0.0625rem 0.375rem', borderRadius: '9999px', fontWeight: 600 }}>{item.meta}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Operational Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>

          {/* Top Customers */}
          <AdminCard>
            <SectionHeader title="Top Customers" subtitle="By lifetime value" action="/admin/customers" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {TOP_CUSTOMERS.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: i < TOP_CUSTOMERS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : undefined }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${c.color}20`, border: `1px solid ${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, color: c.color, flexShrink: 0 }}>
                    {c.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8125rem', color: '#E5E7EB', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                    <p style={{ fontSize: '0.6875rem', color: '#6B7280', margin: 0 }}>{c.segment} · {c.orders} orders</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: '#F9FAFB', fontWeight: 600, margin: 0 }}>{c.ltv}</p>
                    <span style={{ fontSize: '0.625rem', padding: '0.0625rem 0.375rem', borderRadius: '9999px', background: c.status === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(107,114,128,0.12)', color: c.status === 'active' ? '#10B981' : '#9CA3AF', fontWeight: 600 }}>
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Service Repair Grid */}
          <AdminCard>
            <SectionHeader title="Repair Tracker" subtitle="Active service units" action="/admin/services" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {SERVICE_TICKETS.map((t, i) => (
                <div key={i} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.625rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#3B82F6', fontWeight: 600 }}>{t.id}</span>
                      <p style={{ fontSize: '0.75rem', color: '#E5E7EB', margin: '0.125rem 0 0', fontWeight: 500 }}>{t.device}</p>
                    </div>
                    <span style={{
                      fontSize: '0.6rem', fontWeight: 700, padding: '0.125rem 0.375rem', borderRadius: '0.25rem', height: 'fit-content',
                      background: PRIORITY_STYLES[t.priority].bg, color: PRIORITY_STYLES[t.priority].color,
                      border: `1px solid ${PRIORITY_STYLES[t.priority].border}`, textTransform: 'uppercase',
                    }}>
                      {t.priority}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.6875rem', color: '#6B7280', margin: '0 0 0.5rem' }}>{t.issue}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${t.progress}%`, background: t.progress === 100 ? '#10B981' : '#3B82F6', borderRadius: '9999px', transition: 'width 0.5s ease' }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: '#9CA3AF', flexShrink: 0 }}>{t.progress}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#6B7280' }}>
                    <span>{t.tech}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: t.eta === 'Done' ? '#10B981' : '#F59E0B' }}>ETA: {t.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Inventory Matrix */}
          <AdminCard>
            <SectionHeader title="Inventory Matrix" subtitle="Low-stock critical items" action="/admin/accounting-products" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1rem' }}>
              {INVENTORY_ITEMS.map((item, i) => (
                <div key={i} style={{ padding: '0.625rem 0.75rem', background: item.stock < item.reorder ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', border: item.stock < item.reorder ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#E5E7EB', fontWeight: 500 }}>{item.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: item.stock < item.reorder ? '#EF4444' : '#10B981', fontWeight: 700 }}>
                      {item.stock} left
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#6B7280' }}>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{item.sku}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#9CA3AF' }}>{item.value}</span>
                  </div>
                  <div style={{ marginTop: '0.375rem', height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, (item.stock / (item.reorder * 2)) * 100)}%`,
                      background: item.stock < item.reorder ? '#EF4444' : '#10B981',
                      borderRadius: '9999px',
                    }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { label: 'Total SKUs', value: '248', color: '#3B82F6' },
                { label: 'Low Stock', value: '12', color: '#EF4444' },
                { label: 'Total Value', value: '₹12.9L', color: '#10B981' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
                  <p style={{ fontSize: '0.625rem', color: '#6B7280', margin: '0.125rem 0 0' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        {/* Kanban Board */}
        <AdminCard style={{ padding: '1.25rem' }}>
          <SectionHeader title="Project Canvas" subtitle="Drag and drop to update status" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem', marginTop: '0.25rem' }}>
            {KANBAN_COLS.map(col => (
              <div
                key={col.key}
                onDragOver={e => { e.preventDefault(); setDragOver(col.key); }}
                onDrop={() => handleDrop(col.key)}
                onDragLeave={() => setDragOver(null)}
                style={{
                  background: dragOver === col.key ? `${col.color}08` : 'rgba(17,24,39,0.5)',
                  border: `1px solid ${dragOver === col.key ? col.color + '40' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: '0.875rem',
                  padding: '0.875rem',
                  minHeight: 300,
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D1D5DB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{col.label}</span>
                  </div>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: col.color, background: `${col.color}15`, padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>
                    {kanban[col.key].length}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {kanban[col.key].map(card => (
                    <motion.div
                      key={card.id}
                      layout
                      draggable
                      onDragStart={() => handleDragStart(col.key, card.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        background: 'rgba(31,41,55,0.8)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '0.625rem',
                        padding: '0.75rem',
                        cursor: 'grab',
                        transition: 'border-color 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px', background: `${TAG_COLORS[card.tag] || '#6B7280'}18`, color: TAG_COLORS[card.tag] || '#9CA3AF', border: `1px solid ${TAG_COLORS[card.tag] || '#6B7280'}25` }}>
                          {card.tag}
                        </span>
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '9999px', background: PRIORITY_STYLES[card.priority].bg, color: PRIORITY_STYLES[card.priority].color, border: `1px solid ${PRIORITY_STYLES[card.priority].border}` }}>
                          {card.priority}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: '#E5E7EB', margin: 0, fontWeight: 500, lineHeight: 1.4 }}>{card.title}</p>
                      <p style={{ fontSize: '0.6875rem', color: '#6B7280', margin: '0.375rem 0 0', fontFamily: 'var(--font-mono)' }}>Due {card.due}</p>
                    </motion.div>
                  ))}
                  <button
                    style={{
                      width: '100%', padding: '0.5rem', border: '1px dashed rgba(255,255,255,0.08)',
                      background: 'transparent', borderRadius: '0.5rem', color: '#4B5563',
                      fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; e.currentTarget.style.color = '#3B82F6'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#4B5563'; }}
                  >
                    <Plus size={12} /> Add task
                  </button>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

      </div>
    </DashboardLayout>
  );
}
