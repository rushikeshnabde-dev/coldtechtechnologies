# System Architecture - Invoice & Accounting System

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Admin Panel (Protected Routes)            │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │           Accounting Module Pages                │  │ │
│  │  │  • Parties    • Ledgers    • Products           │  │ │
│  │  │  • Invoices   • Payments   • Reports            │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │                                                          │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │         Context Providers                        │  │ │
│  │  │  • AuthContext (JWT, User State)                │  │ │
│  │  │  • CartContext (Shopping Cart)                  │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │                                                          │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │         API Service Layer                        │  │ │
│  │  │  • accountingApi (Axios helpers)                │  │ │
│  │  │  • Auto JWT token injection                     │  │ │
│  │  │  • Error interceptors                           │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Middleware Layer                      │ │
│  │  • CORS          • Helmet (Security)                  │ │
│  │  • Rate Limiting • Body Parser                        │ │
│  │  • JWT Auth      • Admin Check                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Routes Layer                          │ │
│  │  /api/accounting/*                                     │ │
│  │  • /ledgers      • /parties      • /products          │ │
│  │  • /invoices     • /payments     • /reports           │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                Controllers Layer                       │ │
│  │  • ledgerController      • partyController            │ │
│  │  • productController     • invoiceController          │ │
│  │  • paymentController     • reportsController          │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Business Logic Layer                      │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │        Accounting Engine (CRITICAL)              │ │ │
│  │  │  • postVoucher()      - Create transactions      │ │ │
│  │  │  • reverseVoucher()   - Reverse transactions     │ │ │
│  │  │  • getLedgerStatement() - Generate statements    │ │ │
│  │  │  • Validates: Debit = Credit                     │ │ │
│  │  │  • Auto-updates ledger balances                  │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Models Layer (Mongoose)               │ │
│  │  • Party         • Ledger        • AccountingProduct  │ │
│  │  • AccountingInvoice  • Transaction  • Payment       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE (MongoDB)                      │
│  Collections:                                                │
│  • parties       • ledgers       • accountingproducts       │
│  • accountinginvoices  • transactions  • payments           │
│  • users (auth)                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Invoice Creation Flow

```
┌──────────┐
│  User    │
│ (Admin)  │
└────┬─────┘
     │ 1. Fill invoice form
     │    (customer, items, GST type)
     ▼
┌─────────────────────┐
│ AdminAccounting     │
│ Invoices.jsx        │
└────┬────────────────┘
     │ 2. POST /api/accounting/invoices
     │    { partyId, items, gstType, status: 'posted' }
     ▼
┌─────────────────────┐
│ accountingInvoice   │
│ Controller.create() │
└────┬────────────────┘
     │ 3. Calculate totals
     │    (subtotal, CGST, SGST, IGST)
     ▼
┌─────────────────────┐
│ AccountingInvoice   │
│ Model.create()      │
└────┬────────────────┘
     │ 4. Save invoice to DB
     │    (auto-generate invoice number)
     ▼
┌─────────────────────┐
│ _postInvoiceEntries │
│ (internal function) │
└────┬────────────────┘
     │ 5. Prepare entries:
     │    Debit:  Customer ₹grandTotal
     │    Credit: Sales    ₹subtotal
     │    Credit: CGST     ₹cgst
     │    Credit: SGST     ₹sgst
     ▼
┌─────────────────────┐
│ accountingEngine    │
│ .postVoucher()      │
└────┬────────────────┘
     │ 6. Validate: debit = credit
     │ 7. Create transactions
     │ 8. Update ledger balances
     │ 9. Return voucherRef
     ▼
┌─────────────────────┐
│ Transaction Model   │
│ .insertMany()       │
└────┬────────────────┘
     │ 10. Save transactions to DB
     ▼
┌─────────────────────┐
│ Ledger Model        │
│ .findByIdAndUpdate()│
└────┬────────────────┘
     │ 11. Update balances:
     │     Customer: +₹grandTotal
     │     Sales:    +₹subtotal
     │     CGST:     +₹cgst
     │     SGST:     +₹sgst
     ▼
┌─────────────────────┐
│ Response to Client  │
│ { invoice }         │
└─────────────────────┘
```

---

### 2. Payment Recording Flow

```
┌──────────┐
│  User    │
│ (Admin)  │
└────┬─────┘
     │ 1. Select invoice & enter amount
     ▼
┌─────────────────────┐
│ AdminPayments.jsx   │
└────┬────────────────┘
     │ 2. POST /api/accounting/payments
     │    { invoiceId, amount, mode: 'cash' }
     ▼
┌─────────────────────┐
│ paymentController   │
│ .create()           │
└────┬────────────────┘
     │ 3. Fetch invoice & party
     │ 4. Determine account ledger (Cash/Bank)
     ▼
┌─────────────────────┐
│ accountingEngine    │
│ .postVoucher()      │
└────┬────────────────┘
     │ 5. Create entries:
     │    Debit:  Cash/Bank  ₹amount
     │    Credit: Customer   ₹amount
     ▼
┌─────────────────────┐
│ Payment Model       │
│ .create()           │
└────┬────────────────┘
     │ 6. Save payment to DB
     │    (auto-generate payment number)
     ▼
┌─────────────────────┐
│ AccountingInvoice   │
│ .save()             │
└────┬────────────────┘
     │ 7. Update invoice:
     │    amountPaid += amount
     │    balance = grandTotal - amountPaid
     │    status = balance <= 0 ? 'paid' : 'partial'
     ▼
┌─────────────────────┐
│ Response to Client  │
│ { payment }         │
└─────────────────────┘
```

---

### 3. Report Generation Flow

```
┌──────────┐
│  User    │
│ (Admin)  │
└────┬─────┘
     │ 1. Select report type & filters
     ▼
┌─────────────────────┐
│ AdminReports.jsx    │
└────┬────────────────┘
     │ 2. GET /api/accounting/reports/{type}
     │    ?from=2024-01-01&to=2024-12-31
     ▼
┌─────────────────────┐
│ reportsController   │
│ .{reportType}()     │
└────┬────────────────┘
     │
     ├─ Dashboard ────────────────────┐
     │  • Count invoices              │
     │  • Sum month revenue           │
     │  • Get Cash/Bank balances      │
     │                                │
     ├─ Ledger Report ────────────────┤
     │  • Fetch transactions          │
     │  • Calculate running balance   │
     │  • Return rows                 │
     │                                │
     ├─ Profit & Loss ────────────────┤
     │  • Fetch income ledgers        │
     │  • Fetch expense ledgers       │
     │  • Sum transactions per ledger │
     │  • Calculate net profit        │
     │                                │
     └─ GST Summary ─────────────────┤
        • Fetch CGST/SGST/IGST txs   │
        • Calculate collected vs paid │
        • Fetch invoices for breakdown│
        │                              │
        ▼                              │
┌─────────────────────┐               │
│ Response to Client  │◄──────────────┘
│ { report data }     │
└─────────────────────┘
```

---

## Database Relationships

```
┌─────────────┐
│    User     │
│  (Auth)     │
└──────┬──────┘
       │ createdBy
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                  AccountingInvoice                      │
│  • invoiceNumber                                        │
│  • date, dueDate                                        │
│  • partyId ──────────────────────┐                     │
│  • items[]                        │                     │
│  • subtotal, totalCgst, etc.      │                     │
│  • grandTotal, amountPaid         │                     │
│  • balance, status                │                     │
│  • voucherRef ────────────┐       │                     │
└───────────────────────────┼───────┼─────────────────────┘
                            │       │
                            │       │
                            │       ▼
                            │  ┌─────────┐
                            │  │  Party  │
                            │  │  • name │
                            │  │  • type │
                            │  │  • gstin│
                            │  │  • ledgerId ──┐
                            │  └─────────┘     │
                            │                  │
                            ▼                  │
                    ┌──────────────┐           │
                    │ Transaction  │           │
                    │  • date      │           │
                    │  • ledgerId ─┼───────────┼──┐
                    │  • type      │           │  │
                    │  • amount    │           │  │
                    │  • voucherRef│           │  │
                    └──────────────┘           │  │
                                               │  │
                                               ▼  ▼
                                          ┌──────────┐
                                          │  Ledger  │
                                          │  • name  │
                                          │  • type  │
                                          │  • balance│
                                          └──────────┘
                                               ▲
                                               │
                                               │
┌─────────────────────────────────────────────┼──┐
│                  Payment                    │  │
│  • paymentNumber                            │  │
│  • date                                     │  │
│  • invoiceId ───────────────────────────────┘  │
│  • partyId                                     │
│  • amount                                      │
│  • mode                                        │
│  • accountLedgerId ────────────────────────────┘
│  • voucherRef
└────────────────────────────────────────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Request                        │
│  Headers: { Authorization: "Bearer <JWT_TOKEN>" }           │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    CORS Middleware                           │
│  • Validate origin                                           │
│  • Allow credentials                                         │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Helmet Middleware                          │
│  • Set security headers                                      │
│  • XSS protection                                            │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                 Rate Limiting Middleware                     │
│  • Auth routes: 50 req/15min                                │
│  • API routes: 300 req/15min                                │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   Auth Middleware                            │
│  1. Extract JWT from Authorization header                   │
│  2. Verify JWT signature                                     │
│  3. Decode payload → { userId, role }                       │
│  4. Fetch user from DB                                       │
│  5. Attach user to req.user                                  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  Admin Middleware                            │
│  • Check req.user.role === 'admin'                          │
│  • Return 403 if not admin                                   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Route Handler                             │
│  • Execute business logic                                    │
│  • Access req.user for audit                                │
└─────────────────────────────────────────────────────────────┘
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      App Component                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              AuthProvider (Context)                    │ │
│  │  State:                                                │ │
│  │  • user: { _id, name, email, role }                   │ │
│  │  • token: "jwt_token_string"                          │ │
│  │  • loading: boolean                                    │ │
│  │                                                         │ │
│  │  Methods:                                              │ │
│  │  • login(email, password)                             │ │
│  │  • logout()                                            │ │
│  │  • refreshProfile()                                    │ │
│  │                                                         │ │
│  │  Storage: localStorage.getItem('coldtech_auth')       │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              CartProvider (Context)                    │ │
│  │  State:                                                │ │
│  │  • items: [{ productId, qty, price }]                 │ │
│  │  • total: number                                       │ │
│  │                                                         │ │
│  │  Methods:                                              │ │
│  │  • addToCart(product)                                 │ │
│  │  • removeFromCart(productId)                          │ │
│  │  • clearCart()                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                               │
│                              ▼                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                  Router (React Router)                 │ │
│  │  • Public routes                                       │ │
│  │  • Protected routes (require auth)                    │ │
│  │  • Admin routes (require admin role)                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                               │
│                              ▼                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Page Components                           │ │
│  │  • Use useAuth() hook to access auth state            │ │
│  │  • Use useCart() hook to access cart state            │ │
│  │  • Local state for page-specific data                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Accounting Engine - Double Entry Logic

```
┌─────────────────────────────────────────────────────────────┐
│                    postVoucher()                             │
│  Input: { entries, narration, referenceId, date }          │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ Validate Input │
                    └────────┬───────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │ Calculate Total Debit        │
              │ Calculate Total Credit       │
              └──────────┬───────────────────┘
                         │
                         ▼
              ┌──────────────────────────────┐
              │ Check: |Debit - Credit| < 0.01│
              └──────────┬───────────────────┘
                         │
                         ├─ NO ──► Error: Imbalanced
                         │
                         └─ YES
                             │
                             ▼
              ┌──────────────────────────────┐
              │ Generate voucherRef (UUID)   │
              └──────────┬───────────────────┘
                         │
                         ▼
              ┌──────────────────────────────┐
              │ For each entry:              │
              │  1. Resolve ledger           │
              │  2. Create transaction doc   │
              │  3. Update ledger balance    │
              │     • Debit: balance += amt  │
              │     • Credit: balance -= amt │
              └──────────┬───────────────────┘
                         │
                         ▼
              ┌──────────────────────────────┐
              │ Insert all transactions      │
              │ (atomic operation)           │
              └──────────┬───────────────────┘
                         │
                         ▼
              ┌──────────────────────────────┐
              │ Return voucherRef            │
              └──────────────────────────────┘
```

---

## Component Hierarchy

```
App.jsx
├── AuthProvider
│   └── CartProvider
│       └── BrowserRouter
│           ├── Layout (Public)
│           │   ├── Navbar
│           │   ├── Outlet (Public Pages)
│           │   └── Footer
│           │
│           └── AdminLayout (Protected)
│               ├── Sidebar
│               │   ├── Logo
│               │   ├── Navigation
│               │   │   ├── Dashboard
│               │   │   ├── Customers
│               │   │   ├── Products
│               │   │   ├── ...
│               │   │   └── Accounting Section
│               │   │       ├── Parties
│               │   │       ├── Ledgers
│               │   │       ├── Acc. Products
│               │   │       ├── Acc. Invoices
│               │   │       ├── Payments
│               │   │       └── Reports
│               │   └── Footer (Logout)
│               │
│               └── Outlet (Admin Pages)
│                   ├── AdminDashboard
│                   ├── AdminParties
│                   │   ├── PartyForm (Modal)
│                   │   └── PartyTable
│                   ├── AdminLedgers
│                   │   ├── LedgerForm (Modal)
│                   │   └── LedgerTable
│                   ├── AdminAccountingProducts
│                   │   ├── ProductForm (Modal)
│                   │   └── ProductTable
│                   ├── AdminAccountingInvoices
│                   │   ├── InvoiceForm (Modal)
│                   │   └── InvoiceTable
│                   ├── AdminPayments
│                   │   ├── PaymentForm (Modal)
│                   │   └── PaymentTable
│                   └── AdminReports
│                       ├── DashboardTab
│                       ├── LedgerReportTab
│                       ├── ProfitLossTab
│                       └── GSTSummaryTab
```

---

## Technology Stack Details

### Frontend
- **React 19**: Latest React with concurrent features
- **Vite**: Fast build tool and dev server
- **React Router v6**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Axios**: HTTP client
- **React Hot Toast**: Toast notifications
- **React Icons**: Icon library (Feather Icons)

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Express Rate Limit**: Rate limiting
- **Dotenv**: Environment variables

### Database
- **MongoDB**: NoSQL document database
- **Indexes**: ledgerId, voucherRef, date
- **Transactions**: ACID compliance (where supported)

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Production                           │
│                                                              │
│  ┌────────────────┐         ┌────────────────┐             │
│  │   Vercel       │         │   Render       │             │
│  │  (Frontend)    │◄────────┤  (Backend)     │             │
│  │                │  HTTPS  │                │             │
│  │  • React App   │         │  • Node.js     │             │
│  │  • Static      │         │  • Express     │             │
│  │  • CDN         │         │  • API         │             │
│  └────────────────┘         └────────┬───────┘             │
│                                      │                      │
│                                      │ MongoDB Atlas        │
│                                      ▼                      │
│                             ┌────────────────┐             │
│                             │   MongoDB      │             │
│                             │   Atlas        │             │
│                             │  (Database)    │             │
│                             │                │             │
│                             │  • Replica Set │             │
│                             │  • Backups     │             │
│                             │  • Monitoring  │             │
│                             └────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

---

## Performance Considerations

### Frontend
- Code splitting (React.lazy)
- Memoization (useMemo, useCallback)
- Debounced search inputs
- Pagination for large lists
- Optimistic UI updates

### Backend
- Database indexes on frequently queried fields
- Lean queries (select only needed fields)
- Aggregation pipelines for reports
- Connection pooling
- Caching (Redis - future)

### Database
- Compound indexes: `{ ledgerId: 1, date: 1 }`
- Single field indexes: `voucherRef`, `invoiceNumber`
- Covered queries where possible
- Proper schema design (embedded vs referenced)

---

This architecture ensures:
- ✅ Scalability
- ✅ Maintainability
- ✅ Security
- ✅ Performance
- ✅ Data Integrity
- ✅ Audit Trail
