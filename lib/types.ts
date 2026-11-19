export interface AccountingPeriod {
  year: number;
  month: number;
  isLocked: boolean;
  dateStr: string;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  periodLabel: string;
  trend?: string;
  icon: string;
  color: string;
  bgGradient: string;
}

export interface PendingQuotation {
  id: string;
  date: string;
  customerName: string;
  enquiryRef: string;
  amount: number;
  status: 'Pending' | 'Review' | 'Sent';
}

export interface PendingDelivery {
  id: string;
  soNumber: string;
  customerName: string;
  lpoRef: string;
  dueDate: string;
  amount: number;
  status: 'Pending Dispatch' | 'In Transit' | 'Ready';
}

export interface ExpiringDoc {
  id: string;
  holderName: string;
  item: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'Critical' | 'Warning' | 'Good';
}

// Accounts
export interface AccountHead {
  id: string;
  headCode: string;
  headName: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  description: string;
  status: 'Active' | 'Inactive';
}

export interface ChartOfAccount {
  id: string;
  accountCode: string;
  accountName: string;
  headId: string;
  headName: string;
  category: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  currency: string;
  openingBalance: number;
  currentBalance: number;
  debitTotal: number;
  creditTotal: number;
  status: 'Active' | 'Inactive';
}

export interface ReceiptItemInvoice {
  id: string;
  invoiceNo: string;
  date: string;
  lpoRef?: string;
  amount: number;
  receiptAmount: number;
}

export interface ReceiptItem {
  id: string;
  slNo: number;
  creditAccount: string;
  amount: number;
  narration?: string;
  linkedInvoices?: ReceiptItemInvoice[];
}

export interface ReceiptVoucher {
  id: string;
  voucherNo: string;
  date: string;
  receivedFrom: string;
  accountHead?: string;
  debitAccount?: string;
  receiptNo?: string;
  collectedBy?: string;
  mode: 'Cash' | 'Bank Transfer' | 'Cheque';
  bank?: string;
  chequeNo?: string;
  chequeDate?: string;
  chequeCopy?: string;
  referenceNo: string;
  amount: number;
  narration: string;
  status: 'Approved' | 'Pending';
  items?: ReceiptItem[];
}

export interface PaymentItemInvoice {
  id: string;
  invoiceNo: string;
  date: string;
  lpoRef?: string;
  amount: number;
  paymentAmount: number;
}

export interface PaymentItem {
  id: string;
  slNo: number;
  account: string;
  amount: number;
  narration?: string;
  linkedInvoices?: PaymentItemInvoice[];
}

export interface PaymentVoucher {
  id: string;
  voucherNo: string;
  referenceNo: string;
  date: string;
  paidTo?: string;
  creditAccount?: string;
  accountHead?: string;
  mode: 'Cash' | 'Bank Transfer' | 'Cheque';
  chequeNo?: string;
  chequeDate?: string;
  chequeCopy?: string;
  amount: number;
  narration: string;
  status: 'Approved' | 'Pending';
  items?: PaymentItem[];
}

export interface JournalVoucher {
  id: string;
  jvNo: string;
  date: string;
  referenceNo: string;
  narration: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  status: 'Posted' | 'Draft';
}

export interface PettyCashItemInvoice {
  id: string;
  invoiceNo: string;
  date: string;
  lpoRef?: string;
  amount: number;
  paymentAmount: number;
}

export interface PettyCashItem {
  id: string;
  slNo: number;
  salesOrder?: string;
  debitAccount: string;
  amount: number;
  narration?: string;
  linkedInvoices?: PettyCashItemInvoice[];
}

export interface PettyCashVoucher {
  id: string;
  voucherNo: string;
  referenceNo?: string;
  date: string;
  custodian?: string;
  creditAccount?: string;
  mode?: 'Cash' | 'Bank Transfer' | 'Cheque';
  chequeNo?: string;
  chequeDate?: string;
  chequeCopy?: string;
  category?: string;
  amount: number;
  billAttachment?: string;
  narration?: string;
  status: 'Reimbursed' | 'Approved' | 'Pending';
  items?: PettyCashItem[];
}

export interface BankReconciliation {
  id: string;
  bankName: string;
  accountNumber: string;
  statementDate: string;
  bankStatementBalance: number;
  ledgerBalance: number;
  unclearedDeposits: number;
  outstandingCheques: number;
  difference: number;
  status: 'Reconciled' | 'Discrepancy';
}

// CRM
export interface ProductHead {
  id: string;
  code: string;
  name: string;
  description: string;
  totalProducts: number;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  stockQty: number;
  minAlertQty: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Customer {
  id: string;
  code: string;
  customerCode?: string;
  name: string;
  contactPerson?: string;
  email: string;
  phone: string;
  trn?: string;
  taxNo?: string;
  creditLimit: number;
  outstandingBalance: number;
  currentBalance?: number;
  paymentTerms?: string;
  city?: string;
  country?: string;
  postBox?: string;
  status: 'Active' | 'Blocked';
}

export interface Enquiry {
  id: string;
  refNo: string;
  enquiryNo?: string;
  date: string;
  customerName: string;
  subject?: string;
  estimatedValue?: number;
  assignedTo?: string;
  status?: 'New' | 'In Progress' | 'Converted' | 'Closed';
}

export interface SalesQuotationItem {
  id: string;
  slNo?: number;
  productId?: string;
  productDescription: string;
  unit: string;
  quantity: number;
  rate: number;
  discount: number;
  amount: number;
}

export interface SalesQuotation {
  id: string;
  quotationNo: string;
  date: string;
  customerName: string;
  enquiryRef: string;
  validity?: string;
  validUntil: string;
  paymentTerm?: string;
  deliveryTerm?: string;
  project?: string;
  itemsCount: number;
  items?: SalesQuotationItem[];
  subTotal: number;
  vatAmount: number;
  totalAmount: number;
  status: string;
}

export interface SalesOrderItem {
  id: string;
  slNo?: number;
  productId?: string;
  productDescription: string;
  unit: string;
  quantity: number;
  rate: number;
  discount: number;
  amount: number;
}

export interface SalesOrder {
  id: string;
  soNo: string;
  orderNo?: string;
  date: string;
  customerName: string;
  lpoRef?: string;
  quotationRef?: string;
  paymentTerm?: string;
  deliveryDate?: string;
  expectedDelivery?: string;
  project?: string;
  itemsCount?: number;
  items?: SalesOrderItem[];
  subTotal?: number;
  vatAmount?: number;
  totalAmount: number;
  deliveryStatus?: 'Pending' | 'Partially Delivered' | 'Delivered';
  paymentStatus?: 'Unpaid' | 'Partial' | 'Paid';
  status?: string;
}

export interface ProFormaItem {
  id: string;
  slNo?: number;
  productId?: string;
  productDescription: string;
  unit: string;
  quantity: number;
  rate: number;
  discount: number;
  amount: number;
}

export interface ProFormaInvoice {
  id: string;
  pfNo: string;
  referenceNo: string;
  date: string;
  customerName: string;
  salesOrderNo: string;
  lpoRef: string;
  paymentTerms: string;
  deliveryTerms: string;
  project?: string;
  totalOrderValue: number;
  currentClaimPercent: number;
  currentClaimValue: number;
  subTotal?: number;
  vatAmount?: number;
  items?: ProFormaItem[];
  status?: string;
}

export interface DeliveryNoteItem {
  id: string;
  slNo?: number;
  productId?: string;
  productDescription: string;
  unit: string;
  orderQty: number;
  deliveredQty: number;
  currentDelivery: number;
  rate?: number;
  amount?: number;
}

export interface DeliveryNote {
  id: string;
  dnNo: string;
  date: string;
  soRef?: string;
  salesOrderNo?: string;
  customerName: string;
  lpoRef?: string;
  paymentTerms?: string;
  project?: string;
  shippingAddress?: string;
  vehicleNo?: string;
  driverName?: string;
  itemsDelivered?: number;
  itemsCount?: number;
  amount?: number;
  status?: 'Dispatched' | 'Delivered' | 'Returned';
  items?: DeliveryNoteItem[];
}

export interface SalesInvoiceItem {
  id: string;
  slNo?: number;
  productId?: string;
  productDescription: string;
  unit: string;
  quantity: number;
  rate: number;
  discount: number;
  amount: number;
}

export interface SalesInvoice {
  id: string;
  invoiceNo: string;
  date: string;
  invoiceType?: 'Credit' | 'Cash';
  customerName: string;
  creditAccount?: string;
  soRef?: string;
  salesOrderRef?: string;
  lpoRef?: string;
  paymentTerms?: string;
  project?: string;
  dueDate?: string;
  totalAmount: number;
  paidAmount: number;
  advanceAmount?: number;
  balanceDue: number;
  paymentTermsNote?: string;
  status?: string;
  items?: SalesInvoiceItem[];
}

export interface SalesReturnItem {
  id: string;
  slNo?: number;
  productId?: string;
  productDescription: string;
  unit: string;
  quantity: number;
  rate: number;
  discount: number;
  amount: number;
}

export interface SalesReturn {
  id: string;
  returnNo: string;
  date: string;
  customerName: string;
  invoiceNo: string;
  debitAccount?: string;
  lpoRef?: string;
  paymentTerms?: string;
  project?: string;
  reason?: string;
  amount: number;
  status?: string;
  items?: SalesReturnItem[];
}

// Procurement
export interface Vendor {
  id: string;
  vendorCode: string;
  name: string;
  category?: string;
  contactPerson?: string;
  phone: string;
  email: string;
  taxNo?: string;
  city?: string;
  country?: string;
  paymentTerms?: string;
  status: 'Active' | 'Suspended';
  postBox?: string;
  accountHead?: string;
  accountId?: string;
  fax?: string;
  creditTerm?: string;
  creditPeriod?: string;
  creditLimit?: string;
}

export interface MaterialRequisitionItem {
  id: string;
  slNo?: number;
  salesOrderNo?: string;
  productId?: string;
  productDescription: string;
  unit: string;
  quantity: number;
}

export interface MaterialRequisition {
  id: string;
  mrNo: string;
  date: string;
  requestedBy?: string;
  department?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  itemsSummary?: string;
  status?: 'Pending Approval' | 'Approved' | 'PO Created' | 'Rejected';
  timeFrame?: string;
  assignedTo?: string;
  items?: MaterialRequisitionItem[];
}

export interface PurchaseOrderItem {
  id: string;
  slNo?: number;
  salesOrderNo?: string;
  productId?: string;
  productDescription: string;
  unit: string;
  quantity: number;
  rate: number;
  discount: number;
  amount: number;
}

export interface PurchaseOrder {
  id: string;
  poNo: string;
  date: string;
  vendorName: string;
  mrRef?: string;
  deliveryDueDate?: string;
  totalAmount: number;
  status?: 'Draft' | 'Issued' | 'Partially Received' | 'Fulfilled' | 'Cancelled';
  vendorRef?: string;
  paymentTerm?: string;
  items?: PurchaseOrderItem[];
}

export interface MaterialReceivedNoteItem {
  id: string;
  slNo?: number;
  salesOrderNo?: string;
  productId?: string;
  productDescription: string;
  unit: string;
  orderQty: number;
  deliveredQty: number;
  currentDelivery: number;
  rate?: number;
  amount?: number;
}

export interface MaterialReceivedNote {
  id: string;
  mrnNo: string;
  date: string;
  poRef: string;
  vendorName: string;
  storeLocation?: string;
  acceptedItems?: number;
  rejectedItems?: number;
  inspectedBy?: string;
  status?: 'Verified' | 'Quality Issue' | 'Pending Inspection';
  deliveryNote?: string;
  mrRef?: string;
  paymentTerm?: string;
  amount?: number;
  items?: MaterialReceivedNoteItem[];
}

export interface PurchaseVoucherItem {
  id: string;
  slNo?: number;
  salesOrderNo?: string;
  productId?: string;
  productDescription: string;
  debitAccount?: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  amount: number;
}

export interface PurchaseVoucher {
  id: string;
  pvNo: string;
  date: string;
  vendorName: string;
  vendorInvoiceNo: string;
  poRef: string;
  totalAmount: number;
  dueDate?: string;
  status?: 'Unpaid' | 'Partial' | 'Paid';
  deliveryNote?: string;
  paymentTerm?: string;
  items?: PurchaseVoucherItem[];
}

export interface PurchaseReturnItem {
  id: string;
  slNo?: number;
  salesOrderNo?: string;
  productId?: string;
  productDescription: string;
  creditAccount?: string;
  quantity: number;
  maxQty?: number;
  selected?: boolean;
  unit: string;
  rate: number;
  discount: number;
  amount: number;
}

export interface PurchaseReturn {
  id: string;
  prNo: string;
  date: string;
  vendorName: string;
  pvRef?: string;
  reason?: string;
  debitNoteAmount: number;
  status?: 'Approved' | 'Pending';
  vendorRef?: string;
  vendorInvRef?: string;
  lpoRef?: string;
  paymentTerm?: string;
  items?: PurchaseReturnItem[];
}

export interface FixedAsset {
  id: string;
  assetCode: string;
  assetName: string;
  category: string;
  purchaseDate: string;
  purchaseCost: number;
  depreciationRate: number;
  accumulatedDepreciation: number;
  currentBookValue: number;
  status: 'In Use' | 'Disposed' | 'Under Maintenance';
}

// Users
export interface UserRecord {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'Super Admin' | 'Finance Manager' | 'Sales Manager' | 'Procurement Officer' | 'Operator';
  permAccount: boolean;
  permCRM: boolean;
  permProcurement: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  status: 'Active' | 'Disabled';
  lastLogin: string;
}

// Companies / Branches / Subsidiaries under ERP management
export interface CompanyPartner {
  id: string;
  name: string;
  nationality: string;
  idNumber: string;
  sharePercentage: number;
  designation: string;
}

export interface CompanyEntity {
  id: string;
  code: string;
  name: string;
  type: 'Headquarters' | 'Subsidiary' | 'Branch' | 'Joint Venture';
  crNo: string;
  estId: string;
  tradeLicenseNo: string;
  taxCardNo: string;
  paidUpCapital: number;
  currency: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  address: string;
  status: 'Active' | 'Inactive';
  partners: CompanyPartner[];
}
