import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "../../services/api";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiZap, FiToggleLeft, FiToggleRight, FiCalendar } from "react-icons/fi";

const EMPTY = {
  title: "", description: "", discount: "", badge: "", link: "",
  startDate: "", endDate: "", status: "active", priority: 0,
};

const STATUS_STYLE = {
  active:   "bg-green-500/15 text-green-400 border-green-500/30",
  inactive: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  expired:  "bg-red-500/15 text-red-400 border-red-500/30",
};

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

function OfferFormModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial ? {
    title: initial.title || "",
    description: initial.description || "",
    discount: initial.discount || "",
    badge: initial.badge || "",
    link: initial.link || "",
    startDate: initial.startDate ? new Date(initial.startDate).toISOString().slice(0, 10) : "",
    endDate:   initial.endDate   ? new Date(initial.endDate).toISOString().slice(0, 10)   : "",
    status: initial.status || "active",
    priority: initial.priority || 0,
  } : EMPTY);
  const [saving, setSaving] = useState(false);
  const isEdit = !!initial?._id;
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const inp = "w-full rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] focus:ring-1 focus:ring-[#3AB6FF]/30 transition";

  const submit = async e => {
    e.preventDefault();
    if (!form.title || !form.startDate || !form.endDate) {
      toast.error("Title, start date and end date are required");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/offers/${initial._id}`, form);
        toast.success("Offer updated");
      } else {
        await api.post("/offers", form);
        toast.success("Offer created");
      }
      onSaved();
      onClose();
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
          <h2 className="font-bold text-white">{isEdit ? "Edit Offer" : "Create New Offer"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
            <FiX className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Title *</label>
            <input required className={inp} placeholder="Free Laptop Diagnosis – Today Only!" value={form.title} onChange={e => set("title", e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Description</label>
            <textarea rows={2} className={inp + " resize-none"} placeholder="Short description of the offer..." value={form.description} onChange={e => set("description", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Discount / Value</label>
              <input className={inp} placeholder="e.g. 20% OFF or FREE" value={form.discount} onChange={e => set("discount", e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Badge Label</label>
              <input className={inp} placeholder="Today Only, Flash Sale..." value={form.badge} onChange={e => set("badge", e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">CTA Link</label>
              <input className={inp} placeholder="/shop or /services/request" value={form.link} onChange={e => set("link", e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Priority (higher = first)</label>
              <input type="number" min={0} className={inp} value={form.priority} onChange={e => set("priority", e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Start Date *</label>
              <input required type="date" className={inp} value={form.startDate} onChange={e => set("startDate", e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">End Date *</label>
              <input required type="date" className={inp} value={form.endDate} onChange={e => set("endDate", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Status</label>
            <select className={inp} value={form.status} onChange={e => set("status", e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white transition">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60 transition"
              style={{ background: "linear-gradient(135deg,#3AB6FF,#1E90FF)" }}>
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Offer"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function AdminOffers() {
  const [offers, setOffers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editOffer, setEditOffer] = useState(null);
  const [deleteId, setDeleteId]   = useState(null);

  const load = () => {
    setLoading(true);
    api.get("/offers")
      .then(res => setOffers(res.data.offers || []))
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/offers/${deleteId}`);
      toast.success("Offer deleted");
      setDeleteId(null);
      load();
    } catch { toast.error("Delete failed"); }
  };

  const handleToggle = async (id) => {
    try {
      await api.patch(`/offers/${id}/toggle`);
      toast.success("Status updated");
      load();
    } catch { toast.error("Toggle failed"); }
  };

  const active   = offers.filter(o => o.status === "active").length;
  const inactive = offers.filter(o => o.status === "inactive").length;
  const expired  = offers.filter(o => o.status === "expired").length;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>Daily Offers</h1>
          <p className="text-sm text-slate-500 mt-1">{offers.length} offers total</p>
        </div>
        <button onClick={() => { setEditOffer(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition"
          style={{ background: "linear-gradient(135deg,#3AB6FF,#1E90FF)" }}>
          <FiPlus className="w-4 h-4" /> New Offer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active", value: active,   color: "#22C55E" },
          { label: "Inactive", value: inactive, color: "#64748B" },
          { label: "Expired", value: expired,  color: "#EF4444" },
        ].map(s => (
          <div key={s.label} className="bg-[#0D1220] border border-white/5 rounded-2xl p-4 text-center">
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Offers table */}
      <div className="bg-[#0D1220] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-white/5">
                <th className="px-5 py-3 text-left font-medium">Offer</th>
                <th className="px-5 py-3 text-left font-medium">Discount</th>
                <th className="px-5 py-3 text-left font-medium">Dates</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {Array(5).fill(0).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 rounded bg-white/5 animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : offers.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-16 text-center">
                  <FiZap className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-500">No offers yet. Create your first one!</p>
                </td></tr>
              ) : offers.map(o => (
                <tr key={o._id} className="border-b border-white/5 hover:bg-white/2 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-start gap-2">
                      <FiZap className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate max-w-[200px]">{o.title}</p>
                        {o.badge && <span className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">{o.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-bold text-[#3AB6FF]">{o.discount || "—"}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <FiCalendar className="w-3 h-3" />
                      <span>{new Date(o.startDate).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}</span>
                      <span>→</span>
                      <span>{new Date(o.endDate).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLE[o.status] || STATUS_STYLE.inactive}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => handleToggle(o._id)} title="Toggle status"
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-[#3AB6FF] hover:bg-[#3AB6FF]/10 transition">
                        {o.status === "active" ? <FiToggleRight className="w-4 h-4 text-green-400" /> : <FiToggleLeft className="w-4 h-4" />}
                      </button>
                      <button onClick={() => { setEditOffer(o); setShowForm(true); }}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-[#3AB6FF] hover:bg-[#3AB6FF]/10 transition">
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(o._id)}
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

      <AnimatePresence>
        {showForm && <OfferFormModal initial={editOffer} onClose={() => setShowForm(false)} onSaved={load} />}
        {deleteId && <ConfirmModal message="This will permanently delete the offer." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      </AnimatePresence>
    </div>
  );
}
