import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FiArrowRight, FiSearch, FiPlay, FiChevronDown,
  FiUsers, FiPackage, FiStar, FiCloud, FiShield, FiHeadphones,
  FiDatabase, FiWifi, FiCode, FiCheck, FiMessageCircle, FiZap,
} from "react-icons/fi";
import { api } from "../services/api";
import { ProductCard } from "../components/ProductCard";
import { SEO } from "../components/SEO";

/* ── data ── */
const MARQUEE = [
  "⚡ 24/7 Enterprise Support","🔒 Zero-Trust Security","☁️ Cloud Migration Experts",
  "🛡️ Threat Detection & Response","📊 IT Infrastructure Audit","🚀 Same-Day Deployment",
  "💰 Transparent Pricing","🏆 5,000+ Happy Clients","🔧 Managed IT Services","📈 Scale Your Business",
];

const STATS = [
  { icon: FiUsers,   end: 5000, suffix:"+", label:"Happy Customers",  color:"#0EA5E9" },
  { icon: FiPackage, end: 1000, suffix:"+", label:"Products Listed",   color:"#1E293B" },
  { icon: FiStar,    end: 98,   suffix:"%", label:"Satisfaction Rate", color:"#10B981" },
];

const LOGOS = ["TechCrop","CloudBase","NewsGroup","SwiftIT","DataFlow","NetSuite"];

const STEPS = [
  { n:"01", icon:FiSearch,   title:"Request or Browse",  desc:"Tell us what you need — hardware, software, or a service ticket." },
  { n:"02", icon:FiZap,      title:"Get Matched",        desc:"We connect you with vetted providers and transparent pricing." },
  { n:"03", icon:FiStar,     title:"Track Everything",   desc:"One dashboard for all your orders and support tickets." },
];

const SERVICES = [
  { icon:FiCloud,      title:"Cloud Infrastructure",   desc:"Scalable cloud setup and migration for modern teams.",    color:"#0EA5E9" },
  { icon:FiShield,     title:"Cybersecurity Suite",    desc:"End-to-end protection from threats and vulnerabilities.", color:"#EF4444" },
  { icon:FiHeadphones, title:"IT Support Desk",        desc:"24/7 helpdesk with fast response SLAs.",                 color:"#10B981" },
  { icon:FiDatabase,   title:"Data Backup & Recovery", desc:"Automated backups and rapid disaster recovery.",         color:"#F59E0B" },
  { icon:FiWifi,       title:"Network Security",       desc:"Firewall, VPN, and network monitoring solutions.",       color:"#6366F1" },
  { icon:FiCode,       title:"Software Licensing",     desc:"Manage and optimize your software license portfolio.",   color:"#EC4899" },
];

const PLANS = [
  { name:"Starter",      price:"$299", period:"/mo", tag:"",             accent:"#0EA5E9",
    features:["Essential IT support","Email & chat support","Up to 5 users","Basic monitoring"] },
  { name:"Professional", price:"$599", period:"/mo", tag:"Most Popular", accent:"#1E293B",
    features:["Priority support","24/7 monitoring","Up to 25 users","Dedicated engineer","Monthly reports"] },
  { name:"Enterprise",   price:"Custom", period:"",  tag:"",             accent:"#10B981",
    features:["Dedicated account manager","Custom SLAs","Unlimited users","On-site support","Full audit trail"] },
];

const FAQS = [
  { q:"How fast is support response?",    a:"Under 15 minutes for Pro/Enterprise, under 2 hours for Starter." },
  { q:"Do you offer free consultations?", a:"Yes — free 30-minute consultation to find the right plan for you." },
  { q:"Can I cancel anytime?",            a:"Month-to-month, no lock-in. Cancel with 30 days notice." },
  { q:"What industries do you serve?",    a:"Startups, SMBs, healthcare, education, retail, and enterprise." },
];

/* ── helpers ── */
function useCounter(end, started) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!started) return;
    let t0 = null;
    const tick = ts => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / 1800, 1);
      setV(Math.floor(p * end));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, end]);
  return v;
}

function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity:0, y:28 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:.55, delay, ease:"easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ text, color = "#0EA5E9" }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
      style={{ background: color + "18", color, border: `1px solid ${color}30` }}>
      {text}
    </span>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left text-sm font-semibold text-slate-800 hover:text-sky-600 transition">
        {q}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration:.2 }}>
          <FiChevronDown className="w-4 h-4 flex-shrink-0 text-slate-400" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }}
            exit={{ height:0, opacity:0 }} transition={{ duration:.25 }} className="overflow-hidden">
            <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
/* ── main component ── */
export function Home() {
  const [featured, setFeatured] = useState([]);
  const [search, setSearch]     = useState("");
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin:"-80px" });

  useEffect(() => {
    api.get("/products", { params:{ featured:true, limit:3 } })
      .then(r => setFeatured(r.data.products || []))
      .catch(() => setFeatured([]));
    const t = setTimeout(() => setShowChat(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const c0 = useCounter(STATS[0].end, statsInView);
  const c1 = useCounter(STATS[1].end, statsInView);
  const c2 = useCounter(STATS[2].end, statsInView);
  const counts = [c0, c1, c2];

  return (
    <div className="w-full bg-[var(--color-page)]">
      <SEO
        title="IT Solutions Company in Pune — Computer Repair & IT Support"
        description="Coldtech Technologies — Pune's #1 IT solutions company. Expert computer repair, data recovery, networking & enterprise IT support. Get help today."
        keywords="IT solutions company Pune, IT services Pune, computer repair Pune, enterprise IT solutions India, data recovery Pune, network setup Pune, IT support Pune, cybersecurity Pune, laptop repair Pune, IT company India"
        canonical="/"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Coldtech Technologies — IT Solutions Company in Pune",
          "url": "https://coldtechtechnologies.in/",
          "description": "Pune's trusted IT solutions company offering computer repair, data recovery, networking, and enterprise IT support.",
          "speakable": { "@type": "SpeakableSpecification", "cssSelector": ["h1", ".hero-description"] },
          "mainEntity": {
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "What IT services does Coldtech Technologies offer?", "acceptedAnswer": { "@type": "Answer", "text": "Coldtech Technologies offers computer repair, data recovery, performance optimization, networking, cybersecurity, and enterprise IT support in Pune, India." } },
              { "@type": "Question", "name": "Where is Coldtech Technologies located?", "acceptedAnswer": { "@type": "Answer", "text": "Coldtech Technologies is based in Pune, Maharashtra, India, serving clients across the city and surrounding regions." } },
              { "@type": "Question", "name": "How quickly can Coldtech respond to IT issues?", "acceptedAnswer": { "@type": "Answer", "text": "We offer same-day service for most issues and 24/7 emergency support for critical IT problems." } },
              { "@type": "Question", "name": "Do you offer on-site IT support in Pune?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, we provide both remote and on-site IT support across Pune and surrounding areas." } },
              { "@type": "Question", "name": "How do I track my service request?", "acceptedAnswer": { "@type": "Answer", "text": "After submitting a service request, you receive a unique ticket ID. Use it on our Track Request page for real-time status updates." } }
            ]
          }
        }}
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-24 px-6 md:px-10 lg:px-16"
        style={{ background:"linear-gradient(135deg,#1E293B 0%,#0f2744 60%,#1E293B 100%)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize:"36px 36px" }} />
        {[
          { w:400, h:400, top:"-100px", left:"-100px", bg:"#0EA5E9", op:.15 },
          { w:300, h:300, bottom:"-60px", right:"-60px", bg:"#10B981", op:.1 },
        ].map((o,i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width:o.w, height:o.h, top:o.top, left:o.left, bottom:o.bottom, right:o.right,
              background:o.bg, opacity:o.op, filter:"blur(80px)" }}
            animate={{ scale:[1,1.15,1] }} transition={{ duration:8+i*2, repeat:Infinity, ease:"easeInOut" }} />
        ))}
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-widest"
              style={{ background:"rgba(14,165,233,0.2)", color:"#38BDF8", border:"1px solid rgba(14,165,233,0.3)" }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Enterprise IT · Cloud · Security
            </motion.div>
            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:.7, delay:.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 text-white"
              style={{ fontFamily:"var(--font-display)" }}>
              Reliable technology for{" "}
              <span className="grad-anim" style={{ backgroundImage:"linear-gradient(135deg,#38BDF8,#0EA5E9,#10B981)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                organizations that move fast
              </span>
            </motion.h1>
            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, delay:.25 }}
              className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl">
              Standardized purchasing, accountable service workflows, and a single place to track orders and support tickets.
            </motion.p>
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.6, delay:.4 }}
              className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop">
                <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:.96 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white btn-primary">
                  View Catalog <FiArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/services/request">
                <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:.96 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white border-2 transition"
                  style={{ borderColor:"rgba(255,255,255,0.3)", background:"rgba(255,255,255,0.08)" }}>
                  Request Service <FiArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
          <motion.div initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:.8, delay:.3 }}
            className="hidden lg:block float">
            <div className="rounded-3xl p-8 neon-card" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", backdropFilter:"blur(16px)" }}>
              <div className="text-6xl text-center mb-5">🖥️</div>
              <p className="text-white font-bold text-xl text-center mb-2">Your IT Command Center</p>
              <p className="text-slate-400 text-sm text-center mb-6">Everything in one place</p>
              <div className="grid grid-cols-3 gap-3">
                {["🔧 Repair","☁️ Cloud","🛡️ Security","📦 Hardware","📊 Reports","🎧 Support"].map(s => (
                  <div key={s} className="rounded-xl py-3 text-xs font-medium text-center text-slate-300"
                    style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)" }}>{s}</div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="overflow-hidden py-4 border-y border-slate-200 bg-sky-50">
        <div className="marquee-inner">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} className="mx-8 text-sm font-semibold whitespace-nowrap cursor-default text-slate-500 hover:text-sky-600 transition-colors">
              {item}<span className="mx-6 opacity-30">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section ref={statsRef} className="py-16 px-6 md:px-10 lg:px-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STATS.map((s, i) => (
            <FadeUp key={i} delay={i*.1}>
              <motion.div whileHover={{ scale:1.04 }} className="card p-8 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background:s.color+"18" }}>
                  <s.icon className="w-7 h-7" style={{ color:s.color }} />
                </div>
                <p className="text-4xl font-black mb-1" style={{ color:s.color }}>
                  {counts[i].toLocaleString()}{s.suffix}
                </p>
                <p className="text-sm text-slate-500 font-medium">{s.label}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="py-10 px-6 md:px-10 lg:px-16 border-y border-slate-200 bg-slate-50">
        <FadeUp className="text-center mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Trusted by industry leaders</p>
        </FadeUp>
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {LOGOS.map(name => (
            <motion.div key={name} whileHover={{ scale:1.08 }}
              className="card px-6 py-3 rounded-xl text-sm font-bold cursor-default text-slate-400 hover:text-sky-600 transition-colors">
              {name}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 md:px-10 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-14">
            <SectionLabel text="The Process" />
            <h2 className="ct-h2 text-slate-900">How It Works</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px"
              style={{ background:"linear-gradient(90deg,#0EA5E9,#1E293B,#10B981)", opacity:.3 }} />
            {STEPS.map((s,i) => (
              <FadeUp key={i} delay={i*.12}>
                <div className="card p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 font-black text-lg text-white btn-primary">
                    {s.n}
                  </div>
                  <s.icon className="w-6 h-6 mx-auto mb-3 text-sky-500" />
                  <h3 className="font-bold text-slate-800 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-20 px-6 md:px-10 lg:px-16 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <SectionLabel text="What We Offer" color="#1E293B" />
            <h2 className="ct-h2 text-slate-900">Featured Services</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s,i) => (
              <FadeUp key={i} delay={i*.07}>
                <motion.div whileHover={{ y:-6 }} className="service-card p-6 cursor-pointer">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background:s.color+"18" }}>
                    <s.icon className="w-6 h-6" style={{ color:s.color }} />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{s.desc}</p>
                  <span className="text-xs font-bold flex items-center gap-1" style={{ color:s.color }}>
                    Learn more <FiArrowRight className="w-3 h-3" />
                  </span>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      {featured.length > 0 && (
        <section className="py-20 px-6 md:px-10 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <FadeUp className="flex items-end justify-between mb-10">
              <div>
                <SectionLabel text="Shop" color="#10B981" />
                <h2 className="ct-h2 text-slate-900">Featured Products</h2>
              </div>
              <Link to="/shop" className="text-sm font-bold text-slate-400 hover:text-sky-600 transition">View all →</Link>
            </FadeUp>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p,i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIAL ── */}
      <section className="py-20 px-6 md:px-10 lg:px-16 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-10">
            <SectionLabel text="Testimonial" />
            <h2 className="ct-h2 text-slate-900">What Clients Say</h2>
          </FadeUp>
          <FadeUp>
            <div className="card p-8 md:p-10">
              <div className="flex gap-1 mb-5">
                {Array(5).fill(0).map((_,i) => <span key={i} className="text-yellow-400 text-xl">★</span>)}
              </div>
              <p className="text-xl md:text-2xl text-slate-700 leading-relaxed mb-8 italic font-light">
                "Data recovery saved a client pitch. Transparent pricing and fast turnaround."
              </p>
              <div className="flex items-center justify-between flex-wrap gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-xl btn-primary">D</div>
                  <div>
                    <p className="font-bold text-slate-800 text-lg">Daniel R.</p>
                    <p className="text-sm text-slate-500">Founder, TechCrop</p>
                  </div>
                </div>
                <motion.button whileHover={{ scale:1.05 }}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-bold text-slate-700 card transition">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center btn-primary">
                    <FiPlay className="w-4 h-4 text-white ml-0.5" />
                  </div>
                  Watch Video Testimonial
                </motion.button>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-20 px-6 md:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <SectionLabel text="Pricing" color="#1E293B" />
            <h2 className="ct-h2 text-slate-900">Simple, Transparent Pricing</h2>
            <p className="text-slate-500 mt-3">No hidden fees. Cancel anytime.</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan,i) => (
              <FadeUp key={i} delay={i*.1}>
                <motion.div whileHover={{ scale:1.03 }} className="card p-8 flex flex-col h-full relative">
                  {plan.tag && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black text-white"
                      style={{ background:plan.accent }}>{plan.tag}</span>
                  )}
                  <h3 className="font-black text-xl text-slate-800 mb-3">{plan.name}</h3>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-black" style={{ color:plan.accent }}>{plan.price}</span>
                    <span className="text-slate-400 mb-1 text-sm">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <FiCheck className="w-4 h-4 flex-shrink-0" style={{ color:plan.accent }} /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/services/request">
                    <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:.97 }}
                      className="w-full py-3 rounded-xl font-bold text-white transition"
                      style={{ background:`linear-gradient(135deg,${plan.accent},${plan.accent}cc)` }}>
                      Get Started
                    </motion.button>
                  </Link>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEARCH ── */}
      <section className="py-20 px-6 md:px-10 lg:px-16 bg-sky-50 border-t border-sky-100">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <h2 className="ct-h2 text-slate-900 mb-3">Find What You Need</h2>
            <p className="text-slate-500 mb-8">Search across products, services, and support articles.</p>
            <form onSubmit={e => { e.preventDefault(); if(search.trim()) navigate("/shop?q="+encodeURIComponent(search)); }}
              className="flex gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by product, service, or service code..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-sm focus:outline-none transition border border-slate-200 bg-white text-slate-800"
                  onFocus={e => e.target.style.boxShadow="0 0 0 2px #0EA5E9"}
                  onBlur={e => e.target.style.boxShadow=""} />
              </div>
              <motion.button type="submit" whileHover={{ scale:1.05 }} whileTap={{ scale:.97 }}
                className="btn-primary px-6 py-4 flex-shrink-0">
                Search
              </motion.button>
            </form>
          </FadeUp>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6 md:px-10 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <FadeUp className="text-center mb-10">
            <SectionLabel text="FAQ" />
            <h2 className="ct-h2 text-slate-900">Frequently Asked Questions</h2>
          </FadeUp>
          <div className="space-y-3">
            {FAQS.map((f,i) => <FadeUp key={i} delay={i*.06}><FaqItem {...f} /></FadeUp>)}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6 md:px-10 lg:px-16 relative overflow-hidden"
        style={{ background:"linear-gradient(135deg,#1E293B,#0f2744,#1E293B)" }}>
        <motion.div className="absolute inset-0 pointer-events-none"
          style={{ background:"radial-gradient(ellipse at 50% 50%,rgba(14,165,233,0.12),transparent 70%)" }}
          animate={{ scale:[1,1.1,1] }} transition={{ duration:6, repeat:Infinity, ease:"easeInOut" }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5">
              Ready to transform your IT operations?
            </h2>
            <p className="text-slate-400 mb-10 text-lg">Join thousands of businesses that trust ColdTech.</p>
            <Link to="/services/request">
              <motion.button whileHover={{ scale:1.06 }} whileTap={{ scale:.97 }}
                className="btn-primary px-10 py-5 text-lg font-black rounded-2xl">
                Get Started Today <FiArrowRight className="inline w-5 h-5 ml-1" />
              </motion.button>
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── FLOATING CHAT ── */}
      <AnimatePresence>
        {showChat && (
          <motion.div initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0, opacity:0 }}
            className="fixed bottom-6 right-6 z-50">
            <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:.95 }}
              className="btn-primary flex items-center gap-2 px-5 py-3 rounded-2xl pulse-ring">
              <FiMessageCircle className="w-5 h-5" />
              <span className="text-sm font-bold">Support 24/7</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
