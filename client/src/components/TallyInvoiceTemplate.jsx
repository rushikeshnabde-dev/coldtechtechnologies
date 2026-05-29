import { useRef } from 'react';
import { FiPrinter, FiDownload } from 'react-icons/fi';

// Helper function to convert number to words (Indian system)
function numberToWords(num) {
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  function convertLessThanThousand(n) {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
  }
  
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;
  
  let result = '';
  if (crore > 0) result += convertLessThanThousand(crore) + ' Crore ';
  if (lakh > 0) result += convertLessThanThousand(lakh) + ' Lakh ';
  if (thousand > 0) result += convertLessThanThousand(thousand) + ' Thousand ';
  if (remainder > 0) result += convertLessThanThousand(remainder);
  
  return result.trim();
}

export function TallyInvoiceTemplate({ invoiceData }) {
  const printRef = useRef();

  // Default sample data if none provided
  const data = invoiceData || {
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
    gstType: 'intra', // 'intra' for CGST+SGST, 'inter' for IGST
    notes: 'Thank you for your business!',
    terms: 'Payment due within 15 days.\nGoods once sold will not be taken back.\nSubject to Pune jurisdiction.',
  };

  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;
    const processedItems = data.items.map(item => {
      const amount = item.qty * item.rate;
      const gstAmount = (amount * item.gstPercent) / 100;
      subtotal += amount;
      return { ...item, amount, gstAmount };
    });

    const totalGst = processedItems.reduce((sum, item) => sum + item.gstAmount, 0);
    const cgst = data.gstType === 'intra' ? totalGst / 2 : 0;
    const sgst = data.gstType === 'intra' ? totalGst / 2 : 0;
    const igst = data.gstType === 'inter' ? totalGst : 0;
    const grandTotal = subtotal + totalGst;

    return { processedItems, subtotal, cgst, sgst, igst, totalGst, grandTotal };
  };

  const { processedItems, subtotal, cgst, sgst, igst, grandTotal } = calculateTotals();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print(); // Browser's print dialog allows "Save as PDF"
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 print:p-0 print:bg-white">
      {/* Action Buttons - Hidden on print */}
      <div className="max-w-[210mm] mx-auto mb-4 flex gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FiPrinter className="w-4 h-4" />
          Print Invoice
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <FiDownload className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      {/* Invoice Container - A4 Size */}
      <div
        ref={printRef}
        className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none print:max-w-full"
        style={{ minHeight: '297mm' }}
      >
        {/* Invoice Content */}
        <div className="p-8 print:p-6">
          {/* Header Section */}
          <div className="border-2 border-black mb-3">
            <div className="grid grid-cols-12 border-b-2 border-black">
              {/* Logo */}
              <div className="col-span-3 border-r-2 border-black p-3 flex items-center justify-center">
                {data.company.logo ? (
                  <img src={data.company.logo} alt="Logo" className="max-h-16 max-w-full object-contain" />
                ) : (
                  <div className="text-2xl font-bold">LOGO</div>
                )}
              </div>
              
              {/* Company Details */}
              <div className="col-span-9 p-3">
                <h1 className="text-xl font-bold mb-1">{data.company.name}</h1>
                <p className="text-xs whitespace-pre-line mb-1">{data.company.address}</p>
                <p className="text-xs">Phone: {data.company.phone} | Email: {data.company.email}</p>
                <p className="text-xs font-semibold mt-1">GSTIN: {data.company.gstin}</p>
              </div>
            </div>

            {/* Tax Invoice Title */}
            <div className="text-center py-2 border-b-2 border-black bg-gray-100 print:bg-gray-200">
              <h2 className="text-lg font-bold">TAX INVOICE</h2>
            </div>

            {/* Customer and Invoice Info */}
            <div className="grid grid-cols-2">
              {/* Customer Details */}
              <div className="border-r-2 border-black p-3">
                <p className="text-xs font-bold mb-2 underline">BILL TO:</p>
                <p className="text-sm font-semibold mb-1">{data.customer.name}</p>
                <p className="text-xs whitespace-pre-line mb-1">{data.customer.address}</p>
                <p className="text-xs"><span className="font-semibold">GSTIN:</span> {data.customer.gstin}</p>
              </div>

              {/* Invoice Details */}
              <div className="p-3">
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="py-1 font-semibold">Invoice No:</td>
                      <td className="py-1 text-right font-mono">{data.invoice.number}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-1 font-semibold">Invoice Date:</td>
                      <td className="py-1 text-right">{new Date(data.invoice.date).toLocaleDateString('en-IN')}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-1 font-semibold">Due Date:</td>
                      <td className="py-1 text-right">{new Date(data.invoice.dueDate).toLocaleDateString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-semibold">Payment Mode:</td>
                      <td className="py-1 text-right">{data.invoice.paymentMode}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border-2 border-black mb-3">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-100 print:bg-gray-200 border-b-2 border-black">
                  <th className="border-r border-black p-2 text-center w-12">Sr</th>
                  <th className="border-r border-black p-2 text-left">Item Description</th>
                  <th className="border-r border-black p-2 text-center w-20">HSN/SAC</th>
                  <th className="border-r border-black p-2 text-center w-16">Qty</th>
                  <th className="border-r border-black p-2 text-right w-24">Rate (₹)</th>
                  <th className="border-r border-black p-2 text-center w-16">GST %</th>
                  <th className="p-2 text-right w-28">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {processedItems.map((item, index) => (
                  <tr key={index} className="border-b border-black">
                    <td className="border-r border-black p-2 text-center">{item.srNo}</td>
                    <td className="border-r border-black p-2">{item.name}</td>
                    <td className="border-r border-black p-2 text-center font-mono">{item.hsnSac}</td>
                    <td className="border-r border-black p-2 text-center">{item.qty}</td>
                    <td className="border-r border-black p-2 text-right font-mono">{item.rate.toFixed(2)}</td>
                    <td className="border-r border-black p-2 text-center">{item.gstPercent}%</td>
                    <td className="p-2 text-right font-mono font-semibold">{item.amount.toFixed(2)}</td>
                  </tr>
                ))}
                
                {/* Empty rows for spacing (minimum 5 rows) */}
                {[...Array(Math.max(0, 5 - processedItems.length))].map((_, i) => (
                  <tr key={`empty-${i}`} className="border-b border-black">
                    <td className="border-r border-black p-2 text-center">&nbsp;</td>
                    <td className="border-r border-black p-2">&nbsp;</td>
                    <td className="border-r border-black p-2">&nbsp;</td>
                    <td className="border-r border-black p-2">&nbsp;</td>
                    <td className="border-r border-black p-2">&nbsp;</td>
                    <td className="border-r border-black p-2">&nbsp;</td>
                    <td className="p-2">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Calculation Section */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Amount in Words */}
            <div className="border-2 border-black p-3">
              <p className="text-xs font-bold mb-1">Amount in Words:</p>
              <p className="text-sm font-semibold">
                {numberToWords(Math.floor(grandTotal))} Rupees {grandTotal % 1 !== 0 ? `and ${Math.round((grandTotal % 1) * 100)} Paise` : ''} Only
              </p>
            </div>

            {/* Tax Summary */}
            <div className="border-2 border-black">
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="p-2 font-semibold">Subtotal:</td>
                    <td className="p-2 text-right font-mono">₹ {subtotal.toFixed(2)}</td>
                  </tr>
                  {data.gstType === 'intra' ? (
                    <>
                      <tr className="border-b border-black">
                        <td className="p-2 font-semibold">CGST (9%):</td>
                        <td className="p-2 text-right font-mono">₹ {cgst.toFixed(2)}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 font-semibold">SGST (9%):</td>
                        <td className="p-2 text-right font-mono">₹ {sgst.toFixed(2)}</td>
                      </tr>
                    </>
                  ) : (
                    <tr className="border-b border-black">
                      <td className="p-2 font-semibold">IGST (18%):</td>
                      <td className="p-2 text-right font-mono">₹ {igst.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="bg-gray-100 print:bg-gray-200 border-t-2 border-black">
                    <td className="p-2 font-bold text-base">GRAND TOTAL:</td>
                    <td className="p-2 text-right font-mono font-bold text-base">₹ {grandTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Terms and Signature */}
          <div className="grid grid-cols-2 gap-3">
            {/* Terms & Conditions */}
            <div className="border-2 border-black p-3">
              <p className="text-xs font-bold mb-2 underline">Terms & Conditions:</p>
              <p className="text-xs whitespace-pre-line">{data.terms}</p>
            </div>

            {/* Signature */}
            <div className="border-2 border-black p-3">
              <p className="text-xs font-bold mb-1">For {data.company.name}</p>
              <div className="h-16 mb-1"></div>
              <p className="text-xs font-semibold border-t border-black pt-1">Authorized Signatory</p>
            </div>
          </div>

          {/* Footer Note */}
          {data.notes && (
            <div className="mt-3 border-2 border-black p-2">
              <p className="text-xs text-center italic">{data.notes}</p>
            </div>
          )}

          {/* Computer Generated Invoice */}
          <div className="mt-2 text-center">
            <p className="text-[10px] text-gray-600">This is a computer generated invoice and does not require a signature.</p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
