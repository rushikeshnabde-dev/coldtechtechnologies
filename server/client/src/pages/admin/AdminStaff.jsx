import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiUsers,
  FiSearch, FiCheckCircle, FiClock, FiZap,
} from 'react-icons/fi';

const EMPTY_FORM = { name: '', email: '', password: '' };

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="bg-[#0D1220] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <p className="font-bold text-white mb-2">Confirm Delete</p>
        <p className="text-sm text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition">Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StaffFormModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial ? { name: initial.name, email: initial.email, password: '' } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const isEdit = !!initial?._id;
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const inp = "w-full rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] focus:ring-1 focus:ring-[#3AB6FF]/30 transition";

  const submit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        const payload = { name: form.name, email: form.email };
        if (form.password) payload.password = form.password;
        await api.put(`/admin/staff/${initial._id}`, payload);
        toast.success('Staff updated');
      } else {
        await api.post('/admin/staff', form);
        toast.success('Staff member added');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0D1220] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="font-bold text-white">{isEdit ? 'Edit Staff Member' : 'Add Staff Member'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
            <FiX className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Full Name *</label>
            <input required className={inp} placeholder="Jane Doe" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Email *</label>
            <input required type="email" className={inp} placeholder="jane@coldtech.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">{isEdit ? 'New Password (leave blank to keep)' : 'Password *'}</label>
            <input type="password" required={!isEdit} minLength={6} className={inp} placeholder="Min. 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white transition">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60 transition"
              style={{ background: 'linear-gradient(135deg,#3AB6FF,#1E90FF)' }}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Staff'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function PerformanceCard({ member }) {
  return (
    <div className="bg-[#0D1220] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3AB6FF] to-[#2B0FA8] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {member.name?.[0]?.toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-white truncate">{member.name}</p>
          <p className="text-xs text-slate-500 truncate">{member.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <FiCheckCircle className="w-3.5 h-3.5 text-green-400" />
          </div>
          <p className="text-lg font-black text-green-400">{member.completed}</p>
          <p className="text-[10px] text-slate-500">Completed</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <FiClock className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <p className="text-lg font-black text-yellow-400">{member.pending}</p>
          <p className="text-[10px] text-slate-500">Pending</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <FiZap className="w-3.5 h-3.5 text-[#3AB6FF]" />
          </div>
          <p className="text-lg font-black text-[#3AB6FF]">{member.avgHours}h</p>
          <p className="text-[10px] text-slate-500">Avg time</p>
        </div>
      </div>
    </div>
  );
}

export function AdminStaff() {
  const [staff, setStaff]           = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [deleteId, setDeleteId]     = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get('/admin/staff').catch(() => ({ data: { staff: [] } })),
      api.get('/admin/staff/performance').catch(() => ({ data: { performance: [] } })),
    ]).then(([s, p]) => {
      setStaff(s.data.staff || []);
      setPerformance(p.data.performance || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/staff/${deleteId}`);
      toast.success('Staff member removed');
      setDeleteId(null);
      load();
    } catch { toast.error('Delete failed'); }
  };

  const filtered = staff.filter(s => {
    const q = search.toLowerCase();
    return !q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>Staff Management</h1>
          <p className="text-sm text-slate-500 mt-1">{staff.length} staff members</p>
        </div>
        <button onClick={() => { setEditMember(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition"
          style={{ background: 'linear-gradient(135deg,#3AB6FF,#1E90FF)' }}>
          <FiPlus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      {/* Performance cards */}
      {performance.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4">Staff Performance</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {performance.map(m => <PerformanceCard key={m._id} member={m} />)}
          </div>
        </div>
      )}

      {/* Staff table */}
      <div>
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-48">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search staff..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/8 bg-[#0D1220] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] transition" />
          </div>
        </div>

        <div className="bg-[#0D1220] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-white/5">
                  <th className="px-5 py-3 text-left font-medium">Staff Member</th>
                  <th className="px-5 py-3 text-left font-medium">Email</th>
                  <th className="px-5 py-3 text-left font-medium">Joined</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      {Array(4).fill(0).map((_, j) => (
                        <td key={j} className="px-5 py-4"><div className="h-4 rounded bg-white/5 animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-16 text-center">
                    <FiUsers className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                    <p className="text-slate-500">No staff members yet</p>
                  </td></tr>
                ) : filtered.map(s => (
                  <tr key={s._id} className="border-b border-white/5 hover:bg-white/2 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3AB6FF] to-[#2B0FA8] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {s.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-white">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-400">{s.email}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{new Date(s.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditMember(s); setShowForm(true); }}
                          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-[#3AB6FF] hover:bg-[#3AB6FF]/10 transition">
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteId(s._id)}
                          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition">
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showForm && <StaffFormModal initial={editMember} onClose={() => setShowForm(false)} onSaved={load} />}
        {deleteId && <ConfirmModal message="This will permanently remove the staff member." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      </AnimatePresence>
    </div>
  );
}
