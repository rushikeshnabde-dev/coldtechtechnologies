import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { FiCheckCircle, FiArrowRight, FiPhone, FiMapPin } from "react-icons/fi";

const SERVICES = [
  { title: "Computer Repair & Troubleshooting", desc: "Fast hardware and software repair for laptops, desktops, and servers in Pune." },
  { title: "Data Recovery Pune",                desc: "Recover lost files, repair hard drives, and restore critical business data." },
  { title: "Network Setup & IT Support",        desc: "WiFi setup, LAN configuration, and ongoing IT support for Pune businesses." },
  { title: "Performance Optimization",          desc: "Speed up slow computers with RAM upgrades, SSD installation, and system cleanup." },
  { title: "Cybersecurity Solutions",           desc: "Protect your business from threats with firewall setup and security audits." },
  { title: "Enterprise IT Solutions",           desc: "Scalable IT infrastructure, cloud migration, and managed IT services for enterprises." },
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "IT Solutions in Pune — Coldtech Technologies",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Coldtech Technologies",
    "url": "https://coldtechtechnologies.in",
    "telephone": "+91-98765-43210",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "postalCode": "411001",
      "addressCountry": "IN"
    }
  },
  "areaServed": { "@type": "City", "name": "Pune" },
  "serviceType": "IT Solutions",
  "url": "https://coldtechtechnologies.in/it-solutions-pune",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://coldtechtechnologies.in/" },
      { "@type": "ListItem", "position": 2, "name": "IT Solutions Pune", "item": "https://coldtechtechnologies.in/it-solutions-pune" }
    ]
  }
};

export function ITSolutionsPune() {
  return (
    <div className="w-full bg-[var(--color-page)]">
      <SEO
        title="IT Solutions Company in Pune — Expert IT Services"
        description="Looking for IT solutions in Pune? Coldtech Technologies offers computer repair, data recovery, networking & enterprise IT support. Call us today."
        keywords="IT solutions Pune, IT company Pune, computer repair Pune, enterprise IT solutions Pune, IT services Pune, data recovery Pune, network setup Pune, IT support Pune India"
        canonical="/it-solutions-pune"
        schema={SCHEMA}
      />

      {/* Hero */}
      <section
        className="relative py-24 px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1A00CC 0%, #0A0A2E 60%, #1A00CC 100%)" }}
      >
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: "rgba(0,191,255,0.15)", color: "#00BFFF", border: "1px solid rgba(0,191,255,0.3)" }}>
            <FiMapPin className="w-3 h-3" /> Serving Pune, Maharashtra
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            #1 IT Solutions Company in Pune
          </h1>
          <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
            Coldtech Technologies delivers fast, transparent, and reliable IT solutions for individuals and businesses across Pune. From computer repair to enterprise IT infrastructure — we've got you covered.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/services/request">
              <button className="btn-cyan flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #00BFFF, #1A00CC)" }}>
                Get IT Support Now <FiArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <a href="tel:+919876543210">
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white border border-white/30 hover:bg-white/10 transition">
                <FiPhone className="w-4 h-4" /> Call +91 98765 43210
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[var(--color-text)] mb-3">
            IT Services We Offer in Pune
          </h2>
          <p className="text-center text-[var(--color-text-muted)] mb-10 max-w-2xl mx-auto">
            Comprehensive IT solutions tailored for Pune businesses and individuals. Same-day service available.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <div key={i} className="p-6 rounded-2xl border border-[var(--color-border)] bg-white shadow-sm hover:shadow-md transition">
                <FiCheckCircle className="w-6 h-6 mb-3" style={{ color: "#00BFFF" }} />
                <h3 className="font-bold text-[var(--color-text)] mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Coldtech in Pune */}
      <section className="py-16 px-6" style={{ background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-4">
            Why Choose Coldtech Technologies in Pune?
          </h2>
          <p className="text-[var(--color-text-muted)] mb-10">
            We're not just another IT company — we're your long-term technology partner in Pune.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
            {[
              ["Same-Day Service", "Most repairs completed the same day. No long waits."],
              ["Transparent Pricing", "Upfront quotes with no hidden charges — ever."],
              ["Real-Time Tracking", "Track your service request live with a unique ticket ID."],
              ["Certified Technicians", "Experienced, vetted IT professionals you can trust."],
              ["24/7 Emergency Support", "Critical IT issues don't wait — neither do we."],
              ["Local Pune Expertise", "We understand the IT needs of Pune businesses."],
            ].map(([title, desc], i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[var(--color-border)]">
                <FiCheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#00BFFF" }} />
                <div>
                  <p className="font-semibold text-[var(--color-text)] text-sm">{title}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NAP + CTA */}
      <section className="py-16 px-6" style={{ background: "linear-gradient(135deg, #1A00CC, #0A0A2E)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Solve Your IT Problems?</h2>
          <p className="text-blue-200 mb-2">Coldtech Technologies — Pune, Maharashtra, India</p>
          <p className="text-blue-300 text-sm mb-8">
            <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
            {" · "}
            <a href="mailto:support@coldtechtechnologies.in" className="hover:text-white transition-colors">support@coldtechtechnologies.in</a>
          </p>
          <Link to="/services/request">
            <button className="px-8 py-3 rounded-xl font-semibold text-white transition"
              style={{ background: "linear-gradient(135deg, #00BFFF, #4FC3F7)" }}>
              Submit a Service Request <FiArrowRight className="inline w-4 h-4 ml-1" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
