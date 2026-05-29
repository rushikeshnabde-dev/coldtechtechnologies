import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { SEO } from "../components/SEO";
import {
  FiMapPin, FiPhone, FiMail, FiMessageCircle, FiClock,
  FiChevronDown, FiSend, FiAlertCircle, FiCheckCircle,
  FiUpload, FiX,
} from "react-icons/fi";
import {
  FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube,
} from "react-icons/fa";

// ── Helpers ───────────────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }}
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

const inp = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-page)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#00A6C4] transition";

// ── Data ──────────────────────────────────────────────────────────────────────

const WHATSAPP_URL = "https://wa.me/919529882920";

const INFO_CARDS = [
  { icon: FiMapPin,        color: "#00A6C4", title: "Visit Us",     lines: ["PCMC, Pune, Maharashtra 410507", "India"],                                          href: null },
  { icon: FiPhone,         color: "#2E8B57", title: "Call Us",      lines: ["+91 95298 82920", "+91 89990 17707"],                                         href: "tel:+919529882920" },
  { icon: FiMail,          color: "#1A2C3E", title: "Email Us",     lines: ["sales@coldtechtechnologies.in"],                                              href: "mailto:sales@coldtechtechnologies.in" },
  { icon: FiMessageCircle, color: "#00A6C4", title: "Chat With Us", lines: ["WhatsApp: 9 AM - 9 PM", "Tap to chat instantly"],                             href: WHATSAPP_URL },
];

const HOURS = [
  { day: "Monday - Friday", time: "9:00 AM - 8:00 PM" },
  { day: "Saturday",        time: "10:00 AM - 6:00 PM" },
  { day: "Sunday",          time: "10:00 AM - 4:00 PM" },
  { day: "Emergency",       time: "24/7 Always Available" },
];

const FAQS = [
  { q: "How quickly will I get a response?", a: "We respond to all inquiries within 2 hours during business hours. For emergencies, we're available 24/7." },
  { q: "Do you provide on-site support?", a: "Yes! We offer both remote and on-site support across Pune and surrounding areas." },
  { q: "What areas do you serve?", a: "We primarily serve Pune, Maharashtra, and offer remote IT support across India." },
  { q: "How do I track my service request?", a: "After submitting a request, you'll receive a ticket ID. Use it on our Track Request page for real-time updates." },
  { q: "What payment methods do you accept?", a: "We accept UPI, credit/debit cards, net banking, and cash on delivery for on-site services." },
  { q: "Is my data secure?", a: "Absolutely. We follow strict data privacy protocols and never access your personal files without explicit permission." },
];

const SOCIALS = [
  { icon: FaFacebook,  label: "Facebook",  href: "#", color: "#1877F2" },
  { icon: FaTwitter,   label: "Twitter",   href: "#", color: "#1DA1F2" },
  { icon: FaLinkedin,  label: "LinkedIn",  href: "#", color: "#0A66C2" },
  { icon: FaInstagram, label: "Instagram", href: "#", color: "#E4405F" },
  { icon: FaYoutube,   label: "YouTube",   href: "#", color: "#FF0000" },
];

// ── FAQ Item ──────────────────────────────────────────────────────────────────

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[var(--color-border)] rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-page)] transition">
        {q}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FiChevronDown className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-4 text-sm text-[var(--color-text-muted)] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function Contact() {
  const [form, setForm]       = useState({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
  const [file, setFile]       = useState(null);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const fileRef               = useRef(null);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  function validate() {
    const e = {};
    if (form.name.trim().length < 2)                              e.name    = "Name must be at least 2 characters";
    if (!form.email.trim())                                       e.email   = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))     e.email   = "Enter a valid email";
    if (!form.phone.trim())                                       e.phone   = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g,""))) e.phone   = "Enter a valid Indian phone number";
    if (form.message.trim().length < 10)                          e.message = "Message must be at least 10 characters";
    return e;
  }

  function handleFile(f) {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error("File must be under 5MB"); return; }
    if (!["image/jpeg","image/png","image/webp","application/pdf"].includes(f.type)) {
      toast.error("Only images and PDFs allowed"); return;
    }
    setFile(f);
  }

  async function submit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
    toast.success("Message sent! We'll get back to you shortly.");
  }

  return (
    <div className="w-full bg-[var(--color-page)]">
      <SEO
        title="Contact Coldtech Technologies — IT Support & Computer Repair in Pune"
        description="Contact Coldtech Technologies for laptop repair, data recovery, and IT support in Pune. Call +91 95298 82920. Fast response, 24/7 emergency support available."
        keywords="contact IT support Pune, computer repair Pune phone number, laptop repair near me Pune, IT helpdesk Pune, emergency IT support Pune, Coldtech Technologies contact"
        canonical="/contact"
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Coldtech Technologies — IT Support Pune",
          "url": "https://coldtechtechnologies.in/contact",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://coldtechtechnologies.in/" },
              { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://coldtechtechnologies.in/contact" }
            ]
          },
          "mainEntity": {
            "@type": "LocalBusiness",
            "name": "Coldtech Technologies",
            "telephone": "+91-9529882920",
            "email": "sales@coldtechtechnologies.in",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "PCMC",
              "addressLocality": "Pune",
              "addressRegion": "Maharashtra",
              "postalCode": "410507",
              "addressCountry": "IN"
            },
            "openingHoursSpecification": [
              { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "09:00", "closes": "20:00" },
              { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "10:00", "closes": "18:00" },
              { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "10:00", "closes": "16:00" }
            ]
          }
        }}
      />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #1A2C3E 0%, #0e3a52 55%, #0a2a3e 100%)" }}>
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        {[FiMail, FiPhone, FiMessageCircle].map((Icon, i) => (
          <motion.div key={i} className="absolute opacity-10 text-cyan-400"
            style={{ top: `${20 + i * 25}%`, left: i % 2 === 0 ? `${4 + i * 4}%` : "auto", right: i % 2 !== 0 ? `${4 + i * 4}%` : "auto" }}
            animate={{ y: [0, -10, 0] }} transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}>
            <Icon size={44} />
          </motion.div>
        ))}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{ background: "rgba(0,166,196,0.2)", color: "#00A6C4", border: "1px solid rgba(0,166,196,0.3)" }}>
            Contact Us
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-white mb-3">Contact IT Support in Pune</h1>
          <p className="text-cyan-300 text-lg font-medium mb-4">Laptop repair, data recovery & IT help — we're here.</p>
          <p className="text-blue-200 text-sm max-w-xl mx-auto leading-relaxed">
            Whether you're facing a technical issue, have a question about our services, or want to partner with us, our team is ready to assist you.
          </p>
        </motion.div>
      </div>

      {/* ── Info Cards ── */}
      <section className="ct-section ct-container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INFO_CARDS.map((c, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <motion.div whileHover={{ y: -4 }}
                className={"service-card p-6 text-center h-full" + (c.href ? " cursor-pointer" : "")}
                onClick={() => c.href && window.open(c.href, c.href.startsWith("http") ? "_blank" : "_self", "noopener,noreferrer")}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: c.color + "20" }}>
                  <c.icon className="w-6 h-6" style={{ color: c.color }} />
                </div>
                <h3 className="font-semibold text-[var(--color-text)] mb-2">{c.title}</h3>
                {c.lines.map((l, j) => <p key={j} className="text-xs text-[var(--color-text-muted)]">{l}</p>)}
                {c.href && (
                  <p className="text-xs font-semibold mt-2" style={{ color: c.color }}>
                    {c.title === "Chat With Us" ? "Open WhatsApp →" : c.title === "Call Us" ? "Tap to call →" : "Send email →"}
                  </p>
                )}
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Contact Form + Hours ── */}
      <section className="ct-section" style={{ background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)" }}>
        <div className="ct-container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Form */}
            <div className="lg:col-span-2">
              <FadeIn>
                <div className="p-px rounded-3xl shadow-xl" style={{ background: "linear-gradient(135deg, #00A6C4, #1A2C3E)" }}>
                  <div className="bg-white rounded-3xl p-6 md:p-8">
                    <SectionLabel text="Send a Message" />
                    <h2 className="ct-h2 text-[var(--color-text)] mb-6">We'd Love to Hear From You</h2>

                    {sent ? (
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                          <FiCheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">Message Sent!</h3>
                        <p className="text-sm text-[var(--color-text-muted)] mb-5">We'll get back to you within 2 hours.</p>
                        <button onClick={() => { setSent(false); setForm({ name:"",email:"",phone:"",subject:"General Inquiry",message:"" }); setFile(null); }}
                          className="btn-cyan">Send Another</button>
                      </motion.div>
                    ) : (
                      <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { k: "name",  label: "Full Name",     type: "text",  ph: "John Doe" },
                            { k: "email", label: "Email Address", type: "email", ph: "you@example.com" },
                            { k: "phone", label: "Phone Number",  type: "tel",   ph: "98765 43210" },
                          ].map(({ k, label, type, ph }) => (
                            <div key={k} className={k === "name" ? "sm:col-span-2" : ""}>
                              <label className="text-xs font-medium text-[var(--color-text-muted)] block mb-1">{label} <span className="text-red-500">*</span></label>
                              <input type={type} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph}
                                className={inp + (errors[k] ? " border-red-400" : "")} />
                              {errors[k] && <p className="text-xs text-red-500 mt-1">{errors[k]}</p>}
                            </div>
                          ))}
                          <div>
                            <label className="text-xs font-medium text-[var(--color-text-muted)] block mb-1">Subject</label>
                            <select value={form.subject} onChange={e => set("subject", e.target.value)} className={inp}>
                              {["General Inquiry","Technical Support","Business Partnership","Feedback","Other"].map(s => <option key={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium text-[var(--color-text-muted)] block mb-1">
                            Message <span className="text-red-500">*</span>
                            <span className="float-right font-normal">{form.message.length}/500</span>
                          </label>
                          <textarea rows={5} maxLength={500} value={form.message} onChange={e => set("message", e.target.value)}
                            placeholder="Describe your issue or question..."
                            className={inp + " resize-none " + (errors.message ? "border-red-400" : "")} />
                          {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                        </div>

                        {/* File upload */}
                        <div>
                          <label className="text-xs font-medium text-[var(--color-text-muted)] block mb-1">Attach File <span className="font-normal">(optional, max 5MB)</span></label>
                          {file ? (
                            <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-page)]">
                              <FiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-xs text-[var(--color-text)] flex-1 truncate">{file.name}</span>
                              <button type="button" onClick={() => setFile(null)} className="text-[var(--color-text-muted)] hover:text-red-500 transition">
                                <FiX className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div onClick={() => fileRef.current?.click()}
                              className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-4 text-center cursor-pointer hover:border-[#00A6C4] transition">
                              <FiUpload className="w-5 h-5 mx-auto mb-1 text-[var(--color-text-muted)]" />
                              <p className="text-xs text-[var(--color-text-muted)]">Click to upload image or PDF</p>
                            </div>
                          )}
                          <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
                        </div>

                        <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition disabled:opacity-60"
                          style={{ background: "linear-gradient(135deg, #1A2C3E, #00A6C4)" }}>
                          {loading
                            ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            : <><FiSend className="w-4 h-4" /> Send Message</>}
                        </motion.button>
                      </form>
                    )}
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Hours + Social */}
            <div className="space-y-6">
              <FadeIn delay={0.1}>
                <div className="card p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <FiClock className="w-5 h-5" style={{ color: "#00A6C4" }} />
                    <h3 className="font-bold text-[var(--color-text)]">Business Hours</h3>
                  </div>
                  <div className="space-y-3">
                    {HOURS.map((h, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span className="text-[var(--color-text-muted)]">{h.day}</span>
                        <span className={`font-medium ${h.day === "Emergency" ? "text-green-600" : "text-[var(--color-text)]"}`}>{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="card p-6">
                  <h3 className="font-bold text-[var(--color-text)] mb-4">Follow Us</h3>
                  <div className="flex flex-wrap gap-3">
                    {SOCIALS.map(({ icon: Icon, label, href, color }) => (
                      <a key={label} href={href} title={label}
                        className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--color-border)] hover:scale-110 transition-transform"
                        style={{ color }}>
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="ct-section ct-container max-w-3xl mx-auto">
        <FadeIn className="text-center mb-8">
          <SectionLabel text="FAQ" />
          <h2 className="ct-h2 text-[var(--color-text)]">Frequently Asked Questions</h2>
        </FadeIn>
        <div className="space-y-3">
          {FAQS.map((f, i) => <FadeIn key={i} delay={i * 0.06}><FaqItem {...f} /></FadeIn>)}
        </div>
      </section>

      {/* ── Emergency Banner ── */}
      <section className="ct-section" style={{ background: "linear-gradient(135deg, #1A2C3E, #0e3a52)" }}>
        <div className="ct-container max-w-3xl mx-auto text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-2 mb-4">
              <FiAlertCircle className="w-6 h-6 text-red-400" />
              <h2 className="ct-h2 text-white">Need Urgent IT Support?</h2>
            </div>
            <p className="text-blue-200 mb-6">We're available 24/7 for critical issues. Don't wait — call us now.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+919529882920">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="btn-cyan flex items-center gap-2 mx-auto">
                  <FiPhone className="w-4 h-4" /> +91 95298 82920
                </motion.button>
              </a>
              <a href="tel:+918999017707">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="btn-cyan flex items-center gap-2 mx-auto">
                  <FiPhone className="w-4 h-4" /> +91 89990 17707
                </motion.button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}