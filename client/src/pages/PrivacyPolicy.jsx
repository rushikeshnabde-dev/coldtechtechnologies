import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShield, FiArrowRight, FiChevronRight } from "react-icons/fi";
import { SEO } from "../components/SEO";

const EFFECTIVE_DATE = "20 April 2026";

const SECTIONS = [
  { id: "introduction",       title: "Introduction" },
  { id: "information",        title: "Information We Collect" },
  { id: "usage",              title: "How We Use Your Information" },
  { id: "sharing",            title: "Sharing of Information" },
  { id: "security",           title: "Data Security" },
  { id: "cookies",            title: "Cookies & Tracking" },
  { id: "third-party",        title: "Third-Party Services" },
  { id: "rights",             title: "Your Rights" },
  { id: "retention",          title: "Data Retention" },
  { id: "changes",            title: "Changes to This Policy" },
  { id: "contact",            title: "Contact Us" },
];

function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24 mb-10">
      <h2 className="text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-200 flex items-center gap-2">
        <span className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ background: "linear-gradient(135deg,#3AB6FF,#1E90FF)" }} />
        {title}
      </h2>
      <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Highlight({ children }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl my-3"
      style={{ background: "rgba(58,182,255,0.06)", border: "1px solid rgba(58,182,255,0.2)" }}>
      <FiShield className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#3AB6FF" }} />
      <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{children}</p>
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-1.5 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
          <FiChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#3AB6FF" }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full bg-[var(--color-page)] min-h-screen">
      <SEO
        title="Privacy Policy – Coldtech Technologies"
        description="Read Coldtech Technologies' Privacy Policy. Learn how we collect, use, and protect your personal data when you use our IT repair and support services in Pune, India."
        keywords="privacy policy IT services India, Coldtech Technologies privacy, data protection IT company Pune"
        canonical="/privacy-policy"
      />

      {/* Hero */}
      <div className="relative overflow-hidden py-16 px-6"
        style={{ background: "linear-gradient(135deg,#0f172a 0%,#0f2744 60%,#1e293b 100%)" }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5 uppercase tracking-widest"
            style={{ background: "rgba(58,182,255,0.15)", color: "#38BDF8", border: "1px solid rgba(58,182,255,0.3)" }}>
            <FiShield className="w-3.5 h-3.5" /> Legal
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-white mb-3"
            style={{ fontFamily: "var(--font-display)" }}>
            Privacy Policy
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm">
            Effective Date: <span className="text-slate-300 font-semibold">{EFFECTIVE_DATE}</span>
            &nbsp;·&nbsp; Website:{" "}
            <a href="https://coldtechtechnologies.in" className="text-sky-400 hover:underline">
              coldtechtechnologies.in
            </a>
          </motion.p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="flex gap-10 items-start">

          {/* Sticky TOC — desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Contents</p>
            <nav className="space-y-0.5">
              {SECTIONS.map(s => (
                <a key={s.id} href={`#${s.id}`}
                  className="block px-3 py-2 rounded-xl text-xs font-medium transition-all"
                  style={activeSection === s.id
                    ? { background: "rgba(58,182,255,0.1)", color: "#3AB6FF", borderLeft: "2px solid #3AB6FF", paddingLeft: "10px" }
                    : { color: "#64748b" }}
                  onClick={e => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }); }}>
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <article className="flex-1 min-w-0 max-w-3xl">

            <Section id="introduction" title="Introduction">
              <p>
                Coldtech Technologies ("we", "our", "us") respects your privacy and is committed to protecting
                your personal data. This Privacy Policy explains how we collect, use, and safeguard your
                information when you visit our website or use our services.
              </p>
              <p>
                By using our website or services, you agree to the collection and use of information in
                accordance with this policy.
              </p>
            </Section>

            <Section id="information" title="Information We Collect">
              <p>We may collect the following types of information:</p>

              <div className="mt-4 space-y-4">
                <div className="card p-4">
                  <h3 className="text-sm font-bold text-slate-800 mb-2">a) Personal Information</h3>
                  <BulletList items={["Name", "Phone number", "Email address", "Address (if provided)"]} />
                </div>
                <div className="card p-4">
                  <h3 className="text-sm font-bold text-slate-800 mb-2">b) Technical Data</h3>
                  <BulletList items={["IP address", "Browser type", "Device information", "Pages visited and usage data"]} />
                </div>
                <div className="card p-4">
                  <h3 className="text-sm font-bold text-slate-800 mb-2">c) Service Information</h3>
                  <BulletList items={["Device details (for repair services)", "Issue descriptions", "Service history"]} />
                </div>
              </div>
            </Section>

            <Section id="usage" title="How We Use Your Information">
              <p>We use your information to:</p>
              <BulletList items={[
                "Provide IT repair and support services",
                "Respond to inquiries and customer requests",
                "Process bookings and service orders",
                "Improve our website and services",
                "Send updates, offers, or service-related communication",
              ]} />
            </Section>

            <Section id="sharing" title="Sharing of Information">
              <Highlight>We do not sell your personal data. Ever.</Highlight>
              <p>We may share data only with:</p>
              <BulletList items={[
                "Service providers (payment gateways, hosting providers)",
                "Legal authorities (if required by law)",
              ]} />
            </Section>

            <Section id="security" title="Data Security">
              <p>
                We implement appropriate security measures to protect your data from unauthorized access,
                misuse, or disclosure. Our systems use encryption, secure servers, and access controls.
              </p>
              <p className="text-xs text-slate-400 italic">
                Note: No online system is 100% secure. We strive to use commercially acceptable means to
                protect your data but cannot guarantee absolute security.
              </p>
            </Section>

            <Section id="cookies" title="Cookies & Tracking">
              <p>Our website may use cookies to:</p>
              <BulletList items={[
                "Improve user experience",
                "Analyze website traffic",
                "Remember user preferences",
              ]} />
              <p className="mt-3">
                You can disable cookies in your browser settings at any time. Disabling cookies may affect
                some features of our website.
              </p>
            </Section>

            <Section id="third-party" title="Third-Party Services">
              <p>We may use third-party tools such as:</p>
              <BulletList items={[
                "Google Analytics — for website traffic analysis",
                "Payment gateways (e.g., Razorpay) — for secure transactions",
                "Cloud hosting providers — for data storage",
              ]} />
              <p className="mt-3">
                These services have their own privacy policies. We encourage you to review them.
              </p>
            </Section>

            <Section id="rights" title="Your Rights">
              <p>You have the right to:</p>
              <BulletList items={[
                "Access your personal data we hold",
                "Request correction of inaccurate data",
                "Request deletion of your data",
                "Withdraw consent at any time",
                "Lodge a complaint with a data protection authority",
              ]} />
              <p className="mt-3">
                To exercise any of these rights, contact us using the details in the Contact section below.
              </p>
            </Section>

            <Section id="retention" title="Data Retention">
              <p>
                We retain your information only as long as necessary for the purpose it was collected,
                or as required by applicable law. Service records are typically retained for up to 3 years.
              </p>
            </Section>

            <Section id="changes" title="Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this
                page with an updated effective date. We encourage you to review this page periodically.
              </p>
              <p>
                Continued use of our website after changes constitutes your acceptance of the updated policy.
              </p>
            </Section>

            <Section id="contact" title="Contact Us">
              <p>If you have any questions about this Privacy Policy, please contact us:</p>

              <div className="mt-4 card p-6 space-y-3">
                {[
                  { icon: "🏢", label: "Company",  value: "Coldtech Technologies" },
                  { icon: "📍", label: "Address",  value: "PCMC, Pune, Maharashtra 410507, India" },
                  { icon: "📞", label: "Phone",    value: "+91 9529882920", href: "tel:+919529882920" },
                  { icon: "📧", label: "Email",    value: "support@coldtechtechnologies.in", href: "mailto:support@coldtechtechnologies.in" },
                  { icon: "🌐", label: "Website",  value: "coldtechtechnologies.in", href: "https://coldtechtechnologies.in" },
                ].map(({ icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-3 text-sm">
                    <span className="text-base w-6 text-center">{icon}</span>
                    <span className="text-slate-400 w-16 flex-shrink-0">{label}</span>
                    {href
                      ? <a href={href} className="font-medium text-slate-700 hover:text-sky-600 transition">{value}</a>
                      : <span className="font-medium text-slate-700">{value}</span>
                    }
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link to="/contact">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="btn-primary flex items-center gap-2 px-6 py-3 text-sm">
                    Contact Us <FiArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                <a href="https://wa.me/919529882920" target="_blank" rel="noreferrer">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition border border-slate-200 text-slate-700 hover:border-green-400 hover:text-green-600 bg-white">
                    💬 WhatsApp Us
                  </motion.button>
                </a>
              </div>
            </Section>

          </article>
        </div>
      </div>
    </div>
  );
}
