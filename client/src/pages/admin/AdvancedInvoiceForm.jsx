import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, FileText, Printer, Download, Save, ArrowLeft,
  ChevronDown, Search, Building2, Phone, Mail, MapPin, Hash,
  Calendar, CreditCard, AlertCircle, CheckCircle2, Info, X,
} from 'lucide-react';
import DashboardLayout from '../../components/admin/DashboardLayout';

/* ── Constants ── */
const GST_RATES = [
  { label: 'Nil (0%)', value: 0 },
  { label: '5%', value: 5 },
  { label: '12%', value: 12 },
  { label: '18%', value: 18 },
  { label: '28%', value: 28 },
];

const PAYMENT_MODES = ['Cash', 'UPI', 'NEFT/RTGS', 'Cheque', 'Credit Card', 'Debit Card', 'Net Banking'];

const STATUS_OPTIONS = [
  { value: 'UNPAID',  label: 'Unpaid',  color: '#EF4444' },
  { value: 'PARTIAL', label: 'Partial', color: '#F59E0B' },
  { value: 'PAID',    label: 'Paid',    color: '#10B981' },
  { value: 'OVERDUE', label: 'Overdue', color: '#EF4444' },
];

const SAMPLE_CUSTOMERS = [
  { id: 'c1', name: 'Infosys Ltd',    gstin: '27AAACI1681G1ZK', phone: '020-66043000', email: 'accounts@infosys.com',    address: 'Hinjewadi Phase 1, Pune – 411057' },
  { id: 'c2', name: 'TCS Digital',   gstin: '27AAACT2727Q1ZU', phone: '020-66443000', email: 'ap@tcs.com',              address: 'IT Park, Pimpri, Pune – 411018' },
  { id: 'c3', name: 'Wipro Tech',    gstin: '27AAACW0017A1ZK', phone: '020-27042000', email: 'vendor@wipro.com',        address: 'Hinjewadi Phase 2, Pune – 411057' },
  { id: 'c4', name: 'Mphasis Corp',  gstin: '27AABCM4831D1ZN', phone: '020-42243000', email: 'finance@mphasis.com',    address: 'Baner Road, Pune – 411045' },
];

const CATALOG_ITEMS = [
  { name: 'Dell Latitude 3540 i5 Laptop',    hsn: '84713010', unit: 'Nos', price: 62500 },
  { name: 'HP LaserJet Pro M428fdw MFP',     hsn: '84433100', unit: 'Nos', price: 36000 },
  { name: 'Annual Maintenance Contract',      hsn: '998314',  unit: 'Yr',  price: 18000 },
  { name: 'Remote IT Support (per incident)', hsn: '998315',  unit: 'Nos', price: 2500  },
  { name: 'Network Switch 24-Port PoE',       hsn: '85176990', unit: 'Nos', price: 14800 },
  { name: 'Server Rack Installation',         hsn: '998511',  unit: 'Job', price: 22000 },
];

/* ── Helpers ── */
const generateSerial = () => {
  const yr = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `COLDTECH-${yr}-${seq}`;
};

const newLineItem = () => ({
  id: Date.now() + Math.random(),
  name: '',
  description: '',
  hsn: '',
  unit: 'Nos',
  qty: 1,
  unitPrice: 0,
  gstRate: 18,
  discount: 0,
});

const calcLine = (item) => {
  const subtotal = item.qty * item.unitPrice;
  const discAmt = (subtotal * item.discount) / 100;
  const taxable = subtotal - discAmt;
  const gstAmt = (taxable * item.gstRate) / 100;
  const total = taxable + gstAmt;
  return { subtotal, discAmt, taxable, gstAmt, total };
};

/* ── Sub-components ── */
function FieldLabel({ children, required }) {
  return (
    <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.375rem' }}>
      {children} {required && <span style={{ color: '#EF4444' }}>*</span>}
    </label>
  );
}

function AdminInput({ value, onChange, placeholder, type = 'text', style = {}, readOnly }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className="admin-input"
      style={{ ...style }}
    />
  );
}

function SectionCard({ title, icon: Icon, children, accent = '#3B82F6' }) {
  return (
    <div style={{ background: 'rgba(31,41,55,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', overflow: 'hidden' }}>
      <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.625rem', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ width: 28, height: 28, borderRadius: '0.5rem', background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={13} style={{ color: accent }} />
        </div>
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#E5E7EB' }}>{title}</span>
      </div>
      <div style={{ padding: '1.25rem' }}>{children}</div>
    </div>
  );
}

function CustomerSearch({ selected, onSelect }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = SAMPLE_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.gstin.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
        <input
          className="admin-input"
          style={{ paddingLeft: 32 }}
          placeholder="Search customer by name or GSTIN…"
          value={selected ? selected.name : query}
          onFocus={() => setOpen(true)}
          onChange={e => { setQuery(e.target.value); if (selected) onSelect(null); }}
        />
        {selected && (
          <button onClick={() => { onSelect(null); setQuery(''); }} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer' }}>
            <X size={13} />
          </button>
        )}
      </div>
      <AnimatePresence>
        {open && !selected && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
              background: 'rgba(17,24,39,0.98)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.625rem', zIndex: 50, overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            }}
            onMouseLeave={() => setOpen(false)}
          >
            {filtered.map(c => (
              <div
                key={c.id}
                onClick={() => { onSelect(c); setOpen(false); }}
                style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.1s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <p style={{ fontSize: '0.875rem', color: '#F9FAFB', fontWeight: 600, margin: 0 }}>{c.name}</p>
                <p style={{ fontSize: '0.6875rem', color: '#6B7280', margin: '2px 0 0', fontFamily: 'var(--font-mono)' }}>GSTIN: {c.gstin}</p>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#6B7280', fontSize: '0.875rem' }}>No customers found</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LineItemRow({ item, index, onChange, onRemove, catalog }) {
  const [catOpen, setCatOpen] = useState(false);
  const calc = calcLine(item);

  const handleCatalogSelect = (cat) => {
    onChange({ ...item, name: cat.name, hsn: cat.hsn, unit: cat.unit, unitPrice: cat.price });
    setCatOpen(false);
  };

  const col = (w) => ({ width: w, minWidth: w, flexShrink: 0, padding: '0 0.375rem' });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 0, padding: '0.625rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Row number */}
      <div style={{ ...col(32), display: 'flex', alignItems: 'center', paddingTop: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#4B5563', fontWeight: 600 }}>{index + 1}</span>
      </div>

      {/* Item name + catalog picker */}
      <div style={{ ...col(220), position: 'relative' }}>
        <input
          className="admin-input"
          style={{ fontSize: '0.8125rem' }}
          placeholder="Item / service name"
          value={item.name}
          onFocus={() => setCatOpen(true)}
          onChange={e => onChange({ ...item, name: e.target.value })}
        />
        <AnimatePresence>
          {catOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 2, background: 'rgba(17,24,39,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', zIndex: 60, maxHeight: 200, overflowY: 'auto', boxShadow: '0 12px 32px rgba(0,0,0,0.6)' }}
              onMouseLeave={() => setCatOpen(false)}
            >
              {catalog.filter(c => c.name.toLowerCase().includes(item.name.toLowerCase())).map((c, i) => (
                <div
                  key={i}
                  onClick={() => handleCatalogSelect(c)}
                  style={{ padding: '0.5rem 0.875rem', cursor: 'pointer', fontSize: '0.8125rem', color: '#D1D5DB', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontWeight: 500 }}>{c.name}</span>
                  <span style={{ color: '#4B5563', marginLeft: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }}>{c.hsn}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* HSN */}
      <div style={col(88)}>
        <input className="admin-input" style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }} placeholder="HSN" value={item.hsn} onChange={e => onChange({ ...item, hsn: e.target.value })} />
      </div>

      {/* Unit */}
      <div style={col(70)}>
        <input className="admin-input" style={{ fontSize: '0.75rem', textAlign: 'center' }} value={item.unit} onChange={e => onChange({ ...item, unit: e.target.value })} />
      </div>

      {/* Qty */}
      <div style={col(72)}>
        <input className="admin-input" type="number" min={1} style={{ fontSize: '0.8125rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }} value={item.qty} onChange={e => onChange({ ...item, qty: Math.max(1, Number(e.target.value)) })} />
      </div>

      {/* Unit price */}
      <div style={col(110)}>
        <input className="admin-input" type="number" min={0} style={{ fontSize: '0.8125rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }} value={item.unitPrice} onChange={e => onChange({ ...item, unitPrice: Number(e.target.value) })} />
      </div>

      {/* Discount % */}
      <div style={col(72)}>
        <input className="admin-input" type="number" min={0} max={100} style={{ fontSize: '0.8125rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }} value={item.discount} onChange={e => onChange({ ...item, discount: Math.min(100, Number(e.target.value)) })} />
      </div>

      {/* GST rate */}
      <div style={col(96)}>
        <select
          className="admin-input"
          style={{ fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
          value={item.gstRate}
          onChange={e => onChange({ ...item, gstRate: Number(e.target.value) })}
        >
          {GST_RATES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>

      {/* GST amount */}
      <div style={{ ...col(88), paddingTop: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#9CA3AF', display: 'block', textAlign: 'right' }}>
          ₹{calc.gstAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Line total */}
      <div style={{ ...col(110), paddingTop: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, color: '#F9FAFB', display: 'block', textAlign: 'right' }}>
          ₹{calc.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Remove */}
      <div style={{ ...col(40), paddingTop: 6 }}>
        <button
          onClick={onRemove}
          style={{ width: 28, height: 28, borderRadius: '0.375rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
        >
          <Trash2 size={12} />
        </button>
      </div>
    </motion.div>
  );
}

/* ── Payment Entry ── */
function PaymentEntry({ entry, onChange, onRemove }) {
  return (
    <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <input className="admin-input" type="date" value={entry.date} onChange={e => onChange({ ...entry, date: e.target.value })} style={{ flex: '0 0 140px' }} />
      <select className="admin-input" value={entry.mode} onChange={e => onChange({ ...entry, mode: e.target.value })} style={{ flex: '0 0 140px' }}>
        {PAYMENT_MODES.map(m => <option key={m}>{m}</option>)}
      </select>
      <input className="admin-input" type="number" min={0} placeholder="Amount" value={entry.amount} onChange={e => onChange({ ...entry, amount: Number(e.target.value) })} style={{ flex: '0 0 120px', fontFamily: 'var(--font-mono)', textAlign: 'right' }} />
      <input className="admin-input" placeholder="Reference / UTR no." value={entry.reference} onChange={e => onChange({ ...entry, reference: e.target.value })} style={{ flex: 1, fontFamily: 'var(--font-mono)' }} />
      <button onClick={onRemove} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.375rem', padding: '0.3125rem 0.5rem', cursor: 'pointer', color: '#EF4444' }}>
        <Trash2 size={13} />
      </button>
    </div>
  );
}

/* ── Main Form ── */
export default function AdvancedInvoiceForm() {
  const navigate = useNavigate();
  const printRef = useRef();

  const [form, setForm] = useState({
    serial: generateSerial(),
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    customer: null,
    status: 'UNPAID',
    notes: '',
    terms: 'Payment due within 30 days. Late payments attract 2% monthly interest.',
    placeOfSupply: 'Maharashtra (27)',
    reverseCharge: false,
  });

  const [lineItems, setLineItems] = useState([newLineItem()]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('details');
  const [saved, setSaved] = useState(false);

  const updateLine = useCallback((id, updated) => {
    setLineItems(prev => prev.map(i => i.id === id ? updated : i));
  }, []);
  const removeLine = useCallback((id) => {
    setLineItems(prev => prev.filter(i => i.id !== id));
  }, []);
  const addLine = useCallback(() => {
    setLineItems(prev => [...prev, newLineItem()]);
  }, []);

  const addPayment = useCallback(() => {
    setPayments(prev => [...prev, { id: Date.now(), date: new Date().toISOString().split('T')[0], mode: 'UPI', amount: 0, reference: '' }]);
  }, []);
  const updatePayment = useCallback((id, updated) => {
    setPayments(prev => prev.map(p => p.id === id ? updated : p));
  }, []);
  const removePayment = useCallback((id) => {
    setPayments(prev => prev.filter(p => p.id !== id));
  }, []);

  /* Aggregates */
  const lines = lineItems.map(i => ({ ...i, ...calcLine(i) }));
  const subtotal = lines.reduce((s, l) => s + l.subtotal, 0);
  const totalDiscount = lines.reduce((s, l) => s + l.discAmt, 0);
  const totalGST = lines.reduce((s, l) => s + l.gstAmt, 0);
  const grandTotal = lines.reduce((s, l) => s + l.total, 0);
  const totalReceived = payments.reduce((s, p) => s + p.amount, 0);
  const balance = grandTotal - totalReceived;

  const gstBreakdown = lineItems.reduce((acc, item) => {
    const key = item.gstRate;
    const { taxable, gstAmt } = calcLine(item);
    if (!acc[key]) acc[key] = { rate: key, taxable: 0, cgst: 0, sgst: 0, igst: 0, total: 0 };
    acc[key].taxable += taxable;
    acc[key].cgst += gstAmt / 2;
    acc[key].sgst += gstAmt / 2;
    acc[key].total += gstAmt;
    return acc;
  }, {});

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePrint = () => navigate(`/admin/invoice-print/${form.serial}`, { state: { form, lineItems, payments, grandTotal, totalGST, subtotal, totalDiscount, totalReceived, balance, gstBreakdown } });

  const TAB_STYLE = (active) => ({
    padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none',
    background: active ? 'rgba(59,130,246,0.2)' : 'transparent',
    color: active ? '#3B82F6' : '#6B7280',
    cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
    transition: 'all 0.15s',
  });

  return (
    <DashboardLayout title="Advanced Invoice Engine">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', padding: '0.375rem 0.625rem', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}>
              <ArrowLeft size={14} /> Back
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 style={{ fontSize: '1rem', fontWeight: 700, color: '#F9FAFB', margin: 0 }}>New Invoice</h1>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#3B82F6', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '0.125rem 0.625rem', borderRadius: '0.375rem' }}>
                  {form.serial}
                </span>
                {saved && (
                  <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#10B981' }}>
                    <CheckCircle2 size={13} /> Saved
                  </motion.span>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleSave} className="btn-ghost-light" style={{ fontSize: '0.8125rem', padding: '0.5rem 0.875rem' }}>
              <Save size={14} /> Save Draft
            </button>
            <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', borderRadius: '0.625rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>
              <Printer size={14} /> Print / Export
            </button>
            <button className="btn-admin-primary" onClick={handleSave}>
              <CheckCircle2 size={14} /> Finalize Invoice
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '0.625rem', width: 'fit-content' }}>
          {[['details', 'Invoice Details'], ['items', 'Line Items'], ['payments', 'Payments'], ['preview', 'Summary']].map(([key, label]) => (
            <button key={key} style={TAB_STYLE(activeTab === key)} onClick={() => setActiveTab(key)}>{label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── DETAILS TAB ── */}
          {activeTab === 'details' && (
            <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                {/* Invoice Meta */}
                <SectionCard title="Invoice Information" icon={FileText} accent="#3B82F6">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                    <div>
                      <FieldLabel required>Invoice Number</FieldLabel>
                      <AdminInput value={form.serial} readOnly style={{ fontFamily: 'var(--font-mono)', background: 'rgba(59,130,246,0.06)' }} />
                    </div>
                    <div>
                      <FieldLabel required>Status</FieldLabel>
                      <select className="admin-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                        {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <FieldLabel required>Invoice Date</FieldLabel>
                      <AdminInput type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                    </div>
                    <div>
                      <FieldLabel required>Due Date</FieldLabel>
                      <AdminInput type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                    </div>
                    <div>
                      <FieldLabel>Place of Supply</FieldLabel>
                      <AdminInput value={form.placeOfSupply} onChange={e => setForm(f => ({ ...f, placeOfSupply: e.target.value }))} placeholder="Maharashtra (27)" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', paddingTop: '1.5rem' }}>
                      <input
                        type="checkbox"
                        id="reverseCharge"
                        checked={form.reverseCharge}
                        onChange={e => setForm(f => ({ ...f, reverseCharge: e.target.checked }))}
                        style={{ width: 16, height: 16, accentColor: '#3B82F6', cursor: 'pointer' }}
                      />
                      <label htmlFor="reverseCharge" style={{ fontSize: '0.8125rem', color: '#D1D5DB', cursor: 'pointer' }}>Reverse Charge Applicable</label>
                    </div>
                  </div>
                </SectionCard>

                {/* Seller Info */}
                <SectionCard title="COLDTECH Technologies (Seller)" icon={Building2} accent="#10B981">
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {[
                      { label: 'Company Name',  icon: Building2, value: 'COLDTECH Technologies', readOnly: true },
                      { label: 'GSTIN',         icon: Hash,      value: '27AABCC1234K1ZX', readOnly: true, mono: true },
                      { label: 'Phone',         icon: Phone,     value: '+91 98234 56789', readOnly: true },
                      { label: 'Email',         icon: Mail,      value: 'billing@coldtech.in', readOnly: true },
                      { label: 'Address',       icon: MapPin,    value: 'Survey No. 12, Baner-Pashan Link Rd, Pune – 411021', readOnly: true },
                    ].map(field => (
                      <div key={field.label} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.75rem', background: 'rgba(16,185,129,0.05)', borderRadius: '0.5rem', border: '1px solid rgba(16,185,129,0.1)' }}>
                        <field.icon size={13} style={{ color: '#10B981', flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: '0.625rem', color: '#6B7280', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{field.label}</p>
                          <p style={{ fontSize: '0.8125rem', color: '#E5E7EB', margin: 0, fontFamily: field.mono ? 'var(--font-mono)' : undefined, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{field.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                {/* Customer */}
                <SectionCard title="Bill To (Customer)" icon={Users} accent="#8B5CF6">
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    <div>
                      <FieldLabel required>Select Customer</FieldLabel>
                      <CustomerSearch selected={form.customer} onSelect={c => setForm(f => ({ ...f, customer: c }))} />
                    </div>
                    {form.customer && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '0.875rem', background: 'rgba(139,92,246,0.06)', borderRadius: '0.625rem', border: '1px solid rgba(139,92,246,0.15)' }}>
                        <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#F9FAFB', margin: '0 0 0.375rem' }}>{form.customer.name}</p>
                        {[
                          { icon: Hash,   label: 'GSTIN',   value: form.customer.gstin },
                          { icon: Phone,  label: 'Phone',   value: form.customer.phone },
                          { icon: Mail,   label: 'Email',   value: form.customer.email },
                          { icon: MapPin, label: 'Address', value: form.customer.address },
                        ].map(r => (
                          <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <r.icon size={11} style={{ color: '#8B5CF6', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{r.value}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </SectionCard>

                {/* Notes / Terms */}
                <SectionCard title="Notes & Terms" icon={Info} accent="#F59E0B">
                  <div style={{ display: 'grid', gap: '0.875rem' }}>
                    <div>
                      <FieldLabel>Customer Notes</FieldLabel>
                      <textarea
                        className="admin-input"
                        rows={3}
                        placeholder="Any notes visible to the customer on the invoice…"
                        value={form.notes}
                        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                        style={{ resize: 'vertical', minHeight: 80 }}
                      />
                    </div>
                    <div>
                      <FieldLabel>Terms & Conditions</FieldLabel>
                      <textarea
                        className="admin-input"
                        rows={4}
                        value={form.terms}
                        onChange={e => setForm(f => ({ ...f, terms: e.target.value }))}
                        style={{ resize: 'vertical', minHeight: 100 }}
                      />
                    </div>
                  </div>
                </SectionCard>
              </div>
            </motion.div>
          )}

          {/* ── LINE ITEMS TAB ── */}
          {activeTab === 'items' && (
            <motion.div key="items" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ background: 'rgba(31,41,55,0.55)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', overflow: 'hidden' }}>
                {/* Column headers */}
                <div style={{
                  display: 'flex', alignItems: 'center', padding: '0.625rem 1rem',
                  background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)',
                  fontSize: '0.625rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  <span style={{ width: 32 }}>#</span>
                  <span style={{ width: 220, paddingLeft: 6 }}>Item / Service</span>
                  <span style={{ width: 88, paddingLeft: 6 }}>HSN/SAC</span>
                  <span style={{ width: 70, paddingLeft: 6 }}>Unit</span>
                  <span style={{ width: 72, paddingLeft: 6, textAlign: 'right' }}>Qty</span>
                  <span style={{ width: 110, paddingLeft: 6, textAlign: 'right' }}>Unit Price</span>
                  <span style={{ width: 72, paddingLeft: 6, textAlign: 'right' }}>Disc %</span>
                  <span style={{ width: 96, paddingLeft: 6 }}>GST Rate</span>
                  <span style={{ width: 88, paddingLeft: 6, textAlign: 'right' }}>GST Amt</span>
                  <span style={{ width: 110, paddingLeft: 6, textAlign: 'right' }}>Total</span>
                  <span style={{ width: 40 }} />
                </div>

                {/* Line items */}
                <div style={{ padding: '0 1rem' }}>
                  <AnimatePresence>
                    {lineItems.map((item, i) => (
                      <LineItemRow
                        key={item.id}
                        item={item}
                        index={i}
                        onChange={updated => updateLine(item.id, updated)}
                        onRemove={() => removeLine(item.id)}
                        catalog={CATALOG_ITEMS}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Add item */}
                <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button onClick={addLine} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px dashed rgba(59,130,246,0.3)', borderRadius: '0.5rem', padding: '0.5rem 0.875rem', color: '#3B82F6', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Plus size={14} /> Add Line Item
                  </button>
                </div>

                {/* Totals panel */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ width: 320 }}>
                    {[
                      { label: 'Subtotal', value: subtotal, color: '#D1D5DB' },
                      { label: 'Total Discount', value: -totalDiscount, color: '#10B981', prefix: '-' },
                      { label: 'Taxable Amount', value: subtotal - totalDiscount, color: '#D1D5DB', separator: true },
                      { label: `GST (CGST + SGST)`, value: totalGST, color: '#F59E0B' },
                    ].map((row, i) => (
                      <div key={i}>
                        {row.separator && <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0.5rem 0' }} />}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                          <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>{row.label}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 600, color: row.color }}>
                            {row.prefix || ''}₹{Math.abs(row.value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div style={{ borderTop: '2px solid rgba(59,130,246,0.3)', margin: '0.5rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0.75rem', background: 'rgba(59,130,246,0.1)', borderRadius: '0.5rem', border: '1px solid rgba(59,130,246,0.2)' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#F9FAFB' }}>Grand Total</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 800, color: '#3B82F6', filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.5))' }}>
                        ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* GST Breakdown Table */}
                {Object.values(gstBreakdown).length > 0 && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '1rem 1.25rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.625rem' }}>GST Breakup</p>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                          {['Rate', 'Taxable', 'CGST', 'SGST', 'Total GST'].map(h => (
                            <th key={h} style={{ padding: '0.375rem 0.75rem', textAlign: h === 'Rate' ? 'left' : 'right', color: '#9CA3AF', fontFamily: 'var(--font-mono)', border: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(gstBreakdown).map(row => (
                          <tr key={row.rate}>
                            <td style={{ padding: '0.375rem 0.75rem', color: '#F59E0B', fontFamily: 'var(--font-mono)', fontWeight: 700, border: '1px solid rgba(255,255,255,0.04)' }}>{row.rate}%</td>
                            {[row.taxable, row.cgst, row.sgst, row.total].map((v, i) => (
                              <td key={i} style={{ padding: '0.375rem 0.75rem', textAlign: 'right', color: '#D1D5DB', fontFamily: 'var(--font-mono)', border: '1px solid rgba(255,255,255,0.04)' }}>
                                ₹{v.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── PAYMENTS TAB ── */}
          {activeTab === 'payments' && (
            <motion.div key="payments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <SectionCard title="Payment Ledger" icon={CreditCard} accent="#10B981">
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                      {[
                        { label: 'Invoice Total', value: `₹${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: '#3B82F6' },
                        { label: 'Received', value: `₹${totalReceived.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: '#10B981' },
                        { label: 'Balance Due', value: `₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: balance > 0 ? '#EF4444' : '#10B981' },
                      ].map(s => (
                        <div key={s.label} style={{ flex: 1, padding: '0.625rem 0.75rem', background: `${s.color}10`, borderRadius: '0.5rem', border: `1px solid ${s.color}20` }}>
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
                          <p style={{ fontSize: '0.6875rem', color: '#9CA3AF', margin: '0.125rem 0 0' }}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                    {grandTotal > 0 && (
                      <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 9999, marginBottom: '1rem', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(100, (totalReceived / grandTotal) * 100)}%`, background: 'linear-gradient(90deg, #10B981, #06B6D4)', borderRadius: 9999, transition: 'width 0.4s ease' }} />
                      </div>
                    )}
                    <div>
                      {payments.map(p => (
                        <PaymentEntry key={p.id} entry={p} onChange={updated => updatePayment(p.id, updated)} onRemove={() => removePayment(p.id)} />
                      ))}
                    </div>
                    <button onClick={addPayment} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px dashed rgba(16,185,129,0.3)', borderRadius: '0.5rem', padding: '0.5rem 0.875rem', color: '#10B981', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600, marginTop: '0.75rem' }}>
                      <Plus size={14} /> Add Payment Entry
                    </button>
                  </SectionCard>
                </div>
                <div>
                  <SectionCard title="Payment Status" icon={AlertCircle} accent="#F59E0B">
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                      <div style={{
                        width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1rem',
                        background: balance <= 0 ? 'rgba(16,185,129,0.15)' : balance < grandTotal ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                        border: `2px solid ${balance <= 0 ? '#10B981' : balance < grandTotal ? '#F59E0B' : '#EF4444'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {balance <= 0
                          ? <CheckCircle2 size={32} style={{ color: '#10B981' }} />
                          : balance < grandTotal
                            ? <AlertCircle size={32} style={{ color: '#F59E0B' }} />
                            : <AlertCircle size={32} style={{ color: '#EF4444' }} />
                        }
                      </div>
                      <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F9FAFB', margin: '0 0 0.25rem' }}>
                        {balance <= 0 ? 'Fully Paid' : balance < grandTotal ? 'Partially Paid' : 'Unpaid'}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>
                        {balance > 0 ? `₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })} remaining` : 'No outstanding balance'}
                      </p>
                    </div>
                  </SectionCard>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── SUMMARY TAB ── */}
          {activeTab === 'preview' && (
            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <SectionCard title="Invoice Summary" icon={FileText} accent="#3B82F6">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {[
                      { label: 'Invoice No.',     value: form.serial,                       mono: true, color: '#3B82F6' },
                      { label: 'Date',            value: form.date,                         mono: true },
                      { label: 'Due Date',        value: form.dueDate,                      mono: true },
                      { label: 'Customer',        value: form.customer?.name || '—' },
                      { label: 'GSTIN',           value: form.customer?.gstin || '—',       mono: true },
                      { label: 'Place of Supply', value: form.placeOfSupply },
                      { label: 'Reverse Charge',  value: form.reverseCharge ? 'Yes' : 'No' },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>{row.label}</span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: row.color || '#E5E7EB', fontFamily: row.mono ? 'var(--font-mono)' : undefined }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </SectionCard>
                <SectionCard title="Financial Summary" icon={DollarSign} accent="#10B981">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      { label: 'Subtotal',         value: subtotal,          color: '#D1D5DB' },
                      { label: 'Total Discount',   value: totalDiscount,     color: '#10B981',  prefix: '- ' },
                      { label: 'Taxable Amount',   value: subtotal - totalDiscount, color: '#D1D5DB', separator: true },
                      { label: 'Total GST',        value: totalGST,          color: '#F59E0B' },
                    ].map((row, i) => (
                      <div key={i}>
                        {row.separator && <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', margin: '0.25rem 0' }} />}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0' }}>
                          <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>{row.label}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 600, color: row.color }}>
                            {row.prefix || ''}₹{row.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div style={{ borderTop: '2px solid rgba(59,130,246,0.4)', margin: '0.25rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.875rem', background: 'rgba(59,130,246,0.1)', borderRadius: '0.625rem', border: '1px solid rgba(59,130,246,0.2)' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#F9FAFB' }}>Grand Total</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.0625rem', fontWeight: 800, color: '#3B82F6' }}>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', margin: '0.25rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0' }}>
                      <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>Received</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#10B981' }}>₹{totalReceived.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0' }}>
                      <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>Balance Due</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: balance > 0 ? '#EF4444' : '#10B981' }}>₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </SectionCard>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.875rem', justifyContent: 'center' }}>
                <button onClick={handlePrint} className="btn-cyan" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem', padding: '0.75rem 2rem' }}>
                  <Printer size={16} /> Print / Export PDF
                </button>
                <button onClick={handleSave} className="btn-admin-primary" style={{ fontSize: '0.9375rem', padding: '0.75rem 2rem' }}>
                  <CheckCircle2 size={16} /> Finalize & Save
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
