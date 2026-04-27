import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { SEO } from "../components/SEO";
import { PolicyLayout, PolicySection, InfoBox, BulletList } from "../components/PolicyLayout";

const SECTIONS = [
  { id: "data-loss",    title: "Data Loss Disclaimer" },
  { id: "backup",       title: "Customer Backup Responsibility" },
  { id: "condition",    title: "Device Condition Acknowledgment" },
  { id: "success",      title: "Repair Success Not Guaranteed" },
  { id: "parts",        title: "Parts Replacement Terms" },
  { id: "warranty",     title: "Warranty Limitations" },
  { id: "collection",   title: "Device Collection" },
  { id: "contact",      title: "Contact Us" },
];

export function ServiceTerms() {
  return (
    <>
      <SEO
        title="Service Terms – Coldtech Technologies IT Repair"
        description="Important service terms for Coldtech Technologies IT repair services. Data loss disclaimer, warranty limitations, and repair conditions in Pune, India."
        keywords="IT repair service terms India, Coldtech Technologies service conditions, laptop repair terms Pune"
        canonical="/service-terms"
      />
      <PolicyLayout badge="Service Terms" title="Service Terms"
        subtitle="Important terms governing all repair and IT support services."
        date="20 April 2026" sections={SECTIONS}>

        <InfoBox type="danger">Please read these terms carefully. By submitting your device for repair, you acknowledge and agree to all conditions below.</InfoBox>

        <PolicySection id="data-loss" title="Data Loss Disclaimer">
          <InfoBox type="danger">Coldtech Technologies accepts NO responsibility for data loss during any repair or service procedure.</InfoBox>
          <p>Data loss can occur due to:</p>
          <BulletList items={[
            "Hardware failure during the repair process",
            "Necessary OS reinstallation or formatting",
            "Virus removal procedures that require system wipe",
            "Firmware updates that reset device storage",
            "Unforeseen technical complications",
          ]} />
          <p className="mt-3">We strongly advise all customers to back up their data before submitting any device.</p>
        </PolicySection>

        <PolicySection id="backup" title="Customer Backup Responsibility">
          <InfoBox type="warning">It is the customer's sole responsibility to back up all data before handing over any device.</InfoBox>
          <p>By submitting your device, you confirm that:</p>
          <BulletList items={[
            "You have backed up all important data (photos, documents, contacts, etc.)",
            "You understand that data recovery is not guaranteed",
            "You will not hold Coldtech Technologies liable for any data loss",
            "You have removed any sensitive personal or financial information where possible",
          ]} />
        </PolicySection>

        <PolicySection id="condition" title="Device Condition Acknowledgment">
          <p>When you submit a device for repair, you acknowledge that:</p>
          <BulletList items={[
            "The device condition at submission will be documented by our technician",
            "Any pre-existing damage will be noted and is not our responsibility",
            "We are not responsible for cosmetic damage that was present before repair",
            "Devices with liquid damage may have hidden corrosion that can cause further issues",
            "Very old devices may have components that fail during unrelated repairs",
          ]} />
        </PolicySection>

        <PolicySection id="success" title="Repair Success Not Guaranteed">
          <InfoBox type="warning">Not all repairs can be guaranteed to succeed. We will inform you of the probability before proceeding.</InfoBox>
          <p>In cases where repair is not possible:</p>
          <BulletList items={[
            "A diagnosis fee may apply for the assessment work done",
            "We will return your device in the same condition it was received",
            "We will provide a detailed report of what was found",
            "No repair charges will be applied if the device cannot be fixed",
          ]} />
        </PolicySection>

        <PolicySection id="parts" title="Parts Replacement Terms">
          <BulletList items={[
            "We use quality replacement parts — OEM, compatible, or refurbished as appropriate",
            "Part type will be communicated and agreed upon before installation",
            "Original parts removed from your device remain your property",
            "Advance payment may be required for special-order parts",
            "Parts ordered specifically for your device are non-refundable if you cancel",
            "We do not guarantee availability of parts for very old devices",
          ]} />
        </PolicySection>

        <PolicySection id="warranty" title="Warranty Limitations">
          <BulletList items={[
            "30-day warranty on all completed repairs (parts and labour)",
            "Warranty covers the specific issue that was repaired only",
            "Warranty is void if the device is opened or tampered with after repair",
            "Physical damage, liquid damage, or misuse after repair voids warranty",
            "Software issues caused by user actions are not covered",
            "Battery degradation over time is not a warranty issue",
          ]} />
          <InfoBox type="info">Warranty claims must be submitted within 30 days with the original service receipt.</InfoBox>
        </PolicySection>

        <PolicySection id="collection" title="Device Collection">
          <BulletList items={[
            "Devices must be collected within 30 days of service completion notification",
            "We will attempt to contact you 3 times before the deadline",
            "After 30 days, a storage fee of ₹50/day may apply",
            "After 90 days, uncollected devices may be disposed of to recover costs",
            "We are not responsible for devices left beyond the collection period",
          ]} />
        </PolicySection>

        <PolicySection id="contact" title="Contact Us">
          <div className="card p-5 space-y-2">
            {[["📞", "+91 9529882920"], ["📧", "support@coldtechtechnologies.in"], ["📍", "PCMC, Pune, Maharashtra 410507"]].map(([i, v]) => (
              <p key={v} className="text-sm text-slate-700">{i} {v}</p>
            ))}
          </div>
          <div className="mt-4 flex gap-3 flex-wrap">
            <Link to="/services/request"><button className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">Book a Service <FiArrowRight className="w-4 h-4" /></button></Link>
            <a href="https://wa.me/919529882920" target="_blank" rel="noreferrer">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:border-green-400 hover:text-green-600 transition bg-white">💬 WhatsApp</button>
            </a>
          </div>
        </PolicySection>

      </PolicyLayout>
    </>
  );
}
