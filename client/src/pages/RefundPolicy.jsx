import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { SEO } from "../components/SEO";
import { PolicyLayout, PolicySection, InfoBox, BulletList } from "../components/PolicyLayout";

const SECTIONS = [
  { id: "overview",    title: "Overview" },
  { id: "eligible",    title: "Eligible Refunds" },
  { id: "non-eligible",title: "Non-Refundable Cases" },
  { id: "process",     title: "Refund Process" },
  { id: "timeline",    title: "Refund Timeline" },
  { id: "contact",     title: "Contact Us" },
];

export function RefundPolicy() {
  return (
    <>
      <SEO
        title="Refund Policy – Coldtech Technologies"
        description="Coldtech Technologies refund policy for IT repair services and product purchases. Know your rights and how to claim a refund."
        keywords="refund policy IT services India, Coldtech Technologies refund, laptop repair refund Pune"
        canonical="/refund-policy"
      />
      <PolicyLayout badge="Refunds" title="Refund Policy"
        subtitle="We stand behind our work. Here's how refunds work."
        date="20 April 2026" sections={SECTIONS}>

        <PolicySection id="overview" title="Overview">
          <p>At Coldtech Technologies, customer satisfaction is our priority. We offer refunds in specific circumstances as outlined below.</p>
          <InfoBox type="success">We provide a written quote before starting any repair. You are never charged without prior approval.</InfoBox>
        </PolicySection>

        <PolicySection id="eligible" title="Eligible Refunds">
          <BulletList items={[
            "Service not completed as agreed within the committed timeframe",
            "Same issue recurs within the 30-day warranty period",
            "Product delivered is defective or not as described",
            "Duplicate payment made by mistake",
            "Service cancelled before work has begun",
          ]} />
        </PolicySection>

        <PolicySection id="non-eligible" title="Non-Refundable Cases">
          <InfoBox type="warning">The following situations are not eligible for refunds.</InfoBox>
          <BulletList items={[
            "Data loss during repair (always back up your data)",
            "Diagnosis fee once assessment is completed",
            "Repairs completed successfully but customer changes mind",
            "Damage caused by customer after repair",
            "Software issues caused by user actions post-repair",
            "Shipping charges (unless product is defective)",
          ]} />
        </PolicySection>

        <PolicySection id="process" title="Refund Process">
          <p>To request a refund:</p>
          <ol className="space-y-2 pl-1">
            {[
              "Contact us within 7 days of service completion or product delivery",
              "Provide your service ticket ID or order number",
              "Describe the issue clearly with supporting photos if applicable",
              "Our team will review your request within 2 business days",
              "If approved, refund will be processed to the original payment method",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                  style={{ background: "linear-gradient(135deg,#3AB6FF,#1E90FF)" }}>{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </PolicySection>

        <PolicySection id="timeline" title="Refund Timeline">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-3">
            {[
              { method: "UPI / Bank Transfer", time: "2–3 business days" },
              { method: "Credit / Debit Card", time: "5–7 business days" },
              { method: "Cash Refund", time: "Same day (in-store)" },
            ].map(r => (
              <div key={r.method} className="card p-4 text-center">
                <p className="font-semibold text-slate-800 text-sm">{r.method}</p>
                <p className="text-xs text-sky-600 font-semibold mt-1">{r.time}</p>
              </div>
            ))}
          </div>
        </PolicySection>

        <PolicySection id="contact" title="Contact Us">
          <div className="card p-5 space-y-2">
            {[["📞", "+91 9529882920"], ["📧", "support@coldtechtechnologies.in"]].map(([i, v]) => (
              <p key={v} className="text-sm text-slate-700">{i} {v}</p>
            ))}
          </div>
          <div className="mt-4 flex gap-3 flex-wrap">
            <Link to="/contact"><button className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">Contact Us <FiArrowRight className="w-4 h-4" /></button></Link>
            <a href="https://wa.me/919529882920" target="_blank" rel="noreferrer">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:border-green-400 hover:text-green-600 transition bg-white">💬 WhatsApp</button>
            </a>
          </div>
        </PolicySection>

      </PolicyLayout>
    </>
  );
}
