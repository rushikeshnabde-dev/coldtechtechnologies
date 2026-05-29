import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX, FiDollarSign } from 'react-icons/fi';
import { accountingApi } from '../../services/api';

const inp = "w-full rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] focus:ring-1 focus:ring-[#3AB6FF]/30 transition";

function PaymentForm({ onClose, onSaved }) {
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState({
    invoiceId: '',
    amount: 0,
    mode: 'cash',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    accountingApi.getInvoices({ status: 'posted' }).then(r => {
      const unpaid = (r.data.invoices || []).filter(inv => inv.balance > 0);
      setInvoices(unpaid);
    });
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const selectedInvoice = invoices.find(i => i._id === form.invoiceId);

  const submit = async e => {
    e.preventDefault();
    if (!form.invoiceId) { toast.error('Select an invoice'); return; }
    if (!form.amount || form.amount <= 0) { toast.error('Enter valid amount'); return; }
    setSaving(true);
    try {
      await accountingApi.createPayment(form);
      toast.success('Payment recorded');
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
          <p className="font-bold text-white">Record Payment</p>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Invoice <span className="text-red-400">*</span></label>
            <select className={inp} value={form.invoiceId} onChange={e => set('invoiceId', e.target.value)}>
              <option value="">Select invoice</option>
              {invoices.map(inv => (
                <option key={inv._id} value={inv._id}>
                  {inv.invoiceNumber} — {inv.partyId?.name} — ₹{inv.balance?.toFixed(2)} due
                </option>
              ))}
            </select>
            {selectedInvoice && (
              <p className="text-xs text-slate-500 mt-1">
                Balance: <span className="text-yellow-400 font-mono">₹{selectedInvoice.balance?.toFixed(2)}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Amount (₹) <span className="text-red-400">*</span></label>
              <input type="number" min="0" step="0.01" className={inp} value={form.amount} onChange={e => set('amount', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Payment Mode</label>
              <select className={inp} value={form.mode} onChange={e => set('mode', e.target.value)}>
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="upi">UPI</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Payment Date</label>
            <input type="date" className={inp} value={form.date} onChange={e => set('date', e.target.value)} />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1.5">Notes</label>
            <textarea className={`${inp} resize-none`} rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Optional notes" />
          </div>

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white transition">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition"
              style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
              {saving ? 'Saving…' : 'Record Payment'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await accountingApi.getPayments();
      setPayments(data.payments || []);
    } catch (err) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async id => {
    if (!window.confirm('Delete this payment? This will reverse accounting entries.')) return;
    try {
      await accountingApi.deletePayment(id);
      toast.success('Payment deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const modeColors = {
    cash:   'bg-green-500/15 text-green-400',
    bank:   'bg-blue-500/15 text-blue-400',
    upi:    'bg-purple-500/15 text-purple-400',
    cheque: 'bg-orange-500/15 text-orange-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments Received</h1>
          <p className="text-sm text-slate-500 mt-1">Track payments against invoices</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition"
          style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
          <FiPlus className="w-4 h-4" /> Record Payment
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" />
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-20">
          <FiDollarSign className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500">No payments recorded</p>
        </div>
      ) : (
        <div className="bg-[#0D1220] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Payment #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Invoice</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Customer</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Mode</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map(pay => (
                  <tr key={pay._id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3 text-sm text-white font-mono font-medium">{pay.paymentNumber}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{new Date(pay.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-slate-400 font-mono">{pay.invoiceId?.invoiceNumber || '—'}</td>
                    <td className="px-4 py-3 text-sm text-white">{pay.partyId?.name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-right font-mono text-green-400">₹{pay.amount?.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold ${modeColors[pay.mode]}`}>
                        {pay.mode}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(pay._id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showForm && <PaymentForm onClose={() => setShowForm(false)} onSaved={load} />}
      </AnimatePresence>
    </div>
  );
}
