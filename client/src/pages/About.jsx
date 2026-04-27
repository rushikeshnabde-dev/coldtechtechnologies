import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { SEO } from "../components/SEO";
import { api } from "../services/api";
import { assetUrl } from "../utils/imageUrl";
import {
  FiShield, FiZap, FiHeart, FiTrendingUp, FiClock,
  FiCheckCircle, FiArrowRight, FiMapPin,
  FiLinkedin, FiX, FiStar,
} from "react-icons/fi";

// ── Helpers ───────────────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ text }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
      style={{ background: "rgba(0,166,196,0.12)", color: "#00A6C4", border: "1px solid rgba(0,166,196,0.25)" }}>
      {text}
    </span>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
      <span className="text-4xl">{icon}</span>
      <p className="text-sm">{text}</p>
    </div>
  );
}

// ── Static data ───────────────────────────────────────────────────────────────

const VALUES = [
  { icon: FiShield,     title: "Transparency First",       desc: "Clear pricing, no hidden fees. You always know what you're paying for." },
  { icon: FiZap,        title: "Speed Without Compromise", desc: "Quick response times without cutting corners on quality." },
  { icon: FiHeart,      title: "Every Customer Matters",   desc: "We're a growing startup — your experience directly shapes how we improve." },
  { icon: FiTrendingUp, title: "Continuous Improvement",   desc: "We learn from every job and keep getting better." },
  { icon: FiClock,      title: "Reliable & On Time",       desc: "We show up when we say we will, and we follow through." },
  { icon: FiCheckCircle,title: "Honest Advice",            desc: "We'll tell you if a repair isn't worth it — your trust matters more." },
];

const STEPS = [
  { n: "01", title: "Submit Request",  desc: "Describe your issue and upload photos for faster diagnosis." },
  { n: "02", title: "Get a Quote",     desc: "Receive transparent, upfront pricing — no surprises." },
  { n: "03", title: "Track Progress",  desc: "See real-time status updates every step of the way." },
  { n: "04", title: "Done & Delivered",desc: "Secure payment, digital invoice, and peace of mind." },
];

// ── Team Member Card ──────────────────────────────────────────────────────────

function TeamCard({ m, featured = false, delay = 0 }) {
  const [showModal, setShowModal] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <>
      <motion.div ref={ref}
        initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}>
        <motion.div whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(0,166,196,0.14)" }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className={`card flex flex-col items-center text-center h-full relative overflow-hidden ${featured ? "p-8" : "p-6"}`}>

          {/* Featured badge */}
          {featured && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: "rgba(251,191,36,0.15)", color: "#F59E0B", border: "1px solid rgba(251,191,36,0.3)" }}>
              <FiStar className="w-2.5 h-2.5" /> Featured
            </div>
          )}

          {/* Circular avatar */}
          <div className="relative mb-4">
            {m.image
              ? <img src={assetUrl(m.image)} alt={m.name}
                  className={`rounded-full object-cover ring-4 ${featured ? "w-28 h-28 ring-[#00A6C4]/30" : "w-20 h-20 ring-[var(--color-border)]"}`} />
              : <div className={`rounded-full flex items-center justify-center font-black text-white ${featured ? "w-28 h-28 text-4xl" : "w-20 h-20 text-2xl"}`}
                  style={{ background: "linear-gradient(135deg,#1A2C3E,#00A6C4)" }}>
                  {m.name.charAt(0).toUpperCase()}
                </div>
            }
            <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
              style={{ background: "#3AB6FF" }} />
          </div>

          {/* Name + role */}
          <h3 className={`font-bold text-[var(--color-text)] leading-tight ${featured ? "text-lg" : "text-base"}`}>{m.name}</h3>
          <span className="text-xs font-semibold mt-1.5 mb-2 px-3 py-1 rounded-full"
            style={{ background: "rgba(0,166,196,0.1)", color: "#00A6C4" }}>
            {m.role}
          </span>

          {/* Location + experience */}
          <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
            {m.location && (
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <FiMapPin className="w-2.5 h-2.5" />{m.location}
              </span>
            )}
            {m.experience && (
              <span className="text-[10px] text-slate-400">{m.experience}</span>
            )}
          </div>

          {/* Bio */}
          {m.bio && (
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mb-4 flex-1 line-clamp-3">
              {m.bio}
            </p>
          )}

          {/* Skills */}
          {m.skills?.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mb-4">
              {m.skills.slice(0, featured ? 5 : 3).map(s => (
                <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ background: "rgba(0,166,196,0.08)", color: "#00A6C4", border: "1px solid rgba(0,166,196,0.2)" }}>
                  {s}
                </span>
              ))}
              {m.skills.length > (featured ? 5 : 3) && (
                <span className="px-2 py-0.5 rounded-full text-[10px] text-slate-400 bg-slate-100">
                  +{m.skills.length - (featured ? 5 : 3)}
                </span>
              )}
            </div>
          )}

          {/* Footer: LinkedIn + work images */}
          <div className="flex items-center justify-center gap-3 mt-auto pt-3 border-t border-[var(--color-border)] w-full">
            {m.linkedin && (
              <a href={m.linkedin} target="_blank" rel="noreferrer"
                className="flex items-center gap-1 text-xs font-semibold transition-colors hover:text-[#0077B5]"
                style={{ color: "#0077B5" }}>
                <FiLinkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}
            {m.workImages?.length > 0 && (
              <button onClick={() => setShowModal(true)}
                className="text-xs font-semibold transition-colors hover:text-[#00A6C4]"
                style={{ color: "#00A6C4" }}>
                View Work ({m.workImages.length})
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Work images modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-slate-900">{m.name}'s Work</p>
                  <p className="text-xs text-slate-500">{m.role}</p>
                </div>
                <button onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
                  <FiX className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {m.workImages.map((img, i) => (
                  <img key={i} src={assetUrl(img)} alt={`Work ${i + 1}`}
                    className="w-full aspect-square object-cover rounded-xl" />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Team Section ──────────────────────────────────────────────────────────────

function TeamSection({ team }) {
  // Only show visible members (respect admin visibility toggle)
  const visible = team.filter(m => m.visible !== false);
  const featured = visible.filter(m => m.featured);
  const regular  = visible.filter(m => !m.featured);

  if (!visible.length) return null;

  return (
    <section className="ct-section ct-container max-w-6xl mx-auto">
      <FadeIn className="text-center mb-12">
        <SectionLabel text="The People" />
        <h2 className="ct-h2 text-[var(--color-text)]">Meet Our Team</h2>
        <p className="text-[var(--color-text-muted)] text-sm mt-2 max-w-xl mx-auto">
          The people behind every repair, every support call, and every satisfied customer.
        </p>
      </FadeIn>

      {/* Growing team nudge */}
      {visible.length <= 3 && (
        <FadeIn className="mb-8">
          <div className="flex items-center justify-center gap-3 px-5 py-3 rounded-2xl max-w-sm mx-auto"
            style={{ background: "rgba(0,166,196,0.08)", border: "1px solid rgba(0,166,196,0.2)" }}>
            <span className="text-lg">🌱</span>
            <p className="text-xs font-medium" style={{ color: "#00A6C4" }}>
              Our team is growing — we're a small but dedicated crew.
            </p>
          </div>
        </FadeIn>
      )}

      {/* Featured members — larger cards */}
      {featured.length > 0 && (
        <div className={`grid gap-6 mb-10 ${featured.length === 1 ? "max-w-sm mx-auto" : featured.length === 2 ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
          {featured.map((m, i) => (
            <TeamCard key={m._id} m={m} featured delay={i * 0.1} />
          ))}
        </div>
      )}

      {/* Divider between featured and regular */}
      {featured.length > 0 && regular.length > 0 && (
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Team Members</span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>
      )}

      {/* Regular members */}
      {regular.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {regular.map((m, i) => (
            <TeamCard key={m._id} m={m} delay={i * 0.07} />
          ))}
        </div>
      )}
    </section>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function About() {
  const [team,         setTeam]         = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery,      setGallery]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    Promise.all([
      api.get("/team").catch(() => ({ data: { members: [] } })),
      api.get("/testimonials").catch(() => ({ data: { testimonials: [] } })),
      api.get("/work-gallery").catch(() => ({ data: { items: [] } })),
    ]).then(([t, r, g]) => {
      setTeam(t.data.members || []);
      setTestimonials(r.data.testimonials || []);
      setGallery(g.data.items || []);
    }).finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(gallery.map(g => g.category).filter(Boolean)))];
  const filteredGallery = activeCategory === "All" ? gallery : gallery.filter(g => g.category === activeCategory);

  return (
    <div className="w-full bg-[var(--color-page)]">
      <SEO
        title="About Coldtech Technologies — IT Repair Startup in Pune"
        description="Coldtech Technologies is a growing IT repair startup in Pune. We offer honest, transparent computer repair, data recovery, network setup and IT support. Every customer matters to us."
        keywords="about Coldtech Technologies, IT repair company Pune, computer repair startup Pune, IT support team Pune, laptop repair Pune, trusted IT company Pune"
        canonical="/about"
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Coldtech Technologies",
          "url": "https://coldtechtechnologies.in/about",
          "description": "Coldtech Technologies is a growing IT repair startup in Pune offering honest, transparent computer repair, data recovery, and IT support.",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://coldtechtechnologies.in/" },
              { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://coldtechtechnologies.in/about" }
            ]
          },
          "mainEntity": {
            "@type": "LocalBusiness",
            "name": "Coldtech Technologies",
            "description": "IT repair and support services in Pune — laptop repair, data recovery, network setup, software installation.",
            "url": "https://coldtechtechnologies.in",
            "telephone": "+91-9529882920",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Pune",
              "addressRegion": "Maharashtra",
              "postalCode": "410507",
              "addressCountry": "IN"
            }
          }
        }}
      />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #1A2C3E 0%, #0e3a52 55%, #0a2a3e 100%)" }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: "rgba(0,166,196,0.2)", color: "#00A6C4", border: "1px solid rgba(0,166,196,0.3)" }}>
            About Us
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-white mb-4">
            Coldtech Technologies — IT Repair & Support in Pune
          </h1>
          <p className="text-cyan-300 font-medium mb-4 text-lg">Honest IT Support, Simplified</p>
          <p className="text-blue-200 text-base leading-relaxed">
            We're a growing startup based in Pune, and every customer matters to us. We fix real problems, give honest advice, and keep you in the loop — no corporate fluff.
          </p>
        </motion.div>
      </div>

      {/* ── Story ── */}
      <section className="ct-section ct-container max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <SectionLabel text="Our Story" />
            <h2 className="ct-h2 text-[var(--color-text)] mb-4">How We Started</h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed text-base mb-4">
              Coldtech Technologies started with a simple frustration — getting IT help was too slow, too expensive, and too confusing. We decided to do it differently: show up on time, explain things clearly, and charge fairly.
            </p>
            <p className="text-[var(--color-text-muted)] leading-relaxed text-base mb-4">
              We're still early in our journey. We've successfully completed multiple service requests, built a growing customer base, and learned something from every single job.
            </p>
            <p className="text-sm font-semibold" style={{ color: "#00A6C4" }}>
              We're a growing startup, and every customer matters to us.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="rounded-3xl p-px shadow-xl" style={{ background: "linear-gradient(135deg, #00A6C4, #1A2C3E)" }}>
              <div className="rounded-3xl p-8" style={{ background: "linear-gradient(135deg, #1A2C3E, #0e3a52)" }}>
                <div className="space-y-4">
                  {[
                    { icon: "🔧", label: "Hardware Repair",     desc: "Laptops, desktops, peripherals" },
                    { icon: "💾", label: "Data Recovery",       desc: "Lost files, failed drives" },
                    { icon: "🌐", label: "Network Setup",       desc: "WiFi, LAN, remote support" },
                    { icon: "⚡", label: "Performance Upgrades",desc: "RAM, SSD, OS reinstall" },
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                      <span className="text-xl">{s.icon}</span>
                      <div>
                        <p className="text-white text-sm font-semibold">{s.label}</p>
                        <p className="text-blue-300 text-xs">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="ct-section" style={{ background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)" }}>
        <div className="ct-container max-w-4xl mx-auto">
          <FadeIn className="text-center mb-10">
            <SectionLabel text="Purpose" />
            <h2 className="ct-h2 text-[var(--color-text)]">Mission & Vision</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { emoji: "🎯", title: "Our Mission", text: "To make IT support accessible, honest, and stress-free for individuals and small businesses in Pune. We fix problems, explain what happened, and make sure it doesn't happen again." },
              { emoji: "🔭", title: "Our Vision",  text: "To become the most trusted local IT partner in Pune — not by being the biggest, but by being the most reliable and transparent option for every customer we serve." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <div className="p-px rounded-2xl h-full" style={{ background: "linear-gradient(135deg, #00A6C4, #1A2C3E)" }}>
                  <div className="bg-white rounded-2xl p-7 h-full">
                    <div className="text-3xl mb-3">{item.emoji}</div>
                    <h3 className="text-base font-bold text-[var(--color-text)] mb-2">{item.title}</h3>
                    <p className="text-[var(--color-text-muted)] leading-relaxed text-sm">{item.text}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="ct-section ct-container max-w-5xl mx-auto">
        <FadeIn className="text-center mb-10">
          <SectionLabel text="What We Stand For" />
          <h2 className="ct-h2 text-[var(--color-text)]">Our Values</h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VALUES.map((v, i) => (
            <FadeIn key={i} delay={i * 0.07}>
              <motion.div whileHover={{ y: -3 }} className="service-card p-5 h-full">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: "linear-gradient(135deg, #1A2C3E, #00A6C4)" }}>
                  <v.icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-[var(--color-text)] text-sm mb-1">{v.title}</h3>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{v.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="ct-section" style={{ background: "linear-gradient(135deg, #1A2C3E, #0e3a52)" }}>
        <div className="ct-container max-w-5xl mx-auto">
          <FadeIn className="text-center mb-12">
            <SectionLabel text="The Process" />
            <h2 className="ct-h2 text-white">How It Works</h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 text-lg font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #00A6C4, #2E8B57)" }}>
                    {s.n}
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-blue-300 leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team (conditional) ── */}
      {!loading && team.length > 0 && (
        <TeamSection team={team} />
      )}

      {/* ── Work Gallery (conditional) ── */}
      {!loading && gallery.length > 0 && (
        <section className="ct-section" style={{ background: "linear-gradient(135deg, #f8fafc, #f0f9ff)" }}>
          <div className="ct-container max-w-6xl mx-auto">
            <FadeIn className="text-center mb-8">
              <SectionLabel text="Our Work" />
              <h2 className="ct-h2 text-[var(--color-text)]">Work Gallery</h2>
              <p className="text-[var(--color-text-muted)] text-sm mt-2">Real jobs, real results.</p>
            </FadeIn>

            {/* Category filter */}
            {categories.length > 2 && (
              <FadeIn className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={activeCategory === cat
                      ? { background: "#00A6C4", color: "#fff" }
                      : { background: "rgba(0,166,196,0.08)", color: "#00A6C4", border: "1px solid rgba(0,166,196,0.2)" }}>
                    {cat}
                  </button>
                ))}
              </FadeIn>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGallery.map((item, i) => (
                <FadeIn key={item._id} delay={i * 0.06}>
                  <motion.div whileHover={{ y: -3 }} className="card overflow-hidden">
                    <div className="relative" style={{ aspectRatio: "4/3" }}>
                      <img src={assetUrl(item.image)} alt={item.title}
                        className="w-full h-full object-cover" />
                      {item.category && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-[var(--color-text)] text-sm">{item.title}</p>
                      {item.description && <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">{item.description}</p>}
                    </div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials (conditional) ── */}
      {!loading && testimonials.length > 0 && (
        <section className="ct-section" style={{ background: "linear-gradient(135deg, #f0fdf4, #e0f2fe)" }}>
          <div className="ct-container max-w-5xl mx-auto">
            <FadeIn className="text-center mb-10">
              <SectionLabel text="What Customers Say" />
              <h2 className="ct-h2 text-[var(--color-text)]">Real Reviews</h2>
              <p className="text-[var(--color-text-muted)] text-sm mt-2">From real customers — unedited.</p>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((t, i) => (
                <FadeIn key={t._id} delay={i * 0.08}>
                  <motion.div whileHover={{ y: -3 }} className="card p-6 h-full flex flex-col">
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed flex-1 italic">"{t.review}"</p>
                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[var(--color-border)]">
                      {t.image
                        ? <img src={assetUrl(t.image)} alt={t.customerName}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                        : <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #1A2C3E, #00A6C4)" }}>
                            {t.customerName[0]}
                          </div>
                      }
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text)]">{t.customerName}</p>
                        {t.location && (
                          <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                            <FiMapPin className="w-3 h-3" />{t.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="ct-section" style={{ background: "linear-gradient(135deg, #1A2C3E, #0e3a52)" }}>
        <div className="ct-container max-w-2xl mx-auto text-center">
          <FadeIn>
            <h2 className="ct-h2 text-white mb-3">Got a tech problem?</h2>
            <p className="text-blue-200 mb-8 text-sm leading-relaxed">
              We'll give you an honest assessment and a fair price. No pressure, no jargon.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/services/request">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="btn-cyan flex items-center gap-2">
                  Request a Service <FiArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="btn-outline flex items-center gap-2"
                  style={{ color: "#fff", borderColor: "rgba(255,255,255,0.35)" }}>
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
