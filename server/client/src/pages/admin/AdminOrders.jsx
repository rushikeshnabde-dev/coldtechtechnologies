import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "../../services/api";
import { assetUrl } from "../../utils/imageUrl";
import { FiSearch, FiEye, FiX, FiShoppingBag, FiChevronLeft, FiChevronRight, FiUserPlus } from "react-icons/fi";

const fmt = n => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const STATUS_STYLE = {
  pending:    "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  shipped:    "bg-purple-500/15 text-purple-400 border-purple-500/30",
  delivered:  "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled:  "bg-red-500/15 text-red-400 border-red-500/30",
};

function OrderDetailModal({ order, onClose }) {
  const items = order.products || order.items || [];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0D1220] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <p className="font-bold text-white">Order #{order._id?.slice(-6).toUpperCase()}</p>
            <p className="text-xs text-slate-500 mt-0.5">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
            <FiX className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Customer</p>
            <p className="text-sm font-semibold text-white">{order.user?.name || "Guest"}</p>
            <p className="text-xs text-slate-400">{order.user?.email}</p>
          </div>
          {order.address && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Shipping Address</p>
              <p className="text-sm text-slate-300">
                {[order.address.line1, order.address.city, order.address.state, order.address.zip, order.address.country].filter(Boolean).join(", ")}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Items</p>
            <div className="space-y-3">
              {items.map((item, i) => {
                const prod = item.product || item;
                const price = (item.price || prod.sellingPrice || 0) * (item.quantity || 1);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <img src={assetUrl(prod.images?.[0])} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-800 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{prod.name || "Product"}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-white">{fmt(price)}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border-t border-white/5 pt-4 flex justify-between">
            <p className="font-bold text-white">Total</p>
            <p className="font-black text-[#3AB6FF] text-lg">{fmt(order.totalAmount)}</p>
          </div>
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border capitalize ${STATUS_STYLE[order.status] || STATUS_STYLE.pending}`}>
            {order.status || "pending"}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function AdminOrders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage]       = useState(1);
  const [viewOrder, setViewOrder] = useState(null);
  const [staff, setStaff]     = useState([]);
  const PER_PAGE = 10;

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get("/admin/orders"),
      api.get("/admin/staff").catch(() => ({ data: { staff: [] } })),
    ])
      .then(([o, s]) => { setOrders(o.data.orders || []); setStaff(s.data.staff || []); })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      toast.success("Status updated");
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    } catch { toast.error("Update failed"); }
  };

  const assignStaff = async (orderId, staffId) => {
    try {
      await api.patch(`/admin/orders/${orderId}/assign`, { staffId: staffId || null });
      toast.success(staffId ? "Order assigned" : "Assignment removed");
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, assignedTo: staffId || null } : o));
    } catch { toast.error("Assign failed"); }
  };

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || o._id?.toLowerCase().includes(q)
      || o.user?.name?.toLowerCase().includes(q)
      || o.user?.email?.toLowerCase().includes(q);
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const pages = Math.ceil(filtered.length / PER_PAGE) || 1;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>Orders</h1>
        <p className="text-sm text-slate-500 mt-1">{filtered.length} orders</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by order ID, customer..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/8 bg-[#0D1220] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] transition" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-white/8 bg-[#0D1220] px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#3AB6FF] transition">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-[#0D1220] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-white/5">
                <th className="px-5 py-3 text-left font-medium">Order ID</th>
                <th className="px-5 py-3 text-left font-medium">Customer</th>
                <th className="px-5 py-3 text-left font-medium">Total</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Assigned To</th>
                <th className="px-5 py-3 text-left font-medium">Date</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array(6).fill(0).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 rounded bg-white/5 animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <FiShoppingBag className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                    <p className="text-slate-500">No orders found</p>
                  </td>
                </tr>
              ) : paginated.map(o => (
                <tr key={o._id} className="border-b border-white/5 hover:bg-white/2 transition">
                  <td className="px-5 py-3 font-mono text-xs text-slate-400">#{o._id?.slice(-6).toUpperCase()}</td>
                  <td className="px-5 py-3">
                    <p className="text-white font-medium">{o.user?.name || "Guest"}</p>
                    <p className="text-xs text-slate-500">{o.user?.email}</p>
                  </td>
                  <td className="px-5 py-3 font-semibold text-white">{fmt(o.totalAmount)}</td>
                  <td className="px-5 py-3">
                    <select value={o.status || "pending"} onChange={e => updateStatus(o._id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer bg-transparent capitalize focus:outline-none ${STATUS_STYLE[o.status] || STATUS_STYLE.pending}`}>
                      {STATUSES.map(s => (
                        <option key={s} value={s} className="bg-[#0D1220] text-white">{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={o.assignedTo?._id || o.assignedTo || ""}
                      onChange={e => assignStaff(o._id, e.target.value)}
                      className="text-xs rounded-lg border border-white/10 bg-[#0B0F1A] text-slate-300 px-2 py-1 focus:outline-none focus:border-[#3AB6FF] transition max-w-[130px]">
                      <option value="">Unassigned</option>
                      {staff.map(s => (
                        <option key={s._id} value={s._id} className="bg-[#0D1220]">{s.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setViewOrder(o)}
                      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-[#3AB6FF] hover:bg-[#3AB6FF]/10 transition ml-auto">
                      <FiEye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
            <p className="text-xs text-slate-500">Page {page} of {pages}</p>
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
        {viewOrder && <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />}
      </AnimatePresence>
    </div>
  );
}
