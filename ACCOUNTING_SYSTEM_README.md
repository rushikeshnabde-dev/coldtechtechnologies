# Complete Invoice Management & Accounting System

## Overview

A production-ready, full-stack Invoice Management and Accounting System with **Tally-like double-entry bookkeeping** built for Coldtech Technologies.

## Tech Stack

- **Frontend**: React 19 + Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based with role-based access control

---

## Features Implemented

### ✅ 1. Authentication System
- JWT-based authentication
- Role-based access control (Admin, Staff, User)
- Protected routes with middleware
- Google OAuth integration

### ✅ 2. Master Modules (Foundation Data)

#### A. Parties (Customers/Vendors)
- **Model**: `server/models/Party.js`
- **Controller**: `server/controllers/partyController.js`
- **Frontend**: `client/src/pages/admin/AdminParties.jsx`
- **Fields**: name, phone, email, address, GSTIN, type (customer/vendor)
- **Features**: 
  - Auto-creates linked ledger account for each party
  - Search and filter by type
  - Full CRUD operations

#### B. Products/Services
- **Model**: `server/models/AccountingProduct.js`
- **Controller**: `server/controllers/accountingProductController.js`
- **Frontend**: `client/src/pages/admin/AdminAccountingProducts.jsx`
- **Fields**: name, price, HSN/SAC code, GST %
- **Features**: Search, full CRUD

#### C. Ledger Accounts (Chart of Accounts)
- **Model**: `server/models/Ledger.js`
- **Controller**: `server/controllers/ledgerController.js`
- **Frontend**: `client/src/pages/admin/AdminLedgers.jsx`
- **Fields**: name, type (asset/liability/income/expense), balance, description
- **Default Ledgers**: Sales, Purchase, Cash, Bank, CGST, SGST, IGST
- **Features**: 
  - Seed default ledgers
  - Running balance tracking
  - Filter by type
  - Protected default ledgers

### ✅ 3. Invoice System (Sales)

- **Model**: `server/models/AccountingInvoice.js`
- **Controller**: `server/controllers/accountingInvoiceController.js`
- **Frontend**: `client/src/pages/admin/AdminAccountingInvoices.jsx`

#### Invoice Features:
- Auto-incrementing invoice numbers (AINV-YYYY-NNNN)
- Customer selection from parties
- Dynamic line items with:
  - Product selection (auto-fills rate, HSN, GST)
  - Manual entry support
  - Quantity, rate, GST % per item
- GST Type selection:
  - **Intra-State**: CGST + SGST (split 50/50)
  - **Inter-State**: IGST
- Auto-calculation of:
  - Subtotal
  - CGST/SGST/IGST
  - Grand Total
- Status management: Draft, Posted, Paid, Partial, Cancelled
- Invoice date and due date
- Notes field
- Company details snapshot

#### UI Features:
- Search and filter by status
- Edit invoices (reverses old entries if posted)
- Cancel invoices (reverses accounting entries)
- Delete draft invoices
- Responsive table view

### ✅ 4. Accounting Engine (CRITICAL - Double Entry System)

**File**: `server/utils/accountingEngine.js`

#### Core Functions:

1. **postVoucher()**: Creates double-entry transactions
   - Validates debit = credit (within 0.01 tolerance)
   - Creates grouped transactions with voucherRef
   - Updates ledger balances automatically
   - Returns voucherRef for tracking

2. **reverseVoucher()**: Reverses a voucher (for cancellations/edits)
   - Swaps debit ↔ credit
   - Creates new voucher with reversed entries

3. **getLedgerStatement()**: Generates ledger statement with running balance

#### Transaction Model:
- **Model**: `server/models/Transaction.js`
- **Fields**: date, ledgerId, type (debit/credit), amount, narration, referenceId, referenceType, voucherRef
- **Indexes**: ledgerId + date, voucherRef

#### Invoice Posting Logic:
When an invoice is posted (status = 'posted'):
```
Debit:  Customer Ledger (Party)     ₹ Grand Total
Credit: Sales Ledger                ₹ Subtotal
Credit: CGST Ledger                 ₹ CGST Amount
Credit: SGST Ledger                 ₹ SGST Amount
Credit: IGST Ledger                 ₹ IGST Amount (if inter-state)
```

**Ensures**: Total Debit = Total Credit (always)

### ✅ 5. Payments Module

- **Model**: `server/models/Payment.js`
- **Controller**: `server/controllers/paymentController.js`
- **Frontend**: `client/src/pages/admin/AdminPayments.jsx`

#### Payment Features:
- Link payment to invoice
- Auto-incrementing payment numbers (PAY-YYYY-NNNN)
- Payment modes: Cash, Bank, UPI, Cheque
- Auto-updates invoice balance and status
- Payment date tracking

#### Accounting Logic:
```
Debit:  Cash/Bank Ledger            ₹ Payment Amount
Credit: Customer Ledger (Party)     ₹ Payment Amount
```

#### Payment Deletion:
- Reverses accounting entries
- Restores invoice balance
- Updates invoice status

### ✅ 6. Reports Module

**Frontend**: `client/src/pages/admin/AdminReports.jsx`
**Controller**: `server/controllers/reportsController.js`

#### A. Dashboard
- Total invoices count
- Pending invoices count
- Month revenue
- Month collected
- Month outstanding
- Cash balance
- Bank balance

#### B. Ledger Report
- Select any ledger
- Date range filter
- Shows:
  - Opening balance
  - All transactions (debit/credit)
  - Running balance
  - Closing balance
  - Total debit/credit

#### C. Profit & Loss Report
- Date range filter
- Income ledgers summary
- Expense ledgers summary
- Net Profit/Loss calculation

#### D. GST Summary Report
- Date range filter
- CGST/SGST/IGST collected vs paid
- Net GST liability
- Invoice-wise GST breakdown table

### ✅ 7. UI Requirements

#### Admin Panel Features:
- Clean modern design with dark theme
- Sidebar navigation with sections:
  - Main modules (Dashboard, Customers, Products, etc.)
  - **Accounting section** (Parties, Ledgers, Products, Invoices, Payments, Reports)
- Mobile responsive
- Toast notifications (react-hot-toast)
- Form validation
- Loading states
- Empty states with icons
- Smooth animations (Framer Motion)

#### Design System:
- Primary color: `#3AB6FF` (cyan)
- Background: `#0B0F1A` (dark navy)
- Cards: `#0D1220` with white/10 borders
- Gradients for CTAs
- Status badges with color coding

### ✅ 8. Extra Features

- Company details in invoice header
- Search functionality in all tables
- Filter by status, type, date ranges
- Auto-calculation throughout
- Seed default data
- Protected default ledgers
- Voucher reference tracking
- Transaction history
- Balance tracking

---

## Code Structure

### Backend (`server/`)
```
├── models/
│   ├── Party.js                    # Customers/Vendors
│   ├── Ledger.js                   # Chart of Accounts
│   ├── AccountingProduct.js        # Products for invoicing
│   ├── AccountingInvoice.js        # Sales invoices
│   ├── Transaction.js              # Double-entry transactions
│   └── Payment.js                  # Payment records
├── controllers/
│   ├── partyController.js
│   ├── ledgerController.js
│   ├── accountingProductController.js
│   ├── accountingInvoiceController.js
│   ├── paymentController.js
│   └── reportsController.js
├── routes/
│   └── accountingRoutes.js         # All accounting routes
├── utils/
│   └── accountingEngine.js         # Double-entry engine
└── middleware/
    ├── auth.js                     # JWT authentication
    └── admin.js                    # Admin-only middleware
```

### Frontend (`client/src/`)
```
├── pages/admin/
│   ├── AdminParties.jsx            # Parties management
│   ├── AdminLedgers.jsx            # Ledgers management
│   ├── AdminAccountingProducts.jsx # Products management
│   ├── AdminAccountingInvoices.jsx # Invoices management
│   ├── AdminPayments.jsx           # Payments management
│   └── AdminReports.jsx            # All reports (tabs)
├── services/
│   └── api.js                      # API helpers (accountingApi)
└── context/
    └── AuthContext.jsx             # Auth state management
```

---

## API Endpoints

### Ledgers
- `GET    /api/accounting/ledgers` - List all ledgers
- `GET    /api/accounting/ledgers/seed` - Seed default ledgers
- `GET    /api/accounting/ledgers/:id` - Get single ledger
- `GET    /api/accounting/ledgers/:id/statement` - Get ledger statement
- `POST   /api/accounting/ledgers` - Create ledger
- `PUT    /api/accounting/ledgers/:id` - Update ledger
- `DELETE /api/accounting/ledgers/:id` - Delete ledger

### Parties
- `GET    /api/accounting/parties` - List parties
- `GET    /api/accounting/parties/:id` - Get single party
- `POST   /api/accounting/parties` - Create party
- `PUT    /api/accounting/parties/:id` - Update party
- `DELETE /api/accounting/parties/:id` - Delete party

### Products
- `GET    /api/accounting/products` - List products
- `GET    /api/accounting/products/:id` - Get single product
- `POST   /api/accounting/products` - Create product
- `PUT    /api/accounting/products/:id` - Update product
- `DELETE /api/accounting/products/:id` - Delete product

### Invoices
- `GET    /api/accounting/invoices` - List invoices
- `GET    /api/accounting/invoices/:id` - Get single invoice
- `POST   /api/accounting/invoices` - Create invoice
- `PUT    /api/accounting/invoices/:id` - Update invoice
- `POST   /api/accounting/invoices/:id/cancel` - Cancel invoice
- `DELETE /api/accounting/invoices/:id` - Delete invoice

### Payments
- `GET    /api/accounting/payments` - List payments
- `GET    /api/accounting/payments/:id` - Get single payment
- `POST   /api/accounting/payments` - Create payment
- `DELETE /api/accounting/payments/:id` - Delete payment

### Reports
- `GET    /api/accounting/reports/dashboard` - Dashboard summary
- `GET    /api/accounting/reports/ledger` - Ledger report
- `GET    /api/accounting/reports/pl` - Profit & Loss
- `GET    /api/accounting/reports/gst` - GST Summary

---

## Database Schema

### Party
```javascript
{
  name: String (required),
  phone: String,
  email: String,
  address: String,
  gstin: String,
  type: 'customer' | 'vendor',
  ledgerId: ObjectId (ref: Ledger),
  timestamps: true
}
```

### Ledger
```javascript
{
  name: String (required, unique),
  type: 'asset' | 'liability' | 'income' | 'expense',
  isDefault: Boolean,
  balance: Number (running balance),
  description: String,
  timestamps: true
}
```

### AccountingProduct
```javascript
{
  name: String (required),
  price: Number (required),
  hsnSac: String,
  gstPercent: Number (default: 18),
  unit: String (default: 'pcs'),
  description: String,
  timestamps: true
}
```

### AccountingInvoice
```javascript
{
  invoiceNumber: String (unique, auto-generated),
  date: Date,
  dueDate: Date,
  partyId: ObjectId (ref: Party),
  company: { name, address, phone, email, gstin },
  gstType: 'intra' | 'inter',
  items: [{
    productId: ObjectId,
    name: String,
    hsnSac: String,
    qty: Number,
    rate: Number,
    gstPercent: Number,
    taxableAmount: Number,
    cgst: Number,
    sgst: Number,
    igst: Number,
    lineTotal: Number
  }],
  subtotal: Number,
  totalCgst: Number,
  totalSgst: Number,
  totalIgst: Number,
  totalTax: Number,
  grandTotal: Number,
  amountPaid: Number,
  balance: Number,
  status: 'draft' | 'posted' | 'paid' | 'partial' | 'cancelled',
  notes: String,
  voucherRef: String,
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

### Transaction
```javascript
{
  date: Date,
  ledgerId: ObjectId (ref: Ledger),
  type: 'debit' | 'credit',
  amount: Number,
  narration: String,
  referenceId: ObjectId,
  referenceType: 'invoice' | 'payment' | 'journal',
  voucherRef: String (groups debit+credit pairs),
  timestamps: true
}
```

### Payment
```javascript
{
  paymentNumber: String (unique, auto-generated),
  date: Date,
  invoiceId: ObjectId (ref: AccountingInvoice),
  partyId: ObjectId (ref: Party),
  amount: Number,
  mode: 'cash' | 'bank' | 'upi' | 'cheque',
  accountLedgerId: ObjectId (ref: Ledger),
  notes: String,
  voucherRef: String,
  timestamps: true
}
```

---

## How to Use

### 1. Setup Default Ledgers
Navigate to **Accounting → Ledgers** and click **"Seed Defaults"** to create:
- Sales (Income)
- Purchase (Expense)
- Cash (Asset)
- Bank (Asset)
- CGST (Liability)
- SGST (Liability)
- IGST (Liability)

### 2. Add Parties (Customers/Vendors)
Navigate to **Accounting → Parties**:
- Add customers and vendors
- Each party automatically gets a linked ledger account

### 3. Add Products/Services
Navigate to **Accounting → Acc. Products**:
- Add items you sell/provide
- Set price, HSN/SAC, GST %

### 4. Create Invoices
Navigate to **Accounting → Acc. Invoices**:
- Select customer
- Add line items (select from products or type manually)
- Choose GST type (intra/inter state)
- Save as Draft or Post immediately
- Posting creates accounting entries automatically

### 5. Record Payments
Navigate to **Accounting → Payments**:
- Select invoice with outstanding balance
- Enter payment amount and mode
- System automatically:
  - Updates invoice balance
  - Changes invoice status
  - Creates accounting entries

### 6. View Reports
Navigate to **Accounting → Reports**:
- **Dashboard**: Quick overview
- **Ledger Report**: Detailed statement for any ledger
- **Profit & Loss**: Income vs Expense
- **GST Summary**: Tax collected vs paid

---

## Key Principles

### Double-Entry Bookkeeping
Every transaction creates TWO entries:
- One DEBIT
- One CREDIT
- Total Debit = Total Credit (always)

### Ledger Balance Rules
- **Asset & Expense**: Debit increases, Credit decreases
- **Liability & Income**: Credit increases, Debit decreases

### Invoice Lifecycle
1. **Draft**: Editable, no accounting impact
2. **Posted**: Locked, accounting entries created
3. **Partial**: Some payment received
4. **Paid**: Fully paid
5. **Cancelled**: Reversed, accounting entries reversed

---

## Security

- JWT authentication required for all routes
- Admin-only middleware on accounting routes
- Role-based access control
- Protected default ledgers (cannot delete)
- Validation on all inputs
- Transaction integrity checks

---

## Production Ready

✅ Complete CRUD operations
✅ Error handling
✅ Input validation
✅ Loading states
✅ Empty states
✅ Responsive design
✅ Toast notifications
✅ Search & filters
✅ Date range filters
✅ Auto-calculations
✅ Transaction reversal
✅ Balance tracking
✅ Audit trail (voucherRef)
✅ Clean, modular code
✅ No console errors
✅ Scalable architecture

---

## Future Enhancements (Optional)

- PDF invoice generation
- Email invoices to customers
- Recurring invoices
- Purchase invoices (vendor bills)
- Journal entries (manual vouchers)
- Bank reconciliation
- Multi-currency support
- Inventory tracking
- Tax filing reports (GSTR-1, GSTR-3B)
- Audit logs
- User activity tracking
- Backup/restore functionality

---

## Support

For issues or questions, contact the development team at Coldtech Technologies.

**Built with ❤️ for Coldtech Technologies**
