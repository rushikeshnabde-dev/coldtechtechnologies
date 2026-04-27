# Invoice Template - Usage Examples

## Quick Examples

### Example 1: Simple Service Invoice

```javascript
const serviceInvoice = {
  company: {
    name: 'COLDTECH TECHNOLOGIES',
    address: 'Shop No. 12, IT Park, PCMC\nPune, Maharashtra - 410507',
    phone: '+91 9529882920',
    email: 'support@coldtechtechnologies.in',
    gstin: '27AAAAA0000A1Z5',
    logo: '/logo.png',
  },
  customer: {
    name: 'Tech Solutions Pvt Ltd',
    address: 'Office 301, Business Tower\nMumbai, Maharashtra - 400001',
    gstin: '27BBBBB0000B1Z5',
  },
  invoice: {
    number: 'AINV-2024-0001',
    date: '2024-01-15',
    dueDate: '2024-01-30',
    paymentMode: 'Bank Transfer',
  },
  items: [
    {
      srNo: 1,
      name: 'Computer Repair Service',
      hsnSac: '998314',
      qty: 1,
      rate: 5000,
      gstPercent: 18
    },
  ],
  gstType: 'intra',
  notes: 'Thank you for your business!',
  terms: 'Payment due within 15 days.\nGoods once sold will not be taken back.',
};
```

**Output**:
- Subtotal: ₹5,000
- CGST (9%): ₹450
- SGST (9%): ₹450
- Grand Total: ₹5,900

---

### Example 2: Multiple Items Invoice

```javascript
const multiItemInvoice = {
  company: {
    name: 'COLDTECH TECHNOLOGIES',
    address: 'Shop No. 12, IT Park, PCMC\nPune, Maharashtra - 410507',
    phone: '+91 9529882920',
    email: 'support@coldtechtechnologies.in',
    gstin: '27AAAAA0000A1Z5',
  },
  customer: {
    name: 'ABC Enterprises',
    address: 'Plot 45, Industrial Area\nPune, Maharashtra - 411001',
    gstin: '27CCCCC0000C1Z5',
  },
  invoice: {
    number: 'AINV-2024-0002',
    date: '2024-01-16',
    dueDate: '2024-02-15',
    paymentMode: 'UPI',
  },
  items: [
    {
      srNo: 1,
      name: 'Laptop Repair',
      hsnSac: '998314',
      qty: 2,
      rate: 5000,
      gstPercent: 18
    },
    {
      srNo: 2,
      name: 'Data Recovery',
      hsnSac: '998315',
      qty: 1,
      rate: 10000,
      gstPercent: 18
    },
    {
      srNo: 3,
      name: 'Software Installation',
      hsnSac: '998316',
      qty: 3,
      rate: 2000,
      gstPercent: 18
    },
  ],
  gstType: 'intra',
  notes: 'All services completed successfully.',
  terms: 'Payment due within 30 days.\nWarranty: 90 days on all repairs.',
};
```

**Output**:
- Subtotal: ₹26,000
- CGST (9%): ₹2,340
- SGST (9%): ₹2,340
- Grand Total: ₹30,680

---

### Example 3: Inter-State Invoice (IGST)

```javascript
const interStateInvoice = {
  company: {
    name: 'COLDTECH TECHNOLOGIES',
    address: 'Shop No. 12, IT Park, PCMC\nPune, Maharashtra - 410507',
    phone: '+91 9529882920',
    email: 'support@coldtechtechnologies.in',
    gstin: '27AAAAA0000A1Z5',
  },
  customer: {
    name: 'Delhi Tech Solutions',
    address: 'Sector 18, Noida\nDelhi - 110001',
    gstin: '07DDDDD0000D1Z5',  // Different state code (07 = Delhi)
  },
  invoice: {
    number: 'AINV-2024-0003',
    date: '2024-01-17',
    dueDate: '2024-02-01',
    paymentMode: 'Cheque',
  },
  items: [
    {
      srNo: 1,
      name: 'Network Setup Service',
      hsnSac: '998317',
      qty: 1,
      rate: 15000,
      gstPercent: 18
    },
  ],
  gstType: 'inter',  // IGST for inter-state
  notes: 'Remote service provided.',
  terms: 'Payment due within 15 days.\nService warranty: 6 months.',
};
```

**Output**:
- Subtotal: ₹15,000
- IGST (18%): ₹2,700
- Grand Total: ₹17,700

---

### Example 4: Different GST Rates

```javascript
const mixedGstInvoice = {
  company: {
    name: 'COLDTECH TECHNOLOGIES',
    address: 'Shop No. 12, IT Park, PCMC\nPune, Maharashtra - 410507',
    phone: '+91 9529882920',
    email: 'support@coldtechtechnologies.in',
    gstin: '27AAAAA0000A1Z5',
  },
  customer: {
    name: 'Retail Store Pvt Ltd',
    address: 'Shop 12, Market Road\nPune, Maharashtra - 411002',
    gstin: '27EEEEE0000E1Z5',
  },
  invoice: {
    number: 'AINV-2024-0004',
    date: '2024-01-18',
    dueDate: '2024-02-02',
    paymentMode: 'Cash',
  },
  items: [
    {
      srNo: 1,
      name: 'Computer Mouse',
      hsnSac: '8471',
      qty: 5,
      rate: 500,
      gstPercent: 18  // 18% GST
    },
    {
      srNo: 2,
      name: 'Keyboard',
      hsnSac: '8471',
      qty: 3,
      rate: 1000,
      gstPercent: 18  // 18% GST
    },
    {
      srNo: 3,
      name: 'Printed Manual',
      hsnSac: '4901',
      qty: 10,
      rate: 100,
      gstPercent: 12  // 12% GST (books/printed material)
    },
  ],
  gstType: 'intra',
  notes: 'Bulk order discount applied.',
  terms: 'Payment due on delivery.\nNo returns on opened items.',
};
```

**Output**:
- Item 1: ₹2,500 + ₹450 GST = ₹2,950
- Item 2: ₹3,000 + ₹540 GST = ₹3,540
- Item 3: ₹1,000 + ₹120 GST = ₹1,120
- Grand Total: ₹7,610

---

### Example 5: Zero GST Items

```javascript
const zeroGstInvoice = {
  company: {
    name: 'COLDTECH TECHNOLOGIES',
    address: 'Shop No. 12, IT Park, PCMC\nPune, Maharashtra - 410507',
    phone: '+91 9529882920',
    email: 'support@coldtechtechnologies.in',
    gstin: '27AAAAA0000A1Z5',
  },
  customer: {
    name: 'Educational Institute',
    address: 'Campus Road\nPune, Maharashtra - 411003',
    gstin: '27FFFFF0000F1Z5',
  },
  invoice: {
    number: 'AINV-2024-0005',
    date: '2024-01-19',
    dueDate: '2024-02-03',
    paymentMode: 'Bank Transfer',
  },
  items: [
    {
      srNo: 1,
      name: 'Educational Software License',
      hsnSac: '998319',
      qty: 10,
      rate: 1000,
      gstPercent: 0  // Exempt from GST
    },
  ],
  gstType: 'intra',
  notes: 'Educational discount applied.',
  terms: 'Payment due within 30 days.\nLicense valid for 1 year.',
};
```

**Output**:
- Subtotal: ₹10,000
- CGST (0%): ₹0
- SGST (0%): ₹0
- Grand Total: ₹10,000

---

## Integration Examples

### Example 6: Fetch from API and Display

```jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { accountingApi } from '../services/api';
import { TallyInvoiceTemplate } from '../components/TallyInvoiceTemplate';

function InvoiceViewPage() {
  const { invoiceId } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInvoice() {
      try {
        const { data } = await accountingApi.getInvoice(invoiceId);
        const inv = data.invoice;

        // Transform API response to template format
        const templateData = {
          company: inv.company,
          customer: {
            name: inv.partyId.name,
            address: inv.partyId.address,
            gstin: inv.partyId.gstin,
          },
          invoice: {
            number: inv.invoiceNumber,
            date: inv.date,
            dueDate: inv.dueDate,
            paymentMode: 'Bank Transfer',
          },
          items: inv.items.map((item, idx) => ({
            srNo: idx + 1,
            name: item.name,
            hsnSac: item.hsnSac,
            qty: item.qty,
            rate: item.rate,
            gstPercent: item.gstPercent,
          })),
          gstType: inv.gstType,
          notes: inv.notes || 'Thank you for your business!',
          terms: 'Payment due within 15 days.\nGoods once sold will not be taken back.',
        };

        setInvoiceData(templateData);
      } catch (error) {
        console.error('Failed to load invoice:', error);
      } finally {
        setLoading(false);
      }
    }

    loadInvoice();
  }, [invoiceId]);

  if (loading) {
    return <div className="flex justify-center py-20">Loading...</div>;
  }

  if (!invoiceData) {
    return <div className="text-center py-20">Invoice not found</div>;
  }

  return <TallyInvoiceTemplate invoiceData={invoiceData} />;
}
```

---

### Example 7: Generate Invoice from Form Data

```jsx
import { useState } from 'react';
import { TallyInvoiceTemplate } from '../components/TallyInvoiceTemplate';

function CreateInvoicePage() {
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    items: [{ name: '', qty: 1, rate: 0, gstPercent: 18 }],
  });

  const generateInvoiceData = () => {
    return {
      company: {
        name: 'COLDTECH TECHNOLOGIES',
        address: 'Shop No. 12, IT Park, PCMC\nPune, Maharashtra - 410507',
        phone: '+91 9529882920',
        email: 'support@coldtechtechnologies.in',
        gstin: '27AAAAA0000A1Z5',
      },
      customer: {
        name: formData.customerName,
        address: formData.customerAddress,
        gstin: formData.customerGstin,
      },
      invoice: {
        number: `AINV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentMode: formData.paymentMode || 'Bank Transfer',
      },
      items: formData.items.map((item, idx) => ({
        srNo: idx + 1,
        name: item.name,
        hsnSac: item.hsnSac || '998314',
        qty: item.qty,
        rate: item.rate,
        gstPercent: item.gstPercent,
      })),
      gstType: 'intra',
      notes: 'Thank you for your business!',
      terms: 'Payment due within 15 days.',
    };
  };

  return (
    <div>
      {!showPreview ? (
        <div>
          {/* Form to collect invoice data */}
          <button onClick={() => setShowPreview(true)}>
            Preview Invoice
          </button>
        </div>
      ) : (
        <TallyInvoiceTemplate invoiceData={generateInvoiceData()} />
      )}
    </div>
  );
}
```

---

### Example 8: Batch Print Multiple Invoices

```jsx
import { TallyInvoiceTemplate } from '../components/TallyInvoiceTemplate';

function BatchPrintInvoices({ invoiceIds }) {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    // Load all invoices
    Promise.all(
      invoiceIds.map(id => accountingApi.getInvoice(id))
    ).then(responses => {
      const invoiceDataArray = responses.map(res => {
        // Transform each invoice...
        return transformedData;
      });
      setInvoices(invoiceDataArray);
    });
  }, [invoiceIds]);

  return (
    <div>
      {invoices.map((invoiceData, idx) => (
        <div key={idx} className="page-break-after">
          <TallyInvoiceTemplate invoiceData={invoiceData} />
        </div>
      ))}
      
      <style jsx>{`
        @media print {
          .page-break-after {
            page-break-after: always;
          }
        }
      `}</style>
    </div>
  );
}
```

---

## Common Patterns

### Pattern 1: Add Watermark for Draft Invoices

```jsx
function DraftInvoice({ invoiceData }) {
  return (
    <div className="relative">
      {invoiceData.invoice.status === 'draft' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-9xl font-bold text-red-500 opacity-10 rotate-[-45deg]">
            DRAFT
          </div>
        </div>
      )}
      <TallyInvoiceTemplate invoiceData={invoiceData} />
    </div>
  );
}
```

### Pattern 2: Add QR Code for Payment

```jsx
import QRCode from 'qrcode.react';

function InvoiceWithQR({ invoiceData }) {
  const upiString = `upi://pay?pa=merchant@upi&pn=COLDTECH&am=${invoiceData.grandTotal}&cu=INR`;
  
  return (
    <div>
      <TallyInvoiceTemplate invoiceData={invoiceData} />
      <div className="text-center mt-4 print:block">
        <p className="text-sm mb-2">Scan to Pay via UPI</p>
        <QRCode value={upiString} size={128} />
      </div>
    </div>
  );
}
```

### Pattern 3: Email Invoice as PDF

```jsx
async function emailInvoice(invoiceData, recipientEmail) {
  // Generate PDF using browser's print-to-PDF
  // Then send via email API
  
  const response = await fetch('/api/send-invoice-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: recipientEmail,
      invoiceData: invoiceData,
    }),
  });
  
  return response.json();
}
```

---

## Tips & Tricks

### Tip 1: Customize for Different Business Types

**For Retail**:
- Add barcode column
- Include product codes
- Show MRP and discount

**For Services**:
- Add service date/time
- Include technician name
- Show hourly rates

**For Manufacturing**:
- Add batch numbers
- Include manufacturing date
- Show warranty period

### Tip 2: Multi-Language Support

```javascript
const invoiceData = {
  // ... other fields
  language: 'hi', // Hindi
  translations: {
    taxInvoice: 'कर चालान',
    billTo: 'बिल प्राप्तकर्ता',
    // ... more translations
  },
};
```

### Tip 3: Add Payment Status Badge

```jsx
function InvoiceWithStatus({ invoiceData, paymentStatus }) {
  return (
    <div className="relative">
      {paymentStatus === 'paid' && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg font-bold">
          PAID
        </div>
      )}
      <TallyInvoiceTemplate invoiceData={invoiceData} />
    </div>
  );
}
```

---

## Testing Data

Use this data for testing:

```javascript
export const TEST_INVOICES = {
  minimal: { /* Example 1 */ },
  multiItem: { /* Example 2 */ },
  interState: { /* Example 3 */ },
  mixedGst: { /* Example 4 */ },
  zeroGst: { /* Example 5 */ },
};

// Usage
<TallyInvoiceTemplate invoiceData={TEST_INVOICES.minimal} />
```

---

## Validation

Before passing data to template, validate:

```javascript
function validateInvoiceData(data) {
  const errors = [];
  
  if (!data.company?.name) errors.push('Company name required');
  if (!data.customer?.name) errors.push('Customer name required');
  if (!data.invoice?.number) errors.push('Invoice number required');
  if (!data.items?.length) errors.push('At least one item required');
  
  data.items?.forEach((item, idx) => {
    if (!item.name) errors.push(`Item ${idx + 1}: name required`);
    if (item.qty <= 0) errors.push(`Item ${idx + 1}: quantity must be > 0`);
    if (item.rate < 0) errors.push(`Item ${idx + 1}: rate must be >= 0`);
  });
  
  return errors;
}

// Usage
const errors = validateInvoiceData(invoiceData);
if (errors.length > 0) {
  console.error('Validation errors:', errors);
  return;
}
```

---

Happy Invoicing! 🎉
