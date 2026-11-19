'use client';

import React, { useState } from 'react';
import {
  Printer,
  FileSpreadsheet,
  FileText,
  Search,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  MapPin,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ClipboardList,
  PackageCheck,
  ShieldCheck
} from 'lucide-react';
import {
  initialVendors,
  initialMaterialRequisitions,
  initialPurchaseOrders,
  initialMRNs,
  initialPurchaseVouchers,
  initialPurchaseReturns
} from '@/lib/mock-data';

interface ProcurementReportsProps {
  initialReport?: string;
}

export default function ProcurementReports({ initialReport = 'MaterialReqReport' }: ProcurementReportsProps) {
  const [activeReport, setActiveReport] = useState(initialReport);
  const [dateFrom, setDateFrom] = useState('2026-11-01');
  const [dateTo, setDateTo] = useState('2026-11-30');
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState('all');

  const reportTabs = [
    { key: 'MaterialReqReport', label: 'Material Requisition Report' },
    { key: 'PurchaseOrderReport', label: 'Purchase Order Report' },
    { key: 'PurchaseOrderSummaryReport', label: 'PO Summary Report' },
    { key: 'MaterialRecReport', label: 'Material Received Note (MRN)' },
    { key: 'PurchaseVoucherReport', label: 'Purchase Voucher Report' },
    { key: 'PurchaseVoucherSummaryReport', label: 'PV Summary Report' },
    { key: 'PendingPurchaseVoucherReport', label: 'Pending Purchase Voucher' },
    { key: 'PurchaseReturnReport', label: 'Purchase Return Report' }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = (title: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Procurement Reports Sub-Header Navigation (Replicated from steel_erp procurement/report_sub_header.php) */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-xs overflow-x-auto">
        <div className="flex items-center space-x-1 min-w-max">
          {reportTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveReport(tab.key);
                setSearchTerm('');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeReport === tab.key
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Top Control Bar with Filters & Action Buttons */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>From:</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span>To:</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search LPO, MRN, vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 w-44"
              />
            </div>
          </div>

          {/* Action Buttons: Print, Excel, PDF (Identical style to steel_erp) */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              title="Print Report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => {
                handleExportCsv(activeReport, ['Ref', 'Vendor', 'Amount'], [['PO-001', 'Global Metals', 84000]]);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              title="Export Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              title="Download PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* REPORT CONTENT BODY */}
        <div className="p-5">
          {/* 1. MATERIAL REQUISITION REPORT */}
          {activeReport === 'MaterialReqReport' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Material Requisition (MR) Register Report</h2>
                <p className="text-xs text-slate-500">Internal requisitions raised across workshops, sites, and project engineering</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">MR Number</th>
                      <th className="px-4 py-2.5 font-sans">Date</th>
                      <th className="px-4 py-2.5 font-sans">Department / Workshop</th>
                      <th className="px-4 py-2.5 font-sans">Requested By</th>
                      <th className="px-4 py-2.5 font-sans">Items Required Summary</th>
                      <th className="px-4 py-2.5 font-sans">Priority</th>
                      <th className="px-4 py-2.5 font-sans">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {initialMaterialRequisitions.map((mr) => (
                      <tr key={mr.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 font-mono font-bold text-purple-600">{mr.mrNo}</td>
                        <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{mr.date}</td>
                        <td className="px-4 py-2 font-medium text-slate-800">{mr.department}</td>
                        <td className="px-4 py-2 text-slate-600">{mr.requestedBy}</td>
                        <td className="px-4 py-2 text-slate-700 max-w-xs truncate">{mr.itemsSummary}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${mr.priority === 'Urgent' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                              }`}
                          >
                            {mr.priority}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            {mr.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. PURCHASE ORDER REPORT */}
          {activeReport === 'PurchaseOrderReport' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Local Purchase Order (LPO) Register Report</h2>
                <p className="text-xs text-slate-500">Official purchase orders issued to international and local suppliers</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">PO Number</th>
                      <th className="px-4 py-2.5 font-sans">Date</th>
                      <th className="px-4 py-2.5 font-sans">Vendor Name</th>
                      <th className="px-4 py-2.5 font-sans">MR Ref</th>
                      <th className="px-4 py-2.5 font-sans">Delivery Due Date</th>
                      <th className="px-4 py-2.5 text-right font-sans">Total PO Value ($)</th>
                      <th className="px-4 py-2.5 font-sans">LPO Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {initialPurchaseOrders.map((po) => (
                      <tr key={po.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 font-mono font-bold text-blue-600">{po.poNo}</td>
                        <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{po.date}</td>
                        <td className="px-4 py-2 font-medium text-slate-800">{po.vendorName}</td>
                        <td className="px-4 py-2 font-mono text-slate-600">{po.mrRef}</td>
                        <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{po.deliveryDueDate}</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">
                          ${po.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${po.status === 'Fulfilled'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                              }`}
                          >
                            {po.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold">
                      <td className="px-4 py-2.5 text-slate-900 uppercase text-xs" colSpan={5}>
                        Total Purchase Orders Commitment
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs text-purple-900 font-extrabold">$93,200</td>
                      <td className="px-4 py-2.5"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. PO SUMMARY REPORT */}
          {activeReport === 'PurchaseOrderSummaryReport' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Purchase Order Vendor Spend Summary</h2>
                <p className="text-xs text-slate-500">Aggregate procurement spend by vendor category and terms</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">Vendor Name</th>
                      <th className="px-4 py-2.5 font-sans">Category</th>
                      <th className="px-4 py-2.5 text-right font-sans">Total LPOs Issued</th>
                      <th className="px-4 py-2.5 text-right font-sans">Committed Spend ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Delivered Spend ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Pending Balance ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-800">Global Metallurgical Corp</td>
                      <td className="px-4 py-2 text-slate-500">Raw Steel Billets & Coils</td>
                      <td className="px-4 py-2 text-right font-mono">1</td>
                      <td className="px-4 py-2 text-right font-mono font-bold">$84,000</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">$0</td>
                      <td className="px-4 py-2 text-right font-mono text-amber-600 font-semibold">$84,000</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-800">Gaz Industriels de Guinée SARL</td>
                      <td className="px-4 py-2 text-slate-500">Industrial Gases & Welding</td>
                      <td className="px-4 py-2 text-right font-mono">1</td>
                      <td className="px-4 py-2 text-right font-mono font-bold">$9,200</td>
                      <td className="px-4 py-2 text-right font-mono text-emerald-600 font-semibold">$9,200</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">$0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. MATERIAL RECEIVED NOTE (MRN) REPORT */}
          {activeReport === 'MaterialRecReport' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Material Received Note (MRN) Inspection Register</h2>
                <p className="text-xs text-slate-500">Warehouse intake logs, physical count verification, and QA inspection</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">MRN Number</th>
                      <th className="px-4 py-2.5 font-sans">Date</th>
                      <th className="px-4 py-2.5 font-sans">LPO Ref</th>
                      <th className="px-4 py-2.5 font-sans">Vendor Name</th>
                      <th className="px-4 py-2.5 font-sans">Store Yard Location</th>
                      <th className="px-4 py-2.5 text-right font-sans">Accepted Pcs</th>
                      <th className="px-4 py-2.5 text-right font-sans">Rejected Pcs</th>
                      <th className="px-4 py-2.5 font-sans">Inspected By</th>
                      <th className="px-4 py-2.5 font-sans">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {initialMRNs.map((mrn) => (
                      <tr key={mrn.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 font-mono font-bold text-emerald-600">{mrn.mrnNo}</td>
                        <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{mrn.date}</td>
                        <td className="px-4 py-2 font-mono text-blue-600">{mrn.poRef}</td>
                        <td className="px-4 py-2 font-medium text-slate-800">{mrn.vendorName}</td>
                        <td className="px-4 py-2 text-slate-600">{mrn.storeLocation}</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-emerald-600">{mrn.acceptedItems}</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-slate-400">{mrn.rejectedItems}</td>
                        <td className="px-4 py-2 text-slate-600">{mrn.inspectedBy}</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            {mrn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. PURCHASE VOUCHER REPORT */}
          {activeReport === 'PurchaseVoucherReport' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Purchase Voucher (PV) Ledger Register</h2>
                <p className="text-xs text-slate-500">Commercial supplier vouchers recognized in trade accounts payable</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">PV Number</th>
                      <th className="px-4 py-2.5 font-sans">Date</th>
                      <th className="px-4 py-2.5 font-sans">Vendor Name</th>
                      <th className="px-4 py-2.5 font-sans">Supplier Bill No</th>
                      <th className="px-4 py-2.5 font-sans">LPO Ref</th>
                      <th className="px-4 py-2.5 font-sans">Due Date</th>
                      <th className="px-4 py-2.5 text-right font-sans">Voucher Value ($)</th>
                      <th className="px-4 py-2.5 font-sans">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {initialPurchaseVouchers.map((pv) => (
                      <tr key={pv.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 font-mono font-bold text-purple-600">{pv.pvNo}</td>
                        <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{pv.date}</td>
                        <td className="px-4 py-2 font-medium text-slate-800">{pv.vendorName}</td>
                        <td className="px-4 py-2 font-mono text-slate-600">{pv.vendorInvoiceNo}</td>
                        <td className="px-4 py-2 font-mono text-blue-600">{pv.poRef}</td>
                        <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{pv.dueDate}</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">
                          ${pv.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${pv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}
                          >
                            {pv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold">
                      <td className="px-4 py-2.5 text-slate-900 uppercase text-xs" colSpan={6}>
                        Total Approved Purchase Vouchers
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs text-purple-900 font-extrabold">$14,050</td>
                      <td className="px-4 py-2.5"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 9. PURCHASE VOUCHER SUMMARY REPORT */}
          {activeReport === 'PurchaseVoucherSummaryReport' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Purchase Voucher Monthly Summary by Supplier</h2>
                <p className="text-xs text-slate-500">Cumulative voucher totals, payment releases, and balances payable</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">Vendor Name</th>
                      <th className="px-4 py-2.5 text-right font-sans">Vouchers Count</th>
                      <th className="px-4 py-2.5 text-right font-sans">Gross Billed ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Settled / Paid ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Open Payable ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-800">Gaz Industriels de Guinée SARL</td>
                      <td className="px-4 py-2 text-right font-mono">1</td>
                      <td className="px-4 py-2 text-right font-mono font-bold">$9,200</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">$0</td>
                      <td className="px-4 py-2 text-right font-mono text-rose-600 font-bold">$9,200</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-800">Quincaillerie & Outillage de Guinée</td>
                      <td className="px-4 py-2 text-right font-mono">1</td>
                      <td className="px-4 py-2 text-right font-mono font-bold">$4,850</td>
                      <td className="px-4 py-2 text-right font-mono text-emerald-600 font-semibold">$4,850</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">$0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 10. PENDING PURCHASE VOUCHER REPORT */}
          {activeReport === 'PendingPurchaseVoucherReport' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Pending Purchase Vouchers (Unbilled MRNs)</h2>
                <p className="text-xs text-slate-500">Warehouse intakes with pending commercial vendor invoices awaiting entry</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">MRN Ref</th>
                      <th className="px-4 py-2.5 font-sans">Intake Date</th>
                      <th className="px-4 py-2.5 font-sans">Vendor</th>
                      <th className="px-4 py-2.5 font-sans">LPO Ref</th>
                      <th className="px-4 py-2.5 text-right font-sans">Estimated Cost ($)</th>
                      <th className="px-4 py-2.5 font-sans">Pending Days</th>
                      <th className="px-4 py-2.5 font-sans">Action Required</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    <tr>
                      <td className="px-4 py-2 font-mono font-bold text-emerald-600">MRN-2026-067</td>
                      <td className="px-4 py-2 font-mono text-slate-500">08-Nov-2026</td>
                      <td className="px-4 py-2 font-medium text-slate-800">Quincaillerie & Outillage</td>
                      <td className="px-4 py-2 font-mono text-blue-600">PO-2026-071</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">$2,400.00</td>
                      <td className="px-4 py-2 font-mono text-amber-600 font-semibold">5 Days</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                          Request Supplier Invoice
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 11. PURCHASE RETURN REPORT */}
          {activeReport === 'PurchaseReturnReport' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Purchase Return & Debit Note Register</h2>
                <p className="text-xs text-slate-500">Defective shipments returned to supplier with debit note claims</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">Debit Note / PR No</th>
                      <th className="px-4 py-2.5 font-sans">Date</th>
                      <th className="px-4 py-2.5 font-sans">Vendor Name</th>
                      <th className="px-4 py-2.5 font-sans">PV Ref</th>
                      <th className="px-4 py-2.5 font-sans">Discrepancy / Return Reason</th>
                      <th className="px-4 py-2.5 text-right font-sans">Claim Amount ($)</th>
                      <th className="px-4 py-2.5 font-sans">Debit Note Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {initialPurchaseReturns.map((pr) => (
                      <tr key={pr.id}>
                        <td className="px-4 py-2 font-mono font-bold text-rose-600">{pr.prNo}</td>
                        <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{pr.date}</td>
                        <td className="px-4 py-2 font-medium text-slate-800">{pr.vendorName}</td>
                        <td className="px-4 py-2 font-mono text-purple-600">{pr.pvRef}</td>
                        <td className="px-4 py-2 text-slate-600">{pr.reason}</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-rose-700">
                          ${pr.debitNoteAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            {pr.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

