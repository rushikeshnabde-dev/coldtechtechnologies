import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { Printer, ArrowLeft, Download } from 'lucide-react';

/* ── Number to words (Indian system) ── */
function numToWords(n) {
  if (n === 0) return 'Zero';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const convert = (num) => {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + convert(num % 100) : '');
    if (num < 100000) return convert(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + convert(num % 1000) : '');
    if (num < 10000000) return convert(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + convert(num % 100000) : '');
    return convert(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + convert(num % 10000000) : '');
  };
  const rupees = Math.floor(n);
  const paise = Math.round((n - rupees) * 100);
  let result = 'Rupees ' + convert(rupees);
  if (paise > 0) result += ' and ' + convert(paise) + ' Paise';
  return result + ' Only';
}

/* ── QR Code placeholder (SVG) ── */
function QRPlaceholder({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ border: '1px solid #D1D5DB' }}>
      <rect width="80" height="80" fill="#fff" />
      {/* Finder patterns */}
      <rect x="2" y="2" width="26" height="26" fill="none" stroke="#000" strokeWidth="2" />
      <rect x="7" y="7" width="16" height="16" fill="#000" />
      <rect x="52" y="2" width="26" height="26" fill="none" stroke="#000" strokeWidth="2" />
      <rect x="57" y="7" width="16" height="16" fill="#000" />
      <rect x="2" y="52" width="26" height="26" fill="none" stroke="#000" strokeWidth="2" />
      <rect x="7" y="57" width="16" height="16" fill="#000" />
      {/* Data dots */}
      {[32,35,38,41,44,47].map(x => [32,35,38,41,44,47].map(y => (
        Math.random() > 0.5
          ? <rect key={`${x}${y}`} x={x} y={y} width="3" height="3" fill="#000" />
          : null
      )))}
      <text x="40" y="76" textAnchor="middle" fontSize="5" fill="#888">Scan to Pay</text>
    </svg>
  );
}

/* ── Print styles injected directly ── */
const PRINT_STYLE = `
  @media print {
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { background: #fff !important; margin: 0; padding: 0; }
    .no-print { display: none !important; }
    .print-page { width: 210mm; min-height: 297mm; padding: 15mm 18mm; margin: 0 auto; page-break-after: avoid; }
    @page { size: A4 portrait; margin: 0; }
  }
`;

/* ── Divider ── */
const HR = ({ dashed, my = '0.625rem' } = {}) => (
  <div style={{ borderTop: dashed ? '1px dashed #D1D5DB' : '1px solid #D1D5DB', margin: `${my} 0` }} />
);

/* ── Table cell ── */
function TH({ children, style = {} }) {
  return (
    <th style={{
      padding: '5pt 7pt', textAlign: 'left', fontSize: '8pt', fontWeight: 700,
      background: '#1E3A5F', color: '#fff', border: '1px solid #1E3A5F', ...style,
    }}>{children}</th>
  );
}
function TD({ children, style = {}, right }) {
  return (
    <td style={{
      padding: '4pt 7pt', fontSize: '9pt', color: '#111827',
      border: '1px solid #E5E7EB', textAlign: right ? 'right' : 'left',
      verticalAlign: 'top', ...style,
    }}>{children}</td>
  );
}

/* ── Main Print View ── */
export default function InvoicePrintView() {
  const { state } = useLocation();
  const { serial } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();

  const triggerPrint = () => window.print();

  /* Fallback demo data if navigated directly */
  const DEMO_FORM = {
    serial: serial || 'COLDTECH-2025-0042',
    date: '2025-05-29',
    dueDate: '2025-06-28',
    status: 'UNPAID',
    placeOfSupply: 'Maharashtra (27)',
    reverseCharge: false,
    notes: 'Thank you for your business.',
    terms: 'Payment due within 30 days. Late payments attract 2% monthly interest.',
    customer: {
      name: 'Infosys Ltd',
      gstin: '27AAACI1681G1ZK',
      phone: '020-66043000',
      email: 'accounts@infosys.com',
      address: 'Hinjewadi Phase 1, Pune – 411057, Maharashtra',
    },
  };

  const DEMO_ITEMS = [
    { name: 'Dell Latitude 3540 i5 Laptop', hsn: '84713010', unit: 'Nos', qty: 5, unitPrice: 62500, gstRate: 18, discount: 0 },
    { name: 'HP LaserJet Pro M428fdw MFP',  hsn: '84433100', unit: 'Nos', qty: 2, unitPrice: 36000, gstRate: 18, discount: 5 },
    { name: 'Annual Maintenance Contract',   hsn: '998314',  unit: 'Yr',  qty: 1, unitPrice: 18000, gstRate: 12, discount: 0 },
  ];

  const calcLine = (item) => {
    const subtotal = item.qty * item.unitPrice;
    const discAmt = (subtotal * item.discount) / 100;
    const taxable = subtotal - discAmt;
    const gstAmt = (taxable * item.gstRate) / 100;
    const cgst = gstAmt / 2, sgst = gstAmt / 2;
    const total = taxable + gstAmt;
    return { subtotal, discAmt, taxable, gstAmt, cgst, sgst, total };
  };

  const form = state?.form || DEMO_FORM;
  const lineItems = state?.lineItems || DEMO_ITEMS;
  const payments = state?.payments || [];

  const lines = lineItems.map(i => ({ ...i, ...calcLine(i) }));
  const subtotal = lines.reduce((s, l) => s + l.subtotal, 0);
  const totalDiscount = lines.reduce((s, l) => s + l.discAmt, 0);
  const totalTaxable = subtotal - totalDiscount;
  const totalGST = lines.reduce((s, l) => s + l.gstAmt, 0);
  const grandTotal = lines.reduce((s, l) => s + l.total, 0);
  const totalReceived = payments.reduce((s, p) => s + p.amount, 0);
  const balance = grandTotal - totalReceived;

  const gstBreakdown = lineItems.reduce((acc, item) => {
    const key = item.gstRate;
    const { taxable, gstAmt } = calcLine(item);
    if (!acc[key]) acc[key] = { rate: key, taxable: 0, cgst: 0, sgst: 0, total: 0 };
    acc[key].taxable += taxable;
    acc[key].cgst += gstAmt / 2;
    acc[key].sgst += gstAmt / 2;
    acc[key].total += gstAmt;
    return acc;
  }, {});

  const fmt = (n) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const STATUS_COLORS = { PAID: '#10B981', UNPAID: '#EF4444', PARTIAL: '#F59E0B', OVERDUE: '#EF4444' };

  return (
    <>
      <style>{PRINT_STYLE}</style>

      {/* Action bar — hidden on print */}
      <div className="no-print" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(10,15,28,0.95)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.875rem',
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.375rem 0.75rem', cursor: 'pointer', color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem' }}>
          <ArrowLeft size={14} /> Back
        </button>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: '#3B82F6', fontWeight: 600 }}>{form.serial}</span>
        <div style={{ flex: 1 }} />
        <button onClick={triggerPrint} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', border: 'none', borderRadius: '0.5rem', padding: '0.5rem 1.25rem', cursor: 'pointer', color: '#fff', fontSize: '0.875rem', fontWeight: 600, boxShadow: '0 0 12px rgba(59,130,246,0.4)' }}>
          <Printer size={15} /> Print / Save as PDF
        </button>
      </div>

      {/* Invoice document */}
      <div ref={printRef} style={{ background: '#e5e7eb', minHeight: '100vh', paddingTop: 60 }} className="no-print-bg">
        <div className="print-page" style={{
          width: '210mm', minHeight: '297mm', padding: '15mm 18mm',
          margin: '24px auto', background: '#fff', boxShadow: '0 4px 32px rgba(0,0,0,0.2)',
          fontFamily: "'Inter', sans-serif", color: '#111827', fontSize: '10pt',
        }}>
          {/* Paid watermark */}
          {form.status === 'PAID' && (
            <div className="print-watermark-paid" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-35deg)', fontSize: '80pt', fontWeight: 900, color: 'rgba(16,185,129,0.08)', zIndex: 0, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
              PAID
            </div>
          )}

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* ── HEADER ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8mm', paddingBottom: '6mm', borderBottom: '3px solid #1E3A5F' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8pt', marginBottom: '6pt' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #1E3A5F, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#fff', fontWeight: 900, fontSize: '14pt' }}>⚡</span>
                  </div>
                  <div>
                    <p className="print-company-name" style={{ fontSize: '18pt', fontWeight: 900, color: '#1E3A5F', margin: 0, letterSpacing: '-0.02em' }}>COLDTECH</p>
                    <p style={{ fontSize: '7pt', color: '#6B7280', margin: 0, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Technologies</p>
                  </div>
                </div>
                <p style={{ fontSize: '8pt', color: '#374151', margin: '2pt 0' }}>Survey No. 12, Baner-Pashan Link Rd, Pune – 411021</p>
                <p style={{ fontSize: '8pt', color: '#374151', margin: '2pt 0' }}>
                  GSTIN: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1E3A5F' }}>27AABCC1234K1ZX</span>
                  &nbsp;|&nbsp; +91 98234 56789 &nbsp;|&nbsp; billing@coldtech.in
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="print-invoice-title" style={{ fontSize: '20pt', fontWeight: 900, color: '#1E3A5F', margin: '0 0 4pt', letterSpacing: '-0.02em' }}>
                  TAX INVOICE
                </p>
                <p style={{ fontFamily: 'monospace', fontSize: '11pt', fontWeight: 800, color: '#2563EB', margin: '0 0 4pt' }}>{form.serial}</p>
                <div style={{ display: 'inline-block', padding: '2pt 8pt', borderRadius: '4pt', background: `${STATUS_COLORS[form.status]}18`, border: `1px solid ${STATUS_COLORS[form.status]}50` }}>
                  <span style={{ fontSize: '8pt', fontWeight: 800, color: STATUS_COLORS[form.status], textTransform: 'uppercase', letterSpacing: '0.08em' }}>{form.status}</span>
                </div>
              </div>
            </div>

            {/* ── INVOICE META & BILL TO ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5mm', marginBottom: '6mm' }}>
              {/* Bill To */}
              <div style={{ gridColumn: 'span 2', padding: '5mm', background: '#F8FAFF', border: '1px solid #DBEAFE', borderRadius: 6 }}>
                <p className="print-section-label" style={{ fontSize: '7pt', fontWeight: 700, color: '#1E3A5F', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4pt' }}>BILL TO</p>
                <p style={{ fontSize: '11pt', fontWeight: 800, color: '#111827', margin: '0 0 3pt' }}>{form.customer?.name}</p>
                <p style={{ fontSize: '8pt', color: '#374151', margin: '1pt 0' }}>GSTIN: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{form.customer?.gstin}</span></p>
                <p style={{ fontSize: '8pt', color: '#374151', margin: '1pt 0' }}>{form.customer?.address}</p>
                <p style={{ fontSize: '8pt', color: '#374151', margin: '1pt 0' }}>📞 {form.customer?.phone} &nbsp;|&nbsp; ✉ {form.customer?.email}</p>
              </div>
              {/* Invoice details */}
              <div style={{ padding: '4mm', background: '#FAFAFA', border: '1px solid #E5E7EB', borderRadius: 6 }}>
                {[
                  ['Invoice Date', form.date],
                  ['Due Date', form.dueDate],
                  ['Place of Supply', form.placeOfSupply],
                  ['Rev. Charge', form.reverseCharge ? 'Yes' : 'No'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3pt', gap: '4pt' }}>
                    <span style={{ fontSize: '7.5pt', color: '#6B7280', fontWeight: 600 }}>{k}</span>
                    <span style={{ fontSize: '7.5pt', color: '#111827', fontWeight: 700, fontFamily: 'monospace', textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── LINE ITEMS TABLE ── */}
            <table className="print-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '5mm' }}>
              <thead>
                <tr>
                  <TH style={{ width: '3%', textAlign: 'center' }}>#</TH>
                  <TH style={{ width: '32%' }}>Item / Service Description</TH>
                  <TH style={{ width: '7%' }}>HSN</TH>
                  <TH style={{ width: '5%', textAlign: 'center' }}>Unit</TH>
                  <TH style={{ width: '5%', textAlign: 'right' }}>Qty</TH>
                  <TH style={{ width: '9%', textAlign: 'right' }}>Unit Price</TH>
                  <TH style={{ width: '6%', textAlign: 'right' }}>Disc%</TH>
                  <TH style={{ width: '8%', textAlign: 'right' }}>Taxable</TH>
                  <TH style={{ width: '5%', textAlign: 'center' }}>GST%</TH>
                  <TH style={{ width: '8%', textAlign: 'right' }}>CGST</TH>
                  <TH style={{ width: '8%', textAlign: 'right' }}>SGST</TH>
                  <TH style={{ width: '9%', textAlign: 'right' }}>Total</TH>
                </tr>
              </thead>
              <tbody>
                {lines.map((item, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                    <TD style={{ textAlign: 'center', fontFamily: 'monospace' }}>{i + 1}</TD>
                    <TD>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                      {item.description && <span style={{ display: 'block', fontSize: '7pt', color: '#6B7280' }}>{item.description}</span>}
                    </TD>
                    <TD style={{ fontFamily: 'monospace', fontSize: '7.5pt' }}>{item.hsn}</TD>
                    <TD style={{ textAlign: 'center' }}>{item.unit}</TD>
                    <TD right style={{ fontFamily: 'monospace' }}>{item.qty}</TD>
                    <TD right style={{ fontFamily: 'monospace' }}>₹{fmt(item.unitPrice)}</TD>
                    <TD right style={{ fontFamily: 'monospace' }}>{item.discount}%</TD>
                    <TD right style={{ fontFamily: 'monospace' }}>₹{fmt(item.taxable)}</TD>
                    <TD style={{ textAlign: 'center', fontFamily: 'monospace', fontWeight: 700, color: '#1E3A5F' }}>{item.gstRate}%</TD>
                    <TD right style={{ fontFamily: 'monospace' }}>₹{fmt(item.cgst)}</TD>
                    <TD right style={{ fontFamily: 'monospace' }}>₹{fmt(item.sgst)}</TD>
                    <TD right style={{ fontFamily: 'monospace', fontWeight: 700 }}>₹{fmt(item.total)}</TD>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={7} style={{ padding: '4pt 7pt', fontSize: '8pt', color: '#6B7280', border: '1px solid #E5E7EB', fontStyle: 'italic' }}>
                    {lineItems.length} item(s)
                  </td>
                  <td style={{ padding: '4pt 7pt', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, border: '1px solid #E5E7EB', fontSize: '8.5pt' }}>₹{fmt(totalTaxable)}</td>
                  <td style={{ border: '1px solid #E5E7EB' }} />
                  <td style={{ padding: '4pt 7pt', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, border: '1px solid #E5E7EB', fontSize: '8.5pt' }}>₹{fmt(totalGST / 2)}</td>
                  <td style={{ padding: '4pt 7pt', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, border: '1px solid #E5E7EB', fontSize: '8.5pt' }}>₹{fmt(totalGST / 2)}</td>
                  <td style={{ padding: '4pt 7pt', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, border: '1px solid #1E3A5F', background: '#EFF6FF', color: '#1E3A5F', fontSize: '9pt' }}>₹{fmt(grandTotal)}</td>
                </tr>
              </tfoot>
            </table>

            {/* ── TOTALS + GST BREAKUP SIDE BY SIDE ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5mm', marginBottom: '5mm' }}>
              {/* GST Breakup */}
              <div>
                <p style={{ fontSize: '7pt', fontWeight: 700, color: '#1E3A5F', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4pt' }}>GST Summary</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8pt' }}>
                  <thead>
                    <tr style={{ background: '#1E3A5F' }}>
                      {['Rate', 'Taxable Amt', 'CGST', 'SGST', 'Total GST'].map(h => (
                        <th key={h} style={{ padding: '3pt 5pt', color: '#fff', fontWeight: 700, border: '1px solid #1E3A5F', textAlign: h === 'Rate' ? 'left' : 'right', fontSize: '7pt' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(gstBreakdown).map(row => (
                      <tr key={row.rate}>
                        <td style={{ padding: '3pt 5pt', fontWeight: 700, color: '#1E3A5F', border: '1px solid #E5E7EB', fontFamily: 'monospace' }}>{row.rate}%</td>
                        {[row.taxable, row.cgst, row.sgst, row.total].map((v, i) => (
                          <td key={i} style={{ padding: '3pt 5pt', textAlign: 'right', border: '1px solid #E5E7EB', fontFamily: 'monospace', fontSize: '7.5pt' }}>₹{fmt(v)}</td>
                        ))}
                      </tr>
                    ))}
                    <tr style={{ background: '#EFF6FF', fontWeight: 800 }}>
                      <td style={{ padding: '3pt 5pt', fontWeight: 800, border: '1px solid #BFDBFE', fontSize: '7.5pt' }}>Total</td>
                      {[totalTaxable, totalGST / 2, totalGST / 2, totalGST].map((v, i) => (
                        <td key={i} style={{ padding: '3pt 5pt', textAlign: 'right', border: '1px solid #BFDBFE', fontFamily: 'monospace', fontSize: '7.5pt', fontWeight: 800 }}>₹{fmt(v)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Invoice totals */}
              <div style={{ padding: '4mm', border: '1px solid #E5E7EB', borderRadius: 6, alignSelf: 'start' }}>
                {[
                  { label: 'Subtotal',       value: subtotal,       weight: 400, color: '#111827' },
                  { label: 'Discount',       value: -totalDiscount, weight: 400, color: '#10B981', prefix: '- ' },
                  { label: 'Taxable Amount', value: totalTaxable,   weight: 600, color: '#111827', sep: true },
                  { label: 'CGST',           value: totalGST / 2,   weight: 400, color: '#111827' },
                  { label: 'SGST',           value: totalGST / 2,   weight: 400, color: '#111827' },
                ].map((row, i) => (
                  <div key={i}>
                    {row.sep && <HR />}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3pt' }}>
                      <span style={{ fontSize: '8.5pt', color: '#6B7280', fontWeight: row.weight }}>{row.label}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '8.5pt', fontWeight: row.weight, color: row.color }}>
                        {row.prefix || ''}₹{fmt(Math.abs(row.value))}
                      </span>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: '2px solid #1E3A5F', margin: '4pt 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4pt 6pt', background: '#1E3A5F', borderRadius: 4, marginBottom: '4pt' }}>
                  <span style={{ fontSize: '10pt', fontWeight: 800, color: '#fff' }}>Grand Total</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '10pt', fontWeight: 900, color: '#fff' }}>₹{fmt(grandTotal)}</span>
                </div>
                {totalReceived > 0 && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2pt' }}>
                      <span style={{ fontSize: '8pt', color: '#6B7280' }}>Received</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '8pt', fontWeight: 700, color: '#10B981' }}>₹{fmt(totalReceived)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '8pt', color: '#6B7280' }}>Balance Due</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '8pt', fontWeight: 800, color: balance > 0 ? '#EF4444' : '#10B981' }}>₹{fmt(balance)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ── AMOUNT IN WORDS ── */}
            <div style={{ padding: '5pt 8pt', background: '#F8FAFF', border: '1px solid #DBEAFE', borderRadius: 4, marginBottom: '5mm' }}>
              <span style={{ fontSize: '7.5pt', color: '#6B7280', fontWeight: 600 }}>Amount in Words: </span>
              <span style={{ fontSize: '8pt', fontWeight: 700, color: '#1E3A5F', fontStyle: 'italic' }}>{numToWords(Math.round(grandTotal))}</span>
            </div>

            {/* ── BANK DETAILS + QR + SIGNATURE ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '5mm', marginBottom: '5mm', alignItems: 'start' }}>
              {/* Bank details */}
              <div>
                <p style={{ fontSize: '7pt', fontWeight: 700, color: '#1E3A5F', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4pt' }}>Bank Details</p>
                <div style={{ padding: '4mm', background: '#FAFAFA', border: '1px solid #E5E7EB', borderRadius: 6 }}>
                  {[
                    ['Bank Name',    'HDFC Bank Ltd'],
                    ['Branch',       'Baner, Pune'],
                    ['Account No.', '50200012345678'],
                    ['IFSC Code',   'HDFC0001234'],
                    ['Account Type','Current'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: '8pt', marginBottom: '2pt' }}>
                      <span style={{ fontSize: '7.5pt', color: '#6B7280', width: 80, flexShrink: 0 }}>{k}</span>
                      <span style={{ fontSize: '7.5pt', fontWeight: 700, fontFamily: 'monospace', color: '#111827' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Code */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '7pt', fontWeight: 700, color: '#1E3A5F', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4pt' }}>Scan to Pay</p>
                <div style={{ padding: 4, border: '1px solid #D1D5DB', borderRadius: 4, display: 'inline-block', background: '#fff' }}>
                  <QRPlaceholder size={80} />
                </div>
                <p style={{ fontSize: '6.5pt', color: '#6B7280', margin: '3pt 0 0' }}>UPI: billing@coldtech</p>
              </div>

              {/* Signature */}
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '7pt', fontWeight: 700, color: '#1E3A5F', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 24pt' }}>Authorised Signatory</p>
                <div style={{ borderTop: '1px solid #374151', paddingTop: '3pt', marginTop: '24pt' }}>
                  <p style={{ fontSize: '8pt', fontWeight: 700, color: '#111827', margin: '0 0 2pt' }}>COLDTECH Technologies</p>
                  <p style={{ fontSize: '7pt', color: '#6B7280', margin: 0 }}>Authorised Signatory</p>
                </div>
              </div>
            </div>

            <HR />

            {/* ── NOTES & TERMS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5mm', marginBottom: '4mm' }}>
              {form.notes && (
                <div>
                  <p style={{ fontSize: '7pt', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3pt' }}>Notes</p>
                  <p style={{ fontSize: '8pt', color: '#374151', margin: 0 }}>{form.notes}</p>
                </div>
              )}
              <div>
                <p style={{ fontSize: '7pt', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3pt' }}>Terms & Conditions</p>
                <p style={{ fontSize: '7.5pt', color: '#374151', margin: 0, lineHeight: 1.4 }}>{form.terms}</p>
              </div>
            </div>

            {/* ── FOOTER ── */}
            <div style={{ borderTop: '2px solid #1E3A5F', paddingTop: '4pt', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '7pt', color: '#6B7280', margin: 0 }}>Generated by COLDTECH CRM · {new Date().toLocaleDateString('en-IN')} · This is a computer-generated invoice.</p>
              <p style={{ fontSize: '7pt', color: '#1E3A5F', fontWeight: 700, margin: 0, fontFamily: 'monospace' }}>{form.serial}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
