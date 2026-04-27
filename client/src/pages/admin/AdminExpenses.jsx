import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiDollarSign,
  FiArrowUpCircle, FiArrowDownCircle, FiFilter,
} from "react-icons/fi";
import { api } from "../../services/api";

const fmt = n =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const CATEGORIES = [
  "Salary", "Rent", "Utilities", "Inventory", "Marketing",
  "Equipment", "Maintenance", "Travel", "Miscellaneous", "Client Payment", "Sales Revenue", "Other",
];

const STATUS_COLORS = {
  paid:      "bg-green-500/15 text-green-400 border-green-500/30",
  pending:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

const EMPTY_FORM = {
  type: "outward", category: "", description: "", amount: "",
  date: new Date().toISOString().slice(0, 10), reference: "", status: "paid",
};

const inp = "w-full rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] focus:ring-1 focus:ring-[#3AB6FF]/30 transition";
const sel = inp + " appearance-none";

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

function ExpenseFormModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial ? {
    ...initial,
    date: initial.date ? new Date(initial.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
  } : EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const isEdit = !!initial?._id;

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    if (!form.category || !form.amount) { toast.error("Category and amount are required"); return; }
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/expenses/${initial._id}`, form);
        toast.success("Expense updated");
      } else {
        await api.post("/expenses", form);
        toast.success("Expense added");
      }
      onSaved(); onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0D1220] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl mb-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <p className="font-bold text-white">{isEdit ? "Edit Expense" : "Add Expense"}</p>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition"><FiX /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          {/* Type toggle */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Type</label>
            <div className="flex gap-2">
              {["outward", "inward"].map(t => (
                <button key={t} type="button"
                  onClick={() => set("type", t)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${
                    form.type === t
                      ? t === "outward"
                        ? "bg-red-500/20 text-red-400 border-red-500/40"
                        : "bg-green-500/20 text-green-400 border-green-500/40"
                      : "border-white/10 text-slate-400 hover:text-white"
                  }`}>
                  {t === "outward" ? "⬆ Outward (Expense)" : "⬇ Inward (Income)"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Category <span className="text-red-400">*</span></label>
              <select className={sel} value={form.category} onChange={e => set("category", e.target.value)}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Amount (₹) <span className="text-red-400">*</span></label>
              <input type="number" min="0" step="0.01" className={inp} placeholder="0.00"
                value={form.amount} onChange={e => set("amount", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Description</label>
            <input className={inp} placeholder="Brief description..." value={form.description}
              onChange={e => set("description", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Date</label>
              <input type="date" className={inp} value={form.date} onChange={e => set("date", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Status</label>
              <select className={sel} value={form.status} onChange={e => set("status", e.target.value)}>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Reference / Invoice No.</label>
            <input className={inp} placeholder="e.g. REF-001" value={form.reference}
              onChange={e => set("reference", e.target.value)} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
              {saving ? "Saving…" : isEdit ? "Update" : "Add Expense"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function AdminExpenses() {
  const [expenses, setExpenses]   = useState([]);
  const [summary, setSummary]     = useState({ totalInward: 0, totalOutward: 0, balance: 0 });
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterType, setFilterType]     = useState("");
  const [filterFrom, setFilterFrom]     = useState("");
  const [filterTo, setFilterTo]         = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType) params.type = filterType;
      if (filterFrom) params.from = filterFrom;
      if (filterTo)   params.to   = filterTo;
      const [expRes, sumRes] = await Promise.all([
        api.get("/expenses", { params }),
        api.get("/expenses/summary"),
      ]);
      setExpenses(expRes.data.expenses || []);
      setSummary(sumRes.data);
    } catch {
      toast.error("Failed to load expenses");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filterType, filterFrom, filterTo]);

  const handleDelete = async () => {
    try {
      await api.delete(`/expenses/${deleteTarget._id}`);
      toast.success("Deleted");
      setDeleteTarget(null);
      load();
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Expenses</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track company income and expenditure</p>
        </div>
        <button onClick={() => setModal("create")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition"
          style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
          <FiPlus className="w-4 h-4" /> Add Entry
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
          className="bg-[#0D1220] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-green-500/15">
            <FiArrowDownCircle className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Inward (Income)</p>
            <p className="text-2xl font-black text-green-400 mt-0.5">{fmt(summary.totalInward)}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-[#0D1220] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-500/15">
            <FiArrowUpCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Outward (Expenses)</p>
            <p className="text-2xl font-black text-red-400 mt-0.5">{fmt(summary.totalOutward)}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#0D1220] border border-white/5 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#3AB6FF]/15">
            <FiDollarSign className="w-5 h-5 text-[#3AB6FF]" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Net Balance</p>
            <p className={`text-2xl font-black mt-0.5 ${summary.balance >= 0 ? "text-[#3AB6FF]" : "text-red-400"}`}>
              {fmt(summary.balance)}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-[#0D1220] border border-white/5 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <FiFilter className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <select className="rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3AB6FF] transition"
          value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          <option value="inward">Inward</option>
          <option value="outward">Outward</option>
        </select>
        <input type="date" className="rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3AB6FF] transition"
          value={filterFrom} onChange={e => setFilterFrom(e.target.value)} placeholder="From" />
        <input type="date" className="rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3AB6FF] transition"
          value={filterTo} onChange={e => setFilterTo(e.target.value)} placeholder="To" />
        {(filterType || filterFrom || filterTo) && (
          <button onClick={() => { setFilterType(""); setFilterFrom(""); setFilterTo(""); }}
            className="text-xs text-slate-400 hover:text-white transition px-2 py-1 rounded-lg border border-white/10">
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-[#0D1220] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" />
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <FiDollarSign className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No expenses found. Add your first entry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-white/5">
                  <th className="px-5 py-3 text-left font-medium">Date</th>
                  <th className="px-5 py-3 text-left font-medium">Type</th>
                  <th className="px-5 py-3 text-left font-medium">Category</th>
                  <th className="px-5 py-3 text-left font-medium">Description</th>
                  <th className="px-5 py-3 text-left font-medium">Reference</th>
                  <th className="px-5 py-3 text-left font-medium">Amount</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((e, i) => (
                  <motion.tr key={e._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/2 transition">
                    <td className="px-5 py-3 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(e.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        e.type === "inward"
                          ? "bg-green-500/15 text-green-400 border-green-500/30"
                          : "bg-red-500/15 text-red-400 border-red-500/30"
                      }`}>
                        {e.type === "inward" ? "⬇ Inward" : "⬆ Outward"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-300 font-medium">{e.category}</td>
                    <td className="px-5 py-3 text-slate-400 max-w-[180px] truncate">{e.description || "—"}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs font-mono">{e.reference || "—"}</td>
                    <td className="px-5 py-3 font-bold whitespace-nowrap" style={{ color: e.type === "inward" ? "#4ade80" : "#f87171" }}>
                      {e.type === "inward" ? "+" : "-"}{fmt(e.amount)}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[e.status] || STATUS_COLORS.paid}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => setModal(e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#3AB6FF] transition">
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteTarget(e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition">
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {modal && (
          <ExpenseFormModal
            initial={modal === "create" ? null : modal}
            onClose={() => setModal(null)}
            onSaved={load}
          />
        )}
        {deleteTarget && (
          <ConfirmModal
            message={`Delete this ${deleteTarget.type} entry of ${fmt(deleteTarget.amount)}? This cannot be undone.`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
