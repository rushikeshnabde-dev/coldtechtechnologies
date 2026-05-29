import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiMessageSquare, FiToggleLeft, FiToggleRight, FiImage } from "react-icons/fi";
import { api } from "../../services/api";
import { assetUrl } from "../../utils/imageUrl";

const EMPTY = { customerName: "", location: "", review: "", order: 0, visible: true };

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

function TestimonialFormModal({ initial, onClose, onSaved }) {
  const [form, setForm]       = useState(initial ? { ...initial } : EMPTY);
  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(initial?.image ? assetUrl(initial.image) : null);
  const [saving, setSaving]   = useState(false);
  const isEdit = !!initial?._id;
  const inp = "w-full rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] focus:ring-1 focus:ring-[#3AB6FF]/30 transition";

  const submit = async e => {
    e.preventDefault();
    if (!form.customerName || !form.review) { toast.error("Name and review are required"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("customerName", form.customerName);
      fd.append("location",     form.location);
      fd.append("review",       form.review);
      fd.append("order",        form.order);
      fd.append("visible",      form.visible);
      if (file) fd.append("image", file);
      if (isEdit) { await api.put(`/testimonials/${initial._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } }); toast.success("Updated"); }
      else        { await api.post("/testimonials", fd, { headers: { "Content-Type": "multipart/form-data" } }); toast.success("Created"); }
      onSaved(); onClose();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        className="bg-[#0D1220] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl mb-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <p className="font-bold text-white">{isEdit ? "Edit Review" : "Add Review"}</p>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><FiX /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <label className="flex flex-col items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-white/10 cursor-pointer hover:border-[#3AB6FF]/50 transition overflow-hidden" style={{ minHeight: 80 }}>
            {preview
              ? <img src={preview} alt="preview" className="w-16 h-16 rounded-full object-cover" />
              : <><FiImage className="w-6 h-6 text-slate-500" /><span className="text-xs text-slate-500">Customer photo (optional)</span></>}
            <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
          </label>
          <div><label className="block text-xs text-slate-400 mb-1">Customer Name *</label><input className={inp} value={form.customerName} onChange={e => setForm(p => ({ ...p, customerName: e.target.value }))} placeholder="e.g. Amit Verma" /></div>
          <div><label className="block text-xs text-slate-400 mb-1">Location <span className="text-slate-500">(optional)</span></label><input className={inp} value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Pune, Maharashtra" /></div>
          <div><label className="block text-xs text-slate-400 mb-1">Review *</label><textarea className={inp} rows={4} value={form.review} onChange={e => setForm(p => ({ ...p, review: e.target.value }))} placeholder="What did the customer say?" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-slate-400 mb-1">Order</label><input type="number" className={inp} value={form.order} onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} /></div>
            <div className="flex flex-col justify-end">
              <button type="button" onClick={() => setForm(p => ({ ...p, visible: !p.visible }))}
                className="flex items-center gap-2 text-sm font-medium transition" style={{ color: form.visible ? "#4ade80" : "#94a3b8" }}>
                {form.visible ? <FiToggleRight className="w-5 h-5" /> : <FiToggleLeft className="w-5 h-5" />}
                {form.visible ? "Visible" : "Hidden"}
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition" style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
              {saving ? "Saving…" : isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function AdminTestimonials() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => { setLoading(true); api.get("/testimonials/admin").then(r => setItems(r.data.testimonials || [])).catch(() => toast.error("Failed to load")).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try { await api.delete(`/testimonials/${deleteTarget._id}`); toast.success("Deleted"); setDeleteTarget(null); load(); }
    catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-black text-white">Testimonials</h1><p className="text-xs text-slate-500 mt-0.5">Real customer reviews shown on About page</p></div>
        <button onClick={() => setModal("create")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
          <FiPlus className="w-4 h-4" /> Add Review
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-slate-500"><FiMessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>No reviews yet.</p></div>
      ) : (
        <div className="space-y-3">
          {items.map((t, i) => (
            <motion.div key={t._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-[#0D1220] border border-white/5 rounded-2xl p-4 flex items-start gap-4 hover:border-white/10 transition">
              {t.image
                ? <img src={assetUrl(t.image)} alt={t.customerName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                : <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg,#1A2C3E,#00A6C4)" }}>{t.customerName[0]}</div>
              }
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-white text-sm">{t.customerName}</p>
                  {t.location && <p className="text-xs text-slate-500">{t.location}</p>}
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 italic">"{t.review}"</p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0 items-end">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${t.visible ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-slate-500/15 text-slate-400 border-slate-500/30"}`}>
                  {t.visible ? "Visible" : "Hidden"}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => setModal(t)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#3AB6FF] transition"><FiEdit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteTarget(t)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition"><FiTrash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && <TestimonialFormModal initial={modal === "create" ? null : modal} onClose={() => setModal(null)} onSaved={load} />}
        {deleteTarget && <ConfirmModal message={`Delete review from "${deleteTarget.customerName}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      </AnimatePresence>
    </div>
  );
}
