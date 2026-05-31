import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FiArrowRight, FiChevronDown, FiCheck,
  FiWifi, FiDownload, FiUsers, FiClock,
  FiChevronLeft, FiChevronRight, FiShield, FiStar, FiTrendingUp,
} from "react-icons/fi";
import { FaLaptop, FaWrench, FaDatabase, FaWhatsapp } from "react-icons/fa";
import { api } from "../services/api";
import { SEO } from "../components/SEO";

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

const TRUST_STATS = [
  { value: "2,500+", label: "Devices Repaired",     icon: FaLaptop },
  { value: "98%",    label: "Customer Satisfaction", icon: FiStar },
  { value: "30-Day", label: "Repair Warranty",       icon: FiShield },
  { value: "< 4hrs", label: "Avg Response Time",     icon: FiClock },
  { value: "5+",     label: "Years Experience",      icon: FiTrendingUp },
];

const MARQUEE_ROW1 = [
  { icon: "💻", text: "2,500+ Devices Repaired",    color: "#0EA5E9" },
  { icon: "⭐", text: "4.9 / 5 Customer Rating",   color: "#F59E0B" },
  { icon: "🔒", text: "30-Day Repair Warranty",     color: "#8B5CF6" },
  { icon: "⚡", text: "< 4hrs Response Time",       color: "#F59E0B" },
  { icon: "🏆", text: "5+ Years of Experience",     color: "#10B981" },
  { icon: "📍", text: "Serving Pune & PCMC",        color: "#0EA5E9" },
  { icon: "🔧", text: "Certified Technicians",      color: "#06B6D4" },
  { icon: "📊", text: "98% Satisfaction Rate",      color: "#10B981" },
];

const MARQUEE_ROW2 = [
  { icon: "✅", text: "Free Diagnosis — Always",    color: "#10B981" },
  { icon: "🚀", text: "Same-Day Repairs Available", color: "#EF4444" },
  { icon: "🏠", text: "Free Pickup & Delivery",     color: "#0EA5E9" },
  { icon: "💳", text: "Pay After Service Done",     color: "#8B5CF6" },
  { icon: "📱", text: "All Brands Supported",       color: "#06B6D4" },
  { icon: "🛡️", text: "Your Data is Safe",          color: "#8B5CF6" },
  { icon: "💰", text: "Transparent Pricing",        color: "#F59E0B" },
  { icon: "🤝", text: "Trusted by 2500+ Customers", color: "#10B981" },
];

const HERO_STATS = [
  { value: "2,500+", label: "Devices Fixed",   color: "#0EA5E9", icon: "💻" },
  { value: "98%",    label: "Satisfaction",    color: "#10B981", icon: "⭐" },
  { value: "< 4hrs", label: "Response Time",  color: "#8B5CF6", icon: "⚡" },
  { value: "5+ Yrs", label: "Experience",     color: "#F59E0B", icon: "🏆" },
];

const TYPED_WORDS = ["IT Repair", "Data Recovery", "Network Setup", "IT Support", "Optimization"];

/* ─── animation variants ─── */
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] } }),
};

const fadeLeft = {
  hidden:  { opacity: 0, x: -36 },
  visible: (d = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] } }),
};

const fadeRight = {
  hidden:  { opacity: 0, x: 36 },
  visible: (d = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] } }),
};

const scaleIn = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: (d = 0) => ({ opacity: 1, scale: 1, transition: { duration: 0.5, delay: d, ease: [0.34, 1.56, 0.64, 1] } }),
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── reusable reveal helpers ─── */
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

function FadeLeft({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} variants={fadeLeft} custom={delay}
      initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

function FadeRight({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} variants={fadeRight} custom={delay}
      initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

function ScaleIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} variants={scaleIn} custom={delay}
      initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

function StaggerContainer({ children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} variants={stagger}
      initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ text, color = "#0EA5E9" }) {
  return (
    <motion.span variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-widest"
      style={{ background: color + "18", color, border: `1px solid ${color}33` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {text}
    </motion.span>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="overflow-hidden rounded-2xl transition-all duration-200"
      style={{
        background: open ? "#fff" : "#F8FAFC",
        border: `1.5px solid ${open ? "rgba(14,165,233,0.3)" : "#E2E8F0"}`,
        boxShadow: open ? "0 8px 32px rgba(14,165,233,0.08)" : "none",
      }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left text-sm font-semibold text-slate-800 hover:text-sky-600 transition-colors gap-4">
        <span>{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-shrink-0">
          <FiChevronDown className="w-4 h-4 text-slate-400" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: "easeInOut" }} className="overflow-hidden">
            <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Shimmer({ className = "" }) {
  return (
    <div className={`rounded-xl bg-slate-200 overflow-hidden relative ${className}`}>
      <motion.div className="absolute inset-0"
        style={{ background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.6) 50%,transparent 100%)" }}
        animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }} />
    </div>
  );
}

/* ─── MarqueeItem ─── */
function MarqueeItem({ item }) {
  return (
    <motion.div
      whileHover={{ scale: 1.06, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex items-center gap-2.5 mx-3 px-4 py-2 rounded-full flex-shrink-0 cursor-default select-none"
      style={{ background: item.color + "12", border: `1px solid ${item.color}28` }}>
      <span className="text-base leading-none">{item.icon}</span>
      <span className="text-xs font-bold whitespace-nowrap" style={{ color: item.color }}>{item.text}</span>
    </motion.div>
  );
}

/* ─── AnimatedCounter ─── */
function AnimatedCounter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  const match = value.match(/^([^0-9]*)([0-9,]+)(.*)$/);
  const num = match ? parseInt(match[2].replace(/,/g, ""), 10) : 0;

  useEffect(() => {
    if (!inView || !match) return;
    const duration = 1500;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * num));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView]);

  if (!match) return <span ref={ref}>{value}</span>;
  const display = count >= 1000 ? count.toLocaleString() : String(count);
  return <span ref={ref}>{match[1]}{display}{match[3]}</span>;
}

/* ─── TypedText ─── */
function TypedText() {
  const [idx, setIdx] = useState(0);
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = TYPED_WORDS[idx];
    let t;
    if (!deleting && display.length < word.length) {
      t = setTimeout(() => setDisplay(word.slice(0, display.length + 1)), 80);
    } else if (!deleting && display.length === word.length) {
      t = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && display.length > 0) {
      t = setTimeout(() => setDisplay(d => d.slice(0, -1)), 45);
    } else if (deleting && display.length === 0) {
      setDeleting(false);
      setIdx(i => (i + 1) % TYPED_WORDS.length);
    }
    return () => clearTimeout(t);
  }, [display, deleting, idx]);

  return (
    <span className="grad-anim inline-block"
      style={{ backgroundImage: "linear-gradient(135deg,#38BDF8,#0EA5E9,#4FD1C5,#38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", backgroundSize: "300% 300%" }}>
      {display}
      <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
        style={{ WebkitTextFillColor: "#38BDF8", marginLeft: "2px" }}>|</motion.span>
    </span>
  );
}

/* ─── HeroCard ─── */
function HeroCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="hidden lg:flex items-center justify-center relative py-8">

      {/* Central glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 60% 50%, rgba(14,165,233,0.15) 0%, transparent 65%)" }} />

      {/* Main floating card */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-3xl p-6 w-80 z-10"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.13)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 32px 72px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}>

        {/* Card header */}
        <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#0EA5E9,#0284C7)" }}>
            🖥️
          </motion.div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Coldtech Technologies</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }} />
              <p className="text-emerald-400 text-[11px] font-semibold">Open · Available Now</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {HERO_STATS.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 220, damping: 18 }}
              className="rounded-2xl p-3"
              style={{ background: `${s.color}18`, border: `1px solid ${s.color}28` }}>
              <div className="text-base mb-1">{s.icon}</div>
              <p className="text-white font-black text-base leading-none">{s.value}</p>
              <p className="text-[11px] mt-0.5 font-semibold" style={{ color: s.color }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA row */}
        <motion.div
          className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer"
          style={{ background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.2)" }}
          whileHover={{ background: "rgba(14,165,233,0.16)" }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: "rgba(14,165,233,0.2)" }}>🔧</div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold">Free Diagnosis</p>
            <p className="text-slate-400 text-[10px]">No charge to check your device</p>
          </div>
          <FiArrowRight className="w-4 h-4 text-sky-400 flex-shrink-0" />
        </motion.div>
      </motion.div>

      {[
        { label: "30-Day Warranty",  icon: "✓",  color: "16,185,129",  pos: "left-0 top-10",                         ix: -20, iy: 0,   dur: 3.8, delay: 0.0 },
        { label: "Same-Day Repairs", icon: "🚀", color: "139,92,246",  pos: "right-2 bottom-10",                     ix:  20, iy: 0,   dur: 4.2, delay: 0.5 },
        { label: "4.9 / 5 Rating",   icon: "⭐", color: "245,158,11",  pos: "right-0 top-16",                        ix:  20, iy: 0,   dur: 3.5, delay: 1.0 },
        { label: "Free Pickup",      icon: "🚗", color: "14,165,233",  pos: "left-0 bottom-10",                      ix: -20, iy: 0,   dur: 4.6, delay: 1.4 },
        { label: "Certified Techs",  icon: "🔧", color: "6,182,212",   pos: "left-0 top-1/2 -translate-y-1/2",      ix: -20, iy: 0,   dur: 4.0, delay: 0.7 },
        { label: "No Fix, No Fee",   icon: "🛡️", color: "239,68,68",   pos: "right-0 bottom-28",                     ix:  20, iy: 0,   dur: 4.4, delay: 1.8 },
        { label: "All Brands",       icon: "💻", color: "139,92,246",  pos: "left-1/2 -translate-x-1/2 top-2",      ix:  0,  iy: -16, dur: 3.6, delay: 0.3 },
        { label: "Fast Response",    icon: "⚡", color: "16,185,129",  pos: "left-1/2 -translate-x-1/2 bottom-2",   ix:  0,  iy: 0,   dur: 4.8, delay: 2.1 },
      ].map(({ label, icon, color, pos, ix, iy, dur, delay }) => (
        <motion.div key={label}
          initial={{ opacity: 0, x: ix, y: iy }}
          animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
          transition={{
            opacity: { delay, duration: 0.5 },
            x:       { delay, duration: 0.5 },
            y:       { duration: dur, repeat: Infinity, ease: "easeInOut", delay: 0 },
          }}
          className={`absolute ${pos} flex items-center gap-2 px-4 py-2.5 rounded-2xl z-20`}
          style={{ background: `rgba(${color},0.18)`, border: `1px solid rgba(${color},0.38)`, backdropFilter: "blur(16px)" }}>
          <span className="text-sm leading-none">{icon}</span>
          <span className="text-white text-xs font-bold whitespace-nowrap">{label}</span>
        </motion.div>
      ))}

      {/* Decorative ring */}
      <motion.div
        className="absolute w-80 h-80 rounded-full pointer-events-none z-0"
        style={{ border: "1px solid rgba(14,165,233,0.12)" }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none z-0"
        style={{ border: "1px solid rgba(14,165,233,0.07)" }}
        animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} />

    </motion.div>
  );
}

/* ─── HowItWorksPanel ─── */
function HowItWorksTimeline() {
  const [active, setActive] = useState(0);
  const s = STEPS[active];

  useEffect(() => {
    const id = setTimeout(() => setActive(i => (i + 1) % STEPS.length), 4500);
    return () => clearTimeout(id);
  }, [active]);

  return (
    <div className="space-y-8">

      {/* ── Step cards with inline chevron arrows — no connecting lines ── */}
      <div className="flex items-stretch gap-1 sm:gap-2">
        {STEPS.flatMap((step, i) => {
          const isActive = i === active;
          const isDone = i < active;

          const card = (
            <motion.button
              key={`step-${i}`}
              onClick={() => setActive(i)}
              className="flex-1 flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer relative overflow-hidden"
              style={{
                background: isActive ? step.color + "0d" : isDone ? "#FAFBFC" : "#fff",
                border: `2px solid ${isActive ? step.color : isDone ? step.color + "35" : "#E8ECEF"}`,
                boxShadow: isActive ? `0 6px 24px ${step.color}22` : "0 1px 4px rgba(0,0,0,0.05)",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}>

              {/* Circle with icon */}
              <div className="relative">
                <motion.div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center relative z-10"
                  style={{
                    background: isActive ? step.color : isDone ? step.color + "28" : "#F1F5F9",
                    boxShadow: isActive ? `0 8px 28px ${step.color}50` : "none",
                  }}
                  animate={isActive ? { scale: [1, 1.07, 1] } : { scale: 1 }}
                  transition={{ duration: 2.8, repeat: isActive ? Infinity : 0 }}>
                  {isDone
                    ? <FiCheck className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: step.color }} />
                    : <step.icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: isActive ? "#fff" : "#94A3B8" }} />
                  }
                  {isActive && (
                    <motion.div className="absolute inset-0 rounded-full pointer-events-none"
                      style={{ background: step.color }}
                      animate={{ scale: [1, 1.9], opacity: [0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }} />
                  )}
                </motion.div>
                {/* Badge */}
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] font-black z-20 shadow"
                  style={{
                    background: isDone ? "#10B981" : isActive ? step.color : "#E2E8F0",
                    color: isDone || isActive ? "#fff" : "#94A3B8",
                  }}>
                  {isDone ? "✓" : i + 1}
                </div>
              </div>

              <div className="text-center">
                <p className="font-bold text-[10px] sm:text-[13px] leading-tight"
                  style={{ color: isActive ? step.color : isDone ? "#64748B" : "#334155" }}>
                  {step.title}
                </p>
                <p className="text-[9px] sm:text-[11px] mt-0.5 hidden sm:block"
                  style={{ color: isActive ? step.color + "bb" : "#94A3B8" }}>
                  {step.tagline}
                </p>
              </div>

              {isActive && (
                <div className="w-full h-[3px] rounded-full bg-slate-100 overflow-hidden">
                  <motion.div key={`prog-${active}`} className="h-full rounded-full"
                    style={{ background: step.color }}
                    initial={{ width: "0%" }} animate={{ width: "100%" }}
                    transition={{ duration: 4.5, ease: "linear" }} />
                </div>
              )}
            </motion.button>
          );

          const arrow = i < STEPS.length - 1 ? (
            <div key={`arrow-${i}`} className="flex-shrink-0 flex items-center self-center pb-4 sm:pb-6">
              <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4"
                style={{ color: isDone ? step.color + "80" : "#CBD5E1" }} />
            </div>
          ) : null;

          return arrow ? [card, arrow] : [card];
        })}
      </div>

      {/* ── Detail card ── */}
      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl overflow-hidden"
          style={{ border: `1.5px solid ${s.color}30`, background: "#fff", boxShadow: `0 20px 60px ${s.color}14` }}>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">

            {/* Left: accent column */}
            <div className="relative px-8 py-8 overflow-hidden flex flex-col gap-5 min-h-[220px]"
              style={{ background: `linear-gradient(145deg, ${s.color}16, ${s.color}07)` }}>

              {/* Decorative blobs */}
              <motion.div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full pointer-events-none opacity-20"
                style={{ background: s.color }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
              <motion.div className="absolute right-0 top-4 w-20 h-20 rounded-full pointer-events-none opacity-10"
                style={{ background: s.color }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} />

              {/* Giant watermark number */}
              <div className="absolute -right-2 -bottom-4 font-black leading-none select-none pointer-events-none"
                style={{ fontSize: "9rem", color: s.color, opacity: 0.06 }}>
                {s.n}
              </div>

              {/* Rotating icon */}
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10 self-start"
                style={{ background: s.color, boxShadow: `0 12px 32px ${s.color}55` }}
                animate={{ rotate: [0, 4, -4, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
                <s.icon className="w-7 h-7 text-white" />
              </motion.div>

              <div className="relative z-10">
                <p className="font-black text-5xl leading-none mb-1" style={{ color: s.color + "40" }}>
                  {s.n}
                </p>
                <h3 className="font-black text-slate-900 text-2xl leading-tight">{s.title}</h3>
                <p className="text-sm font-semibold mt-1" style={{ color: s.color }}>{s.tagline}</p>
              </div>

              {/* Nav controls */}
              <div className="flex items-center gap-3 relative z-10 mt-auto">
                <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setActive(i => Math.max(0, i - 1))}
                  disabled={active === 0}
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:border-sky-400 hover:text-sky-500 disabled:opacity-30 transition shadow-sm">
                  <FiChevronLeft className="w-4 h-4" />
                </motion.button>
                <div className="flex gap-1.5">
                  {STEPS.map((_, i) => (
                    <motion.button key={i} onClick={() => setActive(i)}
                      className="rounded-full" style={{ height: 5 }}
                      animate={{ width: i === active ? "18px" : "5px", background: i === active ? s.color : "#CBD5E1" }}
                      transition={{ duration: 0.3 }} />
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setActive(i => Math.min(STEPS.length - 1, i + 1))}
                  disabled={active === STEPS.length - 1}
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:border-sky-400 hover:text-sky-500 disabled:opacity-30 transition shadow-sm">
                  <FiChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Right: content */}
            <div className="px-8 py-8 flex flex-col justify-between">
              <div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{s.desc}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                  {s.details.map((d, j) => (
                    <motion.div key={`${active}-${j}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: j * 0.09, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: s.color + "0d" }}>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: j * 0.09 + 0.1, type: "spring", stiffness: 280 }}
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: s.color + "28" }}>
                        <FiCheck className="w-3 h-3" style={{ color: s.color }} />
                      </motion.span>
                      <span className="text-xs font-medium text-slate-700">{d}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <Link to="/services/request">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: `0 14px 32px ${s.color}44` }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white w-full sm:w-auto justify-center sm:justify-start"
                  style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)` }}>
                  {s.cta} <FiArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── ServicesBentoPanel ─── */
function ServicesBentoPanel() {
  const [active, setActive] = useState(0);
  const s = SERVICES[active];

  useEffect(() => {
    const id = setTimeout(() => setActive(i => (i + 1) % SERVICES.length), 4000);
    return () => clearTimeout(id);
  }, [active]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-5 xl:gap-8 items-start">

      {/* ── Left: card grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {SERVICES.map((svc, i) => {
          const isActive = i === active;
          return (
            <motion.div key={i}
              onClick={() => setActive(i)}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, scale: 1.03, transition: { duration: 0.2, ease: "easeOut" } }}
              whileTap={{ scale: 0.97 }}
              className="relative cursor-pointer rounded-2xl p-4 sm:p-5 bg-white overflow-hidden select-none"
              style={{
                border: `1.5px solid ${isActive ? svc.color + "60" : "#E2E8F0"}`,
                boxShadow: isActive
                  ? `0 10px 36px ${svc.color}28`
                  : "0 2px 10px rgba(0,0,0,0.04)",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}>

              {/* Progress bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl overflow-hidden"
                style={{ background: isActive ? svc.color + "18" : "transparent" }}>
                {isActive && (
                  <motion.div
                    key={`bar-${active}`}
                    className="h-full"
                    style={{ background: svc.color }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4, ease: "linear" }}
                  />
                )}
              </div>

              {/* Icon with animated ring */}
              <div className="relative inline-block mb-3">
                <motion.div
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
                  style={{ background: svc.color + (isActive ? "22" : "12") }}
                  animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 2.5, repeat: isActive ? Infinity : 0 }}>
                  <svc.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: svc.color }} />
                </motion.div>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ background: svc.color }}
                    animate={{ scale: [1, 2], opacity: [0.28, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                )}
              </div>

              <h3 className="font-bold text-slate-800 text-[13px] sm:text-sm leading-tight mb-1 line-clamp-2">
                {svc.title}
              </h3>
              <p className="hidden sm:block text-[11px] text-slate-400 leading-tight mb-3 line-clamp-1">
                {svc.tagline}
              </p>

              <motion.span
                className="inline-flex text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full mt-2 sm:mt-0"
                style={{ background: svc.color + "12", color: svc.color }}
                animate={{ opacity: isActive ? 1 : 0.6 }}>
                {svc.price}
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      {/* ── Right: detail panel ── */}
      <div className="lg:sticky lg:top-24">
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl overflow-hidden"
            style={{
              background: "#fff",
              border: `1.5px solid ${s.color}30`,
              boxShadow: `0 20px 60px ${s.color}1a`,
            }}>

            {/* Colored header */}
            <div className="relative px-6 py-7 overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${s.color}16, ${s.color}07)` }}>

              {/* Decorative blobs */}
              <motion.div className="absolute -right-12 -top-12 w-44 h-44 rounded-full pointer-events-none"
                style={{ background: s.color, opacity: 0.13 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} />
              <motion.div className="absolute right-6 bottom-0 w-24 h-24 rounded-full pointer-events-none"
                style={{ background: s.color, opacity: 0.09 }}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} />

              {/* Floating icon */}
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative z-10"
                style={{ background: s.color, boxShadow: `0 14px 36px ${s.color}55` }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}>
                <s.icon className="w-7 h-7 text-white" />
                <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: s.color }}
                  animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity }} />
              </motion.div>

              <div className="relative z-10">
                <h3 className="font-black text-slate-900 text-xl leading-tight">{s.title}</h3>
                <p className="text-sm font-semibold mt-1" style={{ color: s.color }}>{s.tagline}</p>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-sm text-slate-600 leading-relaxed mb-5">{s.desc}</p>

              <p className="text-[11px] font-black uppercase tracking-[0.12em] mb-3" style={{ color: s.color }}>
                What's Included
              </p>

              <ul className="space-y-2.5 mb-5">
                {s.features.map((f, j) => (
                  <motion.li key={`${active}-${j}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: j * 0.07 + 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-2.5 text-sm text-slate-700">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: j * 0.07 + 0.15, type: "spring", stiffness: 300, damping: 18 }}
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: s.color + "20" }}>
                      <FiCheck className="w-3 h-3" style={{ color: s.color }} />
                    </motion.span>
                    {f}
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 mb-5">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                  <FiClock className="w-3.5 h-3.5" /> {s.time}
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: s.color + "15", color: s.color }}>
                  {s.price}
                </span>
              </div>

              <Link to="/services/request">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: `0 14px 36px ${s.color}44` }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)` }}>
                  Book This Service <FiArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>

              <div className="flex justify-center gap-1.5 mt-5">
                {SERVICES.map((svc, i) => (
                  <motion.button key={i} onClick={() => setActive(i)}
                    className="rounded-full"
                    style={{ height: 5 }}
                    animate={{
                      width: i === active ? "20px" : "5px",
                      background: i === active ? s.color : "#CBD5E1",
                    }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.4 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── main component ─── */
export function Home() {
  const [testimonials,   setTestimonials]   = useState(null);
  const [gallery,        setGallery]        = useState(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    api.get("/testimonials")
      .then(r => setTestimonials(r.data.testimonials || []))
      .catch(() => setTestimonials([]));
    api.get("/work-gallery")
      .then(r => setGallery(r.data.gallery || []))
      .catch(() => setGallery([]));
  }, []);

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
        style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#0d2040 50%,#141e33 100%)" }}>

        {/* dot grid */}
        <div className="absolute inset-0 pointer-events-none dot-grid-light opacity-40" />

        {/* animated glow orbs */}
        {[
          { w: 560, h: 560, top: "-180px", left: "-180px", color: "#0EA5E9" },
          { w: 420, h: 420, bottom: "-120px", right: "-120px", color: "#10B981" },
          { w: 280, h: 280, top: "35%",  left: "38%",  color: "#8B5CF6" },
        ].map((o, i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width: o.w, height: o.h, top: o.top, left: o.left, bottom: o.bottom, right: o.right,
              background: o.color, opacity: 0.12, filter: "blur(100px)" }}
            animate={{ scale: [1, 1.22, 1], x: [0, i % 2 === 0 ? 25 : -25, 0], y: [0, i % 2 === 0 ? -25 : 25, 0] }}
            transition={{ duration: 8 + i * 2.5, repeat: Infinity, ease: "easeInOut" }} />
        ))}

        {/* scanline overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)" }} />

        <div className="relative z-10 max-w-7xl 2xl:max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-center">

          {/* left — text */}
          <div>
            <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-widest max-w-full"
              style={{ background: "rgba(14,165,233,0.18)", color: "#38BDF8", border: "1px solid rgba(14,165,233,0.3)" }}>
              <motion.span className="w-2 h-2 flex-shrink-0 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
              <span className="truncate">Pune's Trusted IT Partner Since 2019</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-black leading-tight mb-6 text-white"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>
              Fast &amp; Reliable
              <br />
              <TypedText />
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
              className="text-base md:text-lg text-slate-400 leading-relaxed mb-10 max-w-xl">
              Laptop repair, data recovery, network setup, software installation, and IT support for offices in Pune.{" "}
              <span className="text-slate-300 font-medium">Free diagnosis · Transparent pricing · 30-day warranty.</span>
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link to="/services/request" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.06, boxShadow: "0 16px 40px rgba(58,182,255,0.55)" }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full sm:w-auto h-14 flex items-center justify-center gap-2 px-8 rounded-xl font-bold text-base text-white btn-primary pulse-ring">
                  Book a Service <FiArrowRight className="w-4 h-4 flex-shrink-0" />
                </motion.button>
              </Link>
              <Link to="/services" className="w-full sm:w-auto">
                <motion.button whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.14)" }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full sm:w-auto h-14 flex items-center justify-center gap-2 px-8 rounded-xl font-bold text-white text-base btn-ghost-light">
                  View Services <FiArrowRight className="w-4 h-4 flex-shrink-0" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Hero trust badges */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65, duration: 0.6 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {[
                { icon: "⭐", text: "4.9/5 Rating" },
                { icon: "🔒", text: "30-Day Warranty" },
                { icon: "🚀", text: "Same-Day Repairs" },
              ].map((b, i) => (
                <span key={i} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <span>{b.icon}</span> {b.text}
                </span>
              ))}
            </motion.div>
          </div>

          {/* right — animated hero card */}
          <HeroCard />
        </div>

        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(248,250,252,0.04))" }} />
      </section>

      {/* ══════════════════════════════════════════
          TRUST STRIPS — diagonal scrolling bands
      ══════════════════════════════════════════ */}
      <div className="relative" style={{ zIndex: 10, overflow: "hidden" }}>

        <div className="strip-ribbon">

          {/* Strip 1 — electric blue, scrolls left */}
          <div style={{ background: "linear-gradient(90deg,#3AB6FF,#1E90FF)", overflow: "hidden", boxShadow: "0 4px 20px rgba(58,182,255,0.35)" }}>
            <div className="marquee-inner" style={{ animationDuration: "30s" }}>
              {[...MARQUEE_ROW1, ...MARQUEE_ROW1].map((item, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
                  <span className="strip-item-text">{item.text}</span>
                  <span className="strip-item-sep">/</span>
                </span>
              ))}
            </div>
          </div>

          {/* Strip 2 — deep brand blue, scrolls right */}
          <div style={{ background: "linear-gradient(90deg,#2B0FA8,#1a3a6e)", overflow: "hidden", boxShadow: "0 4px 20px rgba(43,15,168,0.35)" }}>
            <div className="marquee-inner" style={{ animationDuration: "24s", animationDirection: "reverse" }}>
              {[...MARQUEE_ROW2, ...MARQUEE_ROW2].map((item, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
                  <span className="strip-item-text">{item.text}</span>
                  <span className="strip-item-sep">/</span>
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════
          SERVICES
      ══════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-10 lg:px-16 relative overflow-hidden"
        style={{ background: "linear-gradient(150deg,#f0f9ff 0%,#f8fafc 55%,#fff 100%)" }}>

        {/* Animated background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div className="absolute -top-36 -right-36 w-[420px] h-[420px] rounded-full"
            style={{ background: "radial-gradient(circle,rgba(14,165,233,0.13) 0%,transparent 70%)" }}
            animate={{ scale: [1, 1.18, 1], x: [0, 18, 0], y: [0, -18, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute -bottom-28 -left-28 w-[360px] h-[360px] rounded-full"
            style={{ background: "radial-gradient(circle,rgba(139,92,246,0.10) 0%,transparent 70%)" }}
            animate={{ scale: [1, 1.22, 1], x: [0, -12, 0], y: [0, 12, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} />
          <motion.div className="absolute top-1/2 left-1/3 w-60 h-60 rounded-full"
            style={{ background: "radial-gradient(circle,rgba(16,185,129,0.07) 0%,transparent 70%)" }}
            animate={{ scale: [1, 1.35, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }} />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <FadeUp className="text-center mb-12">
            <SectionLabel text="What We Offer" color="#0EA5E9" />
            <h2 className="ct-h2 text-slate-900">Our Services</h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
              We handle all your IT needs — from quick fixes to complete system overhauls.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <ServicesBentoPanel />
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-10 lg:px-16 bg-white overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <SectionLabel text="The Process" />
            <h2 className="ct-h2 text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              From submitting your issue to getting your device back — here's exactly what happens.
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <HowItWorksTimeline />
          </FadeUp>
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
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PILLARS.map((item, i) => (
              <motion.div key={i} variants={scaleIn} custom={i * 0.1}>
                <motion.div className="p-8 text-center h-full rounded-2xl bg-white border border-slate-200 cursor-default"
                  whileHover={{ y: -10, boxShadow: "0 28px 56px rgba(14,165,233,0.14)", borderColor: "rgba(14,165,233,0.25)" }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}>
                  <motion.div className="text-5xl mb-5 inline-block"
                    animate={{ scale: [1, 1.12, 1], rotate: [0, 3, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}>
                    {item.icon}
                  </motion.div>
                  <h3 className="font-bold text-slate-800 mb-2 text-lg">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS CAROUSEL
      ══════════════════════════════════════════ */}
      {testimonials === null ? (
        <section className="py-20 px-6 md:px-10 lg:px-16 bg-white">
          <div className="max-w-4xl mx-auto">
            <Shimmer className="h-8 w-48 mx-auto mb-4" />
            <Shimmer className="h-56 w-full" />
          </div>
        </section>
      ) : testimonials.length > 0 && (
        <section className="py-20 px-6 md:px-10 lg:px-16 bg-white">
          <div className="max-w-4xl mx-auto">
            <FadeUp className="text-center mb-10">
              <SectionLabel text="Testimonials" />
              <h2 className="ct-h2 text-slate-900">What Customers Say</h2>
            </FadeUp>
            <ScaleIn>
              <div className="relative px-8 md:px-12">
                <AnimatePresence mode="wait">
                  <motion.div key={testimonialIdx}
                    initial={{ opacity: 0, x: 60, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -60, scale: 0.97 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-3xl p-8 md:p-10 bg-white"
                    style={{ border: "1.5px solid rgba(14,165,233,0.15)", boxShadow: "0 8px 40px rgba(14,165,233,0.08)" }}>
                    <div className="flex gap-1 mb-5">
                      {Array(5).fill(0).map((_, j) => (
                        <motion.span key={j} className="text-yellow-400 text-xl"
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
            </ScaleIn>
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
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.slice(0, 6).map((item, i) => (
                <motion.div key={i} variants={fadeUp} custom={i * 0.07} className="h-full">
                  <motion.div className="overflow-hidden cursor-pointer h-full flex flex-col rounded-2xl bg-white border border-slate-200"
                    whileHover={{ scale: 1.03, boxShadow: "0 24px 52px rgba(0,0,0,0.12)", borderColor: "rgba(14,165,233,0.25)" }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}>
                    {item.image && (
                      <div className="relative overflow-hidden h-48 bg-slate-100">
                        <motion.img src={item.image} alt={item.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.5 }} />
                        <motion.div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent flex items-end p-4"
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
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-10 lg:px-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <FadeUp className="text-center mb-12">
            <SectionLabel text="FAQ" />
            <h2 className="ct-h2 text-slate-900">Common Questions</h2>
            <p className="text-slate-500 mt-3">Everything you need to know before booking a service.</p>
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
        style={{ background: "linear-gradient(135deg,#0a0f1e 0%,#0d2040 55%,#141e33 100%)" }}>

        <div className="absolute inset-0 dot-grid-light pointer-events-none opacity-40" />

        <motion.div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%,rgba(14,165,233,0.18),transparent 65%)" }}
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} />

        {[
          { top: "-70px",    left: "-70px",   color: "#0EA5E9" },
          { bottom: "-70px", right: "-70px",  color: "#4FD1C5" },
        ].map((o, i) => (
          <motion.div key={i} className="absolute w-64 h-64 rounded-full pointer-events-none"
            style={{ ...o, background: o.color, opacity: 0.12, filter: "blur(80px)" }}
            animate={{ scale: [1, 1.35, 1] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i }} />
        ))}

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <ScaleIn>
            <motion.div initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 uppercase tracking-widest"
              style={{ background: "rgba(14,165,233,0.18)", color: "#38BDF8", border: "1px solid rgba(14,165,233,0.3)" }}>
              <motion.span className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
              Available Now
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }} viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black text-white mb-5"
              style={{ letterSpacing: "-0.03em" }}>
              Need Help with Your Device?
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }} viewport={{ once: true }}
              className="text-slate-400 mb-10 text-lg leading-relaxed">
              Book a service in minutes and get it fixed fast.{" "}
              <span className="text-slate-300">Free diagnosis, no commitment.</span>
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/services/request">
                <motion.button
                  whileHover={{ scale: 1.08, boxShadow: "0 22px 52px rgba(58,182,255,0.55)" }}
                  whileTap={{ scale: 0.96 }}
                  animate={{ boxShadow: ["0 0 0 0 rgba(58,182,255,0.4)", "0 0 0 18px rgba(58,182,255,0)", "0 0 0 0 rgba(58,182,255,0)"] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="btn-primary px-10 py-4 text-lg font-black rounded-2xl">
                  Request Service <FiArrowRight className="inline w-5 h-5 ml-1" />
                </motion.button>
              </Link>
              <a href="tel:+919529882920">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                  className="btn-ghost-light px-8 py-4 text-base font-semibold rounded-2xl">
                  Call Now: +91 95298 82920
                </motion.button>
              </a>
            </motion.div>
          </ScaleIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHATSAPP FLOATING BUTTON
      ══════════════════════════════════════════ */}
      <motion.a
        href="https://wa.me/919529882920?text=Hi%2C%20I%20need%20IT%20support"
        target="_blank" rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-white font-bold text-sm"
        style={{ background: "linear-gradient(135deg,#25D366,#128C7E)", boxShadow: "0 8px 32px rgba(37,211,102,0.4)" }}>
        <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <FaWhatsapp className="w-5 h-5" />
        </motion.span>
        <span className="hidden sm:inline">Chat on WhatsApp</span>
      </motion.a>

    </div>
  );
}
