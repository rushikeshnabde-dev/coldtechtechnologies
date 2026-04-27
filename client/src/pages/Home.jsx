import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FiArrowRight, FiChevronDown, FiCheck, FiMessageCircle,
  FiWifi, FiDownload, FiUsers, FiClock,
  FiChevronLeft, FiChevronRight,
} from "react-icons/fi";
import { FaLaptop, FaWrench, FaDatabase } from "react-icons/fa";
import { api } from "../services/api";
import { SEO } from "../components/SEO";
import { BannerCarousel } from "../components/BannerCarousel";

/* ─── static data ─── */
const SERVICES = [
  {
    icon: FaLaptop,
    title: "Laptop & Desktop Repair",
    tagline: "Hardware issues fixed fast",
    color: "#0EA5E9",
    emoji: "💻",
    desc: "From cracked screens to dead motherboards — we diagnose and fix all hardware problems for laptops and desktops of every brand.",
    features: ["Screen & keyboard replacement", "Motherboard & chip-level repair", "Battery replacement", "Overheating & fan issues", "Power jack repair"],
    time: "1–3 days",
    price: "Starting ₹499",
  },
  {
    icon: FaDatabase,
    title: "Data Recovery",
    tagline: "Lost files? We get them back",
    color: "#8B5CF6",
    emoji: "🗄️",
    desc: "Accidentally deleted files, crashed hard drives, or corrupted storage? We use professional tools to recover your precious data safely.",
    features: ["HDD / SSD data recovery", "Deleted file recovery", "Formatted drive recovery", "RAID & NAS recovery", "Pen drive & SD card recovery"],
    time: "2–5 days",
    price: "Starting ₹999",
  },
  {
    icon: FiWifi,
    title: "Network Setup",
    tagline: "Fast, stable connectivity",
    color: "#10B981",
    emoji: "📡",
    desc: "Whether it's a home WiFi setup or a full office network, we configure routers, switches, and remote access so you stay connected.",
    features: ["WiFi router setup & config", "LAN / structured cabling", "VPN & remote access", "Network troubleshooting", "Firewall & security setup"],
    time: "Same day",
    price: "Starting ₹799",
  },
  {
    icon: FiDownload,
    title: "Software Installation",
    tagline: "Clean installs, zero bloat",
    color: "#F59E0B",
    emoji: "⚙️",
    desc: "Fresh OS installs, driver updates, licensed software setup — we make sure your system runs clean, fast, and fully up to date.",
    features: ["Windows / Linux OS install", "Driver & firmware updates", "Office & productivity apps", "Antivirus & security tools", "Software troubleshooting"],
    time: "Same day",
    price: "Starting ₹399",
  },
  {
    icon: FiUsers,
    title: "IT Support for Offices",
    tagline: "Keep your team productive",
    color: "#EF4444",
    emoji: "🏢",
    desc: "Ongoing IT support for small and medium businesses — from setting up workstations to managing your entire IT infrastructure.",
    features: ["Workstation setup & config", "Email & domain setup", "Server & cloud management", "Monthly AMC contracts", "On-site & remote support"],
    time: "Flexible",
    price: "Custom plans",
  },
  {
    icon: FaWrench,
    title: "Performance Optimization",
    tagline: "Make your device feel new",
    color: "#06B6D4",
    emoji: "🚀",
    desc: "Slow device? We clean up junk, remove malware, upgrade RAM or SSD, and tune your system so it runs like it did on day one.",
    features: ["RAM & SSD upgrades", "Malware & junk removal", "Startup optimization", "Thermal paste replacement", "Full system health check"],
    time: "Same day",
    price: "Starting ₹299",
  },
];

const STEPS = [
  {
    n: "01", icon: FaLaptop, color: "#0EA5E9",
    title: "Submit Your Issue",
    tagline: "Tell us what's wrong",
    desc: "Fill out our quick service request form — describe your device, the problem, and your preferred schedule. No technical knowledge needed, just tell us what's happening.",
    details: ["Takes less than 3 minutes", "No login required to start", "Upload photos of the issue", "Choose pickup or drop-off"],
    cta: "Submit a Request",
  },
  {
    n: "02", icon: FiClock, color: "#8B5CF6",
    title: "Free Diagnosis & Quote",
    tagline: "Know the cost upfront",
    desc: "Our technician diagnoses your device and sends you a detailed quote before any work begins. No hidden charges — you approve the price, then we proceed.",
    details: ["100% free diagnosis", "Transparent itemized quote", "No work without your approval", "Response within 2–4 hours"],
    cta: "See Pricing",
  },
  {
    n: "03", icon: FaWrench, color: "#10B981",
    title: "We Fix It",
    tagline: "Expert repair, your way",
    desc: "Choose how you want the service — drop your device at our center, we pick it up from your location, or our technician visits you on-site. We fix it fast and right.",
    details: ["Free pickup & delivery in Pune", "On-site visits available", "Certified technicians only", "30-day repair warranty"],
    cta: "Book a Service",
  },
  {
    n: "04", icon: FiCheck, color: "#F59E0B",
    title: "Track Your Repair",
    tagline: "Real-time updates",
    desc: "Use your unique ticket ID to track every stage of your repair in real time — from diagnosis to completion. We notify you at every step so you're never left wondering.",
    details: ["Live status updates", "SMS & email notifications", "Ticket ID tracking page", "Delivery confirmation"],
    cta: "Track a Request",
  },
];

const FAQS = [
  { q: "How long does a typical repair take?",  a: "Most repairs take 1–3 days. We'll give you an estimate when you submit your issue." },
  { q: "Is my data safe during repair?",        a: "Yes. We never access your personal files unless absolutely necessary, and we always ask first." },
  { q: "What if you can't fix it?",             a: "We'll tell you upfront if a repair isn't worth it. No charge for diagnosis." },
  { q: "Do you offer pickup and delivery?",     a: "Yes, we offer free pickup and delivery in Pune for most repairs." },
  { q: "What payment methods do you accept?",   a: "Cash, UPI, card, and bank transfer. Payment after service is complete." },
  { q: "Do you provide warranty on repairs?",   a: "Yes, 30-day warranty on all repairs. If something breaks, we fix it free." },
];

const PRICING_PILLARS = [
  { icon: "🔍", title: "Free Diagnosis",        desc: "We identify the issue at no cost" },
  { icon: "💰", title: "Affordable Pricing",    desc: "Competitive rates for all services" },
  { icon: "✅", title: "Quote Before Service",  desc: "Know the cost before we start" },
];

/* ─── animation variants ─── */
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: d, ease: "easeOut" } }),
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── reusable helpers ─── */
function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div ref={ref} variants={fadeUp} custom={delay}
      initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ text, color = "#0EA5E9" }) {
  return (
    <motion.span variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
      style={{ background: color + "18", color, border: `1px solid ${color}33` }}>
      {text}
    </motion.span>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="card overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left text-sm font-semibold text-slate-800 hover:text-sky-600 transition-colors">
        {q}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }}>
          <FiChevronDown className="w-4 h-4 flex-shrink-0 text-slate-400" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* shimmer skeleton for loading states */
function Shimmer({ className = "" }) {
  return (
    <div className={`rounded-xl bg-slate-200 overflow-hidden relative ${className}`}>
      <motion.div className="absolute inset-0"
        style={{ background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.6) 50%,transparent 100%)" }}
        animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }} />
    </div>
  );
}

/* ─── HowItWorksPanel — step selector + detail ─── */
function HowItWorksPanel() {
  const [active, setActive] = useState(0);
  const s = STEPS[active];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

      {/* ── left: step selector list ── */}
      <div className="lg:col-span-2 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0"
        style={{ scrollbarWidth: "none" }}>
        {STEPS.map((step, i) => {
          const isActive = i === active;
          return (
            <motion.button key={i} onClick={() => setActive(i)}
              className="flex-shrink-0 lg:flex-shrink flex items-center gap-4 p-4 rounded-2xl text-left w-48 lg:w-full transition-all duration-200 relative overflow-hidden"
              style={{
                background: isActive ? step.color + "12" : "#F8FAFC",
                border: `1.5px solid ${isActive ? step.color + "55" : "#E2E8F0"}`,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}>

              {/* active left bar */}
              {isActive && (
                <motion.div layoutId="stepBar"
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                  style={{ background: step.color }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }} />
              )}

              {/* step badge */}
              <div className="w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0 gap-0.5 transition-all"
                style={{
                  background: isActive ? step.color : "#E2E8F0",
                }}>
                <span className="text-[9px] font-black leading-none" style={{ color: isActive ? "rgba(255,255,255,0.75)" : "#94A3B8" }}>
                  {step.n}
                </span>
                <step.icon className="w-4 h-4" style={{ color: isActive ? "#fff" : "#94A3B8" }} />
              </div>

              <div className="min-w-0">
                <p className="font-bold text-sm leading-tight truncate"
                  style={{ color: isActive ? step.color : "#334155" }}>
                  {step.title}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: isActive ? step.color + "aa" : "#94A3B8" }}>
                  {step.tagline}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── right: detail panel ── */}
      <div className="lg:col-span-3">
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-3xl overflow-hidden"
            style={{ border: `1.5px solid ${s.color}33`, background: "#fff" }}>

            {/* colored header band */}
            <div className="px-7 py-6 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg,${s.color}18,${s.color}08)` }}>
              <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-10"
                style={{ background: s.color }} />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5 flex-shrink-0"
                  style={{ background: s.color }}>
                  <span className="text-[10px] font-black text-white/70 leading-none">{s.n}</span>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-xl leading-tight">{s.title}</h3>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: s.color }}>{s.tagline}</p>
                </div>
              </div>
            </div>

            {/* body */}
            <div className="px-7 py-6">
              <p className="text-sm text-slate-600 leading-relaxed mb-6">{s.desc}</p>

              {/* detail bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                {s.details.map((d, j) => (
                  <motion.div key={j}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: j * 0.08 }}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: s.color + "0d" }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: s.color + "25" }}>
                      <FiCheck className="w-3 h-3" style={{ color: s.color }} />
                    </span>
                    <span className="text-xs font-medium text-slate-700">{d}</span>
                  </motion.div>
                ))}
              </div>

              {/* step nav + CTA */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setActive(i => Math.max(0, i - 1))}
                    disabled={active === 0}
                    className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-sky-400 hover:text-sky-500 disabled:opacity-30 transition bg-white">
                    <FiChevronLeft className="w-4 h-4" />
                  </motion.button>
                  <div className="flex gap-1.5">
                    {STEPS.map((_, i) => (
                      <motion.button key={i} onClick={() => setActive(i)}
                        className="rounded-full" style={{ height: 6 }}
                        animate={{ width: i === active ? "20px" : "6px", background: i === active ? s.color : "#CBD5E1" }}
                        transition={{ duration: 0.3 }} />
                    ))}
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setActive(i => Math.min(STEPS.length - 1, i + 1))}
                    disabled={active === STEPS.length - 1}
                    className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-sky-400 hover:text-sky-500 disabled:opacity-30 transition bg-white">
                    <FiChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>

                <Link to="/services/request">
                  <motion.button whileHover={{ scale: 1.05, boxShadow: `0 10px 24px ${s.color}44` }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ background: `linear-gradient(135deg,${s.color},${s.color}bb)` }}>
                    {s.cta} <FiArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── ServicesPanel — scrollable tabs + animated detail panel ─── */
function ServicesPanel() {
  const [active, setActive] = useState(0);
  const tabsRef = useRef(null);
  const s = SERVICES[active];

  // scroll active tab into view
  useEffect(() => {
    const el = tabsRef.current?.querySelector(`[data-idx="${active}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  return (
    <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">

      {/* ── scrollable tab strip ── */}
      <div ref={tabsRef}
        className="flex gap-0 overflow-x-auto border-b border-slate-100"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
        {SERVICES.map((svc, i) => {
          const isActive = i === active;
          return (
            <button key={i} data-idx={i}
              onClick={() => setActive(i)}
              className="relative flex-shrink-0 flex flex-col items-center gap-1 px-3 py-3 text-xs font-semibold transition-all duration-200"
              style={{ color: isActive ? svc.color : "#94A3B8", minWidth: "80px" }}>
              <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                animate={{ opacity: isActive ? 1 : 0, scaleX: isActive ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                style={{ background: svc.color, transformOrigin: "center" }} />
              <motion.div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                animate={{ background: isActive ? svc.color + "18" : "#F1F5F9", scale: isActive ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}>
                <svc.icon className="w-4 h-4" style={{ color: isActive ? svc.color : "#94A3B8" }} />
              </motion.div>
              <span className="text-center leading-tight whitespace-nowrap text-[10px]">{svc.title.split(" ").slice(0, 2).join(" ")}</span>
            </button>
          );
        })}
      </div>

      {/* ── detail panel ── */}
      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="p-4 md:p-8">

          {/* top accent */}
          <div className="h-1 w-16 rounded-full mb-5" style={{ background: `linear-gradient(90deg,${s.color},${s.color}66)` }} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* left — info */}
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: s.color + "15" }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-900 text-base leading-tight">{s.title}</h3>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: s.color }}>{s.tagline}</p>
                </div>
                <span className="text-2xl">{s.emoji}</span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">{s.desc}</p>

              <div className="flex flex-wrap gap-2 mb-5">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                  <FiClock className="w-3.5 h-3.5" /> {s.time}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: s.color + "15", color: s.color }}>
                  {s.price}
                </span>
              </div>

              <Link to="/services/request">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white w-full sm:w-auto justify-center"
                  style={{ background: `linear-gradient(135deg,${s.color},${s.color}bb)` }}>
                  Book This Service <FiArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>

            {/* right — features */}
            <div className="rounded-2xl p-4" style={{ background: s.color + "08", border: `1px solid ${s.color}22` }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: s.color }}>
                What's Included
              </p>
              <ul className="space-y-2">
                {s.features.map((f, j) => (
                  <motion.li key={j}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: j * 0.06, duration: 0.25 }}
                    className="flex items-center gap-2.5 text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: s.color + "20" }}>
                      <FiCheck className="w-3 h-3" style={{ color: s.color }} />
                    </span>
                    {f}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* service nav dots */}
          <div className="flex justify-center gap-2 mt-8">
            {SERVICES.map((_, i) => (
              <motion.button key={i} onClick={() => setActive(i)}
                className="rounded-full transition-all"
                style={{ height: 6 }}
                animate={{
                  width: i === active ? "24px" : "6px",
                  background: i === active ? s.color : "#CBD5E1",
                }}
                transition={{ duration: 0.3 }} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── main component ─── */
export function Home() {
  const [testimonials, setTestimonials]     = useState(null); // null = loading
  const [gallery,      setGallery]          = useState(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [showChat,     setShowChat]         = useState(false);

  /* fetch data */
  useEffect(() => {
    api.get("/testimonials")
      .then(r => setTestimonials(r.data.testimonials || []))
      .catch(() => setTestimonials([]));
    api.get("/work-gallery")
      .then(r => setGallery(r.data.gallery || []))
      .catch(() => setGallery([]));
    const t = setTimeout(() => setShowChat(true), 2500);
    return () => clearTimeout(t);
  }, []);

  /* auto-rotate testimonials */
  useEffect(() => {
    if (!testimonials?.length) return;
    const id = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, [testimonials]);

  return (
    <div className="w-full bg-[var(--color-page)] overflow-x-hidden">
      <SEO
        title="Fast & Reliable Laptop Repair & IT Support Services in Pune"
        description="Coldtech Technologies — expert laptop repair, data recovery, network setup and IT support in Pune. Free diagnosis, transparent pricing, 30-day warranty. Call +91 95298 82920."
        keywords="laptop repair Pune, computer repair near me, IT support Pune, data recovery Pune, refurbished laptops Pune, network setup Pune, IT solutions Pune, laptop repair near me Pune"
        canonical="/"
        breadcrumbs={[{ name: "Home", url: "/" }]}
        faqSchema={FAQS.map(f => ({ q: f.q, a: f.a }))}
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Coldtech Technologies — Laptop Repair & IT Support in Pune",
          "url": "https://coldtechtechnologies.in/",
          "description": "Expert laptop repair, data recovery, network setup and IT support in Pune. Free diagnosis, transparent pricing, 30-day warranty.",
          "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", "h2"] }
        }}
      />

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-24 xl:py-32 2xl:py-40 px-6 md:px-10 lg:px-16"
        style={{ background: "linear-gradient(135deg,#0f172a 0%,#0f2744 55%,#1e293b 100%)" }}>

        {/* dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "34px 34px" }} />

        {/* animated glow orbs */}
        {[
          { w: 420, h: 420, top: "-120px", left: "-120px", color: "#0EA5E9" },
          { w: 320, h: 320, bottom: "-80px", right: "-80px", color: "#10B981" },
        ].map((o, i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width: o.w, height: o.h, top: o.top, left: o.left, bottom: o.bottom, right: o.right,
              background: o.color, opacity: 0.12, filter: "blur(90px)" }}
            animate={{ scale: [1, 1.18, 1], x: [0, 18, 0], y: [0, -18, 0] }}
            transition={{ duration: 7 + i * 2, repeat: Infinity, ease: "easeInOut" }} />
        ))}

        <div className="relative z-10 max-w-7xl 2xl:max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-center">

          {/* left — text */}
          <div className="hero-text-xl">
            <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-widest max-w-full"
              style={{ background: "rgba(14,165,233,0.18)", color: "#38BDF8", border: "1px solid rgba(14,165,233,0.3)" }}>
              <motion.span className="w-2 h-2 flex-shrink-0 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
              <span className="truncate">Expert IT Repair · Data Recovery · Support</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 text-white"
              style={{ fontFamily: "var(--font-display)" }}>
              Fast &amp; Reliable{" "}
              <span className="grad-anim"
                style={{ backgroundImage: "linear-gradient(135deg,#38BDF8,#0EA5E9,#10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                IT Repair &amp; Support
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl xl:max-w-2xl">
              Laptop repair, data recovery, network setup, software installation, and IT support for offices.
              Free diagnosis · Transparent pricing · 30-day warranty.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4">
              <Link to="/services/request" className="w-full sm:w-auto">
                <motion.button whileHover={{ scale: 1.07, boxShadow: "0 14px 36px rgba(58,182,255,0.45)" }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full sm:w-auto h-14 flex items-center justify-center gap-2 px-8 rounded-xl font-bold text-base text-white btn-primary">
                  Book a Service <FiArrowRight className="w-4 h-4 flex-shrink-0" />
                </motion.button>
              </Link>
              <Link to="/services/request" className="w-full sm:w-auto">
                <motion.button whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.14)" }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full sm:w-auto h-14 flex items-center justify-center gap-2 px-8 rounded-xl font-bold text-white text-base border-2 transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.07)" }}>
                  View Services <FiArrowRight className="w-4 h-4 flex-shrink-0" />
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* right — command center card */}
          <motion.div initial={{ opacity: 0, scale: 0.88, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block">
            <motion.div animate={{ y: [0, -16, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-3xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(18px)" }}>
              <div className="px-6 pt-6 pb-3 text-center">
                <motion.div className="text-4xl mb-2"
                  animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>🖥️</motion.div>
                <p className="text-white font-bold text-lg mb-0.5">Your IT Command Center</p>
                <p className="text-slate-400 text-xs">Latest updates and offers</p>
              </div>
              <div className="px-4 pb-4"><BannerCarousel /></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SERVICES — scrollable tabs + detail panel
      ══════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-10 lg:px-16 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-12">
            <SectionLabel text="What We Offer" color="#1E293B" />
            <h2 className="ct-h2 text-slate-900">Our Services</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
              We handle all your IT needs — from quick fixes to complete system overhauls.
            </p>
          </FadeUp>

          <ServicesPanel />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <SectionLabel text="The Process" />
            <h2 className="ct-h2 text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              From submitting your issue to getting your device back — here's exactly what happens.
            </p>
          </FadeUp>

          <HowItWorksPanel />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRICING PILLARS
      ══════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-10 lg:px-16 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-14">
            <SectionLabel text="Pricing" color="#1E293B" />
            <h2 className="ct-h2 text-slate-900">Transparent, Honest Pricing</h2>
            <p className="text-slate-500 mt-3">No hidden fees. No surprises.</p>
          </FadeUp>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            {PRICING_PILLARS.map((item, i) => (
              <motion.div key={i} variants={fadeUp} custom={i * 0.1}>
                <motion.div className="card p-8 text-center h-full"
                  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(58,182,255,0.15)" }}>
                  <motion.div className="text-4xl mb-4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.4 }}>
                    {item.icon}
                  </motion.div>
                  <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS CAROUSEL
      ══════════════════════════════════════════ */}
      {testimonials === null ? (
        /* shimmer loading */
        <section className="py-20 px-6 md:px-10 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <Shimmer className="h-8 w-48 mx-auto mb-4" />
            <Shimmer className="h-56 w-full" />
          </div>
        </section>
      ) : testimonials.length > 0 && (
        <section className="py-20 px-6 md:px-10 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <FadeUp className="text-center mb-10">
              <SectionLabel text="Testimonials" />
              <h2 className="ct-h2 text-slate-900">What Customers Say</h2>
            </FadeUp>

            <div className="relative px-8 md:px-12">
              <AnimatePresence mode="wait">
                <motion.div key={testimonialIdx}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="card p-8 md:p-10">
                  <div className="flex gap-1 mb-4">
                    {Array(5).fill(0).map((_, j) => (
                      <motion.span key={j} className="text-yellow-400 text-lg"
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: j * 0.07, type: "spring", stiffness: 300 }}>★</motion.span>
                    ))}
                  </div>
                  <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-8 italic font-light">
                    "{testimonials[testimonialIdx].review}"
                  </p>
                  <div className="flex items-center gap-4">
                    {testimonials[testimonialIdx].image && (
                      <img src={testimonials[testimonialIdx].image}
                        alt={testimonials[testimonialIdx].name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-sky-200 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{testimonials[testimonialIdx].name}</p>
                      {testimonials[testimonialIdx].location && (
                        <p className="text-xs text-slate-500 truncate">{testimonials[testimonialIdx].location}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* prev / next — positioned inside padded wrapper so they don't overflow */}
              {testimonials.length > 1 && (
                <>
                  <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setTestimonialIdx(i => (i - 1 + testimonials.length) % testimonials.length)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-sky-600 hover:bg-sky-50 transition">
                    <FiChevronLeft className="w-4 h-4" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setTestimonialIdx(i => (i + 1) % testimonials.length)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-sky-600 hover:bg-sky-50 transition">
                    <FiChevronRight className="w-4 h-4" />
                  </motion.button>
                </>
              )}

              {/* dots */}
              <div className="flex justify-center items-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                  <motion.button key={i} onClick={() => setTestimonialIdx(i)}
                    className="rounded-full"
                    style={{ height: 8 }}
                    animate={{
                      width:      i === testimonialIdx ? "24px" : "8px",
                      background: i === testimonialIdx ? "#0EA5E9" : "#CBD5E1",
                    }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.2 }} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          WORK GALLERY
      ══════════════════════════════════════════ */}
      {gallery === null ? (
        <section className="py-20 px-6 md:px-10 lg:px-16 bg-slate-50">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(k => <Shimmer key={k} className="h-64" />)}
          </div>
        </section>
      ) : gallery.length > 0 && (
        <section className="py-20 px-6 md:px-10 lg:px-16 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <FadeUp className="text-center mb-14">
              <SectionLabel text="Our Work" color="#1E293B" />
              <h2 className="ct-h2 text-slate-900">Recent Repairs &amp; Projects</h2>
            </FadeUp>

            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              {gallery.slice(0, 6).map((item, i) => (
                <motion.div key={i} variants={fadeUp} custom={i * 0.07} className="h-full">
                  <motion.div className="card overflow-hidden cursor-pointer h-full flex flex-col"
                    whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}>
                    {item.image && (
                      <div className="relative overflow-hidden h-48 bg-slate-100">
                        <motion.img src={item.image} alt={item.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.12 }}
                          transition={{ duration: 0.4 }} />
                        {/* hover overlay */}
                        <motion.div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"
                          initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                          <p className="text-white font-bold text-sm">{item.title}</p>
                        </motion.div>
                      </div>
                    )}
                    <div className="p-5 flex-1">
                      <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                      {item.description && <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>}
                      {item.category && (
                        <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-10 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <FadeUp className="text-center mb-10">
            <SectionLabel text="FAQ" />
            <h2 className="ct-h2 text-slate-900">Common Questions</h2>
          </FadeUp>
          <div className="space-y-3">
            {FAQS.map((f, i) => <FaqItem key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-10 lg:px-16 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0f172a,#0f2744,#1e293b)" }}>

        {/* pulsing radial glow */}
        <motion.div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%,rgba(14,165,233,0.14),transparent 68%)" }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeUp>
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }} viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black text-white mb-5">
              Need Help with Your Device?
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }} viewport={{ once: true }}
              className="text-slate-400 mb-10 text-lg">
              Book a service in minutes and get it fixed fast.
            </motion.p>
            <Link to="/services/request">
              <motion.button
                whileHover={{ scale: 1.08, boxShadow: "0 20px 48px rgba(58,182,255,0.45)" }}
                whileTap={{ scale: 0.96 }}
                animate={{ boxShadow: ["0 0 0 0 rgba(58,182,255,0.4)", "0 0 0 14px rgba(58,182,255,0)", "0 0 0 0 rgba(58,182,255,0)"] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="btn-primary px-10 py-5 text-lg font-black rounded-2xl">
                Request Service <FiArrowRight className="inline w-5 h-5 ml-1" />
              </motion.button>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FLOATING SUPPORT BUTTON
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {showChat && (
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-24 right-6 z-[9999]">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl">
              <FiMessageCircle className="w-5 h-5" />
              <span className="text-sm font-bold">Support 24/7</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
