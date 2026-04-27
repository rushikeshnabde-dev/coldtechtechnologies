import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheck, FiPhone } from "react-icons/fi";
import { FaLaptop, FaDatabase, FaWrench, FaNetworkWired } from "react-icons/fa";
import { SEO } from "../components/SEO";

const SERVICES = [
  {
    id: "laptop-repair",
    icon: FaLaptop,
    color: "#0EA5E9",
    emoji: "💻",
    title: "Laptop & Desktop Repair",
    tagline: "Fast, reliable hardware & software fixes",
    problem: "Is your laptop not turning on, screen cracked, keyboard broken, or running extremely slow?",
    solution: "Our certified technicians diagnose and fix all hardware and software issues for laptops and desktops of every brand — same day for most repairs.",
    features: [
      "Screen replacement (LCD, LED, touch)",
      "Keyboard & trackpad repair",
      "Motherboard & chip-level repair",
      "Battery replacement",
      "Overheating & fan issues",
      "OS installation & recovery",
      "Virus & malware removal",
      "Performance optimization",
    ],
    price: "Starting ₹499",
    time: "Same day – 3 days",
    cta: "Book Laptop Repair",
  },
  {
    id: "data-recovery",
    icon: FaDatabase,
    color: "#8B5CF6",
    emoji: "🗄️",
    title: "Data Recovery",
    tagline: "Recover your precious files safely",
    problem: "Accidentally deleted files? Hard drive crashed? Formatted the wrong drive? Don't panic.",
    solution: "We use professional data recovery tools to retrieve your data from damaged, corrupted, or formatted storage devices with high success rates.",
    features: [
      "HDD & SSD data recovery",
      "Accidentally deleted files",
      "Formatted drive recovery",
      "Corrupted partition recovery",
      "Pen drive & SD card recovery",
      "RAID array recovery",
      "Mobile data recovery",
      "Free assessment before proceeding",
    ],
    price: "Starting ₹999",
    time: "2–5 days",
    cta: "Recover My Data",
  },
  {
    id: "network-setup",
    icon: FaNetworkWired,
    color: "#10B981",
    emoji: "📡",
    title: "Network Setup & IT Support",
    tagline: "Fast, stable connectivity for home & office",
    problem: "Slow WiFi, network drops, can't connect devices, or need a complete office network setup?",
    solution: "We design, install, and configure networks for homes and businesses — from simple WiFi setup to complete office LAN infrastructure.",
    features: [
      "WiFi router setup & optimization",
      "LAN / structured cabling",
      "VPN & remote access setup",
      "Network security & firewall",
      "CCTV & IP camera integration",
      "Server setup & configuration",
      "Remote IT support",
      "Network troubleshooting",
    ],
    price: "Starting ₹799",
    time: "Same day",
    cta: "Setup My Network",
  },
  {
    id: "amc",
    icon: FaWrench,
    color: "#F59E0B",
    emoji: "🏢",
    title: "AMC Plans for Businesses",
    tagline: "Worry-free IT for your entire office",
    problem: "Tired of unexpected IT breakdowns disrupting your business? Need reliable ongoing support?",
    solution: "Our Annual Maintenance Contracts give your business priority IT support, regular maintenance, and peace of mind — at a fixed monthly cost.",
    features: [
      "Unlimited service calls",
      "Priority response (2–4 hours)",
      "Quarterly system health checks",
      "Antivirus & security updates",
      "Hardware & software support",
      "On-site & remote support",
      "Dedicated account manager",
      "Monthly IT health report",
    ],
    price: "Custom plans",
    time: "Flexible",
    cta: "Get AMC Quote",
  },
];

const TRUST = [
  { icon: "🔍", label: "Free Diagnosis" },
  { icon: "💰", label: "Transparent Pricing" },
  { icon: "✅", label: "Quote Before Work" },
  { icon: "🛡️", label: "30-Day Warranty" },
  { icon: "🚀", label: "Same-Day Service" },
  { icon: "📍", label: "Pune Based" },
];

export function Services() {
  return (
    <div className="w-full bg-[var(--color-page)] min-h-screen overflow-x-hidden">
      <SEO
        title="IT Repair & Support Services in Pune – Coldtech Technologies"
        description="Expert laptop repair, data recovery, network setup and AMC plans in Pune. Free diagnosis, transparent pricing, 30-day warranty. Book now."
        keywords="IT repair services Pune, laptop repair Pune, data recovery Pune, network setup Pune, AMC plans Pune, IT support India"
        canonical="/services"
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Services", url: "/services" }]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-6 md:px-10"
        style={{ background: "linear-gradient(135deg,#0f172a 0%,#0f2744 55%,#1e293b 100%)" }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6 uppercase tracking-widest"
            style={{ background: "rgba(14,165,233,0.18)", color: "#38BDF8", border: "1px solid rgba(14,165,233,0.3)" }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Expert IT Services in Pune
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}>
            Professional IT Repair &<br />
            <span style={{ backgroundImage: "linear-gradient(135deg,#38BDF8,#0EA5E9,#10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Support Services
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            From laptop repair to complete office IT setup — we fix it fast, right, and at a fair price.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/services/request">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="btn-primary flex items-center gap-2 px-8 py-4 text-base font-bold">
                Book Free Diagnosis <FiArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <a href="tel:+919529882920">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-base border-2 transition-all"
                style={{ borderColor: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.07)" }}>
                <FiPhone className="w-5 h-5" /> Call Now
              </motion.button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-6 px-6 border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-4">
          {TRUST.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700">
              <span>{t.icon}</span> {t.label}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-5xl mx-auto space-y-16">
          {SERVICES.map((s, idx) => (
            <motion.div key={s.id} id={s.id}
              initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }} viewport={{ once: true }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>

              {/* Info */}
              <div className={idx % 2 === 1 ? "lg:order-2" : ""}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: s.color + "18" }}>
                    <s.icon className="w-6 h-6" style={{ color: s.color }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{s.title}</h2>
                    <p className="text-xs font-semibold" style={{ color: s.color }}>{s.tagline}</p>
                  </div>
                  <span className="ml-auto text-3xl">{s.emoji}</span>
                </div>

                <div className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">The Problem</p>
                  <p className="text-sm text-slate-600">{s.problem}</p>
                </div>

                <div className="mb-5 p-4 rounded-xl border" style={{ background: s.color + "08", borderColor: s.color + "30" }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: s.color }}>Our Solution</p>
                  <p className="text-sm text-slate-700">{s.solution}</p>
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: s.color + "15", color: s.color }}>{s.price}</span>
                  <span className="text-xs text-slate-500">⏱ {s.time}</span>
                </div>

                <Link to="/services/request">
                  <motion.button whileHover={{ scale: 1.04, boxShadow: `0 12px 28px ${s.color}44` }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
                    style={{ background: `linear-gradient(135deg,${s.color},${s.color}bb)` }}>
                    {s.cta} <FiArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>

              {/* Features */}
              <div className={`rounded-2xl p-6 ${idx % 2 === 1 ? "lg:order-1" : ""}`}
                style={{ background: s.color + "08", border: `1.5px solid ${s.color}22` }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: s.color }}>
                  What's Included
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {s.features.map((f, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                      className="flex items-center gap-2.5 text-sm text-slate-700">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: s.color + "20" }}>
                        <FiCheck className="w-3 h-3" style={{ color: s.color }} />
                      </span>
                      {f}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#0f172a,#0f2744,#1e293b)" }}>
        <motion.div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%,rgba(14,165,233,0.12),transparent 68%)" }}
          animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 5, repeat: Infinity }} />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Not sure which service you need?</h2>
          <p className="text-slate-400 mb-8">Tell us your problem — we'll diagnose it for free and recommend the right solution.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/services/request">
              <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
                className="btn-primary px-8 py-4 text-base font-black rounded-2xl">
                Book Free Diagnosis <FiArrowRight className="inline w-5 h-5 ml-1" />
              </motion.button>
            </Link>
            <a href="https://wa.me/919529882920?text=Hi%2C%20I%20need%20help%20with%20my%20device." target="_blank" rel="noreferrer">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white border-2 transition-all"
                style={{ borderColor: "rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.07)" }}>
                💬 Chat on WhatsApp
              </motion.button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
