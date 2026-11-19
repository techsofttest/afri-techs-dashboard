'use client';

import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Search,
  Eye,
  Trash2,
  Edit,
  FileBarChart,
  Printer,
  Check
} from 'lucide-react';
import Modal from '@/components/Modal';
import CrmReports from '@/components/reports/CrmReports';
import {
  initialCustomers,
  initialSalesQuotations,
  initialSalesOrders,
  initialProFormaInvoices,
  initialDeliveryNotes,
  initialSalesInvoices,
  initialSalesReturns,
  initialProducts,
  initialProductHeads
} from '@/lib/mock-data';
import {
  Customer,
  SalesQuotation,
  SalesOrder,
  ProFormaInvoice,
  DeliveryNote,
  DeliveryNoteItem,
  SalesInvoice,
  SalesInvoiceItem,
  SalesReturn,
  SalesReturnItem,
  Product,
  ProductHead
} from '@/lib/types';

export default function CrmPage() {
  const [activeSection, setActiveSection] = useState<'CRM' | 'Reports'>('CRM');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'reports' || params.get('tab') === 'Reports') {
        setActiveSection('Reports');
      }
    }
  }, []);

  const [activeTab, setActiveTab] = useState<
    | 'ProductHead'
    | 'Products'
    | 'CustomerCreation'
    | 'SalesQuotation'
    | 'SalesOrder'
    | 'ProFormaInvoice'
    | 'DeliverNote'
    | 'CashInvoice'
    | 'CreditInvoice'
    | 'SalesReturn'
  >('ProductHead');

  // Datasets
  const [productHeads, setProductHeads] = useState<ProductHead[]>(initialProductHeads);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [quotations, setQuotations] = useState<SalesQuotation[]>(initialSalesQuotations);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(initialSalesOrders);
  const [proFormaInvoices, setProFormaInvoices] = useState<ProFormaInvoice[]>(initialProFormaInvoices);
  const [deliveryNotes, setDeliveryNotes] = useState<DeliveryNote[]>(initialDeliveryNotes);
  const [invoices, setInvoices] = useState<SalesInvoice[]>(initialSalesInvoices);
  const [salesReturns, setSalesReturns] = useState<SalesReturn[]>(initialSalesReturns);

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  // Editing state tracking IDs
  const [editingProductHeadId, setEditingProductHeadId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [editingQuotationId, setEditingQuotationId] = useState<string | null>(null);
  const [editingSalesOrderId, setEditingSalesOrderId] = useState<string | null>(null);
  const [editingProFormaId, setEditingProFormaId] = useState<string | null>(null);

  // 1. Add Product Head State
  const [phCode, setPhCode] = useState('');
  const [phName, setPhName] = useState('');

  // 2. Add Product State
  const [pCode, setPCode] = useState('');
  const [pName, setPName] = useState('');
  const [pHead, setPHead] = useState('Reinforcing Steel & Rebar');

  // 3. Add Customer State (No Contact Person, No Sales Executive, No Credit Fields)
  const [cName, setCName] = useState('');
  const [cAccountHead, setCAccountHead] = useState('Accounts Receivable');
  const [cAccountId, setCAccountId] = useState('102001');
  const [cPostBox, setCPostBox] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cFax, setCFax] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cCity, setCCity] = useState('Conakry');
  const [cCountry, setCCountry] = useState('Guinea');

  // 5. Add Quotation State (matching steel_erp sales-quotation.php)
  const [qRefNo, setQRefNo] = useState('');
  const [qDate, setQDate] = useState('18-Nov-2026');
  const [qCustomer, setQCustomer] = useState('');
  const [qEnquiryNo, setQEnquiryNo] = useState('');
  const [qValidity, setQValidity] = useState('30 Days');
  const [qPaymentTerm, setQPaymentTerm] = useState('30 Days Net');
  const [qDeliveryTerm, setQDeliveryTerm] = useState('Ex-Factory');
  const [qProject, setQProject] = useState('');

  interface QuotationProductRow {
    id: string;
    productId: string;
    productDescription: string;
    unit: string;
    quantity: number;
    rate: number;
    discount: number;
    amount: number;
  }

  const [qProductRows, setQProductRows] = useState<QuotationProductRow[]>([
    {
      id: '1',
      productId: '',
      productDescription: '',
      unit: 'MT',
      quantity: 1,
      rate: 0,
      discount: 0,
      amount: 0
    }
  ]);

  const [viewQuotationModalOpen, setViewQuotationModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<SalesQuotation | null>(null);

  const deliveryTermOptions = [
    'Ex-Factory',
    'FOB Conakry Port',
    'CIF Conakry',
    'Door Delivery Conakry',
    'Door Delivery Kamsar / Boké',
    'Site Delivery Simandou'
  ];

  // 6. Add Sales Order State (matching steel_erp sales-order.php)
  const [soRefNo, setSoRefNo] = useState('');
  const [soDate, setSoDate] = useState('18-Nov-2026');
  const [soCustomer, setSoCustomer] = useState('');
  const [soQuotRef, setSoQuotRef] = useState('');
  const [soLpoRef, setSoLpoRef] = useState('');
  const [soPaymentTerm, setSoPaymentTerm] = useState('30 Days Net');
  const [soDeliveryDate, setSoDeliveryDate] = useState('30-Nov-2026');
  const [soProject, setSoProject] = useState('');

  interface SalesOrderProductRow {
    id: string;
    productId: string;
    productDescription: string;
    unit: string;
    quantity: number;
    rate: number;
    discount: number;
    amount: number;
  }

  const [soProductRows, setSoProductRows] = useState<SalesOrderProductRow[]>([
    {
      id: '1',
      productId: '',
      productDescription: '',
      unit: 'MT',
      quantity: 1,
      rate: 0,
      discount: 0,
      amount: 0
    }
  ]);

  const [viewSalesOrderModalOpen, setViewSalesOrderModalOpen] = useState(false);
  const [selectedSalesOrder, setSelectedSalesOrder] = useState<SalesOrder | null>(null);

  // 7. Add Pro-Forma Invoice State (matching steel_erp pro-forma-invoice.php)
  const [pfRefNo, setPfRefNo] = useState('');
  const [pfDate, setPfDate] = useState('18-Nov-2026');
  const [pfCustomer, setPfCustomer] = useState('');
  const [pfSalesOrder, setPfSalesOrder] = useState('');
  const [pfLpoRef, setPfLpoRef] = useState('');
  const [pfPaymentTerms, setPfPaymentTerms] = useState('30 Days Net');
  const [pfDeliveryTerms, setPfDeliveryTerms] = useState('FOB Conakry Port');
  const [pfProject, setPfProject] = useState('');
  const [pfClaimPercent, setPfClaimPercent] = useState<number>(100);

  interface ProFormaProductRow {
    id: string;
    productId: string;
    productDescription: string;
    unit: string;
    quantity: number;
    rate: number;
    discount: number;
    amount: number;
  }

  const [pfProductRows, setPfProductRows] = useState<ProFormaProductRow[]>([
    {
      id: '1',
      productId: '',
      productDescription: '',
      unit: 'MT',
      quantity: 1,
      rate: 0,
      discount: 0,
      amount: 0
    }
  ]);

  const [viewProFormaModalOpen, setViewProFormaModalOpen] = useState(false);
  const [selectedProForma, setSelectedProForma] = useState<ProFormaInvoice | null>(null);

  // 8. Delivery Note State (Exact steel_erp delivernote.php - No Sales Executive, No Contact Person)
  interface DeliveryNoteProductRow {
    id: string;
    productId?: string;
    productDescription: string;
    unit: string;
    orderQty: number;
    deliveredQty: number;
    currentDelivery: number;
  }

  const [editingDeliveryNoteId, setEditingDeliveryNoteId] = useState<string | null>(null);
  const [dnRefNo, setDnRefNo] = useState('');
  const [dnDate, setDnDate] = useState('18-Nov-2026');
  const [dnCustomer, setDnCustomer] = useState('');
  const [dnSalesOrder, setDnSalesOrder] = useState('');
  const [dnLpoRef, setDnLpoRef] = useState('');
  const [dnPaymentTerms, setDnPaymentTerms] = useState('');
  const [dnProject, setDnProject] = useState('');
  const [dnProductRows, setDnProductRows] = useState<DeliveryNoteProductRow[]>([]);
  const [viewDeliveryNoteModalOpen, setViewDeliveryNoteModalOpen] = useState(false);
  const [selectedDeliveryNote, setSelectedDeliveryNote] = useState<DeliveryNote | null>(null);

  // 9. Cash Invoice State (Exact steel_erp cash-invoice.php - No Sales Executive, No Contact Person)
  interface CashInvoiceProductRow {
    id: string;
    productId?: string;
    productDescription: string;
    unit: string;
    quantity: number;
    rate: number;
    discount: number;
    amount: number;
  }

  const [editingCashInvoiceId, setEditingCashInvoiceId] = useState<string | null>(null);
  const [ciRefNo, setCiRefNo] = useState('');
  const [ciDate, setCiDate] = useState('18-Nov-2026');
  const [ciCustomer, setCiCustomer] = useState('');
  const [ciCreditAccount, setCiCreditAccount] = useState('Cash in Hand - Conakry Central');
  const [ciSalesOrder, setCiSalesOrder] = useState('');
  const [ciLpoRef, setCiLpoRef] = useState('');
  const [ciPaymentTerms, setCiPaymentTerms] = useState('Cash on Delivery');
  const [ciProject, setCiProject] = useState('');
  const [ciAdvanceAmount, setCiAdvanceAmount] = useState<number>(0);
  const [ciProductRows, setCiProductRows] = useState<CashInvoiceProductRow[]>([]);
  const [viewCashInvoiceModalOpen, setViewCashInvoiceModalOpen] = useState(false);
  const [selectedCashInvoice, setSelectedCashInvoice] = useState<SalesInvoice | null>(null);

  // 10. Credit Invoice State (Exact steel_erp credit-invoice.php - No Sales Executive, No Contact Person)
  interface CreditInvoiceProductRow {
    id: string;
    dnNo?: string;
    productId?: string;
    productDescription: string;
    unit: string;
    quantity: number;
    rate: number;
    discount: number;
    amount: number;
  }

  const [editingCreditInvoiceId, setEditingCreditInvoiceId] = useState<string | null>(null);
  const [cciRefNo, setCciRefNo] = useState('');
  const [cciDate, setCciDate] = useState('18-Nov-2026');
  const [cciCustomer, setCciCustomer] = useState('');
  const [cciCreditAccount, setCciCreditAccount] = useState('Accounts Receivable');
  const [cciSalesOrder, setCciSalesOrder] = useState('');
  const [cciLpoRef, setCciLpoRef] = useState('');
  const [cciPaymentTerms, setCciPaymentTerms] = useState('30 Days Net');
  const [cciProject, setCciProject] = useState('');
  const [cciAdvanceAmount, setCciAdvanceAmount] = useState<number>(0);
  const [cciProductRows, setCciProductRows] = useState<CreditInvoiceProductRow[]>([]);
  const [viewCreditInvoiceModalOpen, setViewCreditInvoiceModalOpen] = useState(false);
  const [selectedCreditInvoice, setSelectedCreditInvoice] = useState<SalesInvoice | null>(null);

  // 11. Sales Return State (Exact steel_erp sales-return.php - No Sales Executive, No Contact Person)
  interface SalesReturnProductRow {
    id: string;
    productId?: string;
    productDescription: string;
    unit: string;
    quantity: number;
    rate: number;
    discount: number;
    amount: number;
  }

  const [editingSalesReturnId, setEditingSalesReturnId] = useState<string | null>(null);
  const [srRefNo, setSrRefNo] = useState('');
  const [srDate, setSrDate] = useState('18-Nov-2026');
  const [srCustomer, setSrCustomer] = useState('');
  const [srInvoiceNo, setSrInvoiceNo] = useState('');
  const [srDebitAccount, setSrDebitAccount] = useState('Accounts Receivable');
  const [srLpoRef, setSrLpoRef] = useState('');
  const [srPaymentTerms, setSrPaymentTerms] = useState('30 Days Net');
  const [srProject, setSrProject] = useState('');
  const [srReason, setSrReason] = useState('');
  const [srProductRows, setSrProductRows] = useState<SalesReturnProductRow[]>([]);
  const [viewSalesReturnModalOpen, setViewSalesReturnModalOpen] = useState(false);
  const [selectedSalesReturn, setSelectedSalesReturn] = useState<SalesReturn | null>(null);

  // Handlers for Product Head
  const openAddProductHeadModal = () => {
    setEditingProductHeadId(null);
    setPhCode(`PH-${String(productHeads.length + 1).padStart(3, '0')}`);
    setPhName('');
    setModalType('AddProductHead');
    setModalOpen(true);
  };

  const openEditProductHeadModal = (ph: ProductHead) => {
    setEditingProductHeadId(ph.id);
    setPhCode(ph.code);
    setPhName(ph.name);
    setModalType('AddProductHead');
    setModalOpen(true);
  };

  const handleAddProductHead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phName) return;
    if (editingProductHeadId) {
      setProductHeads(
        productHeads.map((ph) =>
          ph.id === editingProductHeadId ? { ...ph, code: phCode, name: phName } : ph
        )
      );
      setEditingProductHeadId(null);
      alert('Product Head updated successfully!');
    } else {
      const newPH: ProductHead = {
        id: String(Date.now()),
        code: phCode || `PH-${String(productHeads.length + 1).padStart(3, '0')}`,
        name: phName,
        description: 'Classification Category',
        totalProducts: 0
      };
      setProductHeads([...productHeads, newPH]);
      alert('Product Head added successfully!');
    }
    setPhCode('');
    setPhName('');
    setModalOpen(false);
  };

  // Handlers for Product
  const openAddProductModal = () => {
    setEditingProductId(null);
    setPCode(`PROD-${String(products.length + 1).padStart(3, '0')}`);
    setPName('');
    setPHead(productHeads[0]?.name || 'Reinforcing Steel & Rebar');
    setModalType('AddProduct');
    setModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProductId(prod.id);
    setPCode(prod.code);
    setPName(prod.name);
    setPHead(prod.category);
    setModalType('AddProduct');
    setModalOpen(true);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName) return;
    if (editingProductId) {
      setProducts(
        products.map((p) =>
          p.id === editingProductId ? { ...p, code: pCode, name: pName, category: pHead } : p
        )
      );
      setEditingProductId(null);
      alert('Product updated successfully!');
    } else {
      const newP: Product = {
        id: String(Date.now()),
        code: pCode || `PROD-${String(products.length + 1).padStart(3, '0')}`,
        name: pName,
        category: pHead,
        unit: 'MT',
        costPrice: 650,
        sellingPrice: 850,
        stockQty: 50,
        minAlertQty: 10,
        status: 'In Stock'
      };
      setProducts([...products, newP]);
      alert('Product added successfully!');
    }
    setPCode('');
    setPName('');
    setModalOpen(false);
  };

  // Handlers for Customer
  const openAddCustomerModal = () => {
    setEditingCustomerId(null);
    setCName('');
    setCAccountHead('Accounts Receivable');
    setCAccountId(`102${Math.floor(100 + Math.random() * 900)}`);
    setCPostBox('');
    setCPhone('');
    setCFax('');
    setCEmail('');
    setCCity('Conakry');
    setCCountry('Guinea');
    setModalType('AddCustomer');
    setModalOpen(true);
  };

  const openEditCustomerModal = (cust: Customer) => {
    setEditingCustomerId(cust.id);
    setCName(cust.name);
    setCAccountHead('Accounts Receivable');
    setCAccountId(cust.customerCode || cust.code || '102001');
    setCPostBox(cust.postBox || '');
    setCPhone(cust.phone || '');
    setCFax('');
    setCEmail(cust.email || '');
    setCCity('Conakry');
    setCCountry('Guinea');
    setModalType('AddCustomer');
    setModalOpen(true);
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName) return;
    if (editingCustomerId) {
      setCustomers(
        customers.map((c) =>
          c.id === editingCustomerId
            ? {
              ...c,
              name: cName,
              postBox: cPostBox,
              phone: cPhone,
              email: cEmail
            }
            : c
        )
      );
      setEditingCustomerId(null);
      alert('Customer updated successfully!');
    } else {
      const newC: Customer = {
        id: String(Date.now()),
        code: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
        customerCode: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
        name: cName,
        postBox: cPostBox || 'P.O. Box 1024',
        phone: cPhone || '+224 620 00 00 00',
        email: cEmail || 'contact@client.com',
        taxNo: 'TRN-10029381',
        creditLimit: 0,
        outstandingBalance: 0,
        currentBalance: 0,
        status: 'Active'
      };
      setCustomers([...customers, newC]);
      alert('Customer saved successfully!');
    }
    setCName('');
    setCPostBox('');
    setCPhone('');
    setCFax('');
    setCEmail('');
    setModalOpen(false);
  };

  // Handlers for Sales Quotation (No dummy rows on Add, placeholders only)
  const openAddQuotationModal = () => {
    setEditingQuotationId(null);
    setQRefNo(`QT-2026-${String(quotations.length + 130).padStart(3, '0')}`);
    setQDate('18-Nov-2026');
    setQCustomer('');
    setQEnquiryNo('');
    setQValidity('');
    setQPaymentTerm('');
    setQDeliveryTerm('Ex-Factory');
    setQProject('');
    setQProductRows([
      {
        id: '1',
        productId: '',
        productDescription: '',
        unit: '',
        quantity: 0,
        rate: 0,
        discount: 0,
        amount: 0
      }
    ]);
    setModalType('AddQuotation');
    setModalOpen(true);
  };

  const openEditQuotationModal = (q: SalesQuotation) => {
    setEditingQuotationId(q.id);
    setQRefNo(q.quotationNo);
    setQDate(q.date);
    setQCustomer(q.customerName);
    setQEnquiryNo(q.enquiryRef && q.enquiryRef !== '-' ? q.enquiryRef : '');
    setQValidity(q.validity || '');
    setQPaymentTerm(q.paymentTerm || '');
    setQDeliveryTerm(q.deliveryTerm || 'Ex-Factory');
    setQProject(q.project && q.project !== '-' ? q.project : '');
    if (q.items && q.items.length > 0) {
      setQProductRows(
        q.items.map((it, idx) => ({
          id: String(idx + 1),
          productId: it.productId || '',
          productDescription: it.productDescription,
          unit: it.unit,
          quantity: it.quantity,
          rate: it.rate,
          discount: it.discount,
          amount: it.amount
        }))
      );
    } else {
      setQProductRows([
        {
          id: '1',
          productId: '',
          productDescription: 'Standard Quotation Package',
          unit: 'Lot',
          quantity: 1,
          rate: q.totalAmount,
          discount: 0,
          amount: q.totalAmount
        }
      ]);
    }
    setModalType('AddQuotation');
    setModalOpen(true);
  };

  const handleQProductChange = (index: number, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    const updated = [...qProductRows];
    if (prod) {
      const qty = updated[index].quantity || 1;
      const rate = prod.sellingPrice || 0;
      const disc = updated[index].discount || 0;
      const amt = (qty * rate) * (1 - disc / 100);
      updated[index] = {
        ...updated[index],
        productId: prod.id,
        productDescription: prod.name,
        unit: prod.unit,
        rate: rate,
        amount: Math.round(amt * 100) / 100
      };
    } else {
      updated[index] = {
        ...updated[index],
        productId: '',
        productDescription: productId
      };
    }
    setQProductRows(updated);
  };

  const handleQRowFieldChange = (index: number, field: keyof QuotationProductRow, value: any) => {
    const updated = [...qProductRows];
    updated[index] = { ...updated[index], [field]: value };
    const qty = Number(field === 'quantity' ? value : updated[index].quantity) || 0;
    const rate = Number(field === 'rate' ? value : updated[index].rate) || 0;
    const disc = Number(field === 'discount' ? value : updated[index].discount) || 0;
    updated[index].amount = Math.round((qty * rate * (1 - disc / 100)) * 100) / 100;
    setQProductRows(updated);
  };

  const handleAddQuotationProductRow = () => {
    setQProductRows([
      ...qProductRows,
      {
        id: String(Date.now()),
        productId: '',
        productDescription: '',
        unit: 'MT',
        quantity: 1,
        rate: 0,
        discount: 0,
        amount: 0
      }
    ]);
  };

  const handleRemoveQuotationProductRow = (index: number) => {
    if (qProductRows.length === 1) {
      alert('Quotation must contain at least one product row!');
      return;
    }
    setQProductRows(qProductRows.filter((_, i) => i !== index));
  };

  const handleAddQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qCustomer) {
      alert('Please select a Customer!');
      return;
    }
    const validRows = qProductRows.filter((r) => r.productDescription && r.amount > 0);
    if (validRows.length === 0) {
      alert('Please add at least one product with quantity and rate!');
      return;
    }
    const subTotal = validRows.reduce((sum, r) => sum + r.amount, 0);
    const vat = Math.round(subTotal * 0.18 * 100) / 100;
    const total = Math.round((subTotal + vat) * 100) / 100;

    const newQ: SalesQuotation = {
      id: String(Date.now()),
      quotationNo: qRefNo || `QT-2026-${String(quotations.length + 130).padStart(3, '0')}`,
      customerName: qCustomer,
      date: qDate,
      enquiryRef: qEnquiryNo || '-',
      validity: qValidity,
      validUntil: '30-Nov-2026',
      paymentTerm: qPaymentTerm,
      deliveryTerm: qDeliveryTerm,
      project: qProject || '-',
      itemsCount: validRows.length,
      items: validRows.map((r, i) => ({
        id: `qi-${Date.now()}-${i}`,
        slNo: i + 1,
        productId: r.productId,
        productDescription: r.productDescription,
        unit: r.unit,
        quantity: r.quantity,
        rate: r.rate,
        discount: r.discount,
        amount: r.amount
      })),
      subTotal: subTotal,
      vatAmount: vat,
      totalAmount: total,
      status: 'Sent'
    };

    setQuotations([newQ, ...quotations]);
    if (editingQuotationId) {
      setQuotations(
        quotations.map((q) =>
          q.id === editingQuotationId
            ? {
              ...q,
              customerName: qCustomer,
              date: qDate,
              enquiryRef: qEnquiryNo || '-',
              validity: qValidity,
              paymentTerm: qPaymentTerm,
              deliveryTerm: qDeliveryTerm,
              project: qProject || '-',
              itemsCount: validRows.length,
              items: validRows.map((r, i) => ({
                id: `qi-${Date.now()}-${i}`,
                slNo: i + 1,
                productId: r.productId,
                productDescription: r.productDescription,
                unit: r.unit,
                quantity: r.quantity,
                rate: r.rate,
                discount: r.discount,
                amount: r.amount
              })),
              subTotal: subTotal,
              vatAmount: vat,
              totalAmount: total
            }
            : q
        )
      );
      setEditingQuotationId(null);
      alert('Sales Quotation updated successfully!');
    } else {
      const newQ: SalesQuotation = {
        id: String(Date.now()),
        quotationNo: qRefNo || `QT-2026-${String(quotations.length + 130).padStart(3, '0')}`,
        customerName: qCustomer,
        date: qDate,
        enquiryRef: qEnquiryNo || '-',
        validity: qValidity,
        validUntil: '30-Nov-2026',
        paymentTerm: qPaymentTerm,
        deliveryTerm: qDeliveryTerm,
        project: qProject || '-',
        itemsCount: validRows.length,
        items: validRows.map((r, i) => ({
          id: `qi-${Date.now()}-${i}`,
          slNo: i + 1,
          productId: r.productId,
          productDescription: r.productDescription,
          unit: r.unit,
          quantity: r.quantity,
          rate: r.rate,
          discount: r.discount,
          amount: r.amount
        })),
        subTotal: subTotal,
        vatAmount: vat,
        totalAmount: total,
        status: 'Sent'
      };
      setQuotations([newQ, ...quotations]);
      alert('Sales Quotation created successfully!');
    }
    setModalOpen(false);
  };

  const openAddSalesOrderModal = () => {
    setEditingSalesOrderId(null);
    setSoRefNo(`SO-2026-${String(salesOrders.length + 115).padStart(3, '0')}`);
    setSoDate('18-Nov-2026');
    setSoCustomer('');
    setSoQuotRef('');
    setSoLpoRef('');
    setSoPaymentTerm('');
    setSoDeliveryDate('');
    setSoProject('');
    setSoProductRows([
      {
        id: '1',
        productId: '',
        productDescription: '',
        unit: '',
        quantity: 0,
        rate: 0,
        discount: 0,
        amount: 0
      }
    ]);
    setModalType('AddSalesOrder');
    setModalOpen(true);
  };

  const openEditSalesOrderModal = (so: SalesOrder) => {
    setEditingSalesOrderId(so.id);
    setSoRefNo(so.soNo || so.orderNo || '');
    setSoDate(so.date);
    setSoCustomer(so.customerName);
    setSoQuotRef(so.quotationRef && so.quotationRef !== '-' ? so.quotationRef : '');
    setSoLpoRef(so.lpoRef && so.lpoRef !== '-' ? so.lpoRef : '');
    setSoPaymentTerm(so.paymentTerm || '');
    setSoDeliveryDate(so.deliveryDate || so.expectedDelivery || '');
    setSoProject(so.project && so.project !== '-' ? so.project : '');
    if (so.items && so.items.length > 0) {
      setSoProductRows(
        so.items.map((it, idx) => ({
          id: String(idx + 1),
          productId: it.productId || '',
          productDescription: it.productDescription,
          unit: it.unit,
          quantity: it.quantity,
          rate: it.rate,
          discount: it.discount,
          amount: it.amount
        }))
      );
    } else {
      setSoProductRows([
        {
          id: '1',
          productId: '',
          productDescription: 'Confirmed Contract Order',
          unit: 'Lot',
          quantity: 1,
          rate: so.totalAmount,
          discount: 0,
          amount: so.totalAmount
        }
      ]);
    }
    setModalType('AddSalesOrder');
    setModalOpen(true);
  };

  const handleSoProductChange = (index: number, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    const updated = [...soProductRows];
    if (prod) {
      const qty = updated[index].quantity || 1;
      const rate = prod.sellingPrice || 0;
      const disc = updated[index].discount || 0;
      const amt = (qty * rate) * (1 - disc / 100);
      updated[index] = {
        ...updated[index],
        productId: prod.id,
        productDescription: prod.name,
        unit: prod.unit,
        rate: rate,
        amount: Math.round(amt * 100) / 100
      };
    } else {
      updated[index] = {
        ...updated[index],
        productId: '',
        productDescription: productId
      };
    }
    setSoProductRows(updated);
  };

  const handleSoRowFieldChange = (index: number, field: keyof SalesOrderProductRow, value: any) => {
    const updated = [...soProductRows];
    updated[index] = { ...updated[index], [field]: value };
    const qty = Number(field === 'quantity' ? value : updated[index].quantity) || 0;
    const rate = Number(field === 'rate' ? value : updated[index].rate) || 0;
    const disc = Number(field === 'discount' ? value : updated[index].discount) || 0;
    updated[index].amount = Math.round((qty * rate * (1 - disc / 100)) * 100) / 100;
    setSoProductRows(updated);
  };

  const handleAddSalesOrderProductRow = () => {
    setSoProductRows([
      ...soProductRows,
      {
        id: String(Date.now()),
        productId: '',
        productDescription: '',
        unit: 'MT',
        quantity: 1,
        rate: 0,
        discount: 0,
        amount: 0
      }
    ]);
  };

  const handleRemoveSalesOrderProductRow = (index: number) => {
    if (soProductRows.length === 1) {
      alert('Sales Order must contain at least one product row!');
      return;
    }
    setSoProductRows(soProductRows.filter((_, i) => i !== index));
  };

  const handleAddSalesOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!soCustomer) {
      alert('Please select a Customer!');
      return;
    }
    const validRows = soProductRows.filter((r) => r.productDescription && r.amount > 0);
    if (validRows.length === 0) {
      alert('Please add at least one product with quantity and rate!');
      return;
    }
    const subTotal = validRows.reduce((sum, r) => sum + r.amount, 0);
    const vat = Math.round(subTotal * 0.18 * 100) / 100;
    const total = Math.round((subTotal + vat) * 100) / 100;
    const code = soRefNo || `SO-2026-${String(salesOrders.length + 115).padStart(3, '0')}`;

    const newSO: SalesOrder = {
      id: String(Date.now()),
      soNo: code,
      orderNo: code,
      customerName: soCustomer,
      date: soDate,
      lpoRef: soLpoRef || 'LPO-001',
      quotationRef: soQuotRef || '-',
      paymentTerm: soPaymentTerm,
      deliveryDate: soDeliveryDate,
      expectedDelivery: soDeliveryDate,
      project: soProject || '-',
      itemsCount: validRows.length,
      items: validRows.map((r, i) => ({
        id: `soi-${Date.now()}-${i}`,
        slNo: i + 1,
        productId: r.productId,
        productDescription: r.productDescription,
        unit: r.unit,
        quantity: r.quantity,
        rate: r.rate,
        discount: r.discount,
        amount: r.amount
      })),
      subTotal: subTotal,
      vatAmount: vat,
      totalAmount: total,
      deliveryStatus: 'Pending',
      paymentStatus: 'Unpaid',
      status: 'Confirmed'
    };

    setSalesOrders([newSO, ...salesOrders]);
    if (editingSalesOrderId) {
      setSalesOrders(
        salesOrders.map((s) =>
          s.id === editingSalesOrderId
            ? {
              ...s,
              customerName: soCustomer,
              date: soDate,
              lpoRef: soLpoRef || '-',
              quotationRef: soQuotRef || '-',
              paymentTerm: soPaymentTerm,
              deliveryDate: soDeliveryDate,
              expectedDelivery: soDeliveryDate,
              project: soProject || '-',
              itemsCount: validRows.length,
              items: validRows.map((r, i) => ({
                id: `soi-${Date.now()}-${i}`,
                slNo: i + 1,
                productId: r.productId,
                productDescription: r.productDescription,
                unit: r.unit,
                quantity: r.quantity,
                rate: r.rate,
                discount: r.discount,
                amount: r.amount
              })),
              subTotal: subTotal,
              vatAmount: vat,
              totalAmount: total
            }
            : s
        )
      );
      setEditingSalesOrderId(null);
      alert('Sales Order updated successfully!');
    } else {
      const code = soRefNo || `SO-2026-${String(salesOrders.length + 115).padStart(3, '0')}`;
      const newSO: SalesOrder = {
        id: String(Date.now()),
        soNo: code,
        orderNo: code,
        customerName: soCustomer,
        date: soDate,
        lpoRef: soLpoRef || 'LPO-001',
        quotationRef: soQuotRef || '-',
        paymentTerm: soPaymentTerm,
        deliveryDate: soDeliveryDate,
        expectedDelivery: soDeliveryDate,
        project: soProject || '-',
        itemsCount: validRows.length,
        items: validRows.map((r, i) => ({
          id: `soi-${Date.now()}-${i}`,
          slNo: i + 1,
          productId: r.productId,
          productDescription: r.productDescription,
          unit: r.unit,
          quantity: r.quantity,
          rate: r.rate,
          discount: r.discount,
          amount: r.amount
        })),
        subTotal: subTotal,
        vatAmount: vat,
        totalAmount: total,
        deliveryStatus: 'Pending',
        paymentStatus: 'Unpaid',
        status: 'Confirmed'
      };
      setSalesOrders([newSO, ...salesOrders]);
      alert('Sales Order confirmed successfully!');
    }
    setModalOpen(false);
  };

  const openAddProFormaModal = () => {
    setEditingProFormaId(null);
    const nextPfNo = `PI-2026-${String(proFormaInvoices.length + 86).padStart(3, '0')}`;
    setPfRefNo(nextPfNo);
    setPfDate('18-Nov-2026');
    setPfSalesOrder('');
    setPfCustomer('');
    setPfLpoRef('');
    setPfPaymentTerms('');
    setPfDeliveryTerms('');
    setPfProject('');
    setPfClaimPercent(100);
    setPfProductRows([
      {
        id: '1',
        productId: '',
        productDescription: '',
        unit: '',
        quantity: 0,
        rate: 0,
        discount: 0,
        amount: 0
      }
    ]);
    setModalType('AddProForma');
    setModalOpen(true);
  };

  const openEditProFormaModal = (pf: ProFormaInvoice) => {
    setEditingProFormaId(pf.id);
    setPfRefNo(pf.referenceNo || pf.pfNo);
    setPfDate(pf.date);
    setPfSalesOrder(pf.salesOrderNo && pf.salesOrderNo !== 'SO-DIRECT' ? pf.salesOrderNo : '');
    setPfCustomer(pf.customerName);
    setPfLpoRef(pf.lpoRef && pf.lpoRef !== '-' ? pf.lpoRef : '');
    setPfPaymentTerms(pf.paymentTerms || '');
    setPfDeliveryTerms(pf.deliveryTerms && pf.deliveryTerms !== '-' ? pf.deliveryTerms : '');
    setPfProject(pf.project && pf.project !== '-' ? pf.project : '');
    setPfClaimPercent(pf.currentClaimPercent || 100);
    if (pf.items && pf.items.length > 0) {
      setPfProductRows(
        pf.items.map((it, idx) => ({
          id: String(idx + 1),
          productId: it.productId || '',
          productDescription: it.productDescription,
          unit: it.unit,
          quantity: it.quantity,
          rate: it.rate,
          discount: it.discount,
          amount: it.amount
        }))
      );
    } else {
      setPfProductRows([
        {
          id: '1',
          productId: '',
          productDescription: 'Pro-forma Contract Order',
          unit: 'Lot',
          quantity: 1,
          rate: pf.totalOrderValue || 0,
          discount: 0,
          amount: pf.totalOrderValue || 0
        }
      ]);
    }
    setModalType('AddProForma');
    setModalOpen(true);
  };

  const handlePfSalesOrderChange = (soNo: string) => {
    setPfSalesOrder(soNo);
    const so = salesOrders.find((s) => (s.soNo || s.orderNo) === soNo);
    if (so) {
      setPfCustomer(so.customerName);
      setPfLpoRef(so.lpoRef || '');
      if (so.paymentTerm) setPfPaymentTerms(so.paymentTerm);
      if (so.project) setPfProject(so.project);
      if (so.items && so.items.length > 0) {
        setPfProductRows(
          so.items.map((it, i) => ({
            id: String(i + 1),
            productId: it.productId || '',
            productDescription: it.productDescription,
            unit: it.unit,
            quantity: it.quantity,
            rate: it.rate,
            discount: it.discount,
            amount: it.amount
          }))
        );
      }
    }
  };

  const handlePfProductChange = (index: number, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    const updated = [...pfProductRows];
    if (prod) {
      const qty = updated[index].quantity || 1;
      const rate = prod.sellingPrice || 0;
      const disc = updated[index].discount || 0;
      const amt = (qty * rate) * (1 - disc / 100);
      updated[index] = {
        ...updated[index],
        productId: prod.id,
        productDescription: prod.name,
        unit: prod.unit,
        rate: rate,
        amount: Math.round(amt * 100) / 100
      };
    } else {
      updated[index] = {
        ...updated[index],
        productId: '',
        productDescription: productId
      };
    }
    setPfProductRows(updated);
  };

  const handlePfRowFieldChange = (index: number, field: keyof ProFormaProductRow, value: any) => {
    const updated = [...pfProductRows];
    updated[index] = { ...updated[index], [field]: value };
    const qty = Number(field === 'quantity' ? value : updated[index].quantity) || 0;
    const rate = Number(field === 'rate' ? value : updated[index].rate) || 0;
    const disc = Number(field === 'discount' ? value : updated[index].discount) || 0;
    updated[index].amount = Math.round((qty * rate * (1 - disc / 100)) * 100) / 100;
    setPfProductRows(updated);
  };

  const handleAddProFormaProductRow = () => {
    setPfProductRows([
      ...pfProductRows,
      {
        id: String(Date.now()),
        productId: '',
        productDescription: '',
        unit: 'MT',
        quantity: 1,
        rate: 0,
        discount: 0,
        amount: 0
      }
    ]);
  };

  const handleRemoveProFormaProductRow = (index: number) => {
    if (pfProductRows.length === 1) {
      alert('Pro-forma invoice must contain at least one product row!');
      return;
    }
    setPfProductRows(pfProductRows.filter((_, i) => i !== index));
  };

  const handleAddProForma = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pfCustomer) {
      alert('Please select a Customer!');
      return;
    }
    const validRows = pfProductRows.filter((r) => r.productDescription && r.amount > 0);
    if (validRows.length === 0) {
      alert('Please add at least one product with quantity and rate!');
      return;
    }
    const totalOrderVal = validRows.reduce((sum, r) => sum + r.amount, 0);
    const claimPct = Math.min(100, Math.max(1, pfClaimPercent || 100));
    const claimVal = Math.round((totalOrderVal * (claimPct / 100)) * 100) / 100;
    const vat = Math.round(claimVal * 0.18 * 100) / 100;

    const newPF: ProFormaInvoice = {
      id: String(Date.now()),
      pfNo: pfRefNo || `PI-2026-${String(proFormaInvoices.length + 86).padStart(3, '0')}`,
      referenceNo: pfRefNo || `PI-2026-${String(proFormaInvoices.length + 86).padStart(3, '0')}`,
      date: pfDate,
      customerName: pfCustomer,
      salesOrderNo: pfSalesOrder || 'SO-DIRECT',
      lpoRef: pfLpoRef || '-',
      paymentTerms: pfPaymentTerms,
      deliveryTerms: pfDeliveryTerms,
      project: pfProject || '-',
      totalOrderValue: totalOrderVal,
      currentClaimPercent: claimPct,
      currentClaimValue: claimVal,
      subTotal: claimVal,
      vatAmount: vat,
      items: validRows.map((r, i) => ({
        id: `pfi-${Date.now()}-${i}`,
        slNo: i + 1,
        productId: r.productId,
        productDescription: r.productDescription,
        unit: r.unit,
        quantity: r.quantity,
        rate: r.rate,
        discount: r.discount,
        amount: r.amount
      })),
      status: 'Sent'
    };

    setProFormaInvoices([newPF, ...proFormaInvoices]);
    if (editingProFormaId) {
      setProFormaInvoices(
        proFormaInvoices.map((p) =>
          p.id === editingProFormaId
            ? {
              ...p,
              date: pfDate,
              customerName: pfCustomer,
              salesOrderNo: pfSalesOrder || 'SO-DIRECT',
              lpoRef: pfLpoRef || '-',
              paymentTerms: pfPaymentTerms,
              deliveryTerms: pfDeliveryTerms,
              project: pfProject || '-',
              totalOrderValue: totalOrderVal,
              currentClaimPercent: claimPct,
              currentClaimValue: claimVal,
              subTotal: claimVal,
              vatAmount: vat,
              items: validRows.map((r, i) => ({
                id: `pfi-${Date.now()}-${i}`,
                slNo: i + 1,
                productId: r.productId,
                productDescription: r.productDescription,
                unit: r.unit,
                quantity: r.quantity,
                rate: r.rate,
                discount: r.discount,
                amount: r.amount
              }))
            }
            : p
        )
      );
      setEditingProFormaId(null);
      alert('Pro-forma Invoice updated successfully!');
    } else {
      const newPF: ProFormaInvoice = {
        id: String(Date.now()),
        pfNo: pfRefNo || `PI-2026-${String(proFormaInvoices.length + 86).padStart(3, '0')}`,
        referenceNo: pfRefNo || `PI-2026-${String(proFormaInvoices.length + 86).padStart(3, '0')}`,
        date: pfDate,
        customerName: pfCustomer,
        salesOrderNo: pfSalesOrder || 'SO-DIRECT',
        lpoRef: pfLpoRef || '-',
        paymentTerms: pfPaymentTerms,
        deliveryTerms: pfDeliveryTerms,
        project: pfProject || '-',
        totalOrderValue: totalOrderVal,
        currentClaimPercent: claimPct,
        currentClaimValue: claimVal,
        subTotal: claimVal,
        vatAmount: vat,
        items: validRows.map((r, i) => ({
          id: `pfi-${Date.now()}-${i}`,
          slNo: i + 1,
          productId: r.productId,
          productDescription: r.productDescription,
          unit: r.unit,
          quantity: r.quantity,
          rate: r.rate,
          discount: r.discount,
          amount: r.amount
        })),
        status: 'Sent'
      };
      setProFormaInvoices([newPF, ...proFormaInvoices]);
      alert('Pro-forma Invoice issued successfully!');
    }
    setModalOpen(false);
  };

  // --- DELIVERY NOTE HANDLERS (Exact steel_erp delivernote.php) ---
  const openAddDeliveryNoteModal = () => {
    setEditingDeliveryNoteId(null);
    setDnRefNo(`DN-2026-${String(deliveryNotes.length + 95).padStart(3, '0')}`);
    setDnDate('18-Nov-2026');
    setDnCustomer('');
    setDnSalesOrder('');
    setDnLpoRef('');
    setDnPaymentTerms('');
    setDnProject('');
    setDnProductRows([
      {
        id: '1',
        productId: '',
        productDescription: '',
        unit: 'MT',
        orderQty: 0,
        deliveredQty: 0,
        currentDelivery: 0
      }
    ]);
    setModalType('AddDeliveryNote');
    setModalOpen(true);
  };

  const openEditDeliveryNoteModal = (dn: DeliveryNote) => {
    setEditingDeliveryNoteId(dn.id);
    setDnRefNo(dn.dnNo);
    setDnDate(dn.date);
    setDnCustomer(dn.customerName);
    setDnSalesOrder(dn.salesOrderNo || dn.soRef || '');
    setDnLpoRef(dn.lpoRef || '');
    setDnPaymentTerms(dn.paymentTerms || '');
    setDnProject(dn.project || '');
    if (dn.items && dn.items.length > 0) {
      setDnProductRows(
        dn.items.map((it, idx) => ({
          id: String(idx + 1),
          productId: it.productId || '',
          productDescription: it.productDescription,
          unit: it.unit,
          orderQty: it.orderQty,
          deliveredQty: it.deliveredQty,
          currentDelivery: it.currentDelivery
        }))
      );
    } else {
      setDnProductRows([
        {
          id: '1',
          productId: '',
          productDescription: 'Delivered Steel Materials',
          unit: 'MT',
          orderQty: dn.itemsDelivered || 1,
          deliveredQty: 0,
          currentDelivery: dn.itemsDelivered || 1
        }
      ]);
    }
    setModalType('AddDeliveryNote');
    setModalOpen(true);
  };

  const handleDnSalesOrderChange = (soNo: string) => {
    setDnSalesOrder(soNo);
    const so = salesOrders.find((s) => (s.soNo || s.orderNo) === soNo);
    if (so) {
      setDnCustomer(so.customerName);
      setDnLpoRef(so.lpoRef || '');
      if (so.paymentTerm) setDnPaymentTerms(so.paymentTerm);
      if (so.project) setDnProject(so.project);
      if (so.items && so.items.length > 0) {
        setDnProductRows(
          so.items.map((it, i) => ({
            id: String(i + 1),
            productId: it.productId || '',
            productDescription: it.productDescription,
            unit: it.unit,
            orderQty: it.quantity,
            deliveredQty: 0,
            currentDelivery: it.quantity
          }))
        );
      }
    }
  };

  const handleDnProductChange = (index: number, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    const updated = [...dnProductRows];
    if (prod) {
      updated[index] = {
        ...updated[index],
        productId: prod.id,
        productDescription: prod.name,
        unit: prod.unit
      };
    } else {
      updated[index] = {
        ...updated[index],
        productId: '',
        productDescription: productId
      };
    }
    setDnProductRows(updated);
  };

  const handleDnRowFieldChange = (index: number, field: keyof DeliveryNoteProductRow, value: any) => {
    const updated = [...dnProductRows];
    updated[index] = { ...updated[index], [field]: value };
    setDnProductRows(updated);
  };

  const handleAddDnProductRow = () => {
    setDnProductRows([
      ...dnProductRows,
      {
        id: String(Date.now()),
        productId: '',
        productDescription: '',
        unit: 'MT',
        orderQty: 0,
        deliveredQty: 0,
        currentDelivery: 0
      }
    ]);
  };

  const handleRemoveDnProductRow = (index: number) => {
    if (dnProductRows.length === 1) {
      alert('Delivery note must contain at least one item row!');
      return;
    }
    setDnProductRows(dnProductRows.filter((_, i) => i !== index));
  };

  const handleSaveDeliveryNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dnCustomer) {
      alert('Please select a Customer!');
      return;
    }
    const validRows = dnProductRows.filter((r) => r.productDescription.trim() !== '');
    if (validRows.length === 0) {
      alert('Please add at least one product description!');
      return;
    }
    const totalDelivered = validRows.reduce((sum, r) => sum + (Number(r.currentDelivery) || 0), 0);
    const estAmount = validRows.reduce((sum, r) => {
      const prod = products.find((p) => p.id === r.productId);
      const rate = prod?.sellingPrice || 500;
      return sum + (Number(r.currentDelivery) || 0) * rate;
    }, 0);

    const items: DeliveryNoteItem[] = validRows.map((r, i) => ({
      id: `dni-${Date.now()}-${i}`,
      slNo: i + 1,
      productId: r.productId,
      productDescription: r.productDescription,
      unit: r.unit,
      orderQty: Number(r.orderQty) || 0,
      deliveredQty: Number(r.deliveredQty) || 0,
      currentDelivery: Number(r.currentDelivery) || 0
    }));

    if (editingDeliveryNoteId) {
      setDeliveryNotes(
        deliveryNotes.map((d) =>
          d.id === editingDeliveryNoteId
            ? {
                ...d,
                dnNo: dnRefNo,
                date: dnDate,
                customerName: dnCustomer,
                soRef: dnSalesOrder || 'SO-DIRECT',
                salesOrderNo: dnSalesOrder || 'SO-DIRECT',
                lpoRef: dnLpoRef || '-',
                paymentTerms: dnPaymentTerms || '-',
                project: dnProject || '-',
                itemsDelivered: totalDelivered,
                itemsCount: items.length,
                amount: d.amount || estAmount || 18500,
                items: items
              }
            : d
        )
      );
      setEditingDeliveryNoteId(null);
      alert('Delivery Note updated successfully!');
    } else {
      const newDN: DeliveryNote = {
        id: String(Date.now()),
        dnNo: dnRefNo || `DN-2026-${String(deliveryNotes.length + 95).padStart(3, '0')}`,
        date: dnDate,
        customerName: dnCustomer,
        soRef: dnSalesOrder || 'SO-DIRECT',
        salesOrderNo: dnSalesOrder || 'SO-DIRECT',
        lpoRef: dnLpoRef || '-',
        paymentTerms: dnPaymentTerms || '-',
        project: dnProject || '-',
        itemsDelivered: totalDelivered,
        itemsCount: items.length,
        amount: estAmount || 18500,
        status: 'Delivered',
        items: items
      };
      setDeliveryNotes([newDN, ...deliveryNotes]);
      alert('Delivery Note created successfully!');
    }
    setModalOpen(false);
  };

  // --- CASH INVOICE HANDLERS (Exact steel_erp cash-invoice.php) ---
  const openAddCashInvoiceModal = () => {
    setEditingCashInvoiceId(null);
    setCiRefNo(`CSH-2026-${String(invoices.length + 107).padStart(3, '0')}`);
    setCiDate('18-Nov-2026');
    setCiCustomer('');
    setCiCreditAccount('Cash in Hand - Conakry Central');
    setCiSalesOrder('');
    setCiLpoRef('');
    setCiPaymentTerms('Cash on Delivery');
    setCiProject('');
    setCiAdvanceAmount(0);
    setCiProductRows([
      {
        id: '1',
        productId: '',
        productDescription: '',
        unit: 'MT',
        quantity: 0,
        rate: 0,
        discount: 0,
        amount: 0
      }
    ]);
    setModalType('AddCashInvoice');
    setModalOpen(true);
  };

  const openEditCashInvoiceModal = (inv: SalesInvoice) => {
    setEditingCashInvoiceId(inv.id);
    setCiRefNo(inv.invoiceNo);
    setCiDate(inv.date);
    setCiCustomer(inv.customerName);
    setCiCreditAccount(inv.creditAccount || 'Cash in Hand - Conakry Central');
    setCiSalesOrder(inv.salesOrderRef || inv.soRef || '');
    setCiLpoRef(inv.lpoRef || '');
    setCiPaymentTerms(inv.paymentTerms || 'Cash on Delivery');
    setCiProject(inv.project || '');
    setCiAdvanceAmount(inv.advanceAmount || 0);
    if (inv.items && inv.items.length > 0) {
      setCiProductRows(
        inv.items.map((it, idx) => ({
          id: String(idx + 1),
          productId: it.productId || '',
          productDescription: it.productDescription,
          unit: it.unit,
          quantity: it.quantity,
          rate: it.rate,
          discount: it.discount,
          amount: it.amount
        }))
      );
    } else {
      setCiProductRows([
        {
          id: '1',
          productId: '',
          productDescription: 'Invoiced Steel Products',
          unit: 'Lot',
          quantity: 1,
          rate: inv.totalAmount,
          discount: 0,
          amount: inv.totalAmount
        }
      ]);
    }
    setModalType('AddCashInvoice');
    setModalOpen(true);
  };

  const handleCiSalesOrderChange = (soNo: string) => {
    setCiSalesOrder(soNo);
    const so = salesOrders.find((s) => (s.soNo || s.orderNo) === soNo);
    if (so) {
      setCiCustomer(so.customerName);
      setCiLpoRef(so.lpoRef || '');
      if (so.paymentTerm) setCiPaymentTerms(so.paymentTerm);
      if (so.project) setCiProject(so.project);
      if (so.items && so.items.length > 0) {
        setCiProductRows(
          so.items.map((it, i) => ({
            id: String(i + 1),
            productId: it.productId || '',
            productDescription: it.productDescription,
            unit: it.unit,
            quantity: it.quantity,
            rate: it.rate,
            discount: it.discount,
            amount: it.amount
          }))
        );
      }
    }
  };

  const handleCiProductChange = (index: number, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    const updated = [...ciProductRows];
    if (prod) {
      const qty = updated[index].quantity || 1;
      const rate = prod.sellingPrice || 0;
      const disc = updated[index].discount || 0;
      const amt = (qty * rate) * (1 - disc / 100);
      updated[index] = {
        ...updated[index],
        productId: prod.id,
        productDescription: prod.name,
        unit: prod.unit,
        rate: rate,
        amount: Math.round(amt * 100) / 100
      };
    } else {
      updated[index] = {
        ...updated[index],
        productId: '',
        productDescription: productId
      };
    }
    setCiProductRows(updated);
  };

  const handleCiRowFieldChange = (index: number, field: keyof CashInvoiceProductRow, value: any) => {
    const updated = [...ciProductRows];
    updated[index] = { ...updated[index], [field]: value };
    const qty = Number(field === 'quantity' ? value : updated[index].quantity) || 0;
    const rate = Number(field === 'rate' ? value : updated[index].rate) || 0;
    const disc = Number(field === 'discount' ? value : updated[index].discount) || 0;
    updated[index].amount = Math.round((qty * rate * (1 - disc / 100)) * 100) / 100;
    setCiProductRows(updated);
  };

  const handleAddCiProductRow = () => {
    setCiProductRows([
      ...ciProductRows,
      {
        id: String(Date.now()),
        productId: '',
        productDescription: '',
        unit: 'MT',
        quantity: 0,
        rate: 0,
        discount: 0,
        amount: 0
      }
    ]);
  };

  const handleRemoveCiProductRow = (index: number) => {
    if (ciProductRows.length === 1) {
      alert('Cash invoice must contain at least one product row!');
      return;
    }
    setCiProductRows(ciProductRows.filter((_, i) => i !== index));
  };

  const handleSaveCashInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ciCustomer) {
      alert('Please select a Customer!');
      return;
    }
    const validRows = ciProductRows.filter((r) => r.productDescription.trim() !== '' && r.amount > 0);
    if (validRows.length === 0) {
      alert('Please add at least one product with quantity and rate!');
      return;
    }
    const totalAmt = validRows.reduce((sum, r) => sum + r.amount, 0);
    const advAmt = Number(ciAdvanceAmount) || 0;
    const balDue = Math.max(0, totalAmt - advAmt);

    const items: SalesInvoiceItem[] = validRows.map((r, i) => ({
      id: `cii-${Date.now()}-${i}`,
      slNo: i + 1,
      productId: r.productId,
      productDescription: r.productDescription,
      unit: r.unit,
      quantity: r.quantity,
      rate: r.rate,
      discount: r.discount,
      amount: r.amount
    }));

    if (editingCashInvoiceId) {
      setInvoices(
        invoices.map((inv) =>
          inv.id === editingCashInvoiceId
            ? {
                ...inv,
                invoiceNo: ciRefNo,
                date: ciDate,
                customerName: ciCustomer,
                creditAccount: ciCreditAccount,
                salesOrderRef: ciSalesOrder || 'SO-DIRECT',
                soRef: ciSalesOrder || 'SO-DIRECT',
                lpoRef: ciLpoRef || '-',
                paymentTerms: ciPaymentTerms || 'Cash on Delivery',
                project: ciProject || '-',
                totalAmount: totalAmt,
                paidAmount: advAmt,
                advanceAmount: advAmt,
                balanceDue: balDue,
                items: items
              }
            : inv
        )
      );
      setEditingCashInvoiceId(null);
      alert('Cash Invoice updated successfully!');
    } else {
      const newInv: SalesInvoice = {
        id: String(Date.now()),
        invoiceNo: ciRefNo || `CSH-2026-${String(invoices.length + 107).padStart(3, '0')}`,
        date: ciDate,
        invoiceType: 'Cash',
        customerName: ciCustomer,
        creditAccount: ciCreditAccount,
        salesOrderRef: ciSalesOrder || 'SO-DIRECT',
        soRef: ciSalesOrder || 'SO-DIRECT',
        lpoRef: ciLpoRef || '-',
        paymentTerms: ciPaymentTerms || 'Cash on Delivery',
        project: ciProject || '-',
        dueDate: ciDate,
        totalAmount: totalAmt,
        paidAmount: advAmt,
        advanceAmount: advAmt,
        balanceDue: balDue,
        status: balDue === 0 ? 'Paid' : 'Partial',
        items: items
      };
      setInvoices([newInv, ...invoices]);
      alert('Cash Invoice created successfully!');
    }
    setModalOpen(false);
  };

  const handleAddDeliveryNote = (e: React.FormEvent) => {
    handleSaveDeliveryNote(e);
  };

  // --- CREDIT INVOICE HANDLERS (Exact steel_erp credit-invoice.php) ---
  const openAddCreditInvoiceModal = () => {
    setEditingCreditInvoiceId(null);
    setCciRefNo(`INV-2026-${String(invoices.length + 114).padStart(3, '0')}`);
    setCciDate('18-Nov-2026');
    setCciCustomer('');
    setCciCreditAccount('Accounts Receivable');
    setCciSalesOrder('');
    setCciLpoRef('');
    setCciPaymentTerms('30 Days Net');
    setCciProject('');
    setCciAdvanceAmount(0);
    setCciProductRows([
      {
        id: '1',
        dnNo: '',
        productId: '',
        productDescription: '',
        unit: 'MT',
        quantity: 0,
        rate: 0,
        discount: 0,
        amount: 0
      }
    ]);
    setModalType('AddCreditInvoice');
    setModalOpen(true);
  };

  const openEditCreditInvoiceModal = (inv: SalesInvoice) => {
    setEditingCreditInvoiceId(inv.id);
    setCciRefNo(inv.invoiceNo);
    setCciDate(inv.date);
    setCciCustomer(inv.customerName);
    setCciCreditAccount(inv.creditAccount || 'Accounts Receivable');
    setCciSalesOrder(inv.salesOrderRef || inv.soRef || '');
    setCciLpoRef(inv.lpoRef || '');
    setCciPaymentTerms(inv.paymentTerms || '30 Days Net');
    setCciProject(inv.project || '');
    setCciAdvanceAmount(inv.advanceAmount || 0);
    if (inv.items && inv.items.length > 0) {
      setCciProductRows(
        inv.items.map((it, idx) => ({
          id: String(idx + 1),
          dnNo: '',
          productId: it.productId || '',
          productDescription: it.productDescription,
          unit: it.unit,
          quantity: it.quantity,
          rate: it.rate,
          discount: it.discount,
          amount: it.amount
        }))
      );
    } else {
      setCciProductRows([
        {
          id: '1',
          dnNo: '',
          productId: '',
          productDescription: 'Delivered Steel Materials (Credit)',
          unit: 'Lot',
          quantity: 1,
          rate: inv.totalAmount,
          discount: 0,
          amount: inv.totalAmount
        }
      ]);
    }
    setModalType('AddCreditInvoice');
    setModalOpen(true);
  };

  const handleCciSalesOrderChange = (soNo: string) => {
    setCciSalesOrder(soNo);
    const so = salesOrders.find((s) => (s.soNo || s.orderNo) === soNo);
    if (so) {
      setCciCustomer(so.customerName);
      setCciLpoRef(so.lpoRef || '');
      if (so.paymentTerm) setCciPaymentTerms(so.paymentTerm);
      if (so.project) setCciProject(so.project);
      const linkedDn = deliveryNotes.find((d) => d.salesOrderNo === soNo || d.soRef === soNo);
      if (so.items && so.items.length > 0) {
        setCciProductRows(
          so.items.map((it, i) => ({
            id: String(i + 1),
            dnNo: linkedDn?.dnNo || '',
            productId: it.productId || '',
            productDescription: it.productDescription,
            unit: it.unit,
            quantity: it.quantity,
            rate: it.rate,
            discount: it.discount,
            amount: it.amount
          }))
        );
      }
    }
  };

  const handleCciProductChange = (index: number, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    const updated = [...cciProductRows];
    if (prod) {
      const qty = updated[index].quantity || 1;
      const rate = prod.sellingPrice || 0;
      const disc = updated[index].discount || 0;
      const amt = (qty * rate) * (1 - disc / 100);
      updated[index] = {
        ...updated[index],
        productId: prod.id,
        productDescription: prod.name,
        unit: prod.unit,
        rate: rate,
        amount: Math.round(amt * 100) / 100
      };
    } else {
      updated[index] = {
        ...updated[index],
        productId: '',
        productDescription: productId
      };
    }
    setCciProductRows(updated);
  };

  const handleCciRowFieldChange = (index: number, field: keyof CreditInvoiceProductRow, value: any) => {
    const updated = [...cciProductRows];
    updated[index] = { ...updated[index], [field]: value };
    const qty = Number(field === 'quantity' ? value : updated[index].quantity) || 0;
    const rate = Number(field === 'rate' ? value : updated[index].rate) || 0;
    const disc = Number(field === 'discount' ? value : updated[index].discount) || 0;
    updated[index].amount = Math.round((qty * rate * (1 - disc / 100)) * 100) / 100;
    setCciProductRows(updated);
  };

  const handleAddCciProductRow = () => {
    setCciProductRows([
      ...cciProductRows,
      {
        id: String(Date.now()),
        dnNo: '',
        productId: '',
        productDescription: '',
        unit: 'MT',
        quantity: 0,
        rate: 0,
        discount: 0,
        amount: 0
      }
    ]);
  };

  const handleRemoveCciProductRow = (index: number) => {
    if (cciProductRows.length === 1) {
      alert('Credit invoice must contain at least one product row!');
      return;
    }
    setCciProductRows(cciProductRows.filter((_, i) => i !== index));
  };

  const handleSaveCreditInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cciCustomer) {
      alert('Please select a Customer!');
      return;
    }
    const validRows = cciProductRows.filter((r) => r.productDescription.trim() !== '' && r.amount > 0);
    if (validRows.length === 0) {
      alert('Please add at least one product with quantity and rate!');
      return;
    }
    const totalAmt = validRows.reduce((sum, r) => sum + r.amount, 0);
    const advAmt = Number(cciAdvanceAmount) || 0;
    const balDue = Math.max(0, totalAmt - advAmt);

    const items: SalesInvoiceItem[] = validRows.map((r, i) => ({
      id: `ccii-${Date.now()}-${i}`,
      slNo: i + 1,
      productId: r.productId,
      productDescription: r.productDescription,
      unit: r.unit,
      quantity: r.quantity,
      rate: r.rate,
      discount: r.discount,
      amount: r.amount
    }));

    if (editingCreditInvoiceId) {
      setInvoices(
        invoices.map((inv) =>
          inv.id === editingCreditInvoiceId
            ? {
                ...inv,
                invoiceNo: cciRefNo,
                date: cciDate,
                customerName: cciCustomer,
                creditAccount: cciCreditAccount,
                salesOrderRef: cciSalesOrder || 'SO-DIRECT',
                soRef: cciSalesOrder || 'SO-DIRECT',
                lpoRef: cciLpoRef || '-',
                paymentTerms: cciPaymentTerms || '30 Days Net',
                project: cciProject || '-',
                totalAmount: totalAmt,
                paidAmount: advAmt,
                advanceAmount: advAmt,
                balanceDue: balDue,
                items: items
              }
            : inv
        )
      );
      setEditingCreditInvoiceId(null);
      alert('Credit Invoice updated successfully!');
    } else {
      const newInv: SalesInvoice = {
        id: String(Date.now()),
        invoiceNo: cciRefNo || `INV-2026-${String(invoices.length + 114).padStart(3, '0')}`,
        date: cciDate,
        invoiceType: 'Credit',
        customerName: cciCustomer,
        creditAccount: cciCreditAccount,
        salesOrderRef: cciSalesOrder || 'SO-DIRECT',
        soRef: cciSalesOrder || 'SO-DIRECT',
        lpoRef: cciLpoRef || '-',
        paymentTerms: cciPaymentTerms || '30 Days Net',
        project: cciProject || '-',
        dueDate: '18-Dec-2026',
        totalAmount: totalAmt,
        paidAmount: advAmt,
        advanceAmount: advAmt,
        balanceDue: balDue,
        status: balDue === 0 ? 'Paid' : 'Unpaid',
        items: items
      };
      setInvoices([newInv, ...invoices]);
      alert('Credit Invoice created successfully!');
    }
    setModalOpen(false);
  };

  // --- SALES RETURN HANDLERS (Exact steel_erp sales-return.php) ---
  const openAddSalesReturnModal = () => {
    setEditingSalesReturnId(null);
    setSrRefNo(`SR-2026-${String(salesReturns.length + 10).padStart(3, '0')}`);
    setSrDate('18-Nov-2026');
    setSrCustomer('');
    setSrInvoiceNo('');
    setSrDebitAccount('Accounts Receivable');
    setSrLpoRef('');
    setSrPaymentTerms('30 Days Net');
    setSrProject('');
    setSrReason('');
    setSrProductRows([
      {
        id: '1',
        productId: '',
        productDescription: '',
        unit: 'MT',
        quantity: 0,
        rate: 0,
        discount: 0,
        amount: 0
      }
    ]);
    setModalType('AddSalesReturn');
    setModalOpen(true);
  };

  const openEditSalesReturnModal = (sr: SalesReturn) => {
    setEditingSalesReturnId(sr.id);
    setSrRefNo(sr.returnNo);
    setSrDate(sr.date);
    setSrCustomer(sr.customerName);
    setSrInvoiceNo(sr.invoiceNo);
    setSrDebitAccount(sr.debitAccount || 'Accounts Receivable');
    setSrLpoRef(sr.lpoRef || '');
    setSrPaymentTerms(sr.paymentTerms || '30 Days Net');
    setSrProject(sr.project || '');
    setSrReason(sr.reason || '');
    if (sr.items && sr.items.length > 0) {
      setSrProductRows(
        sr.items.map((it, idx) => ({
          id: String(idx + 1),
          productId: it.productId || '',
          productDescription: it.productDescription,
          unit: it.unit,
          quantity: it.quantity,
          rate: it.rate,
          discount: it.discount,
          amount: it.amount
        }))
      );
    } else {
      setSrProductRows([
        {
          id: '1',
          productId: '',
          productDescription: sr.reason || 'Returned Materials',
          unit: 'Lot',
          quantity: 1,
          rate: sr.amount,
          discount: 0,
          amount: sr.amount
        }
      ]);
    }
    setModalType('AddSalesReturn');
    setModalOpen(true);
  };

  const handleSrInvoiceChange = (invNo: string) => {
    setSrInvoiceNo(invNo);
    const inv = invoices.find((i) => i.invoiceNo === invNo);
    if (inv) {
      setSrCustomer(inv.customerName);
      setSrDebitAccount(inv.creditAccount || 'Accounts Receivable');
      setSrLpoRef(inv.lpoRef || '');
      setSrPaymentTerms(inv.paymentTerms || '');
      setSrProject(inv.project || '');
      if (inv.items && inv.items.length > 0) {
        setSrProductRows(
          inv.items.map((it, idx) => ({
            id: String(idx + 1),
            productId: it.productId || '',
            productDescription: it.productDescription,
            unit: it.unit,
            quantity: it.quantity,
            rate: it.rate,
            discount: it.discount,
            amount: it.amount
          }))
        );
      }
    }
  };

  const handleSrProductChange = (index: number, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    const updated = [...srProductRows];
    if (prod) {
      const qty = updated[index].quantity || 1;
      const rate = prod.sellingPrice || 0;
      const disc = updated[index].discount || 0;
      const amt = (qty * rate) * (1 - disc / 100);
      updated[index] = {
        ...updated[index],
        productId: prod.id,
        productDescription: prod.name,
        unit: prod.unit,
        rate: rate,
        amount: Math.round(amt * 100) / 100
      };
    } else {
      updated[index] = {
        ...updated[index],
        productId: '',
        productDescription: productId
      };
    }
    setSrProductRows(updated);
  };

  const handleSrRowFieldChange = (index: number, field: keyof SalesReturnProductRow, value: any) => {
    const updated = [...srProductRows];
    updated[index] = { ...updated[index], [field]: value };
    const qty = Number(field === 'quantity' ? value : updated[index].quantity) || 0;
    const rate = Number(field === 'rate' ? value : updated[index].rate) || 0;
    const disc = Number(field === 'discount' ? value : updated[index].discount) || 0;
    updated[index].amount = Math.round((qty * rate * (1 - disc / 100)) * 100) / 100;
    setSrProductRows(updated);
  };

  const handleAddSrProductRow = () => {
    setSrProductRows([
      ...srProductRows,
      {
        id: String(Date.now()),
        productId: '',
        productDescription: '',
        unit: 'MT',
        quantity: 0,
        rate: 0,
        discount: 0,
        amount: 0
      }
    ]);
  };

  const handleRemoveSrProductRow = (index: number) => {
    if (srProductRows.length === 1) {
      alert('Sales return must contain at least one product row!');
      return;
    }
    setSrProductRows(srProductRows.filter((_, i) => i !== index));
  };

  const handleSaveSalesReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srCustomer) {
      alert('Please select a Customer!');
      return;
    }
    const validRows = srProductRows.filter((r) => r.productDescription.trim() !== '' && r.amount > 0);
    if (validRows.length === 0) {
      alert('Please add at least one product with quantity and rate!');
      return;
    }
    const totalAmt = validRows.reduce((sum, r) => sum + r.amount, 0);

    const items: SalesReturnItem[] = validRows.map((r, i) => ({
      id: `sri-${Date.now()}-${i}`,
      slNo: i + 1,
      productId: r.productId,
      productDescription: r.productDescription,
      unit: r.unit,
      quantity: r.quantity,
      rate: r.rate,
      discount: r.discount,
      amount: r.amount
    }));

    if (editingSalesReturnId) {
      setSalesReturns(
        salesReturns.map((sr) =>
          sr.id === editingSalesReturnId
            ? {
                ...sr,
                returnNo: srRefNo,
                date: srDate,
                customerName: srCustomer,
                invoiceNo: srInvoiceNo || '-',
                debitAccount: srDebitAccount,
                lpoRef: srLpoRef || '-',
                paymentTerms: srPaymentTerms || '-',
                project: srProject || '-',
                reason: srReason || 'Defective material',
                amount: totalAmt,
                items: items
              }
            : sr
        )
      );
      setEditingSalesReturnId(null);
      alert('Sales Return updated successfully!');
    } else {
      const newSR: SalesReturn = {
        id: String(Date.now()),
        returnNo: srRefNo || `SR-2026-${String(salesReturns.length + 10).padStart(3, '0')}`,
        date: srDate,
        customerName: srCustomer,
        invoiceNo: srInvoiceNo || '-',
        debitAccount: srDebitAccount,
        lpoRef: srLpoRef || '-',
        paymentTerms: srPaymentTerms || '-',
        project: srProject || '-',
        reason: srReason || 'Defective material',
        amount: totalAmt,
        status: 'Processed',
        items: items
      };
      setSalesReturns([newSR, ...salesReturns]);
      alert('Sales Return created successfully!');
    }
    setModalOpen(false);
  };

  // Sub-header tabs replicated from steel_erp/app/Views/crm/crm_sub_header.php
  const tabs = [
    { key: 'ProductHead', label: 'Product Details' },
    { key: 'Products', label: 'Products' },
    { key: 'CustomerCreation', label: 'Customer Creation' },
    { key: 'SalesQuotation', label: 'Sales Quotation' },
    { key: 'SalesOrder', label: 'Sales Order' },
    { key: 'ProFormaInvoice', label: 'Pro-forma Invoice' },
    { key: 'DeliverNote', label: 'Delivery Note' },
    { key: 'CashInvoice', label: 'Cash Invoice' },
    { key: 'CreditInvoice', label: 'Credit Invoice' },
    { key: 'SalesReturn', label: 'Sales Return' }
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Compass className="w-6 h-6 text-amber-600" /> CRM & Commercial Sales Module
          </h1>
          <p className="text-xs text-slate-500">
            Products, Customer Accounts, Quotation Engine, Sales Orders, Delivery Notes, and Invoicing.
          </p>
        </div>
      </div>

      {/* Primary Section Switcher (steel_erp sub_header.php) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSection('CRM')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeSection === 'CRM'
            ? 'bg-amber-600 text-white shadow-sm shadow-amber-900/20'
            : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <Compass className="w-4 h-4" />
          <span>Customer Relationship Management</span>
        </button>

        <button
          onClick={() => setActiveSection('Reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeSection === 'Reports'
            ? 'bg-amber-600 text-white shadow-sm shadow-amber-900/20'
            : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
        >
          <FileBarChart className="w-4 h-4" />
          <span>CRM Reports</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${activeSection === 'Reports' ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-700'
              }`}
          >
            15 Reports
          </span>
        </button>
      </div>

      {activeSection === 'Reports' ? (
        <CrmReports />
      ) : (
        <>
          {/* Sub-Header Tabs (Replicated from steel_erp crm/crm_sub_header.php) */}
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
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: PRODUCT HEAD (Exact steel_erp product_heads.php: Sl no, Code, Product Head, Actions) */}
          {activeTab === 'ProductHead' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search product heads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <button onClick={openAddProductHeadModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3" style={{ width: '40px' }}>Sl no</th>
                      <th className="px-4 py-3" style={{ width: '120px' }}>Code</th>
                      <th className="px-4 py-3">Product Head</th>
                      <th className="px-4 py-3 text-right" style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {productHeads
                      .filter(
                        (ph) =>
                          ph.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ph.code.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((ph, index) => (
                        <tr key={ph.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-700">{ph.code}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{ph.name}</td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button onClick={() => openEditProductHeadModal(ph)} className="text-slate-500 hover:text-amber-600 p-1" title="Edit">
                              <Edit className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${ph.name}?`)) setProductHeads(productHeads.filter((x) => x.id !== ph.id));
                              }}
                              className="text-slate-500 hover:text-rose-600 p-1"
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

          {/* TAB 2: PRODUCTS (Exact steel_erp products.php: Sl no, Code, Product Name, Product Head, Actions) */}
          {activeTab === 'Products' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <button onClick={openAddProductModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3" style={{ width: '40px' }}>Sl no</th>
                      <th className="px-4 py-3" style={{ width: '120px' }}>Code</th>
                      <th className="px-4 py-3">Product Name</th>
                      <th className="px-4 py-3" style={{ width: '220px' }}>Product Head</th>
                      <th className="px-4 py-3 text-right" style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products
                      .filter(
                        (p) =>
                          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.code.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((prod, index) => (
                        <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-700">{prod.code}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{prod.name}</td>
                          <td className="px-4 py-3 text-slate-600">{prod.category}</td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button onClick={() => openEditProductModal(prod)} className="text-slate-500 hover:text-amber-600 p-1" title="Edit">
                              <Edit className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${prod.name}?`)) setProducts(products.filter((x) => x.id !== prod.id));
                              }}
                              className="text-slate-500 hover:text-rose-600 p-1"
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

          {/* TAB 3: CUSTOMER CREATION (Exact steel_erp customer.php: Sl no, Customer Name, Post Box, Phone Number, Actions) */}
          {activeTab === 'CustomerCreation' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <button onClick={openAddCustomerModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3" style={{ width: '40px' }}>Sl no</th>
                      <th className="px-4 py-3">Customer Name</th>
                      <th className="px-4 py-3" style={{ width: '120px' }}>Post Box</th>
                      <th className="px-4 py-3" style={{ width: '160px' }}>Phone Number</th>
                      <th className="px-4 py-3 text-right" style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customers
                      .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((cust, index) => (
                        <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-bold text-slate-800">{cust.name}</td>
                          <td className="px-4 py-3 text-slate-600">{cust.postBox || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{cust.phone}</td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button onClick={() => alert(`View ${cust.name}`)} className="text-slate-500 hover:text-purple-600 p-1" title="View">
                              <Eye className="w-3.5 h-3.5 inline" />
                            </button>
                            <button onClick={() => openEditCustomerModal(cust)} className="text-slate-500 hover:text-amber-600 p-1" title="Edit">
                              <Edit className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${cust.name}?`)) setCustomers(customers.filter((x) => x.id !== cust.id));
                              }}
                              className="text-slate-500 hover:text-rose-600 p-1"
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

          {/* TAB 5: SALES QUOTATION (Exact steel_erp sales_quotation.php: Sl no, Reference, Date, Customer, Enquiry Number, Amount, Actions) */}
          {activeTab === 'SalesQuotation' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search quotations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <button
                  onClick={openAddQuotationModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3" style={{ width: '40px' }}>Sl no</th>
                      <th className="px-4 py-3" style={{ width: '130px' }}>Reference</th>
                      <th className="px-4 py-3" style={{ width: '110px' }}>Date</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3" style={{ width: '140px' }}>Enquiry Number</th>
                      <th className="px-4 py-3 text-right" style={{ width: '110px' }}>Amount</th>
                      <th className="px-4 py-3 text-right" style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {quotations
                      .filter((q) => q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || q.quotationNo.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((q, index) => (
                        <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">{q.quotationNo}</td>
                          <td className="px-4 py-3 text-slate-600">{q.date}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{q.customerName}</td>
                          <td className="px-4 py-3 font-mono text-slate-600">{q.enquiryRef}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">${q.totalAmount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => {
                                setSelectedQuotation(q);
                                setViewQuotationModalOpen(true);
                              }}
                              className="text-slate-500 hover:text-purple-600 p-1"
                              title="View"
                            >
                              <Eye className="w-3.5 h-3.5 inline" />
                            </button>
                            <button onClick={() => openEditQuotationModal(q)} className="text-slate-500 hover:text-amber-600 p-1" title="Edit">
                              <Edit className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${q.quotationNo}?`)) setQuotations(quotations.filter((x) => x.id !== q.id));
                              }}
                              className="text-slate-500 hover:text-rose-600 p-1"
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

          {/* TAB 6: SALES ORDER (Exact steel_erp sales_order.php: Sl no, Reference, Date, Customer, Amount, Actions) */}
          {activeTab === 'SalesOrder' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search sales orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <button
                  onClick={openAddSalesOrderModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3" style={{ width: '40px' }}>Sl no</th>
                      <th className="px-4 py-3" style={{ width: '130px' }}>Reference</th>
                      <th className="px-4 py-3" style={{ width: '110px' }}>Date</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3 text-right" style={{ width: '120px' }}>Amount</th>
                      <th className="px-4 py-3 text-right" style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {salesOrders
                      .filter(
                        (s) =>
                          s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.soNo && s.soNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (s.orderNo && s.orderNo.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .map((so, index) => {
                        const code = so.soNo || so.orderNo || '';
                        return (
                          <tr key={so.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-slate-500">{index + 1}</td>
                            <td className="px-4 py-3 font-mono font-bold text-slate-800">{code}</td>
                            <td className="px-4 py-3 text-slate-600">{so.date}</td>
                            <td className="px-4 py-3 font-semibold text-slate-800">{so.customerName}</td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">${so.totalAmount.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedSalesOrder(so);
                                  setViewSalesOrderModalOpen(true);
                                }}
                                className="text-slate-500 hover:text-purple-600 p-1"
                                title="View"
                              >
                                <Eye className="w-3.5 h-3.5 inline" />
                              </button>
                              <button onClick={() => openEditSalesOrderModal(so)} className="text-slate-500 hover:text-amber-600 p-1" title="Edit">
                              <Edit className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${code}?`)) setSalesOrders(salesOrders.filter((x) => x.id !== so.id));
                              }}
                              className="text-slate-500 hover:text-rose-600 p-1"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: PRO-FORMA INVOICE (Exact steel_erp pro_forma_invoice.php: Sl no, Reference, Date, Customer, Sales Order No, Amount, Actions) */}
          {activeTab === 'ProFormaInvoice' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search pro-forma..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <button
                  onClick={openAddProFormaModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3" style={{ width: '40px' }}>Sl no</th>
                      <th className="px-4 py-3" style={{ width: '130px' }}>Reference</th>
                      <th className="px-4 py-3" style={{ width: '110px' }}>Date</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3" style={{ width: '140px' }}>Sales Order No</th>
                      <th className="px-4 py-3 text-right" style={{ width: '120px' }}>Amount</th>
                      <th className="px-4 py-3 text-right" style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {proFormaInvoices
                      .filter(
                        (pf) =>
                          pf.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pf.pfNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (pf.salesOrderNo && pf.salesOrderNo.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .map((pf, index) => (
                        <tr key={pf.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">{pf.pfNo}</td>
                          <td className="px-4 py-3 text-slate-600">{pf.date}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{pf.customerName}</td>
                          <td className="px-4 py-3 font-mono text-slate-600">{pf.salesOrderNo}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                            ${(pf.currentClaimValue || pf.totalOrderValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => {
                                setSelectedProForma(pf);
                                setViewProFormaModalOpen(true);
                              }}
                              className="text-slate-500 hover:text-purple-600 p-1"
                              title="View"
                            >
                              <Eye className="w-3.5 h-3.5 inline" />
                            </button>
                            <button onClick={() => openEditProFormaModal(pf)} className="text-slate-500 hover:text-amber-600 p-1" title="Edit">
                              <Edit className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${pf.pfNo}?`)) setProFormaInvoices(proFormaInvoices.filter((x) => x.id !== pf.id));
                              }}
                              className="text-slate-500 hover:text-rose-600 p-1"
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

          {/* TAB 8: DELIVERY NOTE (Exact steel_erp delivery_note.php: Sl no, Reference, Date, Customer, Amount, Actions) */}
          {activeTab === 'DeliverNote' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search delivery notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <button
                  onClick={openAddDeliveryNoteModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3" style={{ width: '40px' }}>Sl no</th>
                      <th className="px-4 py-3" style={{ width: '130px' }}>Reference</th>
                      <th className="px-4 py-3" style={{ width: '110px' }}>Date</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3 text-right" style={{ width: '120px' }}>Amount</th>
                      <th className="px-4 py-3 text-right" style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {deliveryNotes
                      .filter((d) => d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || d.dnNo.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((dn, index) => (
                        <tr key={dn.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">{dn.dnNo}</td>
                          <td className="px-4 py-3 text-slate-600">{dn.date}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{dn.customerName}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">${(dn.amount || 18500).toLocaleString()}</td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => {
                                setSelectedDeliveryNote(dn);
                                setViewDeliveryNoteModalOpen(true);
                              }}
                              className="text-slate-500 hover:text-purple-600 p-1"
                              title="View"
                            >
                              <Eye className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => openEditDeliveryNoteModal(dn)}
                              className="text-slate-500 hover:text-amber-600 p-1"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${dn.dnNo}?`)) setDeliveryNotes(deliveryNotes.filter((x) => x.id !== dn.id));
                              }}
                              className="text-slate-500 hover:text-rose-600 p-1"
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

          {/* TAB 9: CASH INVOICE (Exact steel_erp cash_invoice.php: Sl no, Reference, Date, Customer, Sales Order, Amount, Actions) */}
          {activeTab === 'CashInvoice' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search cash invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <button
                  onClick={openAddCashInvoiceModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3" style={{ width: '40px' }}>Sl no</th>
                      <th className="px-4 py-3" style={{ width: '130px' }}>Reference</th>
                      <th className="px-4 py-3" style={{ width: '110px' }}>Date</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3" style={{ width: '140px' }}>Sales Order</th>
                      <th className="px-4 py-3 text-right" style={{ width: '120px' }}>Amount</th>
                      <th className="px-4 py-3 text-right" style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices
                      .filter((i) => (i.invoiceType === 'Cash' || i.invoiceNo.startsWith('CSH')) && (i.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || i.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())))
                      .map((inv, index) => (
                        <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">{inv.invoiceNo}</td>
                          <td className="px-4 py-3 text-slate-600">{inv.date}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{inv.customerName}</td>
                          <td className="px-4 py-3 font-mono text-slate-600">{inv.salesOrderRef || inv.soRef || '-'}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">${inv.totalAmount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => {
                                setSelectedCashInvoice(inv);
                                setViewCashInvoiceModalOpen(true);
                              }}
                              className="text-slate-500 hover:text-purple-600 p-1"
                              title="View"
                            >
                              <Eye className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => openEditCashInvoiceModal(inv)}
                              className="text-slate-500 hover:text-amber-600 p-1"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${inv.invoiceNo}?`)) setInvoices(invoices.filter((x) => x.id !== inv.id));
                              }}
                              className="text-slate-500 hover:text-rose-600 p-1"
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

          {/* TAB 10: CREDIT INVOICE (Exact steel_erp credit_invoice.php: Sl no, Reference, Date, Customer, Sales Order, Amount, Actions) */}
          {activeTab === 'CreditInvoice' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search credit invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <button
                  onClick={openAddCreditInvoiceModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3" style={{ width: '40px' }}>Sl no</th>
                      <th className="px-4 py-3" style={{ width: '130px' }}>Reference</th>
                      <th className="px-4 py-3" style={{ width: '110px' }}>Date</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3" style={{ width: '140px' }}>Sales Order</th>
                      <th className="px-4 py-3 text-right" style={{ width: '120px' }}>Amount</th>
                      <th className="px-4 py-3 text-right" style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices
                      .filter((i) => (i.invoiceType === 'Credit' || (!i.invoiceType && !i.invoiceNo.startsWith('CSH'))) && (i.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || i.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())))
                      .map((inv, index) => (
                        <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">{inv.invoiceNo}</td>
                          <td className="px-4 py-3 text-slate-600">{inv.date}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{inv.customerName}</td>
                          <td className="px-4 py-3 font-mono text-slate-600">{inv.salesOrderRef || inv.soRef || '-'}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">${inv.totalAmount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => {
                                setSelectedCreditInvoice(inv);
                                setViewCreditInvoiceModalOpen(true);
                              }}
                              className="text-slate-500 hover:text-purple-600 p-1"
                              title="View"
                            >
                              <Eye className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => openEditCreditInvoiceModal(inv)}
                              className="text-slate-500 hover:text-amber-600 p-1"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${inv.invoiceNo}?`)) setInvoices(invoices.filter((x) => x.id !== inv.id));
                              }}
                              className="text-slate-500 hover:text-rose-600 p-1"
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

          {/* TAB 11: SALES RETURN (Exact steel_erp sales_return.php: Sl no, Reference, Date, Customer, Invoice No, Amount, Actions) */}
          {activeTab === 'SalesReturn' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search sales returns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <button
                  onClick={openAddSalesReturnModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3" style={{ width: '40px' }}>Sl no</th>
                      <th className="px-4 py-3" style={{ width: '130px' }}>Reference</th>
                      <th className="px-4 py-3" style={{ width: '110px' }}>Date</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3" style={{ width: '140px' }}>Invoice No</th>
                      <th className="px-4 py-3 text-right" style={{ width: '120px' }}>Amount</th>
                      <th className="px-4 py-3 text-right" style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {salesReturns
                      .filter((r) => r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || r.returnNo.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((sr, index) => (
                        <tr key={sr.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">{sr.returnNo}</td>
                          <td className="px-4 py-3 text-slate-600">{sr.date}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{sr.customerName}</td>
                          <td className="px-4 py-3 font-mono text-slate-600">{sr.invoiceNo}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-rose-600">${sr.amount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => {
                                setSelectedSalesReturn(sr);
                                setViewSalesReturnModalOpen(true);
                              }}
                              className="text-slate-500 hover:text-purple-600 p-1"
                              title="View"
                            >
                              <Eye className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => openEditSalesReturnModal(sr)}
                              className="text-slate-500 hover:text-amber-600 p-1"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${sr.returnNo}?`)) setSalesReturns(salesReturns.filter((x) => x.id !== sr.id));
                              }}
                              className="text-slate-500 hover:text-rose-600 p-1"
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
        </>
      )}

      {/* MODAL 1: ADD PRODUCT HEAD (steel_erp add_product_head.php) */}
      {/* MODAL 1: ADD / EDIT PRODUCT HEAD (steel_erp add_product_head.php) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddProductHead'}
        onClose={() => setModalOpen(false)}
        title={editingProductHeadId ? 'Edit Product Head' : 'Add Product Head'}
      >
        <form onSubmit={handleAddProductHead} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Code</label>
            <input
              type="text"
              placeholder="e.g. PH-006"
              value={phCode}
              onChange={(e) => setPhCode(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Product Head *</label>
            <input
              type="text"
              required
              placeholder="e.g. Hollow Structural Sections (HSS)"
              value={phName}
              onChange={(e) => setPhName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
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
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
            >
              {editingProductHeadId ? 'Update Product Head' : 'Save Product Head'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: ADD PRODUCT (steel_erp add_product.php) */}
      {/* MODAL 2: ADD / EDIT PRODUCT (steel_erp add_product.php) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddProduct'}
        onClose={() => setModalOpen(false)}
        title={editingProductId ? 'Edit Product' : 'Add Product'}
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Code</label>
              <input
                type="text"
                placeholder="PROD-009"
                value={pCode}
                onChange={(e) => setPCode(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Product Head</label>
              <select
                value={pHead}
                onChange={(e) => setPHead(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              >
                {productHeads.map((ph) => (
                  <option key={ph.id} value={ph.name}>{ph.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. S355JR Universal Beam 305x165x40"
              value={pName}
              onChange={(e) => setPName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
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
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
            >
              {editingProductId ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: ADD CUSTOMER (steel_erp add_customer.php without Sales Executive / Contact Person) */}
      {/* MODAL 3: ADD / EDIT CUSTOMER (steel_erp add_customer.php without Sales Executive / Contact Person) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddCustomer'}
        onClose={() => setModalOpen(false)}
        title={editingCustomerId ? 'Edit Customer' : 'Create Customer'}
        maxWidth="2xl"
      >
        <form onSubmit={handleAddCustomer} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                placeholder="Enter customer legal name"
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account Head</label>
              <select
                value={cAccountHead}
                onChange={(e) => setCAccountHead(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              >
                <option value="Accounts Receivable">Accounts Receivable</option>
                <option value="Commercial Trade Debtors">Commercial Trade Debtors</option>
                <option value="Direct Export Clients">Direct Export Clients</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account ID</label>
              <input
                type="text"
                readOnly
                value={cAccountId}
                className="w-full px-3 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Post Box No</label>
              <input
                type="text"
                placeholder="e.g. P.O. Box 1024"
                value={cPostBox}
                onChange={(e) => setCPostBox(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telephone *</label>
              <input
                type="text"
                required
                placeholder="e.g. +224 620 00 00 00"
                value={cPhone}
                onChange={(e) => setCPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fax</label>
              <input
                type="text"
                placeholder="e.g. +224 620 00 00 01"
                value={cFax}
                onChange={(e) => setCFax(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                required
                placeholder="e.g. contact@client.com"
                value={cEmail}
                onChange={(e) => setCEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                placeholder="e.g. Conakry"
                value={cCity}
                onChange={(e) => setCCity(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
              <input
                type="text"
                placeholder="e.g. Guinea"
                value={cCountry}
                onChange={(e) => setCCountry(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
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
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
            >
              {editingCustomerId ? 'Update Customer' : 'Save Customer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 5: ADD SALES QUOTATION (steel_erp sales-quotation.php AddModal without Sales Executive / Contact Person) */}
      {/* MODAL 5: ADD / EDIT SALES QUOTATION (steel_erp sales-quotation.php AddModal without Sales Executive / Contact Person) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddQuotation'}
        onClose={() => setModalOpen(false)}
        title={editingQuotationId ? 'Edit Sales Quotation' : 'Sales Quotation'}
        maxWidth="5xl"
      >
        <form onSubmit={handleAddQuotation} className="space-y-4">
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Section 1 - Left Column */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Reference</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      readOnly
                      value={qRefNo}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded font-mono text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Date *</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      required
                      value={qDate}
                      onChange={(e) => setQDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Customer Name *</label>
                  <div className="col-span-8">
                    <select
                      required
                      value={qCustomer}
                      onChange={(e) => setQCustomer(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="">Select Customer</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Enquiry Ref</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      placeholder="e.g. ENQ-2026-089"
                      value={qEnquiryNo}
                      onChange={(e) => setQEnquiryNo(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Validity</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      value={qValidity}
                      onChange={(e) => setQValidity(e.target.value)}
                      placeholder="e.g. 30 Days"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2 - Right Column */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Payment Term</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      value={qPaymentTerm}
                      onChange={(e) => setQPaymentTerm(e.target.value)}
                      placeholder="e.g. 30 Days Net / 100% Advance"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Delivery Term</label>
                  <div className="col-span-8">
                    <select
                      value={qDeliveryTerm}
                      onChange={(e) => setQDeliveryTerm(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                    >
                      {deliveryTermOptions.map((term) => (
                        <option key={term} value={term}>{term}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Project</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      value={qProject}
                      onChange={(e) => setQProject(e.target.value)}
                      placeholder="e.g. Mining Infrastructure Phase 2"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Items Table Section (steel_erp sales-quotation.php content_table) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Quotation Products & Bill of Quantities
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                Select products, configure quantity, rate, and discount percentage
              </span>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-3 py-2 w-10 text-center">SI</th>
                    <th className="px-3 py-2 w-[35%]">Product Description</th>
                    <th className="px-3 py-2 w-[12%]">Unit</th>
                    <th className="px-3 py-2 w-[10%] text-right">Qty</th>
                    <th className="px-3 py-2 w-[13%] text-right">Rate ($)</th>
                    <th className="px-3 py-2 w-[11%] text-right">Discount (%)</th>
                    <th className="px-3 py-2 w-[14%] text-right">Amount ($)</th>
                    <th className="px-2 py-2 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {qProductRows.map((row, index) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="px-2 py-1.5 text-center font-mono text-slate-500">{index + 1}</td>
                      <td className="px-2 py-1.5">
                        <select
                          value={row.productId}
                          onChange={(e) => handleQProductChange(index, e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                          required
                        >
                          <option value="">Select Product Description</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="text"
                          value={row.unit}
                          onChange={(e) => handleQRowFieldChange(index, 'unit', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          min="1"
                          value={row.quantity}
                          onChange={(e) => handleQRowFieldChange(index, 'quantity', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white text-right font-mono"
                          required
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={row.rate}
                          onChange={(e) => handleQRowFieldChange(index, 'rate', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white text-right font-mono"
                          required
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="any"
                          value={row.discount}
                          onChange={(e) => handleQRowFieldChange(index, 'discount', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white text-right font-mono"
                        />
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono font-bold text-slate-800">
                        ${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveQuotationProductRow(index)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add More Product Rows & Quick Add Option */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={handleAddQuotationProductRow}
                className="px-3.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors self-start"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalType('AddProduct');
                  setModalOpen(true);
                }}
                className="text-xs font-medium text-slate-500 hover:text-amber-700 underline flex items-center gap-1 self-start sm:self-auto"
              >
                + Quick Add New Product to Catalog
              </button>
            </div>

            {/* Amount Summary Table (steel_erp amount_table) */}
            <div className="flex justify-end pt-3">
              <div className="w-80 bg-slate-50/80 border border-slate-200 rounded-lg overflow-hidden text-xs">
                <div className="flex justify-between px-3.5 py-2 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Sub Total:</span>
                  <span className="font-mono font-bold text-slate-800">
                    $
                    {qProductRows
                      .reduce((sum, r) => sum + r.amount, 0)
                      .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between px-3.5 py-2 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">VAT (18%):</span>
                  <span className="font-mono text-slate-700">
                    $
                    {(qProductRows.reduce((sum, r) => sum + r.amount, 0) * 0.18).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
                <div className="flex justify-between px-3.5 py-2.5 bg-amber-50/80 border-t border-amber-200">
                  <span className="text-amber-950 font-bold uppercase text-[11px]">Total Quotation Amount:</span>
                  <span className="font-mono font-extrabold text-amber-700 text-sm">
                    $
                    {(qProductRows.reduce((sum, r) => sum + r.amount, 0) * 1.18).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Save Sales Quotation
              <Check className="w-4 h-4" /> {editingQuotationId ? 'Update Sales Quotation' : 'Save Sales Quotation'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 5.1: VIEW SALES QUOTATION MODAL (Replicated from steel_erp sales-quotation.php view modal) */}
      {viewQuotationModalOpen && selectedQuotation && (
        <Modal
          isOpen={viewQuotationModalOpen}
          onClose={() => setViewQuotationModalOpen(false)}
          title={`Sales Quotation - ${selectedQuotation.quotationNo}`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-slate-50/70">
                    <td className="px-3 py-2 text-slate-500 font-medium w-1/4">Reference</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left w-1/4">
                      {selectedQuotation.quotationNo}
                    </th>
                    <td className="px-3 py-2 text-slate-500 font-medium w-1/4">Date</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left w-1/4">
                      {selectedQuotation.date}
                    </th>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-slate-500 font-medium">Customer</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedQuotation.customerName}
                    </th>
                    <td className="px-3 py-2 text-slate-500 font-medium">Enquiry Ref</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedQuotation.enquiryRef || '-'}
                    </th>
                  </tr>
                  <tr className="bg-slate-50/70">
                    <td className="px-3 py-2 text-slate-500 font-medium">Validity</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedQuotation.validity || selectedQuotation.validUntil || '30 Days'}
                    </th>
                    <td className="px-3 py-2 text-slate-500 font-medium">Payment Term</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedQuotation.paymentTerm || '30 Days Net'}
                    </th>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-slate-500 font-medium">Delivery Term</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedQuotation.deliveryTerm || 'Ex-Factory'}
                    </th>
                    <td className="px-3 py-2 text-slate-500 font-medium">Project</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedQuotation.project || '-'}
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="text-center font-bold text-xs uppercase tracking-wider text-slate-700 bg-slate-100 py-2 rounded-t border border-b-0 border-slate-200">
                Quotation Product Specifications
              </h4>
              <div className="border border-slate-200 rounded-b overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">Product Description</th>
                      <th className="px-3 py-2">Unit</th>
                      <th className="px-3 py-2 text-right">Qty</th>
                      <th className="px-3 py-2 text-right">Rate ($)</th>
                      <th className="px-3 py-2 text-right">Discount</th>
                      <th className="px-3 py-2 text-right">Amount ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {selectedQuotation.items && selectedQuotation.items.length > 0 ? (
                      selectedQuotation.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-medium text-slate-800">{item.productDescription}</td>
                          <td className="px-3 py-2 text-slate-600">{item.unit}</td>
                          <td className="px-3 py-2 text-right font-mono">{item.quantity}</td>
                          <td className="px-3 py-2 text-right font-mono">${item.rate.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right font-mono">{item.discount}%</td>
                          <td className="px-3 py-2 text-right font-bold text-slate-900 font-mono">
                            ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-3 py-2 font-medium text-slate-800">Commercial Steel Products Order</td>
                        <td className="px-3 py-2 text-slate-600">Lot</td>
                        <td className="px-3 py-2 text-right font-mono">1</td>
                        <td className="px-3 py-2 text-right font-mono">${selectedQuotation.totalAmount.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right font-mono">0%</td>
                        <td className="px-3 py-2 text-right font-bold text-slate-900 font-mono">
                          ${selectedQuotation.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan={5} className="px-3 py-2 text-right uppercase text-[11px] text-slate-600">
                        Total Quotation Amount:
                      </td>
                      <td className="px-3 py-2 text-right text-amber-700 font-mono font-extrabold text-sm">
                        ${selectedQuotation.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => alert(`Printing Sales Quotation ${selectedQuotation.quotationNo}...`)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button
                type="button"
                onClick={() => setViewQuotationModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 6: ADD SALES ORDER (steel_erp sales-order.php AddModal without Sales Executive / Contact Person) */}
      {/* MODAL 6: ADD / EDIT SALES ORDER (steel_erp sales-order.php AddModal without Sales Executive / Contact Person) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddSalesOrder'}
        onClose={() => setModalOpen(false)}
        title={editingSalesOrderId ? 'Edit Sales Order' : 'Sales Order'}
        maxWidth="5xl"
      >
        <form onSubmit={handleAddSalesOrder} className="space-y-4">
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Section 1 - Left Column */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Reference</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      readOnly
                      value={soRefNo}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded font-mono text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Date *</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      required
                      value={soDate}
                      onChange={(e) => setSoDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Customer Name *</label>
                  <div className="col-span-8">
                    <select
                      required
                      value={soCustomer}
                      onChange={(e) => setSoCustomer(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="">Select Customer</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Quot Ref</label>
                  <div className="col-span-8">
                    <select
                      value={soQuotRef}
                      onChange={(e) => setSoQuotRef(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    >
                      <option value="">Select Quotation Ref</option>
                      {quotations.map((q) => (
                        <option key={q.id} value={q.quotationNo}>
                          {q.quotationNo} ({q.customerName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">LPO Ref *</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      required
                      placeholder="e.g. LPO/SIM/9021"
                      value={soLpoRef}
                      onChange={(e) => setSoLpoRef(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2 - Right Column */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Payment Term *</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      required
                      value={soPaymentTerm}
                      onChange={(e) => setSoPaymentTerm(e.target.value)}
                      placeholder="e.g. 30 Days Net"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Delivery Date *</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      required
                      value={soDeliveryDate}
                      onChange={(e) => setSoDeliveryDate(e.target.value)}
                      placeholder="e.g. 30-Nov-2026"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Project</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      value={soProject}
                      onChange={(e) => setSoProject(e.target.value)}
                      placeholder="e.g. Mining Rail Package A"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Items Table Section (steel_erp sales-order.php content_table) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Sales Order Products & Quantities
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                Configure order items, specifications, quantity, and agreed rate
              </span>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-3 py-2 w-10 text-center">SI</th>
                    <th className="px-3 py-2 w-[35%]">Product Description</th>
                    <th className="px-3 py-2 w-[12%]">Unit</th>
                    <th className="px-3 py-2 w-[10%] text-right">Qty</th>
                    <th className="px-3 py-2 w-[13%] text-right">Rate ($)</th>
                    <th className="px-3 py-2 w-[11%] text-right">Discount (%)</th>
                    <th className="px-3 py-2 w-[14%] text-right">Amount ($)</th>
                    <th className="px-2 py-2 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {soProductRows.map((row, index) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="px-2 py-1.5 text-center font-mono text-slate-500">{index + 1}</td>
                      <td className="px-2 py-1.5">
                        <select
                          value={row.productId}
                          onChange={(e) => handleSoProductChange(index, e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                          required
                        >
                          <option value="">Select Product Description</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="text"
                          value={row.unit}
                          onChange={(e) => handleSoRowFieldChange(index, 'unit', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          min="1"
                          value={row.quantity}
                          onChange={(e) => handleSoRowFieldChange(index, 'quantity', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white text-right font-mono"
                          required
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={row.rate}
                          onChange={(e) => handleSoRowFieldChange(index, 'rate', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white text-right font-mono"
                          required
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="any"
                          value={row.discount}
                          onChange={(e) => handleSoRowFieldChange(index, 'discount', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white text-right font-mono"
                        />
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono font-bold text-slate-800">
                        ${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSalesOrderProductRow(index)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add More Product Rows */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleAddSalesOrderProductRow}
                className="px-3.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            {/* Amount Summary Table (steel_erp amount_table) */}
            <div className="flex justify-end pt-3">
              <div className="w-80 bg-slate-50/80 border border-slate-200 rounded-lg overflow-hidden text-xs">
                <div className="flex justify-between px-3.5 py-2 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Sub Total:</span>
                  <span className="font-mono font-bold text-slate-800">
                    $
                    {soProductRows
                      .reduce((sum, r) => sum + r.amount, 0)
                      .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between px-3.5 py-2 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">VAT (18%):</span>
                  <span className="font-mono text-slate-700">
                    $
                    {(soProductRows.reduce((sum, r) => sum + r.amount, 0) * 0.18).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
                <div className="flex justify-between px-3.5 py-2.5 bg-amber-50/80 border-t border-amber-200">
                  <span className="text-amber-950 font-bold uppercase text-[11px]">Total Order Amount:</span>
                  <span className="font-mono font-extrabold text-amber-700 text-sm">
                    $
                    {(soProductRows.reduce((sum, r) => sum + r.amount, 0) * 1.18).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Save Sales Order
              <Check className="w-4 h-4" /> {editingSalesOrderId ? 'Update Sales Order' : 'Save Sales Order'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 6.1: VIEW SALES ORDER MODAL (Replicated from steel_erp sales-order.php view modal) */}
      {
        viewSalesOrderModalOpen && selectedSalesOrder && (
          <Modal
            isOpen={viewSalesOrderModalOpen}
            onClose={() => setViewSalesOrderModalOpen(false)}
            title={`Sales Order - ${selectedSalesOrder.soNo || selectedSalesOrder.orderNo}`}
            maxWidth="4xl"
          >
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-slate-50/70">
                      <td className="px-3 py-2 text-slate-500 font-medium w-1/4">Reference</td>
                      <th className="px-3 py-2 font-bold text-slate-800 text-left w-1/4">
                        {selectedSalesOrder.soNo || selectedSalesOrder.orderNo}
                      </th>
                      <td className="px-3 py-2 text-slate-500 font-medium w-1/4">Date</td>
                      <th className="px-3 py-2 font-bold text-slate-800 text-left w-1/4">
                        {selectedSalesOrder.date}
                      </th>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-slate-500 font-medium">Customer</td>
                      <th className="px-3 py-2 font-bold text-slate-800 text-left">
                        {selectedSalesOrder.customerName}
                      </th>
                      <td className="px-3 py-2 text-slate-500 font-medium">LPO Ref</td>
                      <th className="px-3 py-2 font-bold text-slate-800 text-left font-mono">
                        {selectedSalesOrder.lpoRef || '-'}
                      </th>
                    </tr>
                    <tr className="bg-slate-50/70">
                      <td className="px-3 py-2 text-slate-500 font-medium">Quot Ref</td>
                      <th className="px-3 py-2 font-bold text-slate-800 text-left font-mono">
                        {selectedSalesOrder.quotationRef || '-'}
                      </th>
                      <td className="px-3 py-2 text-slate-500 font-medium">Payment Term</td>
                      <th className="px-3 py-2 font-bold text-slate-800 text-left">
                        {selectedSalesOrder.paymentTerm || '30 Days Net'}
                      </th>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 text-slate-500 font-medium">Delivery Date</td>
                      <th className="px-3 py-2 font-bold text-slate-800 text-left">
                        {selectedSalesOrder.deliveryDate || selectedSalesOrder.expectedDelivery || '-'}
                      </th>
                      <td className="px-3 py-2 text-slate-500 font-medium">Project</td>
                      <th className="px-3 py-2 font-bold text-slate-800 text-left">
                        {selectedSalesOrder.project || '-'}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="text-center font-bold text-xs uppercase tracking-wider text-slate-700 bg-slate-100 py-2 rounded-t border border-b-0 border-slate-200">
                  Sales Order Product Items
                </h4>
                <div className="border border-slate-200 rounded-b overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-bold text-[10px] uppercase border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2">Product Description</th>
                        <th className="px-3 py-2">Unit</th>
                        <th className="px-3 py-2 text-right">Qty</th>
                        <th className="px-3 py-2 text-right">Rate ($)</th>
                        <th className="px-3 py-2 text-right">Discount</th>
                        <th className="px-3 py-2 text-right">Amount ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {selectedSalesOrder.items && selectedSalesOrder.items.length > 0 ? (
                        selectedSalesOrder.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-medium text-slate-800">{item.productDescription}</td>
                            <td className="px-3 py-2 text-slate-600">{item.unit}</td>
                            <td className="px-3 py-2 text-right font-mono">{item.quantity}</td>
                            <td className="px-3 py-2 text-right font-mono">${item.rate.toLocaleString()}</td>
                            <td className="px-3 py-2 text-right font-mono">{item.discount}%</td>
                            <td className="px-3 py-2 text-right font-bold text-slate-900 font-mono">
                              ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-3 py-2 font-medium text-slate-800">Confirmed Order Contract</td>
                          <td className="px-3 py-2 text-slate-600">Lot</td>
                          <td className="px-3 py-2 text-right font-mono">1</td>
                          <td className="px-3 py-2 text-right font-mono">${selectedSalesOrder.totalAmount.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right font-mono">0%</td>
                          <td className="px-3 py-2 text-right font-bold text-slate-900 font-mono">
                            ${selectedSalesOrder.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                      <tr>
                        <td colSpan={5} className="px-3 py-2 text-right uppercase text-[11px] text-slate-600">
                          Total Order Amount:
                        </td>
                        <td className="px-3 py-2 text-right text-amber-700 font-mono font-extrabold text-sm">
                          ${selectedSalesOrder.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => alert(`Printing Sales Order ${selectedSalesOrder.soNo || selectedSalesOrder.orderNo}...`)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  type="button"
                  onClick={() => setViewSalesOrderModalOpen(false)}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )
      }

      {/* MODAL 7: ADD PRO-FORMA INVOICE (Replicated from steel_erp pro-forma-invoice.php) */}
      {/* MODAL 7: ADD / EDIT PRO-FORMA INVOICE (Replicated from steel_erp pro-forma-invoice.php) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddProForma'}
        onClose={() => setModalOpen(false)}
        title={editingProFormaId ? 'Edit Pro-forma Invoice' : 'Pro-forma Invoice'}
        maxWidth="5xl"
      >
        <form onSubmit={handleAddProForma} className="space-y-4">
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Section 1 - Left Column */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Reference</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      readOnly
                      value={pfRefNo}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded font-mono text-slate-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Date *</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      required
                      value={pfDate}
                      onChange={(e) => setPfDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Sales Order *</label>
                  <div className="col-span-8">
                    <select
                      value={pfSalesOrder}
                      onChange={(e) => handlePfSalesOrderChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    >
                      <option value="">Select Sales Order</option>
                      {salesOrders.map((so) => {
                        const code = so.soNo || so.orderNo || '';
                        return (
                          <option key={so.id} value={code}>
                            {code} ({so.customerName})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Customer Name *</label>
                  <div className="col-span-8">
                    <select
                      required
                      value={pfCustomer}
                      onChange={(e) => setPfCustomer(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="">Select Customer</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2 - Right Column */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">LPO Reference</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      placeholder="e.g. LPO/SIM/9021"
                      value={pfLpoRef}
                      onChange={(e) => setPfLpoRef(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Payment Terms *</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      required
                      value={pfPaymentTerms}
                      onChange={(e) => setPfPaymentTerms(e.target.value)}
                      placeholder="e.g. 30 Days Net"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Delivery Terms</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      value={pfDeliveryTerms}
                      onChange={(e) => setPfDeliveryTerms(e.target.value)}
                      placeholder="e.g. FOB Conakry Port"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 items-center gap-2">
                  <label className="col-span-4 text-xs font-semibold text-slate-700">Project</label>
                  <div className="col-span-8">
                    <input
                      type="text"
                      placeholder="e.g. Kindia Mining Rail Infrastructure"
                      value={pfProject}
                      onChange={(e) => setPfProject(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 - Multi-Row Product Allocation Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Product Details
              </span>
              <button
                type="button"
                onClick={handleAddProFormaProductRow}
                className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-3 py-2 w-10 text-center">SI</th>
                    <th className="px-3 py-2 w-[35%]">Product Description</th>
                    <th className="px-3 py-2 w-[12%]">Unit</th>
                    <th className="px-3 py-2 w-[10%] text-right">Qty</th>
                    <th className="px-3 py-2 w-[13%] text-right">Rate ($)</th>
                    <th className="px-3 py-2 w-[11%] text-right">Discount (%)</th>
                    <th className="px-3 py-2 w-[14%] text-right">Amount ($)</th>
                    <th className="px-2 py-2 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {pfProductRows.map((row, index) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="px-2 py-1.5 text-center font-mono text-slate-500">{index + 1}</td>
                      <td className="px-2 py-1.5">
                        <select
                          value={row.productId}
                          onChange={(e) => handlePfProductChange(index, e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                          required
                        >
                          <option value="">Select Product Description</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="text"
                          value={row.unit}
                          onChange={(e) => handlePfRowFieldChange(index, 'unit', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          step="any"
                          min="1"
                          value={row.quantity || ''}
                          onChange={(e) => handlePfRowFieldChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-xs text-right border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                          required
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={row.rate || ''}
                          onChange={(e) => handlePfRowFieldChange(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-xs text-right border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                          required
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          max="100"
                          value={row.discount || ''}
                          onChange={(e) => handlePfRowFieldChange(index, 'discount', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-xs text-right border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                        />
                      </td>
                      <td className="px-3 py-1.5 text-right font-bold text-slate-800 font-mono">
                        ${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveProFormaProductRow(index)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4 - Totals & Claim Calculation Card (Matching steel_erp total_table) */}
          <div className="flex justify-end pt-1">
            <div className="w-80 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Total Order Value:</span>
                <span className="font-bold text-slate-800 font-mono">
                  ${pfProductRows
                    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0)
                    .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="font-semibold text-slate-700">Current Claim %:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={pfClaimPercent || ''}
                    onChange={(e) => setPfClaimPercent(parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-right text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono font-bold"
                  />
                  <span className="text-slate-500 font-bold">%</span>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                <span className="font-bold text-slate-800">Current Claim Value:</span>
                <span className="font-mono font-extrabold text-amber-700 text-sm">
                  ${(
                    pfProductRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0) *
                    ((Number(pfClaimPercent) || 0) / 100)
                  ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
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
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
            >
              Issue Pro-Forma Invoice
              {editingProFormaId ? 'Update Pro-forma Invoice' : 'Issue Pro-Forma Invoice'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 7.1: VIEW PRO-FORMA INVOICE MODAL (Replicated from steel_erp pro-forma-invoice.php view) */}
      {viewProFormaModalOpen && selectedProForma && (
        <Modal
          isOpen={viewProFormaModalOpen}
          onClose={() => setViewProFormaModalOpen(false)}
          title={`Pro-forma Invoice - ${selectedProForma.referenceNo || selectedProForma.pfNo}`}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-slate-50/70">
                    <td className="px-3 py-2 text-slate-500 font-medium w-1/4">Reference</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left w-1/4 font-mono">
                      {selectedProForma.referenceNo || selectedProForma.pfNo}
                    </th>
                    <td className="px-3 py-2 text-slate-500 font-medium w-1/4">Date</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left w-1/4">
                      {selectedProForma.date}
                    </th>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-slate-500 font-medium">Customer</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedProForma.customerName}
                    </th>
                    <td className="px-3 py-2 text-slate-500 font-medium">Sales Order No</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left font-mono">
                      {selectedProForma.salesOrderNo || '-'}
                    </th>
                  </tr>
                  <tr className="bg-slate-50/70">
                    <td className="px-3 py-2 text-slate-500 font-medium">LPO Ref</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left font-mono">
                      {selectedProForma.lpoRef || '-'}
                    </th>
                    <td className="px-3 py-2 text-slate-500 font-medium">Payment Terms</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedProForma.paymentTerms || '30 Days Net'}
                    </th>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-slate-500 font-medium">Delivery Terms</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedProForma.deliveryTerms || '-'}
                    </th>
                    <td className="px-3 py-2 text-slate-500 font-medium">Project</td>
                    <th className="px-3 py-2 font-bold text-slate-800 text-left">
                      {selectedProForma.project || '-'}
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="text-center font-bold text-xs uppercase tracking-wider text-slate-700 bg-slate-100 py-2 rounded-t border border-b-0 border-slate-200">
                Pro-forma Product Items
              </h4>
              <div className="border border-slate-200 rounded-b overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">Product Description</th>
                      <th className="px-3 py-2">Unit</th>
                      <th className="px-3 py-2 text-right">Qty</th>
                      <th className="px-3 py-2 text-right">Rate ($)</th>
                      <th className="px-3 py-2 text-right">Discount</th>
                      <th className="px-3 py-2 text-right">Amount ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {selectedProForma.items && selectedProForma.items.length > 0 ? (
                      selectedProForma.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-medium text-slate-800">{item.productDescription}</td>
                          <td className="px-3 py-2 text-slate-600">{item.unit}</td>
                          <td className="px-3 py-2 text-right font-mono">{item.quantity}</td>
                          <td className="px-3 py-2 text-right font-mono">${item.rate.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right font-mono">{item.discount}%</td>
                          <td className="px-3 py-2 text-right font-bold text-slate-900 font-mono">
                            ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-3 py-2 font-medium text-slate-800">Pro-forma Contract Order</td>
                        <td className="px-3 py-2 text-slate-600">Lot</td>
                        <td className="px-3 py-2 text-right font-mono">1</td>
                        <td className="px-3 py-2 text-right font-mono">${selectedProForma.totalOrderValue.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right font-mono">0%</td>
                        <td className="px-3 py-2 text-right font-bold text-slate-900 font-mono">
                          ${selectedProForma.totalOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan={5} className="px-3 py-1.5 text-right uppercase text-[11px] text-slate-600">
                        Total Order Value:
                      </td>
                      <td className="px-3 py-1.5 text-right text-slate-800 font-mono font-bold text-xs">
                        ${selectedProForma.totalOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={5} className="px-3 py-1.5 text-right uppercase text-[11px] text-slate-600">
                        Current Claim %:
                      </td>
                      <td className="px-3 py-1.5 text-right text-amber-700 font-mono font-bold text-xs">
                        {selectedProForma.currentClaimPercent}%
                      </td>
                    </tr>
                    <tr className="border-t border-slate-300 bg-amber-50/50">
                      <td colSpan={5} className="px-3 py-2 text-right uppercase text-[11px] text-amber-900 font-bold">
                        Current Claim Value (Pro-forma Total):
                      </td>
                      <td className="px-3 py-2 text-right text-amber-700 font-mono font-extrabold text-sm">
                        ${selectedProForma.currentClaimValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => alert(`Printing Pro-forma Invoice ${selectedProForma.referenceNo || selectedProForma.pfNo}...`)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button
                type="button"
                onClick={() => setViewProFormaModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal >
      )
      }

      {/* MODAL 8: ADD / EDIT DELIVERY NOTE (Exact steel_erp delivernote.php) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddDeliveryNote'}
        onClose={() => setModalOpen(false)}
        title={editingDeliveryNoteId ? 'Edit Delivery Note' : 'Deliver Note'}
        maxWidth="5xl"
      >
        <form onSubmit={handleSaveDeliveryNote} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            {/* Left Column */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Referance</label>
                <input
                  type="text"
                  readOnly
                  value={dnRefNo}
                  className="w-full px-3 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="text"
                  value={dnDate}
                  onChange={(e) => setDnDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name *</label>
                <select
                  required
                  value={dnCustomer}
                  onChange={(e) => setDnCustomer(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sales Order</label>
                <select
                  value={dnSalesOrder}
                  onChange={(e) => handleDnSalesOrderChange(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Select Sales Order</option>
                  {salesOrders.map((so) => {
                    const code = so.soNo || so.orderNo || '';
                    return (
                      <option key={so.id} value={code}>
                        {code} ({so.customerName})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">LPO Ref</label>
                <input
                  type="text"
                  value={dnLpoRef}
                  placeholder="e.g. PAC-LPO-9921"
                  onChange={(e) => setDnLpoRef(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Terms</label>
                <input
                  type="text"
                  value={dnPaymentTerms}
                  placeholder="e.g. 30 Days Net, Cash on Delivery"
                  onChange={(e) => setDnPaymentTerms(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project</label>
                <input
                  type="text"
                  value={dnProject}
                  placeholder="e.g. Port Expansion Project"
                  onChange={(e) => setDnProject(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Product Items Table (Exact steel_erp: SI, Product Description, Unit, Order Qty, Delivered Qty, Current Delivery) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Product Items / Delivery Allocation
              </label>
              <button
                type="button"
                onClick={handleAddDnProductRow}
                className="px-2.5 py-1 text-[11px] font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product Row
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-2 py-2 text-center" style={{ width: '4%' }}>SI</th>
                    <th className="px-2 py-2">Product Description</th>
                    <th className="px-2 py-2 text-center" style={{ width: '10%' }}>Unit</th>
                    <th className="px-2 py-2 text-right" style={{ width: '13%' }}>Order Qty</th>
                    <th className="px-2 py-2 text-right" style={{ width: '13%' }}>Delivered Qty</th>
                    <th className="px-2 py-2 text-right" style={{ width: '16%' }}>Current Delivery</th>
                    <th className="px-2 py-2 text-center" style={{ width: '8%' }}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dnProductRows.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="px-2 py-1.5 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="px-2 py-1.5">
                        <select
                          value={row.productId || ''}
                          onChange={(e) => handleDnProductChange(idx, e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 mb-1"
                        >
                          <option value="">Select Product</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.code})
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Product description..."
                          value={row.productDescription}
                          onChange={(e) => handleDnRowFieldChange(idx, 'productDescription', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="text"
                          placeholder="MT"
                          value={row.unit}
                          onChange={(e) => handleDnRowFieldChange(idx, 'unit', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded text-center focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          placeholder="0"
                          value={row.orderQty === 0 && !editingDeliveryNoteId ? '' : row.orderQty}
                          onChange={(e) => handleDnRowFieldChange(idx, 'orderQty', Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded text-right font-mono focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          placeholder="0"
                          value={row.deliveredQty === 0 && !editingDeliveryNoteId ? '' : row.deliveredQty}
                          onChange={(e) => handleDnRowFieldChange(idx, 'deliveredQty', Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded text-right font-mono focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          placeholder="0"
                          value={row.currentDelivery === 0 && !editingDeliveryNoteId ? '' : row.currentDelivery}
                          onChange={(e) => handleDnRowFieldChange(idx, 'currentDelivery', Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-right font-mono font-semibold text-amber-700 bg-amber-50/50 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveDnProductRow(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
              Total Current Delivery Qty: <span className="ml-2 font-mono text-amber-700 font-bold">{dnProductRows.reduce((sum, r) => sum + (Number(r.currentDelivery) || 0), 0)}</span>
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
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
            >
              {editingDeliveryNoteId ? 'Update Delivery Note' : 'Save Delivery Note'}
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW DELIVERY NOTE MODAL */}
      <Modal
        isOpen={viewDeliveryNoteModalOpen && selectedDeliveryNote !== null}
        onClose={() => setViewDeliveryNoteModalOpen(false)}
        title={`Delivery Note Details - ${selectedDeliveryNote?.dnNo}`}
        maxWidth="4xl"
      >
        {selectedDeliveryNote && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <p className="text-slate-500 text-[11px]">Reference</p>
                <p className="font-mono font-bold text-slate-800">{selectedDeliveryNote.dnNo}</p>
                <p className="text-slate-500 text-[11px] mt-2">Customer</p>
                <p className="font-semibold text-slate-800">{selectedDeliveryNote.customerName}</p>
                <p className="text-slate-500 text-[11px] mt-2">Sales Order</p>
                <p className="font-mono text-slate-700">{selectedDeliveryNote.salesOrderNo || selectedDeliveryNote.soRef || '-'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[11px]">Date</p>
                <p className="text-slate-800">{selectedDeliveryNote.date}</p>
                <p className="text-slate-500 text-[11px] mt-2">LPO Ref</p>
                <p className="text-slate-800">{selectedDeliveryNote.lpoRef || '-'}</p>
                <p className="text-slate-500 text-[11px] mt-2">Project / Payment Terms</p>
                <p className="text-slate-800">{selectedDeliveryNote.project || '-'} / {selectedDeliveryNote.paymentTerms || '-'}</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-center" style={{ width: '5%' }}>SI</th>
                    <th className="px-3 py-2">Product Description</th>
                    <th className="px-3 py-2 text-center" style={{ width: '12%' }}>Unit</th>
                    <th className="px-3 py-2 text-right" style={{ width: '15%' }}>Order Qty</th>
                    <th className="px-3 py-2 text-right" style={{ width: '15%' }}>Delivered Qty</th>
                    <th className="px-3 py-2 text-right" style={{ width: '18%' }}>Current Delivery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedDeliveryNote.items && selectedDeliveryNote.items.length > 0 ? (
                    selectedDeliveryNote.items.map((it, idx) => (
                      <tr key={it.id || idx}>
                        <td className="px-3 py-2 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="px-3 py-2 font-medium text-slate-800">{it.productDescription}</td>
                        <td className="px-3 py-2 text-center text-slate-600">{it.unit}</td>
                        <td className="px-3 py-2 text-right font-mono">{it.orderQty}</td>
                        <td className="px-3 py-2 text-right font-mono">{it.deliveredQty}</td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-amber-700">{it.currentDelivery}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-3 py-2 text-center font-mono text-slate-500">1</td>
                      <td className="px-3 py-2 font-medium text-slate-800">Delivered Material Package</td>
                      <td className="px-3 py-2 text-center text-slate-600">Lot</td>
                      <td className="px-3 py-2 text-right font-mono">{selectedDeliveryNote.itemsDelivered || 1}</td>
                      <td className="px-3 py-2 text-right font-mono">0</td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-amber-700">{selectedDeliveryNote.itemsDelivered || 1}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-600">Estimated Total Amount:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                ${(selectedDeliveryNote.amount || 18500).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewDeliveryNoteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 9: ADD / EDIT CASH INVOICE (Exact steel_erp cash-invoice.php) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddCashInvoice'}
        onClose={() => setModalOpen(false)}
        title={editingCashInvoiceId ? 'Edit Cash Invoice' : 'Cash Invoice'}
        maxWidth="5xl"
      >
        <form onSubmit={handleSaveCashInvoice} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            {/* Left Column */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Referance</label>
                <input
                  type="text"
                  readOnly
                  value={ciRefNo}
                  className="w-full px-3 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="text"
                  value={ciDate}
                  onChange={(e) => setCiDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name *</label>
                <select
                  required
                  value={ciCustomer}
                  onChange={(e) => setCiCustomer(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Credit Account *</label>
                <select
                  required
                  value={ciCreditAccount}
                  onChange={(e) => setCiCreditAccount(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Cash in Hand - Conakry Central">Cash in Hand - Conakry Central</option>
                  <option value="Ecobank Guinea - Operational A/C">Ecobank Guinea - Operational A/C</option>
                  <option value="United Bank for Africa (UBA) - USD">United Bank for Africa (UBA) - USD</option>
                  <option value="Société Générale Guinée - Main">Société Générale Guinée - Main</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sales Order</label>
                <select
                  value={ciSalesOrder}
                  onChange={(e) => handleCiSalesOrderChange(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Select Sales Order</option>
                  {salesOrders.map((so) => {
                    const code = so.soNo || so.orderNo || '';
                    return (
                      <option key={so.id} value={code}>
                        {code} ({so.customerName})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">LPO Reference</label>
                <input
                  type="text"
                  value={ciLpoRef}
                  placeholder="e.g. PAC-LPO-9921"
                  onChange={(e) => setCiLpoRef(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Terms</label>
                <input
                  type="text"
                  value={ciPaymentTerms}
                  placeholder="e.g. Cash on Delivery"
                  onChange={(e) => setCiPaymentTerms(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project</label>
                <input
                  type="text"
                  value={ciProject}
                  placeholder="e.g. Kaloum Port Expansion Project"
                  onChange={(e) => setCiProject(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Product Items Table (Exact steel_erp: SI, Product Description, Unit, Qty, Rate, Discount, Amount) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Invoice Product Items
              </label>
              <button
                type="button"
                onClick={handleAddCiProductRow}
                className="px-2.5 py-1 text-[11px] font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product Row
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-2 py-2 text-center" style={{ width: '40px' }}>SI</th>
                    <th className="px-2 py-2" style={{ width: '320px' }}>Product Description</th>
                    <th className="px-2 py-2 text-center" style={{ width: '85px' }}>Unit</th>
                    <th className="px-2 py-2 text-right" style={{ width: '90px' }}>Qty</th>
                    <th className="px-2 py-2 text-right" style={{ width: '120px' }}>Rate ($)</th>
                    <th className="px-2 py-2 text-right" style={{ width: '95px' }}>Discount (%)</th>
                    <th className="px-2 py-2 text-right" style={{ width: '130px' }}>Amount ($)</th>
                    <th className="px-2 py-2 text-center" style={{ width: '50px' }}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ciProductRows.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="px-2 py-1.5 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="px-2 py-1.5">
                        <select
                          value={row.productId || ''}
                          onChange={(e) => handleCiProductChange(idx, e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 mb-1"
                        >
                          <option value="">Select Product</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.code})
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Product description..."
                          value={row.productDescription}
                          onChange={(e) => handleCiRowFieldChange(idx, 'productDescription', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="text"
                          placeholder="MT"
                          value={row.unit}
                          onChange={(e) => handleCiRowFieldChange(idx, 'unit', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded text-center focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          placeholder="0"
                          value={row.quantity === 0 && !editingCashInvoiceId ? '' : row.quantity}
                          onChange={(e) => handleCiRowFieldChange(idx, 'quantity', Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded text-right font-mono focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          placeholder="0"
                          value={row.rate === 0 && !editingCashInvoiceId ? '' : row.rate}
                          onChange={(e) => handleCiRowFieldChange(idx, 'rate', Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded text-right font-mono focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          placeholder="0"
                          value={row.discount === 0 && !editingCashInvoiceId ? '' : row.discount}
                          onChange={(e) => handleCiRowFieldChange(idx, 'discount', Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded text-right font-mono focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono font-bold text-slate-800">
                        ${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveCiProductRow(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove row"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Table (Exact steel_erp cash-invoice.php: Total, Advance Paid, Balance Due) */}
            <div className="flex justify-end pt-2">
              <div className="w-72 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600">Total:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ${ciProductRows.reduce((sum, r) => sum + r.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600">Advance Paid:</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={ciAdvanceAmount === 0 && !editingCashInvoiceId ? '' : ciAdvanceAmount}
                    onChange={(e) => setCiAdvanceAmount(Number(e.target.value))}
                    className="w-32 px-2 py-1 text-right font-mono border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-800">Balance Due:</span>
                  <span className="font-mono font-bold text-amber-700 text-sm">
                    ${Math.max(0, ciProductRows.reduce((sum, r) => sum + r.amount, 0) - (Number(ciAdvanceAmount) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
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
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
            >
              {editingCashInvoiceId ? 'Update Cash Invoice' : 'Save Cash Invoice'}
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW CASH INVOICE MODAL */}
      <Modal
        isOpen={viewCashInvoiceModalOpen && selectedCashInvoice !== null}
        onClose={() => setViewCashInvoiceModalOpen(false)}
        title={`Cash Invoice Details - ${selectedCashInvoice?.invoiceNo}`}
        maxWidth="4xl"
      >
        {selectedCashInvoice && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <p className="text-slate-500 text-[11px]">Reference</p>
                <p className="font-mono font-bold text-slate-800">{selectedCashInvoice.invoiceNo}</p>
                <p className="text-slate-500 text-[11px] mt-2">Customer</p>
                <p className="font-semibold text-slate-800">{selectedCashInvoice.customerName}</p>
                <p className="text-slate-500 text-[11px] mt-2">Credit Account</p>
                <p className="text-slate-800">{selectedCashInvoice.creditAccount || 'Cash in Hand - Conakry Central'}</p>
                <p className="text-slate-500 text-[11px] mt-2">Sales Order</p>
                <p className="font-mono text-slate-700">{selectedCashInvoice.salesOrderRef || selectedCashInvoice.soRef || '-'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[11px]">Date</p>
                <p className="text-slate-800">{selectedCashInvoice.date}</p>
                <p className="text-slate-500 text-[11px] mt-2">LPO Reference</p>
                <p className="text-slate-800">{selectedCashInvoice.lpoRef || '-'}</p>
                <p className="text-slate-500 text-[11px] mt-2">Payment Terms</p>
                <p className="text-slate-800">{selectedCashInvoice.paymentTerms || 'Cash on Delivery'}</p>
                <p className="text-slate-500 text-[11px] mt-2">Project</p>
                <p className="text-slate-800">{selectedCashInvoice.project || '-'}</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-2 py-2 text-center" style={{ width: '40px' }}>SI</th>
                    <th className="px-2 py-2" style={{ width: '320px' }}>Product Description</th>
                    <th className="px-2 py-2 text-center" style={{ width: '85px' }}>Unit</th>
                    <th className="px-2 py-2 text-right" style={{ width: '90px' }}>Qty</th>
                    <th className="px-2 py-2 text-right" style={{ width: '120px' }}>Rate ($)</th>
                    <th className="px-2 py-2 text-right" style={{ width: '95px' }}>Discount (%)</th>
                    <th className="px-2 py-2 text-right" style={{ width: '130px' }}>Amount ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedCashInvoice.items && selectedCashInvoice.items.length > 0 ? (
                    selectedCashInvoice.items.map((it, idx) => (
                      <tr key={it.id || idx}>
                        <td className="px-2 py-2 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="px-2 py-2 font-medium text-slate-800">{it.productDescription}</td>
                        <td className="px-2 py-2 text-center text-slate-600">{it.unit}</td>
                        <td className="px-2 py-2 text-right font-mono">{it.quantity}</td>
                        <td className="px-2 py-2 text-right font-mono">${it.rate.toLocaleString()}</td>
                        <td className="px-2 py-2 text-right font-mono">{it.discount}%</td>
                        <td className="px-2 py-2 text-right font-mono font-bold text-slate-800">${it.amount.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-2 py-2 text-center font-mono text-slate-500">1</td>
                      <td className="px-2 py-2 font-medium text-slate-800">Invoiced Steel Products</td>
                      <td className="px-2 py-2 text-center text-slate-600">Lot</td>
                      <td className="px-2 py-2 text-right font-mono">1</td>
                      <td className="px-2 py-2 text-right font-mono">${selectedCashInvoice.totalAmount.toLocaleString()}</td>
                      <td className="px-2 py-2 text-right font-mono">0%</td>
                      <td className="px-2 py-2 text-right font-mono font-bold text-slate-800">${selectedCashInvoice.totalAmount.toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <div className="w-72 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600">Total:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ${selectedCashInvoice.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600">Advance Paid:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    ${(selectedCashInvoice.advanceAmount ?? selectedCashInvoice.paidAmount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-800">Balance Due:</span>
                  <span className="font-mono font-bold text-amber-700 text-sm">
                    ${(selectedCashInvoice.balanceDue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewCashInvoiceModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 10: ADD / EDIT CREDIT INVOICE (Exact steel_erp credit-invoice.php) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddCreditInvoice'}
        onClose={() => setModalOpen(false)}
        title={editingCreditInvoiceId ? 'Edit Credit Invoice' : 'Credit Invoice'}
        maxWidth="5xl"
      >
        <form onSubmit={handleSaveCreditInvoice} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            {/* Left Column */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Referance</label>
                <input
                  type="text"
                  readOnly
                  value={cciRefNo}
                  className="w-full px-3 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="text"
                  value={cciDate}
                  onChange={(e) => setCciDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name *</label>
                <select
                  required
                  value={cciCustomer}
                  onChange={(e) => setCciCustomer(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Credit Account *</label>
                <select
                  required
                  value={cciCreditAccount}
                  onChange={(e) => setCciCreditAccount(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Accounts Receivable">Accounts Receivable</option>
                  <option value="Commercial Trade Debtors">Commercial Trade Debtors</option>
                  <option value="Direct Export Clients">Direct Export Clients</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sales Order</label>
                <select
                  value={cciSalesOrder}
                  onChange={(e) => handleCciSalesOrderChange(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Select Sales Order</option>
                  {salesOrders.map((so) => {
                    const code = so.soNo || so.orderNo || '';
                    return (
                      <option key={so.id} value={code}>
                        {code} ({so.customerName})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">LPO Reference</label>
                <input
                  type="text"
                  value={cciLpoRef}
                  placeholder="e.g. SIM-PO-4481"
                  onChange={(e) => setCciLpoRef(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Terms</label>
                <input
                  type="text"
                  value={cciPaymentTerms}
                  placeholder="e.g. 30 Days Net"
                  onChange={(e) => setCciPaymentTerms(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project</label>
                <input
                  type="text"
                  value={cciProject}
                  placeholder="e.g. Simandou Corridor Phase 1"
                  onChange={(e) => setCciProject(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Product Items Table (Exact steel_erp credit-invoice.php: DN No., Product Description, Unit, Qty, Rate, Discount, Amount) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Credit Invoice Product Items
              </label>
              <button
                type="button"
                onClick={handleAddCciProductRow}
                className="px-2.5 py-1 text-[11px] font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product Row
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-2 py-2 text-center" style={{ width: '110px' }}>DN No.</th>
                    <th className="px-2 py-2" style={{ width: '300px' }}>Product Description</th>
                    <th className="px-2 py-2 text-center" style={{ width: '85px' }}>Unit</th>
                    <th className="px-2 py-2 text-right" style={{ width: '90px' }}>Qty</th>
                    <th className="px-2 py-2 text-right" style={{ width: '120px' }}>Rate ($)</th>
                    <th className="px-2 py-2 text-right" style={{ width: '95px' }}>Discount (%)</th>
                    <th className="px-2 py-2 text-right" style={{ width: '130px' }}>Amount ($)</th>
                    <th className="px-2 py-2 text-center" style={{ width: '50px' }}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cciProductRows.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="px-2 py-1.5 text-center font-mono text-slate-600">
                        <input
                          type="text"
                          placeholder="DN-..."
                          value={row.dnNo || ''}
                          onChange={(e) => handleCciRowFieldChange(idx, 'dnNo', e.target.value)}
                          className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded text-center font-mono focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <select
                          value={row.productId || ''}
                          onChange={(e) => handleCciProductChange(idx, e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 mb-1"
                        >
                          <option value="">Select Product</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.code})
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Product description..."
                          value={row.productDescription}
                          onChange={(e) => handleCciRowFieldChange(idx, 'productDescription', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="text"
                          placeholder="MT"
                          value={row.unit}
                          onChange={(e) => handleCciRowFieldChange(idx, 'unit', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded text-center focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          placeholder="0"
                          value={row.quantity === 0 && !editingCreditInvoiceId ? '' : row.quantity}
                          onChange={(e) => handleCciRowFieldChange(idx, 'quantity', Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded text-right font-mono focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          placeholder="0"
                          value={row.rate === 0 && !editingCreditInvoiceId ? '' : row.rate}
                          onChange={(e) => handleCciRowFieldChange(idx, 'rate', Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded text-right font-mono focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          placeholder="0"
                          value={row.discount === 0 && !editingCreditInvoiceId ? '' : row.discount}
                          onChange={(e) => handleCciRowFieldChange(idx, 'discount', Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded text-right font-mono focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono font-bold text-slate-800">
                        ${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveCciProductRow(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove row"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Table (Exact steel_erp credit-invoice.php: Total, Advance Paid, Balance Due) */}
            <div className="flex justify-end pt-2">
              <div className="w-72 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600">Total:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ${cciProductRows.reduce((sum, r) => sum + r.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600">Advance Paid:</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={cciAdvanceAmount === 0 && !editingCreditInvoiceId ? '' : cciAdvanceAmount}
                    onChange={(e) => setCciAdvanceAmount(Number(e.target.value))}
                    className="w-32 px-2 py-1 text-right font-mono border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-800">Balance Due:</span>
                  <span className="font-mono font-bold text-amber-700 text-sm">
                    ${Math.max(0, cciProductRows.reduce((sum, r) => sum + r.amount, 0) - (Number(cciAdvanceAmount) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
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
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
            >
              {editingCreditInvoiceId ? 'Update Credit Invoice' : 'Save Credit Invoice'}
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW CREDIT INVOICE MODAL */}
      <Modal
        isOpen={viewCreditInvoiceModalOpen && selectedCreditInvoice !== null}
        onClose={() => setViewCreditInvoiceModalOpen(false)}
        title={`Credit Invoice Details - ${selectedCreditInvoice?.invoiceNo}`}
        maxWidth="4xl"
      >
        {selectedCreditInvoice && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <p className="text-slate-500 text-[11px]">Reference</p>
                <p className="font-mono font-bold text-slate-800">{selectedCreditInvoice.invoiceNo}</p>
                <p className="text-slate-500 text-[11px] mt-2">Customer</p>
                <p className="font-semibold text-slate-800">{selectedCreditInvoice.customerName}</p>
                <p className="text-slate-500 text-[11px] mt-2">Credit Account</p>
                <p className="text-slate-800">{selectedCreditInvoice.creditAccount || 'Accounts Receivable'}</p>
                <p className="text-slate-500 text-[11px] mt-2">Sales Order</p>
                <p className="font-mono text-slate-700">{selectedCreditInvoice.salesOrderRef || selectedCreditInvoice.soRef || '-'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[11px]">Date</p>
                <p className="text-slate-800">{selectedCreditInvoice.date}</p>
                <p className="text-slate-500 text-[11px] mt-2">LPO Reference</p>
                <p className="text-slate-800">{selectedCreditInvoice.lpoRef || '-'}</p>
                <p className="text-slate-500 text-[11px] mt-2">Payment Terms</p>
                <p className="text-slate-800">{selectedCreditInvoice.paymentTerms || '30 Days Net'}</p>
                <p className="text-slate-500 text-[11px] mt-2">Project</p>
                <p className="text-slate-800">{selectedCreditInvoice.project || '-'}</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-2 py-2 text-center" style={{ width: '40px' }}>SI</th>
                    <th className="px-2 py-2" style={{ width: '320px' }}>Product Description</th>
                    <th className="px-2 py-2 text-center" style={{ width: '85px' }}>Unit</th>
                    <th className="px-2 py-2 text-right" style={{ width: '90px' }}>Qty</th>
                    <th className="px-2 py-2 text-right" style={{ width: '120px' }}>Rate ($)</th>
                    <th className="px-2 py-2 text-right" style={{ width: '95px' }}>Discount (%)</th>
                    <th className="px-2 py-2 text-right" style={{ width: '130px' }}>Amount ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedCreditInvoice.items && selectedCreditInvoice.items.length > 0 ? (
                    selectedCreditInvoice.items.map((it, idx) => (
                      <tr key={it.id || idx}>
                        <td className="px-2 py-2 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="px-2 py-2 font-medium text-slate-800">{it.productDescription}</td>
                        <td className="px-2 py-2 text-center text-slate-600">{it.unit}</td>
                        <td className="px-2 py-2 text-right font-mono">{it.quantity}</td>
                        <td className="px-2 py-2 text-right font-mono">${it.rate.toLocaleString()}</td>
                        <td className="px-2 py-2 text-right font-mono">{it.discount}%</td>
                        <td className="px-2 py-2 text-right font-mono font-bold text-slate-800">${it.amount.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-2 py-2 text-center font-mono text-slate-500">1</td>
                      <td className="px-2 py-2 font-medium text-slate-800">Delivered Steel Materials (Credit)</td>
                      <td className="px-2 py-2 text-center text-slate-600">Lot</td>
                      <td className="px-2 py-2 text-right font-mono">1</td>
                      <td className="px-2 py-2 text-right font-mono">${selectedCreditInvoice.totalAmount.toLocaleString()}</td>
                      <td className="px-2 py-2 text-right font-mono">0%</td>
                      <td className="px-2 py-2 text-right font-mono font-bold text-slate-800">${selectedCreditInvoice.totalAmount.toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <div className="w-72 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600">Total:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ${selectedCreditInvoice.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600">Advance Paid:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    ${(selectedCreditInvoice.advanceAmount ?? selectedCreditInvoice.paidAmount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-800">Balance Due:</span>
                  <span className="font-mono font-bold text-amber-700 text-sm">
                    ${(selectedCreditInvoice.balanceDue ?? (selectedCreditInvoice.totalAmount - (selectedCreditInvoice.paidAmount || 0))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewCreditInvoiceModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 11: ADD / EDIT SALES RETURN (Exact steel_erp sales-return.php) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddSalesReturn'}
        onClose={() => setModalOpen(false)}
        title={editingSalesReturnId ? 'Edit Sales Return' : 'Sales Return'}
        maxWidth="5xl"
      >
        <form onSubmit={handleSaveSalesReturn} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            {/* Left Column */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Referance</label>
                <input
                  type="text"
                  readOnly
                  value={srRefNo}
                  className="w-full px-3 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="text"
                  value={srDate}
                  onChange={(e) => setSrDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name *</label>
                <select
                  required
                  value={srCustomer}
                  onChange={(e) => setSrCustomer(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice No *</label>
                <select
                  required
                  value={srInvoiceNo}
                  onChange={(e) => handleSrInvoiceChange(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">Select Invoice No</option>
                  {invoices.map((inv) => (
                    <option key={inv.id} value={inv.invoiceNo}>
                      {inv.invoiceNo} ({inv.customerName} - ${inv.totalAmount.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Debit Account *</label>
                <input
                  type="text"
                  value={srDebitAccount}
                  onChange={(e) => setSrDebitAccount(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">LPO Reference</label>
                <input
                  type="text"
                  value={srLpoRef}
                  placeholder="e.g. SIM-PO-4481"
                  onChange={(e) => setSrLpoRef(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Terms</label>
                <input
                  type="text"
                  value={srPaymentTerms}
                  placeholder="e.g. 30 Days Net"
                  onChange={(e) => setSrPaymentTerms(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project</label>
                <input
                  type="text"
                  value={srProject}
                  placeholder="e.g. Simandou Corridor Phase 1"
                  onChange={(e) => setSrProject(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Return</label>
                <textarea
                  rows={2}
                  placeholder="Reason for return, defective specifications..."
                  value={srReason}
                  onChange={(e) => setSrReason(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Product Items Table (Exact steel_erp sales-return.php: SI, Product Description, Unit, Qty, Rate, Discount, Amount) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Returned Product Items
              </label>
              <button
                type="button"
                onClick={handleAddSrProductRow}
                className="px-2.5 py-1 text-[11px] font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product Row
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="px-2 py-2 text-center" style={{ width: '40px' }}>SI</th>
                    <th className="px-2 py-2" style={{ width: '320px' }}>Product Description</th>
                    <th className="px-2 py-2 text-center" style={{ width: '85px' }}>Unit</th>
                    <th className="px-2 py-2 text-right" style={{ width: '90px' }}>Qty</th>
                    <th className="px-2 py-2 text-right" style={{ width: '120px' }}>Rate ($)</th>
                    <th className="px-2 py-2 text-right" style={{ width: '95px' }}>Discount (%)</th>
                    <th className="px-2 py-2 text-right" style={{ width: '130px' }}>Amount ($)</th>
                    <th className="px-2 py-2 text-center" style={{ width: '50px' }}>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {srProductRows.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="px-2 py-1.5 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="px-2 py-1.5">
                        <select
                          value={row.productId || ''}
                          onChange={(e) => handleSrProductChange(idx, e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 mb-1"
                        >
                          <option value="">Select Product</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.code})
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Product description..."
                          value={row.productDescription}
                          onChange={(e) => handleSrRowFieldChange(idx, 'productDescription', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="text"
                          placeholder="MT"
                          value={row.unit}
                          onChange={(e) => handleSrRowFieldChange(idx, 'unit', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded text-center focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          placeholder="0"
                          value={row.quantity === 0 && !editingSalesReturnId ? '' : row.quantity}
                          onChange={(e) => handleSrRowFieldChange(idx, 'quantity', Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded text-right font-mono focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          placeholder="0"
                          value={row.rate === 0 && !editingSalesReturnId ? '' : row.rate}
                          onChange={(e) => handleSrRowFieldChange(idx, 'rate', Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded text-right font-mono focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <input
                          type="number"
                          placeholder="0"
                          value={row.discount === 0 && !editingSalesReturnId ? '' : row.discount}
                          onChange={(e) => handleSrRowFieldChange(idx, 'discount', Number(e.target.value))}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded text-right font-mono focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono font-bold text-rose-600">
                        ${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSrProductRow(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Remove row"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Table (Exact steel_erp sales-return.php: Total) */}
            <div className="flex justify-end pt-2">
              <div className="w-72 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">Total Return Amount:</span>
                  <span className="font-mono font-bold text-rose-600 text-sm">
                    ${srProductRows.reduce((sum, r) => sum + r.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
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
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
            >
              {editingSalesReturnId ? 'Update Sales Return' : 'Save Sales Return'}
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW SALES RETURN MODAL */}
      <Modal
        isOpen={viewSalesReturnModalOpen && selectedSalesReturn !== null}
        onClose={() => setViewSalesReturnModalOpen(false)}
        title={`Sales Return Details - ${selectedSalesReturn?.returnNo}`}
        maxWidth="4xl"
      >
        {selectedSalesReturn && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <p className="text-slate-500 text-[11px]">Reference</p>
                <p className="font-mono font-bold text-slate-800">{selectedSalesReturn.returnNo}</p>
                <p className="text-slate-500 text-[11px] mt-2">Customer</p>
                <p className="font-semibold text-slate-800">{selectedSalesReturn.customerName}</p>
                <p className="text-slate-500 text-[11px] mt-2">Invoice No</p>
                <p className="font-mono text-slate-700">{selectedSalesReturn.invoiceNo}</p>
                <p className="text-slate-500 text-[11px] mt-2">Debit Account</p>
                <p className="text-slate-800">{selectedSalesReturn.debitAccount || 'Accounts Receivable'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[11px]">Date</p>
                <p className="text-slate-800">{selectedSalesReturn.date}</p>
                <p className="text-slate-500 text-[11px] mt-2">LPO Reference</p>
                <p className="text-slate-800">{selectedSalesReturn.lpoRef || '-'}</p>
                <p className="text-slate-500 text-[11px] mt-2">Project / Payment Terms</p>
                <p className="text-slate-800">{selectedSalesReturn.project || '-'} / {selectedSalesReturn.paymentTerms || '-'}</p>
                <p className="text-slate-500 text-[11px] mt-2">Reason for Return</p>
                <p className="text-slate-700 italic">{selectedSalesReturn.reason || 'Defective material'}</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-2 py-2 text-center" style={{ width: '40px' }}>SI</th>
                    <th className="px-2 py-2" style={{ width: '320px' }}>Product Description</th>
                    <th className="px-2 py-2 text-center" style={{ width: '85px' }}>Unit</th>
                    <th className="px-2 py-2 text-right" style={{ width: '90px' }}>Qty</th>
                    <th className="px-2 py-2 text-right" style={{ width: '120px' }}>Rate ($)</th>
                    <th className="px-2 py-2 text-right" style={{ width: '95px' }}>Discount (%)</th>
                    <th className="px-2 py-2 text-right" style={{ width: '130px' }}>Amount ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedSalesReturn.items && selectedSalesReturn.items.length > 0 ? (
                    selectedSalesReturn.items.map((it, idx) => (
                      <tr key={it.id || idx}>
                        <td className="px-2 py-2 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="px-2 py-2 font-medium text-slate-800">{it.productDescription}</td>
                        <td className="px-2 py-2 text-center text-slate-600">{it.unit}</td>
                        <td className="px-2 py-2 text-right font-mono">{it.quantity}</td>
                        <td className="px-2 py-2 text-right font-mono">${it.rate.toLocaleString()}</td>
                        <td className="px-2 py-2 text-right font-mono">{it.discount}%</td>
                        <td className="px-2 py-2 text-right font-mono font-bold text-rose-600">${it.amount.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-2 py-2 text-center font-mono text-slate-500">1</td>
                      <td className="px-2 py-2 font-medium text-slate-800">{selectedSalesReturn.reason || 'Returned Materials'}</td>
                      <td className="px-2 py-2 text-center text-slate-600">Lot</td>
                      <td className="px-2 py-2 text-right font-mono">1</td>
                      <td className="px-2 py-2 text-right font-mono">${selectedSalesReturn.amount.toLocaleString()}</td>
                      <td className="px-2 py-2 text-right font-mono">0%</td>
                      <td className="px-2 py-2 text-right font-mono font-bold text-rose-600">${selectedSalesReturn.amount.toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <div className="w-72 bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">Total Return Amount:</span>
                  <span className="font-mono font-bold text-rose-600 text-sm">
                    ${selectedSalesReturn.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewSalesReturnModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
        </div>
  );
}
