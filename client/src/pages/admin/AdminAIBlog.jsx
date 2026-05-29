import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiZap, FiSave, FiSend, FiClock, FiRefreshCw,
  FiArrowLeft, FiAlertCircle, FiCheckCircle,
  FiEye, FiEdit3, FiTag, FiFileText,
} from "react-icons/fi";
import { api } from "../../services/api";

/* ── helpers ── */
const slugify = t => t.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80);

const TONES = [
  { value: "professional",   label: "🎯 Professional" },
  { value: "casual",         label: "😊 Casual & Friendly" },
  { value: "seo-focused",    label: "🔍 SEO Focused" },
  { value: "educational",    label: "📚 Educational" },
  { value: "conversational", label: "💬 Conversational" },
];

const CATEGORIES = [
  "IT Tips", "Laptop Repair", "Data Recovery", "Networking",
  "Software", "Hardware", "Cybersecurity", "General",
];

const inp = "w-full rounded-xl border border-white/8 bg-[#0B0F1A] px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3AB6FF] focus:ring-1 focus:ring-[#3AB6FF]/30 transition";

export function AdminAIBlog() {
  const [phase, setPhase] = useState("generate"); // "generate" | "preview" | "edit"

  /* Generator */
  const [topic,      setTopic]      = useState("");
  const [category,   setCategory]   = useState("IT Tips");
  const [tone,       setTone]       = useState("professional");
  const [wordCount,  setWordCount]  = useState(800);
  const [generating, setGenerating] = useState(false);

  /* Blog data */
  const [title,   setTitle]   = useState("");
  const [slug,    setSlug]    = useState("");
  const [meta,    setMeta]    = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags,    setTags]    = useState("");
  const [content, setContent] = useState("");

  /* Publish */
  const [status,  setStatus]  = useState("draft");
  const [schedAt, setSchedAt] = useState("");
  const [saving,  setSaving]  = useState(false);
  const [savedId, setSavedId] = useState(null);

  /* ── Generate ── */
  const handleGenerate = async () => {
    if (!topic.trim()) { toast.error("Enter a topic first"); return; }
    setGenerating(true);
    setSavedId(null);
    try {
      const { data } = await api.post("/ai/generate-blog", { topic, category, tone, wordCount });
      setTitle(data.title || "");
      setSlug(data.slug || slugify(data.title || topic));
      setMeta(data.metaDescription || "");
      setExcerpt(data.excerpt || "");
      setTags((data.tags || []).join(", "));
      setContent(data.content || "");
      setPhase("preview");
      toast.success("✅ Blog ready — review and publish!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Generation failed");
    } finally { setGenerating(false); }
  };

  /* ── Save / Publish ── */
  const handleSave = async (overrideStatus) => {
    const finalStatus = overrideStatus || status;
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (!content.trim()) { toast.error("Content is empty"); return; }
    if (finalStatus === "scheduled" && !schedAt) { toast.error("Set a scheduled date/time"); return; }

    setSaving(true);
    try {
      const { data } = await api.post("/admin/blog", {
        title, slug, excerpt,
        metaDescription: meta,
        content,
        category,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        status: finalStatus,
        published: finalStatus === "published",
        scheduledAt: finalStatus === "scheduled" ? schedAt : null,
        aiGenerated: true,
        aiTone: tone,
      });
      setSavedId(data.post?._id);
      toast.success(
        finalStatus === "published" ? "🎉 Blog published!" :
        finalStatus === "scheduled" ? "⏰ Blog scheduled!" :
        "💾 Saved as draft"
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  /* ════════════════════════════════════════
     PHASE: GENERATE
  ════════════════════════════════════════ */
  if (phase === "generate") return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "linear-gradient(135deg,#6366F1,#3AB6FF)" }}>
          <FiZap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-black text-white mb-1">AI Blog Generator</h1>
        <p className="text-sm text-slate-500">Give me a topic — I'll write a complete, ready-to-publish blog</p>
      </div>

      <div className="bg-[#0D1220] border border-white/8 rounded-2xl p-6 space-y-5">

        {/* Topic */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            What should the blog be about? <span className="text-red-400">*</span>
          </label>
          <textarea className={`${inp} resize-none`} rows={3}
            value={topic} onChange={e => setTopic(e.target.value)}
            placeholder="e.g. How to fix a laptop that won't turn on&#10;Signs your hard drive is failing&#10;Best budget laptops under ₹30,000 in 2025" />
          <p className="text-[10px] text-slate-600 mt-1">Be specific for better results</p>
        </div>

        {/* Category + Tone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
            <select className={inp} value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tone</label>
            <select className={inp} value={tone} onChange={e => setTone(e.target.value)}>
              {TONES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        {/* Word count */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Length: <span className="text-[#3AB6FF]">{wordCount} words</span>
          </label>
          <input type="range" min={500} max={1500} step={100} value={wordCount}
            onChange={e => setWordCount(Number(e.target.value))}
            className="w-full accent-[#3AB6FF]" />
          <div className="flex justify-between text-[10px] text-slate-600 mt-1">
            <span>500 (quick read)</span><span>1000 (standard)</span><span>1500 (in-depth)</span>
          </div>
        </div>

        {/* Generate button */}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleGenerate} disabled={generating || !topic.trim()}
          className="w-full py-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition"
          style={{ background: "linear-gradient(135deg,#6366F1,#3AB6FF)" }}>
          {generating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Writing your blog… (15–30 seconds)
            </>
          ) : (
            <><FiZap className="w-4 h-4" /> Generate Complete Blog</>
          )}
        </motion.button>

        {generating && (
          <div className="text-center space-y-1">
            <p className="text-xs text-slate-500">✍️ Writing content with emojis and structure…</p>
            <p className="text-xs text-slate-600">🖼️ Adding relevant images…</p>
            <p className="text-xs text-slate-600">🎨 Applying ColdTech theme…</p>
          </div>
        )}
      </div>

      {/* What you get */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {[
          { icon: "📝", label: "Full blog content", sub: "Structured with headings" },
          { icon: "🖼️", label: "Real images",       sub: "Auto-fetched from Unsplash" },
          { icon: "😊", label: "Emojis & style",    sub: "Engaging & readable" },
          { icon: "🎨", label: "ColdTech theme",    sub: "Branded & professional" },
          { icon: "🔍", label: "SEO ready",         sub: "Title, meta, tags, slug" },
          { icon: "🚀", label: "CTA included",      sub: "Links to your services" },
        ].map((f, i) => (
          <div key={i} className="bg-[#0D1220] border border-white/5 rounded-xl p-3 flex items-center gap-3">
            <span className="text-xl">{f.icon}</span>
            <div>
              <p className="text-xs font-semibold text-white">{f.label}</p>
              <p className="text-[10px] text-slate-500">{f.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ════════════════════════════════════════
     PHASE: PREVIEW / EDIT
  ════════════════════════════════════════ */
  return (
    <div className="max-w-6xl mx-auto">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => { setPhase("generate"); setSavedId(null); }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition">
            <FiArrowLeft className="w-3.5 h-3.5" /> New Blog
          </button>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <button onClick={() => setPhase("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${phase === "preview" ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}>
              <FiEye className="w-3.5 h-3.5" /> Preview
            </button>
            <button onClick={() => setPhase("edit")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${phase === "edit" ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}>
              <FiEdit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => { setPhase("generate"); setSavedId(null); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white border border-white/8 hover:border-white/20 transition">
            <FiRefreshCw className="w-3.5 h-3.5" /> Regenerate
          </button>
          <button onClick={() => handleSave("draft")} disabled={saving || !!savedId}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 border border-white/15 hover:border-white/30 transition disabled:opacity-40">
            <FiSave className="w-3.5 h-3.5" /> Save Draft
          </button>
          <button onClick={() => handleSave("published")} disabled={saving || !!savedId}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white disabled:opacity-40 transition"
            style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
            {saving
              ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publishing…</>
              : <><FiSend className="w-3.5 h-3.5" /> Publish Now</>
            }
          </button>
        </div>
      </div>

      {/* Saved notice */}
      <AnimatePresence>
        {savedId && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-emerald-400"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <FiCheckCircle className="w-4 h-4" />
            Blog saved successfully! You can now view it on the Blog Posts page.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Main: Preview or Edit ── */}
        <div className="lg:col-span-2">
          {phase === "preview" ? (
            /* Live preview */
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-2 bg-slate-100 flex items-center gap-2 border-b border-slate-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-slate-500 ml-2">coldtechtechnologies.in/blog/{slug}</span>
              </div>
              <div className="p-6 overflow-auto max-h-[700px]"
                dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          ) : (
            /* Edit mode */
            <div className="bg-[#0D1220] border border-white/8 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Edit HTML Content</span>
                <span className="text-[10px] text-slate-600">
                  ~{content.replace(/<[^>]*>/g, '').split(/\s+/).length} words
                </span>
              </div>
              <textarea
                className="w-full bg-transparent text-xs text-slate-300 font-mono p-4 focus:outline-none resize-none"
                style={{ minHeight: 600 }}
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* ── Sidebar: Meta + Publish ── */}
        <div className="space-y-4">

          {/* Title + Slug */}
          <div className="bg-[#0D1220] border border-white/8 rounded-2xl p-4 space-y-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Title</label>
            <input className={`${inp} font-semibold`} value={title}
              onChange={e => { setTitle(e.target.value); setSlug(slugify(e.target.value)); }} />
            <div>
              <label className="block text-[10px] text-slate-600 mb-1">Slug</label>
              <input className={`${inp} text-xs text-slate-400`} value={slug}
                onChange={e => setSlug(e.target.value)} />
            </div>
          </div>

          {/* Meta */}
          <div className="bg-[#0D1220] border border-white/8 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <FiFileText className="inline w-3 h-3 mr-1" />Meta Description
              </label>
              <span className={`text-[10px] ${meta.length > 155 ? "text-amber-400" : "text-slate-600"}`}>
                {meta.length}/160
              </span>
            </div>
            <textarea className={`${inp} resize-none text-xs`} rows={3}
              value={meta} onChange={e => setMeta(e.target.value)} maxLength={160} />
          </div>

          {/* Excerpt */}
          <div className="bg-[#0D1220] border border-white/8 rounded-2xl p-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Excerpt</label>
            <textarea className={`${inp} resize-none text-xs`} rows={3}
              value={excerpt} onChange={e => setExcerpt(e.target.value)} />
          </div>

          {/* Tags */}
          <div className="bg-[#0D1220] border border-white/8 rounded-2xl p-4">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              <FiTag className="inline w-3 h-3 mr-1" />Tags
            </label>
            <input className={`${inp} text-xs`} value={tags} onChange={e => setTags(e.target.value)} />
            {tags && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.split(",").map(t => t.trim()).filter(Boolean).map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ background: "rgba(58,182,255,0.12)", color: "#3AB6FF" }}>{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* Publish settings */}
          <div className="bg-[#0D1220] border border-white/8 rounded-2xl p-4 space-y-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Publish</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { v: "draft",     label: "Draft",    color: "#94A3B8" },
                { v: "published", label: "Publish",  color: "#10B981" },
                { v: "scheduled", label: "Schedule", color: "#F59E0B" },
              ].map(s => (
                <button key={s.v} type="button" onClick={() => setStatus(s.v)}
                  className="py-2 rounded-xl text-[10px] font-bold transition border"
                  style={status === s.v
                    ? { background: s.color + "20", color: s.color, borderColor: s.color + "50" }
                    : { background: "transparent", color: "#64748B", borderColor: "rgba(255,255,255,0.08)" }}>
                  {s.label}
                </button>
              ))}
            </div>

            {status === "scheduled" && (
              <input type="datetime-local" className={`${inp} text-xs`}
                value={schedAt} onChange={e => setSchedAt(e.target.value)}
                min={new Date().toISOString().slice(0, 16)} />
            )}

            <button onClick={() => handleSave()} disabled={saving || !!savedId}
              className="w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40 transition"
              style={{ background:
                status === "published" ? "linear-gradient(135deg,#10B981,#059669)" :
                status === "scheduled" ? "linear-gradient(135deg,#F59E0B,#D97706)" :
                "linear-gradient(135deg,#3AB6FF,#1E90FF)" }}>
              {saving
                ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                : savedId
                  ? <><FiCheckCircle className="w-3.5 h-3.5" /> Saved!</>
                  : status === "published" ? <><FiSend className="w-3.5 h-3.5" /> Publish Now</>
                  : status === "scheduled" ? <><FiClock className="w-3.5 h-3.5" /> Schedule</>
                  : <><FiSave className="w-3.5 h-3.5" /> Save Draft</>
              }
            </button>
          </div>

          {/* AI info */}
          <div className="bg-[#0D1220] border border-white/5 rounded-2xl p-4">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">Generated From</p>
            <p className="text-xs text-slate-400 leading-relaxed">"{topic}"</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500">{category}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500">{tone}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500">{wordCount}w</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
