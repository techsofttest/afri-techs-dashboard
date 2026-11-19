# Afri-Techs Enterprise ERP (Next.js Edition)

Modern, frontend-only Enterprise Resource Planning (ERP) dashboard built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS v4**, modeled after the operational workflows of `steel_erp`.

---

## 🔐 Authentication & Session Flow

The application includes an integrated authentication system with persistent session management:

### 1. **Login Page (`/login`)**
- Clean, branded login portal with industrial theme accents and company credentials.
- Large company logo resting directly on the white card background.
- Username and password inputs with a password visibility toggle (`Eye`/`EyeOff`).
- Session persistence via `localStorage` (`afri_user`).

### 2. **Session Guard & Route Protection**
- Unauthenticated users attempting to access dashboard routes (`/`, `/accounts`, `/crm`, `/procurement`, `/users`, `/company`) are redirected to `/login`.
- Authenticated users attempting to visit `/login` are automatically redirected to the dashboard (`/`).
- Sidebar navigation automatically respects individual module access permissions (`permAccount`, `permCRM`, `permProcurement`).

### 3. **Logout Flow**
- Accessible from both the **Sidebar bottom profile** and the **Top Header user dropdown**.
- Features a confirmation dialog matching the original `steel_erp` implementation (`Are you sure you want to log out?`).
- Clears active session state and redirects to `/login`.

---

## 📌 Architecture & Modules Included

### 1. **Admin Overview Dashboard (`/`)**
- **Accounting Period Bar**: Accounting year/month filter, lock mechanism, date tracker, active user identity.
- **Key Metrics (matching Steel ERP color themes)**:
  - Current Month Orders vs Year To Date Orders
  - Current Month Deliveries vs Year To Date Deliveries
  - Current Month Sales vs Year To Date Sales
- **Action Tables (3-column layout)**:
  - **Pending For Action - Quotations**: Real-time review queue with amounts and enquiry references.
  - **Pending For Action - Delivery**: Dispatch queue with LPO references and fulfillment deadlines.
  - **Expiring Compliance**: Real-time tracking of corporate CR renewals, trade licenses, and permits.

### 2. **Accounts Module (`/accounts`)**
- **Account Head**: Asset, Liability, Equity, Revenue, and Expense head categories with code prefixes.
- **Charts of Accounts**: Complete hierarchical general ledger with debit/credit balance totals.
- **Receipts**: Customer cash/bank/cheque receipt vouchers with print triggers and settlement links.
- **Payments**: Supplier payment vouchers with wire/SWIFT references.
- **Journal Vouchers (JV)**: Double-entry debit/credit adjustment entries.
- **Petty Cash Vouchers (PCV)**: Imprest safe float management and expense reimbursement logs.
- **Bank Reconciliation**: Bank statement vs GL ledger balance, uncleared deposits & cheques variance tracker.
- **Financial Reports**: Trial Balance, Balance Sheet, and P&L summaries.

### 3. **CRM & Commercial Sales Module (`/crm`)**
- **Product Head**: Categorization (Structural Beams, Hot Rolled Plates, Pipes, Rebars).
- **Products**: Specification catalog with costs, selling prices, stock quantities, and low-stock alerts.
- **Customer Creation**: Customer registry with TRN/Tax PIN, credit limits, and contact details.
- **Enquiries**: Customer RFQs and assignment to commercial reps.
- **Sales Quotations**: Quotation builder with 16% VAT computation and conversion to Sales Orders.
- **Sales Orders**: Confirmed purchase commitments with LPO references and delivery schedules.
- **Pro-Forma Invoices**: Commercial advance billing invoices.
- **Delivery Notes (DN)**: Dispatch logistics with vehicle registration, driver details, and delivery statuses.
- **Cash & Credit Invoices**: Invoicing with aging and payment tracking.
- **Sales Returns**: Returned item records, restock verification, and credit notes.

### 4. **Procurement Module (`/procurement`)**
- **Vendor Management**: Supplier profiles with categories, tax numbers, and payment terms.
- **Material Requisitions (MR)**: Workshop/engineering requests with priority rankings.
- **Purchase Orders (LPO)**: Formal procurement orders issued against requisitions.
- **Material Received Notes (MRN)**: Receiving bay quality control inspection (accepted vs rejected items).
- **Purchase Vouchers**: Supplier invoices booked against LPOs.
- **Purchase Returns**: Damaged or rejected material returns and debit note issuance.
- **Fixed Asset Creation & Disposal**: Capital equipment register, straight-line depreciation calculation, and asset salvage.

### 5. **User Administration (`/users`)**
- User list with role classifications (Super Admin, Finance Manager, Sales Manager, Procurement Officer, Operator).
- **Module Permission Matrix**: Accounts, CRM, Procurement access.
- **Action Rights**: Add, Edit, and Delete authorization.
- **Security**: "Change Password" modal dialog and user creation modal.

### 6. **Companies & Subsidiaries Management (`/company`)**
- **Multi-Entity Management Table**: View and govern all companies, holding units, operational subsidiaries, and regional branches under ERP management.
- **Entity Classification**:
  - Headquarters (Parent Company)
  - Operating Subsidiaries (e.g. Heavy Fabrication Yard Ltd, Pipeline Services Ltd)
  - Regional Branches (e.g. Uganda Regional Branch)
- **View Company Modal**: Full statutory credentials (CR No, Est ID, Trade License No, Tax PIN/TRN, Capitalization) and shareholder/partner equity distribution table.
- **Edit & Add Modals**: Add new operating entities or modify existing branch records.

---

## 🚫 Modules Removed (Per Instructions)
- **Human Resources (HR)**: Employee records, payroll, attendance, and leave management removed.
- **Executives Module**: Deprecated and excluded.

---

## 🚀 Getting Started

To run the development server locally:

```bash
cd E:\laragon\www\afri-techs
npm run dev
```

The application is pre-configured on port `3005` (to avoid port conflicts) and can be opened in the browser at:
**[http://localhost:3005](http://localhost:3005)**

To generate a fresh production build:
```bash
npm run build
npm start
```
