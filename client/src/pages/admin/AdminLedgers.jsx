import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiBook, FiRefreshCw } from 'react-icons/fi';
import { accountingApi } from '../../services/api';

const inp = "w-full rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] focus:ring-1 focus:ring-[#3AB6FF]/30 transition";

function LedgerForm({ initial, onClose, onSaved }) {
  const isEdit = !!initial?._id;
  const [form, setForm] = useState(initial || { name: '', type: 'asset', description: '' });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (isEdit) {
        await accountingApi.updateLedger(initial._id, form);
        toast.success('Ledger updated');
      } else {
        await accountingApi.createLedger(form);
        toast.success('Ledger created');
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
          <p className="font-bold text-white">{isEdit ? 'Edit Ledger' : 'Add Ledger'}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Ledger Name <span className="text-red-400">*</span></label>
            <input className={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Rent Expense" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Type <span className="text-red-400">*</span></label>
            <select className={inp} value={form.type} onChange={e => set('type', e.target.value)}>
              <option value="asset">Asset</option>
              <option value="liability">Liability</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Description</label>
            <textarea className={`${inp} resize-none`} rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Optional notes" />
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

export function AdminLedgers() {
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await accountingApi.getLedgers({ type: typeFilter });
      setLedgers(data.ledgers || []);
    } catch (err) {
      toast.error('Failed to load ledgers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [typeFilter]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await accountingApi.seedLedgers();
      toast.success('Default ledgers seeded');
      load();
    } catch (err) {
      toast.error('Failed to seed');
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this ledger?')) return;
    try {
      await accountingApi.deleteLedger(id);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const typeColors = {
    asset:     'bg-green-500/15 text-green-400',
    liability: 'bg-red-500/15 text-red-400',
    income:    'bg-blue-500/15 text-blue-400',
    expense:   'bg-orange-500/15 text-orange-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Chart of Accounts (Ledgers)</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your accounting ledgers</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSeed} disabled={seeding}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-white/10 text-slate-400 hover:text-white transition">
            <FiRefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} /> Seed Defaults
          </button>
          <button onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition"
            style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
            <FiPlus className="w-4 h-4" /> Add Ledger
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <select className={inp + " w-48"} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="asset">Asset</option>
          <option value="liability">Liability</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" />
        </div>
      ) : ledgers.length === 0 ? (
        <div className="text-center py-20">
          <FiBook className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No ledgers found</p>
          <button onClick={handleSeed} className="mt-4 text-sm text-[#3AB6FF] hover:underline">
            Seed default ledgers
          </button>
        </div>
      ) : (
        <div className="bg-[#0D1220] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Type</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Balance</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Description</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ledgers.map(l => (
                  <tr key={l._id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3 text-sm text-white font-medium">
                      {l.name} {l.isDefault && <span className="text-xs text-yellow-400">⭐</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold ${typeColors[l.type]}`}>
                        {l.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-mono">
                      <span className={l.balance >= 0 ? 'text-green-400' : 'text-red-400'}>
                        ₹{l.balance?.toFixed(2) || '0.00'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">{l.description || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditing(l); setShowForm(true); }}
                          className="p-2 rounded-lg text-slate-400 hover:text-[#3AB6FF] hover:bg-[#3AB6FF]/10 transition">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        {!l.isDefault && (
                          <button onClick={() => handleDelete(l._id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
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
        {showForm && <LedgerForm initial={editing} onClose={() => setShowForm(false)} onSaved={load} />}
      </AnimatePresence>
    </div>
  );
}
