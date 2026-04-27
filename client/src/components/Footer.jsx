import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin, FiArrowRight } from "react-icons/fi";
import { useState } from "react";
import logo from "../assets/logo.png";

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer style={{ background: "linear-gradient(135deg, #2B0FA8 0%, #1a3a6e 60%, #0f2744 100%)", color:"rgba(255,255,255,0.75)" }}>
      <div className="ct-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Coldtech Logo" className="w-9 h-9 rounded-xl object-cover" />
              <span className="font-black text-lg text-white">Cold<span style={{ color:"#3AB6FF" }}>tech</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color:"rgba(255,255,255,0.5)" }}>
              Your all-in-one IT partner — from procurement to problem-solving.
            </p>
            <div className="flex gap-2">
              {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map((Icon, i) => (
                <a key={i}
                  href={["https://facebook.com/coldtechtechnologies","https://twitter.com/coldtechpune","https://linkedin.com/company/coldtech-technologies","https://instagram.com/coldtechtechnologies"][i]}
                  target="_blank" rel="noopener noreferrer"
                  aria-label={["Facebook","Twitter","LinkedIn","Instagram"][i]}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{ background:"rgba(58,182,255,0.12)", color:"rgba(255,255,255,0.6)", border:"1px solid rgba(58,182,255,0.2)" }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(58,182,255,0.3)"; e.currentTarget.style.color="#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(58,182,255,0.12)"; e.currentTarget.style.color="rgba(255,255,255,0.6)"; }}>
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white mb-5">Contact</p>
            <div className="space-y-3 text-sm" style={{ color:"rgba(255,255,255,0.55)" }}>
              <div className="flex items-center gap-2.5">
                <FiMail className="w-4 h-4 flex-shrink-0" style={{ color:"#3AB6FF" }} />
                <a href="mailto:sales@coldtechtechnologies.in" style={{ color:"rgba(255,255,255,0.55)" }}>sales@coldtechtechnologies.in</a>
              </div>
              <div className="flex items-center gap-2.5">
                <FiPhone className="w-4 h-4 flex-shrink-0" style={{ color:"#3AB6FF" }} />
                <a href="tel:+919529882920" style={{ color:"rgba(255,255,255,0.55)" }}>+91 95298 82920</a>
              </div>
              <div className="flex items-center gap-2.5">
                <FiPhone className="w-4 h-4 flex-shrink-0" style={{ color:"#3AB6FF" }} />
                <a href="tel:+918999017707" style={{ color:"rgba(255,255,255,0.55)" }}>+91 89990 17707</a>
              </div>
              <div className="flex items-center gap-2.5">
                <FiMapPin className="w-4 h-4 flex-shrink-0" style={{ color:"#3AB6FF" }} />
                <span>PCMC, Pune, Maharashtra 410507</span>
              </div>
              <p className="text-xs font-semibold" style={{ color:"#4FD1C5" }}>Avg wait time: &lt; 1 min</p>
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
                ["/about",            "About Us"],
                ["/contact",          "Contact"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="flex items-center gap-1 group transition-colors hover:text-[#3AB6FF]"
                    style={{ color:"rgba(255,255,255,0.5)" }}>
                    <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white mb-2">Newsletter</p>
            <p className="text-xs mb-4" style={{ color:"rgba(255,255,255,0.4)" }}>Tips, product drops, and service updates.</p>
            <form onSubmit={e => { e.preventDefault(); setEmail(""); }} className="flex flex-col gap-2">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none transition"
                style={{ background:"rgba(58,182,255,0.1)", border:"1px solid rgba(58,182,255,0.25)" }}
                onFocus={e => e.target.style.borderColor="#3AB6FF"}
                onBlur={e => e.target.style.borderColor="rgba(58,182,255,0.25)"} />
              <button type="submit" className="btn-cyan py-2.5 text-sm">Subscribe →</button>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs" style={{ borderColor:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.3)" }}>
        © {new Date().getFullYear()} ColdTech Technologies. All rights reserved.
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
          {[
            ["/privacy-policy",  "Privacy Policy"],
            ["/terms-conditions","Terms & Conditions"],
            ["/refund-policy",   "Refund Policy"],
            ["/shipping-policy", "Shipping Policy"],
            ["/service-terms",   "Service Terms"],
            ["/contact",         "Contact"],
          ].map(([to, label]) => (
            <Link key={to} to={to} className="hover:text-white transition-colors">{label}</Link>
          ))}
          <a href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
