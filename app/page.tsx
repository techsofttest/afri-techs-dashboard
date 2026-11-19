'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Truck,
  Package,
  Calendar,
  Search,
  UserCheck,
  FileText,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import {
  initialPendingQuotations,
  initialPendingDeliveries,
  initialExpiringDocs
} from '@/lib/mock-data';

export default function AdminOverviewPage() {
  const [quotations] = useState(initialPendingQuotations);
  const [deliveries] = useState(initialPendingDeliveries);
  const [expiringDocs] = useState(initialExpiringDocs);
  const [acYear, setAcYear] = useState('2026');
  const [acMonth, setAcMonth] = useState('11');

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const currentMonthName = months.find((m) => m.value === acMonth)?.label || 'November';

  return (
    <div className="space-y-5">
      {/* Accounting Period & Date Bar (steel_erp index.php) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Accounting Period Selection */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Accounting Period:</span>
            <select
              value={acYear}
              onChange={(e) => setAcYear(e.target.value)}
              className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
            >
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
            <select
              value={acMonth}
              onChange={(e) => setAcMonth(e.target.value)}
              className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5" /> Search
            </button>
          </div>

          {/* User & Current Date Info */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 font-medium">User:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Admin
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 font-medium">Period:</span>
              <span className="font-bold text-slate-800">
                {currentMonthName.slice(0, 3)} {acYear}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-slate-500 font-medium">Date:</span>
              <span className="font-mono font-bold text-slate-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> 19-Nov-2026
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Key ERP Metric Cards (steel_erp index.php: Current Month & YTD) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Row 1: Orders */}
        <div className="bg-[#5f9ea0] hover:brightness-105 transition-all text-white rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs uppercase font-bold tracking-wider">Current Month Orders</span>
          </div>
          <span className="text-2xl font-extrabold font-mono">18</span>
        </div>

        <div className="bg-[#405189] hover:brightness-105 transition-all text-white rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs uppercase font-bold tracking-wider">Year To Date Orders</span>
          </div>
          <span className="text-2xl font-extrabold font-mono">164</span>
        </div>

        {/* Row 2: Delivery */}
        <div className="bg-[#5f9ea0] hover:brightness-105 transition-all text-white rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs uppercase font-bold tracking-wider">Current Month Delivery</span>
          </div>
          <span className="text-2xl font-extrabold font-mono">14</span>
        </div>

        <div className="bg-[#405189] hover:brightness-105 transition-all text-white rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs uppercase font-bold tracking-wider">Year To Date Delivery</span>
          </div>
          <span className="text-2xl font-extrabold font-mono">152</span>
        </div>

        {/* Row 3: Sales */}
        <div className="bg-[#5f9ea0] hover:brightness-105 transition-all text-white rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs uppercase font-bold tracking-wider">Current Month Sales</span>
          </div>
          <span className="text-2xl font-extrabold font-mono">$184,500</span>
        </div>

        <div className="bg-[#405189] hover:brightness-105 transition-all text-white rounded-xl p-3.5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs uppercase font-bold tracking-wider">Year To Date Sales</span>
          </div>
          <span className="text-2xl font-extrabold font-mono">$1,845,000</span>
        </div>
      </div>

      {/* 3 Core Action Tables (steel_erp index.php: Pending for Action) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Table 1: Pending Quotation Action */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-800">
                Pending For Action - Quotation
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
              {quotations.length}
            </span>
          </div>

          <div className="flex-1 overflow-x-auto max-h-72">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">Enquiry Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{q.date}</td>
                    <td className="px-3 py-2 font-medium text-slate-800">
                      <div className="truncate max-w-[130px]">{q.customerName}</div>
                    </td>
                    <td className="px-3 py-2 text-blue-700 font-mono font-medium whitespace-nowrap">
                      {q.enquiryRef}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-right">
            <Link
              href="/crm"
              className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1"
            >
              <span>View in CRM</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Table 2: Pending Delivery Action */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-800">
                Pending For Action - Delivery
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
              {deliveries.length}
            </span>
          </div>

          <div className="flex-1 overflow-x-auto max-h-72">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">Sales Order</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">LPO Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveries.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 font-mono font-semibold text-slate-800 whitespace-nowrap">
                      {d.soNumber}
                    </td>
                    <td className="px-3 py-2 font-medium text-slate-700">
                      <div className="truncate max-w-[130px]">{d.customerName}</div>
                    </td>
                    <td className="px-3 py-2 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {d.lpoRef}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-right">
            <Link
              href="/crm"
              className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1"
            >
              <span>View in CRM</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Table 3: Expiring Soon */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-800">
                Expiring Soon
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {expiringDocs.length}
            </span>
          </div>

          <div className="flex-1 overflow-x-auto max-h-72">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">Employee / Entity</th>
                  <th className="px-3 py-2">Item</th>
                  <th className="px-3 py-2">Expiry Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expiringDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 font-medium text-slate-800">
                      <div className="truncate max-w-[120px]">{doc.holderName}</div>
                    </td>
                    <td className="px-3 py-2 text-slate-600">
                      <div className="truncate max-w-[140px]">{doc.item}</div>
                    </td>
                    <td className="px-3 py-2 font-medium text-slate-700 whitespace-nowrap">
                      {doc.expiryDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-right">
            <Link
              href="/company"
              className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1"
            >
              <span>View Compliance</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
