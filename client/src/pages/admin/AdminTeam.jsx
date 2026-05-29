import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiUsers, FiImage,
  FiToggleLeft, FiToggleRight, FiLinkedin, FiMapPin,
  FiAward, FiStar, FiCamera,
} from "react-icons/fi";
import { api } from "../../services/api";
import { assetUrl } from "../../utils/imageUrl";

const EMPTY = {
  name: "", role: "", bio: "", experience: "",
  skills: "", certifications: "", linkedin: "", location: "",
  order: 0, featured: false, visible: true,
};

const inp = "w-full rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] focus:ring-1 focus:ring-[#3AB6FF]/30 transition";

/* ── Confirm delete ── */
function ConfirmModal({ name, onConfirm, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="bg-[#0D1220] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <p className="font-bold text-white mb-2">Delete Member?</p>
        <p className="text-sm text-slate-400 mb-6">This will permanently remove <span className="text-white font-semibold">"{name}"</span>.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition">Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Toggle ── */
function Toggle({ value, onChange, label }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className="flex items-center gap-2 text-sm font-medium transition-colors"
      style={{ color: value ? "#3AB6FF" : "#64748b" }}>
      {value ? <FiToggleRight className="w-5 h-5" /> : <FiToggleLeft className="w-5 h-5" />}
      {label}
    </button>
  );
}

/* ── Skill tags ── */
function SkillTags({ value }) {
  const tags = value.split(",").map(s => s.trim()).filter(Boolean);
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {tags.map(t => (
        <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{ background: "rgba(58,182,255,0.12)", color: "#3AB6FF", border: "1px solid rgba(58,182,255,0.2)" }}>
          {t}
        </span>
      ))}
    </div>
  );
}

/* ── Form Modal ── */
function TeamFormModal({ initial, onClose, onSaved }) {
  const isEdit = !!initial?._id;
  const [form, setForm] = useState(() => initial ? {
    name:           initial.name || "",
    role:           initial.role || "",
    bio:            initial.bio || "",
    experience:     initial.experience || "",
    skills:         Array.isArray(initial.skills) ? initial.skills.join(", ") : "",
    certifications: initial.certifications || "",
    linkedin:       initial.linkedin || "",
    location:       initial.location || "",
    order:          initial.order ?? 0,
    featured:       initial.featured ?? false,
    visible:        initial.visible ?? true,
  } : { ...EMPTY });

  const [profileFile,  setProfileFile]  = useState(null);
  const [profilePrev,  setProfilePrev]  = useState(initial?.image ? assetUrl(initial.image) : null);
  const [workFiles,    setWorkFiles]    = useState([]);
  const [workPreviews, setWorkPreviews] = useState(
    (initial?.workImages || []).map(f => assetUrl(f))
  );
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleProfile = e => {
    const f = e.target.files[0];
    if (f) { setProfileFile(f); setProfilePrev(URL.createObjectURL(f)); }
  };

  const handleWorkImages = e => {
    const files = Array.from(e.target.files).slice(0, 5);
    setWorkFiles(files);
    setWorkPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const validate = () => {
    if (!form.name.trim())  { toast.error("Name is required"); return false; }
    if (!form.role.trim())  { toast.error("Role is required"); return false; }
    if (!form.bio.trim())   { toast.error("Short bio is required"); return false; }
    if (form.bio.length > 200) { toast.error("Bio must be 200 characters or less"); return false; }
    if (form.linkedin && !/^https?:\/\/.+/.test(form.linkedin)) {
      toast.error("LinkedIn URL must start with http:// or https://"); return false;
    }
    return true;
  };

  const submit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (profileFile) fd.append("image", profileFile);
      workFiles.forEach(f => fd.append("workImages", f));

      if (isEdit) {
        await api.put(`/team/${initial._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Member updated");
      } else {
        await api.post("/team", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Member added");
      }
      onSaved(); onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally { setSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        className="bg-[#0D1220] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl mb-10">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <p className="font-bold text-white">{isEdit ? "Edit Team Member" : "Add Team Member"}</p>
            <p className="text-xs text-slate-500 mt-0.5">Fill in the details to showcase this person on the website</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-6">

          {/* ── Profile Photo ── */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Profile Photo
            </label>
            <div className="flex items-center gap-5">
              <div className="relative flex-shrink-0">
                {profilePrev
                  ? <img src={profilePrev} alt="preview" className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#3AB6FF]/30" />
                  : <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <FiCamera className="w-7 h-7 text-slate-600" />
                    </div>
                }
              </div>
              <div className="flex-1">
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/15 cursor-pointer hover:border-[#3AB6FF]/50 transition text-sm text-slate-400 hover:text-white w-fit">
                  <FiImage className="w-4 h-4" />
                  {profilePrev ? "Change Photo" : "Upload Photo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleProfile} />
                </label>
                <p className="text-xs text-slate-600 mt-1.5">JPG or PNG, square crop recommended</p>
              </div>
            </div>
          </div>

          {/* ── Basic Info ── */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Basic Information
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                <input className={inp} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Ravi Kumar" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Role / Designation <span className="text-red-400">*</span></label>
                <input className={inp} value={form.role} onChange={e => set("role", e.target.value)} placeholder="e.g. Lead Technician" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Years of Experience</label>
                <input className={inp} value={form.experience} onChange={e => set("experience", e.target.value)} placeholder="e.g. 5+ Years" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">
                  <FiMapPin className="inline w-3 h-3 mr-1" />Location
                </label>
                <input className={inp} value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Pune, Maharashtra" />
              </div>
            </div>
          </div>

          {/* ── Bio ── */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-slate-400">Short Bio <span className="text-red-400">*</span></label>
              <span className={`text-xs ${form.bio.length > 200 ? "text-red-400" : "text-slate-600"}`}>
                {form.bio.length}/200
              </span>
            </div>
            <textarea className={`${inp} resize-none`} rows={3}
              value={form.bio} onChange={e => set("bio", e.target.value)}
              placeholder="Briefly describe what this person does and their expertise (max 200 characters)" />
          </div>

          {/* ── Skills ── */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              Skills <span className="text-slate-600">(comma separated)</span>
            </label>
            <input className={inp} value={form.skills} onChange={e => set("skills", e.target.value)}
              placeholder="e.g. Hardware Repair, Networking, Windows, Data Recovery" />
            <SkillTags value={form.skills} />
          </div>

          {/* ── Certifications + LinkedIn ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                <FiAward className="inline w-3 h-3 mr-1" />Certifications <span className="text-slate-600">(optional)</span>
              </label>
              <input className={inp} value={form.certifications} onChange={e => set("certifications", e.target.value)}
                placeholder="e.g. CompTIA A+, CCNA" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">
                <FiLinkedin className="inline w-3 h-3 mr-1" />LinkedIn URL <span className="text-slate-600">(optional)</span>
              </label>
              <input className={inp} value={form.linkedin} onChange={e => set("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/username" />
            </div>
          </div>

          {/* ── Work Images ── */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Work Images <span className="text-slate-600 font-normal normal-case">(optional, max 5)</span>
            </label>
            {workPreviews.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-3">
                {workPreviews.map((src, i) => (
                  <img key={i} src={src} alt="" className="w-16 h-16 rounded-xl object-cover ring-1 ring-white/10" />
                ))}
              </div>
            )}
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/15 cursor-pointer hover:border-[#3AB6FF]/50 transition text-sm text-slate-400 hover:text-white w-fit">
              <FiImage className="w-4 h-4" />
              {workPreviews.length ? "Replace Work Images" : "Upload Work Images"}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleWorkImages} />
            </label>
          </div>

          {/* ── Settings ── */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Settings</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Sort Order</label>
                <input type="number" className={inp} value={form.order}
                  onChange={e => set("order", Number(e.target.value))} />
              </div>
              <div className="flex flex-col gap-3">
                <Toggle value={form.featured} onChange={v => set("featured", v)}
                  label={<span className="flex items-center gap-1"><FiStar className="w-3.5 h-3.5" /> Featured</span>} />
                <Toggle value={form.visible} onChange={v => set("visible", v)} label="Visible" />
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex gap-3 pt-2 border-t border-white/5">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition"
              style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
              {saving ? "Saving…" : isEdit ? "Update Member" : "Add Member"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ── Main page ── */
export function AdminTeam() {
  const [members,      setMembers]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [modal,        setModal]        = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    api.get("/team/admin")
      .then(r => setMembers(r.data.members || []))
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/team/${deleteTarget._id}`);
      toast.success("Deleted");
      setDeleteTarget(null);
      load();
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Team Members</h1>
          <p className="text-xs text-slate-500 mt-0.5">Shown on the About page — only visible members are displayed</p>
        </div>
        <button onClick={() => setModal("create")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}>
          <FiPlus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#3AB6FF]/30 border-t-[#3AB6FF] rounded-full animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <FiUsers className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No team members yet. Add your first one.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => (
            <motion.div key={m._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-[#0D1220] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition group">

              {/* Top row */}
              <div className="flex items-start gap-3 mb-3">
                {m.image
                  ? <img src={assetUrl(m.image)} alt={m.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  : <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#1A2C3E,#00A6C4)" }}>
                      {m.name[0]}
                    </div>
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-white text-sm truncate">{m.name}</p>
                    {m.featured && <FiStar className="w-3 h-3 text-yellow-400 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-[#3AB6FF] mt-0.5 truncate">{m.role}</p>
                  {m.location && <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1"><FiMapPin className="w-2.5 h-2.5" />{m.location}</p>}
                </div>
              </div>

              {/* Bio */}
              {m.bio && <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">{m.bio}</p>}

              {/* Skills */}
              {m.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {m.skills.slice(0, 3).map(s => (
                    <span key={s} className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold"
                      style={{ background: "rgba(58,182,255,0.1)", color: "#3AB6FF" }}>{s}</span>
                  ))}
                  {m.skills.length > 3 && <span className="text-[9px] text-slate-600">+{m.skills.length - 3}</span>}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${m.visible ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-slate-500/10 text-slate-500 border-slate-500/20"}`}>
                  {m.visible ? "Visible" : "Hidden"}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => setModal(m)} className="p-1.5 rounded-lg text-slate-500 hover:text-[#3AB6FF] transition">
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteTarget(m)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition">
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <TeamFormModal
            initial={modal === "create" ? null : modal}
            onClose={() => setModal(null)}
            onSaved={load}
          />
        )}
        {deleteTarget && (
          <ConfirmModal
            name={deleteTarget.name}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
