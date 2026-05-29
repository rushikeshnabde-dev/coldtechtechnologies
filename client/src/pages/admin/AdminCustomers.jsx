import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import { assetUrl } from "../../utils/imageUrl";
import {
  FiSearch, FiUsers, FiX, FiShoppingBag, FiTool,
  FiChevronLeft, FiChevronRight, FiMail, FiPhone, FiCalendar,
} from "react-icons/fi";

const fmt = n => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const STATUS_STYLE = {
  pending:    "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  shipped:    "bg-purple-500/15 text-purple-400 border-purple-500/30",
  delivered:  "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled:  "bg-red-500/15 text-red-400 border-red-500/30",
  received:   "bg-slate-500/15 text-slate-400 border-slate-500/30",
  diagnosing: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  repairing:  "bg-blue-500/15 text-blue-400 border-blue-500/30",
  completed:  "bg-green-500/15 text-green-400 border-green-500/30",
};

/* ── Customer Profile Modal ── */
function CustomerProfile({ customerId, onClose }) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]       = useState("orders");

  useEffect(() => {
    api.get(`/admin/customers/${customerId}`)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [customerId]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0D1220] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl mb-10">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="font-bold text-white">Customer Profile</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" />
          </div>
        ) : !data ? (
          <p className="px-6 py-8 text-slate-500">Failed to load profile.</p>
        ) : (
          <div className="p-6 space-y-6">
            {/* Customer info */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3AB6FF] to-[#2B0FA8] flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                {data.customer.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-lg">{data.customer.name}</h3>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><FiMail className="w-3 h-3" />{data.customer.email}</span>
                  {data.customer.phone && <span className="flex items-center gap-1"><FiPhone className="w-3 h-3" />{data.customer.phone}</span>}
                  <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3" />Joined {new Date(data.customer.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Orders", value: data.orders.length, color: "#3AB6FF" },
                { label: "Services", value: data.services.length, color: "#4FD1C5" },
                { label: "Total Spent", value: fmt(data.orders.reduce((s, o) => s + (o.totalAmount || 0), 0)), color: "#22C55E" },
              ].map(s => (
                <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="font-black text-lg" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
              {[["orders", "Orders"], ["services", "Service Tickets"]].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)}
                  className={"px-4 py-1.5 rounded-lg text-xs font-semibold transition " + (tab === id ? "bg-[#3AB6FF] text-white" : "text-slate-400 hover:text-white")}>
                  {label}
                </button>
              ))}
            </div>

            {/* Orders tab */}
            {tab === "orders" && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {data.orders.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center">No orders yet</p>
                ) : data.orders.map(o => (
                  <div key={o._id} className="flex items-center justify-between gap-3 bg-white/3 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-xs font-mono text-slate-400">#{o._id?.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
                    </div>
                    <span className="font-semibold text-white text-sm">{fmt(o.totalAmount)}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLE[o.status] || STATUS_STYLE.pending}`}>
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Services tab */}
            {tab === "services" && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {data.services.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center">No service tickets yet</p>
                ) : data.services.map(s => (
                  <div key={s._id} className="flex items-center justify-between gap-3 bg-white/3 rounded-xl px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-[#3AB6FF]">{s.ticketId}</p>
                      <p className="text-xs text-white truncate mt-0.5">{s.issueType} · {s.deviceType}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLE[s.status] || STATUS_STYLE.received}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Main AdminCustomers ── */
export function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const [total, setTotal]         = useState(0);
  const [pages, setPages]         = useState(1);
  const [profileId, setProfileId] = useState(null);
  const PER_PAGE = 20;

  const load = () => {
    setLoading(true);
    api.get("/admin/customers", { params: { page, limit: PER_PAGE, search: search || undefined } })
      .then(res => { setCustomers(res.data.customers || []); setTotal(res.data.total || 0); setPages(res.data.pages || 1); })
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, search]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>Customers</h1>
        <p className="text-sm text-slate-500 mt-1">{total} registered customers</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/8 bg-[#0D1220] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] transition" />
      </div>

      {/* Table */}
      <div className="bg-[#0D1220] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-white/5">
                <th className="px-5 py-3 text-left font-medium">Customer</th>
                <th className="px-5 py-3 text-left font-medium">Contact</th>
                <th className="px-5 py-3 text-left font-medium">Orders</th>
                <th className="px-5 py-3 text-left font-medium">Services</th>
                <th className="px-5 py-3 text-left font-medium">Total Spent</th>
                <th className="px-5 py-3 text-left font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array(6).fill(0).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 rounded bg-white/5 animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center">
                  <FiUsers className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-500">No customers found</p>
                </td></tr>
              ) : customers.map(c => (
                <tr key={c._id}
                  className="border-b border-white/5 hover:bg-white/2 transition cursor-pointer"
                  onClick={() => setProfileId(c._id)}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3AB6FF] to-[#2B0FA8] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {c.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-white">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-slate-400 text-xs">{c.email}</p>
                    {c.phone && <p className="text-slate-500 text-xs mt-0.5">{c.phone}</p>}
                  </td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1.5 text-slate-300 text-xs">
                      <FiShoppingBag className="w-3.5 h-3.5 text-[#3AB6FF]" /> {c.orderCount}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1.5 text-slate-300 text-xs">
                      <FiTool className="w-3.5 h-3.5 text-[#4FD1C5]" /> {c.serviceCount}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-white text-sm">{fmt(c.totalSpent)}</td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
            <p className="text-xs text-slate-500">Page {page} of {pages} · {total} customers</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition">
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition">
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {profileId && <CustomerProfile customerId={profileId} onClose={() => setProfileId(null)} />}
      </AnimatePresence>
    </div>
  );
}
