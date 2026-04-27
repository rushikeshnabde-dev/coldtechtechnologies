import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiShield } from "react-icons/fi";

/* Shared layout for all policy pages */
export function PolicyLayout({ badge, title, subtitle, date, sections, children }) {
  const [active, setActive] = useState(sections?.[0]?.id || "");

  useEffect(() => {
    if (!sections?.length) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <div className="w-full bg-[var(--color-page)] min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden py-14 px-6"
        style={{ background: "linear-gradient(135deg,#0f172a 0%,#0f2744 60%,#1e293b 100%)" }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-widest"
            style={{ background: "rgba(58,182,255,0.15)", color: "#38BDF8", border: "1px solid rgba(58,182,255,0.3)" }}>
            <FiShield className="w-3.5 h-3.5" /> {badge}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-white mb-2"
            style={{ fontFamily: "var(--font-display)" }}>
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-slate-400 text-sm">{subtitle}</motion.p>
          )}
          {date && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              className="text-slate-500 text-xs mt-2">Last updated: <span className="text-slate-300">{date}</span></motion.p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="flex gap-10 items-start">
          {/* TOC */}
          {sections?.length > 0 && (
            <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-24">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Contents</p>
              <nav className="space-y-0.5">
                {sections.map(s => (
                  <a key={s.id} href={`#${s.id}`}
                    onClick={e => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }); }}
                    className="block px-3 py-2 rounded-xl text-xs font-medium transition-all"
                    style={active === s.id
                      ? { background: "rgba(58,182,255,0.1)", color: "#3AB6FF", borderLeft: "2px solid #3AB6FF", paddingLeft: "10px" }
                      : { color: "#64748b" }}>
                    {s.title}
                  </a>
                ))}
              </nav>
            </aside>
          )}
          {/* Content */}
          <article className="flex-1 min-w-0 max-w-3xl">{children}</article>
        </div>
      </div>
    </div>
  );
}

/* Reusable section block */
export function PolicySection({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24 mb-10">
      <h2 className="text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-200 flex items-center gap-2">
        <span className="w-1.5 h-5 rounded-full flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#3AB6FF,#1E90FF)" }} />
        {title}
      </h2>
      <div className="space-y-3 text-slate-600 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

/* Info highlight box */
export function InfoBox({ children, type = "info" }) {
  const styles = {
    info:    { bg: "rgba(58,182,255,0.06)",  border: "rgba(58,182,255,0.2)",  color: "#0f172a", icon: "💡" },
    warning: { bg: "rgba(245,158,11,0.06)",  border: "rgba(245,158,11,0.25)", color: "#92400e", icon: "⚠️" },
    danger:  { bg: "rgba(239,68,68,0.06)",   border: "rgba(239,68,68,0.25)",  color: "#991b1b", icon: "🚨" },
    success: { bg: "rgba(16,185,129,0.06)",  border: "rgba(16,185,129,0.25)", color: "#065f46", icon: "✅" },
  };
  const s = styles[type] || styles.info;
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl my-3"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}>
      <span className="text-base flex-shrink-0 mt-0.5">{s.icon}</span>
      <p className="text-sm font-semibold" style={{ color: s.color }}>{children}</p>
    </div>
  );
}

/* Bullet list */
export function BulletList({ items }) {
  return (
    <ul className="space-y-1.5 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "#3AB6FF" }} />
          {item}
        </li>
      ))}
    </ul>
  );
}
