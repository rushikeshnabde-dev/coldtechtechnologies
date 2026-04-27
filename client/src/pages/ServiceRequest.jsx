import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { SEO } from '../components/SEO';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiMonitor, FiCpu, FiAlertTriangle,
  FiFileText, FiCalendar, FiCheckCircle, FiChevronRight, FiChevronLeft,
  FiUpload, FiX, FiShield, FiClock, FiStar, FiLoader, FiWifi,
  FiHardDrive, FiZap, FiArrowRight,
} from 'react-icons/fi';
import { FaLaptop, FaDesktop, FaMobileAlt, FaTabletAlt, FaBug, FaWrench } from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL || 'https://coldtechtechnologies.onrender.com/api';

/* ─── constants ─── */
const STEPS = [
  { id: 1, label: 'Contact',  icon: FiUser,          color: '#0EA5E9' },
  { id: 2, label: 'Device',   icon: FiMonitor,       color: '#8B5CF6' },
  { id: 3, label: 'Issue',    icon: FiAlertTriangle, color: '#F59E0B' },
  { id: 4, label: 'Details',  icon: FiFileText,      color: '#10B981' },
  { id: 5, label: 'Schedule', icon: FiCalendar,      color: '#EF4444' },
];

const DEVICE_OPTIONS = [
  { value: 'Laptop',     label: 'Laptop',   icon: FaLaptop },
  { value: 'Desktop',    label: 'Desktop',  icon: FaDesktop },
  { value: 'Smartphone', label: 'Phone',    icon: FaMobileAlt },
  { value: 'Tablet',     label: 'Tablet',   icon: FaTabletAlt },
  { value: 'Other',      label: 'Other',    icon: FiCpu },
];

const DEVICE_BRANDS = ['Apple','Samsung','Dell','HP','Lenovo','Asus','Acer','Microsoft','Google','Other'];

const ISSUE_OPTIONS = [
  { value: 'Hardware', label: 'Hardware',        icon: FaWrench,    desc: 'Physical damage, broken parts',   color: '#EF4444' },
  { value: 'Software', label: 'Software',        icon: FiCpu,       desc: 'OS issues, app crashes',          color: '#8B5CF6' },
  { value: 'Virus',    label: 'Virus / Malware', icon: FaBug,       desc: 'Infections, ransomware',          color: '#F59E0B' },
  { value: 'Network',  label: 'Network',         icon: FiWifi,      desc: 'Connectivity, WiFi issues',       color: '#10B981' },
  { value: 'Upgrade',  label: 'Upgrade',         icon: FiZap,       desc: 'RAM, SSD, performance boost',     color: '#0EA5E9' },
  { value: 'Other',    label: 'Other',           icon: FiHardDrive, desc: 'Something else entirely',         color: '#6366F1' },
];

const URGENCY_OPTIONS = [
  { value: 'Low',      label: 'Low',      desc: 'Within a week',    color: '#10B981', bg: '#F0FDF4', border: '#86EFAC' },
  { value: 'Normal',   label: 'Normal',   desc: '2–3 days',         color: '#0EA5E9', bg: '#F0F9FF', border: '#7DD3FC' },
  { value: 'High',     label: 'High',     desc: 'Within 24 hrs',    color: '#F59E0B', bg: '#FFFBEB', border: '#FCD34D' },
  { value: 'Critical', label: 'Critical', desc: 'ASAP / Emergency', color: '#EF4444', bg: '#FFF1F2', border: '#FCA5A5' },
];

const SIDE_FEATURES = [
  { icon: FiShield,       text: 'Free diagnosis — no hidden charges' },
  { icon: FiClock,        text: 'Response within 2–4 hours' },
  { icon: FiCheckCircle,  text: '30-day warranty on all repairs' },
  { icon: FiStar,         text: 'Trusted by 500+ customers in Pune' },
];

/* ─── draft helpers ─── */
const DRAFT_KEY = 'coldtech_service_draft';
const saveDraft  = f => { const { photos, ...r } = f; sessionStorage.setItem(DRAFT_KEY, JSON.stringify(r)); };
const loadDraft  = () => { try { const r = sessionStorage.getItem(DRAFT_KEY); return r ? JSON.parse(r) : null; } catch { return null; } };
const clearDraft = () => sessionStorage.removeItem(DRAFT_KEY);

/* ─── animation ─── */
const slide = {
  enter:  d => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   d => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
};

/* ─── shared input style ─── */
const inp = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 focus:bg-white transition-all';

/* ─── sub-components ─── */
function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
          className="text-xs text-red-500 flex items-center gap-1">
          <FiX className="w-3 h-3" />{error}
        </motion.p>
      )}
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-sky-500" />
      </div>
      <span className="text-xs text-slate-500 w-16 flex-shrink-0">{label}</span>
      <span className="text-xs font-semibold text-slate-800 capitalize">{value}</span>
    </div>
  );
}

/* ─── Main Component ─── */
export function ServiceRequest() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const emptyForm = {
    name: '', email: '', phone: '', address: '',
    deviceType: '', brand: '', model: '', serialNumber: '',
    issueType: '', urgency: 'Normal',
    description: '', photos: [],
    preferredDate: '', preferredTime: '', notes: '',
  };

  const [form, setForm]           = useState(() => { const d = loadDraft(); return d ? { ...emptyForm, ...d } : emptyForm; });
  const [step, setStep]           = useState(1);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [ticketId, setTicketId]     = useState('');
  const [photoPreview, setPhotoPreview] = useState([]);
  const fileRef = useRef();

  const currentStep = STEPS[step - 1];
  const progress    = Math.round(((step - 1) / (STEPS.length - 1)) * 100);

  /* pre-fill from auth */
  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name:  f.name  || user.name  || '',
        email: f.email || user.email || '',
        phone: f.phone || user.phone || '',
      }));
    }
  }, [user]);

  /* auto-submit after login redirect */
  useEffect(() => {
    if (isAuthenticated && location.state?.autoSubmit) {
      const draft = loadDraft();
      if (draft) {
        setForm(f => ({ ...f, ...draft }));
        setTimeout(() => handleSubmit(null, { ...emptyForm, ...draft }), 400);
      }
    }
  }, [isAuthenticated]);

  /* save draft on form change */
  useEffect(() => { saveDraft(form); }, [form]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  /* ── validation ── */
  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.name.trim())                          e.name  = 'Name is required';
      if (!form.email.trim())                         e.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email))     e.email = 'Enter a valid email';
      if (!form.phone.trim())                         e.phone = 'Phone is required';
      else if (!/^\d{10}$/.test(form.phone.replace(/\D/g,''))) e.phone = 'Enter a valid 10-digit number';
    }
    if (s === 2) {
      if (!form.deviceType) e.deviceType = 'Select a device type';
      if (!form.brand)      e.brand      = 'Select a brand';
    }
    if (s === 3) {
      if (!form.issueType) e.issueType = 'Select an issue type';
    }
    if (s === 4) {
      if (!form.description.trim() || form.description.trim().length < 20)
        e.description = 'Please describe the issue (min 20 characters)';
    }
    return e;
  };

  const goNext = () => {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setDirection(1);
    setStep(s => s + 1);
  };

  const goBack = () => {
    setErrors({});
    setDirection(-1);
    setStep(s => s - 1);
  };

  /* ── photo handling ── */
  const handlePhotos = (files) => {
    const arr = Array.from(files).slice(0, 4 - form.photos.length);
    const previews = arr.map(f => URL.createObjectURL(f));
    setPhotoPreview(p => [...p, ...previews]);
    setForm(f => ({ ...f, photos: [...f.photos, ...arr] }));
  };

  const removePhoto = (i) => {
    setPhotoPreview(p => p.filter((_, idx) => idx !== i));
    setForm(f => ({ ...f, photos: f.photos.filter((_, idx) => idx !== i) }));
  };

  /* ── submit ── */
  const handleSubmit = async (e, overrideForm) => {
    if (e) e.preventDefault();
    const data = overrideForm || form;

    if (!isAuthenticated) {
      saveDraft(data);
      navigate('/login', { state: { from: '/service-request', autoSubmit: true } });
      return;
    }

    const finalErrors = validate(5);
    if (Object.keys(finalErrors).length) { setErrors(finalErrors); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (k === 'photos') v.forEach(f => fd.append('photos', f));
        else fd.append(k, v);
      });

      const res = await axios.post(`${API}/services`, fd, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('coldtech_auth') ? JSON.parse(localStorage.getItem('coldtech_auth')).token : ''}` },
      });

      clearDraft();
      setTicketId(res.data?.ticketId || res.data?.service?.ticketId || 'CT-XXXX');
      setSubmitted(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Submission failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── success screen ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 flex items-center justify-center p-4">
        <SEO title="Request Submitted – Coldtech Technologies" />
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 18 }}
            className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6"
          >
            <FiCheckCircle className="w-10 h-10 text-emerald-500" />
          </motion.div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">Request Submitted!</h2>
          <p className="text-slate-500 text-sm mb-6">
            We've received your service request. Our team will reach out within 2–4 hours.
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 mb-6">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Your Ticket ID</p>
            <p className="text-2xl font-mono font-bold text-sky-600 tracking-wider">{ticketId}</p>
            <p className="text-xs text-slate-400 mt-1">Save this for tracking your request</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/track-service?ticket=${ticketId}`}
              className="flex-1 btn-primary text-center py-3 rounded-xl text-sm font-semibold"
            >
              Track Request
            </Link>
            <button
              onClick={() => { setSubmitted(false); setForm(emptyForm); setStep(1); setPhotoPreview([]); }}
              className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Submit Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── step content ── */
  const renderStep = () => {
    switch (step) {
      /* Step 1 – Contact Info */
      case 1: return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" required error={errors.name}>
            <input className={inp} placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} />
          </Field>
          <Field label="Email" required error={errors.email}>
            <input className={inp} type="email" placeholder="john@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </Field>
          <Field label="Phone" required error={errors.phone}>
            <input className={inp} type="tel" placeholder="9876543210" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </Field>
          <Field label="Address" error={errors.address}>
            <input className={inp} placeholder="Pune, Maharashtra" value={form.address} onChange={e => set('address', e.target.value)} />
          </Field>
        </div>
      );

      /* Step 2 – Device Details */
      case 2: return (
        <div className="space-y-5">
          <Field label="Device Type" required error={errors.deviceType}>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {DEVICE_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set('deviceType', value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                    form.deviceType === value
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-violet-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Brand" required error={errors.brand}>
              <select className={inp} value={form.brand} onChange={e => set('brand', e.target.value)}>
                <option value="">Select brand</option>
                {DEVICE_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Model" error={errors.model}>
              <input className={inp} placeholder="e.g. MacBook Pro 2021" value={form.model} onChange={e => set('model', e.target.value)} />
            </Field>
            <Field label="Serial / IMEI" error={errors.serialNumber}>
              <input className={inp} placeholder="Optional" value={form.serialNumber} onChange={e => set('serialNumber', e.target.value)} />
            </Field>
          </div>
        </div>
      );

      /* Step 3 – Issue Type */
      case 3: return (
        <div className="space-y-5">
          <Field label="Issue Category" required error={errors.issueType}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ISSUE_OPTIONS.map(({ value, label, icon: Icon, desc, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set('issueType', value)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    form.issueType === value
                      ? 'border-current bg-opacity-5'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                  style={form.issueType === value ? { borderColor: color, backgroundColor: color + '10' } : {}}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: color + '20' }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </Field>

          <Field label="Urgency Level" error={errors.urgency}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {URGENCY_OPTIONS.map(({ value, label, desc, color, bg, border }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set('urgency', value)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-semibold transition-all"
                  style={form.urgency === value
                    ? { borderColor: border, backgroundColor: bg, color }
                    : { borderColor: '#E2E8F0', backgroundColor: '#F8FAFC', color: '#64748B' }}
                >
                  <span className="font-bold">{label}</span>
                  <span className="font-normal opacity-75">{desc}</span>
                </button>
              ))}
            </div>
          </Field>
        </div>
      );

      /* Step 4 – Description + Photos */
      case 4: return (
        <div className="space-y-5">
          <Field label="Describe the Issue" required error={errors.description}>
            <textarea
              className={`${inp} resize-none`}
              rows={5}
              placeholder="Please describe what's happening in detail — when it started, any error messages, what you've already tried..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
            <p className="text-xs text-slate-400 text-right">{form.description.length} / 1000</p>
          </Field>

          <Field label="Photos (optional, max 4)">
            <div
              className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-sky-400 hover:bg-sky-50 transition-all"
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handlePhotos(e.dataTransfer.files); }}
            >
              <FiUpload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Drag & drop or <span className="text-sky-500 font-semibold">browse</span></p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB each</p>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                onChange={e => handlePhotos(e.target.files)} />
            </div>

            {photoPreview.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {photoPreview.map((src, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden aspect-square">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>
        </div>
      );

      /* Step 5 – Schedule + Review */
      case 5: return (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Preferred Date" error={errors.preferredDate}>
              <input
                className={inp}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={form.preferredDate}
                onChange={e => set('preferredDate', e.target.value)}
              />
            </Field>
            <Field label="Preferred Time" error={errors.preferredTime}>
              <select className={inp} value={form.preferredTime} onChange={e => set('preferredTime', e.target.value)}>
                <option value="">Any time</option>
                <option value="Morning (9am–12pm)">Morning (9am–12pm)</option>
                <option value="Afternoon (12pm–4pm)">Afternoon (12pm–4pm)</option>
                <option value="Evening (4pm–7pm)">Evening (4pm–7pm)</option>
              </select>
            </Field>
          </div>

          <Field label="Additional Notes">
            <textarea
              className={`${inp} resize-none`}
              rows={3}
              placeholder="Anything else we should know?"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </Field>

          {/* Summary */}
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Request Summary</p>
            <SummaryRow icon={FiUser}          label="Name"    value={form.name} />
            <SummaryRow icon={FiMail}          label="Email"   value={form.email} />
            <SummaryRow icon={FiPhone}         label="Phone"   value={form.phone} />
            <SummaryRow icon={FiMonitor}       label="Device"  value={`${form.brand} ${form.deviceType}`} />
            <SummaryRow icon={FiAlertTriangle} label="Issue"   value={form.issueType} />
            <SummaryRow icon={FiZap}           label="Urgency" value={form.urgency} />
            <SummaryRow icon={FiCalendar}      label="Date"    value={form.preferredDate} />
          </div>

          {!isAuthenticated && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <FiShield className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                You'll be asked to log in before submitting. Your progress is saved automatically.
              </p>
            </div>
          )}
        </div>
      );

      default: return null;
    }
  };

  /* ── render ── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      <SEO
        title="Book Laptop Repair & IT Support Service in Pune"
        description="Submit a laptop repair or IT support request in Pune. Free diagnosis, upfront quote, 30-day warranty. Get a ticket ID and track your repair in real time."
        keywords="book laptop repair Pune, IT service request Pune, computer repair booking Pune, submit repair ticket, laptop repair near me Pune, IT support booking Pune"
        canonical="/services/request"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services/request" }
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "IT Repair & Support Service Request — Coldtech Technologies",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Coldtech Technologies",
            "url": "https://coldtechtechnologies.in",
            "telephone": "+91-9529882920",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Pune",
              "addressRegion": "Maharashtra",
              "addressCountry": "IN"
            }
          },
          "areaServed": { "@type": "City", "name": "Pune" },
          "serviceType": ["Laptop Repair", "Data Recovery", "Network Setup", "IT Support"],
          "offers": {
            "@type": "Offer",
            "description": "Free diagnosis with transparent pricing. 30-day warranty on all repairs.",
            "priceCurrency": "INR",
            "priceSpecification": { "@type": "PriceSpecification", "price": "0", "description": "Free diagnosis" }
          }
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-8 lg:py-14">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Left Sidebar — hidden on mobile, visible on desktop ── */}
          <aside className="hidden lg:block lg:w-64 lg:sticky lg:top-20 flex-shrink-0">
            {/* Dark header */}
            <div className="rounded-2xl p-5 text-white mb-4"
              style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0f2744 100%)' }}>
              <div className="flex items-center gap-2 mb-1">
                <FaWrench className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-semibold text-sky-400 uppercase tracking-widest">Service Request</span>
              </div>
              <h1 className="text-lg font-bold leading-snug mb-1">Get Your Device Fixed</h1>
              <p className="text-slate-400 text-xs leading-relaxed">
                Fill out the form in {STEPS.length} quick steps.
              </p>
            </div>

            {/* Step list */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const done   = step > s.id;
                const active = step === s.id;
                return (
                  <div key={s.id} className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ backgroundColor: done ? '#10B981' : active ? s.color : '#F1F5F9', color: done || active ? '#fff' : '#94A3B8' }}>
                      {done ? <FiCheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <p className={`text-sm font-semibold flex-1 truncate ${active ? 'text-slate-800' : done ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {s.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Trust badges */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
              {SIDE_FEATURES.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-sky-500" />
                  </div>
                  <p className="text-xs text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </aside>

          {/* ── Right: Form ── */}
          <div className="flex-1 min-w-0">
            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-slate-500 font-medium">Step {step} of {STEPS.length}</span>
                <span className="text-xs font-bold" style={{ color: currentStep.color }}>{progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: currentStep.color }}
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
              </div>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100">
              {/* Colored step header */}
              <div
                className="px-6 py-4 flex items-center gap-3"
                style={{ backgroundColor: currentStep.color + '15', borderBottom: `2px solid ${currentStep.color}30` }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: currentStep.color }}
                >
                  <currentStep.icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: currentStep.color }}>
                    Step {step}
                  </p>
                  <h2 className="text-base font-bold text-slate-800">{currentStep.label}</h2>
                </div>
              </div>

              {/* Animated step content */}
              <form onSubmit={handleSubmit}>
                <div className="p-6 min-h-[320px]">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={slide}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      {renderStep()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="px-6 pb-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={step === 1}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                    Back
                  </button>

                  {step < STEPS.length ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                      style={{ backgroundColor: currentStep.color }}
                    >
                      Next
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <><FiLoader className="w-4 h-4 animate-spin" /> Submitting…</>
                      ) : (
                        <><FiArrowRight className="w-4 h-4" /> Submit Request</>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
