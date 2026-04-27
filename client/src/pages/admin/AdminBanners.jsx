import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage, FiToggleLeft, FiToggleRight } from "react-icons/fi";
import { api } from "../../services/api";
import { assetUrl } from "../../utils/imageUrl";

const EMPTY = { title: "", description: "", link: "", ctaLabel: "Claim Offer", ctaStyle: "primary", order: 0, active: true };

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

function BannerFormModal({ initial, onClose, onSaved }) {
  const [form, setForm]     = useState(initial ? { ...initial } : EMPTY);
  const [file, setFile]     = useState(null);
  const [preview, setPreview] = useState(initial?.image ? assetUrl(initial.image) : null);
  const [saving, setSaving] = useState(false);
  const isEdit = !!initial?._id;

  const inp = "w-full rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] focus:ring-1 focus:ring-[#3AB6FF]/30 transition";

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async e => {
    e.preventDefault();
    if (!isEdit && !file) { toast.error("Image is required"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title",       form.title);
      fd.append("description", form.description);
      fd.append("link",        form.link);
      fd.append("ctaLabel",    form.ctaLabel);
      fd.append("ctaStyle",    form.ctaStyle);
      fd.append("order",       form.order);
      fd.append("active",      form.active);
      if (file) fd.append("image", file);

      if (isEdit) {
        await api.put(`/banners/${initial._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Banner updated");
      } else {
        await api.post("/banners", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Banner created");
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
          <p className="font-bold text-white">{isEdit ? "Edit Banner" : "New Banner"}</p>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition"><FiX /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          {/* image upload */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Banner Image {!isEdit && <span className="text-red-400">*</span>}</label>
            <label className="flex flex-col items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-white/10 cursor-pointer hover:border-[#3AB6FF]/50 transition overflow-hidden"
              style={{ minHeight: 120 }}>
              {preview
                ? <img src={preview} alt="preview" className="w-full object-cover" style={{ maxHeight: 180 }} />
                : <><FiImage className="w-8 h-8 text-slate-500" /><span className="text-xs text-slate-500">Click to upload image</span></>
              }
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Title</label>
            <input className={inp} placeholder="e.g. Summer Sale" value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Description</label>
            <textarea className={inp} rows={2} placeholder="Short description..."
              value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Link (optional)</label>
            <input className={inp} placeholder="https://..." value={form.link}
              onChange={e => setForm(p => ({ ...p, link: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Display Order</label>
              <input type="number" className={inp} value={form.order}
                onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))} />
            </div>
            <div className="flex flex-col justify-end">
              <button type="button" onClick={() => setForm(p => ({ ...p, active: !p.active }))}
                className="flex items-center gap-2 text-sm font-medium transition"
                style={{ color: form.active ? "#4ade80" : "#94a3b8" }}>
                {form.active ? <FiToggleRight className="w-5 h-5" /> : <FiToggleLeft className="w-5 h-5" />}
                {form.active ? "Active" : "Inactive"}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
              {saving ? "Saving…" : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export function AdminBanners() {
  const [banners, setBanners]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null); // null | 'create' | banner object
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    api.get("/banners/admin")
      .then(r => setBanners(r.data.banners || []))
      .catch(() => toast.error("Failed to load banners"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/banners/${deleteTarget._id}`);
      toast.success("Banner deleted");
      setDeleteTarget(null);
      load();
    } catch { toast.error("Failed to delete"); }
  };

  const toggleActive = async (b) => {
    try {
      const fd = new FormData();
      fd.append("active", !b.active);
      fd.append("title", b.title);
      fd.append("description", b.description);
      fd.append("link", b.link);
      fd.append("order", b.order);
      await api.put(`/banners/${b._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      load();
    } catch { toast.error("Failed to update"); }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Banners</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage homepage carousel banners</p>
        </div>
        <button onClick={() => setModal("create")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition"
          style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
          <FiPlus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" />
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <FiImage className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No banners yet. Add your first one.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {banners.map((b, i) => (
            <motion.div key={b._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-[#0D1220] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition">
              <div className="relative" style={{ aspectRatio: "16/6" }}>
                <img src={assetUrl(b.image)} alt={b.title || "Banner"}
                  className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${b.active ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-slate-500/15 text-slate-400 border-slate-500/30"}`}>
                    {b.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="font-bold text-white text-sm truncate">{b.title || <span className="text-slate-500 italic">No title</span>}</p>
                {b.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{b.description}</p>}
                {b.link && <p className="text-xs text-[#3AB6FF] mt-1 truncate">{b.link}</p>}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <span className="text-xs text-slate-500">Order: {b.order}</span>
                  <div className="flex gap-2">
                    <button onClick={() => toggleActive(b)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
                      title={b.active ? "Deactivate" : "Activate"}>
                      {b.active ? <FiToggleRight className="w-4 h-4 text-green-400" /> : <FiToggleLeft className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setModal(b)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#3AB6FF] transition">
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(b)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <BannerFormModal
            initial={modal === "create" ? null : modal}
            onClose={() => setModal(null)}
            onSaved={load}
          />
        )}
        {deleteTarget && (
          <ConfirmModal
            message={`Delete banner "${deleteTarget.title || "Untitled"}"? This cannot be undone.`}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
