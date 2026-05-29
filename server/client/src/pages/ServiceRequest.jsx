import { useState, useRef } from 'react';
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
  FiHardDrive, FiZap,
} from 'react-icons/fi';
import {
  FaLaptop, FaDesktop, FaMobileAlt, FaTabletAlt, FaBug, FaWrench,
} from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL || 'https://coldtechtechnologies.onrender.com/api';

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Contact',  icon: FiUser },
  { id: 2, label: 'Device',   icon: FiMonitor },
  { id: 3, label: 'Issue',    icon: FiAlertTriangle },
  { id: 4, label: 'Details',  icon: FiFileText },
  { id: 5, label: 'Schedule', icon: FiCalendar },
];

const DEVICE_OPTIONS = [
  { value: 'Laptop',     label: 'Laptop',  icon: FaLaptop },
  { value: 'Desktop',    label: 'Desktop', icon: FaDesktop },
  { value: 'Smartphone', label: 'Phone',   icon: FaMobileAlt },
  { value: 'Tablet',     label: 'Tablet',  icon: FaTabletAlt },
  { value: 'Other',      label: 'Other',   icon: FiCpu },
];

const DEVICE_BRANDS = [
  'Apple', 'Samsung', 'Dell', 'HP', 'Lenovo',
  'Asus', 'Acer', 'Microsoft', 'Google', 'Other',
];

const ISSUE_OPTIONS = [
  { value: 'Hardware', label: 'Hardware',        icon: FaWrench,  desc: 'Physical damage, broken parts' },
  { value: 'Software', label: 'Software',        icon: FiCpu,     desc: 'OS issues, app crashes' },
  { value: 'Virus',    label: 'Virus / Malware', icon: FaBug,     desc: 'Infections, ransomware' },
  { value: 'Network',  label: 'Network',         icon: FiWifi,    desc: 'Connectivity, WiFi issues' },
  { value: 'Upgrade',  label: 'Upgrade',         icon: FiZap,     desc: 'RAM, SSD, performance boost' },
  { value: 'Other',    label: 'Other',           icon: FiHardDrive, desc: 'Something else entirely' },
];

const URGENCY_OPTIONS = [
  { value: 'Low',      label: 'Low',      desc: 'Within a week',   cls: 'border-green-400 bg-green-50 text-green-700' },
  { value: 'Normal',   label: 'Normal',   desc: '2–3 days',        cls: 'border-cyan-400  bg-cyan-50  text-cyan-700'  },
  { value: 'High',     label: 'High',     desc: 'Within 24 hrs',   cls: 'border-orange-400 bg-orange-50 text-orange-700' },
  { value: 'Critical', label: 'Critical', desc: 'ASAP / Emergency', cls: 'border-red-400   bg-red-50   text-red-700'   },
];

// ─── Animation ────────────────────────────────────────────────────────────────

const slide = {
  enter: (d) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (d) => ({ x: d > 0 ? -50 : 50, opacity: 0 }),
};

// ─── Shared input class ───────────────────────────────────────────────────────

const inp = 'w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] transition';

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg,var(--color-brand),var(--color-cyan))' }}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 className="text-base font-bold text-[var(--color-text)]">{title}</h2>
        <p className="text-xs text-[var(--color-text-muted)]">{subtitle}</p>
      </div>
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-[var(--color-text-muted)]">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-cyan)' }} />
      <span className="w-20 flex-shrink-0 text-[var(--color-text-muted)]">{label}</span>
      <span className="font-medium text-[var(--color-text)] capitalize">{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ServiceRequest() {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep]     = useState(1);
  const [dir, setDir]       = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    fullName:      user?.name  || '',
    email:         user?.email || '',
    phone:         user?.phone || '',
    address:       '',
    deviceType:    '',
    deviceBrand:   '',
    issueType:     '',
    description:   '',
    photos:        [],
    urgency:       'Normal',
    preferredDate: '',
    preferredTime: '',
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const clearErr = (k) => setErrors(p => { const n = { ...p }; delete n[k]; return n; });

  // ── Validation ──────────────────────────────────────────────────────────────

  function validate(s) {
    const e = {};
    if (s === 1) {
      if (!form.fullName.trim()) e.fullName = 'Required';
      if (!form.email.trim())    e.email    = 'Required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
      if (!form.phone.trim())    e.phone    = 'Required';
    }
    if (s === 2) {
      if (!form.deviceType)  e.deviceType  = 'Select a device type';
      if (!form.deviceBrand) e.deviceBrand = 'Select a brand';
    }
    if (s === 3) { if (!form.issueType) e.issueType = 'Select an issue type'; }
    if (s === 4) { if (!form.description.trim()) e.description = 'Please describe the issue'; }
    return e;
  }

  function next() {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setDir(1); setStep(s => s + 1);
  }

  function back() {
    setErrors({}); setDir(-1); setStep(s => s - 1);
  }

  // ── Photos ──────────────────────────────────────────────────────────────────

  function addPhotos(files) {
    if (!files) return;
    const imgs = Array.from(files).filter(f => f.type.startsWith('image/'));
    set('photos', [...form.photos, ...imgs].slice(0, 5));
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!isAuthenticated) {
      toast.error('Please login to submit a service request');
      navigate('/login', { state: { from: location } });
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('fullName',    form.fullName);
      fd.append('email',       form.email);
      fd.append('phone',       form.phone);
      fd.append('deviceType',  form.deviceType);
      fd.append('issueType',   form.issueType);
      fd.append('description', form.description);
      fd.append('priority',    form.urgency);
      if (form.deviceBrand)   fd.append('deviceBrand',   form.deviceBrand);
      if (form.address)       fd.append('address',       form.address);
      if (form.preferredDate) fd.append('preferredDate', form.preferredDate);
      if (form.preferredTime) fd.append('preferredTime', form.preferredTime);
      form.photos.forEach(f => fd.append('image', f));

      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const { data } = await axios.post(`${API}/services`, fd, { headers });
      setTicketId(data.ticketId);
      toast.success('Request submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────

  if (ticketId) {
    return (
      <div className="w-full px-6 py-20 text-center md:px-10 lg:px-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card mx-auto max-w-md p-10"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <FiCheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-cyan)' }}>
            Ticket Created
          </p>
          <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-text)] mb-3">
            {ticketId}
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            Save this ID to track your request on the{' '}
            <Link to="/services/track" className="font-medium underline" style={{ color: 'var(--color-cyan)' }}>
              Track Request
            </Link>{' '}
            page.
          </p>
          <button
            onClick={() => { setTicketId(null); setStep(1); setForm({ fullName: user?.name||'', email: user?.email||'', phone: user?.phone||'', address:'', deviceType:'', deviceBrand:'', issueType:'', description:'', photos:[], urgency:'Normal', preferredDate:'', preferredTime:'' }); }}
            className="btn-cyan w-full"
          >
            Submit Another Request
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────────

  return (
    <div className="w-full px-6 py-10 md:px-10 lg:px-16">
      <SEO
        title="Submit IT Service Request — Computer Repair Pune"
        description="Submit an IT service request to Coldtech Technologies. Computer repair, data recovery, networking issues — get a ticket ID and track your repair in real time."
        keywords="IT service request Pune, computer repair request Pune, submit repair ticket, IT support ticket Pune, laptop repair request Pune"
        canonical="/services/request"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "IT Service Request — Coldtech Technologies",
          "provider": { "@type": "Organization", "name": "Coldtech Technologies", "url": "https://coldtechtechnologies.in" },
          "areaServed": { "@type": "City", "name": "Pune" },
          "serviceType": "Computer Repair and IT Support",
          "url": "https://coldtechtechnologies.in/services/request"
        }}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--color-text)]">
          Request IT Service
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Describe your issue — we will reply with next steps.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-[var(--color-border)] z-0" />
          <div
            className="absolute top-5 left-0 h-0.5 z-0 transition-all duration-500"
            style={{
              width: `${((step - 1) / (STEPS.length - 1)) * 100}%`,
              background: 'linear-gradient(90deg,var(--color-brand),var(--color-cyan))',
            }}
          />
          {STEPS.map(s => {
            const Icon = s.icon;
            const done    = step > s.id;
            const current = step === s.id;
            return (
              <div key={s.id} className="flex flex-col items-center z-10 gap-1.5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  done    ? 'text-white border-transparent'
                  : current ? 'bg-white border-[var(--color-cyan)] text-[var(--color-cyan)]'
                  :           'bg-white border-[var(--color-border)] text-[var(--color-text-muted)]'
                }`}
                  style={done ? { background: 'linear-gradient(135deg,var(--color-brand),var(--color-cyan))' } : {}}
                >
                  {done ? <FiCheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${current ? 'text-[var(--color-cyan)]' : 'text-[var(--color-text-muted)]'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card */}
      <div className="card overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="p-6 md:p-8"
          >

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <StepTitle icon={FiUser} title="Contact Information" subtitle="How can we reach you?" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name" required error={errors.fullName}>
                    <input className={inp} placeholder="John Doe" value={form.fullName}
                      onChange={e => { set('fullName', e.target.value); clearErr('fullName'); }} />
                  </Field>
                  <Field label="Email Address" required error={errors.email}>
                    <input type="email" className={inp} placeholder="john@example.com" value={form.email}
                      onChange={e => { set('email', e.target.value); clearErr('email'); }} />
                  </Field>
                  <Field label="Phone Number" required error={errors.phone}>
                    <input type="tel" className={inp} placeholder="+1 555 000 0000" value={form.phone}
                      onChange={e => { set('phone', e.target.value); clearErr('phone'); }} />
                  </Field>
                  <Field label="Address (optional)">
                    <input className={inp} placeholder="123 Main St" value={form.address}
                      onChange={e => set('address', e.target.value)} />
                  </Field>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-5">
                <StepTitle icon={FiMonitor} title="Device Details" subtitle="What device needs attention?" />
                <div>
                  <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">
                    Device Type <span className="text-red-500">*</span>
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {DEVICE_OPTIONS.map(opt => {
                      const Icon = opt.icon;
                      const sel = form.deviceType === opt.value;
                      return (
                        <button key={opt.value} type="button"
                          onClick={() => { set('deviceType', opt.value); clearErr('deviceType'); }}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                            sel
                              ? 'border-[var(--color-cyan)] bg-cyan-50 text-[var(--color-cyan)]'
                              : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-cyan)]'
                          }`}>
                          <Icon className="w-5 h-5" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.deviceType && <p className="text-xs text-red-500 mt-1">{errors.deviceType}</p>}
                </div>
                <Field label="Device Brand" required error={errors.deviceBrand}>
                  <select className={inp} value={form.deviceBrand}
                    onChange={e => { set('deviceBrand', e.target.value); clearErr('deviceBrand'); }}>
                    <option value="">Select brand…</option>
                    {DEVICE_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <StepTitle icon={FiAlertTriangle} title="Issue Type" subtitle="What kind of problem are you facing?" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ISSUE_OPTIONS.map(opt => {
                    const Icon = opt.icon;
                    const sel = form.issueType === opt.value;
                    return (
                      <button key={opt.value} type="button"
                        onClick={() => { set('issueType', opt.value); clearErr('issueType'); }}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                          sel
                            ? 'border-[var(--color-cyan)] bg-cyan-50'
                            : 'border-[var(--color-border)] hover:border-[var(--color-cyan)]'
                        }`}>
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          sel ? 'text-white' : 'bg-[var(--color-page)] text-[var(--color-text-muted)]'
                        }`}
                          style={sel ? { background: 'linear-gradient(135deg,var(--color-brand),var(--color-cyan))' } : {}}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${sel ? 'text-[var(--color-brand)]' : 'text-[var(--color-text)]'}`}>{opt.label}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.issueType && <p className="text-xs text-red-500">{errors.issueType}</p>}
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="space-y-5">
                <StepTitle icon={FiFileText} title="Issue Description" subtitle="Give us more details so we can help faster." />
                <Field label="Describe the Issue" required error={errors.description}>
                  <textarea rows={5} className={`${inp} resize-none`}
                    placeholder="e.g. My laptop won't turn on after I spilled water on it…"
                    value={form.description}
                    onChange={e => { set('description', e.target.value); clearErr('description'); }} />
                </Field>
                <div>
                  <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">
                    Photos <span className="font-normal">(optional, max 5)</span>
                  </p>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); addPhotos(e.dataTransfer.files); }}
                    className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 text-center cursor-pointer hover:border-[var(--color-cyan)] transition-colors"
                  >
                    <FiUpload className="w-7 h-7 mx-auto mb-2 text-[var(--color-text-muted)]" />
                    <p className="text-sm text-[var(--color-text-muted)]">Click or drag photos here</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1 opacity-70">PNG, JPG up to 10MB each</p>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                    onChange={e => addPhotos(e.target.files)} />
                  {form.photos.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-3">
                      {form.photos.map((file, i) => (
                        <div key={i} className="relative group rounded-lg overflow-hidden aspect-square bg-[var(--color-page)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                          <button onClick={() => set('photos', form.photos.filter((_, j) => j !== i))}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <FiX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <div className="space-y-5">
                <StepTitle icon={FiCalendar} title="Schedule & Review" subtitle="Pick a time and confirm your request." />

                {/* Urgency */}
                <div>
                  <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2">
                    Urgency Level <span className="text-red-500">*</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {URGENCY_OPTIONS.map(opt => {
                      const sel = form.urgency === opt.value;
                      return (
                        <button key={opt.value} type="button"
                          onClick={() => set('urgency', opt.value)}
                          className={`p-3 rounded-xl border-2 text-center transition-all text-sm ${
                            sel ? opt.cls + ' border-current' : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-cyan)]'
                          }`}>
                          <p className="font-semibold">{opt.label}</p>
                          <p className="text-xs opacity-75">{opt.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date / Time */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Preferred Date (optional)">
                    <input type="date" className={inp} value={form.preferredDate}
                      onChange={e => set('preferredDate', e.target.value)} />
                  </Field>
                  <Field label="Preferred Time (optional)">
                    <input type="time" className={inp} value={form.preferredTime}
                      onChange={e => set('preferredTime', e.target.value)} />
                  </Field>
                </div>

                {/* Summary */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-page)] p-5 space-y-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-3">Request Summary</p>
                  <SummaryRow icon={FiUser}          label="Name"    value={form.fullName} />
                  <SummaryRow icon={FiMail}          label="Email"   value={form.email} />
                  <SummaryRow icon={FiPhone}         label="Phone"   value={form.phone} />
                  <SummaryRow icon={FiMapPin}        label="Address" value={form.address} />
                  <SummaryRow icon={FiMonitor}       label="Device"  value={`${form.deviceBrand} ${form.deviceType}`} />
                  <SummaryRow icon={FiAlertTriangle} label="Issue"   value={form.issueType} />
                  <SummaryRow icon={FiZap}           label="Urgency" value={form.urgency} />
                  {form.preferredDate && <SummaryRow icon={FiCalendar} label="Date" value={form.preferredDate} />}
                  {form.photos.length > 0 && <SummaryRow icon={FiUpload} label="Photos" value={`${form.photos.length} attached`} />}
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap justify-center gap-3 pt-1">
                  {[
                    { icon: FiShield, label: 'Secure Data',  color: 'text-green-600 bg-green-50' },
                    { icon: FiClock,  label: '24/7 Support', color: 'text-cyan-600  bg-cyan-50'  },
                    { icon: FiStar,   label: '4.9/5 Rating', color: 'text-yellow-600 bg-yellow-50' },
                  ].map(({ icon: Icon, label, color }) => (
                    <span key={label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${color}`}>
                      <Icon className="w-3.5 h-3.5" />{label}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Nav buttons */}
        <div className="px-6 md:px-8 pb-6 flex justify-between gap-3 border-t border-[var(--color-border)] pt-4">
          {step > 1 ? (
            <button onClick={back} className="btn-outline flex items-center gap-2">
              <FiChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step < 5 ? (
            <button onClick={next} className="btn-cyan flex items-center gap-2">
              Next <FiChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {loading
                ? <><FiLoader className="w-4 h-4 animate-spin" /> Submitting…</>
                : <><FiCheckCircle className="w-4 h-4" /> Submit Request</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
