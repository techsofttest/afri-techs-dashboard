'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Search,
  Eye,
  Trash2,
  Edit,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import Modal from '@/components/Modal';
import ProcurementReports from '@/components/reports/ProcurementReports';
import {
  initialVendors,
  initialMaterialRequisitions,
  initialPurchaseOrders,
  initialMRNs,
  initialPurchaseVouchers,
  initialPurchaseReturns,
  initialSalesOrders,
  initialProducts
} from '@/lib/mock-data';
import {
  Vendor,
  MaterialRequisition,
  MaterialRequisitionItem,
  PurchaseOrder,
  PurchaseOrderItem,
  MaterialReceivedNote,
  MaterialReceivedNoteItem,
  PurchaseVoucher,
  PurchaseVoucherItem,
  PurchaseReturn,
  PurchaseReturnItem
} from '@/lib/types';

export default function ProcurementPage() {
  const [activeSection, setActiveSection] = useState<'Procurement' | 'Reports'>('Procurement');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'reports' || params.get('tab') === 'Reports') {
        setActiveSection('Reports');
      }
    }
  }, []);

  const [activeTab, setActiveTab] = useState<
    | 'Vendor'
    | 'MaterialRequisition'
    | 'PurchaseOrder'
    | 'MaterialReceivedNote'
    | 'PurchaseVoucher'
    | 'PurchaseReturn'
  >('Vendor');

  // Datasets
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [requisitions, setRequisitions] = useState<MaterialRequisition[]>(initialMaterialRequisitions);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [mrns, setMrns] = useState<MaterialReceivedNote[]>(initialMRNs);
  const [purchaseVouchers, setPurchaseVouchers] = useState<PurchaseVoucher[]>(initialPurchaseVouchers);
  const [purchaseReturns, setPurchaseReturns] = useState<PurchaseReturn[]>(initialPurchaseReturns);

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  // 1. Add Vendor State (Identical to steel_erp add_vendor.php without Contact Person)
  const [vName, setVName] = useState('');
  const [vAccountHead, setVAccountHead] = useState('Accounts Payable');
  const [vAccountId, setVAccountId] = useState('201001');
  const [vPostBox, setVPostBox] = useState('');
  const [vTelephone, setVTelephone] = useState('');
  const [vFax, setVFax] = useState('');
  const [vEmail, setVEmail] = useState('');
  const [vCity, setVCity] = useState('Conakry');
  const [vCountry, setVCountry] = useState('Guinea');

  // 2. Material Requisition State (steel_erp material-requisition.php)
  const [editingMrId, setEditingMrId] = useState<string | null>(null);
  const [mrReference, setMrReference] = useState('');
  const [mrDate, setMrDate] = useState('18-Nov-2026');
  const [mrTimeFrame, setMrTimeFrame] = useState('');
  const [mrAssignedTo, setMrAssignedTo] = useState('Fabrication Plant 1');
  const [mrRows, setMrRows] = useState<
    Array<{
      id: string;
      salesOrderNo: string;
      productId: string;
      productDescription: string;
      unit: string;
      quantity: number;
    }>
  >([
    {
      id: '1',
      salesOrderNo: '',
      productId: '',
      productDescription: '',
      unit: '',
      quantity: 0
    }
  ]);
  const [viewMrModalOpen, setViewMrModalOpen] = useState(false);
  const [selectedMr, setSelectedMr] = useState<MaterialRequisition | null>(null);

  // 3. Purchase Order State (steel_erp purchase-order.php without Contact Person)
  const [editingPoId, setEditingPoId] = useState<string | null>(null);
  const [poReference, setPoReference] = useState('');
  const [poDate, setPoDate] = useState('18-Nov-2026');
  const [poVendor, setPoVendor] = useState('');
  const [poMrnRef, setPoMrnRef] = useState('');
  const [poPaymentTerm, setPoPaymentTerm] = useState('30 Days Net');
  const [poDeliveryDate, setPoDeliveryDate] = useState('');
  const [poVendorRef, setPoVendorRef] = useState('');
  const [poRows, setPoRows] = useState<
    Array<{
      id: string;
      salesOrderNo: string;
      productId: string;
      productDescription: string;
      unit: string;
      quantity: number;
      rate: number;
      discount: number;
      amount: number;
    }>
  >([
    {
      id: '1',
      salesOrderNo: '',
      productId: '',
      productDescription: '',
      unit: '',
      quantity: 0,
      rate: 0,
      discount: 0,
      amount: 0
    }
  ]);
  const [viewPoModalOpen, setViewPoModalOpen] = useState(false);
  const [selectedPo, setSelectedPo] = useState<PurchaseOrder | null>(null);

  // MR Handlers
  const openAddMrModal = () => {
    setEditingMrId(null);
    setMrReference(`MR-2026-${String(requisitions.length + 53).padStart(3, '0')}`);
    setMrDate('18-Nov-2026');
    setMrTimeFrame('');
    setMrAssignedTo('Fabrication Plant 1');
    setMrRows([
      {
        id: '1',
        salesOrderNo: '',
        productId: '',
        productDescription: '',
        unit: '',
        quantity: 0
      }
    ]);
    setModalType('AddMR');
    setModalOpen(true);
  };

  const openEditMrModal = (mr: MaterialRequisition) => {
    setEditingMrId(mr.id);
    setMrReference(mr.mrNo);
    setMrDate(mr.date);
    setMrTimeFrame(mr.timeFrame || '');
    setMrAssignedTo(mr.assignedTo || 'Fabrication Plant 1');
    if (mr.items && mr.items.length > 0) {
      setMrRows(
        mr.items.map((it, idx) => ({
          id: it.id || String(idx + 1),
          salesOrderNo: it.salesOrderNo || '',
          productId: it.productId || '',
          productDescription: it.productDescription || '',
          unit: it.unit || '',
          quantity: it.quantity || 0
        }))
      );
    } else {
      setMrRows([
        {
          id: '1',
          salesOrderNo: '',
          productId: '',
          productDescription: mr.itemsSummary || '',
          unit: 'Pcs',
          quantity: 1
        }
      ]);
    }
    setModalType('AddMR');
    setModalOpen(true);
  };

  const handleMrProductChange = (index: number, prodId: string) => {
    const prod = initialProducts.find((p) => p.id === prodId || p.code === prodId);
    setMrRows((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        productId: prodId,
        productDescription: prod ? prod.name : '',
        unit: prod ? prod.unit : updated[index].unit
      };
      return updated;
    });
  };

  const handleMrRowChange = (
    index: number,
    field: 'salesOrderNo' | 'productDescription' | 'unit' | 'quantity',
    value: any
  ) => {
    setMrRows((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  const handleAddMrRow = () => {
    setMrRows((prev) => [
      ...prev,
      {
        id: String(Date.now() + Math.random()),
        salesOrderNo: '',
        productId: '',
        productDescription: '',
        unit: '',
        quantity: 0
      }
    ]);
  };

  const handleRemoveMrRow = (index: number) => {
    if (mrRows.length === 1) return;
    setMrRows(mrRows.filter((_, i) => i !== index));
  };

  const handleSaveMR = (e: React.FormEvent) => {
    e.preventDefault();
    const items: MaterialRequisitionItem[] = mrRows.map((r, idx) => ({
      id: r.id,
      slNo: idx + 1,
      salesOrderNo: r.salesOrderNo,
      productId: r.productId,
      productDescription: r.productDescription,
      unit: r.unit,
      quantity: Number(r.quantity) || 0
    }));

    const summary = items.map((i) => `${i.quantity}x ${i.productDescription}`).join(', ');

    if (editingMrId) {
      setRequisitions(
        requisitions.map((mr) =>
          mr.id === editingMrId
            ? {
                ...mr,
                mrNo: mrReference,
                date: mrDate,
                timeFrame: mrTimeFrame,
                assignedTo: mrAssignedTo,
                department: mrAssignedTo,
                itemsSummary: summary,
                items
              }
            : mr
        )
      );
    } else {
      const newMR: MaterialRequisition = {
        id: String(Date.now()),
        mrNo: mrReference || `MR-2026-${String(requisitions.length + 53).padStart(3, '0')}`,
        date: mrDate,
        timeFrame: mrTimeFrame,
        assignedTo: mrAssignedTo,
        department: mrAssignedTo,
        itemsSummary: summary || 'Steel Materials & Consumables',
        status: 'Approved',
        items
      };
      setRequisitions([newMR, ...requisitions]);
    }
    setModalOpen(false);
  };

  // PO Handlers
  const openAddPoModal = () => {
    setEditingPoId(null);
    setPoReference(`PO-2026-${String(purchaseOrders.length + 75).padStart(3, '0')}`);
    setPoDate('18-Nov-2026');
    setPoVendor('');
    setPoMrnRef('');
    setPoPaymentTerm('30 Days Net');
    setPoDeliveryDate('');
    setPoVendorRef('');
    setPoRows([
      {
        id: '1',
        salesOrderNo: '',
        productId: '',
        productDescription: '',
        unit: '',
        quantity: 0,
        rate: 0,
        discount: 0,
        amount: 0
      }
    ]);
    setModalType('AddPO');
    setModalOpen(true);
  };

  const openEditPoModal = (po: PurchaseOrder) => {
    setEditingPoId(po.id);
    setPoReference(po.poNo);
    setPoDate(po.date);
    setPoVendor(po.vendorName);
    setPoMrnRef(po.mrRef || '');
    setPoPaymentTerm(po.paymentTerm || '30 Days Net');
    setPoDeliveryDate(po.deliveryDueDate || '');
    setPoVendorRef(po.vendorRef || '');
    if (po.items && po.items.length > 0) {
      setPoRows(
        po.items.map((it, idx) => ({
          id: it.id || String(idx + 1),
          salesOrderNo: it.salesOrderNo || '',
          productId: it.productId || '',
          productDescription: it.productDescription || '',
          unit: it.unit || '',
          quantity: it.quantity || 0,
          rate: it.rate || 0,
          discount: it.discount || 0,
          amount: it.amount || 0
        }))
      );
    } else {
      setPoRows([
        {
          id: '1',
          salesOrderNo: '',
          productId: '',
          productDescription: 'Procurement Items',
          unit: 'Lot',
          quantity: 1,
          rate: po.totalAmount,
          discount: 0,
          amount: po.totalAmount
        }
      ]);
    }
    setModalType('AddPO');
    setModalOpen(true);
  };

  const handlePoMrnRefChange = (mrNo: string) => {
    setPoMrnRef(mrNo);
    const targetMr = requisitions.find((m) => m.mrNo === mrNo);
    if (targetMr && targetMr.items && targetMr.items.length > 0) {
      const populatedRows = targetMr.items.map((item, idx) => {
        const prod = initialProducts.find((p) => p.id === item.productId || p.name === item.productDescription);
        const rate = prod ? prod.costPrice : 100;
        const qty = item.quantity || 1;
        const discount = 0;
        const amount = qty * rate * (1 - discount / 100);
        return {
          id: String(idx + 1),
          salesOrderNo: item.salesOrderNo || '',
          productId: item.productId || '',
          productDescription: item.productDescription || '',
          unit: item.unit || '',
          quantity: qty,
          rate,
          discount,
          amount
        };
      });
      setPoRows(populatedRows);
    }
  };

  const handlePoProductChange = (index: number, prodId: string) => {
    const prod = initialProducts.find((p) => p.id === prodId || p.code === prodId);
    setPoRows((prev) => {
      const updated = [...prev];
      const rate = prod ? prod.costPrice : updated[index].rate;
      const qty = updated[index].quantity;
      const discount = updated[index].discount;
      const amount = Math.round(qty * rate * (1 - discount / 100) * 100) / 100;
      updated[index] = {
        ...updated[index],
        productId: prodId,
        productDescription: prod ? prod.name : '',
        unit: prod ? prod.unit : updated[index].unit,
        rate,
        amount
      };
      return updated;
    });
  };

  const handlePoRowChange = (
    index: number,
    field: 'salesOrderNo' | 'productDescription' | 'unit' | 'quantity' | 'rate' | 'discount',
    value: any
  ) => {
    setPoRows((prev) => {
      const updated = [...prev];
      const r = { ...updated[index], [field]: value };
      const q = field === 'quantity' ? Number(value) || 0 : r.quantity;
      const rt = field === 'rate' ? Number(value) || 0 : r.rate;
      const d = field === 'discount' ? Number(value) || 0 : r.discount;
      r.amount = Math.round(q * rt * (1 - d / 100) * 100) / 100;
      updated[index] = r;
      return updated;
    });
  };

  const handleAddPoRow = () => {
    setPoRows((prev) => [
      ...prev,
      {
        id: String(Date.now() + Math.random()),
        salesOrderNo: '',
        productId: '',
        productDescription: '',
        unit: '',
        quantity: 0,
        rate: 0,
        discount: 0,
        amount: 0
      }
    ]);
  };

  const handleRemovePoRow = (index: number) => {
    if (poRows.length === 1) return;
    setPoRows(poRows.filter((_, i) => i !== index));
  };

  const poTotalAmount = poRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const handleSavePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poVendor) return;

    const items: PurchaseOrderItem[] = poRows.map((r, idx) => ({
      id: r.id,
      slNo: idx + 1,
      salesOrderNo: r.salesOrderNo,
      productId: r.productId,
      productDescription: r.productDescription,
      unit: r.unit,
      quantity: Number(r.quantity) || 0,
      rate: Number(r.rate) || 0,
      discount: Number(r.discount) || 0,
      amount: Number(r.amount) || 0
    }));

    if (editingPoId) {
      setPurchaseOrders(
        purchaseOrders.map((po) =>
          po.id === editingPoId
            ? {
                ...po,
                poNo: poReference,
                date: poDate,
                vendorName: poVendor,
                mrRef: poMrnRef,
                paymentTerm: poPaymentTerm,
                deliveryDueDate: poDeliveryDate,
                vendorRef: poVendorRef,
                totalAmount: poTotalAmount,
                items
              }
            : po
        )
      );
    } else {
      const newPO: PurchaseOrder = {
        id: String(Date.now()),
        poNo: poReference || `PO-2026-${String(purchaseOrders.length + 75).padStart(3, '0')}`,
        date: poDate,
        vendorName: poVendor,
        mrRef: poMrnRef,
        paymentTerm: poPaymentTerm,
        deliveryDueDate: poDeliveryDate,
        vendorRef: poVendorRef,
        totalAmount: poTotalAmount,
        status: 'Issued',
        items
      };
      setPurchaseOrders([newPO, ...purchaseOrders]);
    }
    setModalOpen(false);
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName) return;
    const newV: Vendor = {
      id: String(Date.now()),
      vendorCode: `VEND-${String(vendors.length + 1).padStart(3, '0')}`,
      name: vName,
      postBox: vPostBox || 'P.O. Box 1024',
      phone: vTelephone || '+224 620 00 00 00',
      fax: vFax,
      email: vEmail || 'sales@supplier.com',
      accountHead: vAccountHead,
      accountId: vAccountId,
      city: vCity,
      country: vCountry,
      status: 'Active'
    };
    setVendors([...vendors, newV]);
    setVName('');
    setVPostBox('');
    setVTelephone('');
    setVFax('');
    setVEmail('');
    setModalOpen(false);
  };

  // 4. Material Received Note State (steel_erp material-received-note.php)
  const [editingMrnId, setEditingMrnId] = useState<string | null>(null);
  const [mrnReference, setMrnReference] = useState('');
  const [mrnDate, setMrnDate] = useState('18-Nov-2026');
  const [mrnVendor, setMrnVendor] = useState('');
  const [mrnPurchaseOrder, setMrnPurchaseOrder] = useState('');
  const [mrnDeliveryNote, setMrnDeliveryNote] = useState('');
  const [mrnMrRef, setMrnMrRef] = useState('');
  const [mrnPaymentTerm, setMrnPaymentTerm] = useState('30 Days Net');
  const [mrnRows, setMrnRows] = useState<
    Array<{
      id: string;
      salesOrderNo: string;
      productId: string;
      productDescription: string;
      unit: string;
      orderQty: number;
      deliveredQty: number;
      currentDelivery: number;
      rate: number;
      amount: number;
    }>
  >([
    {
      id: '1',
      salesOrderNo: '',
      productId: '',
      productDescription: '',
      unit: '',
      orderQty: 0,
      deliveredQty: 0,
      currentDelivery: 0,
      rate: 0,
      amount: 0
    }
  ]);
  const [viewMrnModalOpen, setViewMrnModalOpen] = useState(false);
  const [selectedMrn, setSelectedMrn] = useState<MaterialReceivedNote | null>(null);

  // MRN Handlers
  const openAddMrnModal = () => {
    setEditingMrnId(null);
    setMrnReference(`MRN-2026-${String(mrns.length + 69).padStart(3, '0')}`);
    setMrnDate('18-Nov-2026');
    setMrnVendor('');
    setMrnPurchaseOrder('');
    setMrnDeliveryNote('');
    setMrnMrRef('');
    setMrnPaymentTerm('30 Days Net');
    setMrnRows([
      {
        id: '1',
        salesOrderNo: '',
        productId: '',
        productDescription: '',
        unit: '',
        orderQty: 0,
        deliveredQty: 0,
        currentDelivery: 0,
        rate: 0,
        amount: 0
      }
    ]);
    setModalType('AddMRN');
    setModalOpen(true);
  };

  const openEditMrnModal = (m: MaterialReceivedNote) => {
    setEditingMrnId(m.id);
    setMrnReference(m.mrnNo);
    setMrnDate(m.date);
    setMrnVendor(m.vendorName);
    setMrnPurchaseOrder(m.poRef);
    setMrnDeliveryNote(m.deliveryNote || '');
    setMrnMrRef(m.mrRef || '');
    setMrnPaymentTerm(m.paymentTerm || '30 Days Net');
    if (m.items && m.items.length > 0) {
      setMrnRows(
        m.items.map((it, idx) => ({
          id: it.id || String(idx + 1),
          salesOrderNo: it.salesOrderNo || '',
          productId: it.productId || '',
          productDescription: it.productDescription || '',
          unit: it.unit || '',
          orderQty: it.orderQty || 0,
          deliveredQty: it.deliveredQty || 0,
          currentDelivery: it.currentDelivery || 0,
          rate: it.rate || 0,
          amount: it.amount || 0
        }))
      );
    } else {
      setMrnRows([
        {
          id: '1',
          salesOrderNo: '',
          productId: '',
          productDescription: 'Procurement Materials',
          unit: 'Lot',
          orderQty: 1,
          deliveredQty: 0,
          currentDelivery: 1,
          rate: m.amount || 0,
          amount: m.amount || 0
        }
      ]);
    }
    setModalType('AddMRN');
    setModalOpen(true);
  };

  const handleMrnPurchaseOrderChange = (poNo: string) => {
    setMrnPurchaseOrder(poNo);
    const po = purchaseOrders.find((p) => p.poNo === poNo);
    if (po) {
      if (!mrnVendor) setMrnVendor(po.vendorName);
      setMrnPaymentTerm(po.paymentTerm || '30 Days Net');
      setMrnMrRef(po.mrRef || '');
      if (po.items && po.items.length > 0) {
        setMrnRows(
          po.items.map((it, idx) => ({
            id: String(idx + 1),
            salesOrderNo: it.salesOrderNo || '',
            productId: it.productId || '',
            productDescription: it.productDescription,
            unit: it.unit,
            orderQty: it.quantity,
            deliveredQty: 0,
            currentDelivery: it.quantity,
            rate: it.rate,
            amount: it.amount
          }))
        );
      }
    }
  };

  const handleMrnProductChange = (index: number, prodId: string) => {
    const prod = initialProducts.find((p) => p.id === prodId || p.code === prodId);
    setMrnRows((prev) => {
      const updated = [...prev];
      const rate = prod ? prod.costPrice : updated[index].rate;
      const cur = updated[index].currentDelivery;
      updated[index] = {
        ...updated[index],
        productId: prodId,
        productDescription: prod ? prod.name : '',
        unit: prod ? prod.unit : updated[index].unit,
        rate,
        amount: cur * rate
      };
      return updated;
    });
  };

  const handleMrnRowChange = (
    index: number,
    field: 'salesOrderNo' | 'productDescription' | 'unit' | 'orderQty' | 'deliveredQty' | 'currentDelivery' | 'rate',
    value: any
  ) => {
    setMrnRows((prev) => {
      const updated = [...prev];
      const r = { ...updated[index], [field]: value };
      const cur = field === 'currentDelivery' ? Number(value) || 0 : r.currentDelivery;
      const rt = field === 'rate' ? Number(value) || 0 : r.rate;
      r.amount = Math.round(cur * rt * 100) / 100;
      updated[index] = r;
      return updated;
    });
  };

  const handleAddMrnRow = () => {
    setMrnRows((prev) => [
      ...prev,
      {
        id: String(Date.now() + Math.random()),
        salesOrderNo: '',
        productId: '',
        productDescription: '',
        unit: '',
        orderQty: 0,
        deliveredQty: 0,
        currentDelivery: 0,
        rate: 0,
        amount: 0
      }
    ]);
  };

  const handleRemoveMrnRow = (index: number) => {
    if (mrnRows.length === 1) return;
    setMrnRows(mrnRows.filter((_, i) => i !== index));
  };

  const mrnTotalAmount = mrnRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const handleSaveMRN = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mrnVendor) return;

    const items: MaterialReceivedNoteItem[] = mrnRows.map((r, idx) => ({
      id: r.id,
      slNo: idx + 1,
      salesOrderNo: r.salesOrderNo,
      productId: r.productId,
      productDescription: r.productDescription,
      unit: r.unit,
      orderQty: Number(r.orderQty) || 0,
      deliveredQty: Number(r.deliveredQty) || 0,
      currentDelivery: Number(r.currentDelivery) || 0,
      rate: Number(r.rate) || 0,
      amount: Number(r.amount) || 0
    }));

    if (editingMrnId) {
      setMrns(
        mrns.map((m) =>
          m.id === editingMrnId
            ? {
                ...m,
                mrnNo: mrnReference,
                date: mrnDate,
                vendorName: mrnVendor,
                poRef: mrnPurchaseOrder,
                deliveryNote: mrnDeliveryNote,
                mrRef: mrnMrRef,
                paymentTerm: mrnPaymentTerm,
                amount: mrnTotalAmount,
                items
              }
            : m
        )
      );
    } else {
      const newMRN: MaterialReceivedNote = {
        id: String(Date.now()),
        mrnNo: mrnReference || `MRN-2026-${String(mrns.length + 69).padStart(3, '0')}`,
        date: mrnDate,
        vendorName: mrnVendor,
        poRef: mrnPurchaseOrder,
        deliveryNote: mrnDeliveryNote,
        mrRef: mrnMrRef,
        paymentTerm: mrnPaymentTerm,
        amount: mrnTotalAmount,
        status: 'Verified',
        items
      };
      setMrns([newMRN, ...mrns]);
    }
    setModalOpen(false);
  };

  // 5. Purchase Voucher State (steel_erp purchase-voucher.php without Contact Person)
  const [editingPvId, setEditingPvId] = useState<string | null>(null);
  const [pvReference, setPvReference] = useState('');
  const [pvDate, setPvDate] = useState('18-Nov-2026');
  const [pvVendor, setPvVendor] = useState('');
  const [pvVendorInvRef, setPvVendorInvRef] = useState('');
  const [pvPaymentTerm, setPvPaymentTerm] = useState('30 Days Net');
  const [pvPurchaseOrder, setPvPurchaseOrder] = useState('');
  const [pvRows, setPvRows] = useState<
    Array<{
      id: string;
      salesOrderNo: string;
      productId: string;
      productDescription: string;
      debitAccount: string;
      quantity: number;
      unit: string;
      rate: number;
      discount: number;
      amount: number;
    }>
  >([
    {
      id: '1',
      salesOrderNo: '',
      productId: '',
      productDescription: '',
      debitAccount: 'Cost of Goods Sold - Raw Materials',
      quantity: 0,
      unit: '',
      rate: 0,
      discount: 0,
      amount: 0
    }
  ]);
  const [viewPvModalOpen, setViewPvModalOpen] = useState(false);
  const [selectedPv, setSelectedPv] = useState<PurchaseVoucher | null>(null);

  // PV Handlers
  const openAddPvModal = () => {
    setEditingPvId(null);
    setPvReference(`PVCH-2026-${String(purchaseVouchers.length + 56).padStart(3, '0')}`);
    setPvDate('18-Nov-2026');
    setPvVendor('');
    setPvVendorInvRef('');
    setPvPaymentTerm('30 Days Net');
    setPvPurchaseOrder('');
    setPvRows([
      {
        id: '1',
        salesOrderNo: '',
        productId: '',
        productDescription: '',
        debitAccount: 'Cost of Goods Sold - Raw Materials',
        quantity: 0,
        unit: '',
        rate: 0,
        discount: 0,
        amount: 0
      }
    ]);
    setModalType('AddPV');
    setModalOpen(true);
  };

  const openEditPvModal = (pv: PurchaseVoucher) => {
    setEditingPvId(pv.id);
    setPvReference(pv.pvNo);
    setPvDate(pv.date);
    setPvVendor(pv.vendorName);
    setPvVendorInvRef(pv.vendorInvoiceNo || '');
    setPvPaymentTerm(pv.paymentTerm || '30 Days Net');
    setPvPurchaseOrder(pv.poRef || '');
    if (pv.items && pv.items.length > 0) {
      setPvRows(
        pv.items.map((it, idx) => ({
          id: it.id || String(idx + 1),
          salesOrderNo: it.salesOrderNo || '',
          productId: it.productId || '',
          productDescription: it.productDescription || '',
          debitAccount: it.debitAccount || 'Cost of Goods Sold - Raw Materials',
          quantity: it.quantity || 0,
          unit: it.unit || '',
          rate: it.rate || 0,
          discount: it.discount || 0,
          amount: it.amount || 0
        }))
      );
    } else {
      setPvRows([
        {
          id: '1',
          salesOrderNo: '',
          productId: '',
          productDescription: 'Procurement Items',
          debitAccount: 'Cost of Goods Sold - Raw Materials',
          quantity: 1,
          unit: 'Lot',
          rate: pv.totalAmount,
          discount: 0,
          amount: pv.totalAmount
        }
      ]);
    }
    setModalType('AddPV');
    setModalOpen(true);
  };

  const handlePvPurchaseOrderChange = (poNo: string) => {
    setPvPurchaseOrder(poNo);
    const po = purchaseOrders.find((p) => p.poNo === poNo);
    if (po) {
      if (!pvVendor) setPvVendor(po.vendorName);
      setPvPaymentTerm(po.paymentTerm || '30 Days Net');
      setPvVendorInvRef(po.vendorRef || '');
      if (po.items && po.items.length > 0) {
        setPvRows(
          po.items.map((it, idx) => ({
            id: String(idx + 1),
            salesOrderNo: it.salesOrderNo || '',
            productId: it.productId || '',
            productDescription: it.productDescription,
            debitAccount: 'Cost of Goods Sold - Raw Materials',
            quantity: it.quantity,
            unit: it.unit,
            rate: it.rate,
            discount: it.discount,
            amount: it.amount
          }))
        );
      }
    }
  };

  const handlePvProductChange = (index: number, prodId: string) => {
    const prod = initialProducts.find((p) => p.id === prodId || p.code === prodId);
    setPvRows((prev) => {
      const updated = [...prev];
      const rate = prod ? prod.costPrice : updated[index].rate;
      const qty = updated[index].quantity;
      const discount = updated[index].discount;
      const amount = Math.round(qty * rate * (1 - discount / 100) * 100) / 100;
      updated[index] = {
        ...updated[index],
        productId: prodId,
        productDescription: prod ? prod.name : '',
        unit: prod ? prod.unit : updated[index].unit,
        rate,
        amount
      };
      return updated;
    });
  };

  const handlePvRowChange = (
    index: number,
    field: 'salesOrderNo' | 'productDescription' | 'debitAccount' | 'quantity' | 'unit' | 'rate' | 'discount',
    value: any
  ) => {
    setPvRows((prev) => {
      const updated = [...prev];
      const r = { ...updated[index], [field]: value };
      const q = field === 'quantity' ? Number(value) || 0 : r.quantity;
      const rt = field === 'rate' ? Number(value) || 0 : r.rate;
      const d = field === 'discount' ? Number(value) || 0 : r.discount;
      r.amount = Math.round(q * rt * (1 - d / 100) * 100) / 100;
      updated[index] = r;
      return updated;
    });
  };

  const handleAddPvRow = () => {
    setPvRows((prev) => [
      ...prev,
      {
        id: String(Date.now() + Math.random()),
        salesOrderNo: '',
        productId: '',
        productDescription: '',
        debitAccount: 'Cost of Goods Sold - Raw Materials',
        quantity: 0,
        unit: '',
        rate: 0,
        discount: 0,
        amount: 0
      }
    ]);
  };

  const handleRemovePvRow = (index: number) => {
    if (pvRows.length === 1) return;
    setPvRows(pvRows.filter((_, i) => i !== index));
  };

  const pvTotalAmount = pvRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const handleSavePV = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pvVendor) return;

    const items: PurchaseVoucherItem[] = pvRows.map((r, idx) => ({
      id: r.id,
      slNo: idx + 1,
      salesOrderNo: r.salesOrderNo,
      productId: r.productId,
      productDescription: r.productDescription,
      debitAccount: r.debitAccount,
      quantity: Number(r.quantity) || 0,
      unit: r.unit,
      rate: Number(r.rate) || 0,
      discount: Number(r.discount) || 0,
      amount: Number(r.amount) || 0
    }));

    if (editingPvId) {
      setPurchaseVouchers(
        purchaseVouchers.map((pv) =>
          pv.id === editingPvId
            ? {
                ...pv,
                pvNo: pvReference,
                date: pvDate,
                vendorName: pvVendor,
                vendorInvoiceNo: pvVendorInvRef,
                paymentTerm: pvPaymentTerm,
                poRef: pvPurchaseOrder,
                totalAmount: pvTotalAmount,
                items
              }
            : pv
        )
      );
    } else {
      const newPV: PurchaseVoucher = {
        id: String(Date.now()),
        pvNo: pvReference || `PVCH-2026-${String(purchaseVouchers.length + 56).padStart(3, '0')}`,
        date: pvDate,
        vendorName: pvVendor,
        vendorInvoiceNo: pvVendorInvRef || 'VINV-001',
        paymentTerm: pvPaymentTerm,
        poRef: pvPurchaseOrder,
        totalAmount: pvTotalAmount,
        dueDate: '30-Dec-2026',
        status: 'Unpaid',
        items
      };
      setPurchaseVouchers([newPV, ...purchaseVouchers]);
    }
    setModalOpen(false);
  };

  // 6. Purchase Return State (steel_erp purchase-return.php without Contact Person)
  const [editingPrId, setEditingPrId] = useState<string | null>(null);
  const [prReference, setPrReference] = useState('');
  const [prDate, setPrDate] = useState('18-Nov-2026');
  const [prVendor, setPrVendor] = useState('');
  const [prVendorInvRef, setPrVendorInvRef] = useState('');
  const [prLpoRef, setPrLpoRef] = useState('');
  const [prPaymentTerm, setPrPaymentTerm] = useState('30 Days Net');
  const [prVendorReff, setPrVendorReff] = useState('');
  const [prReason, setPrReason] = useState('');
  const [prRows, setPrRows] = useState<
    Array<{
      id: string;
      selected: boolean;
      salesOrderNo: string;
      productId: string;
      productDescription: string;
      creditAccount: string;
      quantity: number;
      maxQty: number;
      unit: string;
      rate: number;
      discount: number;
      amount: number;
    }>
  >([]);
  const [viewPrModalOpen, setViewPrModalOpen] = useState(false);
  const [selectedPr, setSelectedPr] = useState<PurchaseReturn | null>(null);

  // PR Handlers
  const openAddPrModal = () => {
    setEditingPrId(null);
    setPrReference(`PR-2026-${String(purchaseReturns.length + 5).padStart(3, '0')}`);
    setPrDate('18-Nov-2026');
    setPrVendor('');
    setPrVendorInvRef('');
    setPrLpoRef('');
    setPrPaymentTerm('30 Days Net');
    setPrVendorReff('');
    setPrReason('');
    setPrRows([]);
    setModalType('AddPR');
    setModalOpen(true);
  };

  const openEditPrModal = (pr: PurchaseReturn) => {
    setEditingPrId(pr.id);
    setPrReference(pr.vendorRef || pr.prNo);
    setPrDate(pr.date);
    setPrVendor(pr.vendorName);
    setPrVendorInvRef(pr.vendorInvRef || '');
    setPrLpoRef(pr.lpoRef || '');
    setPrPaymentTerm(pr.paymentTerm || '30 Days Net');
    setPrVendorReff(pr.vendorRef || '');
    setPrReason(pr.reason || '');

    const pv = purchaseVouchers.find((v) => v.vendorInvoiceNo === pr.vendorInvRef || v.pvNo === pr.vendorInvRef);
    if (pv && pv.items && pv.items.length > 0) {
      setPrRows(
        pv.items.map((it, idx) => {
          const matchedReturn = pr.items?.find(
            (item) => item.productId === it.productId || item.productDescription === it.productDescription
          );
          const isSelected = !!matchedReturn;
          const qty = matchedReturn ? matchedReturn.quantity : it.quantity;
          const rate = matchedReturn ? matchedReturn.rate : it.rate;
          const discount = matchedReturn ? matchedReturn.discount : (it.discount || 0);
          const amount = Math.round(qty * rate * (1 - discount / 100) * 100) / 100;
          return {
            id: it.id || String(idx + 1),
            selected: isSelected,
            salesOrderNo: it.salesOrderNo || '',
            productId: it.productId || '',
            productDescription: it.productDescription,
            creditAccount: matchedReturn?.creditAccount || 'Cost of Goods Sold - Raw Materials',
            quantity: qty,
            maxQty: it.quantity,
            unit: it.unit,
            rate,
            discount,
            amount
          };
        })
      );
    } else if (pr.items && pr.items.length > 0) {
      setPrRows(
        pr.items.map((it, idx) => ({
          id: it.id || String(idx + 1),
          selected: true,
          salesOrderNo: it.salesOrderNo || '',
          productId: it.productId || '',
          productDescription: it.productDescription || '',
          creditAccount: it.creditAccount || 'Cost of Goods Sold - Raw Materials',
          quantity: it.quantity || 0,
          maxQty: it.maxQty || it.quantity || 9999,
          unit: it.unit || '',
          rate: it.rate || 0,
          discount: it.discount || 0,
          amount: it.amount || 0
        }))
      );
    } else {
      setPrRows([]);
    }
    setModalType('AddPR');
    setModalOpen(true);
  };

  const handlePrVendorChange = (vendorName: string) => {
    setPrVendor(vendorName);
    const vendorVouchers = purchaseVouchers.filter((v) => v.vendorName === vendorName);
    if (vendorVouchers.length === 1) {
      handlePrVendorInvRefChange(vendorVouchers[0].vendorInvoiceNo);
    } else {
      setPrVendorInvRef('');
      setPrLpoRef('');
      setPrVendorReff('');
      setPrRows([]);
    }
  };

  const handlePrVendorInvRefChange = (invNo: string) => {
    setPrVendorInvRef(invNo);
    const pv = purchaseVouchers.find((v) => v.pvNo === invNo || v.vendorInvoiceNo === invNo);
    if (pv) {
      setPrVendor(pv.vendorName);
      setPrLpoRef(pv.poRef);
      setPrPaymentTerm(pv.paymentTerm || '30 Days Net');
      setPrVendorReff(pv.vendorInvoiceNo);
      if (pv.items && pv.items.length > 0) {
        setPrRows(
          pv.items.map((it, idx) => {
            const amount = Math.round(it.quantity * it.rate * (1 - (it.discount || 0) / 100) * 100) / 100;
            return {
              id: it.id || String(idx + 1),
              selected: false,
              salesOrderNo: it.salesOrderNo || '',
              productId: it.productId || '',
              productDescription: it.productDescription,
              creditAccount: 'Cost of Goods Sold - Raw Materials',
              quantity: it.quantity,
              maxQty: it.quantity,
              unit: it.unit,
              rate: it.rate,
              discount: it.discount || 0,
              amount
            };
          })
        );
      } else {
        setPrRows([]);
      }
    } else {
      setPrRows([]);
    }
  };

  const handleTogglePrRow = (index: number) => {
    setPrRows((prev) => {
      const updated = [...prev];
      const r = updated[index];
      const newSelected = !r.selected;
      const qty = r.quantity > 0 ? r.quantity : (r.maxQty > 0 ? r.maxQty : 1);
      const amount = Math.round(qty * r.rate * (1 - (r.discount || 0) / 100) * 100) / 100;
      updated[index] = { ...r, selected: newSelected, quantity: qty, amount };
      return updated;
    });
  };

  const allPrRowsSelected = prRows.length > 0 && prRows.every((r) => r.selected);

  const handleToggleAllPrRows = () => {
    const nextStatus = !allPrRowsSelected;
    setPrRows((prev) =>
      prev.map((r) => {
        const qty = r.quantity > 0 ? r.quantity : (r.maxQty > 0 ? r.maxQty : 1);
        const amount = Math.round(qty * r.rate * (1 - (r.discount || 0) / 100) * 100) / 100;
        return { ...r, selected: nextStatus, quantity: qty, amount };
      })
    );
  };

  const handlePrQuantityChange = (index: number, rawVal: number) => {
    setPrRows((prev) => {
      const updated = [...prev];
      const r = updated[index];
      let val = rawVal;
      if (r.maxQty && val > r.maxQty) {
        val = r.maxQty;
      }
      if (val < 0) val = 0;
      const amount = Math.round(val * r.rate * (1 - (r.discount || 0) / 100) * 100) / 100;
      updated[index] = { ...r, quantity: val, amount };
      return updated;
    });
  };

  const handlePrRowFieldChange = (
    index: number,
    field: 'creditAccount' | 'rate' | 'discount',
    value: any
  ) => {
    setPrRows((prev) => {
      const updated = [...prev];
      const r = { ...updated[index], [field]: value };
      const q = r.quantity;
      const rt = field === 'rate' ? Number(value) || 0 : r.rate;
      const d = field === 'discount' ? Number(value) || 0 : r.discount;
      r.amount = Math.round(q * rt * (1 - d / 100) * 100) / 100;
      updated[index] = r;
      return updated;
    });
  };

  const prTotalAmount = prRows
    .filter((r) => r.selected)
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const handleSavePR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prVendor) {
      alert('Please select a vendor.');
      return;
    }
    const selectedRows = prRows.filter((r) => r.selected);
    if (selectedRows.length === 0) {
      alert('Please check at least one product to return.');
      return;
    }
    const invalidQty = selectedRows.find((r) => r.quantity <= 0);
    if (invalidQty) {
      alert(`Please enter a valid return quantity (> 0) for "${invalidQty.productDescription}".`);
      return;
    }

    const items: PurchaseReturnItem[] = selectedRows.map((r, idx) => ({
      id: r.id,
      slNo: idx + 1,
      salesOrderNo: r.salesOrderNo,
      productId: r.productId,
      productDescription: r.productDescription,
      creditAccount: r.creditAccount,
      quantity: Number(r.quantity) || 0,
      maxQty: r.maxQty,
      selected: true,
      unit: r.unit,
      rate: Number(r.rate) || 0,
      discount: Number(r.discount) || 0,
      amount: Number(r.amount) || 0
    }));

    if (editingPrId) {
      setPurchaseReturns(
        purchaseReturns.map((pr) =>
          pr.id === editingPrId
            ? {
                ...pr,
                prNo: prReference,
                date: prDate,
                vendorName: prVendor,
                vendorInvRef: prVendorInvRef,
                lpoRef: prLpoRef,
                paymentTerm: prPaymentTerm,
                vendorRef: prVendorReff,
                reason: prReason,
                debitNoteAmount: prTotalAmount,
                items
              }
            : pr
        )
      );
    } else {
      const newPR: PurchaseReturn = {
        id: String(Date.now()),
        prNo: prReference || `PR-2026-${String(purchaseReturns.length + 5).padStart(3, '0')}`,
        date: prDate,
        vendorName: prVendor,
        vendorInvRef: prVendorInvRef || 'VINV-001',
        lpoRef: prLpoRef,
        paymentTerm: prPaymentTerm,
        vendorRef: prVendorReff || 'VR-001',
        reason: prReason || 'Returned to supplier',
        debitNoteAmount: prTotalAmount,
        status: 'Approved',
        items
      };
      setPurchaseReturns([newPR, ...purchaseReturns]);
    }
    setModalOpen(false);
  };

  // Sub-header tabs identical to steel_erp/app/Views/procurement/pro_sub_header.php
  const tabs = [
    { key: 'Vendor', label: 'Vendor' },
    { key: 'MaterialRequisition', label: 'Material Requisition' },
    { key: 'PurchaseOrder', label: 'Purchase Order' },
    { key: 'MaterialReceivedNote', label: 'Material Received Note' },
    { key: 'PurchaseVoucher', label: 'Purchase Voucher' },
    { key: 'PurchaseReturn', label: 'Purchase Return' }
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-purple-600" /> Procurement & Supply Chain Module
          </h1>
          <p className="text-xs text-slate-500">
            Supplier Relations, Requisitions, Purchase Orders (LPO), MRN Inspection, and Purchase Vouchers.
          </p>
        </div>
      </div>

      {/* Primary Section Switcher (steel_erp sub_header.php) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSection('Procurement')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSection === 'Procurement'
              ? 'bg-purple-600 text-white shadow-sm shadow-purple-900/20'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Procurement Operations</span>
        </button>

        <button
          onClick={() => setActiveSection('Reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSection === 'Reports'
              ? 'bg-purple-600 text-white shadow-sm shadow-purple-900/20'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Procurement Reports</span>
          <span
            className={`text - [10px] px - 1.5 py - 0.5 rounded font - semibold ${
  activeSection === 'Reports' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-700'
} `}
          >
            8 Reports
          </span>
        </button>
      </div>

{
  activeSection === 'Reports' ? (
    <ProcurementReports />
  ) : (
  <>
    {/* Sub-Header Tabs (Identical to steel_erp procurement/pro_sub_header.php) */}
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
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
                  { tab.label }
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: VENDOR (steel_erp vendor.php: Sl no | Vendor Name | Post Box | Telephone | Action) */}
          {activeTab === 'Vendor' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <button
                  onClick={() => {
                    setModalType('AddVendor');
                    setModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3" style={{ width: '40px' }}>Sl no</th>
                      <th className="px-4 py-3">Vendor Name</th>
                      <th className="px-4 py-3" style={{ width: '120px' }}>Post Box</th>
                      <th className="px-4 py-3" style={{ width: '160px' }}>Telephone</th>
                      <th className="px-4 py-3 text-center" style={{ width: '100px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vendors
                      .filter((v) =>
                        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (v.postBox && v.postBox.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .map((vend, index) => (
                        <tr key={vend.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-bold text-slate-800">{vend.name}</td>
                          <td className="px-4 py-3 text-slate-600">{vend.postBox || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{vend.phone}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => alert(`View Vendor: ${vend.name}`)}
                                className="text-slate-400 hover:text-purple-600"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => alert(`Edit Vendor: ${vend.name}`)}
                                className="text-slate-400 hover:text-amber-600"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete vendor ${vend.name}?`)) {
                                    setVendors(vendors.filter((v) => v.id !== vend.id));
                                  }
                                }}
                                className="text-slate-400 hover:text-rose-600"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: MATERIAL REQUISITION (steel_erp material-requisition.php: Sl no | Reference | Date | Actions) */}
          {activeTab === 'MaterialRequisition' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search requisitions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <button
                  onClick={openAddMrModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3" style={{ width: '50px' }}>Sl no</th>
                      <th className="px-4 py-3" style={{ width: '130px' }}>Reference</th>
                      <th className="px-4 py-3" style={{ width: '110px' }}>Date</th>
                      <th className="px-4 py-3" style={{ width: '120px' }}>Time Frame</th>
                      <th className="px-4 py-3">Assigned To</th>
                      <th className="px-4 py-3 text-center" style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requisitions
                      .filter((mr) =>
                        mr.mrNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (mr.assignedTo && mr.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (mr.department && mr.department.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .map((mr, index) => (
                        <tr key={mr.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">{mr.mrNo}</td>
                          <td className="px-4 py-3 text-slate-600">{mr.date}</td>
                          <td className="px-4 py-3 text-slate-600">{mr.timeFrame || '-'}</td>
                          <td className="px-4 py-3 text-slate-700 font-medium">{mr.assignedTo || mr.department || '-'}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedMr(mr);
                                  setViewMrModalOpen(true);
                                }}
                                className="text-slate-400 hover:text-purple-600 transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditMrModal(mr)}
                                className="text-slate-400 hover:text-amber-600 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete requisition ${mr.mrNo}?`)) {
                                    setRequisitions(requisitions.filter((r) => r.id !== mr.id));
                                  }
                                }}
                                className="text-slate-400 hover:text-rose-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PURCHASE ORDER (steel_erp purchase-order.php: Sl no | Reference | Date | Vendor | MRN Ref | Delivery Date | Amount | Actions) */}
          {activeTab === 'PurchaseOrder' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search purchase orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <button
                  onClick={openAddPoModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3" style={{ width: '40px' }}>Sl no</th>
                      <th className="px-4 py-3" style={{ width: '110px' }}>Reference</th>
                      <th className="px-4 py-3" style={{ width: '100px' }}>Date</th>
                      <th className="px-4 py-3">Vendor</th>
                      <th className="px-4 py-3" style={{ width: '110px' }}>MRN Ref</th>
                      <th className="px-4 py-3" style={{ width: '110px' }}>Delivery Date</th>
                      <th className="px-4 py-3 text-right" style={{ width: '110px' }}>Amount</th>
                      <th className="px-4 py-3 text-center" style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {purchaseOrders
                      .filter((p) =>
                        p.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.poNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (p.mrRef && p.mrRef.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .map((po, index) => (
                        <tr key={po.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">{po.poNo}</td>
                          <td className="px-4 py-3 text-slate-600">{po.date}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{po.vendorName}</td>
                          <td className="px-4 py-3 font-mono text-slate-600">{po.mrRef || '-'}</td>
                          <td className="px-4 py-3 text-slate-600">{po.deliveryDueDate || '-'}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                            ${po.totalAmount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedPo(po);
                                  setViewPoModalOpen(true);
                                }}
                                className="text-slate-400 hover:text-purple-600 transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditPoModal(po)}
                                className="text-slate-400 hover:text-amber-600 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete purchase order ${po.poNo}?`)) {
                                    setPurchaseOrders(purchaseOrders.filter((p) => p.id !== po.id));
                                  }
                                }}
                                className="text-slate-400 hover:text-rose-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: MATERIAL RECEIVED NOTE (steel_erp material-received-note.php: Sl no | Reference | Date | Vendor | Purchase Order | Amount | Actions) */}
          {activeTab === 'MaterialReceivedNote' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search material received notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <button
                  onClick={openAddMrnModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3" style={{ width: '40px' }}>Sl no</th>
                      <th className="px-4 py-3" style={{ width: '120px' }}>Reference</th>
                      <th className="px-4 py-3" style={{ width: '110px' }}>Date</th>
                      <th className="px-4 py-3">Vendor</th>
                      <th className="px-4 py-3" style={{ width: '150px' }}>Purchase Order</th>
                      <th className="px-4 py-3 text-right" style={{ width: '110px' }}>Amount</th>
                      <th className="px-4 py-3 text-center" style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mrns
                      .filter((m) =>
                        m.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        m.mrnNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        m.poRef.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((m, index) => (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">{m.mrnNo}</td>
                          <td className="px-4 py-3 text-slate-600">{m.date}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{m.vendorName}</td>
                          <td className="px-4 py-3 font-mono text-purple-700">{m.poRef}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                            ${(m.amount || 9200).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedMrn(m);
                                  setViewMrnModalOpen(true);
                                }}
                                className="text-slate-400 hover:text-purple-600 transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditMrnModal(m)}
                                className="text-slate-400 hover:text-amber-600 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete MRN ${m.mrnNo}?`)) {
                                    setMrns(mrns.filter((item) => item.id !== m.id));
                                  }
                                }}
                                className="text-slate-400 hover:text-rose-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: PURCHASE VOUCHER (steel_erp purchase-voucher.php: Sl no | Reference | Date | Vendor | Purchase Order | Total | Actions) */}
          {activeTab === 'PurchaseVoucher' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search purchase vouchers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <button
                  onClick={openAddPvModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-1.5 transition-colors"
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
                      <th className="px-4 py-3">Vendor</th>
                      <th className="px-4 py-3" style={{ width: '150px' }}>Purchase Order</th>
                      <th className="px-4 py-3 text-right" style={{ width: '120px' }}>Total</th>
                      <th className="px-4 py-3 text-center" style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {purchaseVouchers
                      .filter((pv) =>
                        pv.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        pv.pvNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        pv.poRef.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((pv, index) => (
                        <tr key={pv.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">{pv.pvNo}</td>
                          <td className="px-4 py-3 text-slate-600">{pv.date}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{pv.vendorName}</td>
                          <td className="px-4 py-3 font-mono text-purple-700">{pv.poRef}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                            ${pv.totalAmount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedPv(pv);
                                  setViewPvModalOpen(true);
                                }}
                                className="text-slate-400 hover:text-purple-600 transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditPvModal(pv)}
                                className="text-slate-400 hover:text-amber-600 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete purchase voucher ${pv.pvNo}?`)) {
                                    setPurchaseVouchers(purchaseVouchers.filter((p) => p.id !== pv.id));
                                  }
                                }}
                                className="text-slate-400 hover:text-rose-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: PURCHASE RETURN (steel_erp purchase-return.php: Sl no | Vendor Ref | Date | Vendor Name | Vendor Inv Ref | Amount | Actions) */}
          {activeTab === 'PurchaseReturn' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search purchase returns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <button
                  onClick={openAddPrModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3" style={{ width: '40px' }}>Sl no</th>
                      <th className="px-4 py-3" style={{ width: '120px' }}>Vendor Ref</th>
                      <th className="px-4 py-3" style={{ width: '110px' }}>Date</th>
                      <th className="px-4 py-3">Vendor Name</th>
                      <th className="px-4 py-3" style={{ width: '130px' }}>Vendor Inv Ref</th>
                      <th className="px-4 py-3 text-right" style={{ width: '110px' }}>Amount</th>
                      <th className="px-4 py-3 text-center" style={{ width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {purchaseReturns
                      .filter((pr) =>
                        pr.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        pr.prNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (pr.vendorRef && pr.vendorRef.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
                      .map((pr, index) => (
                        <tr key={pr.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">{pr.vendorRef || pr.prNo}</td>
                          <td className="px-4 py-3 text-slate-600">{pr.date}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{pr.vendorName}</td>
                          <td className="px-4 py-3 font-mono text-slate-600">{pr.vendorInvRef || 'VINV-001'}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-rose-600">
                            ${pr.debitNoteAmount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedPr(pr);
                                  setViewPrModalOpen(true);
                                }}
                                className="text-slate-400 hover:text-purple-600 transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditPrModal(pr)}
                                className="text-slate-400 hover:text-amber-600 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete return note ${pr.prNo}?`)) {
                                    setPurchaseReturns(purchaseReturns.filter((p) => p.id !== pr.id));
                                  }
                                }}
                                className="text-slate-400 hover:text-rose-600 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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

      {/* MODAL 1: ADD VENDOR (steel_erp add_vendor.php without Contact Person) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddVendor'}
        onClose={() => setModalOpen(false)}
        title="Create Vendor"
      >
        <form onSubmit={handleAddVendor} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor Name *</label>
              <input
                type="text"
                required
                value={vName}
                onChange={(e) => setVName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account Head</label>
              <select
                value={vAccountHead}
                onChange={(e) => setVAccountHead(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              >
                <option value="Accounts Payable">Accounts Payable</option>
                <option value="Raw Materials Suppliers">Raw Materials Suppliers</option>
                <option value="Logistics & Transport Vendors">Logistics & Transport Vendors</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account ID</label>
              <input
                type="text"
                readOnly
                value={vAccountId}
                className="w-full px-3 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Post Box No</label>
              <input
                type="text"
                value={vPostBox}
                onChange={(e) => setVPostBox(e.target.value)}
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
                value={vTelephone}
                onChange={(e) => setVTelephone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fax</label>
              <input
                type="text"
                value={vFax}
                onChange={(e) => setVFax(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={vEmail}
                onChange={(e) => setVEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={vCity}
                onChange={(e) => setVCity(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
              <input
                type="text"
                value={vCountry}
                onChange={(e) => setVCountry(e.target.value)}
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
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs"
            >
              Save Vendor
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: ADD/EDIT MATERIAL REQUISITION (steel_erp material-requisition.php) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddMR'}
        onClose={() => setModalOpen(false)}
        title={editingMrId ? 'Edit Material Requisition' : 'Material Requisition'}
        maxWidth="5xl"
      >
        <form onSubmit={handleSaveMR} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reference</label>
                <input
                  type="text"
                  readOnly
                  value={mrReference}
                  className="w-full px-3 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="text"
                  value={mrDate}
                  onChange={(e) => setMrDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Time Frame</label>
                <input
                  type="text"
                  value={mrTimeFrame}
                  onChange={(e) => setMrTimeFrame(e.target.value)}
                  placeholder="e.g. 25-Nov-2026"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned To</label>
                <select
                  value={mrAssignedTo}
                  onChange={(e) => setMrAssignedTo(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                >
                  <option value="Fabrication Plant 1">Fabrication Plant 1</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Mechanical Maintenance">Mechanical Maintenance</option>
                  <option value="Quality & Testing Lab">Quality & Testing Lab</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Items Table */}
          <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-center" style={{ width: '4%' }}>SI</th>
                  <th className="px-3 py-2" style={{ width: '18%' }}>Sales Order</th>
                  <th className="px-3 py-2" style={{ width: '48%' }}>Product Description</th>
                  <th className="px-3 py-2 text-center" style={{ width: '12%' }}>Unit</th>
                  <th className="px-3 py-2 text-center" style={{ width: '12%' }}>Qty</th>
                  <th className="px-3 py-2 text-center" style={{ width: '6%' }}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {mrRows.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-50/60">
                    <td className="px-3 py-2 text-center text-slate-500 font-medium">{idx + 1}</td>
                    <td className="px-3 py-2">
                      <select
                        value={row.salesOrderNo}
                        onChange={(e) => handleMrRowChange(idx, 'salesOrderNo', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                      >
                        <option value="">Select Sales Order</option>
                        {initialSalesOrders.map((so) => (
                          <option key={so.id} value={so.soNo}>
                            {so.soNo}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2 space-y-1">
                      <select
                        value={row.productId}
                        onChange={(e) => handleMrProductChange(idx, e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                      >
                        <option value="">Select Product</option>
                        {initialProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Product Description"
                        value={row.productDescription}
                        onChange={(e) => handleMrRowChange(idx, 'productDescription', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                        required
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="Unit"
                        value={row.unit}
                        onChange={(e) => handleMrRowChange(idx, 'unit', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-center"
                        required
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        placeholder="0"
                        value={row.quantity || ''}
                        onChange={(e) => handleMrRowChange(idx, 'quantity', Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-center font-mono"
                        required
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveMrRow(idx)}
                        disabled={mrRows.length === 1}
                        className="text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors"
                        title="Delete Row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-2 bg-slate-50 border-t border-slate-200">
              <button
                type="button"
                onClick={handleAddMrRow}
                className="px-3 py-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 bg-white hover:bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Product Row
              </button>
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
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW MODAL: MATERIAL REQUISITION (steel_erp material-requisition.php) */}
      <Modal
        isOpen={viewMrModalOpen}
        onClose={() => setViewMrModalOpen(false)}
        title="Material Requisition"
        maxWidth="4xl"
      >
        {selectedMr && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-slate-500">Reference:</span>
                  <span className="ml-2 font-mono font-bold text-slate-800">{selectedMr.mrNo}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Date:</span>
                  <span className="ml-2 text-slate-700">{selectedMr.date}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-slate-500">Time Frame:</span>
                  <span className="ml-2 text-slate-700">{selectedMr.timeFrame || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Assigned To:</span>
                  <span className="ml-2 text-slate-700">{selectedMr.assignedTo || selectedMr.department || '-'}</span>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-center" style={{ width: '5%' }}>SI</th>
                    <th className="px-3 py-2" style={{ width: '20%' }}>Sales Order</th>
                    <th className="px-3 py-2" style={{ width: '50%' }}>Product Description</th>
                    <th className="px-3 py-2 text-center" style={{ width: '12%' }}>Unit</th>
                    <th className="px-3 py-2 text-center" style={{ width: '13%' }}>Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {selectedMr.items && selectedMr.items.length > 0 ? (
                    selectedMr.items.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/60">
                        <td className="px-3 py-2 text-center text-slate-500">{idx + 1}</td>
                        <td className="px-3 py-2 font-mono text-slate-700">{item.salesOrderNo || '-'}</td>
                        <td className="px-3 py-2 text-slate-800">{item.productDescription}</td>
                        <td className="px-3 py-2 text-center text-slate-600">{item.unit}</td>
                        <td className="px-3 py-2 text-center font-mono font-semibold text-slate-800">{item.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-center text-slate-400">
                        {selectedMr.itemsSummary || 'No item details recorded'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewMrModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 3: ADD/EDIT PURCHASE ORDER (steel_erp purchase-order.php without Contact Person) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddPO'}
        onClose={() => setModalOpen(false)}
        title={editingPoId ? 'Edit Purchase Order' : 'Purchase Order'}
        maxWidth="5xl"
      >
        <form onSubmit={handleSavePO} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reference</label>
                <input
                  type="text"
                  readOnly
                  value={poReference}
                  className="w-full px-3 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="text"
                  value={poDate}
                  onChange={(e) => setPoDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor Name *</label>
                <select
                  required
                  value={poVendor}
                  onChange={(e) => setPoVendor(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="" disabled>Select Vendor</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">MRN Ref</label>
                <select
                  value={poMrnRef}
                  onChange={(e) => handlePoMrnRefChange(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                >
                  <option value="">Select MRN Ref</option>
                  {requisitions.map((r) => (
                    <option key={r.id} value={r.mrNo}>{r.mrNo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Term</label>
                <input
                  type="text"
                  value={poPaymentTerm}
                  onChange={(e) => setPoPaymentTerm(e.target.value)}
                  placeholder="e.g. 30 Days Net"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Date</label>
                <input
                  type="text"
                  value={poDeliveryDate}
                  onChange={(e) => setPoDeliveryDate(e.target.value)}
                  placeholder="e.g. 30-Nov-2026"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor Ref</label>
                <input
                  type="text"
                  value={poVendorRef}
                  onChange={(e) => setPoVendorRef(e.target.value)}
                  placeholder="e.g. GMC-QUOT-902"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          {/* Product Items Table */}
          <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-2 py-2 text-center" style={{ width: '4%' }}>SI</th>
                  <th className="px-2 py-2" style={{ width: '13%' }}>Sales Order</th>
                  <th className="px-2 py-2" style={{ width: '31%' }}>Product Description</th>
                  <th className="px-2 py-2 text-center" style={{ width: '8%' }}>Unit</th>
                  <th className="px-2 py-2 text-center" style={{ width: '8%' }}>Qty</th>
                  <th className="px-2 py-2 text-right" style={{ width: '12%' }}>Rate</th>
                  <th className="px-2 py-2 text-right" style={{ width: '8%' }}>Discount</th>
                  <th className="px-2 py-2 text-right" style={{ width: '11%' }}>Amount</th>
                  <th className="px-2 py-2 text-center" style={{ width: '5%' }}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {poRows.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-50/60">
                    <td className="px-2 py-2 text-center text-slate-500 font-medium">{idx + 1}</td>
                    <td className="px-2 py-2">
                      <select
                        value={row.salesOrderNo}
                        onChange={(e) => handlePoRowChange(idx, 'salesOrderNo', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                      >
                        <option value="">Select SO</option>
                        {initialSalesOrders.map((so) => (
                          <option key={so.id} value={so.soNo}>
                            {so.soNo}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2 space-y-1">
                      <select
                        value={row.productId}
                        onChange={(e) => handlePoProductChange(idx, e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                      >
                        <option value="">Select Product</option>
                        {initialProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Product Description"
                        value={row.productDescription}
                        onChange={(e) => handlePoRowChange(idx, 'productDescription', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                        required
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        placeholder="Unit"
                        value={row.unit}
                        onChange={(e) => handlePoRowChange(idx, 'unit', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-center"
                        required
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        placeholder="0"
                        value={row.quantity || ''}
                        onChange={(e) => handlePoRowChange(idx, 'quantity', Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-center font-mono"
                        required
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        step="any"
                        placeholder="0.00"
                        value={row.rate || ''}
                        onChange={(e) => handlePoRowChange(idx, 'rate', Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-right font-mono"
                        required
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        step="any"
                        placeholder="0"
                        value={row.discount || ''}
                        onChange={(e) => handlePoRowChange(idx, 'discount', Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-right font-mono"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        readOnly
                        value={`$${(row.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        className="w-full px-2 py-1 text-xs bg-slate-100 border border-slate-200 rounded text-right font-mono font-bold text-slate-800"
                      />
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemovePoRow(idx)}
                        disabled={poRows.length === 1}
                        className="text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors"
                        title="Delete Row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-2 bg-slate-50 border-t border-slate-200">
              <button
                type="button"
                onClick={handleAddPoRow}
                className="px-3 py-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 bg-white hover:bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Product Row
              </button>
            </div>
          </div>

          {/* PO Total Table (steel_erp total_table) */}
          <div className="flex justify-end">
            <div className="w-64 border border-slate-300 rounded-lg overflow-hidden bg-white">
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
                <span className="font-semibold text-slate-700 text-xs">Total:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  ${poTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW MODAL: PURCHASE ORDER (steel_erp purchase-order.php) */}
      <Modal
        isOpen={viewPoModalOpen}
        onClose={() => setViewPoModalOpen(false)}
        title="Purchase Order"
        maxWidth="4xl"
      >
        {selectedPo && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-slate-500">Reference:</span>
                  <span className="ml-2 font-mono font-bold text-slate-800">{selectedPo.poNo}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Date:</span>
                  <span className="ml-2 text-slate-700">{selectedPo.date}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Vendor:</span>
                  <span className="ml-2 font-bold text-slate-800">{selectedPo.vendorName}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-slate-500">MRN Ref:</span>
                  <span className="ml-2 font-mono text-slate-700">{selectedPo.mrRef || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Payment Term:</span>
                  <span className="ml-2 text-slate-700">{selectedPo.paymentTerm || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Delivery Date:</span>
                  <span className="ml-2 text-slate-700">{selectedPo.deliveryDueDate || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Vendor Ref:</span>
                  <span className="ml-2 font-mono text-slate-700">{selectedPo.vendorRef || '-'}</span>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-center" style={{ width: '4%' }}>SI</th>
                    <th className="px-3 py-2" style={{ width: '14%' }}>Sales Order</th>
                    <th className="px-3 py-2" style={{ width: '32%' }}>Product Description</th>
                    <th className="px-3 py-2 text-center" style={{ width: '8%' }}>Unit</th>
                    <th className="px-3 py-2 text-center" style={{ width: '8%' }}>Qty</th>
                    <th className="px-3 py-2 text-right" style={{ width: '11%' }}>Rate</th>
                    <th className="px-3 py-2 text-right" style={{ width: '8%' }}>Discount</th>
                    <th className="px-3 py-2 text-right" style={{ width: '15%' }}>Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {selectedPo.items && selectedPo.items.length > 0 ? (
                    selectedPo.items.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/60">
                        <td className="px-3 py-2 text-center text-slate-500">{idx + 1}</td>
                        <td className="px-3 py-2 font-mono text-slate-700">{item.salesOrderNo || '-'}</td>
                        <td className="px-3 py-2 text-slate-800">{item.productDescription}</td>
                        <td className="px-3 py-2 text-center text-slate-600">{item.unit}</td>
                        <td className="px-3 py-2 text-center font-mono font-semibold text-slate-800">{item.quantity}</td>
                        <td className="px-3 py-2 text-right font-mono text-slate-700">${item.rate.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right font-mono text-slate-600">{item.discount}%</td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">${item.amount.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-3 py-4 text-center text-slate-400">
                        Total PO Amount: ${selectedPo.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-64 border border-slate-300 rounded-lg overflow-hidden bg-white">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50">
                  <span className="font-semibold text-slate-700 text-xs">Total:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ${selectedPo.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewPoModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 4: ADD/EDIT MATERIAL RECEIVED NOTE (steel_erp material-received-note.php) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddMRN'}
        onClose={() => setModalOpen(false)}
        title={editingMrnId ? 'Edit Material Received Note' : 'Material Received Note'}
        maxWidth="5xl"
      >
        <form onSubmit={handleSaveMRN} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reference</label>
                <input
                  type="text"
                  readOnly
                  value={mrnReference}
                  className="w-full px-3 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="text"
                  value={mrnDate}
                  onChange={(e) => setMrnDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor Name *</label>
                <select
                  required
                  value={mrnVendor}
                  onChange={(e) => setMrnVendor(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="" disabled>Select Vendor</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Purchase Order</label>
                <select
                  value={mrnPurchaseOrder}
                  onChange={(e) => handleMrnPurchaseOrderChange(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                >
                  <option value="">Select Purchase Order</option>
                  {purchaseOrders.map((po) => (
                    <option key={po.id} value={po.poNo}>{po.poNo}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Note</label>
                <input
                  type="text"
                  value={mrnDeliveryNote}
                  onChange={(e) => setMrnDeliveryNote(e.target.value)}
                  placeholder="e.g. DN-GIG-8821"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">MR Ref</label>
                <input
                  type="text"
                  value={mrnMrRef}
                  onChange={(e) => setMrnMrRef(e.target.value)}
                  placeholder="e.g. MR-2026-052"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Term</label>
                <input
                  type="text"
                  value={mrnPaymentTerm}
                  onChange={(e) => setMrnPaymentTerm(e.target.value)}
                  placeholder="e.g. 30 Days Net"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          {/* MRN Product Items Table (steel_erp material-received-note.php) */}
          <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-2 py-2 text-center" style={{ width: '4%' }}>SI</th>
                  <th className="px-2 py-2" style={{ width: '14%' }}>Sales Order</th>
                  <th className="px-2 py-2" style={{ width: '36%' }}>Product Description</th>
                  <th className="px-2 py-2 text-center" style={{ width: '8%' }}>Unit</th>
                  <th className="px-2 py-2 text-center" style={{ width: '9%' }}>Order Qty</th>
                  <th className="px-2 py-2 text-center" style={{ width: '9%' }}>Delivered Qty</th>
                  <th className="px-2 py-2 text-center" style={{ width: '14%' }}>Current Delivery</th>
                  <th className="px-2 py-2 text-center" style={{ width: '6%' }}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {mrnRows.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-50/60">
                    <td className="px-2 py-2 text-center text-slate-500 font-medium">{idx + 1}</td>
                    <td className="px-2 py-2">
                      <select
                        value={row.salesOrderNo}
                        onChange={(e) => handleMrnRowChange(idx, 'salesOrderNo', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                      >
                        <option value="">Select SO</option>
                        {initialSalesOrders.map((so) => (
                          <option key={so.id} value={so.soNo}>
                            {so.soNo}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2 space-y-1">
                      <select
                        value={row.productId}
                        onChange={(e) => handleMrnProductChange(idx, e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                      >
                        <option value="">Select Product</option>
                        {initialProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Product Description"
                        value={row.productDescription}
                        onChange={(e) => handleMrnRowChange(idx, 'productDescription', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                        required
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        placeholder="Unit"
                        value={row.unit}
                        onChange={(e) => handleMrnRowChange(idx, 'unit', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-center"
                        required
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        placeholder="0"
                        value={row.orderQty || ''}
                        onChange={(e) => handleMrnRowChange(idx, 'orderQty', Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-center font-mono"
                        required
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        placeholder="0"
                        value={row.deliveredQty || ''}
                        onChange={(e) => handleMrnRowChange(idx, 'deliveredQty', Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-center font-mono"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        placeholder="0"
                        value={row.currentDelivery || ''}
                        onChange={(e) => handleMrnRowChange(idx, 'currentDelivery', Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-purple-300 bg-purple-50/30 rounded text-center font-mono font-bold text-purple-900"
                        required
                      />
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveMrnRow(idx)}
                        disabled={mrnRows.length === 1}
                        className="text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors"
                        title="Delete Row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-2 bg-slate-50 border-t border-slate-200">
              <button
                type="button"
                onClick={handleAddMrnRow}
                className="px-3 py-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 bg-white hover:bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Product Row
              </button>
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
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW MODAL: MATERIAL RECEIVED NOTE (steel_erp material-received-note.php) */}
      <Modal
        isOpen={viewMrnModalOpen}
        onClose={() => setViewMrnModalOpen(false)}
        title="Material Received Note"
        maxWidth="4xl"
      >
        {selectedMrn && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-slate-500">Reference:</span>
                  <span className="ml-2 font-mono font-bold text-slate-800">{selectedMrn.mrnNo}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Date:</span>
                  <span className="ml-2 text-slate-700">{selectedMrn.date}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Vendor:</span>
                  <span className="ml-2 font-bold text-slate-800">{selectedMrn.vendorName}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Purchase Order:</span>
                  <span className="ml-2 font-mono text-purple-700">{selectedMrn.poRef}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-slate-500">Delivery Note:</span>
                  <span className="ml-2 font-mono text-slate-700">{selectedMrn.deliveryNote || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">MR Ref:</span>
                  <span className="ml-2 font-mono text-slate-700">{selectedMrn.mrRef || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Payment Term:</span>
                  <span className="ml-2 text-slate-700">{selectedMrn.paymentTerm || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Amount:</span>
                  <span className="ml-2 font-mono font-bold text-slate-900">${(selectedMrn.amount || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-center" style={{ width: '5%' }}>SI</th>
                    <th className="px-3 py-2" style={{ width: '16%' }}>Sales Order</th>
                    <th className="px-3 py-2" style={{ width: '39%' }}>Product Description</th>
                    <th className="px-3 py-2 text-center" style={{ width: '10%' }}>Unit</th>
                    <th className="px-3 py-2 text-center" style={{ width: '10%' }}>Order Qty</th>
                    <th className="px-3 py-2 text-center" style={{ width: '10%' }}>Delivered Qty</th>
                    <th className="px-3 py-2 text-center" style={{ width: '10%' }}>Current Delivery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {selectedMrn.items && selectedMrn.items.length > 0 ? (
                    selectedMrn.items.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/60">
                        <td className="px-3 py-2 text-center text-slate-500">{idx + 1}</td>
                        <td className="px-3 py-2 font-mono text-slate-700">{item.salesOrderNo || '-'}</td>
                        <td className="px-3 py-2 text-slate-800">{item.productDescription}</td>
                        <td className="px-3 py-2 text-center text-slate-600">{item.unit}</td>
                        <td className="px-3 py-2 text-center font-mono text-slate-700">{item.orderQty}</td>
                        <td className="px-3 py-2 text-center font-mono text-slate-700">{item.deliveredQty}</td>
                        <td className="px-3 py-2 text-center font-mono font-bold text-purple-700">{item.currentDelivery}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-3 py-4 text-center text-slate-400">
                        Total Amount: ${(selectedMrn.amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewMrnModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 5: ADD/EDIT PURCHASE VOUCHER (steel_erp purchase-voucher.php without Contact Person) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddPV'}
        onClose={() => setModalOpen(false)}
        title={editingPvId ? 'Edit Purchase Voucher' : 'Purchase Voucher'}
        maxWidth="5xl"
      >
        <form onSubmit={handleSavePV} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reference</label>
                <input
                  type="text"
                  readOnly
                  value={pvReference}
                  className="w-full px-3 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="text"
                  value={pvDate}
                  onChange={(e) => setPvDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor Name *</label>
                <select
                  required
                  value={pvVendor}
                  onChange={(e) => setPvVendor(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="" disabled>Select Vendor</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor Inv Ref</label>
                <input
                  type="text"
                  value={pvVendorInvRef}
                  onChange={(e) => setPvVendorInvRef(e.target.value)}
                  placeholder="e.g. GIG-INV-8891"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Term</label>
                <input
                  type="text"
                  value={pvPaymentTerm}
                  onChange={(e) => setPvPaymentTerm(e.target.value)}
                  placeholder="e.g. 30 Days Net"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Purchase Order</label>
                <select
                  value={pvPurchaseOrder}
                  onChange={(e) => handlePvPurchaseOrderChange(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                >
                  <option value="">Select Purchase Order</option>
                  {purchaseOrders.map((po) => (
                    <option key={po.id} value={po.poNo}>{po.poNo}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* PV Product Items Table (steel_erp purchase-voucher.php) */}
          <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-2 py-2 text-center" style={{ width: '4%' }}>SI</th>
                  <th className="px-2 py-2" style={{ width: '13%' }}>Sales Order</th>
                  <th className="px-2 py-2" style={{ width: '27%' }}>Product Description</th>
                  <th className="px-2 py-2" style={{ width: '18%' }}>Debit A/C</th>
                  <th className="px-2 py-2 text-center" style={{ width: '7%' }}>Qty</th>
                  <th className="px-2 py-2 text-center" style={{ width: '7%' }}>Unit</th>
                  <th className="px-2 py-2 text-right" style={{ width: '9%' }}>Rate</th>
                  <th className="px-2 py-2 text-right" style={{ width: '7%' }}>Discount</th>
                  <th className="px-2 py-2 text-right" style={{ width: '9%' }}>Amount</th>
                  <th className="px-2 py-2 text-center" style={{ width: '5%' }}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {pvRows.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-50/60">
                    <td className="px-2 py-2 text-center text-slate-500 font-medium">{idx + 1}</td>
                    <td className="px-2 py-2">
                      <select
                        value={row.salesOrderNo}
                        onChange={(e) => handlePvRowChange(idx, 'salesOrderNo', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                      >
                        <option value="">Select SO</option>
                        {initialSalesOrders.map((so) => (
                          <option key={so.id} value={so.soNo}>
                            {so.soNo}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2 space-y-1">
                      <select
                        value={row.productId}
                        onChange={(e) => handlePvProductChange(idx, e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                      >
                        <option value="">Select Product</option>
                        {initialProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Product Description"
                        value={row.productDescription}
                        onChange={(e) => handlePvRowChange(idx, 'productDescription', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                        required
                      />
                    </td>
                    <td className="px-2 py-2">
                      <select
                        value={row.debitAccount}
                        onChange={(e) => handlePvRowChange(idx, 'debitAccount', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                      >
                        <option value="Cost of Goods Sold - Raw Materials">Cost of Goods Sold - Raw Materials</option>
                        <option value="Inventory - Raw Steel">Inventory - Raw Steel</option>
                        <option value="Operational Supplies & Consumables">Operational Supplies & Consumables</option>
                        <option value="Equipment Maintenance & Spares">Equipment Maintenance & Spares</option>
                        <option value="Freight & Port Handling Expenses">Freight & Port Handling Expenses</option>
                      </select>
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        placeholder="0"
                        value={row.quantity || ''}
                        onChange={(e) => handlePvRowChange(idx, 'quantity', Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-center font-mono"
                        required
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        placeholder="Unit"
                        value={row.unit}
                        onChange={(e) => handlePvRowChange(idx, 'unit', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-center"
                        required
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        step="any"
                        placeholder="0.00"
                        value={row.rate || ''}
                        onChange={(e) => handlePvRowChange(idx, 'rate', Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-right font-mono"
                        required
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        step="any"
                        placeholder="0"
                        value={row.discount || ''}
                        onChange={(e) => handlePvRowChange(idx, 'discount', Number(e.target.value))}
                        className="w-full px-2 py-1 text-xs border border-slate-300 rounded text-right font-mono"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        readOnly
                        value={`$${(row.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        className="w-full px-2 py-1 text-xs bg-slate-100 border border-slate-200 rounded text-right font-mono font-bold text-slate-800"
                      />
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemovePvRow(idx)}
                        disabled={pvRows.length === 1}
                        className="text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors"
                        title="Delete Row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-2 bg-slate-50 border-t border-slate-200">
              <button
                type="button"
                onClick={handleAddPvRow}
                className="px-3 py-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 bg-white hover:bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Product Row
              </button>
            </div>
          </div>

          {/* PV Total Table (steel_erp total_table) */}
          <div className="flex justify-end">
            <div className="w-64 border border-slate-300 rounded-lg overflow-hidden bg-white">
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
                <span className="font-semibold text-slate-700 text-xs">Total:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  ${pvTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW MODAL: PURCHASE VOUCHER (steel_erp purchase-voucher.php) */}
      <Modal
        isOpen={viewPvModalOpen}
        onClose={() => setViewPvModalOpen(false)}
        title="Purchase Voucher"
        maxWidth="4xl"
      >
        {selectedPv && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-slate-500">Reference:</span>
                  <span className="ml-2 font-mono font-bold text-slate-800">{selectedPv.pvNo}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Date:</span>
                  <span className="ml-2 text-slate-700">{selectedPv.date}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Vendor:</span>
                  <span className="ml-2 font-bold text-slate-800">{selectedPv.vendorName}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-slate-500">Vendor Inv Ref:</span>
                  <span className="ml-2 font-mono text-slate-700">{selectedPv.vendorInvoiceNo || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Payment Term:</span>
                  <span className="ml-2 text-slate-700">{selectedPv.paymentTerm || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Purchase Order:</span>
                  <span className="ml-2 font-mono text-purple-700">{selectedPv.poRef || '-'}</span>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-center" style={{ width: '4%' }}>SI</th>
                    <th className="px-3 py-2" style={{ width: '13%' }}>Sales Order</th>
                    <th className="px-3 py-2" style={{ width: '27%' }}>Product Description</th>
                    <th className="px-3 py-2" style={{ width: '18%' }}>Debit A/C</th>
                    <th className="px-3 py-2 text-center" style={{ width: '7%' }}>Qty</th>
                    <th className="px-3 py-2 text-center" style={{ width: '7%' }}>Unit</th>
                    <th className="px-3 py-2 text-right" style={{ width: '9%' }}>Rate</th>
                    <th className="px-3 py-2 text-right" style={{ width: '6%' }}>Discount</th>
                    <th className="px-3 py-2 text-right" style={{ width: '9%' }}>Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {selectedPv.items && selectedPv.items.length > 0 ? (
                    selectedPv.items.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/60">
                        <td className="px-3 py-2 text-center text-slate-500">{idx + 1}</td>
                        <td className="px-3 py-2 font-mono text-slate-700">{item.salesOrderNo || '-'}</td>
                        <td className="px-3 py-2 text-slate-800">{item.productDescription}</td>
                        <td className="px-3 py-2 text-slate-600">{item.debitAccount || '-'}</td>
                        <td className="px-3 py-2 text-center font-mono font-semibold text-slate-800">{item.quantity}</td>
                        <td className="px-3 py-2 text-center text-slate-600">{item.unit}</td>
                        <td className="px-3 py-2 text-right font-mono text-slate-700">${item.rate.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right font-mono text-slate-600">{item.discount}%</td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-slate-900">${item.amount.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-3 py-4 text-center text-slate-400">
                        Total Amount: ${selectedPv.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-64 border border-slate-300 rounded-lg overflow-hidden bg-white">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50">
                  <span className="font-semibold text-slate-700 text-xs">Total:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    ${selectedPv.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewPvModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 6: ADD/EDIT PURCHASE RETURN (steel_erp purchase-return.php without Contact Person) */}
      <Modal
        isOpen={modalOpen && modalType === 'AddPR'}
        onClose={() => setModalOpen(false)}
        title={editingPrId ? 'Edit Purchase Return' : 'Purchase Return'}
        maxWidth="5xl"
      >
        <form onSubmit={handleSavePR} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reference</label>
                <input
                  type="text"
                  readOnly
                  value={prReference}
                  className="w-full px-3 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="text"
                  value={prDate}
                  onChange={(e) => setPrDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor Name *</label>
                <select
                  required
                  value={prVendor}
                  onChange={(e) => handlePrVendorChange(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="" disabled>Select Vendor</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor Inv Ref *</label>
                <select
                  required
                  value={prVendorInvRef}
                  onChange={(e) => handlePrVendorInvRefChange(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                >
                  <option value="">Select Vendor Invoice Ref</option>
                  {purchaseVouchers
                    .filter((pv) => !prVendor || pv.vendorName === prVendor)
                    .map((pv) => (
                      <option key={pv.id} value={pv.vendorInvoiceNo}>
                        {pv.vendorInvoiceNo} ({pv.pvNo} - {pv.vendorName})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lpo Ref</label>
                <input
                  type="text"
                  value={prLpoRef}
                  onChange={(e) => setPrLpoRef(e.target.value)}
                  placeholder="e.g. PO-2026-074"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Term</label>
                <input
                  type="text"
                  value={prPaymentTerm}
                  onChange={(e) => setPrPaymentTerm(e.target.value)}
                  placeholder="e.g. 30 Days Net"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor Reff</label>
                <input
                  type="text"
                  value={prVendorReff}
                  onChange={(e) => setPrVendorReff(e.target.value)}
                  placeholder="e.g. VREF-9921"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          {/* PR Product Items Table (steel_erp purchase-return.php: ordered products with checkboxes) */}
          <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 text-xs uppercase tracking-wider">Ordered Products for Return</span>
                {prRows.length > 0 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">
                    {prRows.filter((r) => r.selected).length} of {prRows.length} selected for return
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 italic">
                Check the products you wish to return and set return quantities
              </span>
            </div>

            {prRows.length === 0 ? (
              <div className="p-8 text-center bg-white">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">No Ordered Products Loaded</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Please select a <strong>Vendor Invoice Ref</strong> above to load the ordered products from that invoice.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2 text-center" style={{ width: '45px' }}>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-slate-500 mb-0.5">Tick</span>
                          <input
                            type="checkbox"
                            checked={allPrRowsSelected}
                            onChange={handleToggleAllPrRows}
                            className="rounded text-purple-600 focus:ring-purple-500 cursor-pointer w-3.5 h-3.5"
                            title={allPrRowsSelected ? 'Uncheck All' : 'Check All'}
                          />
                        </div>
                      </th>
                      <th className="px-2 py-2 text-center" style={{ width: '40px' }}>SI</th>
                      <th className="px-3 py-2" style={{ width: '130px' }}>Sales Order</th>
                      <th className="px-3 py-2">Product Description</th>
                      <th className="px-3 py-2 text-center" style={{ width: '120px' }}>Invoiced Qty</th>
                      <th className="px-3 py-2 text-center" style={{ width: '150px' }}>Return Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {prRows.map((row, idx) => (
                      <tr
                        key={row.id}
                        className={`transition-colors ${
                          row.selected
                            ? 'bg-purple-50/50 hover:bg-purple-50/70'
                            : 'opacity-50 bg-slate-50/40 hover:bg-slate-50'
                        }`}
                      >
                        <td className="px-3 py-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={row.selected}
                            onChange={() => handleTogglePrRow(idx)}
                            className="rounded text-purple-600 focus:ring-purple-500 cursor-pointer w-4 h-4"
                          />
                        </td>
                        <td className="px-2 py-2.5 text-center text-slate-500 font-medium">{idx + 1}</td>
                        <td className="px-3 py-2.5 font-mono text-slate-700">
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-semibold">
                            {row.salesOrderNo || '-'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-medium text-slate-800 text-xs">
                          {row.productDescription}
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold">
                            {row.maxQty} {row.unit}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <input
                              type="number"
                              disabled={!row.selected}
                              min={1}
                              max={row.maxQty}
                              value={row.quantity || ''}
                              onChange={(e) => handlePrQuantityChange(idx, Number(e.target.value))}
                              className="w-20 px-2 py-1 text-xs border border-slate-300 rounded text-center font-mono font-bold text-slate-800 disabled:bg-slate-100 disabled:text-slate-400 focus:ring-1 focus:ring-purple-500"
                              placeholder="Qty"
                            />
                            <span className="text-slate-600 font-medium text-xs">{row.unit}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Return</label>
            <textarea
              rows={2}
              value={prReason}
              onChange={(e) => setPrReason(e.target.value)}
              placeholder="Provide reason for return to supplier..."
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
            />
          </div>

          {/* PR Total Table (steel_erp total_table) */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              {prRows.length > 0 && (
                <span>
                  <strong>{prRows.filter((r) => r.selected).length}</strong> of {prRows.length} item(s) selected for return
                </span>
              )}
            </div>
            <div className="w-64 border border-slate-300 rounded-lg overflow-hidden bg-white">
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
                <span className="font-semibold text-slate-700 text-xs">Total:</span>
                <span className="font-mono font-bold text-rose-600 text-sm">
                  ${prTotalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW MODAL: PURCHASE RETURN (steel_erp purchase-return.php) */}
      <Modal
        isOpen={viewPrModalOpen}
        onClose={() => setViewPrModalOpen(false)}
        title="Purchase Return"
        maxWidth="4xl"
      >
        {selectedPr && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-slate-500">Reference:</span>
                  <span className="ml-2 font-mono font-bold text-slate-800">{selectedPr.vendorRef || selectedPr.prNo}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Date:</span>
                  <span className="ml-2 text-slate-700">{selectedPr.date}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Vendor:</span>
                  <span className="ml-2 font-bold text-slate-800">{selectedPr.vendorName}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Vendor Inv Ref:</span>
                  <span className="ml-2 font-mono text-slate-700">{selectedPr.vendorInvRef || '-'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-slate-500">Lpo Ref:</span>
                  <span className="ml-2 font-mono text-slate-700">{selectedPr.lpoRef || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Payment Term:</span>
                  <span className="ml-2 text-slate-700">{selectedPr.paymentTerm || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Vendor Reff:</span>
                  <span className="ml-2 font-mono text-slate-700">{selectedPr.vendorRef || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Reason:</span>
                  <span className="ml-2 text-slate-700">{selectedPr.reason || '-'}</span>
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-center" style={{ width: '45px' }}>SI</th>
                    <th className="px-3 py-2" style={{ width: '130px' }}>Sales Order</th>
                    <th className="px-3 py-2">Product Description</th>
                    <th className="px-3 py-2 text-center" style={{ width: '130px' }}>Returned Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {selectedPr.items && selectedPr.items.length > 0 ? (
                    selectedPr.items.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/60">
                        <td className="px-3 py-2.5 text-center text-slate-500">{idx + 1}</td>
                        <td className="px-3 py-2.5 font-mono text-slate-700">
                          <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs font-semibold">
                            {item.salesOrderNo || '-'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-slate-800 font-medium">{item.productDescription}</td>
                        <td className="px-3 py-2.5 text-center font-mono font-bold text-slate-800">
                          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded text-xs font-semibold">
                            {item.quantity} {item.unit}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-slate-400">
                        No product items recorded for this return.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-64 border border-slate-300 rounded-lg overflow-hidden bg-white">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50">
                  <span className="font-semibold text-slate-700 text-xs">Total:</span>
                  <span className="font-mono font-bold text-rose-600 text-sm">
                    ${selectedPr.debitNoteAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewPrModalOpen(false)}
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
