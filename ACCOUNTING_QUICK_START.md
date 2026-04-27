# Accounting System - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Start the Application

```bash
# Terminal 1 - Start Backend
cd server
npm install
npm run dev

# Terminal 2 - Start Frontend
cd client
npm install
npm run dev
```

### Step 2: Login as Admin

Navigate to: `http://localhost:5173/login`

Use admin credentials (check your `.env` or bootstrap.js for default admin)

### Step 3: Access Accounting Panel

Click on the sidebar menu and scroll down to the **"Accounting"** section:
- Parties
- Ledgers
- Acc. Products
- Acc. Invoices
- Payments
- Reports

---

## 📋 First-Time Setup Checklist

### ✅ 1. Seed Default Ledgers (REQUIRED)

**Path**: Accounting → Ledgers

Click **"Seed Defaults"** button to create:
- ✓ Sales (Income)
- ✓ Purchase (Expense)
- ✓ Cash (Asset)
- ✓ Bank (Asset)
- ✓ CGST (Liability)
- ✓ SGST (Liability)
- ✓ IGST (Liability)

**Why?** These are required for invoice posting to work.

---

### ✅ 2. Add Your First Customer

**Path**: Accounting → Parties

Click **"Add Party"** and fill:
- Name: "ABC Company"
- Type: Customer
- Phone: +91 9876543210
- Email: abc@example.com
- GSTIN: 27AAAAA0000A1Z5 (optional)

**Result**: A customer ledger is auto-created.

---

### ✅ 3. Add Your First Product

**Path**: Accounting → Acc. Products

Click **"Add Product"** and fill:
- Name: "Laptop Repair Service"
- Price: 5000
- GST %: 18%
- HSN/SAC: 998314

---

### ✅ 4. Create Your First Invoice

**Path**: Accounting → Acc. Invoices

Click **"Create Invoice"**:

1. Select customer: "ABC Company"
2. GST Type: Intra-State (CGST+SGST)
3. Add item:
   - Select product: "Laptop Repair Service"
   - Quantity: 1
   - (Rate auto-fills to 5000)
4. Status: **Posted** (important!)
5. Click **"Create Invoice"**

**Result**: 
- Invoice created with number AINV-2024-0001
- Accounting entries posted automatically:
  ```
  Debit:  ABC Company Ledger    ₹5,900
  Credit: Sales                 ₹5,000
  Credit: CGST                  ₹450
  Credit: SGST                  ₹450
  ```

---

### ✅ 5. Record a Payment

**Path**: Accounting → Payments

Click **"Record Payment"**:

1. Select invoice: AINV-2024-0001
2. Amount: 5900
3. Mode: Cash
4. Click **"Record Payment"**

**Result**:
- Payment recorded with number PAY-2024-0001
- Invoice status changed to "Paid"
- Accounting entries:
  ```
  Debit:  Cash                  ₹5,900
  Credit: ABC Company Ledger    ₹5,900
  ```

---

### ✅ 6. View Reports

**Path**: Accounting → Reports

#### Dashboard Tab
See overview:
- Total invoices: 1
- Month revenue: ₹5,900
- Cash balance: ₹5,900

#### Ledger Report Tab
1. Select ledger: "Cash"
2. Click "Generate"
3. See all cash transactions with running balance

#### Profit & Loss Tab
1. Click "Generate"
2. See:
   - Income: ₹5,000 (Sales)
   - Expense: ₹0
   - Net Profit: ₹5,000

#### GST Summary Tab
1. Click "Generate"
2. See:
   - CGST Collected: ₹450
   - SGST Collected: ₹450
   - Net GST Liability: ₹900

---

## 🎯 Common Workflows

### Creating an Inter-State Invoice (IGST)

1. Create invoice
2. Select GST Type: **Inter-State (IGST)**
3. Add items
4. Post invoice

**Result**: GST is calculated as IGST (not split into CGST+SGST)

---

### Editing a Posted Invoice

1. Click edit on invoice
2. Make changes
3. Save

**Behind the scenes**:
- Old accounting entries are reversed
- New entries are posted
- Invoice gets new voucherRef

---

### Cancelling an Invoice

1. Click cancel (X icon) on posted invoice
2. Confirm

**Result**:
- Status changed to "Cancelled"
- All accounting entries reversed
- Balance restored

---

### Partial Payment

1. Record payment with amount less than invoice total
2. Invoice status changes to "Partial"
3. Balance field shows remaining amount

---

## 🔍 Understanding the System

### Invoice Status Flow

```
Draft → Posted → Partial → Paid
         ↓
      Cancelled
```

- **Draft**: No accounting impact, can edit/delete freely
- **Posted**: Accounting entries created, can edit (reverses old entries)
- **Partial**: Some payment received
- **Paid**: Fully paid
- **Cancelled**: Reversed, cannot edit

---

### Ledger Types

| Type      | Debit      | Credit     | Examples           |
|-----------|------------|------------|--------------------|
| Asset     | Increases  | Decreases  | Cash, Bank         |
| Liability | Decreases  | Increases  | CGST, SGST, IGST   |
| Income    | Decreases  | Increases  | Sales              |
| Expense   | Increases  | Decreases  | Purchase, Rent     |

---

### GST Calculation

**Intra-State (Same state)**:
- CGST = (Taxable × GST%) / 2
- SGST = (Taxable × GST%) / 2

**Inter-State (Different state)**:
- IGST = Taxable × GST%

**Example**: ₹5,000 @ 18% GST
- Intra: CGST ₹450 + SGST ₹450 = ₹900
- Inter: IGST ₹900

---

## 🐛 Troubleshooting

### "Sales ledger not found" error
**Solution**: Go to Ledgers page and click "Seed Defaults"

### Invoice not posting
**Check**:
1. Customer selected?
2. At least one item added?
3. Status set to "Posted"?

### Payment not recording
**Check**:
1. Invoice status is "Posted" (not Draft)?
2. Invoice has outstanding balance?
3. Payment amount > 0?

### Ledger balance incorrect
**Cause**: Usually from manual database edits
**Solution**: Ledger balances are auto-calculated from transactions. Don't edit manually.

---

## 📊 Sample Data for Testing

### Test Customers
1. ABC Company (GSTIN: 27AAAAA0000A1Z5)
2. XYZ Enterprises (GSTIN: 29BBBBB0000B1Z5)
3. PQR Solutions (GSTIN: 27CCCCC0000C1Z5)

### Test Products
1. Laptop Repair - ₹5,000 @ 18% GST
2. Data Recovery - ₹10,000 @ 18% GST
3. Software Installation - ₹2,000 @ 18% GST
4. Hardware Upgrade - ₹8,000 @ 18% GST

### Test Scenarios

**Scenario 1: Simple Sale**
- Customer: ABC Company
- Product: Laptop Repair (₹5,000)
- GST: Intra-State
- Payment: Full (Cash)

**Scenario 2: Multiple Items**
- Customer: XYZ Enterprises
- Products:
  - Laptop Repair × 2
  - Data Recovery × 1
- GST: Inter-State
- Payment: Partial (₹10,000 via Bank)

**Scenario 3: Cancelled Invoice**
- Create invoice
- Post it
- Cancel it
- Check ledger balances (should be reversed)

---

## 🎓 Best Practices

### 1. Always Seed Ledgers First
Before creating any invoices, seed the default ledgers.

### 2. Use Draft Status for Testing
Create invoices as Draft first, review, then change to Posted.

### 3. Don't Delete Posted Invoices
Cancel them instead. This maintains audit trail.

### 4. Regular Backups
Export reports regularly for backup.

### 5. Check Reports Weekly
Review Dashboard and P&L weekly to catch errors early.

### 6. Consistent Party Names
Use consistent naming for parties (e.g., "ABC Pvt Ltd" not "ABC" and "ABC Private Limited")

### 7. Verify GST Type
Double-check Intra vs Inter state before posting.

### 8. Record Payments Promptly
Record payments as soon as received for accurate cash flow.

---

## 📞 Need Help?

- Check the main README: `ACCOUNTING_SYSTEM_README.md`
- Review API endpoints in the README
- Check browser console for errors
- Check server logs for backend errors

---

## ✨ You're Ready!

You now have a fully functional accounting system with:
- ✅ Double-entry bookkeeping
- ✅ GST compliance
- ✅ Invoice management
- ✅ Payment tracking
- ✅ Financial reports

**Happy Accounting! 🎉**
