// AdminDashboard - Coldtech Technologies

import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";
import { api } from "../../services/api";
import { assetUrl } from "../../utils/imageUrl";
import {
  FiDollarSign, FiShoppingBag, FiTool, FiUsers,
  FiArrowRight, FiTrendingUp, FiFileText, FiZap,
  FiArrowUpCircle, FiArrowDownCircle, FiPlusCircle,
  FiActivity, FiPackage, FiAlertTriangle,
} from "react-icons/fi";

const fmt = n =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const fmtShort = n => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)}Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`;
  if (n >= 1e3) return `₹${(n / 1e3).toFixed(0)}K`;
  return `₹${n || 0}`;
};

const STATUS_COLOR = {
  pending:    "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  shipped:    "bg-purple-500/15 text-purple-400 border-purple-500/30",
  delivered:  "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled:  "bg-red-500/15 text-red-400 border-red-500/30",
  draft:      "bg-slate-500/15 text-slate-400 border-slate-500/30",
  sent:       "bg-blue-500/15 text-blue-400 border-blue-500/30",
  paid:       "bg-green-500/15 text-green-400 border-green-500/30",
};

// Animated counter hook
function useCounter(end, duration = 1.2) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!end) return;
    const controls = animate(0, end, {
      duration,
      ease: "easeOut",
      onUpdate: v => setVal(Math.round(v)),
    });
    return controls.stop;
  }, [end]);
  return val;
}

function StatCard({ icon: Icon, label, value, sub, accent, delay, isCurrency, prefix }) {
  const numValue = typeof value === "number" ? value : 0;
  const counted = useCounter(numValue, 1.2);
  const displayValue = isCurrency ? fmtShort(counted) : (prefix || "") + counted.toLocaleString("en-IN");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl p-5 group cursor-default"
      style={{
        background: 'linear-gradient(135deg, #0C1429 0%, #0A1020 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at top left, ${accent}10, transparent 60%)` }} />

      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}40, transparent)` }} />

      <div className="relative flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${accent}18`, boxShadow: `0 0 20px ${accent}15` }}>
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <motion.p key={displayValue} className="text-2xl font-black text-white mt-0.5 tabular-nums">
            {displayValue}
          </motion.p>
          {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
        </div>
      </div>
    </motion.div>
  );
}

function BarChart({ data, valueKey, color, gradientId }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div>
      <div className="flex items-end gap-1 h-28">
        {data.map((d, i) => {
          const pct = (d[valueKey] / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group" title={`${d.label}: ${d[valueKey]}`}>
              <motion.div
                initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
                className="w-full rounded-t-md min-h-[3px] origin-bottom relative overflow-hidden"
                style={{ height: `${Math.max(pct, 3)}%`, background: color }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: 'rgba(255,255,255,0.15)' }} />
              </motion.div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-1 mt-2">
        {data.map((d, i) => (
          <p key={i} className="flex-1 text-center text-[8px] text-slate-700 truncate">{d.label.split(" ")[0]}</p>
        ))}
      </div>
    </div>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] },
});

const CARD_STYLE = {
  background: 'linear-gradient(135deg, #0C1429 0%, #0A1020 100%)',
  border: '1px solid rgba(255,255,255,0.06)',
};

const QUICK_ACTIONS = [
  { to: "/admin-coldtech-secure/invoices", label: "Create Invoice", desc: "Generate a new customer invoice", icon: FiFileText, color: "#3AB6FF" },
  { to: "/admin-coldtech-secure/expenses", label: "Add Expense", desc: "Record income or expenditure", icon: FiPlusCircle, color: "#4ADE80" },
  { to: "/admin-coldtech-secure/services", label: "Service Tickets", desc: "View open service tickets", icon: FiZap, color: "#F59E0B" },
  { to: "/admin-coldtech-secure/customers", label: "Customers", desc: "Manage your customer base", icon: FiUsers, color: "#A78BFA" },
];

export function AdminDashboard() {
  const [stats, setStats]         = useState(null);
  const [orders, setOrders]       = useState([]);
  const [invoices, setInvoices]   = useState([]);
  const [expenses, setExpenses]   = useState({ totalInward: 0, totalOutward: 0, balance: 0 });
  const [lowStock, setLowStock]   = useState([]);
  const [recentExp, setRecentExp] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/stats").catch(() => ({ data: {} })),
      api.get("/admin/orders").catch(() => ({ data: { orders: [] } })),
      api.get("/products", { params: { limit: 100 } }).catch(() => ({ data: { products: [] } })),
      api.get("/invoices").catch(() => ({ data: { invoices: [] } })),
      api.get("/expenses/summary").catch(() => ({ data: { totalInward: 0, totalOutward: 0, balance: 0 } })),
      api.get("/expenses", { params: { limit: 5 } }).catch(() => ({ data: { expenses: [] } })),
    ]).then(([s, o, p, inv, expSum, expList]) => {
      setStats(s.data);
      setOrders((o.data.orders || []).slice(0, 5));
      setLowStock((p.data.products || []).filter(x => x.stock <= 5).slice(0, 6));
      setInvoices((inv.data.invoices || []).slice(0, 5));
      setExpenses(expSum.data);
      setRecentExp((expList.data.expenses || []).slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-80">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-[#3AB6FF]/20 border-t-[#3AB6FF] animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-purple-500/20 border-b-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        </div>
        <p className="text-sm text-slate-600">Loading dashboard data...</p>
      </div>
    </div>
  );

  const salesChart      = stats?.salesChart   || [];
  const serviceChart    = stats?.serviceChart || [];
  const revenue         = stats?.revenue || 0;
  const netProfit       = revenue - (expenses.totalOutward || 0);
  const pendingInvoices = invoices.filter(i => i.status === "draft" || i.status === "sent").length;

  const recentTransactions = [
    ...recentExp.map(e => ({ ...e, _txType: "expense" })),
    ...orders.map(o => ({ ...o, _txType: "order" })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-6 max-w-7xl">

      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Good morning 👋</h1>
          <p className="text-sm text-slate-500 mt-1">{today} — here's what's happening with your business.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
            style={{ background: 'rgba(58,182,255,0.1)', border: '1px solid rgba(58,182,255,0.2)', color: '#3AB6FF' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#3AB6FF] animate-pulse" />
            Live Dashboard
          </div>
        </div>
      </motion.div>

      {/* Core Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={FiDollarSign}  label="Total Revenue"     value={revenue}                      isCurrency sub="All time"     accent="#3AB6FF" delay={0.05} />
        <StatCard icon={FiShoppingBag} label="Total Orders"      value={stats?.orders ?? 0}           sub="All time"     accent="#4FD1C5" delay={0.1} />
        <StatCard icon={FiTool}        label="Active Tickets"    value={stats?.activeServiceRequests ?? 0} sub="Open"    accent="#F59E0B" delay={0.15} />
        <StatCard icon={FiUsers}       label="Total Customers"   value={stats?.customers ?? 0}        sub="Registered"   accent="#A78BFA" delay={0.2} />
      </div>

      {/* Finance Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard icon={FiArrowUpCircle} label="Total Expenses"  value={expenses.totalOutward} isCurrency sub="Outward"      accent="#F87171" delay={0.25} />
        <StatCard icon={FiTrendingUp}    label="Net Profit"      value={Math.abs(netProfit)}   isCurrency sub={netProfit >= 0 ? "Revenue − Expenses" : "Loss"} accent={netProfit >= 0 ? "#4ADE80" : "#F87171"} delay={0.3} />
        <StatCard icon={FiFileText}      label="Pending Invoices" value={pendingInvoices}                  sub="Draft + Sent"  accent="#FBBF24" delay={0.35} />
      </div>

      {/* Charts + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Revenue Chart */}
        <motion.div {...fadeUp(0.4)} className="xl:col-span-3 rounded-2xl p-6" style={CARD_STYLE}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-bold text-white">Monthly Revenue</p>
              <p className="text-xs text-slate-500 mt-0.5">Last 12 months · {fmtShort(revenue)} total</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3AB6FF]" />
              <span className="text-xs text-slate-500">Revenue</span>
            </div>
          </div>
          {salesChart.length > 0
            ? <BarChart data={salesChart} valueKey="revenue" color="linear-gradient(180deg, #3AB6FF 0%, #2B0FA8 100%)" />
            : (
              <div className="flex items-center justify-center h-28 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.06)' }}>
                <p className="text-sm text-slate-600">No sales data yet</p>
              </div>
            )
          }
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fadeUp(0.45)} className="xl:col-span-2 rounded-2xl p-6" style={CARD_STYLE}>
          <p className="font-bold text-white mb-4">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2.5">
            {QUICK_ACTIONS.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div key={a.to} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.05 }}>
                  <Link to={a.to}
                    className="flex flex-col gap-2 p-3.5 rounded-xl transition-all duration-200 group hover:scale-[1.03] block"
                    style={{ background: `${a.color}0A`, border: `1px solid ${a.color}20` }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                      style={{ background: `${a.color}20`, boxShadow: `0 0 12px ${a.color}15` }}>
                      <Icon className="w-4 h-4" style={{ color: a.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">{a.label}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">{a.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div {...fadeUp(0.5)} className="rounded-2xl overflow-hidden" style={CARD_STYLE}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2.5">
            <FiActivity className="w-4 h-4 text-[#3AB6FF]" />
            <p className="font-bold text-white">Recent Activity</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin-coldtech-secure/expenses" className="text-xs font-medium hover:text-white transition-colors flex items-center gap-1" style={{ color: '#3AB6FF' }}>
              Expenses <FiArrowRight className="w-3 h-3" />
            </Link>
            <Link to="/admin-coldtech-secure/orders" className="text-xs font-medium hover:text-white transition-colors flex items-center gap-1" style={{ color: '#3AB6FF' }}>
              Orders <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
        {recentTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <FiActivity className="w-8 h-8 text-slate-700" />
            <p className="text-sm text-slate-600">No recent transactions</p>
          </div>
        ) : (
          <div>
            {recentTransactions.map((tx, i) => {
              const isInward = tx._txType === "expense" && tx.type === "inward";
              const isOutward = tx._txType === "expense" && tx.type === "outward";
              const isOrder = tx._txType === "order";
              const amount = tx._txType === "expense" ? tx.amount : tx.totalAmount;
              const color = isInward ? "#4ADE80" : isOutward ? "#F87171" : "#3AB6FF";
              const icon = isInward ? FiArrowDownCircle : isOutward ? FiArrowUpCircle : FiShoppingBag;
              const Icon = icon;
              return (
                <motion.div
                  key={tx._id + i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + i * 0.05 }}
                  className="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-white/2"
                  style={{ borderBottom: i < recentTransactions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15`, boxShadow: `0 0 8px ${color}15` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {isOrder
                        ? `Order #${tx._id?.slice(-6).toUpperCase()} — ${tx.user?.name || "Guest"}`
                        : `${tx.category} — ${tx.description || tx.type}`}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      {tx._txType === "expense" && ` · ${tx.type}`}
                    </p>
                  </div>
                  <span className="font-bold text-sm" style={{ color }}>
                    {isInward ? "+" : isOutward ? "−" : ""}{fmt(amount)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Bottom: Invoices + Low Stock */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent Invoices */}
        <motion.div {...fadeUp(0.6)} className="rounded-2xl overflow-hidden" style={CARD_STYLE}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2.5">
              <FiFileText className="w-4 h-4 text-[#3AB6FF]" />
              <p className="font-bold text-white">Recent Invoices</p>
            </div>
            <Link to="/admin-coldtech-secure/invoices" className="text-xs font-medium hover:text-white transition-colors flex items-center gap-1" style={{ color: '#3AB6FF' }}>
              View all <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <FiFileText className="w-7 h-7 text-slate-700" />
              <p className="text-sm text-slate-600">No invoices yet</p>
            </div>
          ) : (
            <div>
              {invoices.map((inv, i) => (
                <motion.div
                  key={inv._id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.65 + i * 0.05 }}
                  className="flex items-center gap-3 px-6 py-3.5 hover:bg-white/2 transition-colors"
                  style={{ borderBottom: i < invoices.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold font-mono" style={{ color: '#3AB6FF' }}>{inv.invoiceNumber}</p>
                    <p className="text-xs text-slate-500 truncate">{inv.customer?.name}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_COLOR[inv.status] || STATUS_COLOR.draft}`}>
                    {inv.status}
                  </span>
                  <span className="text-sm font-bold text-white ml-1">{fmt(inv.total)}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Low Stock */}
        <motion.div {...fadeUp(0.65)} className="rounded-2xl overflow-hidden" style={CARD_STYLE}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2.5">
              <FiAlertTriangle className="w-4 h-4 text-yellow-400" />
              <p className="font-bold text-white">Low Stock Alert</p>
            </div>
            <Link to="/admin-coldtech-secure/products" className="text-xs font-medium hover:text-white transition-colors flex items-center gap-1" style={{ color: '#3AB6FF' }}>
              View all <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <FiPackage className="w-7 h-7 text-green-500/50" />
              <p className="text-sm text-slate-600">All products well stocked</p>
            </div>
          ) : (
            <div>
              {lowStock.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.05 }}
                  className="flex items-center gap-3 px-6 py-3.5 hover:bg-white/2 transition-colors"
                  style={{ borderBottom: i < lowStock.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 ring-1 ring-white/5">
                    <img src={assetUrl(p.images?.[0])} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.category}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${p.stock === 0 ? "bg-red-500/15 text-red-400 border-red-500/30" : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"}`}>
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
