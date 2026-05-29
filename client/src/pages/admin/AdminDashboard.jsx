// AdminDashboard - Coldtech Technologies

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import { assetUrl } from "../../utils/imageUrl";
import {
  FiDollarSign, FiShoppingBag, FiTool, FiUsers,
  FiArrowRight, FiTrendingUp, FiFileText, FiZap,
  FiArrowUpCircle, FiArrowDownCircle, FiPlusCircle,
} from "react-icons/fi";

const fmt = n =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

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

function StatCard({ icon: Icon, label, value, sub, accent, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="bg-[#0D1220] border border-white/5 rounded-2xl p-5 flex items-start gap-4 hover:border-white/10 transition">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: accent + "20" }}>
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-black text-white mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

function BarChart({ data, valueKey, color }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div>
      <div className="flex items-end gap-1 h-24">
        {data.map((d, i) => {
          const pct = (d[valueKey] / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${d.label}: ${d[valueKey]}`}>
              <motion.div
                initial={{ height: 0 }} animate={{ height: pct + "%" }}
                transition={{ duration: 0.5, delay: i * 0.03, ease: "easeOut" }}
                className="w-full rounded-t-sm min-h-[2px]"
                style={{ background: color }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-1 mt-1">
        {data.map((d, i) => (
          <p key={i} className="flex-1 text-center text-[8px] text-slate-600 truncate">{d.label.split(" ")[0]}</p>
        ))}
      </div>
    </div>
  );
}

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
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" />
    </div>
  );

  const salesChart   = stats?.salesChart   || [];
  const serviceChart = stats?.serviceChart || [];
  const revenue      = stats?.revenue || 0;
  const netProfit    = revenue - expenses.totalOutward;
  const pendingInvoices = invoices.filter(i => i.status === "draft" || i.status === "sent").length;

  // Recent transactions: mix of recent expenses + orders
  const recentTransactions = [
    ...recentExp.map(e => ({ ...e, _txType: "expense" })),
    ...orders.map(o => ({ ...o, _txType: "order" })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back — here is what is happening today.</p>
      </div>

      {/* Row 1: Core stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={FiDollarSign}  label="Total Revenue"          value={fmt(revenue)}                    sub="All time"       accent="#3AB6FF" delay={0} />
        <StatCard icon={FiShoppingBag} label="Total Orders"           value={stats?.orders ?? 0}              sub="All time"       accent="#4FD1C5" delay={0.04} />
        <StatCard icon={FiTool}        label="Active Tickets"         value={stats?.activeServiceRequests ?? 0} sub="Open"         accent="#F59E0B" delay={0.08} />
        <StatCard icon={FiUsers}       label="Total Customers"        value={stats?.customers ?? 0}           sub="Registered"     accent="#A78BFA" delay={0.12} />
      </div>

      {/* Row 2: Finance stats */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard icon={FiArrowUpCircle}   label="Total Expenses"    value={fmt(expenses.totalOutward)}  sub="Outward"        accent="#f87171" delay={0.16} />
        <StatCard icon={FiTrendingUp}      label="Net Profit"        value={fmt(netProfit)}              sub="Revenue - Exp"  accent={netProfit >= 0 ? "#4ade80" : "#f87171"} delay={0.2} />
        <StatCard icon={FiFileText}        label="Pending Invoices"  value={pendingInvoices}             sub="Draft + Sent"   accent="#FBBF24" delay={0.24} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="bg-[#0D1220] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-bold text-white">Monthly Revenue</p>
              <p className="text-xs text-slate-500 mt-0.5">Last 12 months</p>
            </div>
            <FiTrendingUp className="w-5 h-5 text-[#3AB6FF]" />
          </div>
          {salesChart.length > 0
            ? <BarChart data={salesChart} valueKey="revenue" color="linear-gradient(180deg,#3AB6FF,#2B0FA8)" />
            : <p className="text-sm text-slate-500 py-8 text-center">No sales data yet</p>}
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
          className="bg-[#0D1220] border border-white/5 rounded-2xl p-6">
          <p className="font-bold text-white mb-5">Quick Actions</p>
          <div className="grid grid-cols-1 gap-3">
            <Link to="/admin-coldtech-secure/invoices"
              className="flex items-center gap-3 p-4 rounded-xl border border-white/5 hover:border-[#3AB6FF]/30 hover:bg-[#3AB6FF]/5 transition group">
              <div className="w-10 h-10 rounded-xl bg-[#3AB6FF]/15 flex items-center justify-center flex-shrink-0">
                <FiFileText className="w-5 h-5 text-[#3AB6FF]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Create Invoice</p>
                <p className="text-xs text-slate-500">Generate a new customer invoice</p>
              </div>
              <FiArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#3AB6FF] transition" />
            </Link>
            <Link to="/admin-coldtech-secure/expenses"
              className="flex items-center gap-3 p-4 rounded-xl border border-white/5 hover:border-green-500/30 hover:bg-green-500/5 transition group">
              <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
                <FiPlusCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Add Expense</p>
                <p className="text-xs text-slate-500">Record income or expenditure</p>
              </div>
              <FiArrowRight className="w-4 h-4 text-slate-500 group-hover:text-green-400 transition" />
            </Link>
            <Link to="/admin-coldtech-secure/services"
              className="flex items-center gap-3 p-4 rounded-xl border border-white/5 hover:border-yellow-500/30 hover:bg-yellow-500/5 transition group">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center flex-shrink-0">
                <FiZap className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">New Service Request</p>
                <p className="text-xs text-slate-500">View open service tickets</p>
              </div>
              <FiArrowRight className="w-4 h-4 text-slate-500 group-hover:text-yellow-400 transition" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}
        className="bg-[#0D1220] border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <p className="font-bold text-white">Recent Transactions</p>
          <div className="flex gap-3">
            <Link to="/admin-coldtech-secure/expenses" className="text-xs text-[#3AB6FF] hover:underline flex items-center gap-1">
              Expenses <FiArrowRight className="w-3 h-3" />
            </Link>
            <Link to="/admin-coldtech-secure/orders" className="text-xs text-[#3AB6FF] hover:underline flex items-center gap-1">
              Orders <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
        {recentTransactions.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-500">No transactions yet.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {recentTransactions.map((tx, i) => (
              <div key={tx._id + i} className="flex items-center gap-4 px-6 py-3 hover:bg-white/2 transition">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  tx._txType === "expense"
                    ? tx.type === "inward" ? "bg-green-500/15" : "bg-red-500/15"
                    : "bg-[#3AB6FF]/15"
                }`}>
                  {tx._txType === "expense"
                    ? tx.type === "inward"
                      ? <FiArrowDownCircle className="w-4 h-4 text-green-400" />
                      : <FiArrowUpCircle className="w-4 h-4 text-red-400" />
                    : <FiShoppingBag className="w-4 h-4 text-[#3AB6FF]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {tx._txType === "expense"
                      ? `${tx.category} — ${tx.description || tx.type}`
                      : `Order #${tx._id?.slice(-6).toUpperCase()} — ${tx.user?.name || "Guest"}`
                    }
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(tx.createdAt).toLocaleDateString("en-IN")}
                    {tx._txType === "expense" && ` · ${tx.type}`}
                  </p>
                </div>
                <span className={`font-bold text-sm ${
                  tx._txType === "expense"
                    ? tx.type === "inward" ? "text-green-400" : "text-red-400"
                    : "text-white"
                }`}>
                  {tx._txType === "expense"
                    ? `${tx.type === "inward" ? "+" : "-"}${fmt(tx.amount)}`
                    : fmt(tx.totalAmount)
                  }
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Bottom row: Recent Invoices + Low Stock */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-[#0D1220] border border-white/5 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <p className="font-bold text-white">Recent Invoices</p>
            <Link to="/admin-coldtech-secure/invoices" className="text-xs text-[#3AB6FF] hover:underline flex items-center gap-1">
              View all <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {invoices.length === 0 ? (
            <p className="px-6 py-8 text-sm text-slate-500">No invoices yet.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {invoices.map(inv => (
                <div key={inv._id} className="flex items-center gap-3 px-6 py-3 hover:bg-white/2 transition">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#3AB6FF] font-mono">{inv.invoiceNumber}</p>
                    <p className="text-xs text-slate-400 truncate">{inv.customer?.name}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_COLOR[inv.status] || STATUS_COLOR.draft}`}>
                    {inv.status}
                  </span>
                  <span className="text-sm font-bold text-white ml-2">{fmt(inv.total)}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Low Stock */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}
          className="bg-[#0D1220] border border-white/5 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <p className="font-bold text-white">Low Stock Alert</p>
            <Link to="/admin-coldtech-secure/products" className="text-xs text-[#3AB6FF] hover:underline flex items-center gap-1">
              View all <FiArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="px-6 py-8 text-sm text-slate-500">All products well stocked.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {lowStock.map(p => (
                <div key={p._id} className="flex items-center gap-3 px-6 py-3 hover:bg-white/2 transition">
                  <img src={assetUrl(p.images?.[0])} alt="" className="w-9 h-9 rounded-lg object-cover bg-slate-800 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.category}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${p.stock === 0 ? "bg-red-500/15 text-red-400 border-red-500/30" : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"}`}>
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
