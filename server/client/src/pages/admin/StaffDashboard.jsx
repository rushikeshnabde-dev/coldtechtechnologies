import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FiShoppingBag, FiCheckCircle, FiClock, FiSearch } from 'react-icons/fi';

const fmt = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_STYLE = {
  pending:    'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  processing: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  shipped:    'bg-purple-500/15 text-purple-400 border-purple-500/30',
  delivered:  'bg-green-500/15 text-green-400 border-green-500/30',
  cancelled:  'bg-red-500/15 text-red-400 border-red-500/30',
};

function StatCard({ icon: Icon, label, value, accent, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="bg-[#0D1220] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: accent + '20' }}>
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-black text-white mt-0.5">{value}</p>
      </div>
    </motion.div>
  );
}

export function StaffDashboard() {
  const { user } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  const load = () => {
    setLoading(true);
    api.get('/staff/my-orders')
      .then(res => setOrders(res.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/staff/my-orders/${orderId}/status`, { status });
      toast.success('Status updated');
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    } catch { toast.error('Update failed'); }
  };

  const today = new Date().toDateString();
  const completed = orders.filter(o => o.status === 'delivered');
  const completedToday = completed.filter(o => new Date(o.completedAt || o.updatedAt).toDateString() === today);
  const pending = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    return !q || o._id?.toLowerCase().includes(q) || o.user?.name?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Welcome, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">Your assigned orders and tasks</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={FiShoppingBag}  label="Total Assigned"    value={orders.length}          accent="#3AB6FF" delay={0} />
        <StatCard icon={FiCheckCircle}  label="Completed Today"   value={completedToday.length}  accent="#22C55E" delay={0.05} />
        <StatCard icon={FiClock}        label="Pending Tasks"     value={pending.length}         accent="#F59E0B" delay={0.1} />
      </div>

      {/* Orders table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="font-bold text-white">Assigned Orders</p>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="pl-9 pr-3 py-2 rounded-xl border border-white/8 bg-[#0D1220] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] transition w-52" />
          </div>
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
                  <th className="px-5 py-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(4).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      {Array(5).fill(0).map((_, j) => (
                        <td key={j} className="px-5 py-4"><div className="h-4 rounded bg-white/5 animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-16 text-center">
                    <FiShoppingBag className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                    <p className="text-slate-500">No orders assigned to you yet</p>
                  </td></tr>
                ) : filtered.map(o => (
                  <tr key={o._id} className="border-b border-white/5 hover:bg-white/2 transition">
                    <td className="px-5 py-3 font-mono text-xs text-slate-400">#{o._id?.slice(-6).toUpperCase()}</td>
                    <td className="px-5 py-3">
                      <p className="text-white font-medium">{o.user?.name || 'Guest'}</p>
                      <p className="text-xs text-slate-500">{o.user?.email}</p>
                    </td>
                    <td className="px-5 py-3 font-semibold text-white">{fmt(o.totalAmount)}</td>
                    <td className="px-5 py-3">
                      <select value={o.status || 'pending'} onChange={e => updateStatus(o._id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer bg-transparent capitalize focus:outline-none ${STATUS_STYLE[o.status] || STATUS_STYLE.pending}`}>
                        {STATUSES.map(s => (
                          <option key={s} value={s} className="bg-[#0D1220] text-white">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
