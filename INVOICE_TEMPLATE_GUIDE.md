# Tally-Style GST Invoice Template - Documentation

## Overview

A professional, printable GST invoice template built with React and Tailwind CSS, designed to match the classic Tally ERP invoice style.

## Features

✅ **Tally-Style Design**
- Black and white layout with grid borders
- Compact spacing (no large gaps)
- Table-based structure
- Monospace fonts for numeric alignment

✅ **GST Compliance**
- Supports both Intra-State (CGST + SGST) and Inter-State (IGST)
- HSN/SAC codes for items
- Automatic tax calculations
- GSTIN display for company and customer

✅ **Print-Ready**
- A4 size layout (210mm × 297mm)
- Print-friendly CSS with `@media print`
- Hides action buttons when printing
- No page breaks in middle of content

✅ **Professional Features**
- Company logo support
- Amount in words (Indian numbering system)
- Terms & conditions section
- Authorized signatory section
- Computer-generated invoice disclaimer

✅ **Interactive**
- Print button
- Download PDF button (uses browser's print-to-PDF)
- Live data editing (in preview page)

---

## File Structure

```
client/src/
├── components/
│   └── TallyInvoiceTemplate.jsx    # Main invoice component
└── pages/admin/
    └── AdminInvoicePreview.jsx     # Demo/preview page with editor
```

---

## Component Usage

### Basic Usage

```jsx
import { TallyInvoiceTemplate } from './components/TallyInvoiceTemplate';

function MyInvoicePage() {
  const invoiceData = {
    company: { /* ... */ },
    customer: { /* ... */ },
    invoice: { /* ... */ },
    items: [ /* ... */ ],
    gstType: 'intra',
    notes: 'Thank you!',
    terms: 'Payment due within 15 days.',
  };

  return <TallyInvoiceTemplate invoiceData={invoiceData} />;
}
```

---

## Data Structure

### Complete Invoice Data Schema

```javascript
{
  // Company Information
  company: {
    name: string,           // Company name
    address: string,        // Multi-line address (use \n for line breaks)
    phone: string,          // Contact number
    email: string,          // Email address
    gstin: string,          // GST Identification Number
    logo: string,           // Logo URL or path (optional)
  },

  // Customer Information
  customer: {
    name: string,           // Customer/Client name
    address: string,        // Multi-line address (use \n for line breaks)
    gstin: string,          // Customer's GSTIN
  },

  // Invoice Details
  invoice: {
    number: string,         // Invoice number (e.g., "AINV-2024-0001")
    date: string,           // Invoice date (ISO format: "2024-01-15")
    dueDate: string,        // Payment due date (ISO format)
    paymentMode: string,    // Payment method (e.g., "Bank Transfer", "Cash")
  },

  // Line Items
  items: [
    {
      srNo: number,         // Serial number
      name: string,         // Item/Service name
      hsnSac: string,       // HSN/SAC code
      qty: number,          // Quantity
      rate: number,         // Rate per unit
      gstPercent: number,   // GST percentage (e.g., 18)
    },
    // ... more items
  ],

  // GST Type
  gstType: 'intra' | 'inter',  // 'intra' for CGST+SGST, 'inter' for IGST

  // Additional Information
  notes: string,            // Optional notes (displayed at bottom)
  terms: string,            // Terms & conditions (multi-line, use \n)
}
```

---

## Invoice Layout Structure

### 1. Header Section
```
┌─────────────────────────────────────────────────┐
│  LOGO  │  COMPANY NAME                          │
│        │  Address, Phone, Email                 │
│        │  GSTIN: XXXXXXXXXXXX                   │
├─────────────────────────────────────────────────┤
│              TAX INVOICE                        │
├─────────────────────────────────────────────────┤
│  BILL TO:              │  Invoice No: XXXX      │
│  Customer Name         │  Invoice Date: XX/XX   │
│  Address               │  Due Date: XX/XX       │
│  GSTIN: XXXX           │  Payment Mode: XXXX    │
└─────────────────────────────────────────────────┘
```

### 2. Items Table
```
┌────┬──────────────┬─────────┬─────┬────────┬──────┬──────────┐
│ Sr │ Description  │ HSN/SAC │ Qty │ Rate   │ GST% │ Amount   │
├────┼──────────────┼─────────┼─────┼────────┼──────┼──────────┤
│ 1  │ Item 1       │ 998314  │  2  │ 5000   │ 18%  │ 10000.00 │
│ 2  │ Item 2       │ 998315  │  1  │ 10000  │ 18%  │ 10000.00 │
└────┴──────────────┴─────────┴─────┴────────┴──────┴──────────┘
```

### 3. Tax Calculation
```
┌─────────────────────────┬──────────────────────┐
│ Amount in Words:        │ Subtotal:  20000.00  │
│ Twenty Thousand Rupees  │ CGST (9%):  1800.00  │
│ Only                    │ SGST (9%):  1800.00  │
│                         │ GRAND TOTAL: 23600.00│
└─────────────────────────┴──────────────────────┘
```

### 4. Footer
```
┌─────────────────────────┬──────────────────────┐
│ Terms & Conditions:     │ For COMPANY NAME     │
│ - Payment due in 15 days│                      │
│ - No returns            │ [Signature Space]    │
│                         │ Authorized Signatory │
└─────────────────────────┴──────────────────────┘
```

---

## Key Features Explained

### 1. Number to Words Conversion

The template includes a built-in function to convert numbers to Indian words:

```javascript
numberToWords(23600)
// Output: "Twenty Three Thousand Six Hundred"
```

Supports:
- Ones, Tens, Hundreds
- Thousands, Lakhs, Crores
- Paise (decimal values)

### 2. GST Calculation

**Intra-State (Same State)**:
```
Subtotal: ₹20,000
CGST (9%): ₹1,800
SGST (9%): ₹1,800
Total: ₹23,600
```

**Inter-State (Different State)**:
```
Subtotal: ₹20,000
IGST (18%): ₹3,600
Total: ₹23,600
```

### 3. Print Functionality

The template uses browser's native print dialog:

```javascript
const handlePrint = () => {
  window.print();
};
```

**Print CSS**:
- Sets page size to A4
- Removes margins
- Hides action buttons
- Ensures colors print correctly

### 4. Responsive Design

- Desktop: Full width with shadow
- Print: Removes shadow, uses full page
- Mobile: Scrollable (not optimized for mobile printing)

---

## Customization Guide

### Change Colors

To add colors (currently black & white):

```jsx
// In TallyInvoiceTemplate.jsx
<div className="bg-blue-100">  // Add background color
<th className="text-blue-600">  // Add text color
```

### Modify Table Columns

To add/remove columns:

1. Update table header:
```jsx
<th className="border-r border-black p-2">New Column</th>
```

2. Update table rows:
```jsx
<td className="border-r border-black p-2">{item.newField}</td>
```

3. Update data structure to include new field

### Change Font

To use different fonts:

```jsx
// Add to className
className="font-mono"  // Monospace
className="font-sans"  // Sans-serif
className="font-serif" // Serif
```

### Adjust Spacing

```jsx
// Padding
className="p-2"  // Small
className="p-4"  // Medium
className="p-6"  // Large

// Margins
className="mb-2" // Bottom margin
className="mt-4" // Top margin
```

---

## Integration with Accounting System

### Fetch Invoice Data from API

```jsx
import { useEffect, useState } from 'react';
import { accountingApi } from '../services/api';
import { TallyInvoiceTemplate } from '../components/TallyInvoiceTemplate';

function InvoiceView({ invoiceId }) {
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    accountingApi.getInvoice(invoiceId).then(res => {
      const inv = res.data.invoice;
      
      // Transform API data to template format
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
        notes: inv.notes,
        terms: 'Payment due within 15 days.',
      };

      setInvoiceData(templateData);
    });
  }, [invoiceId]);

  if (!invoiceData) return <div>Loading...</div>;

  return <TallyInvoiceTemplate invoiceData={invoiceData} />;
}
```

---

## Print Settings

### Recommended Browser Print Settings

1. **Paper Size**: A4
2. **Margins**: None (or Minimum)
3. **Scale**: 100%
4. **Background Graphics**: Enabled (for borders and shading)
5. **Headers/Footers**: Disabled

### Save as PDF

1. Click "Print Invoice" or "Download PDF"
2. In print dialog, select "Save as PDF" as destination
3. Click "Save"

---

## Troubleshooting

### Issue: Borders not printing
**Solution**: Enable "Background graphics" in print settings

### Issue: Page breaks in middle of table
**Solution**: Reduce number of items or adjust padding

### Issue: Logo not showing
**Solution**: Use absolute URL or ensure logo path is correct

### Issue: Colors not printing
**Solution**: Check print-color-adjust CSS property is set to `exact`

### Issue: Layout breaks on different browsers
**Solution**: Test on Chrome/Edge (best print support)

---

## Browser Compatibility

| Browser | Print Support | PDF Export | Notes |
|---------|---------------|------------|-------|
| Chrome  | ✅ Excellent  | ✅ Yes     | Best support |
| Edge    | ✅ Excellent  | ✅ Yes     | Chromium-based |
| Firefox | ✅ Good       | ✅ Yes     | Minor CSS differences |
| Safari  | ⚠️ Fair       | ✅ Yes     | Some border issues |

---

## Sample Data

### Minimal Example

```javascript
const minimalInvoice = {
  company: {
    name: 'My Company',
    address: 'Address Line 1\nCity, State - 123456',
    phone: '+91 1234567890',
    email: 'info@company.com',
    gstin: '27AAAAA0000A1Z5',
  },
  customer: {
    name: 'Customer Name',
    address: 'Customer Address',
    gstin: '27BBBBB0000B1Z5',
  },
  invoice: {
    number: 'INV-001',
    date: '2024-01-15',
    dueDate: '2024-01-30',
    paymentMode: 'Cash',
  },
  items: [
    { srNo: 1, name: 'Service', hsnSac: '998314', qty: 1, rate: 1000, gstPercent: 18 },
  ],
  gstType: 'intra',
  notes: 'Thank you!',
  terms: 'Payment due within 15 days.',
};
```

---

## Best Practices

1. **Always validate data** before passing to template
2. **Use consistent date formats** (ISO 8601)
3. **Keep item descriptions concise** (max 50 characters)
4. **Test print preview** before finalizing
5. **Store invoice PDFs** for records
6. **Include all mandatory GST fields**
7. **Use proper HSN/SAC codes**
8. **Maintain sequential invoice numbers**

---

## Future Enhancements

Possible improvements:
- [ ] Multi-page support for many items
- [ ] QR code for UPI payments
- [ ] Barcode for invoice number
- [ ] Multiple currency support
- [ ] Watermark for draft invoices
- [ ] Digital signature support
- [ ] Email invoice functionality
- [ ] Batch printing multiple invoices

---

## Support

For issues or questions:
- Check browser console for errors
- Verify data structure matches schema
- Test with sample data first
- Ensure all required fields are provided

---

## License

Part of Coldtech Technologies accounting system.

**Built with ❤️ using React + Tailwind CSS**
