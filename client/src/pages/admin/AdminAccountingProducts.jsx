import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch, FiPackage } from 'react-icons/fi';
import { accountingApi } from '../../services/api';

const inp = "w-full rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] focus:ring-1 focus:ring-[#3AB6FF]/30 transition";

function ProductForm({ initial, onClose, onSaved }) {
  const isEdit = !!initial?._id;
  const [form, setForm] = useState(initial || { name: '', price: 0, hsnSac: '', gstPercent: 18 });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (isEdit) {
        await accountingApi.updateProduct(initial._id, form);
        toast.success('Product updated');
      } else {
        await accountingApi.createProduct(form);
        toast.success('Product created');
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
          <p className="font-bold text-white">{isEdit ? 'Edit Product' : 'Add Product'}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Product/Service Name <span className="text-red-400">*</span></label>
            <input className={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Laptop Repair" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Price (₹)</label>
              <input type="number" min="0" step="0.01" className={inp} value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">GST %</label>
              <select className={inp} value={form.gstPercent} onChange={e => set('gstPercent', e.target.value)}>
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">HSN/SAC Code</label>
            <input className={inp} value={form.hsnSac} onChange={e => set('hsnSac', e.target.value)} placeholder="e.g. 998314" />
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

export function AdminAccountingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await accountingApi.getProducts({ search });
      setProducts(data.products || []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await accountingApi.deleteProduct(id);
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
          <h1 className="text-2xl font-bold text-white">Products & Services</h1>
          <p className="text-sm text-slate-500 mt-1">Manage items for invoicing</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition"
          style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
          <FiPlus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input className={`${inp} pl-10`} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <FiPackage className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No products found</p>
        </div>
      ) : (
        <div className="bg-[#0D1220] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Name</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Price</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase">GST %</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">HSN/SAC</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map(p => (
                  <tr key={p._id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3 text-sm text-white font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-right font-mono text-green-400">₹{p.price?.toFixed(2) || '0.00'}</td>
                    <td className="px-4 py-3 text-sm text-center text-slate-400">{p.gstPercent}%</td>
                    <td className="px-4 py-3 text-sm text-slate-400 font-mono">{p.hsnSac || '—'}</td>
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
        {showForm && <ProductForm initial={editing} onClose={() => setShowForm(false)} onSaved={load} />}
      </AnimatePresence>
    </div>
  );
}
