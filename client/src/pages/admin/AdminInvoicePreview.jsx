import { useState } from 'react';
import { TallyInvoiceTemplate } from '../../components/TallyInvoiceTemplate';
import { FiEdit2 } from 'react-icons/fi';

export function AdminInvoicePreview() {
  const [showEditor, setShowEditor] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    company: {
      name: 'COLDTECH TECHNOLOGIES',
      address: 'Shop No. 12, IT Park, PCMC\nPune, Maharashtra - 410507',
      phone: '+91 9529882920',
      email: 'support@coldtechtechnologies.in',
      gstin: '27AAAAA0000A1Z5',
      logo: '/logo.png',
    },
    customer: {
      name: 'ABC Enterprises Pvt Ltd',
      address: 'Plot No. 45, Industrial Area\nMumbai, Maharashtra - 400001',
      gstin: '27BBBBB0000B1Z5',
    },
    invoice: {
      number: 'AINV-2024-0001',
      date: '2024-01-15',
      dueDate: '2024-01-30',
      paymentMode: 'Bank Transfer',
    },
    items: [
      { srNo: 1, name: 'Laptop Repair Service', hsnSac: '998314', qty: 2, rate: 5000, gstPercent: 18 },
      { srNo: 2, name: 'Data Recovery Service', hsnSac: '998315', qty: 1, rate: 10000, gstPercent: 18 },
      { srNo: 3, name: 'Software Installation', hsnSac: '998316', qty: 3, rate: 2000, gstPercent: 18 },
    ],
    gstType: 'intra',
    notes: 'Thank you for your business!',
    terms: 'Payment due within 15 days.\nGoods once sold will not be taken back.\nSubject to Pune jurisdiction.',
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoice Preview</h1>
          <p className="text-sm text-slate-500 mt-1">Tally-style GST invoice template</p>
        </div>
        <button
          onClick={() => setShowEditor(!showEditor)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition"
          style={{ background: "linear-gradient(135deg,#0EA5E9,#3AB6FF)" }}
        >
          <FiEdit2 className="w-4 h-4" />
          {showEditor ? 'Hide Editor' : 'Edit Data'}
        </button>
      </div>

      {showEditor && (
        <div className="bg-[#0D1220] border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Edit Invoice Data</h3>
          <p className="text-sm text-slate-400 mb-4">
            Modify the JSON below to customize the invoice. Changes will reflect immediately.
          </p>
          <textarea
            className="w-full h-96 rounded-xl border border-white/8 bg-[#0B0F1A] px-4 py-3 text-sm text-white font-mono resize-none focus:outline-none focus:border-[#3AB6FF] focus:ring-1 focus:ring-[#3AB6FF]/30 transition"
            value={JSON.stringify(invoiceData, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setInvoiceData(parsed);
              } catch (err) {
                // Invalid JSON, don't update
              }
            }}
          />
        </div>
      )}

      <TallyInvoiceTemplate invoiceData={invoiceData} />
    </div>
  );
}
