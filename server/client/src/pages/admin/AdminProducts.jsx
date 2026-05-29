import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { api } from '../../services/api';
import { assetUrl } from '../../utils/imageUrl';
import {
  FiPlus, FiSearch, FiEdit2, FiTrash2, FiX, FiUpload,
  FiChevronLeft, FiChevronRight, FiPackage,
} from 'react-icons/fi';

const fmt = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

const EMPTY_FORM = {
  name: '', description: '', category: '', brand: 'Coldtech',
  costPrice: '', sellingPrice: '', stock: '', discount: '0',
  featured: false, condition: 'New', ram: '', storageType: '', processor: '',
};

const CATEGORIES = ['Laptops','Desktops','Monitors','Peripherals','Storage','Networking','Audio','Accessories','Components'];

function StockBadge({ stock }) {
  if (stock === 0) return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">Out of stock</span>;
  if (stock <= 5)  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">{stock} left</span>;
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">{stock} in stock</span>;
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#0D1220] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <p className="font-bold text-white mb-2">Are you sure?</p>
        <p className="text-sm text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white hover:border-white/20 transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition">Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProductFormModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const isEdit = !!initial?._id;

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === '_id' || k === 'images' || k === '__v' || k === 'createdAt' || k === 'updatedAt') return;
        fd.append(k, k === 'featured' ? (v ? 'true' : 'false') : v);
      });
      files.forEach(f => fd.append('images', f));
      if (isEdit) {
        await api.put(`/admin/products/${initial._id}`, fd);
        toast.success('Product updated');
      } else {
        await api.post('/admin/products', fd);
        toast.success('Product added');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const inp = "w-full rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] focus:ring-1 focus:ring-[#3AB6FF]/30 transition";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0D1220] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl mb-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="font-bold text-white">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
            <FiX className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 mb-1 block">Product Name *</label>
              <input required className={inp} placeholder="e.g. Dell Latitude 5520" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Category *</label>
              <select required className={inp} value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Brand</label>
              <input className={inp} placeholder="Brand" value={form.brand} onChange={e => set('brand', e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Cost Price (₹) *</label>
              <input required type="number" min="0" className={inp} placeholder="0" value={form.costPrice} onChange={e => set('costPrice', e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Selling Price (₹) *</label>
              <input required type="number" min="0" className={inp} placeholder="0" value={form.sellingPrice} onChange={e => set('sellingPrice', e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Stock *</label>
              <input required type="number" min="0" className={inp} placeholder="0" value={form.stock} onChange={e => set('stock', e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Discount %</label>
              <input type="number" min="0" max="100" className={inp} placeholder="0" value={form.discount} onChange={e => set('discount', e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Condition</label>
              <select className={inp} value={form.condition} onChange={e => set('condition', e.target.value)}>
                {['New','Refurbished','Used'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">RAM</label>
              <input className={inp} placeholder="e.g. 8GB" value={form.ram} onChange={e => set('ram', e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Storage Type</label>
              <select className={inp} value={form.storageType} onChange={e => set('storageType', e.target.value)}>
                <option value="">None</option>
                {['HDD','SSD','NVMe'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Processor</label>
              <input className={inp} placeholder="e.g. i5" value={form.processor} onChange={e => set('processor', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Description</label>
            <textarea rows={3} className={inp + ' resize-none'} placeholder="Product description…" value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          {/* Image upload */}
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Images</label>
            <div onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center cursor-pointer hover:border-[#3AB6FF]/40 transition">
              <FiUpload className="w-5 h-5 mx-auto mb-1 text-slate-500" />
              <p className="text-xs text-slate-500">{files.length > 0 ? `${files.length} file(s) selected` : 'Click to upload images'}</p>
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={e => setFiles(Array.from(e.target.files || []))} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-[#3AB6FF]" />
            <span className="text-sm text-slate-300">Featured product</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white transition">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60 transition"
              style={{ background: 'linear-gradient(135deg,#3AB6FF,#1E90FF)' }}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(0);
  const [pages, setPages]       = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const PER_PAGE = 10;

  const load = () => {
    setLoading(true);
    api.get('/products', { params: { page, limit: PER_PAGE, search: search || undefined, category: catFilter || undefined } })
      .then(res => { setProducts(res.data.products || []); setTotal(res.data.total || 0); setPages(res.data.pages || 1); })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, search, catFilter]);

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/products/${deleteId}`);
      toast.success('Product deleted');
      setDeleteId(null);
      load();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>Products</h1>
          <p className="text-sm text-slate-500 mt-1">{total} products total</p>
        </div>
        <button onClick={() => { setEditProduct(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition"
          style={{ background: 'linear-gradient(135deg,#3AB6FF,#1E90FF)' }}>
          <FiPlus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/8 bg-[#0D1220] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] transition" />
        </div>
        <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-white/8 bg-[#0D1220] px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-[#3AB6FF] transition">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#0D1220] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-white/5">
                <th className="px-5 py-3 text-left font-medium">Product</th>
                <th className="px-5 py-3 text-left font-medium">Category</th>
                <th className="px-5 py-3 text-left font-medium">Price</th>
                <th className="px-5 py-3 text-left font-medium">Stock</th>
                <th className="px-5 py-3 text-left font-medium">Condition</th>
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
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-16 text-center">
                  <FiPackage className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-500">No products found</p>
                </td></tr>
              ) : products.map(p => (
                <tr key={p._id} className="border-b border-white/5 hover:bg-white/2 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={assetUrl(p.images?.[0])} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-800 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate max-w-[180px]">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{p.category}</td>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-white">{fmt(p.sellingPrice)}</p>
                    {p.discount > 0 && <p className="text-xs text-slate-500 line-through">{fmt(p.costPrice)}</p>}
                  </td>
                  <td className="px-5 py-3"><StockBadge stock={p.stock} /></td>
                  <td className="px-5 py-3">
                    {p.condition && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                        p.condition === 'New' ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : p.condition === 'Refurbished' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      }`}>{p.condition}</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditProduct(p); setShowForm(true); }}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-[#3AB6FF] hover:bg-[#3AB6FF]/10 transition">
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(p._id)}
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

        {/* Pagination */}
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

      {/* Modals */}
      <AnimatePresence>
        {showForm && <ProductFormModal initial={editProduct} onClose={() => setShowForm(false)} onSaved={load} />}
        {deleteId && <ConfirmModal message="This will permanently delete the product." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      </AnimatePresence>
    </div>
  );
}
