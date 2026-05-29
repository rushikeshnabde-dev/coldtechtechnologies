import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { SEO } from "../components/SEO";
import {
  FiShield, FiZap, FiAward, FiHeart, FiTrendingUp,
  FiClock, FiUsers, FiCheckCircle, FiStar, FiArrowRight,
  FiMonitor, FiSmartphone, FiServer,
} from "react-icons/fi";

// ── Helpers ───────────────────────────────────────────────────────────────────

function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }} className={className}>
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

// ── Data ──────────────────────────────────────────────────────────────────────

const VALUES = [
  { icon: FiShield,    title: "Transparency First",        desc: "Clear pricing, no hidden fees. You always know what you're paying for." },
  { icon: FiZap,       title: "Speed Without Compromise",  desc: "Quick response times without cutting corners on quality." },
  { icon: FiAward,     title: "Expertise You Can Trust",   desc: "Certified, experienced technicians who know their craft." },
  { icon: FiHeart,     title: "Customer Obsession",        desc: "Your satisfaction is our north star — always." },
  { icon: FiTrendingUp,title: "Continuous Innovation",     desc: "Always improving, always evolving with the latest tech." },
];

const STEPS = [
  { n: "01", title: "Submit Request",  desc: "Describe your issue and upload photos for faster diagnosis." },
  { n: "02", title: "Get Quote",       desc: "Receive transparent, upfront pricing — no surprises." },
  { n: "03", title: "Track Progress",  desc: "See real-time status updates every step of the way." },
  { n: "04", title: "Pay & Relax",     desc: "Secure payment, digital invoice, and peace of mind." },
];

const BENEFITS = [
  { icon: FiClock,        title: "24/7 Support",           desc: "Help whenever you need it, day or night." },
  { icon: FiAward,        title: "Certified Experts",      desc: "Vetted, trained professionals only." },
  { icon: FiShield,       title: "Transparent Pricing",    desc: "Know costs upfront, always." },
  { icon: FiTrendingUp,   title: "Real-Time Tracking",     desc: "Full visibility into your service." },
  { icon: FiCheckCircle,  title: "Digital History",        desc: "All records saved and accessible." },
  { icon: FiHeart,        title: "Satisfaction Guaranteed",desc: "We make it right, every time." },
];

const STATS = [
  { label: "Years Experience",      value: 5,    suffix: "+" },
  { label: "Happy Customers",       value: 1000, suffix: "+" },
  { label: "Expert Technicians",    value: 25,   suffix: "+" },
  { label: "Jobs Completed",        value: 5000, suffix: "+" },
  { label: "Cities Served",         value: 10,   suffix: "+" },
  { label: "Customer Satisfaction", value: 98,   suffix: "%" },
];

const TEAM = [
  { name: "Rajesh Kumar",   role: "Founder & CEO",              emoji: "👨‍💼", desc: "Visionary leader with 15+ years in IT." },
  { name: "Priya Sharma",   role: "Head of Operations",         emoji: "👩‍💼", desc: "Driving service excellence every day." },
  { name: "Arjun Mehta",    role: "Lead Technician",            emoji: "👨‍🔧", desc: "Certified expert in hardware & networks." },
  { name: "Sneha Patel",    role: "Customer Success Manager",   emoji: "👩‍💻", desc: "Ensuring every customer is delighted." },
];

const TESTIMONIALS = [
  { name: "Amit Verma",    role: "Small Business Owner", quote: "ColdTech fixed my server issue in under 2 hours. Incredible response time and transparent pricing!", stars: 5 },
  { name: "Riya Nair",     role: "Freelance Designer",   quote: "My laptop was completely dead. They recovered all my data and had it running like new. Lifesavers!", stars: 5 },
  { name: "Suresh Gupta",  role: "Startup Founder",      quote: "We use ColdTech for all our office IT needs. Professional, reliable, and always on time.", stars: 5 },
];

// ── Stat card with counter ────────────────────────────────────────────────────
function StatCard({ label, value, suffix, start }) {
  const count = useCounter(value, 2000, start);
  return (
    <div className="text-center p-6 rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
      <p className="text-3xl font-bold font-[family-name:var(--font-display)]" style={{ color: "#00A6C4" }}>
        {count}{suffix}
      </p>
      <p className="text-sm text-[var(--color-text-muted)] mt-1">{label}</p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function About() {
  const statsRef  = useRef(null);
  const statsView = useInView(statsRef, { once: true, margin: "-60px" });

  return (
    <div className="w-full bg-[var(--color-page)]">
      <SEO
        title="About Us — IT Solutions Company in Pune"
        description="Learn about Coldtech Technologies — Pune's trusted IT solutions company. Our mission, team, values, and commitment to fast, transparent IT support."
        keywords="about Coldtech Technologies, IT company Pune, IT support team Pune, computer repair experts Pune, IT solutions India"
        canonical="/about"
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Coldtech Technologies",
          "url": "https://coldtechtechnologies.in/about",
          "description": "Coldtech Technologies is a Pune-based IT solutions company providing computer repair, data recovery, networking, and enterprise IT support.",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://coldtechtechnologies.in/" },
              { "@type": "ListItem", "position": 2, "name": "About", "item": "https://coldtechtechnologies.in/about" }
            ]
          }
        }}
      />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden py-24 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #1A2C3E 0%, #0e3a52 55%, #0a2a3e 100%)" }}>
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        {/* Floating icons */}
        {[FiMonitor, FiSmartphone, FiServer].map((Icon, i) => (
          <motion.div key={i} className="absolute opacity-10 text-cyan-400"
            style={{ top: `${20 + i * 25}%`, left: i % 2 === 0 ? `${5 + i * 3}%` : "auto", right: i % 2 !== 0 ? `${5 + i * 3}%` : "auto" }}
            animate={{ y: [0, -12, 0] }} transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}>
            <Icon size={48} />
          </motion.div>
        ))}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: "rgba(0,166,196,0.2)", color: "#00A6C4", border: "1px solid rgba(0,166,196,0.3)" }}>
            About Us
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-white mb-4">
            COLDTECH TECHNOLOGIES
          </h1>
          <p className="text-xl text-cyan-300 font-medium mb-6">Technology Support, Simplified</p>
          <p className="text-blue-200 text-base max-w-2xl mx-auto leading-relaxed">
            We're a modern IT service provider dedicated to making technology problems invisible. From hardware repairs to network solutions, we deliver fast, transparent, and reliable support.
          </p>
        </motion.div>
      </div>

      {/* ── Story ── */}
      <section className="ct-section ct-container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <SectionLabel text="Our Story" />
            <h2 className="ct-h2 text-[var(--color-text)] mb-5">The ColdTech Story</h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed text-base">
              COLDTECH TECHNOLOGIES was founded with a simple belief: getting technical help shouldn't be complicated. We saw too many businesses and individuals struggling with slow response times, unclear pricing, and frustrating communication. So we built something better — a platform that combines expert technicians with a seamless digital experience. Today, we're proud to serve hundreds of customers with the IT support they deserve.
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="rounded-3xl p-px shadow-xl" style={{ background: "linear-gradient(135deg, #00A6C4, #1A2C3E)" }}>
              <div className="rounded-3xl p-10 text-center" style={{ background: "linear-gradient(135deg, #1A2C3E, #0e3a52)" }}>
                <div className="text-6xl mb-4">💻</div>
                <p className="text-white font-semibold text-lg">Built for the modern era</p>
                <p className="text-blue-300 text-sm mt-2">Combining expert technicians with seamless digital experience</p>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {["🔧 Repair", "🌐 Network", "💾 Recovery"].map(s => (
                    <div key={s} className="bg-white/10 rounded-xl py-3 text-white text-xs font-medium">{s}</div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="ct-section" style={{ background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)" }}>
        <div className="ct-container max-w-5xl mx-auto">
          <FadeIn className="text-center mb-10">
            <SectionLabel text="Purpose" />
            <h2 className="ct-h2 text-[var(--color-text)]">Mission & Vision</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { emoji: "🎯", title: "Our Mission", text: "To provide fast, transparent, and reliable IT solutions that empower our customers to focus on what matters most — their business and their life." },
              { emoji: "🔭", title: "Our Vision",  text: "To become India's most trusted technology partner, setting new standards for IT service excellence through innovation and customer-first approach." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="p-px rounded-3xl h-full" style={{ background: "linear-gradient(135deg, #00A6C4, #1A2C3E)" }}>
                  <div className="bg-white rounded-3xl p-8 h-full">
                    <div className="text-4xl mb-4">{item.emoji}</div>
                    <h3 className="text-lg font-bold text-[var(--color-text)] mb-3">{item.title}</h3>
                    <p className="text-[var(--color-text-muted)] leading-relaxed text-sm">{item.text}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="ct-section ct-container max-w-6xl mx-auto">
        <FadeIn className="text-center mb-10">
          <SectionLabel text="What We Stand For" />
          <h2 className="ct-h2 text-[var(--color-text)]">Our Core Values</h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VALUES.map((v, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <motion.div whileHover={{ y: -4 }} className="service-card p-6 h-full">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, #1A2C3E, #00A6C4)" }}>
                  <v.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-[var(--color-text)] mb-2">{v.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{v.desc}</p>
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
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #00A6C4, #2E8B57)" }}>
                    {s.n}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-blue-300">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="ct-section ct-container max-w-6xl mx-auto">
        <FadeIn className="text-center mb-10">
          <SectionLabel text="Why ColdTech" />
          <h2 className="ct-h2 text-[var(--color-text)]">Why Choose COLDTECH TECHNOLOGIES</h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((b, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <motion.div whileHover={{ scale: 1.02 }} className="card p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(0,166,196,0.12)" }}>
                  <b.icon className="w-5 h-5" style={{ color: "#00A6C4" }} />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-text)] text-sm mb-1">{b.title}</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">{b.desc}</p>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section ref={statsRef} className="ct-section" style={{ background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)" }}>
        <div className="ct-container max-w-5xl mx-auto">
          <FadeIn className="text-center mb-10">
            <SectionLabel text="By The Numbers" />
            <h2 className="ct-h2 text-[var(--color-text)]">Our Impact</h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {STATS.map((s, i) => <StatCard key={i} {...s} start={statsView} />)}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="ct-section ct-container max-w-6xl mx-auto">
        <FadeIn className="text-center mb-10">
          <SectionLabel text="The People" />
          <h2 className="ct-h2 text-[var(--color-text)]">Meet Our Leadership</h2>
          <p className="text-[var(--color-text-muted)] mt-2">The experts behind COLDTECH TECHNOLOGIES</p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map((m, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <motion.div whileHover={{ y: -4 }} className="card p-6 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl"
                  style={{ background: "linear-gradient(135deg, #1A2C3E, #00A6C4)" }}>
                  {m.emoji}
                </div>
                <h3 className="font-bold text-[var(--color-text)]">{m.name}</h3>
                <p className="text-xs font-medium mt-0.5 mb-2" style={{ color: "#00A6C4" }}>{m.role}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{m.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="ct-section" style={{ background: "linear-gradient(135deg, #f0fdf4, #e0f2fe)" }}>
        <div className="ct-container max-w-5xl mx-auto">
          <FadeIn className="text-center mb-10">
            <SectionLabel text="What Customers Say" />
            <h2 className="ct-h2 text-[var(--color-text)]">Customer Stories</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <motion.div whileHover={{ y: -4 }} className="card p-6 h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {Array(t.stars).fill(0).map((_, j) => <FiStar key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed flex-1 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[var(--color-border)]">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ background: "linear-gradient(135deg, #1A2C3E, #00A6C4)" }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text)]">{t.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ct-section" style={{ background: "linear-gradient(135deg, #1A2C3E, #0e3a52)" }}>
        <div className="ct-container max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className="ct-h2 text-white mb-3">Ready to Experience ColdTech?</h2>
            <p className="text-blue-200 mb-8">Join thousands of satisfied customers who trust COLDTECH TECHNOLOGIES for their IT needs.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/services/request">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="btn-cyan flex items-center gap-2">
                  Submit Service Request <FiArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="btn-outline flex items-center gap-2" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>
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