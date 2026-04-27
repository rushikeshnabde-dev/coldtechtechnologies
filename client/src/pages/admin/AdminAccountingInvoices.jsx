import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch, FiFileText, FiEye, FiXCircle } from 'react-icons/fi';
import { accountingApi } from '../../services/api';

const inp = "w-full rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] focus:ring-1 focus:ring-[#3AB6FF]/30 transition";

const EMPTY_ITEM = { productId: null, name: '', hsnSac: '', qty: 1, rate: 0, gstPercent: 18 };

function InvoiceForm({ initial, onClose, onSaved }) {
  const isEdit = !!initial?._id;
  const [parties, setParties] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initial || {
    partyId: '',
    date: new Date().toISOString().slice(0, 10),
    dueDate: '',
    gstType: 'intra',
    items: [{ ...EMPTY_ITEM }],
    notes: '',
    status: 'draft',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    accountingApi.getParties({ type: 'customer' }).then(r => setParties(r.data.parties || []));
    accountingApi.getProducts().then(r => setProducts(r.data.products || []));
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setItem = (idx, k, v) => {
    const updated = [...form.items];
    updated[idx] = { ...updated[idx], [k]: v };
    // If product selected, auto-fill
    if (k === 'productId' && v) {
      const prod = products.find(p => p._id === v);
      if (prod) {
        updated[idx] = { ...updated[idx], name: prod.name, rate: prod.price, hsnSac: prod.hsnSac, gstPercent: prod.gstPercent };
      }
    }
    setForm(p => ({ ...p, items: updated }));
  };

  const addItem = () => setForm(p => ({ ...p, items: [...p.items, { ...EMPTY_ITEM }] }));
  const removeItem = idx => setForm(p => ({ ...p, items: p.items.filter((_, i) => i !== idx) }));

  const calcTotals = () => {
    let subtotal = 0, totalCgst = 0, totalSgst = 0, totalIgst = 0;
    form.items.forEach(it => {
      const taxable = Number(it.qty || 0) * Number(it.rate || 0);
      const gst = taxable * (Number(it.gstPercent || 0) / 100);
      subtotal += taxable;
      if (form.gstType === 'inter') {
        totalIgst += gst;
      } else {
        totalCgst += gst / 2;
        totalSgst += gst / 2;
      }
    });
    const grandTotal = subtotal + totalCgst + totalSgst + totalIgst;
    return { subtotal, totalCgst, totalSgst, totalIgst, grandTotal };
  };

  const { subtotal, totalCgst, totalSgst, totalIgst, grandTotal } = calcTotals();

  const submit = async e => {
    e.preventDefault();
    if (!form.partyId) { toast.error('Select a customer'); return; }
    if (!form.items.length || !form.items[0].name) { toast.error('Add at least one item'); return; }
    setSaving(true);
    try {
      if (isEdit) {
        await accountingApi.updateInvoice(initial._id, form);
        toast.success('Invoice updated');
      } else {
        await accountingApi.createInvoice(form);
        toast.success('Invoice created');
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
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        className="bg-[#0D1220] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl mb-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <p className="font-bold text-white">{isEdit ? 'Edit Invoice' : 'Create Invoice'}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Customer <span className="text-red-400">*</span></label>
              <select className={inp} value={form.partyId} onChange={e => set('partyId', e.target.value)}>
                <option value="">Select customer</option>
                {parties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">GST Type</label>
              <select className={inp} value={form.gstType} onChange={e => set('gstType', e.target.value)}>
                <option value="intra">Intra-State (CGST+SGST)</option>
                <option value="inter">Inter-State (IGST)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Invoice Date</label>
              <input type="date" className={inp} value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Due Date</label>
              <input type="date" className={inp} value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Status</label>
              <select className={inp} value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="draft">Draft</option>
                <option value="posted">Posted</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Line Items</p>
              <button type="button" onClick={addItem} className="text-xs text-[#3AB6FF] hover:text-white transition">
                <FiPlus className="inline w-3.5 h-3.5 mr-1" /> Add Item
              </button>
            </div>

            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-white/3 border border-white/5">
                  <select className={`${inp} col-span-3 text-xs`} value={item.productId || ''} onChange={e => setItem(idx, 'productId', e.target.value)}>
                    <option value="">Select or type below</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                  <input className={`${inp} col-span-2 text-xs`} placeholder="Item name" value={item.name} onChange={e => setItem(idx, 'name', e.target.value)} />
                  <input type="number" min="0" className={`${inp} col-span-1 text-center text-xs`} placeholder="Qty" value={item.qty} onChange={e => setItem(idx, 'qty', e.target.value)} />
                  <input type="number" min="0" step="0.01" className={`${inp} col-span-2 text-right text-xs`} placeholder="Rate" value={item.rate} onChange={e => setItem(idx, 'rate', e.target.value)} />
                  <select className={`${inp} col-span-1 text-xs text-center`} value={item.gstPercent} onChange={e => setItem(idx, 'gstPercent', e.target.value)}>
                    {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                  </select>
                  <input className={`${inp} col-span-2 text-xs`} placeholder="HSN/SAC" value={item.hsnSac} onChange={e => setItem(idx, 'hsnSac', e.target.value)} />
                  <button type="button" onClick={() => removeItem(idx)} className="col-span-1 flex justify-center text-slate-500 hover:text-red-400 transition">
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-64 space-y-2 bg-white/3 rounded-xl p-4">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Subtotal</span><span className="text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              {form.gstType === 'intra' ? (
                <>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>CGST</span><span className="text-yellow-400">₹{totalCgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>SGST</span><span className="text-yellow-400">₹{totalSgst.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-xs text-slate-400">
                  <span>IGST</span><span className="text-yellow-400">₹{totalIgst.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-2">
                <span>Grand Total</span>
                <span style={{ color: "#3AB6FF" }}>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Notes</label>
            <textarea className={`${inp} resize-none`} rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Optional notes" />
          </div>

          <div className="flex gap-3 pt-3 border-t border-white/5">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white transition">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition"
              style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
              {saving ? 'Saving…' : isEdit ? 'Update Invoice' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function AdminAccountingInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await accountingApi.getInvoices({ search, status: statusFilter });
      setInvoices(data.invoices || []);
    } catch (err) {
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search, statusFilter]);

  const handleCancel = async id => {
    if (!window.confirm('Cancel this invoice? This will reverse accounting entries.')) return;
    try {
      await accountingApi.cancelInvoice(id);
      toast.success('Invoice cancelled');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this invoice?')) return;
    try {
      await accountingApi.deleteInvoice(id);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const statusColors = {
    draft:     'bg-slate-500/15 text-slate-400',
    posted:    'bg-blue-500/15 text-blue-400',
    paid:      'bg-green-500/15 text-green-400',
    partial:   'bg-yellow-500/15 text-yellow-400',
    cancelled: 'bg-red-500/15 text-red-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Accounting Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">Sales invoices with double-entry bookkeeping</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition"
          style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
          <FiPlus className="w-4 h-4" /> Create Invoice
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input className={`${inp} pl-10`} placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className={inp + " w-40"} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="posted">Posted</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" />
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-20">
          <FiFileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No invoices found</p>
        </div>
      ) : (
        <div className="bg-[#0D1220] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Invoice #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Customer</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Balance</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map(inv => (
                  <tr key={inv._id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3 text-sm text-white font-mono font-medium">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-white">{inv.partyId?.name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-right font-mono text-green-400">₹{inv.grandTotal?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-right font-mono text-yellow-400">₹{inv.balance?.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold ${statusColors[inv.status]}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.status !== 'cancelled' && (
                          <button onClick={() => { setEditing(inv); setShowForm(true); }}
                            className="p-2 rounded-lg text-slate-400 hover:text-[#3AB6FF] hover:bg-[#3AB6FF]/10 transition">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                        )}
                        {inv.status === 'posted' && (
                          <button onClick={() => handleCancel(inv._id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 transition">
                            <FiXCircle className="w-4 h-4" />
                          </button>
                        )}
                        {inv.status === 'draft' && (
                          <button onClick={() => handleDelete(inv._id)}
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
        {showForm && <InvoiceForm initial={editing} onClose={() => setShowForm(false)} onSaved={load} />}
      </AnimatePresence>
    </div>
  );
}
