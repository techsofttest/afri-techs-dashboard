'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  FileCheck,
  CreditCard,
  Building,
  Eye,
  Trash2,
  Edit,
  ArrowUpDown,
  X,
  Check,
  Link2,
  FileText
} from 'lucide-react';
import Modal from '@/components/Modal';
import AccountsReports from '@/components/reports/AccountsReports';
import { FileSpreadsheet } from 'lucide-react';
import {
  initialAccountHeads,
  initialChartOfAccounts,
  initialReceipts,
  initialPayments,
  initialPettyCash
} from '@/lib/mock-data';
import {
  AccountHead,
  ChartOfAccount,
  ReceiptVoucher,
  PaymentVoucher,
  PettyCashVoucher
} from '@/lib/types';

export default function AccountsPage() {
  const [activeSection, setActiveSection] = useState<'Accounts' | 'Reports'>('Accounts');
  const [activeTab, setActiveTab] = useState<
    'AccountHead' | 'ChartsOfAccounts' | 'Receipts' | 'Payments' | 'PettyCashVoucher'
  >('AccountHead');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'reports' || params.get('tab') === 'Reports') {
        setActiveSection('Reports');
      }
    }
  }, []);

  // State
  const [accountHeads, setAccountHeads] = useState<AccountHead[]>(initialAccountHeads);
  const [chartOfAccounts, setChartOfAccounts] = useState<ChartOfAccount[]>(initialChartOfAccounts);
  const [receipts, setReceipts] = useState<ReceiptVoucher[]>(initialReceipts);
  const [payments, setPayments] = useState<PaymentVoucher[]>(initialPayments);
  const [pettyCash, setPettyCash] = useState<PettyCashVoucher[]>(initialPettyCash);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>('');

  // Editing state tracking IDs
  const [editingReceiptId, setEditingReceiptId] = useState<string | null>(null);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [editingPettyCashId, setEditingPettyCashId] = useState<string | null>(null);
  const [editingAccountHeadId, setEditingAccountHeadId] = useState<string | null>(null);
  const [editingCOAId, setEditingCOAId] = useState<string | null>(null);

  // Form states for modals
  const [newHeadName, setNewHeadName] = useState('');
  const [newHeadType, setNewHeadType] = useState<'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense'>('Asset');
  const [newHeadCode, setNewHeadCode] = useState('');

  const [newCOAName, setNewCOAName] = useState('');
  const [newCOAHead, setNewCOAHead] = useState('');
  const [newCOACode, setNewCOACode] = useState('');

  // Receipt Add/Edit Form State (Replicated from steel_erp receipts.php)
  const [receiptRefNo, setReceiptRefNo] = useState('');
  const [receiptDate, setReceiptDate] = useState('18-Nov-2026');
  const [receiptDebitAccount, setReceiptDebitAccount] = useState('Ecobank Current Account (USD)');
  const [receiptNo, setReceiptNo] = useState('');
  const [receiptCollectedBy, setReceiptCollectedBy] = useState('Finance Officer');
  const [receiptMethod, setReceiptMethod] = useState<'Bank Transfer' | 'Cash' | 'Cheque'>('Bank Transfer');
  const [receiptChequeNo, setReceiptChequeNo] = useState('');
  const [receiptChequeDate, setReceiptChequeDate] = useState('18-Nov-2026');
  const [receiptChequeCopy, setReceiptChequeCopy] = useState('');

  // Credit Account dynamic rows (add_more_container in steel_erp)
  interface CreditRowState {
    id: string;
    creditAccount: string;
    amount: string;
    narration: string;
    linkedInvoices: Array<{
      id: string;
      invoiceNo: string;
      date: string;
      lpoRef: string;
      amount: number;
      receiptAmount: number;
      selected: boolean;
    }>;
  }

  const [creditRows, setCreditRows] = useState<CreditRowState[]>([
    {
      id: '1',
      creditAccount: '',
      amount: '',
      narration: '',
      linkedInvoices: []
    }
  ]);

  // Invoice Linking Modal State (InvoicesModal in steel_erp)
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [currentLinkingRowIndex, setCurrentLinkingRowIndex] = useState<number | null>(null);
  const [linkingInvoices, setLinkingInvoices] = useState<Array<{
    id: string;
    invoiceNo: string;
    date: string;
    lpoRef: string;
    amount: number;
    receiptAmount: number;
    selected: boolean;
  }>>([]);

  // View Receipt Modal State (ViewModal in steel_erp)
  const [viewReceiptModalOpen, setViewReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptVoucher | null>(null);

  // Credit Account List
  const customerCreditAccounts = [
    'Société Minière de Boké (SMB)',
    'Compagnie des Bauxites de Guinée (CBG)',
    'Simandou Winning Consortium',
    'Conakry Terminal SA',
    'Guinean Mining Consortium',
    'Alpha Construction Co',
    'Boffa Bauxite Port Logistics',
    'Alliance Mining Transporters',
    'Apex Steel & Structures Ltd',
    'Trade Accounts Receivable'
  ];

  const debitAccountOptions = [
    'Ecobank Current Account (USD)',
    'Société Générale de Banques en Guinée (USD)',
    'Vista Bank Conakry (GNF/USD)',
    'Standard Chartered Bank (USD)',
    'UBA Guinea (USD)',
    'Petty Cash Account'
  ];

  const collectorOptions = [
    'Finance Officer',
    'Accounts Team',
    'Direct Bank Deposit',
    'Field Cashier',
    'Executive Office'
  ];

  const openAddReceiptModal = () => {
    setEditingReceiptId(null);
    setReceiptRefNo(`RC-REF-2026-${String(receipts.length + 82).padStart(3, '0')}`);
    setReceiptDate('18-Nov-2026');
    setReceiptDebitAccount('');
    setReceiptNo('');
    setReceiptCollectedBy('');
    setReceiptMethod('Bank Transfer');
    setReceiptChequeNo('');
    setReceiptChequeDate('18-Nov-2026');
    setReceiptChequeCopy('');
    setCreditRows([
      {
        id: '1',
        creditAccount: '',
        amount: '',
        narration: '',
        linkedInvoices: []
      }
    ]);
    setModalType('AddReceipt');
    setModalOpen(true);
  };

  const openEditReceiptModal = (rec: ReceiptVoucher) => {
    setEditingReceiptId(rec.id);
    setReceiptRefNo(rec.referenceNo || rec.voucherNo);
    setReceiptDate(rec.date);
    setReceiptDebitAccount(rec.debitAccount || '');
    setReceiptNo(rec.receiptNo || '');
    setReceiptCollectedBy(rec.collectedBy || '');
    setReceiptMethod((rec.mode as any) || 'Bank Transfer');
    setReceiptChequeNo(rec.chequeNo || '');
    setReceiptChequeDate(rec.chequeDate || rec.date);
    setReceiptChequeCopy(rec.chequeCopy || '');
    if (rec.items && rec.items.length > 0) {
      setCreditRows(
        rec.items.map((it, idx) => ({
          id: String(idx + 1),
          creditAccount: it.creditAccount,
          amount: String(it.amount),
          narration: it.narration || rec.narration || '',
          linkedInvoices: (it.linkedInvoices || []).map((inv) => ({
            id: inv.id,
            invoiceNo: inv.invoiceNo,
            date: inv.date,
            lpoRef: inv.lpoRef || '',
            amount: inv.amount,
            receiptAmount: inv.receiptAmount,
            selected: true
          }))
        }))
      );
    } else {
      setCreditRows([
        {
          id: '1',
          creditAccount: rec.receivedFrom,
          amount: String(rec.amount),
          narration: rec.narration || '',
          linkedInvoices: []
        }
      ]);
    }
    setModalType('AddReceipt');
    setModalOpen(true);
  };

  const handleAddCreditRow = () => {
    setCreditRows([
      ...creditRows,
      {
        id: String(Date.now()),
        creditAccount: '',
        amount: '',
        narration: '',
        linkedInvoices: []
      }
    ]);
  };

  const handleRemoveCreditRow = (index: number) => {
    if (creditRows.length <= 1) return;
    setCreditRows(creditRows.filter((_, i) => i !== index));
  };

  const handleCreditRowChange = (index: number, field: keyof CreditRowState, value: any) => {
    const updated = [...creditRows];
    updated[index] = { ...updated[index], [field]: value };
    setCreditRows(updated);
  };

  const handleOpenLinkModal = (index: number) => {
    const row = creditRows[index];
    if (!row.creditAccount) {
      alert('Please select Credit Account first!');
      return;
    }
    const amt = parseFloat(row.amount);
    if (!amt || amt <= 0) {
      alert('Please enter Amount first!');
      return;
    }

    setCurrentLinkingRowIndex(index);

    if (row.linkedInvoices && row.linkedInvoices.length > 0) {
      setLinkingInvoices(row.linkedInvoices);
    } else {
      const acronym = row.creditAccount
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 4);

      const candidateInvoices = [
        {
          id: 'inv-1',
          invoiceNo: `INV-2026-${Math.floor(110 + index * 10)}`,
          date: '28-Oct-2026',
          lpoRef: `${acronym}-PO-8812`,
          amount: Math.max(amt, 45000),
          receiptAmount: amt,
          selected: true
        },
        {
          id: 'inv-2',
          invoiceNo: `INV-2026-${Math.floor(125 + index * 10)}`,
          date: '04-Nov-2026',
          lpoRef: `${acronym}-PO-9140`,
          amount: 28000,
          receiptAmount: 0,
          selected: false
        },
        {
          id: 'inv-3',
          invoiceNo: `INV-2026-${Math.floor(138 + index * 10)}`,
          date: '10-Nov-2026',
          lpoRef: `${acronym}-PO-9520`,
          amount: 19500,
          receiptAmount: 0,
          selected: false
        }
      ];
      setLinkingInvoices(candidateInvoices);
    }

    setLinkModalOpen(true);
  };

  const handleFifoAllocation = () => {
    if (currentLinkingRowIndex === null) return;
    const targetAmount = parseFloat(creditRows[currentLinkingRowIndex].amount) || 0;
    let remaining = targetAmount;

    const updated = linkingInvoices.map((inv) => {
      if (remaining <= 0) {
        return { ...inv, receiptAmount: 0, selected: false };
      }
      const allocated = Math.min(remaining, inv.amount);
      remaining -= allocated;
      return {
        ...inv,
        receiptAmount: allocated,
        selected: allocated > 0
      };
    });

    setLinkingInvoices(updated);
  };

  const handleAdvanceAllocation = () => {
    if (currentLinkingRowIndex === null) return;
    const targetAmount = parseFloat(creditRows[currentLinkingRowIndex].amount) || 0;
    const currentAdjusted = linkingInvoices.reduce(
      (sum, item) => (item.selected ? sum + item.receiptAmount : sum),
      0
    );
    const balance = Math.max(0, targetAmount - currentAdjusted);
    if (balance > 0) {
      alert(`Remaining unallocated balance of $${balance.toLocaleString()} registered as Customer Advance!`);
    } else {
      alert('Total amount is already fully allocated across selected invoices.');
    }
  };

  const handleInvoiceCheckChange = (index: number, checked: boolean) => {
    if (currentLinkingRowIndex === null) return;
    const targetAmount = parseFloat(creditRows[currentLinkingRowIndex].amount) || 0;
    const updated = [...linkingInvoices];
    if (checked) {
      const otherTotal = updated.reduce(
        (sum, item, idx) => (idx !== index && item.selected ? sum + item.receiptAmount : sum),
        0
      );
      const available = Math.max(0, targetAmount - otherTotal);
      const allocated = Math.min(available, updated[index].amount);
      updated[index] = { ...updated[index], selected: true, receiptAmount: allocated };
    } else {
      updated[index] = { ...updated[index], selected: false, receiptAmount: 0 };
    }
    setLinkingInvoices(updated);
  };

  const handleInvoiceAmountChange = (index: number, val: string) => {
    const num = parseFloat(val) || 0;
    const updated = [...linkingInvoices];
    updated[index] = {
      ...updated[index],
      receiptAmount: num,
      selected: num > 0
    };
    setLinkingInvoices(updated);
  };

  const handleSaveLinking = () => {
    if (currentLinkingRowIndex === null) return;
    const updatedRows = [...creditRows];
    updatedRows[currentLinkingRowIndex] = {
      ...updatedRows[currentLinkingRowIndex],
      linkedInvoices: linkingInvoices
    };
    setCreditRows(updatedRows);
    setLinkModalOpen(false);
  };

  // Add / Edit Receipt Submit
  const handleSaveReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptRefNo) {
      alert('Please enter Reference Number!');
      return;
    }
    const validRows = creditRows.filter((r) => r.creditAccount && Number(r.amount) > 0);
    if (validRows.length === 0) {
      alert('Please select at least one Credit Account and enter an Amount!');
      return;
    }

    const totalAmount = validRows.reduce((sum, r) => sum + Number(r.amount), 0);

    if (editingReceiptId) {
      setReceipts(
        receipts.map((r) =>
          r.id === editingReceiptId
            ? {
              ...r,
              voucherNo: receiptRefNo,
              referenceNo: receiptRefNo,
              date: receiptDate,
              receivedFrom: validRows.map((row) => row.creditAccount).join(', '),
              debitAccount: receiptDebitAccount,
              receiptNo: receiptNo || r.receiptNo,
              collectedBy: receiptCollectedBy,
              mode: receiptMethod,
              chequeNo: receiptMethod === 'Cheque' ? receiptChequeNo : undefined,
              chequeDate: receiptMethod === 'Cheque' ? receiptChequeDate : undefined,
              chequeCopy: receiptMethod === 'Cheque' ? (receiptChequeCopy || 'cheque_scan.pdf') : undefined,
              amount: totalAmount,
              narration: validRows[0].narration || 'Customer receipt payment',
              items: validRows.map((row, i) => ({
                id: `ri-${Date.now()}-${i}`,
                slNo: i + 1,
                creditAccount: row.creditAccount,
                amount: Number(row.amount),
                narration: row.narration,
                linkedInvoices: row.linkedInvoices.filter((inv) => inv.selected && inv.receiptAmount > 0)
              }))
            }
            : r
        )
      );
      setEditingReceiptId(null);
      alert('Receipt Voucher updated successfully!');
    } else {
      const newRV: ReceiptVoucher = {
        id: String(Date.now()),
        voucherNo: receiptRefNo,
        referenceNo: receiptRefNo,
        date: receiptDate,
        receivedFrom: validRows.map((r) => r.creditAccount).join(', '),
        debitAccount: receiptDebitAccount,
        receiptNo: receiptNo || `RCT-${Math.floor(10000 + Math.random() * 90000)}`,
        collectedBy: receiptCollectedBy,
        mode: receiptMethod,
        chequeNo: receiptMethod === 'Cheque' ? receiptChequeNo : undefined,
        chequeDate: receiptMethod === 'Cheque' ? receiptChequeDate : undefined,
        chequeCopy: receiptMethod === 'Cheque' ? (receiptChequeCopy || 'cheque_scan.pdf') : undefined,
        amount: totalAmount,
        narration: validRows[0].narration || 'Customer receipt payment',
        status: 'Approved',
        items: validRows.map((r, i) => ({
          id: `ri-${Date.now()}-${i}`,
          slNo: i + 1,
          creditAccount: r.creditAccount,
          amount: Number(r.amount),
          narration: r.narration,
          linkedInvoices: r.linkedInvoices.filter((inv) => inv.selected && inv.receiptAmount > 0)
        }))
      };

      setReceipts([newRV, ...receipts]);
      alert('Receipt Voucher saved successfully!');
    }
    setModalOpen(false);
  };

  // Add / Edit Account Head
  const openAddAccountHeadModal = () => {
    setEditingAccountHeadId(null);
    setNewHeadName('');
    setNewHeadCode('');
    setNewHeadType('Asset');
    setModalType('AddAccountHead');
    setModalOpen(true);
  };

  const openEditAccountHeadModal = (head: AccountHead) => {
    setEditingAccountHeadId(head.id);
    setNewHeadName(head.headName);
    setNewHeadCode(head.headCode);
    setNewHeadType(head.type);
    setModalType('AddAccountHead');
    setModalOpen(true);
  };

  const handleAddAccountHead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeadName) return;
    if (editingAccountHeadId) {
      setAccountHeads(
        accountHeads.map((h) =>
          h.id === editingAccountHeadId
            ? { ...h, headName: newHeadName, headCode: newHeadCode || h.headCode, type: newHeadType }
            : h
        )
      );
      setEditingAccountHeadId(null);
      alert('Account Head updated successfully!');
    } else {
      const newHead: AccountHead = {
        id: String(Date.now()),
        headCode: newHeadCode || `${Math.floor(1000 + Math.random() * 8000)}`,
        headName: newHeadName,
        type: newHeadType,
        description: 'Custom account head created via UI',
        status: 'Active'
      };
      setAccountHeads([...accountHeads, newHead]);
      alert('Account Head added successfully!');
    }
    setNewHeadName('');
    setNewHeadCode('');
    setModalOpen(false);
  };

  // Add / Edit Chart of Account (Replicated from steel_erp chart-of-accounts.php AddModal)
  const openAddCOAModal = () => {
    setEditingCOAId(null);
    setNewCOAName('');
    setNewCOAHead(accountHeads[0]?.headName || '');
    setNewCOACode('');
    setModalType('AddCOA');
    setModalOpen(true);
  };

  const openEditCOAModal = (acc: ChartOfAccount) => {
    setEditingCOAId(acc.id);
    setNewCOAName(acc.accountName);
    setNewCOAHead(acc.headName);
    setNewCOACode(acc.accountCode);
    setModalType('AddCOA');
    setModalOpen(true);
  };

  const handleAddCOA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCOAName || !newCOAHead) return;
    const matchingHead = accountHeads.find((h) => h.headName === newCOAHead);
    if (editingCOAId) {
      setChartOfAccounts(
        chartOfAccounts.map((a) =>
          a.id === editingCOAId
            ? {
              ...a,
              accountName: newCOAName,
              accountCode: newCOACode || a.accountCode,
              headName: newCOAHead,
              headId: matchingHead?.id || a.headId,
              category: matchingHead?.type || a.category
            }
            : a
        )
      );
      setEditingCOAId(null);
      alert('Chart of Account updated successfully!');
    } else {
      const newAccount: ChartOfAccount = {
        id: String(Date.now()),
        accountCode: newCOACode || `${Math.floor(1000 + Math.random() * 8000)}-01`,
        accountName: newCOAName,
        headId: matchingHead?.id || 'custom',
        headName: newCOAHead,
        category: matchingHead?.type || 'Asset',
        currency: 'USD',
        openingBalance: 0,
        debitTotal: 0,
        creditTotal: 0,
        currentBalance: 0,
        status: 'Active'
      };
      setChartOfAccounts([...chartOfAccounts, newAccount]);
      alert('Chart of Account created successfully!');
    }
    setNewCOAName('');
    setNewCOAHead('');
    setNewCOACode('');
    setModalOpen(false);
  };



  // Payment Voucher Add/Edit Form State (Replicated from steel_erp payments.php)
  const [paymentRefNo, setPaymentRefNo] = useState('');
  const [paymentDate, setPaymentDate] = useState('18-Nov-2026');
  const [paymentCreditAccount, setPaymentCreditAccount] = useState('Ecobank Current Account (USD)');
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'Cash' | 'Cheque'>('Bank Transfer');
  const [paymentChequeNo, setPaymentChequeNo] = useState('');
  const [paymentChequeDate, setPaymentChequeDate] = useState('18-Nov-2026');
  const [paymentChequeCopy, setPaymentChequeCopy] = useState('');

  // Payment Dynamic Rows (Account, Amount, Link, Narration)
  interface PaymentRowState {
    id: string;
    account: string;
    amount: string;
    narration: string;
    linkedInvoices: Array<{
      id: string;
      invoiceNo: string;
      date: string;
      lpoRef: string;
      amount: number;
      paymentAmount: number;
      selected: boolean;
    }>;
  }

  const [paymentRows, setPaymentRows] = useState<PaymentRowState[]>([
    {
      id: '1',
      account: '',
      amount: '',
      narration: '',
      linkedInvoices: []
    }
  ]);

  const [paymentLinkModalOpen, setPaymentLinkModalOpen] = useState(false);
  const [currentPaymentLinkingRowIndex, setCurrentPaymentLinkingRowIndex] = useState<number | null>(null);
  const [paymentLinkingInvoices, setPaymentLinkingInvoices] = useState<Array<{
    id: string;
    invoiceNo: string;
    date: string;
    lpoRef: string;
    amount: number;
    paymentAmount: number;
    selected: boolean;
  }>>([]);

  const [viewPaymentModalOpen, setViewPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentVoucher | null>(null);

  // Petty Cash Voucher Add/Edit Form State (Replicated from steel_erp petty-cash-voucher.php)
  const [pettyRefNo, setPettyRefNo] = useState('');
  const [pettyDate, setPettyDate] = useState('18-Nov-2026');
  const [pettyCreditAccount, setPettyCreditAccount] = useState('Petty Cash Safe Float');
  const [pettyMethod, setPettyMethod] = useState<'Cash' | 'Bank Transfer' | 'Cheque'>('Cash');
  const [pettyChequeNo, setPettyChequeNo] = useState('');
  const [pettyChequeDate, setPettyChequeDate] = useState('18-Nov-2026');
  const [pettyChequeCopy, setPettyChequeCopy] = useState('');

  // Petty Cash Dynamic Rows (Sales Order, Debit Account, Amount, Link, Narration)
  interface PettyRowState {
    id: string;
    salesOrder: string;
    debitAccount: string;
    amount: string;
    narration: string;
    linkedInvoices: Array<{
      id: string;
      invoiceNo: string;
      date: string;
      lpoRef: string;
      amount: number;
      paymentAmount: number;
      selected: boolean;
    }>;
  }

  const [pettyRows, setPettyRows] = useState<PettyRowState[]>([
    {
      id: '1',
      salesOrder: 'Select Sales Order',
      debitAccount: '',
      amount: '',
      narration: '',
      linkedInvoices: []
    }
  ]);

  const [pettyLinkModalOpen, setPettyLinkModalOpen] = useState(false);
  const [currentPettyLinkingRowIndex, setCurrentPettyLinkingRowIndex] = useState<number | null>(null);
  const [pettyLinkingInvoices, setPettyLinkingInvoices] = useState<Array<{
    id: string;
    invoiceNo: string;
    date: string;
    lpoRef: string;
    amount: number;
    paymentAmount: number;
    selected: boolean;
  }>>([]);

  const [viewPettyModalOpen, setViewPettyModalOpen] = useState(false);
  const [selectedPettyCash, setSelectedPettyCash] = useState<PettyCashVoucher | null>(null);

  const vendorDebitAccounts = [
    'Global Metallurgical Corp',
    'Gaz Industriels de Guinée SARL',
    'Electricité de Guinée (EDG)',
    'Guinea Port Authority (PAC)',
    'Conakry Heavy Transport Logistics',
    'Société Minière Supplies',
    'Industrial Gas & Welding Corp',
    'Raw Material Billets Suppliers',
    'Trade Accounts Payable - Vendors'
  ];

  const salesOrderOptions = [
    'Select Sales Order',
    'SO-2026-104',
    'SO-2026-105',
    'SO-2026-106',
    'SO-2026-107',
    'SO-2026-108'
  ];

  const pettyExpenseAccounts = [
    'Workshop Consumables',
    'Courier & Customs Port Clearance',
    'Factory Maintenance & Spares',
    'Staff Overtime Refreshments',
    'Fuel & Local Transportation',
    'Printing, Stationery & Postage',
    'Site Emergency Hardware'
  ];

  const pettyCreditAccounts = [
    'Petty Cash Safe Float',
    'Cash in Hand - Conakry Central',
    'Workshop Petty Cash Pool',
    'Factory Emergency Cash Safe'
  ];

  // Payment Handlers
  const openAddPaymentModal = () => {
    setEditingPaymentId(null);
    setPaymentRefNo(`PV-REF-2026-${String(payments.length + 94).padStart(3, '0')}`);
    setPaymentDate('18-Nov-2026');
    setPaymentCreditAccount('');
    setPaymentMethod('Bank Transfer');
    setPaymentChequeNo('');
    setPaymentChequeDate('18-Nov-2026');
    setPaymentChequeCopy('');
    setPaymentRows([
      {
        id: '1',
        account: '',
        amount: '',
        narration: '',
        linkedInvoices: []
      }
    ]);
    setModalType('AddPayment');
    setModalOpen(true);
  };

  const openEditPaymentModal = (pay: PaymentVoucher) => {
    setEditingPaymentId(pay.id);
    setPaymentRefNo(pay.referenceNo || pay.voucherNo);
    setPaymentDate(pay.date);
    setPaymentCreditAccount(pay.creditAccount || '');
    setPaymentMethod((pay.mode as any) || 'Bank Transfer');
    setPaymentChequeNo(pay.chequeNo || '');
    setPaymentChequeDate(pay.chequeDate || pay.date);
    setPaymentChequeCopy(pay.chequeCopy || '');
    if (pay.items && pay.items.length > 0) {
      setPaymentRows(
        pay.items.map((it, idx) => ({
          id: String(idx + 1),
          account: it.account,
          amount: String(it.amount),
          narration: it.narration || pay.narration || '',
          linkedInvoices: (it.linkedInvoices || []).map((inv) => ({
            id: inv.id,
            invoiceNo: inv.invoiceNo,
            date: inv.date,
            lpoRef: inv.lpoRef || '',
            amount: inv.amount,
            paymentAmount: inv.paymentAmount,
            selected: true
          }))
        }))
      );
    } else {
      setPaymentRows([
        {
          id: '1',
          account: pay.paidTo || '',
          amount: String(pay.amount),
          narration: pay.narration || '',
          linkedInvoices: []
        }
      ]);
    }
    setModalType('AddPayment');
    setModalOpen(true);
  };

  const handleAddPaymentRow = () => {
    setPaymentRows([
      ...paymentRows,
      {
        id: String(Date.now()),
        account: '',
        amount: '',
        narration: '',
        linkedInvoices: []
      }
    ]);
  };

  const handleRemovePaymentRow = (index: number) => {
    if (paymentRows.length <= 1) return;
    setPaymentRows(paymentRows.filter((_, i) => i !== index));
  };

  const handlePaymentRowChange = (index: number, field: keyof PaymentRowState, value: any) => {
    const updated = [...paymentRows];
    updated[index] = { ...updated[index], [field]: value };
    setPaymentRows(updated);
  };

  const handleOpenPaymentLinkModal = (index: number) => {
    const row = paymentRows[index];
    if (!row.account) {
      alert('Please select Account first!');
      return;
    }
    const amt = parseFloat(row.amount);
    if (!amt || amt <= 0) {
      alert('Please enter Amount first!');
      return;
    }

    setCurrentPaymentLinkingRowIndex(index);

    if (row.linkedInvoices && row.linkedInvoices.length > 0) {
      setPaymentLinkingInvoices(row.linkedInvoices);
    } else {
      const acronym = row.account
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 4);

      const candidateInvoices = [
        {
          id: 'pinv-1',
          invoiceNo: `PINV-2026-${Math.floor(80 + index * 5)}`,
          date: '24-Oct-2026',
          lpoRef: `PO-2026-${Math.floor(80 + index * 5)}`,
          amount: Math.max(amt, 50000),
          paymentAmount: amt,
          selected: true
        },
        {
          id: 'pinv-2',
          invoiceNo: `PINV-2026-${Math.floor(90 + index * 5)}`,
          date: '02-Nov-2026',
          lpoRef: `PO-2026-${Math.floor(90 + index * 5)}`,
          amount: 34000,
          paymentAmount: 0,
          selected: false
        }
      ];
      setPaymentLinkingInvoices(candidateInvoices);
    }

    setPaymentLinkModalOpen(true);
  };

  const handlePaymentFifoAllocation = () => {
    if (currentPaymentLinkingRowIndex === null) return;
    const targetAmount = parseFloat(paymentRows[currentPaymentLinkingRowIndex].amount) || 0;
    let remaining = targetAmount;

    const updated = paymentLinkingInvoices.map((inv) => {
      if (remaining <= 0) {
        return { ...inv, paymentAmount: 0, selected: false };
      }
      const allocated = Math.min(remaining, inv.amount);
      remaining -= allocated;
      return {
        ...inv,
        paymentAmount: allocated,
        selected: allocated > 0
      };
    });

    setPaymentLinkingInvoices(updated);
  };

  const handlePaymentAdvanceAllocation = () => {
    if (currentPaymentLinkingRowIndex === null) return;
    const targetAmount = parseFloat(paymentRows[currentPaymentLinkingRowIndex].amount) || 0;
    const currentAdjusted = paymentLinkingInvoices.reduce(
      (sum, item) => (item.selected ? sum + item.paymentAmount : sum),
      0
    );
    const balance = Math.max(0, targetAmount - currentAdjusted);
    if (balance > 0) {
      alert(`Remaining unallocated balance of $${balance.toLocaleString()} registered as Vendor Advance!`);
    } else {
      alert('Total amount is already fully allocated across selected invoices.');
    }
  };

  const handlePaymentInvoiceCheckChange = (index: number, checked: boolean) => {
    if (currentPaymentLinkingRowIndex === null) return;
    const targetAmount = parseFloat(paymentRows[currentPaymentLinkingRowIndex].amount) || 0;
    const updated = [...paymentLinkingInvoices];
    if (checked) {
      const otherTotal = updated.reduce(
        (sum, item, idx) => (idx !== index && item.selected ? sum + item.paymentAmount : sum),
        0
      );
      const available = Math.max(0, targetAmount - otherTotal);
      const allocated = Math.min(available, updated[index].amount);
      updated[index] = { ...updated[index], selected: true, paymentAmount: allocated };
    } else {
      updated[index] = { ...updated[index], selected: false, paymentAmount: 0 };
    }
    setPaymentLinkingInvoices(updated);
  };

  const handlePaymentInvoiceAmountChange = (index: number, val: string) => {
    const num = parseFloat(val) || 0;
    const updated = [...paymentLinkingInvoices];
    updated[index] = {
      ...updated[index],
      paymentAmount: num,
      selected: num > 0
    };
    setPaymentLinkingInvoices(updated);
  };

  const handleSavePaymentLinking = () => {
    if (currentPaymentLinkingRowIndex === null) return;
    const updatedRows = [...paymentRows];
    updatedRows[currentPaymentLinkingRowIndex] = {
      ...updatedRows[currentPaymentLinkingRowIndex],
      linkedInvoices: paymentLinkingInvoices
    };
    setPaymentRows(updatedRows);
    setPaymentLinkModalOpen(false);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentRefNo) {
      alert('Please enter Reference Number!');
      return;
    }
    const validRows = paymentRows.filter((r) => r.account && Number(r.amount) > 0);
    if (validRows.length === 0) {
      alert('Please select at least one Account and enter an Amount!');
      return;
    }

    const totalAmount = validRows.reduce((sum, r) => sum + Number(r.amount), 0);

    if (editingPaymentId) {
      setPayments(
        payments.map((p) =>
          p.id === editingPaymentId
            ? {
              ...p,
              voucherNo: paymentRefNo,
              referenceNo: paymentRefNo,
              date: paymentDate,
              paidTo: validRows.map((r) => r.account).join(', '),
              creditAccount: paymentCreditAccount,
              mode: paymentMethod,
              chequeNo: paymentMethod === 'Cheque' ? paymentChequeNo : undefined,
              chequeDate: paymentMethod === 'Cheque' ? paymentChequeDate : undefined,
              chequeCopy: paymentMethod === 'Cheque' ? (paymentChequeCopy || 'cheque_scan.pdf') : undefined,
              amount: totalAmount,
              narration: validRows[0].narration || 'Supplier payment voucher',
              items: validRows.map((r, i) => ({
                id: `pi-${Date.now()}-${i}`,
                slNo: i + 1,
                account: r.account,
                amount: Number(r.amount),
                narration: r.narration,
                linkedInvoices: r.linkedInvoices.filter((inv) => inv.selected && inv.paymentAmount > 0)
              }))
            }
            : p
        )
      );
      setEditingPaymentId(null);
      setModalOpen(false);
      alert('Payment Voucher updated successfully!');
      return;
    }

    const newPV: PaymentVoucher = {
      id: String(Date.now()),
      voucherNo: paymentRefNo,
      referenceNo: paymentRefNo,
      date: paymentDate,
      paidTo: validRows.map((r) => r.account).join(', '),
      creditAccount: paymentCreditAccount,
      mode: paymentMethod,
      chequeNo: paymentMethod === 'Cheque' ? paymentChequeNo : undefined,
      chequeDate: paymentMethod === 'Cheque' ? paymentChequeDate : undefined,
      chequeCopy: paymentMethod === 'Cheque' ? (paymentChequeCopy || 'cheque_scan.pdf') : undefined,
      amount: totalAmount,
      narration: validRows[0].narration || 'Supplier payment voucher',
      status: 'Approved',
      items: validRows.map((r, i) => ({
        id: `pi-${Date.now()}-${i}`,
        slNo: i + 1,
        account: r.account,
        amount: Number(r.amount),
        narration: r.narration,
        linkedInvoices: r.linkedInvoices.filter((inv) => inv.selected && inv.paymentAmount > 0)
      }))
    };

    setPayments([newPV, ...payments]);
    setModalOpen(false);
    alert('Payment Voucher saved successfully!');
  };

  // Petty Cash Handlers
  const openAddPettyCashModal = () => {
    setEditingPettyCashId(null);
    setPettyRefNo(`PCV-REF-2026-${String(pettyCash.length + 32).padStart(3, '0')}`);
    setPettyDate('18-Nov-2026');
    setPettyCreditAccount('');
    setPettyMethod('Cash');
    setPettyChequeNo('');
    setPettyChequeDate('18-Nov-2026');
    setPettyChequeCopy('');
    setPettyRows([
      {
        id: '1',
        salesOrder: '',
        debitAccount: '',
        amount: '',
        narration: '',
        linkedInvoices: []
      }
    ]);
    setModalType('AddPettyCash');
    setModalOpen(true);
  };

  const openEditPettyCashModal = (pc: PettyCashVoucher) => {
    setEditingPettyCashId(pc.id);
    setPettyRefNo(pc.referenceNo || pc.voucherNo);
    setPettyDate(pc.date);
    setPettyCreditAccount(pc.creditAccount || '');
    setPettyMethod((pc.mode as any) || 'Cash');
    setPettyChequeNo(pc.chequeNo || '');
    setPettyChequeDate(pc.chequeDate || pc.date);
    setPettyChequeCopy(pc.chequeCopy || '');
    if (pc.items && pc.items.length > 0) {
      setPettyRows(
        pc.items.map((it, idx) => ({
          id: String(idx + 1),
          salesOrder: it.salesOrder || '',
          debitAccount: it.debitAccount,
          amount: String(it.amount),
          narration: it.narration || pc.narration || '',
          linkedInvoices: (it.linkedInvoices || []).map((inv) => ({
            id: inv.id,
            invoiceNo: inv.invoiceNo,
            date: inv.date,
            lpoRef: inv.lpoRef || '',
            amount: inv.amount,
            paymentAmount: inv.paymentAmount,
            selected: true
          }))
        }))
      );
    } else {
      setPettyRows([
        {
          id: '1',
          salesOrder: '',
          debitAccount: pc.category || '',
          amount: String(pc.amount),
          narration: pc.narration || '',
          linkedInvoices: []
        }
      ]);
    }
    setModalType('AddPettyCash');
    setModalOpen(true);
  };

  const handleAddPettyRow = () => {
    setPettyRows([
      ...pettyRows,
      {
        id: String(Date.now()),
        salesOrder: '',
        debitAccount: '',
        amount: '',
        narration: '',
        linkedInvoices: []
      }
    ]);
  };

  const handleRemovePettyRow = (index: number) => {
    if (pettyRows.length <= 1) return;
    setPettyRows(pettyRows.filter((_, i) => i !== index));
  };

  const handlePettyRowChange = (index: number, field: keyof PettyRowState, value: any) => {
    const updated = [...pettyRows];
    updated[index] = { ...updated[index], [field]: value };
    setPettyRows(updated);
  };

  const handleOpenPettyLinkModal = (index: number) => {
    const row = pettyRows[index];
    if (!row.debitAccount) {
      alert('Please select Debit Account first!');
      return;
    }
    const amt = parseFloat(row.amount);
    if (!amt || amt <= 0) {
      alert('Please enter Amount first!');
      return;
    }

    setCurrentPettyLinkingRowIndex(index);

    if (row.linkedInvoices && row.linkedInvoices.length > 0) {
      setPettyLinkingInvoices(row.linkedInvoices);
    } else {
      const candidateSlips = [
        {
          id: 'slip-1',
          invoiceNo: `SLIP-2026-${Math.floor(10 + index * 5)}`,
          date: '10-Nov-2026',
          lpoRef: (row.salesOrder && row.salesOrder !== 'Select Sales Order') ? row.salesOrder : 'WORKSHOP-REQ-01',
          amount: amt,
          paymentAmount: amt,
          selected: true
        },
        {
          id: 'slip-2',
          invoiceNo: `SLIP-2026-${Math.floor(20 + index * 5)}`,
          date: '14-Nov-2026',
          lpoRef: 'RECEIPT-STORE-89',
          amount: Math.round(amt * 0.5),
          paymentAmount: 0,
          selected: false
        }
      ];
      setPettyLinkingInvoices(candidateSlips);
    }

    setPettyLinkModalOpen(true);
  };

  const handlePettyFifoAllocation = () => {
    if (currentPettyLinkingRowIndex === null) return;
    const targetAmount = parseFloat(pettyRows[currentPettyLinkingRowIndex].amount) || 0;
    let remaining = targetAmount;

    const updated = pettyLinkingInvoices.map((inv) => {
      if (remaining <= 0) {
        return { ...inv, paymentAmount: 0, selected: false };
      }
      const allocated = Math.min(remaining, inv.amount);
      remaining -= allocated;
      return {
        ...inv,
        paymentAmount: allocated,
        selected: allocated > 0
      };
    });

    setPettyLinkingInvoices(updated);
  };

  const handlePettyInvoiceCheckChange = (index: number, checked: boolean) => {
    if (currentPettyLinkingRowIndex === null) return;
    const targetAmount = parseFloat(pettyRows[currentPettyLinkingRowIndex].amount) || 0;
    const updated = [...pettyLinkingInvoices];
    if (checked) {
      const otherTotal = updated.reduce(
        (sum, item, idx) => (idx !== index && item.selected ? sum + item.paymentAmount : sum),
        0
      );
      const available = Math.max(0, targetAmount - otherTotal);
      const allocated = Math.min(available, updated[index].amount);
      updated[index] = { ...updated[index], selected: true, paymentAmount: allocated };
    } else {
      updated[index] = { ...updated[index], selected: false, paymentAmount: 0 };
    }
    setPettyLinkingInvoices(updated);
  };

  const handlePettyInvoiceAmountChange = (index: number, val: string) => {
    const num = parseFloat(val) || 0;
    const updated = [...pettyLinkingInvoices];
    updated[index] = {
      ...updated[index],
      paymentAmount: num,
      selected: num > 0
    };
    setPettyLinkingInvoices(updated);
  };

  const handleSavePettyLinking = () => {
    if (currentPettyLinkingRowIndex === null) return;
    const updatedRows = [...pettyRows];
    updatedRows[currentPettyLinkingRowIndex] = {
      ...updatedRows[currentPettyLinkingRowIndex],
      linkedInvoices: pettyLinkingInvoices
    };
    setPettyRows(updatedRows);
    setPettyLinkModalOpen(false);
  };

  const handleSavePettyCash = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pettyRefNo) {
      alert('Please enter Reference Number!');
      return;
    }
    const validRows = pettyRows.filter((r) => r.debitAccount && Number(r.amount) > 0);
    if (validRows.length === 0) {
      alert('Please select at least one Debit Account and enter an Amount!');
      return;
    }

    const totalAmount = validRows.reduce((sum, r) => sum + Number(r.amount), 0);

    if (editingPettyCashId) {
      setPettyCash(
        pettyCash.map((p) =>
          p.id === editingPettyCashId
            ? {
              ...p,
              voucherNo: pettyRefNo,
              referenceNo: pettyRefNo,
              date: pettyDate,
              creditAccount: pettyCreditAccount,
              mode: pettyMethod,
              chequeNo: pettyMethod === 'Cheque' ? pettyChequeNo : undefined,
              chequeDate: pettyMethod === 'Cheque' ? pettyChequeDate : undefined,
              chequeCopy: pettyMethod === 'Cheque' ? (pettyChequeCopy || 'cheque_scan.pdf') : undefined,
              category: validRows[0].debitAccount,
              amount: totalAmount,
              narration: validRows[0].narration || 'Petty cash expense voucher',
              items: validRows.map((r, i) => ({
                id: `pci-${Date.now()}-${i}`,
                slNo: i + 1,
                salesOrder: r.salesOrder,
                debitAccount: r.debitAccount,
                amount: Number(r.amount),
                narration: r.narration,
                linkedInvoices: r.linkedInvoices.filter((inv) => inv.selected && inv.paymentAmount > 0)
              }))
            }
            : p
        )
      );
      setEditingPettyCashId(null);
      setModalOpen(false);
      alert('Petty Cash Voucher updated successfully!');
      return;
    }

    const newPCV: PettyCashVoucher = {
      id: String(Date.now()),
      voucherNo: pettyRefNo,
      referenceNo: pettyRefNo,
      date: pettyDate,
      custodian: 'Mamadou B.',
      creditAccount: pettyCreditAccount,
      mode: pettyMethod,
      chequeNo: pettyMethod === 'Cheque' ? pettyChequeNo : undefined,
      chequeDate: pettyMethod === 'Cheque' ? pettyChequeDate : undefined,
      chequeCopy: pettyMethod === 'Cheque' ? (pettyChequeCopy || 'cheque_scan.pdf') : undefined,
      category: validRows[0].debitAccount,
      amount: totalAmount,
      narration: validRows[0].narration || 'Petty cash expense voucher',
      status: 'Approved',
      items: validRows.map((r, i) => ({
        id: `pci-${Date.now()}-${i}`,
        slNo: i + 1,
        salesOrder: r.salesOrder,
        debitAccount: r.debitAccount,
        amount: Number(r.amount),
        narration: r.narration,
        linkedInvoices: r.linkedInvoices.filter((inv) => inv.selected && inv.paymentAmount > 0)
      }))
    };

    setPettyCash([newPCV, ...pettyCash]);
    setModalOpen(false);
    alert('Petty Cash Voucher saved successfully!');
  };

  const tabs = [
    { key: 'AccountHead', label: 'Account Head' },
    { key: 'ChartsOfAccounts', label: 'Charts of Accounts' },
    { key: 'Receipts', label: 'Receipts' },
    { key: 'Payments', label: 'Payments' },
    { key: 'PettyCashVoucher', label: 'Petty Cash Voucher' }
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-cyan-600" /> Accounts & General Ledger Module
          </h1>
          <p className="text-xs text-slate-500">
            Manage Chart of Accounts, Receipts, Payments, Petty Cash, and Financial Statements.
          </p>
        </div>
      </div>

      {/* Primary Section Switcher (Replicated from steel_erp accounts/main_header.php) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSection('Accounts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeSection === 'Accounts'
            ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/20'
            : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Accounts Operations</span>
        </button>

        <button
          onClick={() => setActiveSection('Reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeSection === 'Reports'
            ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/20'
            : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Financial Reports</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${activeSection === 'Reports' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'
              }`}
          >
            8 Reports
          </span>
        </button>
      </div>

      {activeSection === 'Reports' ? (
        <AccountsReports />
      ) : (
        <>
          {/* Top Tab Bar (Replicated from steel_erp accounts/sub_header.php) */}
          <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-xs overflow-x-auto">
            <div className="flex items-center space-x-1 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key as any);
                    setSearchTerm('');
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.key
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB CONTENT: 1. ACCOUNT HEAD */}
          {activeTab === 'AccountHead' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filter account heads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <button
                  onClick={openAddAccountHeadModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Account Head
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Sl no</th>
                      <th className="px-4 py-3">Account Name</th>
                      <th className="px-4 py-3">Account Type</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {accountHeads
                      .filter((h) =>
                        h.headName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        h.headCode.includes(searchTerm)
                      )
                      .map((head, index) => (
                        <tr key={head.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{head.headName}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                              {head.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => openEditAccountHeadModal(head)}
                              className="p-1 text-slate-500 hover:text-cyan-600"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete head ${head.headName}?`)) {
                                  setAccountHeads(accountHeads.filter((x) => x.id !== head.id));
                                }
                              }}
                              className="p-1 text-slate-500 hover:text-rose-600"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 2. CHARTS OF ACCOUNTS */}
          {activeTab === 'ChartsOfAccounts' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search Chart of Accounts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={openAddCOAModal}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add Account
                  </button>
                  <button
                    onClick={() => alert('Exporting Chart of Accounts to Excel/PDF...')}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Export COA
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Sl no</th>
                      <th className="px-4 py-3">Account Head</th>
                      <th className="px-4 py-3">Account ID</th>
                      <th className="px-4 py-3">Account Name</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {chartOfAccounts
                      .filter((c) =>
                        c.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.accountCode.includes(searchTerm) ||
                        c.headName.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((acc, index) => (
                        <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-medium text-slate-700">{acc.headName}</td>
                          <td className="px-4 py-3 font-mono font-bold text-cyan-700">{acc.accountCode}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{acc.accountName}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {acc.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => openEditCOAModal(acc)}
                              className="p-1 text-slate-500 hover:text-cyan-600"
                              title="Edit Account"
                            >
                              <Edit className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete account ${acc.accountName}?`)) {
                                  setChartOfAccounts(chartOfAccounts.filter((x) => x.id !== acc.id));
                                }
                              }}
                              className="p-1 text-slate-500 hover:text-rose-600"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 3. RECEIPTS */}
          {activeTab === 'Receipts' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search receipts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <button
                  onClick={openAddReceiptModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create Receipt Voucher
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Sl no</th>
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3 text-right">Amount ($)</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {receipts
                      .filter((r) =>
                        r.receivedFrom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.voucherNo.includes(searchTerm) ||
                        r.referenceNo.includes(searchTerm)
                      )
                      .map((rec, index) => (
                        <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-mono font-bold text-emerald-700">{rec.referenceNo || rec.voucherNo}</td>
                          <td className="px-4 py-3 text-slate-500">{rec.date}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                              {rec.mode}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-emerald-700">
                            ${rec.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => openEditReceiptModal(rec)}
                              className="p-1 text-slate-500 hover:text-amber-600"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedReceipt(rec);
                                setViewReceiptModalOpen(true);
                              }}
                              className="p-1 text-slate-500 hover:text-cyan-600"
                              title="View"
                            >
                              <Eye className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => alert(`Print receipt ${rec.referenceNo || rec.voucherNo}`)}
                              className="p-1 text-slate-500 hover:text-cyan-600"
                              title="Print"
                            >
                              <Printer className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete receipt ${rec.referenceNo || rec.voucherNo}?`)) {
                                  setReceipts(receipts.filter((x) => x.id !== rec.id));
                                }
                              }}
                              className="p-1 text-slate-500 hover:text-rose-600"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 4. PAYMENTS */}
          {activeTab === 'Payments' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search payment vouchers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <button
                  onClick={openAddPaymentModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Issue Payment Voucher
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Sl no</th>
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3 text-right">Amount ($)</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments
                      .filter((p) =>
                        p.paidTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.voucherNo.includes(searchTerm) ||
                        p.referenceNo?.includes(searchTerm)
                      )
                      .map((pay, index) => (
                        <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-mono font-bold text-rose-700">{pay.referenceNo || pay.voucherNo}</td>
                          <td className="px-4 py-3 text-slate-500">{pay.date}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                              {pay.mode}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-rose-600">
                            ${pay.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => openEditPaymentModal(pay)}
                              className="p-1 text-slate-500 hover:text-amber-600"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPayment(pay);
                                setViewPaymentModalOpen(true);
                              }}
                              className="p-1 text-slate-500 hover:text-cyan-600"
                              title="View"
                            >
                              <Eye className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => alert(`Print payment voucher ${pay.referenceNo || pay.voucherNo}`)}
                              className="p-1 text-slate-500 hover:text-cyan-600"
                              title="Print"
                            >
                              <Printer className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete payment voucher ${pay.referenceNo || pay.voucherNo}?`)) {
                                  setPayments(payments.filter((x) => x.id !== pay.id));
                                }
                              }}
                              className="p-1 text-slate-500 hover:text-rose-600"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 5. PETTY CASH */}
          {activeTab === 'PettyCashVoucher' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Imprest & Petty Cash Vouchers
                  </h3>
                  <p className="text-[11px] text-slate-500">Safe Float: $5,000 | Available: $3,450</p>
                </div>
                <button
                  onClick={openAddPettyCashModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Petty Cash Voucher
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Sl no</th>
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3 text-right">Amount ($)</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {
                      pettyCash.map((pc, index) => (
                        <tr key={pc.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">{pc.referenceNo || pc.voucherNo}</td>
                          <td className="px-4 py-3 text-slate-500">{pc.date}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                              {pc.mode || 'Cash'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-slate-800">
                            ${pc.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => openEditPettyCashModal(pc)}
                              className="p-1 text-slate-500 hover:text-amber-600"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPettyCash(pc);
                                setViewPettyModalOpen(true);
                              }}
                              className="p-1 text-slate-500 hover:text-cyan-600"
                              title="View"
                            >
                              <Eye className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => alert(`Print petty cash voucher ${pc.referenceNo || pc.voucherNo}`)}
                              className="p-1 text-slate-500 hover:text-cyan-600"
                              title="Print"
                            >
                              <Printer className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete petty cash voucher ${pc.referenceNo || pc.voucherNo}?`)) {
                                  setPettyCash(pettyCash.filter((x) => x.id !== pc.id));
                                }
                              }}
                              className="p-1 text-slate-500 hover:text-rose-600"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </>
      )}

      {/* MODAL 1: ADD ACCOUNT HEAD */}
      <Modal
        isOpen={modalOpen && (modalType === 'AddHead' || modalType === 'AddAccountHead')}
        onClose={() => setModalOpen(false)}
        title={editingAccountHeadId ? 'Edit Account Head' : 'Create New Account Head'}
      >
        <form onSubmit={handleAddAccountHead} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Account Head Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Factory Operating Equipment"
              value={newHeadName}
              onChange={(e) => setNewHeadName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Head Code (GL Prefix)
              </label>
              <input
                type="text"
                placeholder="e.g. 1550"
                value={newHeadCode}
                onChange={(e) => setNewHeadCode(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Head Classification *
              </label>
              <select
                value={newHeadType}
                onChange={(e) => setNewHeadType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="Asset">Asset</option>
                <option value="Liability">Liability</option>
                <option value="Equity">Equity</option>
                <option value="Revenue">Revenue</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-xs"
            >
              {editingAccountHeadId ? 'Update Account Head' : 'Save Account Head'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD CHART OF ACCOUNT */}
      <Modal
        isOpen={modalOpen && modalType === 'AddCOA'}
        onClose={() => setModalOpen(false)}
        title={editingCOAId ? 'Edit Chart of Account' : 'Create Chart of Account'}
      >
        <form onSubmit={handleAddCOA} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Account Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Operating Petty Cash Bank Account"
              value={newCOAName}
              onChange={(e) => setNewCOAName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Account Head *
            </label>
            <select
              required
              value={newCOAHead}
              onChange={(e) => setNewCOAHead(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select Account Head</option>
              {accountHeads.map((h) => (
                <option key={h.id} value={h.headName}>
                  {h.headCode} - {h.headName} ({h.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Account Code / ID (GL)
            </label>
            <input
              type="text"
              placeholder="e.g. 1010-05"
              value={newCOACode}
              onChange={(e) => setNewCOACode(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-xs"
            >
              {editingCOAId ? 'Update Account' : 'Save Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: ADD RECEIPT (Replicated from steel_erp receipts.php AddModal) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddReceipt'}
        onClose={() => setModalOpen(false)}
        title={editingReceiptId ? 'Edit Receipt' : 'Add Receipt'}
        maxWidth="5xl"
      >
        <form onSubmit={handleSaveReceipt} className="space-y-4">
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Section 1 - Left Column */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Reference *</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      required
                      value={receiptRefNo}
                      onChange={(e) => setReceiptRefNo(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Date *</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      required
                      value={receiptDate}
                      onChange={(e) => setReceiptDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Debit Account *</label>
                  <div className="col-span-8">
                    <select
                      value={receiptDebitAccount}
                      onChange={(e) => setReceiptDebitAccount(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      {debitAccountOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Receipt No</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      value={receiptNo}
                      onChange={(e) => setReceiptNo(e.target.value)}
                      placeholder="e.g. RCT-10042"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Collected By *</label>
                  <div className="col-span-8">
                    <select
                      value={receiptCollectedBy}
                      onChange={(e) => setReceiptCollectedBy(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      {collectorOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2 - Right Column */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Receipt Method *</label>
                  <div className="col-span-8">
                    <select
                      value={receiptMethod}
                      onChange={(e) => setReceiptMethod(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>
                </div>

                {receiptMethod === 'Cheque' && (
                  <>
                    <div className="grid grid-cols-12 items-center gap-2">
                      <label className="col-span-4 text-xs font-semibold text-slate-700">Cheque Number *</label>
                      <div className="col-span-8">
                        <input
                          type="text"
                          required
                          value={receiptChequeNo}
                          onChange={(e) => setReceiptChequeNo(e.target.value)}
                          placeholder="e.g. CHQ-991201"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-2">
                      <label className="col-span-4 text-xs font-semibold text-slate-700">Cheque Date *</label>
                      <div className="col-span-8">
                        <input
                          type="text"
                          required
                          value={receiptChequeDate}
                          onChange={(e) => setReceiptChequeDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-2">
                      <label className="col-span-4 text-xs font-semibold text-slate-700">Cheque Copy</label>
                      <div className="col-span-8">
                        <input
                          type="file"
                          onChange={(e) => setReceiptChequeCopy(e.target.files?.[0]?.name || '')}
                          className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Credit Account & Invoices Table (add_more_container in steel_erp) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Credit Account Allocations
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                Click &quot;Click&quot; in Link column to link customer invoices
              </span>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-3 py-2 w-12 text-center">Sl</th>
                    <th className="px-3 py-2 w-[40%]">Credit Account</th>
                    <th className="px-3 py-2 w-[18%]">Amount ($)</th>
                    <th className="px-3 py-2 w-[12%] text-center">Link</th>
                    <th className="px-3 py-2 w-[25%]">Narration</th>
                    <th className="px-3 py-2 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {creditRows.map((row, index) => {
                    const linkedCount = row.linkedInvoices?.filter((i) => i.selected && i.receiptAmount > 0).length || 0;
                    return (
                      <tr key={row.id} className="hover:bg-slate-50/70">
                        <td className="px-2 py-1.5 text-center font-mono text-slate-500">
                          {index + 1}
                        </td>
                        <td className="px-2 py-1.5">
                          <select
                            value={row.creditAccount}
                            onChange={(e) => handleCreditRowChange(index, 'creditAccount', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                            required
                          >
                            <option value="">Select Credit Account</option>
                            {customerCreditAccounts.map((acc) => (
                              <option key={acc} value={acc}>
                                {acc}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={row.amount}
                            onChange={(e) => handleCreditRowChange(index, 'amount', e.target.value)}
                            placeholder="0.00"
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-right"
                            required
                          />
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenLinkModal(index)}
                            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${linkedCount > 0
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                              }`}
                          >
                            {linkedCount > 0 ? `Linked (${linkedCount})` : 'Click'}
                          </button>
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            type="text"
                            value={row.narration}
                            onChange={(e) => handleCreditRowChange(index, 'narration', e.target.value)}
                            placeholder="Line narration / notes"
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {creditRows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveCreditRow(index)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                title="Remove row"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {index === creditRows.length - 1 && (
                              <button
                                type="button"
                                onClick={handleAddCreditRow}
                                className="p-1 text-emerald-600 hover:text-emerald-800 rounded transition-colors"
                                title="Add More"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Total Calculation Row (total_table in steel_erp) */}
              <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase">
                  Total Allocated:
                </span>
                <span className="text-sm font-extrabold text-emerald-700 font-mono">
                  $
                  {creditRows
                    .reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)
                    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Form Submit Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> {editingReceiptId ? 'Update Receipt' : 'Save Receipt'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2.1: LINK INVOICES MODAL (InvoicesModal in steel_erp) */}
      {linkModalOpen && currentLinkingRowIndex !== null && (
        <Modal
          isOpen={linkModalOpen}
          onClose={() => setLinkModalOpen(false)}
          title={`Select Invoices - ${creditRows[currentLinkingRowIndex]?.creditAccount || 'Customer'}`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-semibold text-slate-700">Allocating for Customer: </span>
                <span className="font-bold text-blue-900">{creditRows[currentLinkingRowIndex]?.creditAccount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Receipt Amount: </span>
                <span className="font-mono font-extrabold text-emerald-700 bg-white px-2.5 py-1 rounded border border-emerald-200">
                  ${(parseFloat(creditRows[currentLinkingRowIndex]?.amount) || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Invoices Selection Window */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-3 py-2 w-10 text-center">Sl</th>
                    <th className="px-3 py-2 w-[15%]">Date</th>
                    <th className="px-3 py-2 w-[20%]">Invoice No</th>
                    <th className="px-3 py-2 w-[22%]">LPO Ref</th>
                    <th className="px-3 py-2 w-[15%] text-right">Amount ($)</th>
                    <th className="px-3 py-2 w-[18%] text-right">Receipt ($)</th>
                    <th className="px-3 py-2 w-10 text-center">Tick</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {linkingInvoices.map((inv, idx) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="px-2 py-2 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-slate-600">{inv.date}</td>
                      <td className="px-3 py-2 font-mono font-bold text-blue-700">{inv.invoiceNo}</td>
                      <td className="px-3 py-2 text-slate-600 font-mono">{inv.lpoRef}</td>
                      <td className="px-3 py-2 text-right font-medium text-slate-700">
                        ${inv.amount.toLocaleString()}
                      </td>
                      <td className="px-2 py-1.5 text-right">
                        <input
                          type="number"
                          min="0"
                          max={inv.amount}
                          step="any"
                          value={inv.receiptAmount || ''}
                          onChange={(e) => handleInvoiceAmountChange(idx, e.target.value)}
                          placeholder="0.00"
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-right"
                        />
                      </td>
                      <td className="px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={inv.selected}
                          onChange={(e) => handleInvoiceCheckChange(idx, e.target.checked)}
                          className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200 text-xs">
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-slate-600 uppercase text-[11px]">
                      Total Target:
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-900">
                      ${(parseFloat(creditRows[currentLinkingRowIndex]?.amount) || 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-600 uppercase text-[11px]">Adjusted:</td>
                    <td className="px-3 py-2 text-right font-mono text-emerald-700">
                      $
                      {linkingInvoices
                        .reduce((sum, item) => (item.selected ? sum + item.receiptAmount : sum), 0)
                        .toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Invoices Action Buttons (FIFO, Advance, Save) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFifoAllocation}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded shadow-xs transition-colors"
                >
                  FIFO Allocation
                </button>
                <button
                  type="button"
                  onClick={handleAdvanceAllocation}
                  className="px-3.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded shadow-xs transition-colors"
                >
                  Record Advance
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveLinking}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Apply Allocation
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2.2: VIEW RECEIPT MODAL (ViewModal in steel_erp) */}
      {viewReceiptModalOpen && selectedReceipt && (
        <Modal
          isOpen={viewReceiptModalOpen}
          onClose={() => setViewReceiptModalOpen(false)}
          title={`View Receipt - ${selectedReceipt.referenceNo || selectedReceipt.voucherNo}`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            {/* Header specifications matching steel_erp view_receipt_body */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-slate-50/70">
                    <td className="px-3 py-2 text-slate-500 font-medium w-1/4">Reference</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left w-1/4">
                      {selectedReceipt.referenceNo || selectedReceipt.voucherNo}
                    </th>
                    <td className="px-3 py-2 text-slate-500 font-medium w-1/4">Date</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left w-1/4">
                      {selectedReceipt.date}
                    </th>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-slate-500 font-medium">Debit Account</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedReceipt.debitAccount || 'Ecobank Current Account (USD)'}
                    </th>
                    <td className="px-3 py-2 text-slate-500 font-medium">Receipt Method</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedReceipt.mode}
                    </th>
                  </tr>
                  <tr className="bg-slate-50/70">
                    <td className="px-3 py-2 text-slate-500 font-medium">Receipt No</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedReceipt.receiptNo || '-'}
                    </th>
                    <td className="px-3 py-2 text-slate-500 font-medium">Collected By</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedReceipt.collectedBy || 'Finance Officer'}
                    </th>
                  </tr>
                  {selectedReceipt.mode === 'Cheque' && (
                    <tr>
                      <td className="px-3 py-2 text-slate-500 font-medium">Cheque Number</td>
                      <th className="px-3 py-2 font-bold text-slate-800 text-left">
                        {selectedReceipt.chequeNo || '-'}
                      </th>
                      <td className="px-3 py-2 text-slate-500 font-medium">Cheque Date</td>
                      <th className="px-3 py-2 font-bold text-slate-800 text-left">
                        {selectedReceipt.chequeDate || '-'}
                      </th>
                    </tr>
                  )}
                  {selectedReceipt.mode === 'Cheque' && selectedReceipt.chequeCopy && (
                    <tr className="bg-slate-50/70">
                      <td className="px-3 py-2 text-slate-500 font-medium">Cheque File</td>
                      <th colSpan={3} className="px-3 py-2 font-bold text-blue-600 text-left">
                        {selectedReceipt.chequeCopy}
                      </th>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Invoices Breakdown Title */}
            <div>
              <h4 className="text-center font-bold text-xs uppercase tracking-wider text-slate-700 bg-slate-100 py-2 rounded-t border border-b-0 border-slate-200">
                Invoices & Account Allocations
              </h4>
              <div className="border border-slate-200 rounded-b overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">Account</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Invoice</th>
                      <th className="px-3 py-2">Narration</th>
                      <th className="px-3 py-2 text-right">Amount ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {selectedReceipt.items && selectedReceipt.items.length > 0 ? (
                      selectedReceipt.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-medium text-slate-800">{item.creditAccount}</td>
                          <td className="px-3 py-2 text-slate-500">Cash/Credit Invoice</td>
                          <td className="px-3 py-2 font-mono text-blue-600">
                            {item.linkedInvoices && item.linkedInvoices.length > 0
                              ? item.linkedInvoices.map((inv) => inv.invoiceNo).join(', ')
                              : '-'}
                          </td>
                          <td className="px-3 py-2 text-slate-600">{item.narration || selectedReceipt.narration}</td>
                          <td className="px-3 py-2 text-right font-bold text-slate-900">
                            ${item.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-3 py-2 font-medium text-slate-800">{selectedReceipt.receivedFrom}</td>
                        <td className="px-3 py-2 text-slate-500">Invoice Settlement</td>
                        <td className="px-3 py-2 font-mono text-blue-600">-</td>
                        <td className="px-3 py-2 text-slate-600">{selectedReceipt.narration}</td>
                        <td className="px-3 py-2 text-right font-bold text-slate-900">
                          ${selectedReceipt.amount.toLocaleString()}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan={4} className="px-3 py-2 text-right uppercase text-[11px] text-slate-600">
                        Total Amount:
                      </td>
                      <td className="px-3 py-2 text-right text-emerald-700 font-mono">
                        ${selectedReceipt.amount.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => alert(`Printing official receipt voucher ${selectedReceipt.referenceNo || selectedReceipt.voucherNo}...`)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button
                type="button"
                onClick={() => setViewReceiptModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 3: ADD PAYMENT (Replicated from steel_erp payments.php AddModal) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddPayment'}
        onClose={() => setModalOpen(false)}
        title={editingPaymentId ? 'Edit Payment Voucher' : 'Payment'}
        maxWidth="5xl"
      >
        <form onSubmit={handleSavePayment} className="space-y-4">
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Section 1 - Left Column */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Reference *</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      required
                      value={paymentRefNo}
                      onChange={(e) => setPaymentRefNo(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Date *</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      required
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Credit Account *</label>
                  <div className="col-span-8">
                    <select
                      value={paymentCreditAccount}
                      onChange={(e) => setPaymentCreditAccount(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-500"
                    >
                      {debitAccountOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {paymentMethod === 'Cheque' && (
                  <div className="grid grid-cols-12 items-center gap-2">
                    <label className="col-span-4 text-xs font-semibold text-slate-700">Cheque Copy</label>
                    <div className="col-span-8">
                      <input
                        type="file"
                        onChange={(e) => setPaymentChequeCopy(e.target.files?.[0]?.name || '')}
                        className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2 - Right Column */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Payment Method *</label>
                  <div className="col-span-8">
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>
                </div>

                {paymentMethod === 'Cheque' && (
                  <>
                    <div className="grid grid-cols-12 items-center gap-2">
                      <label className="col-span-4 text-xs font-semibold text-slate-700">Cheque Number *</label>
                      <div className="col-span-8">
                        <input
                          type="text"
                          required
                          value={paymentChequeNo}
                          onChange={(e) => setPaymentChequeNo(e.target.value)}
                          placeholder="e.g. CHQ-992014"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-2">
                      <label className="col-span-4 text-xs font-semibold text-slate-700">Cheque Date *</label>
                      <div className="col-span-8">
                        <input
                          type="text"
                          required
                          value={paymentChequeDate}
                          onChange={(e) => setPaymentChequeDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Table for Account, Amount, Link, Narration (steel_erp add_more_container) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Payment Account Allocations
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                Click &quot;Click&quot; in Link column to link vendor invoices or purchase vouchers
              </span>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-3 py-2 w-12 text-center">Sl No</th>
                    <th className="px-3 py-2 w-[40%]">Account</th>
                    <th className="px-3 py-2 w-[18%]">Amount ($)</th>
                    <th className="px-3 py-2 w-[12%] text-center">Link</th>
                    <th className="px-3 py-2 w-[25%]">Narration</th>
                    <th className="px-3 py-2 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {paymentRows.map((row, index) => {
                    const linkedCount = row.linkedInvoices?.filter((i) => i.selected && i.paymentAmount > 0).length || 0;
                    return (
                      <tr key={row.id} className="hover:bg-slate-50/70">
                        <td className="px-2 py-1.5 text-center font-mono text-slate-500">
                          {index + 1}
                        </td>
                        <td className="px-2 py-1.5">
                          <select
                            value={row.account}
                            onChange={(e) => handlePaymentRowChange(index, 'account', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                            required
                          >
                            <option value="">Select Account / Vendor</option>
                            {vendorDebitAccounts.map((acc) => (
                              <option key={acc} value={acc}>
                                {acc}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={row.amount}
                            onChange={(e) => handlePaymentRowChange(index, 'amount', e.target.value)}
                            placeholder="0.00"
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono text-right"
                            required
                          />
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenPaymentLinkModal(index)}
                            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${linkedCount > 0
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                              : 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs'
                              }`}
                          >
                            {linkedCount > 0 ? `Linked (${linkedCount})` : 'Click'}
                          </button>
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            type="text"
                            value={row.narration}
                            onChange={(e) => handlePaymentRowChange(index, 'narration', e.target.value)}
                            placeholder="Line narration / notes"
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-500"
                          />
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {paymentRows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemovePaymentRow(index)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                title="Remove row"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {index === paymentRows.length - 1 && (
                              <button
                                type="button"
                                onClick={handleAddPaymentRow}
                                className="p-1 text-rose-600 hover:text-rose-800 rounded transition-colors"
                                title="Add More"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Total Calculation Row */}
              <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase">
                  Total Payment:
                </span>
                <span className="text-sm font-extrabold text-rose-700 font-mono">
                  $
                  {paymentRows
                    .reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)
                    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Form Submit Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> {editingPaymentId ? 'Update Payment' : 'Save Payment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3.1: PAYMENT INVOICES LINK MODAL (InvoicesModal in steel_erp) */}
      {paymentLinkModalOpen && currentPaymentLinkingRowIndex !== null && (
        <Modal
          isOpen={paymentLinkModalOpen}
          onClose={() => setPaymentLinkModalOpen(false)}
          title={`Select Invoices - ${paymentRows[currentPaymentLinkingRowIndex]?.account || 'Vendor'}`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <div className="bg-rose-50/70 border border-rose-200 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-semibold text-slate-700">Allocating for Vendor: </span>
                <span className="font-bold text-rose-900">{paymentRows[currentPaymentLinkingRowIndex]?.account}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Payment Amount: </span>
                <span className="font-mono font-extrabold text-rose-700 bg-white px-2.5 py-1 rounded border border-rose-200">
                  ${(parseFloat(paymentRows[currentPaymentLinkingRowIndex]?.amount) || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-3 py-2 w-10 text-center">Sl</th>
                    <th className="px-3 py-2 w-[15%]">Date</th>
                    <th className="px-3 py-2 w-[20%]">Invoice No</th>
                    <th className="px-3 py-2 w-[22%]">LPO Ref</th>
                    <th className="px-3 py-2 w-[15%] text-right">Amount ($)</th>
                    <th className="px-3 py-2 w-[18%] text-right">Payment ($)</th>
                    <th className="px-3 py-2 w-10 text-center">Tick</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {paymentLinkingInvoices.map((inv, idx) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="px-2 py-2 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-slate-600">{inv.date}</td>
                      <td className="px-3 py-2 font-mono font-bold text-rose-700">{inv.invoiceNo}</td>
                      <td className="px-3 py-2 text-slate-600 font-mono">{inv.lpoRef}</td>
                      <td className="px-3 py-2 text-right font-medium text-slate-700">
                        ${inv.amount.toLocaleString()}
                      </td>
                      <td className="px-2 py-1.5 text-right">
                        <input
                          type="number"
                          min="0"
                          max={inv.amount}
                          step="any"
                          value={inv.paymentAmount || ''}
                          onChange={(e) => handlePaymentInvoiceAmountChange(idx, e.target.value)}
                          placeholder="0.00"
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono text-right"
                        />
                      </td>
                      <td className="px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={inv.selected}
                          onChange={(e) => handlePaymentInvoiceCheckChange(idx, e.target.checked)}
                          className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200 text-xs">
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-slate-600 uppercase text-[11px]">
                      Total Target:
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-900">
                      ${(parseFloat(paymentRows[currentPaymentLinkingRowIndex]?.amount) || 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-600 uppercase text-[11px]">Adjusted:</td>
                    <td className="px-3 py-2 text-right font-mono text-rose-700">
                      $
                      {paymentLinkingInvoices
                        .reduce((sum, item) => (item.selected ? sum + item.paymentAmount : sum), 0)
                        .toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePaymentFifoAllocation}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded shadow-xs transition-colors"
                >
                  FIFO Allocation
                </button>
                <button
                  type="button"
                  onClick={handlePaymentAdvanceAllocation}
                  className="px-3.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded shadow-xs transition-colors"
                >
                  Record Advance
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentLinkModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePaymentLinking}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Apply Allocation
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 3.2: VIEW PAYMENT MODAL (ViewModal in steel_erp) */}
      {viewPaymentModalOpen && selectedPayment && (
        <Modal
          isOpen={viewPaymentModalOpen}
          onClose={() => setViewPaymentModalOpen(false)}
          title={`View Payment - ${selectedPayment.referenceNo || selectedPayment.voucherNo}`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-slate-50/70">
                    <td className="px-3 py-2 text-slate-500 font-medium w-1/4">Reference</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left w-1/4">
                      {selectedPayment.referenceNo || selectedPayment.voucherNo}
                    </th>
                    <td className="px-3 py-2 text-slate-500 font-medium w-1/4">Payment Method</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left w-1/4">
                      {selectedPayment.mode}
                    </th>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-slate-500 font-medium">Credit Account</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedPayment.creditAccount || 'Ecobank Current Account (USD)'}
                    </th>
                    <td className="px-3 py-2 text-slate-500 font-medium">Date</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedPayment.date}
                    </th>
                  </tr>
                  {selectedPayment.mode === 'Cheque' && (
                    <tr className="bg-slate-50/70">
                      <td className="px-3 py-2 text-slate-500 font-medium">Cheque Number</td>
                      <th className="px-3 py-2 font-bold text-slate-800 text-left">
                        {selectedPayment.chequeNo || '-'}
                      </th>
                      <td className="px-3 py-2 text-slate-500 font-medium">Cheque Date</td>
                      <th className="px-3 py-2 font-bold text-slate-800 text-left">
                        {selectedPayment.chequeDate || '-'}
                      </th>
                    </tr>
                  )}
                  {selectedPayment.mode === 'Cheque' && selectedPayment.chequeCopy && (
                    <tr>
                      <td className="px-3 py-2 text-slate-500 font-medium">Cheque File</td>
                      <th colSpan={3} className="px-3 py-2 font-bold text-blue-600 text-left">
                        {selectedPayment.chequeCopy}
                      </th>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="text-center font-bold text-xs uppercase tracking-wider text-slate-700 bg-slate-100 py-2 rounded-t border border-b-0 border-slate-200">
                Payment Invoices & Account Allocations
              </h4>
              <div className="border border-slate-200 rounded-b overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">Account</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Invoice</th>
                      <th className="px-3 py-2">Narration</th>
                      <th className="px-3 py-2 text-right">Amount ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {selectedPayment.items && selectedPayment.items.length > 0 ? (
                      selectedPayment.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-medium text-slate-800">{item.account}</td>
                          <td className="px-3 py-2 text-slate-500">Purchase Voucher</td>
                          <td className="px-3 py-2 font-mono text-rose-600">
                            {item.linkedInvoices && item.linkedInvoices.length > 0
                              ? item.linkedInvoices.map((inv) => inv.invoiceNo).join(', ')
                              : '-'}
                          </td>
                          <td className="px-3 py-2 text-slate-600">{item.narration || selectedPayment.narration}</td>
                          <td className="px-3 py-2 text-right font-bold text-slate-900">
                            ${item.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-3 py-2 font-medium text-slate-800">{selectedPayment.paidTo}</td>
                        <td className="px-3 py-2 text-slate-500">Supplier Payment</td>
                        <td className="px-3 py-2 font-mono text-rose-600">-</td>
                        <td className="px-3 py-2 text-slate-600">{selectedPayment.narration}</td>
                        <td className="px-3 py-2 text-right font-bold text-slate-900">
                          ${selectedPayment.amount.toLocaleString()}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan={4} className="px-3 py-2 text-right uppercase text-[11px] text-slate-600">
                        Total Payment:
                      </td>
                      <td className="px-3 py-2 text-right text-rose-700 font-mono">
                        ${selectedPayment.amount.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => alert(`Printing payment voucher ${selectedPayment.referenceNo || selectedPayment.voucherNo}...`)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button
                type="button"
                onClick={() => setViewPaymentModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 4: ADD PETTY CASH VOUCHER (Replicated from steel_erp petty-cash-voucher.php AddModal) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddPettyCash'}
        onClose={() => setModalOpen(false)}
        title={editingPettyCashId ? 'Edit Petty Cash Voucher' : 'Petty Cash Voucher'}
        maxWidth="5xl"
      >
        <form onSubmit={handleSavePettyCash} className="space-y-4">
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Section 1 - Left Column */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Reference *</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      required
                      value={pettyRefNo}
                      onChange={(e) => setPettyRefNo(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Date *</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      required
                      value={pettyDate}
                      onChange={(e) => setPettyDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Credit Account *</label>
                  <div className="col-span-8">
                    <select
                      value={pettyCreditAccount}
                      onChange={(e) => setPettyCreditAccount(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    >
                      {pettyCreditAccounts.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {pettyMethod === 'Cheque' && (
                  <div className="grid grid-cols-12 items-center gap-2">
                    <label className="col-span-4 text-xs font-semibold text-slate-700">Cheque Copy</label>
                    <div className="col-span-8">
                      <input
                        type="file"
                        onChange={(e) => setPettyChequeCopy(e.target.files?.[0]?.name || '')}
                        className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2 - Right Column */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Payment Method *</label>
                  <div className="col-span-8">
                    <select
                      value={pettyMethod}
                      onChange={(e) => setPettyMethod(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                    </select>
                  </div>
                </div>

                {pettyMethod === 'Cheque' && (
                  <>
                    <div className="grid grid-cols-12 items-center gap-2">
                      <label className="col-span-4 text-xs font-semibold text-slate-700">Cheque Number *</label>
                      <div className="col-span-8">
                        <input
                          type="text"
                          required
                          value={pettyChequeNo}
                          onChange={(e) => setPettyChequeNo(e.target.value)}
                          placeholder="e.g. CHQ-88120"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-2">
                      <label className="col-span-4 text-xs font-semibold text-slate-700">Cheque Date *</label>
                      <div className="col-span-8">
                        <input
                          type="text"
                          required
                          value={pettyChequeDate}
                          onChange={(e) => setPettyChequeDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Table for Sales Order, Debit Account, Amount, Link, Narration (steel_erp petty-cash-voucher.php) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Petty Cash Expense Allocations
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                Click &quot;Click&quot; in Link column to attach expense slips or workshop requests
              </span>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-3 py-2 w-12 text-center">Sl No</th>
                    <th className="px-3 py-2 w-[22%]">Sales Order</th>
                    <th className="px-3 py-2 w-[28%]">Debit Account</th>
                    <th className="px-3 py-2 w-[16%]">Amount ($)</th>
                    <th className="px-3 py-2 w-[12%] text-center">Link</th>
                    <th className="px-3 py-2 w-[22%]">Narration</th>
                    <th className="px-3 py-2 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {pettyRows.map((row, index) => {
                    const linkedCount = row.linkedInvoices?.filter((i) => i.selected && i.paymentAmount > 0).length || 0;
                    return (
                      <tr key={row.id} className="hover:bg-slate-50/70">
                        <td className="px-2 py-1.5 text-center font-mono text-slate-500">
                          {index + 1}
                        </td>
                        <td className="px-2 py-1.5">
                          <select
                            value={row.salesOrder}
                            onChange={(e) => handlePettyRowChange(index, 'salesOrder', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-white"
                          >
                            {salesOrderOptions.map((so) => (
                              <option key={so} value={so}>
                                {so}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-1.5">
                          <select
                            value={row.debitAccount}
                            onChange={(e) => handlePettyRowChange(index, 'debitAccount', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 bg-white"
                            required
                          >
                            <option value="">Select Account</option>
                            {pettyExpenseAccounts.map((acc) => (
                              <option key={acc} value={acc}>
                                {acc}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={row.amount}
                            onChange={(e) => handlePettyRowChange(index, 'amount', e.target.value)}
                            placeholder="0.00"
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono text-right"
                            required
                          />
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenPettyLinkModal(index)}
                            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${linkedCount > 0
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                              : 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-xs'
                              }`}
                          >
                            {linkedCount > 0 ? `Linked (${linkedCount})` : 'Click'}
                          </button>
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            type="text"
                            value={row.narration}
                            onChange={(e) => handlePettyRowChange(index, 'narration', e.target.value)}
                            placeholder="Expense slip / notes"
                            className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          />
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {pettyRows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemovePettyRow(index)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                title="Remove row"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {index === pettyRows.length - 1 && (
                              <button
                                type="button"
                                onClick={handleAddPettyRow}
                                className="p-1 text-cyan-600 hover:text-cyan-800 rounded transition-colors"
                                title="Add More"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Total Calculation Row */}
              <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase">
                  Total Petty Cash:
                </span>
                <span className="text-sm font-extrabold text-cyan-700 font-mono">
                  $
                  {pettyRows
                    .reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)
                    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Form Submit Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> {editingPettyCashId ? 'Update Voucher' : 'Save Petty Cash Voucher'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 4.1: PETTY CASH INVOICES / SLIPS LINK MODAL (InvoicesModal in steel_erp) */}
      {pettyLinkModalOpen && currentPettyLinkingRowIndex !== null && (
        <Modal
          isOpen={pettyLinkModalOpen}
          onClose={() => setPettyLinkModalOpen(false)}
          title={`Select Slips / Expenses - ${pettyRows[currentPettyLinkingRowIndex]?.debitAccount || 'Account'}`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <div className="bg-cyan-50/70 border border-cyan-200 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-semibold text-slate-700">Account: </span>
                <span className="font-bold text-cyan-900">{pettyRows[currentPettyLinkingRowIndex]?.debitAccount}</span>
                <span className="ml-3 text-slate-500 font-mono">({pettyRows[currentPettyLinkingRowIndex]?.salesOrder})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Amount: </span>
                <span className="font-mono font-extrabold text-cyan-700 bg-white px-2.5 py-1 rounded border border-cyan-200">
                  ${(parseFloat(pettyRows[currentPettyLinkingRowIndex]?.amount) || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-3 py-2 w-10 text-center">Sl</th>
                    <th className="px-3 py-2 w-[15%]">Date</th>
                    <th className="px-3 py-2 w-[20%]">Slip / Ref No</th>
                    <th className="px-3 py-2 w-[22%]">Order / Purpose</th>
                    <th className="px-3 py-2 w-[15%] text-right">Amount ($)</th>
                    <th className="px-3 py-2 w-[18%] text-right">Payment ($)</th>
                    <th className="px-3 py-2 w-10 text-center">Tick</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {pettyLinkingInvoices.map((inv, idx) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="px-2 py-2 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="px-3 py-2 text-slate-600">{inv.date}</td>
                      <td className="px-3 py-2 font-mono font-bold text-cyan-700">{inv.invoiceNo}</td>
                      <td className="px-3 py-2 text-slate-600 font-mono">{inv.lpoRef}</td>
                      <td className="px-3 py-2 text-right font-medium text-slate-700">
                        ${inv.amount.toLocaleString()}
                      </td>
                      <td className="px-2 py-1.5 text-right">
                        <input
                          type="number"
                          min="0"
                          max={inv.amount}
                          step="any"
                          value={inv.paymentAmount || ''}
                          onChange={(e) => handlePettyInvoiceAmountChange(idx, e.target.value)}
                          placeholder="0.00"
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono text-right"
                        />
                      </td>
                      <td className="px-2 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={inv.selected}
                          onChange={(e) => handlePettyInvoiceCheckChange(idx, e.target.checked)}
                          className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200 text-xs">
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-slate-600 uppercase text-[11px]">
                      Total Target:
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-900">
                      ${(parseFloat(pettyRows[currentPettyLinkingRowIndex]?.amount) || 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-600 uppercase text-[11px]">Adjusted:</td>
                    <td className="px-3 py-2 text-right font-mono text-cyan-700">
                      $
                      {pettyLinkingInvoices
                        .reduce((sum, item) => (item.selected ? sum + item.paymentAmount : sum), 0)
                        .toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePettyFifoAllocation}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded shadow-xs transition-colors"
                >
                  FIFO Allocation
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPettyLinkModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePettyLinking}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Apply Allocation
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 4.2: VIEW PETTY CASH MODAL (ViewModal in steel_erp) */}
      {viewPettyModalOpen && selectedPettyCash && (
        <Modal
          isOpen={viewPettyModalOpen}
          onClose={() => setViewPettyModalOpen(false)}
          title={`View Petty Cash Voucher - ${selectedPettyCash.referenceNo || selectedPettyCash.voucherNo}`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-slate-50/70">
                    <td className="px-3 py-2 text-slate-500 font-medium w-1/4">Reference</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left w-1/4">
                      {selectedPettyCash.referenceNo || selectedPettyCash.voucherNo}
                    </th>
                    <td className="px-3 py-2 text-slate-500 font-medium w-1/4">Payment Method</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left w-1/4">
                      {selectedPettyCash.mode || 'Cash'}
                    </th>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-slate-500 font-medium">Credit Account</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedPettyCash.creditAccount || 'Petty Cash Safe Float'}
                    </th>
                    <td className="px-3 py-2 text-slate-500 font-medium">Date</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedPettyCash.date}
                    </th>
                  </tr>
                  {selectedPettyCash.mode === 'Cheque' && (
                    <tr className="bg-slate-50/70">
                      <td className="px-3 py-2 text-slate-500 font-medium">Cheque Number</td>
                      <th className="px-3 py-2 font-bold text-slate-800 text-left">
                        {selectedPettyCash.chequeNo || '-'}
                      </th>
                      <td className="px-3 py-2 text-slate-500 font-medium">Cheque Date</td>
                      <th className="px-3 py-2 font-bold text-slate-800 text-left">
                        {selectedPettyCash.chequeDate || '-'}
                      </th>
                    </tr>
                  )}
                  {selectedPettyCash.mode === 'Cheque' && selectedPettyCash.chequeCopy && (
                    <tr>
                      <td className="px-3 py-2 text-slate-500 font-medium">Cheque File</td>
                      <th colSpan={3} className="px-3 py-2 font-bold text-blue-600 text-left">
                        {selectedPettyCash.chequeCopy}
                      </th>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="text-center font-bold text-xs uppercase tracking-wider text-slate-700 bg-slate-100 py-2 rounded-t border border-b-0 border-slate-200">
                Petty Cash Expense Allocations
              </h4>
              <div className="border border-slate-200 rounded-b overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">Sales Order</th>
                      <th className="px-3 py-2">Debit Account</th>
                      <th className="px-3 py-2">Narration</th>
                      <th className="px-3 py-2 text-right">Amount ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {selectedPettyCash.items && selectedPettyCash.items.length > 0 ? (
                      selectedPettyCash.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-mono text-cyan-800 font-medium">{item.salesOrder || 'General'}</td>
                          <td className="px-3 py-2 font-medium text-slate-800">{item.debitAccount}</td>
                          <td className="px-3 py-2 text-slate-600">{item.narration || selectedPettyCash.narration}</td>
                          <td className="px-3 py-2 text-right font-bold text-slate-900">
                            ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-3 py-2 font-mono text-cyan-800 font-medium">Select Sales Order</td>
                        <td className="px-3 py-2 font-medium text-slate-800">{selectedPettyCash.category || 'Workshop Consumables'}</td>
                        <td className="px-3 py-2 text-slate-600">{selectedPettyCash.narration || 'Expense payment'}</td>
                        <td className="px-3 py-2 text-right font-bold text-slate-900">
                          ${selectedPettyCash.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-right uppercase text-[11px] text-slate-600">
                        Total Petty Cash:
                      </td>
                      <td className="px-3 py-2 text-right text-cyan-700 font-mono">
                        ${selectedPettyCash.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => alert(`Printing petty cash voucher ${selectedPettyCash.referenceNo || selectedPettyCash.voucherNo}...`)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button
                type="button"
                onClick={() => setViewPettyModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

