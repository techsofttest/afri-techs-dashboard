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
  Truck,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Building,
  PackageCheck
} from 'lucide-react';
import {
  initialCustomers,
  initialSalesQuotations,
  initialSalesOrders,
  initialDeliveryNotes,
  initialSalesInvoices,
  initialSalesReturns,
  initialProducts
} from '@/lib/mock-data';

interface CrmReportsProps {
  initialReport?: string;
}

export default function CrmReports({ initialReport = 'SalesQuotReport' }: CrmReportsProps) {
  const [activeReport, setActiveReport] = useState(initialReport);
  const [dateFrom, setDateFrom] = useState('2026-11-01');
  const [dateTo, setDateTo] = useState('2026-11-30');
  const [searchTerm, setSearchTerm] = useState('');
  const [customerFilter, setCustomerFilter] = useState('all');

  const reportTabs = [
    { key: 'SalesQuotReport', label: 'Sales Quot Report' },
    { key: 'SalesQuotAnalysisReport', label: 'Sales Quot Analysis' },
    { key: 'SalesQuotSummerReport', label: 'Sales Quot Summary' },
    { key: 'SalesOrderReport', label: 'Sales Order Report' },
    { key: 'SalesOrderSummeryReport', label: 'Sales Order Summary' },
    { key: 'SalesOrderToDn', label: 'Sales Order to DN / Cash In' },
    { key: 'DeliveryNoteReport', label: 'Delivery Note Report' },
    { key: 'DnToCreditInvoice', label: 'DN to Credit Invoice' },
    { key: 'InvoiceReport', label: 'Invoice Report' },
    { key: 'SalesReturnReport', label: 'Sales Return Report' },
    { key: 'SalesSummery', label: 'Sales Summary Report' },
    { key: 'BackLog', label: 'Backlog Report' },
    { key: 'JobProfitability', label: 'Job Profitability' },
    { key: 'JobSummery', label: 'Job Summary Report' },
    { key: 'WorkProgress', label: 'Work In Progress (WIP)' }
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
      {/* CRM Reports Sub-Header Navigation (Replicated from steel_erp crm/report_sub_header.php) */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-xs overflow-x-auto">
        <div className="flex items-center space-x-1 min-w-max">
          {reportTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveReport(tab.key);
                setSearchTerm('');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeReport === tab.key
                  ? 'bg-amber-600 text-white shadow-xs'
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
                className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span>To:</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search reference, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 w-44"
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
                handleExportCsv(activeReport, ['Ref', 'Customer', 'Amount'], [['SO-001', 'Mining Corp', 50000]]);
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
          {/* 1. SALES QUOTATION REPORT */}
          {activeReport === 'SalesQuotReport' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Sales Quotation Register Report</h2>
                <p className="text-xs text-slate-500">Commercial quotations generated with pricing and validity metrics</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">Quot No</th>
                      <th className="px-4 py-2.5 font-sans">Date</th>
                      <th className="px-4 py-2.5 font-sans">Customer Name</th>
                      <th className="px-4 py-2.5 font-sans">Enquiry Ref</th>
                      <th className="px-4 py-2.5 font-sans">Valid Until</th>
                      <th className="px-4 py-2.5 text-right font-sans">Subtotal ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">VAT ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Total ($)</th>
                      <th className="px-4 py-2.5 font-sans">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {initialSalesQuotations.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 font-mono font-bold text-amber-600">{q.quotationNo}</td>
                        <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{q.date}</td>
                        <td className="px-4 py-2 font-medium text-slate-800">{q.customerName}</td>
                        <td className="px-4 py-2 font-mono text-slate-600">{q.enquiryRef}</td>
                        <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{q.validUntil}</td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-slate-700">
                          ${q.subTotal.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-right font-mono text-slate-500">${q.vatAmount.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">
                          ${q.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                            {q.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold">
                      <td className="px-4 py-2.5 text-slate-900 uppercase text-xs" colSpan={5}>
                        Total Active Quotation Pipeline
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-800">$149,568</td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-500">$23,932</td>
                      <td className="px-4 py-2.5 text-right font-mono text-amber-800 font-extrabold text-xs">$173,500</td>
                      <td className="px-4 py-2.5"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. SALES QUOTATION ANALYSIS REPORT */}
          {activeReport === 'SalesQuotAnalysisReport' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Sales Quotation Conversion & Win-Rate Analysis</h2>
                <p className="text-xs text-slate-500">Analysis of quotation outcomes, win rates, and average sales cycles</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <span className="text-[10px] font-bold uppercase text-blue-600">Total Quotations Issued</span>
                  <p className="text-2xl font-extrabold text-blue-950 mt-1">28 Quotes</p>
                  <span className="text-[11px] text-blue-700">$1,450,000 Pipeline</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <span className="text-[10px] font-bold uppercase text-emerald-700">Converted to Sales Order</span>
                  <p className="text-2xl font-extrabold text-emerald-950 mt-1">19 Won</p>
                  <span className="text-[11px] text-emerald-700 font-semibold">67.8% Win Rate</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <span className="text-[10px] font-bold uppercase text-amber-700">Pending Customer Decision</span>
                  <p className="text-2xl font-extrabold text-amber-950 mt-1">6 Active</p>
                  <span className="text-[11px] text-amber-700">$320,000 in negotiation</span>
                </div>
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                  <span className="text-[10px] font-bold uppercase text-rose-700">Lost / Price Objection</span>
                  <p className="text-2xl font-extrabold text-rose-950 mt-1">3 Lost</p>
                  <span className="text-[11px] text-rose-700">10.7% Loss Rate</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5">Sales Engineer</th>
                      <th className="px-4 py-2.5 text-right">Quotes Count</th>
                      <th className="px-4 py-2.5 text-right">Quoted Value ($)</th>
                      <th className="px-4 py-2.5 text-right">Converted ($)</th>
                      <th className="px-4 py-2.5 text-right">Win Rate %</th>
                      <th className="px-4 py-2.5 text-right">Avg Cycle Days</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-800">Raply Vance (Lead Mining Sales)</td>
                      <td className="px-4 py-2 text-right font-mono">18</td>
                      <td className="px-4 py-2 text-right font-mono font-semibold">$980,000</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-emerald-600">$715,000</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-emerald-700">72.9%</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-500">9 Days</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-800">Antony Kiptoo (Structural Projects)</td>
                      <td className="px-4 py-2 text-right font-mono">10</td>
                      <td className="px-4 py-2 text-right font-mono font-semibold">$470,000</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-emerald-600">$295,000</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-emerald-700">62.7%</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-500">14 Days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. SALES QUOTATION SUMMARY REPORT */}
          {activeReport === 'SalesQuotSummerReport' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Sales Quotation Monthly Summary</h2>
                <p className="text-xs text-slate-500">Aggregated client pipeline volume and conversion status</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">Customer Entity</th>
                      <th className="px-4 py-2.5 text-right font-sans">Quotes Count</th>
                      <th className="px-4 py-2.5 text-right font-sans">Gross Quoted ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Avg Margin %</th>
                      <th className="px-4 py-2.5 font-sans">Primary Products Requested</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {initialCustomers.map((c, i) => (
                      <tr key={c.id}>
                        <td className="px-4 py-2 font-medium text-slate-800">{c.name}</td>
                        <td className="px-4 py-2 text-right font-mono">{4 + i * 2}</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">
                          ${(180000 + i * 85000).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-right font-mono text-emerald-600 font-semibold">{32 + i * 3}%</td>
                        <td className="px-4 py-2 text-slate-600">Universal Columns, High-Tensile Rebar T16, Heavy Pipes</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. SALES ORDER REPORT */}
          {activeReport === 'SalesOrderReport' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Sales Orders Execution Register</h2>
                <p className="text-xs text-slate-500">Confirmed production contracts, scheduled delivery dates, and balances</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">SO Number</th>
                      <th className="px-4 py-2.5 font-sans">Order Date</th>
                      <th className="px-4 py-2.5 font-sans">Customer Name</th>
                      <th className="px-4 py-2.5 font-sans">Customer LPO Ref</th>
                      <th className="px-4 py-2.5 font-sans">Delivery Due</th>
                      <th className="px-4 py-2.5 text-right font-sans">Contract Value ($)</th>
                      <th className="px-4 py-2.5 font-sans">Delivery Status</th>
                      <th className="px-4 py-2.5 font-sans">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {initialSalesOrders.map((so) => (
                      <tr key={so.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 font-mono font-bold text-blue-600">{so.soNo}</td>
                        <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{so.date}</td>
                        <td className="px-4 py-2 font-medium text-slate-800">{so.customerName}</td>
                        <td className="px-4 py-2 font-mono text-slate-600">{so.lpoRef}</td>
                        <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{so.expectedDelivery}</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">
                          ${so.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              so.deliveryStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {so.deliveryStatus}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              so.paymentStatus === 'Paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {so.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold">
                      <td className="px-4 py-2.5 text-slate-900 uppercase text-xs" colSpan={5}>
                        Total Active Sales Order Backlog Value
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs text-blue-900 font-extrabold">$92,700</td>
                      <td className="px-4 py-2.5" colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. SALES ORDER SUMMARY REPORT */}
          {activeReport === 'SalesOrderSummeryReport' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Sales Order Summary by Customer Segment</h2>
                <p className="text-xs text-slate-500">Total volume ordered, billed, and pending fulfillment</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">Customer</th>
                      <th className="px-4 py-2.5 text-right font-sans">Total Orders</th>
                      <th className="px-4 py-2.5 text-right font-sans">Cumulative Value ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Delivered Value ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Pending Dispatch ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-800">Simandou Rail Project</td>
                      <td className="px-4 py-2 text-right font-mono">3</td>
                      <td className="px-4 py-2 text-right font-mono font-bold">$185,000</td>
                      <td className="px-4 py-2 text-right font-mono text-emerald-600 font-semibold">$120,800</td>
                      <td className="px-4 py-2 text-right font-mono text-amber-600 font-semibold">$64,200</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-800">Port Autonome de Conakry</td>
                      <td className="px-4 py-2 text-right font-mono">2</td>
                      <td className="px-4 py-2 text-right font-mono font-bold">$78,500</td>
                      <td className="px-4 py-2 text-right font-mono text-emerald-600 font-semibold">$78,500</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">$0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. SALES ORDER TO DN / CASH IN REPORT */}
          {activeReport === 'SalesOrderToDn' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Sales Order Conversion to Delivery Note (DN)</h2>
                <p className="text-xs text-slate-500">Tracking conversion from confirmed sales orders into dispatched delivery notes</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">SO Ref</th>
                      <th className="px-4 py-2.5 font-sans">Customer</th>
                      <th className="px-4 py-2.5 font-sans">Generated DN Ref</th>
                      <th className="px-4 py-2.5 font-sans">Dispatch Date</th>
                      <th className="px-4 py-2.5 text-right font-sans">Ordered Qty</th>
                      <th className="px-4 py-2.5 text-right font-sans">Dispatched Qty</th>
                      <th className="px-4 py-2.5 text-right font-sans">Pending Balance</th>
                      <th className="px-4 py-2.5 font-sans">Conversion Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    <tr>
                      <td className="px-4 py-2 font-mono font-bold text-blue-600">SO-2026-098</td>
                      <td className="px-4 py-2 font-medium text-slate-800">Port Autonome de Conakry</td>
                      <td className="px-4 py-2 font-mono text-emerald-600 font-semibold">DN-2026-095</td>
                      <td className="px-4 py-2 font-mono text-slate-500">10-Nov-2026</td>
                      <td className="px-4 py-2 text-right font-mono">45 Pcs</td>
                      <td className="px-4 py-2 text-right font-mono text-emerald-600 font-semibold">45 Pcs</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">0 Pcs</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          100% Converted
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono font-bold text-blue-600">SO-2026-104</td>
                      <td className="px-4 py-2 font-medium text-slate-800">Simandou Rail Project</td>
                      <td className="px-4 py-2 font-mono text-amber-600 font-semibold">Pending DN</td>
                      <td className="px-4 py-2 font-mono text-slate-500">Scheduled 15-Nov</td>
                      <td className="px-4 py-2 text-right font-mono">120 Pcs</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">0 Pcs</td>
                      <td className="px-4 py-2 text-right font-mono text-amber-600 font-semibold">120 Pcs</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                          Awaiting Fabrication
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. DELIVERY NOTE REPORT */}
          {activeReport === 'DeliveryNoteReport' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Delivery Notes Dispatched Register</h2>
                <p className="text-xs text-slate-500">Physical gate passes, carrier truck details, and customer acceptance</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">DN Number</th>
                      <th className="px-4 py-2.5 font-sans">Date</th>
                      <th className="px-4 py-2.5 font-sans">SO Ref</th>
                      <th className="px-4 py-2.5 font-sans">Customer</th>
                      <th className="px-4 py-2.5 font-sans">Vehicle / Carrier</th>
                      <th className="px-4 py-2.5 font-sans">Driver</th>
                      <th className="px-4 py-2.5 text-right font-sans">Items Count</th>
                      <th className="px-4 py-2.5 font-sans">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {initialDeliveryNotes.map((dn) => (
                      <tr key={dn.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 font-mono font-bold text-purple-600">{dn.dnNo}</td>
                        <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{dn.date}</td>
                        <td className="px-4 py-2 font-mono text-blue-600">{dn.soRef}</td>
                        <td className="px-4 py-2 font-medium text-slate-800">{dn.customerName}</td>
                        <td className="px-4 py-2 text-slate-600">{dn.vehicleNo}</td>
                        <td className="px-4 py-2 text-slate-600">{dn.driverName}</td>
                        <td className="px-4 py-2 text-right font-mono font-semibold">{dn.itemsDelivered}</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            {dn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. DN TO CREDIT INVOICE REPORT */}
          {activeReport === 'DnToCreditInvoice' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Delivery Note to Credit Invoice Billing Reconciliation</h2>
                <p className="text-xs text-slate-500">Verification ensuring all dispatched materials are billed via tax invoice</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">DN Number</th>
                      <th className="px-4 py-2.5 font-sans">Customer</th>
                      <th className="px-4 py-2.5 font-sans">Dispatched Date</th>
                      <th className="px-4 py-2.5 font-sans">Invoice Billed</th>
                      <th className="px-4 py-2.5 text-right font-sans">Billed Amount ($)</th>
                      <th className="px-4 py-2.5 font-sans">Billing Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    <tr>
                      <td className="px-4 py-2 font-mono font-bold text-purple-600">DN-2026-095</td>
                      <td className="px-4 py-2 font-medium text-slate-800">Port Autonome de Conakry</td>
                      <td className="px-4 py-2 font-mono text-slate-500">10-Nov-2026</td>
                      <td className="px-4 py-2 font-mono font-bold text-emerald-600">INV-2026-114</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">$28,500.00</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          Billed & Paid
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 9. INVOICE REPORT */}
          {activeReport === 'InvoiceReport' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Commercial Tax Invoice Register Report</h2>
                <p className="text-xs text-slate-500">Official tax invoices booked with payment status and VAT summary</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">Invoice No</th>
                      <th className="px-4 py-2.5 font-sans">Date</th>
                      <th className="px-4 py-2.5 font-sans">Customer</th>
                      <th className="px-4 py-2.5 font-sans">SO Ref</th>
                      <th className="px-4 py-2.5 font-sans">Due Date</th>
                      <th className="px-4 py-2.5 text-right font-sans">Total Billed ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Paid ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Balance ($)</th>
                      <th className="px-4 py-2.5 font-sans">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {initialSalesInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 font-mono font-bold text-blue-600">{inv.invoiceNo}</td>
                        <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{inv.date}</td>
                        <td className="px-4 py-2 font-medium text-slate-800">{inv.customerName}</td>
                        <td className="px-4 py-2 font-mono text-slate-600">{inv.soRef}</td>
                        <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{inv.dueDate}</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">
                          ${inv.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-right font-mono text-emerald-600 font-semibold">
                          ${inv.paidAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-right font-mono text-rose-600 font-bold">
                          ${inv.balanceDue.toLocaleString()}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold">
                      <td className="px-4 py-2.5 text-slate-900 uppercase text-xs" colSpan={5}>
                        Total Invoiced Revenue
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs text-blue-900 font-extrabold">$92,700</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs text-emerald-800">$67,000</td>
                      <td className="px-4 py-2.5 text-right font-mono text-xs text-rose-800 font-extrabold">$25,700</td>
                      <td className="px-4 py-2.5"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 10. SALES RETURN REPORT */}
          {activeReport === 'SalesReturnReport' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Sales Return & Rejection Log</h2>
                <p className="text-xs text-slate-500">Customer rejected materials, quality deviations, and credit note issuance</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">Return No</th>
                      <th className="px-4 py-2.5 font-sans">Date</th>
                      <th className="px-4 py-2.5 font-sans">Original Invoice</th>
                      <th className="px-4 py-2.5 font-sans">Customer</th>
                      <th className="px-4 py-2.5 font-sans">Discrepancy / Reason</th>
                      <th className="px-4 py-2.5 text-right font-sans">Return Value ($)</th>
                      <th className="px-4 py-2.5 font-sans">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {initialSalesReturns.map((sr) => (
                      <tr key={sr.id}>
                        <td className="px-4 py-2 font-mono font-bold text-rose-600">{sr.returnNo}</td>
                        <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{sr.date}</td>
                        <td className="px-4 py-2 font-mono text-blue-600">{sr.invoiceNo}</td>
                        <td className="px-4 py-2 font-medium text-slate-800">{sr.customerName}</td>
                        <td className="px-4 py-2 text-slate-600">{sr.reason}</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-rose-700">
                          ${sr.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            {sr.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 11. SALES SUMMARY REPORT */}
          {activeReport === 'SalesSummery' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Executive Commercial Sales Summary</h2>
                <p className="text-xs text-slate-500">Product category breakdown, tonnage volume, and revenue contributions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 text-white p-4 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Billed Volume</span>
                  <p className="text-2xl font-extrabold mt-1">1,840 MT</p>
                  <span className="text-xs text-emerald-400 font-semibold">+18.4% vs last quarter</span>
                </div>
                <div className="bg-blue-900 text-white p-4 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-blue-300">Gross Sales Value</span>
                  <p className="text-2xl font-extrabold mt-1">$1,845,000</p>
                  <span className="text-xs text-blue-200">Across 18 enterprise contracts</span>
                </div>
                <div className="bg-emerald-900 text-white p-4 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-emerald-300">Average Price Per Ton</span>
                  <p className="text-2xl font-extrabold mt-1">$1,002 / MT</p>
                  <span className="text-xs text-emerald-200">Standard S355JR Specification</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">Product Head</th>
                      <th className="px-4 py-2.5 text-right font-sans">Metric Tons Sold</th>
                      <th className="px-4 py-2.5 text-right font-sans">Revenue ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Cost ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Gross Margin %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-800">Structural I & H Beams (Poutrelles)</td>
                      <td className="px-4 py-2 text-right font-mono">920 MT</td>
                      <td className="px-4 py-2 text-right font-mono font-bold">$985,000</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-500">$510,000</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-emerald-600">48.2%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-800">High-Tensile Deformed Rebar (Fers à Béton)</td>
                      <td className="px-4 py-2 text-right font-mono">640 MT</td>
                      <td className="px-4 py-2 text-right font-mono font-bold">$570,000</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-500">$340,000</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-emerald-600">40.3%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-800">Hot Rolled Heavy Plates & Pipes</td>
                      <td className="px-4 py-2 text-right font-mono">280 MT</td>
                      <td className="px-4 py-2 text-right font-mono font-bold">$290,000</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-500">$130,000</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-emerald-600">55.1%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 12. BACKLOG REPORT */}
          {activeReport === 'BackLog' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Sales Order Production Backlog</h2>
                <p className="text-xs text-slate-500">Unfulfilled order backlog queued for mill production and dispatch</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">SO Ref</th>
                      <th className="px-4 py-2.5 font-sans">Customer</th>
                      <th className="px-4 py-2.5 font-sans">Promised Delivery</th>
                      <th className="px-4 py-2.5 font-sans">Delay / Priority</th>
                      <th className="px-4 py-2.5 text-right font-sans">Backlog Qty</th>
                      <th className="px-4 py-2.5 text-right font-sans">Backlog Value ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    <tr>
                      <td className="px-4 py-2 font-mono font-bold text-blue-600">SO-2026-104</td>
                      <td className="px-4 py-2 font-medium text-slate-800">Simandou Rail Project</td>
                      <td className="px-4 py-2 font-mono text-slate-500">15-Nov-2026</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800">
                          Critical / 2 Days Left
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-semibold">120 Universal Beams</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">$64,200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 13. JOB PROFITABILITY REPORT */}
          {activeReport === 'JobProfitability' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Job Order Profitability & Cost Absorption</h2>
                <p className="text-xs text-slate-500">Job-by-job comparison of material cost, fabrication labor, and net margin</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">Job Card ID</th>
                      <th className="px-4 py-2.5 font-sans">Client / Project</th>
                      <th className="px-4 py-2.5 text-right font-sans">Contract Value ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Steel Material ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Plasma & Labor ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Net Profit ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Margin %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    <tr>
                      <td className="px-4 py-2 font-mono font-bold text-purple-600">JOB-2026-441</td>
                      <td className="px-4 py-2 font-medium text-slate-800">Boké Ore Stacker Structure</td>
                      <td className="px-4 py-2 text-right font-mono font-bold">$125,000</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-600">$58,000</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-600">$18,500</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-emerald-600">$48,500</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-emerald-700">38.8%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono font-bold text-purple-600">JOB-2026-442</td>
                      <td className="px-4 py-2 font-medium text-slate-800">Port Autonome Quayside Crane Girders</td>
                      <td className="px-4 py-2 text-right font-mono font-bold">$28,500</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-600">$12,400</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-600">$4,200</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-emerald-600">$11,900</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-emerald-700">41.7%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 14. JOB SUMMARY REPORT */}
          {activeReport === 'JobSummery' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Active Job Orders Engineering Progress Summary</h2>
                <p className="text-xs text-slate-500">Fabrication milestones, QA inspection passes, and dispatch scheduling</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">Job Card</th>
                      <th className="px-4 py-2.5 font-sans">Plant Location</th>
                      <th className="px-4 py-2.5 font-sans">Supervisor</th>
                      <th className="px-4 py-2.5 text-right font-sans">Cut Stage</th>
                      <th className="px-4 py-2.5 text-right font-sans">Weld Stage</th>
                      <th className="px-4 py-2.5 text-right font-sans">Paint/Galv</th>
                      <th className="px-4 py-2.5 font-sans">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    <tr>
                      <td className="px-4 py-2 font-mono font-bold text-blue-600">JOB-2026-441</td>
                      <td className="px-4 py-2 text-slate-800">Matoto Heavy Yard</td>
                      <td className="px-4 py-2 text-slate-600">M. Camara</td>
                      <td className="px-4 py-2 text-right font-mono text-emerald-600">100%</td>
                      <td className="px-4 py-2 text-right font-mono text-emerald-600">85%</td>
                      <td className="px-4 py-2 text-right font-mono text-amber-600">40%</td>
                      <td className="px-4 py-2">
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full w-[75%]"></div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 15. WORK IN PROGRESS (WIP) */}
          {activeReport === 'WorkProgress' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Factory Floor Work In Progress (WIP) Live State</h2>
                <p className="text-xs text-slate-500">Live operational status across cutting bays, welding jigs, and painting lines</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>1. CNC Plasma Cutting</span>
                    <span className="font-bold text-blue-600">Bay #1</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">45 Tons Staged</p>
                  <span className="text-[11px] text-slate-500">Messer Gantry Running</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>2. Fit-up & Welding</span>
                    <span className="font-bold text-amber-600">Bay #2 & 3</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">32 Tons Active</p>
                  <span className="text-[11px] text-slate-500">6 Submerged Arc Welders</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>3. Blasting & Primer</span>
                    <span className="font-bold text-purple-600">Enclosed Booth</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">18 Tons Curing</p>
                  <span className="text-[11px] text-slate-500">Epoxy Zinc Primer (120μm)</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>4. Final QA & Yard Tag</span>
                    <span className="font-bold text-emerald-600">Gantry Dispatch</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">12 Tons Ready</p>
                  <span className="text-[11px] text-emerald-600 font-semibold">Passed Ultrasonic Testing</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

