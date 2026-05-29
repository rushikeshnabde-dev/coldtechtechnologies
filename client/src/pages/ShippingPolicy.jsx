import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { SEO } from "../components/SEO";
import { PolicyLayout, PolicySection, InfoBox, BulletList } from "../components/PolicyLayout";

const SECTIONS = [
  { id: "processing",  title: "Order Processing Time" },
  { id: "delivery",    title: "Delivery Time" },
  { id: "charges",     title: "Shipping Charges" },
  { id: "delays",      title: "Delays & Exceptions" },
  { id: "damaged",     title: "Damaged Delivery" },
  { id: "returns",     title: "Returns & Exchanges" },
  { id: "contact",     title: "Contact Us" },
];

export function ShippingPolicy() {
  return (
    <>
      <SEO
        title="Shipping Policy – Coldtech Technologies"
        description="Coldtech Technologies shipping policy for IT products and refurbished laptops. Delivery timelines, charges, and handling for Pune and all India."
        keywords="shipping policy IT products India, Coldtech Technologies delivery, laptop delivery Pune"
        canonical="/shipping-policy"
      />
      <PolicyLayout badge="Shipping" title="Shipping Policy"
        subtitle="How we deliver your products across India."
        date="20 April 2026" sections={SECTIONS}>

        <PolicySection id="processing" title="Order Processing Time">
          <p>All orders are processed within <strong>1–2 business days</strong> after payment confirmation.</p>
          <BulletList items={[
            "Orders placed before 2:00 PM IST are processed the same day",
            "Orders placed after 2:00 PM IST are processed the next business day",
            "Orders are not processed on Sundays and public holidays",
            "You will receive an order confirmation email with tracking details",
          ]} />
          <InfoBox type="info">For urgent orders, contact us on WhatsApp at +91 9529882920 for priority processing.</InfoBox>
        </PolicySection>

        <PolicySection id="delivery" title="Delivery Time">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            {[
              { zone: "Pune City", time: "Same Day / Next Day", icon: "🏙️" },
              { zone: "Maharashtra", time: "1–3 Business Days", icon: "🗺️" },
              { zone: "Metro Cities", time: "2–4 Business Days", icon: "🏢" },
              { zone: "Rest of India", time: "3–7 Business Days", icon: "🇮🇳" },
            ].map(z => (
              <div key={z.zone} className="card p-4 flex items-center gap-3">
                <span className="text-2xl">{z.icon}</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{z.zone}</p>
                  <p className="text-xs text-slate-500">{z.time}</p>
                </div>
              </div>
            ))}
          </div>
          <p>Delivery times are estimates and may vary based on courier availability and location.</p>
        </PolicySection>

        <PolicySection id="charges" title="Shipping Charges">
          <BulletList items={[
            "Free shipping on orders above ₹5,000",
            "Standard shipping: ₹99–₹199 depending on weight and location",
            "Express delivery available at additional cost (contact us)",
            "Shipping charges are non-refundable unless the product is defective",
          ]} />
          <InfoBox type="success">Free pickup and delivery available for repair services within Pune city limits.</InfoBox>
        </PolicySection>

        <PolicySection id="delays" title="Delays & Exceptions">
          <p>Delivery may be delayed due to:</p>
          <BulletList items={[
            "Natural disasters, floods, or extreme weather conditions",
            "Public holidays or courier strikes",
            "Incorrect or incomplete delivery address",
            "Remote or restricted delivery areas",
            "Customs clearance for imported products",
          ]} />
          <p className="mt-3">We will notify you via SMS/email if there is a significant delay in your order.</p>
        </PolicySection>

        <PolicySection id="damaged" title="Damaged Delivery">
          <InfoBox type="warning">If you receive a damaged product, do NOT accept the delivery. Take photos and contact us immediately.</InfoBox>
          <p>In case of damaged delivery:</p>
          <BulletList items={[
            "Refuse the delivery and note the damage with the courier",
            "Contact us within 24 hours with photos of the damaged package",
            "We will arrange a replacement or full refund within 5–7 business days",
            "Keep all original packaging for the return process",
          ]} />
        </PolicySection>

        <PolicySection id="returns" title="Returns & Exchanges">
          <BulletList items={[
            "Products can be returned within 7 days of delivery if unused and in original packaging",
            "Refurbished products carry a 3-month warranty — defects covered under warranty",
            "Return shipping cost is borne by the customer unless the product is defective",
            "Refunds are processed within 5–7 business days after receiving the returned product",
          ]} />
        </PolicySection>

        <PolicySection id="contact" title="Contact Us">
          <div className="card p-5 space-y-2">
            {[["📞", "+91 9529882920"], ["📧", "support@coldtechtechnologies.in"], ["📍", "PCMC, Pune, Maharashtra 410507"]].map(([i, v]) => (
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
