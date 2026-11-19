import {
  AccountingPeriod,
  CompanyEntity,
  UserRecord,
  AccountHead,
  ChartOfAccount,
  ReceiptVoucher,
  PaymentVoucher,
  JournalVoucher,
  PettyCashVoucher,
  BankReconciliation,
  ProductHead,
  Product,
  Customer,
  Enquiry,
  SalesQuotation,
  SalesOrder,
  ProFormaInvoice,
  DeliveryNote,
  SalesInvoice,
  SalesReturn,
  Vendor,
  MaterialRequisition,
  PurchaseOrder,
  MaterialReceivedNote,
  PurchaseVoucher,
  PurchaseReturn,
  FixedAsset,
  PendingQuotation,
  PendingDelivery,
  ExpiringDoc
} from './types';

export const initialAccountingPeriod: AccountingPeriod = {
  year: 2026,
  month: 11,
  isLocked: true,
  dateStr: '13-Nov-2026'
};

// Companies under ERP Management - Exactly 3 entities (Guinea, India, UK)
export const initialCompanies: CompanyEntity[] = [
  {
    id: '1',
    code: 'COMP-001',
    name: 'Afri techs Guinea',
    type: 'Headquarters',
    crNo: 'RCCM/GC-KAL/2018-B-0982',
    estId: 'EST-CKY-001',
    tradeLicenseNo: 'AGUIPEX-GN-2026-88',
    taxCardNo: 'NIF-00918274-GN',
    paidUpCapital: 3500000,
    currency: 'USD',
    city: 'Conakry',
    country: 'Guinea',
    phone: '+224 620 11 22 33',
    email: 'guinea@afri-techs.com',
    address: 'Zone Industrielle de Matoto, Boulevard de la République, Conakry, Guinea',
    status: 'Active',
    partners: [
      {
        id: '1',
        name: 'Mamadou Alpha Diallo',
        nationality: 'Guinean',
        idNumber: 'GN-CNI-88291024',
        sharePercentage: 55,
        designation: 'Managing Director'
      },
      {
        id: '2',
        name: 'Aissatou Camara',
        nationality: 'Guinean',
        idNumber: 'GN-CNI-19283741',
        sharePercentage: 45,
        designation: 'Operations Partner'
      }
    ]
  },
  {
    id: '2',
    code: 'COMP-002',
    name: 'Afri techs India',
    type: 'Subsidiary',
    crNo: 'CIN-U27100MH2021PTC368921',
    estId: 'EST-MUM-018',
    tradeLicenseNo: 'MH-MUM-TL-2026-904',
    taxCardNo: 'GSTIN-27AAACA1294F1Z5',
    paidUpCapital: 2500000,
    currency: 'USD',
    city: 'Mumbai',
    country: 'India',
    phone: '+91 22 6789 4400',
    email: 'india@afri-techs.com',
    address: 'Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051, India',
    status: 'Active',
    partners: [
      {
        id: '1',
        name: 'Rajesh K. Sharma',
        nationality: 'Indian',
        idNumber: 'IN-P9918274',
        sharePercentage: 60,
        designation: 'Managing Director - Asia Ops'
      },
      {
        id: '2',
        name: 'Vikram Mehta',
        nationality: 'Indian',
        idNumber: 'IN-P4819201',
        sharePercentage: 40,
        designation: 'Technical Director'
      }
    ]
  },
  {
    id: '3',
    code: 'COMP-003',
    name: 'Afri techs Uk',
    type: 'Subsidiary',
    crNo: 'UK-CRN-11982736',
    estId: 'EST-LDN-005',
    tradeLicenseNo: 'GB-COMP-2026-441',
    taxCardNo: 'GB-VAT-982173491',
    paidUpCapital: 4000000,
    currency: 'USD',
    city: 'London',
    country: 'Uk',
    phone: '+44 20 7946 0912',
    email: 'uk@afri-techs.com',
    address: '100 Bishopsgate, London EC2N 4AG, United Kingdom',
    status: 'Active',
    partners: [
      {
        id: '1',
        name: 'Marcus O. Sterling',
        nationality: 'British',
        idNumber: 'GB-P5829104',
        sharePercentage: 65,
        designation: 'Executive Director'
      },
      {
        id: '2',
        name: 'David W. Harrington',
        nationality: 'British',
        idNumber: 'GB-P7728190',
        sharePercentage: 35,
        designation: 'Finance Partner'
      }
    ]
  }
];

export const companyData = initialCompanies[0];

export const initialUsers: UserRecord[] = [
  {
    id: '1',
    username: 'admin',
    fullName: 'System Administrator',
    email: 'admin@afri-techs.com',
    role: 'Super Admin',
    permAccount: true,
    permCRM: true,
    permProcurement: true,
    canAdd: true,
    canEdit: true,
    canDelete: true,
    status: 'Active',
    lastLogin: 'Today, 09:42 AM'
  },
  {
    id: '2',
    username: 'shihab.acc',
    fullName: 'Shihab Mohammed',
    email: 'shihab@afri-techs.com',
    role: 'Finance Manager',
    permAccount: true,
    permCRM: true,
    permProcurement: true,
    canAdd: true,
    canEdit: true,
    canDelete: true,
    status: 'Active',
    lastLogin: 'Yesterday, 04:15 PM'
  },
  {
    id: '3',
    username: 'raply.sales',
    fullName: 'Raply Vance',
    email: 'raply.v@afri-techs.com',
    role: 'Sales Manager',
    permAccount: false,
    permCRM: true,
    permProcurement: true,
    canAdd: true,
    canEdit: true,
    canDelete: false,
    status: 'Active',
    lastLogin: 'Today, 08:30 AM'
  },
  {
    id: '4',
    username: 'justin.proc',
    fullName: 'Justin Omondi',
    email: 'justin@afri-techs.com',
    role: 'Procurement Officer',
    permAccount: false,
    permCRM: false,
    permProcurement: true,
    canAdd: true,
    canEdit: true,
    canDelete: false,
    status: 'Active',
    lastLogin: '11-Nov-2026'
  },
  {
    id: '5',
    username: 'antony.ops',
    fullName: 'Antony Kiptoo',
    email: 'antony.k@afri-techs.com',
    role: 'Operator',
    permAccount: false,
    permCRM: true,
    permProcurement: false,
    canAdd: true,
    canEdit: false,
    canDelete: false,
    status: 'Active',
    lastLogin: '10-Nov-2026'
  }
];

export const initialPendingQuotations: PendingQuotation[] = [
  { id: '1', date: '11-Nov-2026', customerName: 'Société Minière de Boké (SMB)', enquiryRef: 'ENQ-2026-089', amount: 48500, status: 'Pending' },
  { id: '2', date: '09-Nov-2026', customerName: 'Compagnie des Bauxites de Guinée (CBG)', enquiryRef: 'ENQ-2026-084', amount: 125000, status: 'Review' },
  { id: '3', date: '08-Nov-2026', customerName: 'Simandou Winning Consortium', enquiryRef: 'ENQ-2026-077', amount: 94200, status: 'Pending' },
  { id: '4', date: '06-Nov-2026', customerName: 'Alufer Mining Guinea', enquiryRef: 'ENQ-2026-071', amount: 69000, status: 'Sent' }
];

export const initialPendingDeliveries: PendingDelivery[] = [
  { id: '1', soNumber: 'SO-2026-104', customerName: 'Simandou Rail Project', lpoRef: 'LPO/SIM/9021', dueDate: '15-Nov-2026', amount: 64200, status: 'Pending Dispatch' },
  { id: '2', soNumber: 'SO-2026-098', customerName: 'Port Autonome de Conakry', lpoRef: 'LPO-PAC-441', dueDate: '16-Nov-2026', amount: 28500, status: 'In Transit' },
  { id: '3', soNumber: 'SO-2026-092', customerName: 'Kamsar Port Mineral Terminal', lpoRef: 'KPMT/2026/088', dueDate: '18-Nov-2026', amount: 95000, status: 'Ready' }
];

export const initialExpiringDocs: ExpiringDoc[] = [
  { id: '1', holderName: 'Afri-Techs HQ (Conakry)', item: 'Registre du Commerce (RCCM) Renouvellement', expiryDate: '28-Nov-2026', daysRemaining: 15, status: 'Critical' },
  { id: '2', holderName: 'Boké Mining Fabrication Yard', item: 'Permis d Exploitation Industrielle et Minière', expiryDate: '15-Dec-2026', daysRemaining: 32, status: 'Warning' },
  { id: '3', holderName: 'Port Autonome Conakry Zone', item: 'Agrément Douanier et Portuaire', expiryDate: '30-Dec-2026', daysRemaining: 47, status: 'Warning' },
  { id: '4', holderName: 'Parc Industriel Matoto', item: 'Certificat de Conformité Environnementale', expiryDate: '15-Jan-2027', daysRemaining: 63, status: 'Good' }
];

// ACCOUNTS DATA
export const initialAccountHeads: AccountHead[] = [
  { id: '1', headCode: '1000', headName: 'Current Assets', type: 'Asset', description: 'Cash, bank, receivables and inventory', status: 'Active' },
  { id: '2', headCode: '1500', headName: 'Fixed Assets', type: 'Asset', description: 'Machinery, vehicles, buildings and tooling', status: 'Active' },
  { id: '3', headCode: '2000', headName: 'Current Liabilities', type: 'Liability', description: 'Accounts payable, tax liabilities, short term loans', status: 'Active' },
  { id: '4', headCode: '3000', headName: 'Shareholders Equity', type: 'Equity', description: 'Paid up capital, retained earnings and reserves', status: 'Active' },
  { id: '5', headCode: '4000', headName: 'Operating Revenue', type: 'Revenue', description: 'Sales invoices, fabrication services and engineering contracts', status: 'Active' },
  { id: '6', headCode: '5000', headName: 'Cost of Goods Sold (COGS)', type: 'Expense', description: 'Direct materials, raw steel, consumables, freight', status: 'Active' },
  { id: '7', headCode: '6000', headName: 'Administrative & General Expenses', type: 'Expense', description: 'Utilities, rent, software licenses, transport', status: 'Active' }
];

export const initialChartOfAccounts: ChartOfAccount[] = [
  { id: '1', accountCode: '1010-01', accountName: 'Ecobank Guinée - Compte Principal USD', headId: '1', headName: 'Current Assets', category: 'Asset', currency: 'USD', openingBalance: 420000, currentBalance: 584200, debitTotal: 1250000, creditTotal: 1085800, status: 'Active' },
  { id: '2', accountCode: '1010-02', accountName: 'Petty Cash - Coffre Siège Conakry', headId: '1', headName: 'Current Assets', category: 'Asset', currency: 'USD', openingBalance: 5000, currentBalance: 3450, debitTotal: 12000, creditTotal: 13550, status: 'Active' },
  { id: '3', accountCode: '1020-01', accountName: 'Créances Clients - Sociétés Minières', headId: '1', headName: 'Current Assets', category: 'Asset', currency: 'USD', openingBalance: 310000, currentBalance: 428000, debitTotal: 840000, creditTotal: 722000, status: 'Active' },
  { id: '4', accountCode: '1510-01', accountName: 'Découpeuses Plasma CNC Industrielles', headId: '2', headName: 'Fixed Assets', category: 'Asset', currency: 'USD', openingBalance: 280000, currentBalance: 245000, debitTotal: 0, creditTotal: 35000, status: 'Active' },
  { id: '5', accountCode: '2010-01', accountName: 'Dettes Fournisseurs - Aciers & Métaux', headId: '3', headName: 'Current Liabilities', category: 'Liability', currency: 'USD', openingBalance: 195000, currentBalance: 218500, debitTotal: 490000, creditTotal: 513500, status: 'Active' },
  { id: '6', accountCode: '2020-01', accountName: 'TVA à Payer (DGI Guinée)', headId: '3', headName: 'Current Liabilities', category: 'Liability', currency: 'USD', openingBalance: 24000, currentBalance: 38200, debitTotal: 65000, creditTotal: 79200, status: 'Active' },
  { id: '7', accountCode: '4010-01', accountName: 'Ventes Profilés & Charpentes Métalliques', headId: '5', headName: 'Operating Revenue', category: 'Revenue', currency: 'USD', openingBalance: 0, currentBalance: 1845000, debitTotal: 0, creditTotal: 1845000, status: 'Active' },
  { id: '8', accountCode: '5010-01', accountName: 'Achats Bobines & Poutrelles Acier Brut', headId: '6', headName: 'Cost of Goods Sold (COGS)', category: 'Expense', currency: 'USD', openingBalance: 0, currentBalance: 980000, debitTotal: 980000, creditTotal: 0, status: 'Active' }
];

export const initialReceipts: ReceiptVoucher[] = [
  {
    id: '1',
    voucherNo: 'RC-2026-081',
    referenceNo: 'RC-REF-2026-081',
    date: '12-Nov-2026',
    receivedFrom: 'Société Minière de Boké (SMB)',
    debitAccount: 'Ecobank Current Account (USD)',
    receiptNo: 'RCT-99120',
    collectedBy: 'Finance Officer',
    mode: 'Bank Transfer',
    bank: 'Ecobank Guinée - Siège Kaloum',
    chequeNo: '',
    chequeDate: '',
    accountHead: 'Trade Accounts Receivable',
    amount: 52400,
    narration: 'Settlement for Invoice #INV-2026-114',
    status: 'Approved',
    items: [
      {
        id: 'ri-1',
        slNo: 1,
        creditAccount: 'Société Minière de Boké (SMB)',
        amount: 52400,
        narration: 'Settlement for Invoice #INV-2026-114',
        linkedInvoices: [
          {
            id: 'li-1',
            invoiceNo: 'INV-2026-114',
            date: '28-Oct-2026',
            lpoRef: 'SMB-PO-8812',
            amount: 52400,
            receiptAmount: 52400
          }
        ]
      }
    ]
  },
  {
    id: '2',
    voucherNo: 'RC-2026-080',
    referenceNo: 'RC-REF-2026-080',
    date: '10-Nov-2026',
    receivedFrom: 'Compagnie des Bauxites de Guinée (CBG)',
    debitAccount: 'Société Générale de Banques en Guinée (USD)',
    receiptNo: 'RCT-88231',
    collectedBy: 'Accounts Team',
    mode: 'Cheque',
    bank: 'Société Générale Guinée',
    chequeNo: 'CHQ-890014',
    chequeDate: '10-Nov-2026',
    chequeCopy: 'cheque_890014.pdf',
    accountHead: 'Trade Accounts Receivable',
    amount: 38500,
    narration: '50% advance against Sales Order SO-2026-104',
    status: 'Approved',
    items: [
      {
        id: 'ri-2',
        slNo: 1,
        creditAccount: 'Compagnie des Bauxites de Guinée (CBG)',
        amount: 38500,
        narration: '50% advance against Sales Order SO-2026-104',
        linkedInvoices: [
          {
            id: 'li-2',
            invoiceNo: 'INV-2026-104',
            date: '02-Nov-2026',
            lpoRef: 'CBG-PO-4410',
            amount: 38500,
            receiptAmount: 38500
          }
        ]
      }
    ]
  },
  {
    id: '3',
    voucherNo: 'RC-2026-079',
    referenceNo: 'RC-REF-2026-079',
    date: '08-Nov-2026',
    receivedFrom: 'Simandou Winning Consortium',
    debitAccount: 'Ecobank Current Account (USD)',
    receiptNo: 'RCT-77402',
    collectedBy: 'Direct Bank Deposit',
    mode: 'Bank Transfer',
    bank: 'Ecobank Guinée - Siège Kaloum',
    chequeNo: '',
    chequeDate: '',
    accountHead: 'Trade Accounts Receivable',
    amount: 67000,
    narration: 'Full payment against Invoice #INV-2026-098',
    status: 'Approved',
    items: [
      {
        id: 'ri-3',
        slNo: 1,
        creditAccount: 'Simandou Winning Consortium',
        amount: 67000,
        narration: 'Full payment against Invoice #INV-2026-098',
        linkedInvoices: [
          {
            id: 'li-3',
            invoiceNo: 'INV-2026-098',
            date: '20-Oct-2026',
            lpoRef: 'SWC-PO-1092',
            amount: 67000,
            receiptAmount: 67000
          }
        ]
      }
    ]
  }
];

export const initialPayments: PaymentVoucher[] = [
  {
    id: '1',
    voucherNo: 'PV-2026-092',
    referenceNo: 'PV-REF-2026-092',
    date: '12-Nov-2026',
    paidTo: 'Global Metallurgical Corp',
    creditAccount: 'Ecobank Current Account (USD)',
    accountHead: 'Dettes Fournisseurs',
    mode: 'Bank Transfer',
    amount: 84000,
    narration: 'Raw steel billets container consignment #44',
    status: 'Approved',
    items: [
      {
        id: 'pi-1',
        slNo: 1,
        account: 'Global Metallurgical Corp',
        amount: 84000,
        narration: 'Raw steel billets container consignment #44',
        linkedInvoices: [
          {
            id: 'li-1',
            invoiceNo: 'PINV-2026-88',
            date: '25-Oct-2026',
            lpoRef: 'PO-2026-088',
            amount: 84000,
            paymentAmount: 84000
          }
        ]
      }
    ]
  },
  {
    id: '2',
    voucherNo: 'PV-2026-091',
    referenceNo: 'PV-REF-2026-091',
    date: '11-Nov-2026',
    paidTo: 'Gaz Industriels de Guinée SARL',
    creditAccount: 'Société Générale de Banques en Guinée (USD)',
    accountHead: 'Cost of Goods Sold (COGS)',
    mode: 'Cheque',
    chequeNo: 'CHQ-10029',
    chequeDate: '11-Nov-2026',
    chequeCopy: 'cheque_10029.pdf',
    amount: 9200,
    narration: 'Argon and Acetylene welding cylinders refill',
    status: 'Approved',
    items: [
      {
        id: 'pi-2',
        slNo: 1,
        account: 'Gaz Industriels de Guinée SARL',
        amount: 9200,
        narration: 'Argon and Acetylene welding cylinders refill',
        linkedInvoices: [
          {
            id: 'li-2',
            invoiceNo: 'PINV-2026-92',
            date: '01-Nov-2026',
            lpoRef: 'PO-2026-091',
            amount: 9200,
            paymentAmount: 9200
          }
        ]
      }
    ]
  },
  {
    id: '3',
    voucherNo: 'PV-2026-090',
    referenceNo: 'PV-REF-2026-090',
    date: '07-Nov-2026',
    paidTo: 'Electricité de Guinée (EDG)',
    creditAccount: 'Ecobank Current Account (USD)',
    accountHead: 'Administrative & General Expenses',
    mode: 'Bank Transfer',
    amount: 14500,
    narration: 'Usine Matoto electricity settlement',
    status: 'Approved',
    items: [
      {
        id: 'pi-3',
        slNo: 1,
        account: 'Electricité de Guinée (EDG)',
        amount: 14500,
        narration: 'Usine Matoto electricity settlement'
      }
    ]
  }
];

export const initialJournalVouchers: JournalVoucher[] = [
  { id: '1', jvNo: 'JV-2026-044', date: '12-Nov-2026', referenceNo: 'DEP-NOV-26', narration: 'Monthly straight-line depreciation for Conakry & Boké CNC machinery', debitAccount: 'Administrative & General Expenses', creditAccount: 'Industrial CNC Plasma Cutters', amount: 3500, status: 'Posted' },
  { id: '2', jvNo: 'JV-2026-043', date: '05-Nov-2026', referenceNo: 'ADJ-091', narration: 'Reallocation of freight charges to project Simandou #402', debitAccount: 'Cost of Goods Sold (COGS)', creditAccount: 'Current Assets', amount: 5800, status: 'Posted' }
];

export const initialPettyCash: PettyCashVoucher[] = [
  {
    id: '1',
    voucherNo: 'PCV-2026-031',
    referenceNo: 'PCV-REF-2026-031',
    date: '12-Nov-2026',
    custodian: 'Mamadou B.',
    creditAccount: 'Petty Cash Safe Float',
    mode: 'Cash',
    category: 'Workshop Consumables',
    amount: 340,
    narration: 'Emergency hardware & consumable tools purchase',
    status: 'Approved',
    items: [
      {
        id: 'pci-1',
        slNo: 1,
        salesOrder: 'SO-2026-104',
        debitAccount: 'Workshop Consumables',
        amount: 340,
        narration: 'Cutting discs & safety goggles for fabricators'
      }
    ]
  },
  {
    id: '2',
    voucherNo: 'PCV-2026-030',
    referenceNo: 'PCV-REF-2026-030',
    date: '10-Nov-2026',
    custodian: 'Mamadou B.',
    creditAccount: 'Petty Cash Safe Float',
    mode: 'Cash',
    category: 'Courier & Customs Port Clearance',
    amount: 185,
    narration: 'Port documentation express delivery fee',
    status: 'Reimbursed',
    items: [
      {
        id: 'pci-2',
        slNo: 1,
        salesOrder: 'SO-2026-105',
        debitAccount: 'Courier & Customs Port Clearance',
        amount: 185,
        narration: 'Port customs clearance courier fees'
      }
    ]
  }
];

export const initialBankRec: BankReconciliation = {
  id: '1',
  bankName: 'Ecobank Guinée - Siège Kaloum',
  accountNumber: 'ECO-GN-0029-4100-USD',
  statementDate: '31-Oct-2026',
  bankStatementBalance: 592800,
  ledgerBalance: 584200,
  unclearedDeposits: 22000,
  outstandingCheques: 30600,
  difference: 0,
  status: 'Reconciled'
};

// CRM DATA
export const initialProductHeads: ProductHead[] = [
  { id: '1', code: 'PH-BEAMS', name: 'Structural I & H Beams (Poutrelles)', description: 'Universal columns and heavy structural steel beams', totalProducts: 14 },
  { id: '2', code: 'PH-PLATES', name: 'Hot Rolled Steel Plates (Tôles Chaudes)', description: 'Carbon steel plates from 3mm to 50mm thickness', totalProducts: 22 },
  { id: '3', code: 'PH-PIPES', name: 'Heavy Mining Conduit Pipes (Tuyaux)', description: 'Heavy duty pressure and structural conduit piping', totalProducts: 18 },
  { id: '4', code: 'PH-REBAR', name: 'High-Tensile Deformed Rebar (Fers à Béton)', description: 'High tensile reinforcement bars grade 500B', totalProducts: 10 }
];

export const initialProducts: Product[] = [
  { id: '1', code: 'BEAM-UC-203', name: 'Universal Column 203x203x60kg/m - 12m', category: 'Structural I & H Beams (Poutrelles)', unit: 'Length (12m)', costPrice: 420, sellingPrice: 580, stockQty: 185, minAlertQty: 30, status: 'In Stock' },
  { id: '2', code: 'PLATE-HR-10MM', name: 'Hot Rolled Plate 10mm x 1500mm x 6000mm', category: 'Hot Rolled Steel Plates (Tôles Chaudes)', unit: 'Sheet', costPrice: 310, sellingPrice: 440, stockQty: 74, minAlertQty: 25, status: 'In Stock' },
  { id: '3', code: 'PIPE-SCH40-6IN', name: 'Seamless Steel Pipe Schedule 40 - 6" Dia', category: 'Heavy Mining Conduit Pipes (Tuyaux)', unit: '6m Pipe', costPrice: 190, sellingPrice: 285, stockQty: 18, minAlertQty: 20, status: 'Low Stock' },
  { id: '4', code: 'REBAR-T16-12M', name: 'High Tensile Rebar T16 (16mm) Grade 500B', category: 'High-Tensile Deformed Rebar (Fers à Béton)', unit: 'Metric Ton', costPrice: 710, sellingPrice: 890, stockQty: 240, minAlertQty: 50, status: 'In Stock' }
];

export const initialCustomers: Customer[] = [
  { id: '1', code: 'CUST-001', name: 'Société Minière de Boké (SMB)', contactPerson: 'Thierno Diallo', email: 'achats@smb-guinee.com', phone: '+224 622 10 20 30', trn: 'NIF-051283991A', creditLimit: 250000, outstandingBalance: 48500, paymentTerms: '30 Days Net', city: 'Boké', country: 'Guinea', status: 'Active' },
  { id: '2', code: 'CUST-002', name: 'Compagnie des Bauxites de Guinée (CBG)', contactPerson: 'Fatoumatou Bah', email: 'procurement@cbg-guinee.com', phone: '+224 628 49 01 20', trn: 'NIF-099281720B', creditLimit: 400000, outstandingBalance: 125000, paymentTerms: '60 Days Net', city: 'Kamsar', country: 'Guinea', status: 'Active' },
  { id: '3', code: 'CUST-003', name: 'Simandou Winning Consortium', contactPerson: 'Mohamed Camara', email: 'logistics@simandou-wc.com', phone: '+224 621 88 30 02', trn: 'NIF-018274900C', creditLimit: 500000, outstandingBalance: 94200, paymentTerms: '30 Days Net', city: 'Conakry', country: 'Guinea', status: 'Active' }
];

export const initialEnquiries: Enquiry[] = [
  { id: '1', refNo: 'ENQ-2026-089', date: '11-Nov-2026', customerName: 'Société Minière de Boké (SMB)', subject: 'Supply of 120x Heavy Mining H-Beams for Bauxite Terminal', estimatedValue: 48500, assignedTo: 'Raply Vance', status: 'In Progress' },
  { id: '2', refNo: 'ENQ-2026-088', date: '10-Nov-2026', customerName: 'Simandou Rail Project', subject: 'T16 & T20 High-tensile deformed rebar 180MT', estimatedValue: 145000, assignedTo: 'Raply Vance', status: 'New' }
];

export const initialSalesQuotations: SalesQuotation[] = [
  {
    id: '1',
    quotationNo: 'SQ-2026-118',
    date: '11-Nov-2026',
    customerName: 'Société Minière de Boké (SMB)',
    enquiryRef: 'ENQ-2026-089',
    validity: '30 Days',
    validUntil: '25-Nov-2026',
    paymentTerm: '30 Days Net',
    deliveryTerm: 'FOB Conakry Port',
    project: 'Bauxite Terminal Loading Berth Expansion',
    itemsCount: 2,
    items: [
      {
        id: 'sqi-1',
        slNo: 1,
        productId: '1',
        productDescription: 'Universal Column 203x203x60kg/m - 12m',
        unit: 'Length (12m)',
        quantity: 50,
        rate: 580,
        discount: 0,
        amount: 29000
      },
      {
        id: 'sqi-2',
        slNo: 2,
        productId: '2',
        productDescription: 'Hot Rolled Plate 10mm x 1500mm x 6000mm',
        unit: 'Sheet',
        quantity: 30,
        rate: 440,
        discount: 5,
        amount: 12540
      }
    ],
    subTotal: 41540,
    vatAmount: 6960,
    totalAmount: 48500,
    status: 'Sent'
  },
  {
    id: '2',
    quotationNo: 'SQ-2026-117',
    date: '09-Nov-2026',
    customerName: 'Compagnie des Bauxites de Guinée (CBG)',
    enquiryRef: 'ENQ-2026-084',
    validity: '15 Days',
    validUntil: '30-Nov-2026',
    paymentTerm: '100% LC at Sight',
    deliveryTerm: 'Door Delivery Kamsar',
    project: 'Conveyor Structure Retrofit Stage 2',
    itemsCount: 1,
    items: [
      {
        id: 'sqi-3',
        slNo: 1,
        productId: '4',
        productDescription: 'High Tensile Rebar T16 (16mm) Grade 500B',
        unit: 'Metric Ton',
        quantity: 140,
        rate: 890,
        discount: 0,
        amount: 124600
      }
    ],
    subTotal: 124600,
    vatAmount: 400,
    totalAmount: 125000,
    status: 'Draft'
  }
];

export const initialSalesOrders: SalesOrder[] = [
  {
    id: '1',
    soNo: 'SO-2026-104',
    orderNo: 'SO-2026-104',
    date: '06-Nov-2026',
    customerName: 'Simandou Rail Project',
    lpoRef: 'LPO/SIM/9021',
    quotationRef: 'SQ-2026-115',
    paymentTerm: '30 Days Net',
    deliveryDate: '15-Nov-2026',
    expectedDelivery: '15-Nov-2026',
    project: 'Simandou Rail Corridor Package A',
    itemsCount: 2,
    items: [
      {
        id: 'soi-1',
        slNo: 1,
        productId: '4',
        productDescription: 'High Tensile Rebar T16 (16mm) Grade 500B',
        unit: 'Metric Ton',
        quantity: 60,
        rate: 890,
        discount: 0,
        amount: 53400
      },
      {
        id: 'soi-2',
        slNo: 2,
        productId: '1',
        productDescription: 'Universal Column 203x203x60kg/m - 12m',
        unit: 'Length (12m)',
        quantity: 18,
        rate: 580,
        discount: 5,
        amount: 9918
      }
    ],
    subTotal: 63318,
    vatAmount: 882,
    totalAmount: 64200,
    deliveryStatus: 'Pending',
    paymentStatus: 'Partial',
    status: 'Confirmed'
  },
  {
    id: '2',
    soNo: 'SO-2026-098',
    orderNo: 'SO-2026-098',
    date: '01-Nov-2026',
    customerName: 'Port Autonome de Conakry',
    lpoRef: 'LPO-PAC-441',
    quotationRef: 'SQ-2026-108',
    paymentTerm: 'Immediate Bank Transfer',
    deliveryDate: '10-Nov-2026',
    expectedDelivery: '10-Nov-2026',
    project: 'Kaloum Port Quayside Pavement Reinforcement',
    itemsCount: 1,
    items: [
      {
        id: 'soi-3',
        slNo: 1,
        productId: '2',
        productDescription: 'Hot Rolled Plate 10mm x 1500mm x 6000mm',
        unit: 'Sheet',
        quantity: 65,
        rate: 440,
        discount: 0,
        amount: 28600
      }
    ],
    subTotal: 28600,
    vatAmount: 0,
    totalAmount: 28500,
    deliveryStatus: 'Delivered',
    paymentStatus: 'Paid',
    status: 'Delivered'
  }
];

export const initialProFormaInvoices: ProFormaInvoice[] = [
  {
    id: '1',
    pfNo: 'PI-2026-085',
    referenceNo: 'PI-2026-085',
    date: '08-Nov-2026',
    customerName: 'Simandou Rail Project',
    salesOrderNo: 'SO-2026-104',
    lpoRef: 'LPO/SIM/9021',
    paymentTerms: '30 Days Net / 50% Advance',
    deliveryTerms: 'FOB Conakry Port',
    project: 'Simandou Rail Corridor Package A',
    totalOrderValue: 64200,
    currentClaimPercent: 50,
    currentClaimValue: 32100,
    subTotal: 32100,
    vatAmount: 5778,
    items: [
      {
        id: 'pfi-1',
        slNo: 1,
        productId: '4',
        productDescription: 'High Tensile Rebar T16 (16mm) Grade 500B',
        unit: 'Metric Ton',
        quantity: 60,
        rate: 890,
        discount: 0,
        amount: 53400
      },
      {
        id: 'pfi-2',
        slNo: 2,
        productId: '1',
        productDescription: 'Universal Column 203x203x60kg/m - 12m',
        unit: 'Length (12m)',
        quantity: 18,
        rate: 580,
        discount: 5,
        amount: 9918
      }
    ],
    status: 'Sent'
  },
  {
    id: '2',
    pfNo: 'PI-2026-084',
    referenceNo: 'PI-2026-084',
    date: '03-Nov-2026',
    customerName: 'Port Autonome de Conakry',
    salesOrderNo: 'SO-2026-098',
    lpoRef: 'LPO-PAC-441',
    paymentTerms: 'Immediate Bank Transfer',
    deliveryTerms: 'Door Delivery Conakry',
    project: 'Kaloum Port Quayside Pavement Reinforcement',
    totalOrderValue: 28500,
    currentClaimPercent: 100,
    currentClaimValue: 28500,
    subTotal: 28500,
    vatAmount: 5130,
    items: [
      {
        id: 'pfi-3',
        slNo: 1,
        productId: '2',
        productDescription: 'Hot Rolled Plate 10mm x 1500mm x 6000mm',
        unit: 'Sheet',
        quantity: 65,
        rate: 440,
        discount: 0,
        amount: 28600
      }
    ],
    status: 'Approved'
  }
];

export const initialDeliveryNotes: DeliveryNote[] = [
  {
    id: '1',
    dnNo: 'DN-2026-095',
    date: '10-Nov-2026',
    customerName: 'Port Autonome de Conakry',
    soRef: 'SO-2026-098',
    salesOrderNo: 'SO-2026-098',
    lpoRef: 'PAC-LPO-9921',
    paymentTerms: '30 Days Net',
    project: 'Kaloum Port Expansion Project',
    shippingAddress: 'Quai Minéralier, Terminal Kaloum, Conakry',
    vehicleNo: 'RC-9901-A (Mercedes 40T)',
    driverName: 'Sekou Traore',
    itemsDelivered: 45,
    itemsCount: 2,
    amount: 18500,
    status: 'Delivered',
    items: [
      {
        id: 'dni-1',
        slNo: 1,
        productId: 'PROD-001',
        productDescription: 'High-Tensile Deformed Rebar Fe500D (12mm)',
        unit: 'MT',
        orderQty: 30,
        deliveredQty: 10,
        currentDelivery: 20,
        rate: 850,
        amount: 17000
      },
      {
        id: 'dni-2',
        slNo: 2,
        productId: 'PROD-002',
        productDescription: 'Mild Steel Equal Angle 50x50x5mm',
        unit: 'MT',
        orderQty: 5,
        deliveredQty: 3,
        currentDelivery: 2,
        rate: 750,
        amount: 1500
      }
    ]
  }
];

export const initialSalesInvoices: SalesInvoice[] = [
  {
    id: '1',
    invoiceNo: 'CSH-2026-107',
    date: '10-Nov-2026',
    invoiceType: 'Cash',
    customerName: 'Port Autonome de Conakry',
    creditAccount: 'Cash in Hand - Conakry Central',
    soRef: 'SO-2026-098',
    salesOrderRef: 'SO-2026-098',
    lpoRef: 'PAC-LPO-9921',
    paymentTerms: 'Cash on Delivery',
    project: 'Kaloum Port Expansion Project',
    dueDate: '10-Nov-2026',
    totalAmount: 28500,
    paidAmount: 28500,
    advanceAmount: 10000,
    balanceDue: 0,
    status: 'Paid',
    items: [
      {
        id: 'cii-1',
        slNo: 1,
        productId: 'PROD-001',
        productDescription: 'High-Tensile Deformed Rebar Fe500D (12mm)',
        unit: 'MT',
        quantity: 30,
        rate: 850,
        discount: 0,
        amount: 25500
      },
      {
        id: 'cii-2',
        slNo: 2,
        productId: 'PROD-003',
        productDescription: 'Square Hollow Section 100x100x4mm',
        unit: 'MT',
        quantity: 3,
        rate: 1000,
        discount: 0,
        amount: 3000
      }
    ]
  },
  {
    id: '2',
    invoiceNo: 'INV-2026-113',
    date: '07-Nov-2026',
    invoiceType: 'Credit',
    customerName: 'Simandou Rail Project',
    creditAccount: 'Accounts Receivable',
    soRef: 'SO-2026-104',
    salesOrderRef: 'SO-2026-104',
    lpoRef: 'SIM-PO-4481',
    paymentTerms: '30 Days Net',
    project: 'Simandou Corridor Phase 1',
    dueDate: '07-Dec-2026',
    totalAmount: 64200,
    paidAmount: 38500,
    advanceAmount: 0,
    balanceDue: 25700,
    status: 'Partially Paid',
    items: [
      {
        id: 'cii-3',
        slNo: 1,
        productId: 'PROD-005',
        productDescription: 'Heavy Wide Flange H-Beam 250x250',
        unit: 'MT',
        quantity: 60,
        rate: 1070,
        discount: 0,
        amount: 64200
      }
    ]
  }
];

export const initialSalesReturns: SalesReturn[] = [
  {
    id: '1',
    returnNo: 'SR-2026-009',
    date: '09-Nov-2026',
    invoiceNo: 'INV-2026-113',
    customerName: 'Simandou Rail Project',
    debitAccount: 'Accounts Receivable',
    lpoRef: 'SIM-PO-4481',
    paymentTerms: '30 Days Net',
    project: 'Simandou Corridor Phase 1',
    reason: 'Dimensional tolerance mismatch on 3x universal beams',
    amount: 3840,
    status: 'Processed',
    items: [
      {
        id: 'sri-1',
        slNo: 1,
        productId: 'PROD-005',
        productDescription: 'Heavy Wide Flange H-Beam 250x250',
        unit: 'MT',
        quantity: 3,
        rate: 1070,
        discount: 0,
        amount: 3210
      },
      {
        id: 'sri-2',
        slNo: 2,
        productId: 'PROD-001',
        productDescription: 'High-Tensile Deformed Rebar Fe500D (12mm)',
        unit: 'MT',
        quantity: 1,
        rate: 630,
        discount: 0,
        amount: 630
      }
    ]
  }
];

// PROCUREMENT DATA
export const initialVendors: Vendor[] = [
  { id: '1', vendorCode: 'VEND-001', name: 'Global Metallurgical Corp', postBox: 'P.O. Box 48192', category: 'Raw Steel Billets & Coils', phone: '+971 4 881 9200', email: 'sales@global-metals.ae', taxNo: 'TRN-100294829', city: 'Dubai', country: 'UAE', paymentTerms: 'LC at Sight', status: 'Active' },
  { id: '2', vendorCode: 'VEND-002', name: 'Gaz Industriels de Guinée SARL', postBox: 'BP 1024 Conakry', category: 'Industrial Gases & Welding', phone: '+224 620 89 20 01', email: 'orders@gazguinee.com', taxNo: 'NIF-051928301X', city: 'Conakry', country: 'Guinea', paymentTerms: '30 Days Net', status: 'Active' },
  { id: '3', vendorCode: 'VEND-003', name: 'Quincaillerie & Outillage de Guinée', postBox: 'BP 882 Conakry', category: 'Cutting Tools & Consumables', phone: '+224 621 88 31 92', email: 'ventes@qog-guinee.com', taxNo: 'NIF-019283740Y', city: 'Conakry', country: 'Guinea', paymentTerms: '15 Days Net', status: 'Active' }
];

export const initialMaterialRequisitions: MaterialRequisition[] = [
  {
    id: '1',
    mrNo: 'MR-2026-052',
    date: '12-Nov-2026',
    timeFrame: '25-Nov-2026',
    assignedTo: 'Fabrication Plant 1',
    requestedBy: 'Chef d Atelier Conakry',
    department: 'Fabrication Plant Matoto',
    priority: 'Urgent',
    itemsSummary: '200x CNC Plasma consumable nozzles, 40kg flux welding wire',
    status: 'Approved',
    items: [
      {
        id: 'mri-1',
        slNo: 1,
        salesOrderNo: 'SO-2026-104',
        productId: '1',
        productDescription: 'Universal Column 203x203x60kg/m - 12m',
        unit: 'Length (12m)',
        quantity: 20
      },
      {
        id: 'mri-2',
        slNo: 2,
        salesOrderNo: 'SO-2026-098',
        productId: '2',
        productDescription: 'Hot Rolled Plate 10mm x 1500mm x 6000mm',
        unit: 'Sheet',
        quantity: 15
      }
    ]
  },
  {
    id: '2',
    mrNo: 'MR-2026-051',
    date: '09-Nov-2026',
    timeFrame: '20-Nov-2026',
    assignedTo: 'Civil Engineering',
    requestedBy: 'Ingénieur Ouvrages Boké',
    department: 'Civil Engineering',
    priority: 'High',
    itemsSummary: '65 MT S355JR Heavy Structural Beams for Simandou project',
    status: 'PO Created',
    items: [
      {
        id: 'mri-3',
        slNo: 1,
        salesOrderNo: 'SO-2026-105',
        productId: '4',
        productDescription: 'High Tensile Rebar T16 (16mm) Grade 500B',
        unit: 'Metric Ton',
        quantity: 65
      }
    ]
  }
];

export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    poNo: 'PO-2026-074',
    date: '10-Nov-2026',
    vendorName: 'Global Metallurgical Corp',
    mrRef: 'MR-2026-051',
    paymentTerm: '30 Days Net',
    deliveryDueDate: '28-Nov-2026',
    vendorRef: 'GMC-QUOT-902',
    totalAmount: 84000,
    status: 'Issued',
    items: [
      {
        id: 'poi-1',
        slNo: 1,
        salesOrderNo: 'SO-2026-105',
        productId: '4',
        productDescription: 'High Tensile Rebar T16 (16mm) Grade 500B',
        unit: 'Metric Ton',
        quantity: 65,
        rate: 1292.3,
        discount: 0,
        amount: 84000
      }
    ]
  },
  {
    id: '2',
    poNo: 'PO-2026-073',
    date: '07-Nov-2026',
    vendorName: 'Gaz Industriels de Guinée SARL',
    mrRef: 'MR-2026-052',
    paymentTerm: '15 Days Net',
    deliveryDueDate: '12-Nov-2026',
    vendorRef: 'GIG-REF-441',
    totalAmount: 9200,
    status: 'Fulfilled',
    items: [
      {
        id: 'poi-2',
        slNo: 1,
        salesOrderNo: 'SO-2026-098',
        productId: '2',
        productDescription: 'Hot Rolled Plate 10mm x 1500mm x 6000mm',
        unit: 'Sheet',
        quantity: 20,
        rate: 460,
        discount: 0,
        amount: 9200
      }
    ]
  }
];

export const initialMRNs: MaterialReceivedNote[] = [
  {
    id: '1',
    mrnNo: 'MRN-2026-068',
    date: '11-Nov-2026',
    vendorName: 'Gaz Industriels de Guinée SARL',
    poRef: 'PO-2026-073',
    deliveryNote: 'DN-GIG-8821',
    mrRef: 'MR-2026-052',
    paymentTerm: '15 Days Net',
    amount: 9200,
    storeLocation: 'Magasin Bouteilles Matoto',
    acceptedItems: 20,
    rejectedItems: 0,
    inspectedBy: 'Contrôleur Qualité - Fode',
    status: 'Verified',
    items: [
      {
        id: 'mrni-1',
        slNo: 1,
        salesOrderNo: 'SO-2026-098',
        productId: '2',
        productDescription: 'Hot Rolled Plate 10mm x 1500mm x 6000mm',
        unit: 'Sheet',
        orderQty: 20,
        deliveredQty: 0,
        currentDelivery: 20,
        rate: 460,
        amount: 9200
      }
    ]
  }
];

export const initialPurchaseVouchers: PurchaseVoucher[] = [
  {
    id: '1',
    pvNo: 'PVCH-2026-055',
    date: '11-Nov-2026',
    vendorName: 'Gaz Industriels de Guinée SARL',
    vendorInvoiceNo: 'GIG-INV-8891',
    paymentTerm: '15 Days Net',
    poRef: 'PO-2026-073',
    totalAmount: 10520,
    dueDate: '11-Dec-2026',
    status: 'Unpaid',
    items: [
      {
        id: 'pvi-1',
        slNo: 1,
        salesOrderNo: 'SO-2026-098',
        productId: '2',
        productDescription: 'Hot Rolled Plate 10mm x 1500mm x 6000mm',
        debitAccount: 'Cost of Goods Sold - Raw Materials',
        quantity: 20,
        unit: 'Sheet',
        rate: 460,
        discount: 0,
        amount: 9200
      },
      {
        id: 'pvi-1b',
        slNo: 2,
        salesOrderNo: 'SO-2026-098',
        productId: '6',
        productDescription: 'Industrial Oxygen & Acetylene Cylinders (50L)',
        debitAccount: 'Cost of Goods Sold - Raw Materials',
        quantity: 12,
        unit: 'Bottle',
        rate: 110,
        discount: 0,
        amount: 1320
      }
    ]
  },
  {
    id: '2',
    pvNo: 'PVCH-2026-054',
    date: '06-Nov-2026',
    vendorName: 'Quincaillerie & Outillage de Guinée',
    vendorInvoiceNo: 'QOG-2026-102',
    paymentTerm: '30 Days Net',
    poRef: 'PO-2026-074',
    totalAmount: 6875,
    dueDate: '21-Nov-2026',
    status: 'Paid',
    items: [
      {
        id: 'pvi-2',
        slNo: 1,
        salesOrderNo: 'SO-2026-105',
        productId: '4',
        productDescription: 'High Tensile Rebar T16 (16mm) Grade 500B',
        debitAccount: 'Cost of Goods Sold - Raw Materials',
        quantity: 5,
        unit: 'Metric Ton',
        rate: 970,
        discount: 0,
        amount: 4850
      },
      {
        id: 'pvi-2b',
        slNo: 2,
        salesOrderNo: 'SO-2026-105',
        productId: '3',
        productDescription: 'Mild Steel Equal Angle 50x50x5mm (6m)',
        debitAccount: 'Cost of Goods Sold - Raw Materials',
        quantity: 15,
        unit: 'Piece',
        rate: 65,
        discount: 0,
        amount: 975
      },
      {
        id: 'pvi-2c',
        slNo: 3,
        salesOrderNo: 'SO-2026-105',
        productId: '8',
        productDescription: 'Welding Electrodes E6013 3.2mm (5kg Box)',
        debitAccount: 'Cost of Goods Sold - Raw Materials',
        quantity: 25,
        unit: 'Box',
        rate: 42,
        discount: 0,
        amount: 1050
      }
    ]
  }
];

export const initialPurchaseReturns: PurchaseReturn[] = [
  {
    id: '1',
    prNo: 'PR-2026-004',
    date: '07-Nov-2026',
    vendorName: 'Quincaillerie & Outillage de Guinée',
    vendorInvRef: 'QOG-2026-102',
    lpoRef: 'PO-2026-074',
    paymentTerm: '30 Days Net',
    vendorRef: 'VREF-9921',
    debitNoteAmount: 970,
    reason: 'Defective surface finish on 1x bundle',
    status: 'Approved',
    items: [
      {
        id: 'pri-1',
        slNo: 1,
        salesOrderNo: 'SO-2026-105',
        productId: '4',
        productDescription: 'High Tensile Rebar T16 (16mm) Grade 500B',
        creditAccount: 'Cost of Goods Sold - Raw Materials',
        quantity: 1,
        unit: 'Metric Ton',
        rate: 970,
        discount: 0,
        amount: 970
      }
    ]
  }
];

export const initialFixedAssets: FixedAsset[] = [
  { id: '1', assetCode: 'FA-CNC-001', assetName: 'Messer Hypertherm CNC Gantry Plasma Cutting System', category: 'Heavy Workshop Machinery', purchaseDate: '2021-03-15', purchaseCost: 185000, depreciationRate: 10, accumulatedDepreciation: 74000, currentBookValue: 111000, status: 'In Use' },
  { id: '2', assetCode: 'FA-CRANE-002', assetName: 'Konecranes 25-Ton Double Girder Overhead Crane (Port Yard)', category: 'Lifting & Rigging Equipment', purchaseDate: '2020-08-20', purchaseCost: 165000, depreciationRate: 8, accumulatedDepreciation: 66000, currentBookValue: 99000, status: 'In Use' },
  { id: '3', assetCode: 'FA-FORK-003', assetName: 'Toyota 10-Ton Heavy Duty Diesel Forklift', category: 'Material Handling Equipment', purchaseDate: '2022-01-10', purchaseCost: 65000, depreciationRate: 15, accumulatedDepreciation: 29250, currentBookValue: 35750, status: 'In Use' }
];
