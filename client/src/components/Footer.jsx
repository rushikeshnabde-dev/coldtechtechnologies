import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin, FiArrowRight, FiArrowUp } from "react-icons/fi";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";

export function Footer() {
  const [email,      setEmail]      = useState("");
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <footer style={{ background: "linear-gradient(135deg, #0f172a 0%, #1a3a6e 55%, #0f2744 100%)", color:"rgba(255,255,255,0.75)" }}>

        {/* Top divider accent */}
        <div style={{ height: "3px", background: "linear-gradient(90deg, #3AB6FF, #4FD1C5, #8B5CF6, #3AB6FF)", backgroundSize: "200% 100%", animation: "borderSpin 4s linear infinite" }} />

        <div className="ct-container py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <img src={logo} alt="Coldtech Logo" className="w-9 h-9 rounded-xl object-cover" />
                <span className="font-black text-lg text-white" style={{ fontFamily: "var(--font-display)" }}>
                  Cold<span style={{ color:"#3AB6FF" }}>tech</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color:"rgba(255,255,255,0.5)" }}>
                Your all-in-one IT partner in Pune — from laptop repairs to complete IT infrastructure management.
              </p>

              {/* Social icons */}
              <div className="flex gap-2 mb-5">
                {[
                  { Icon: FaFacebook,  href: "https://facebook.com/coldtechtechnologies", label: "Facebook" },
                  { Icon: FaTwitter,   href: "https://twitter.com/coldtechpune",          label: "Twitter" },
                  { Icon: FaLinkedin, href: "https://linkedin.com/company/coldtech-technologies", label: "LinkedIn" },
                  { Icon: FaInstagram, href: "https://instagram.com/coldtechtechnologies", label: "Instagram" },
                  { Icon: FaWhatsapp, href: "https://wa.me/919529882920",                  label: "WhatsApp" },
                ].map(({ Icon, href, label }) => (
                  <motion.a key={label}
                    href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                    style={{ background:"rgba(58,182,255,0.1)", color:"rgba(255,255,255,0.55)", border:"1px solid rgba(58,182,255,0.18)" }}
                    onMouseEnter={e => { e.currentTarget.style.background="rgba(58,182,255,0.28)"; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="rgba(58,182,255,0.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="rgba(58,182,255,0.1)"; e.currentTarget.style.color="rgba(255,255,255,0.55)"; e.currentTarget.style.borderColor="rgba(58,182,255,0.18)"; }}>
                    <Icon className="w-3.5 h-3.5" />
                  </motion.a>
                ))}
              </div>

              {/* Trust badge */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold" style={{ color: "#4ADE80" }}>
                  Open today · Avg wait &lt; 1 min
                </span>
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white mb-5">Contact</p>
              <div className="space-y-3.5 text-sm" style={{ color:"rgba(255,255,255,0.55)" }}>
                {[
                  { icon: FiMail,  href: "mailto:sales@coldtechtechnologies.in", text: "sales@coldtechtechnologies.in", isLink: true },
                  { icon: FiPhone, href: "tel:+919529882920", text: "+91 95298 82920", isLink: true },
                  { icon: FiPhone, href: "tel:+918999017707", text: "+91 89990 17707", isLink: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 group">
                    <item.icon className="w-4 h-4 flex-shrink-0 transition-colors group-hover:text-[#3AB6FF]" style={{ color:"#3AB6FF" }} />
                    <a href={item.href}
                      className="transition-colors hover:text-white"
                      style={{ color:"rgba(255,255,255,0.55)" }}>
                      {item.text}
                    </a>
                  </div>
                ))}
                <div className="flex items-start gap-2.5">
                  <FiMapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color:"#3AB6FF" }} />
                  <span className="leading-relaxed">PCMC, Pune, Maharashtra 410507</span>
                </div>
              </div>
            </div>

            {/* Explore */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white mb-5">Explore</p>
              <ul className="space-y-2.5 text-sm">
                {[
                  ["/shop",             "Shop Products"],
                  ["/services",         "Our Services"],
                  ["/services/request", "Request Service"],
                  ["/services/track",   "Track Request"],
                  ["/blog",             "Blog"],
                  ["/about",            "About Us"],
                  ["/contact",          "Contact"],
                ].map(([to, label]) => (
                  <li key={to}>
                    <Link to={to}
                      className="flex items-center gap-2 group transition-colors hover:text-white"
                      style={{ color:"rgba(255,255,255,0.5)" }}>
                      <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white mb-2">Newsletter</p>
              <p className="text-xs mb-5 leading-relaxed" style={{ color:"rgba(255,255,255,0.4)" }}>
                Get IT tips, product drops, and service updates straight to your inbox.
              </p>
              <form onSubmit={e => { e.preventDefault(); setEmail(""); }} className="flex flex-col gap-2.5">
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                  style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)" }}
                  onFocus={e => { e.target.style.borderColor="#3AB6FF"; e.target.style.background="rgba(58,182,255,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor="rgba(255,255,255,0.12)"; e.target.style.background="rgba(255,255,255,0.07)"; }}
                />
                <button type="submit" className="btn-cyan py-2.5 text-sm rounded-xl">
                  Subscribe →
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t py-5 text-center text-xs" style={{ borderColor:"rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.3)" }}>
          <p>© {new Date().getFullYear()} ColdTech Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
            {[
              ["/privacy-policy",  "Privacy Policy"],
              ["/terms-conditions","Terms & Conditions"],
              ["/refund-policy",   "Refund Policy"],
              ["/shipping-policy", "Shipping Policy"],
              ["/service-terms",   "Service Terms"],
              ["/contact",         "Contact"],
            ].map(([to, label]) => (
              <Link key={to} to={to} className="hover:text-white transition-colors hover:underline">{label}</Link>
            ))}
            <a href="/sitemap.xml" className="hover:text-white transition-colors hover:underline">Sitemap</a>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.15, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-20 right-6 z-[9998] w-10 h-10 rounded-full shadow-xl flex items-center justify-center text-white"
            style={{ background: "linear-gradient(135deg,#3AB6FF,#1E90FF)", boxShadow: "0 4px 20px rgba(58,182,255,0.45)" }}
            aria-label="Scroll to top">
            <FiArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
