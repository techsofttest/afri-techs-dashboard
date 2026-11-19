'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Truck,
  Package,
  FileText,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  PieChart,
  Compass,
  MapPin,
  Clock,
  Building,
  FileSpreadsheet,
  FileBarChart,
  ClipboardList
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import {
  initialPendingQuotations,
  initialPendingDeliveries,
  initialExpiringDocs,
  companyData
} from '@/lib/mock-data';

export default function AdminOverviewPage() {
  const [quotations] = useState(initialPendingQuotations);
  const [deliveries] = useState(initialPendingDeliveries);
  const [expiringDocs] = useState(initialExpiringDocs);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-sm border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Building className="w-3.5 h-3.5" /> {companyData.name}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Administrative Overview
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
            Real-time industrial manufacturing metrics, active order pipelines, procurement logs, and financial ledger status.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/accounts"
            className="px-4 py-2 text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Accounts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/crm"
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span>CRM & Sales</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Enterprise Financial & Operational Reports (Replicated from steel_erp Modules) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-600" /> Enterprise Reports Suite (steel_erp Architecture)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive financial ledgers, commercial sales registries, and procurement audit statements across all 3 core modules.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
            31 Available Reports
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Accounts Reports Card */}
          <div className="p-4 rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50/50 to-white hover:border-blue-400 hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-lg bg-blue-600 text-white shadow-xs">
                  <FileSpreadsheet className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  8 Reports
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Accounts Financial Reports</h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                General Ledger, Trial Balance, Profit & Loss, Balance Sheet, Aged Receivables & Payables, Statement of Accounts.
              </p>
            </div>
            <Link
              href="/accounts?view=reports"
              className="mt-4 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Accounts Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* CRM Reports Card */}
          <div className="p-4 rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/50 to-white hover:border-amber-400 hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-lg bg-amber-600 text-white shadow-xs">
                  <FileBarChart className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  15 Reports
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">CRM Commercial Sales Reports</h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                Sales Quotation Registers, Conversion Analysis, Sales Orders, Delivery Notes, Invoicing, WIP State & Job Profitability.
              </p>
            </div>
            <Link
              href="/crm?view=reports"
              className="mt-4 px-3.5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View CRM Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Procurement Reports Card */}
          <div className="p-4 rounded-xl border border-purple-200/80 bg-gradient-to-br from-purple-50/50 to-white hover:border-purple-400 hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-lg bg-purple-600 text-white shadow-xs">
                  <ClipboardList className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  8 Reports
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Procurement & Supply Chain Reports</h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                Material Requisitions, Purchase Orders (LPO), MRN Intake, 3-Way Match Audits, Purchase Vouchers & Debit Claims.
              </p>
            </div>
            <Link
              href="/procurement?view=reports"
              className="mt-4 px-3.5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Procurement Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>


      {/* Operational Metrics Cards (Aesthetic Modern Style) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-slate-700" /> Operational Highlights
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">Currency: USD ($)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* Row 1: Orders */}
          <StatCard
            title="Current Month Orders"
            value="18 Orders"
            subValue="$194,500 total volume"
            bgColor="cadet"
            icon={TrendingUp}
            trend="+12% vs last month"
          />
          <StatCard
            title="Year To Date Orders"
            value="164 Orders"
            subValue="$1,845,000 YTD cumulative"
            bgColor="navy"
            icon={TrendingUp}
            trend="+28% YoY growth"
          />

          {/* Row 2: Delivery */}
          <StatCard
            title="Current Month Delivery"
            value="14 Dispatches"
            subValue="$142,300 dispatched"
            bgColor="cadet"
            icon={Truck}
            trend="92% on-time fulfillment"
          />
          <StatCard
            title="Year To Date Delivery"
            value="152 Dispatches"
            subValue="$1,680,000 fulfilled"
            bgColor="navy"
            icon={Truck}
            trend="95.4% fulfillment rate"
          />

          {/* Row 3: Sales */}
          <StatCard
            title="Current Month Sales"
            value="$184,500"
            subValue="Invoiced & Booked"
            bgColor="emerald"
            icon={Package}
            trend="+8.5% over target"
          />
          <StatCard
            title="Year To Date Sales"
            value="$1,845,000"
            subValue="Audited General Ledger"
            bgColor="amber"
            icon={DollarSign}
            trend="Target: $2.1M (88%)"
          />
        </div>
      </div>

      {/* Action Tables Section (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table 1: Pending Quotations */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Pending Quotation Action
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
              {quotations.length} Queue
            </span>
          </div>

          <div className="flex-1 overflow-x-auto max-h-72">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Customer</th>
                  <th className="px-3 py-2.5">Enquiry Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2.5 text-slate-500 font-medium whitespace-nowrap">
                      {q.date}
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-slate-800">
                      <div className="truncate max-w-[140px]">{q.customerName}</div>
                      <span className="text-[10px] text-slate-400 block">${q.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-3 py-2.5 text-blue-700 font-mono font-medium whitespace-nowrap">
                      {q.enquiryRef}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-2.5 border-t border-slate-100 bg-slate-50/50 text-right">
            <Link
              href="/crm"
              className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
            >
              <span>View Quotations</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Table 2: Pending Deliveries */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Pending Delivery Action
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
              {deliveries.length} Queue
            </span>
          </div>

          <div className="flex-1 overflow-x-auto max-h-72">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">Sales Order</th>
                  <th className="px-3 py-2.5">Customer</th>
                  <th className="px-3 py-2.5">LPO Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveries.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2.5 font-mono font-semibold text-slate-800 whitespace-nowrap">
                      {d.soNumber}
                      <span className="text-[10px] text-emerald-600 font-sans block">{d.status}</span>
                    </td>
                    <td className="px-3 py-2.5 font-medium text-slate-700">
                      <div className="truncate max-w-[130px]">{d.customerName}</div>
                      <span className="text-[10px] text-slate-400 block">Due: {d.dueDate}</span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {d.lpoRef}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-2.5 border-t border-slate-100 bg-slate-50/50 text-right">
            <Link
              href="/crm"
              className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
            >
              <span>Dispatch Delivery Note</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Table 3: Expiring Soon */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Expiring Compliance & Docs
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Notice
            </span>
          </div>

          <div className="flex-1 overflow-x-auto max-h-72">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">Entity / Item</th>
                  <th className="px-3 py-2.5">Expiry Date</th>
                  <th className="px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expiringDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2.5">
                      <div className="font-semibold text-slate-800 truncate max-w-[130px]">
                        {doc.holderName}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[130px]">
                        {doc.item}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-medium text-slate-600 whitespace-nowrap">
                      {doc.expiryDate}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${doc.status === 'Critical'
                          ? 'bg-rose-100 text-rose-700'
                          : doc.status === 'Warning'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                          }`}
                      >
                        {doc.daysRemaining} days left
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-2.5 border-t border-slate-100 bg-slate-50/50 text-right">
            <Link
              href="/company"
              className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
            >
              <span>Manage Companies & Entities</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Module Shortcuts Grid */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-700" /> Active System Workspaces
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/accounts"
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <PieChart className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-semibold text-slate-400">5 Sub-modules</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">Accounts Module</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              General Ledger, Chart of Accounts, Receipts, Payments & Petty Cash.
            </p>
          </Link>

          <Link
            href="/crm"
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Compass className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-semibold text-slate-400">11 Sub-modules</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600">CRM & Sales</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Customer Registry, Quotations, Sales Orders, Delivery Notes & Invoices.
            </p>
          </Link>

          <Link
            href="/procurement"
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <MapPin className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-semibold text-slate-400">6 Sub-modules</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600">Procurement Module</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Vendors, Material Requisitions, LPOs, MRNs, Purchase Vouchers & Returns.
            </p>
          </Link>

          <Link
            href="/company"
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Building className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-semibold text-slate-400">3 Entities</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">Company Registry</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Afri techs Guinea, India & UK statutory credentials and partner records.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
