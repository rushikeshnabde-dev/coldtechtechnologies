import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { SEO } from "../components/SEO";
import { PolicyLayout, PolicySection, InfoBox, BulletList } from "../components/PolicyLayout";

const SECTIONS = [
  { id: "introduction",    title: "Introduction" },
  { id: "services",        title: "Services Overview" },
  { id: "responsibilities",title: "User Responsibilities" },
  { id: "payments",        title: "Payments & Pricing" },
  { id: "warranty",        title: "Warranty & Limitations" },
  { id: "liability",       title: "Liability Disclaimer" },
  { id: "ip",              title: "Intellectual Property" },
  { id: "termination",     title: "Termination" },
  { id: "governing-law",   title: "Governing Law" },
  { id: "contact",         title: "Contact Us" },
];

export function TermsConditions() {
  return (
    <>
      <SEO
        title="Terms & Conditions – Coldtech Technologies"
        description="Read the Terms and Conditions for Coldtech Technologies IT repair and laptop services in Pune, India."
        keywords="terms conditions IT services Pune, Coldtech Technologies terms, IT repair terms India"
        canonical="/terms-conditions"
      />
      <PolicyLayout badge="Legal" title="Terms & Conditions"
        subtitle="Please read these terms carefully before using our services."
        date="20 April 2026" sections={SECTIONS}>

        <PolicySection id="introduction" title="Introduction">
          <p>Welcome to Coldtech Technologies. By accessing our website at <strong>coldtechtechnologies.in</strong> or using any of our services, you agree to be bound by these Terms and Conditions.</p>
          <p>If you do not agree with any part of these terms, please do not use our services.</p>
        </PolicySection>

        <PolicySection id="services" title="Services Overview">
          <p>Coldtech Technologies provides the following services:</p>
          <BulletList items={[
            "Laptop and desktop repair (hardware & software)",
            "Data recovery from damaged or corrupted storage devices",
            "Network setup and IT support for homes and offices",
            "Sale of refurbished and new IT products",
            "Annual Maintenance Contracts (AMC) for businesses",
            "Software installation and system optimization",
          ]} />
          <p className="mt-3">All services are subject to availability and technical feasibility.</p>
        </PolicySection>

        <PolicySection id="responsibilities" title="User Responsibilities">
          <p>By using our services, you agree to:</p>
          <BulletList items={[
            "Provide accurate and complete information when submitting service requests",
            "Back up all data before handing over your device for repair",
            "Not use our services for any unlawful or fraudulent purpose",
            "Collect your device within 30 days of service completion",
            "Pay all applicable charges as agreed before service begins",
          ]} />
          <InfoBox type="warning">Coldtech Technologies is not responsible for any data loss during repair. Always back up your data before submitting a device.</InfoBox>
        </PolicySection>

        <PolicySection id="payments" title="Payments & Pricing">
          <BulletList items={[
            "All prices are in Indian Rupees (INR) and inclusive of applicable taxes",
            "A diagnosis fee may apply for assessment of complex issues",
            "Final repair cost will be communicated before work begins — no hidden charges",
            "Payment is due upon completion of service unless otherwise agreed",
            "Accepted payment methods: Cash, UPI, NEFT/IMPS, Debit/Credit Card",
            "Advance payment may be required for parts procurement",
          ]} />
          <InfoBox type="success">We provide a written quote before starting any repair. You only pay what was agreed.</InfoBox>
        </PolicySection>

        <PolicySection id="warranty" title="Warranty & Limitations">
          <BulletList items={[
            "All repairs carry a 30-day warranty on parts and labour",
            "Warranty is void if the device is tampered with after repair",
            "Physical damage after repair is not covered under warranty",
            "Refurbished products carry a 3-month warranty unless stated otherwise",
            "Data recovery success is not guaranteed — we will inform you of the probability before proceeding",
          ]} />
        </PolicySection>

        <PolicySection id="liability" title="Liability Disclaimer">
          <InfoBox type="danger">Coldtech Technologies shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.</InfoBox>
          <p>Our maximum liability in any case shall not exceed the amount paid for the specific service in question. We are not responsible for:</p>
          <BulletList items={[
            "Pre-existing damage not disclosed at the time of service submission",
            "Data loss due to hardware failure beyond our control",
            "Delays caused by unavailability of spare parts",
            "Third-party software issues",
          ]} />
        </PolicySection>

        <PolicySection id="ip" title="Intellectual Property">
          <p>All content on this website — including text, graphics, logos, and software — is the property of Coldtech Technologies and is protected under Indian copyright law.</p>
          <p>You may not reproduce, distribute, or create derivative works without our express written permission.</p>
        </PolicySection>

        <PolicySection id="termination" title="Termination">
          <p>We reserve the right to refuse service or terminate access to our platform at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.</p>
        </PolicySection>

        <PolicySection id="governing-law" title="Governing Law">
          <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in <strong>Pune, Maharashtra, India</strong>.</p>
        </PolicySection>

        <PolicySection id="contact" title="Contact Us">
          <div className="card p-5 space-y-2">
            {[
              ["🏢", "Coldtech Technologies"],
              ["📍", "PCMC, Pune, Maharashtra 410507, India"],
              ["📞", "+91 9529882920"],
              ["📧", "support@coldtechtechnologies.in"],
            ].map(([icon, val]) => (
              <p key={val} className="text-sm text-slate-700">{icon} {val}</p>
            ))}
          </div>
          <div className="mt-5 flex gap-3 flex-wrap">
            <Link to="/contact"><button className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">Contact Us <FiArrowRight className="w-4 h-4" /></button></Link>
            <a href="https://wa.me/919529882920?text=Hi%2C%20I%20have%20a%20question%20about%20your%20terms." target="_blank" rel="noreferrer">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:border-green-400 hover:text-green-600 transition bg-white">💬 WhatsApp</button>
            </a>
          </div>
        </PolicySection>

      </PolicyLayout>
    </>
  );
}
