import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import { assetUrl } from "../../utils/imageUrl";
import {
  FiDollarSign, FiShoppingBag, FiTool, FiUsers,
  FiAlertTriangle, FiArrowRight, FiTrendingUp, FiBarChart2,
} from "react-icons/fi";

const fmt = n => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const STATUS_COLOR = {
  pending:    "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  shipped:    "bg-purple-500/15 text-purple-400 border-purple-500/30",
  delivered:  "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled:  "bg-red-500/15 text-red-400 border-red-500/30",
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

function BarChart({ data, valueKey, color, label }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <div className="flex items-end gap-1 h-20">
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
      <div className="flex gap-1">
        {data.map((d, i) => (
          <p key={i} className="flex-1 text-center text-[8px] text-slate-600 truncate">{d.label.split(" ")[0]}</p>
        ))}
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [stats, setStats]     = useState(null);
  const [orders, setOrders]   = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/stats").catch(() => ({ data: {} })),
      api.get("/admin/orders").catch(() => ({ data: { orders: [] } })),
      api.get("/products", { params: { limit: 100 } }).catch(() => ({ data: { products: [] } })),
    ]).then(([s, o, p]) => {
      setStats(s.data);
      setOrders((o.data.orders || []).slice(0, 5));
      setLowStock((p.data.products || []).filter(x => x.stock <= 5).slice(0, 6));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" />
    </div>
  );

  const salesChart   = stats?.salesChart   || [];
  const serviceChart = stats?.serviceChart || [];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back — here is what is happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={FiDollarSign}   label="Total Revenue"          value={fmt(stats?.revenue)}              sub="All time"        accent="#3AB6FF" delay={0} />
        <StatCard icon={FiShoppingBag}  label="Total Orders"           value={stats?.orders ?? 0}               sub="All time"        accent="#4FD1C5" delay={0.05} />
        <StatCard icon={FiTool}         label="Active Service Tickets" value={stats?.activeServiceRequests ?? 0} sub="Open tickets"   accent="#F59E0B" delay={0.1} />
        <StatCard icon={FiUsers}        label="Total Customers"        value={stats?.customers ?? 0}            sub="Registered"      accent="#A78BFA" delay={0.15} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly revenue */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-[#0D1220] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-bold text-white">Monthly Revenue</p>
              <p className="text-xs text-slate-500 mt-0.5">Last 12 months</p>
            </div>
            <FiTrendingUp className="w-5 h-5 text-[#3AB6FF]" />
          </div>
          {salesChart.length > 0 ? (
            <BarChart data={salesChart} valueKey="revenue" color="linear-gradient(180deg,#3AB6FF,#2B0FA8)" label="" />
          ) : (
            <p className="text-sm text-slate-500 py-8 text-center">No sales data yet</p>
          )}
        </motion.div>

        {/* Monthly services */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-[#0D1220] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-bold text-white">Service Tickets / Month</p>
              <p className="text-xs text-slate-500 mt-0.5">Last 12 months</p>
            </div>
            <FiBarChart2 className="w-5 h-5 text-[#4FD1C5]" />
          </div>
          {serviceChart.length > 0 ? (
            <BarChart data={serviceChart} valueKey="count" color="linear-gradient(180deg,#4FD1C5,#0EA5E9)" label="" />
          ) : (
            <p className="text-sm text-slate-500 py-8 text-center">No service data yet</p>
          )}
        </motion.div>
      </div>

      {/* Low stock */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-[#0D1220] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="font-bold text-white">Low Stock Alert</p>
          <Link to="/admin-coldtech-secure/products" className="text-xs text-[#3AB6FF] hover:underline flex items-center gap-1">
            View all <FiArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {lowStock.length === 0 ? (
          <p className="text-sm text-slate-500">All products well stocked</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStock.map(p => (
              <div key={p._id} className="flex items-center gap-3 bg-white/3 rounded-xl px-3 py-2.5">
                <img src={assetUrl(p.images?.[0])} alt="" className="w-9 h-9 rounded-lg object-cover bg-slate-800 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-500">{p.category}</p>
                </div>
                <span className={"text-xs font-bold px-2 py-0.5 rounded-full border " + (p.stock === 0 ? "bg-red-500/15 text-red-400 border-red-500/30" : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30")}>
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent orders */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="bg-[#0D1220] border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <p className="font-bold text-white">Recent Orders</p>
          <Link to="/admin-coldtech-secure/orders" className="text-xs text-[#3AB6FF] hover:underline flex items-center gap-1">
            View all <FiArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-white/5">
                  <th className="px-6 py-3 text-left font-medium">Order ID</th>
                  <th className="px-6 py-3 text-left font-medium">Customer</th>
                  <th className="px-6 py-3 text-left font-medium">Total</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} className="border-b border-white/5 hover:bg-white/2 transition">
                    <td className="px-6 py-3 font-mono text-xs text-slate-400">#{o._id?.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-3 text-slate-300">{o.user?.name || "Guest"}</td>
                    <td className="px-6 py-3 font-semibold text-white">{fmt(o.totalAmount)}</td>
                    <td className="px-6 py-3">
                      <span className={"text-xs font-semibold px-2 py-0.5 rounded-full border capitalize " + (STATUS_COLOR[o.status] || STATUS_COLOR.pending)}>
                        {o.status || "pending"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-500 text-xs">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
