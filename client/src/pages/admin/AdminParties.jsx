import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch, FiUsers } from 'react-icons/fi';
import { accountingApi } from '../../services/api';

const inp = "w-full rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] focus:ring-1 focus:ring-[#3AB6FF]/30 transition";

function PartyForm({ initial, onClose, onSaved }) {
  const isEdit = !!initial?._id;
  const [form, setForm] = useState(initial || { name: '', phone: '', email: '', address: '', gstin: '', type: 'customer' });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (isEdit) {
        await accountingApi.updateParty(initial._id, form);
        toast.success('Party updated');
      } else {
        await accountingApi.createParty(form);
        toast.success('Party created');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        className="bg-[#0D1220] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <p className="font-bold text-white">{isEdit ? 'Edit Party' : 'Add Party'}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Name <span className="text-red-400">*</span></label>
            <input className={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Party name" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Phone</label>
              <input className={inp} value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Email</label>
              <input type="email" className={inp} value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Address</label>
            <textarea className={`${inp} resize-none`} rows={2} value={form.address} onChange={e => set('address', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">GSTIN</label>
              <input className={inp} value={form.gstin} onChange={e => set('gstin', e.target.value)} placeholder="22AAAAA0000A1Z5" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Type</label>
              <select className={inp} value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white transition">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition"
              style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
              {saving ? 'Saving…' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function AdminParties() {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await accountingApi.getParties({ search, type: typeFilter });
      setParties(data.parties || []);
    } catch (err) {
      toast.error('Failed to load parties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search, typeFilter]);

  const handleDelete = async id => {
    if (!window.confirm('Delete this party?')) return;
    try {
      await accountingApi.deleteParty(id);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Parties (Customers & Vendors)</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your customers and vendors</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition"
          style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
          <FiPlus className="w-4 h-4" /> Add Party
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input className={`${inp} pl-10`} placeholder="Search parties..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className={inp + " w-40"} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" />
        </div>
      ) : parties.length === 0 ? (
        <div className="text-center py-20">
          <FiUsers className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No parties found</p>
        </div>
      ) : (
        <div className="bg-[#0D1220] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">GSTIN</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {parties.map(p => (
                  <tr key={p._id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3 text-sm text-white font-medium">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold ${
                        p.type === 'customer' ? 'bg-blue-500/15 text-blue-400' : 'bg-purple-500/15 text-purple-400'
                      }`}>
                        {p.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">{p.phone || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{p.email || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-400 font-mono">{p.gstin || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditing(p); setShowForm(true); }}
                          className="p-2 rounded-lg text-slate-400 hover:text-[#3AB6FF] hover:bg-[#3AB6FF]/10 transition">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p._id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showForm && <PartyForm initial={editing} onClose={() => setShowForm(false)} onSaved={load} />}
      </AnimatePresence>
    </div>
  );
}
