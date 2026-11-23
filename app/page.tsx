'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Users,
  FileText,
  Truck,
  ArrowRight
} from 'lucide-react';
import {
  initialPendingQuotations,
  initialPendingDeliveries,
  initialCustomers
} from '@/lib/mock-data';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminOverviewPage() {
  const [quotations] = useState(initialPendingQuotations);
  const [deliveries] = useState(initialPendingDeliveries);
  const [customers] = useState(initialCustomers);
  const { t } = useLanguage();

  return (
    <div className="space-y-5">
      {/* 2 Key ERP Metric Cards: Current Month Orders & Total Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Current Month Orders */}
        <div className="bg-[#5f9ea0] hover:brightness-105 transition-all text-white rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider block">{t('current_month_orders')}</span>
              <span className="text-[11px] text-teal-100 font-medium">{t('active_sales_orders')}</span>
            </div>
          </div>
          <span className="text-3xl font-extrabold font-mono">18</span>
        </div>

        {/* Card 2: Total Customers */}
        <div className="bg-[#405189] hover:brightness-105 transition-all text-white rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-white/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider block">{t('total_customers')}</span>
              <span className="text-[11px] text-indigo-100 font-medium">{t('registered_client_accounts')}</span>
            </div>
          </div>
          <span className="text-3xl font-extrabold font-mono">{customers.length}</span>
        </div>
      </div>

      {/* 2 Core Action Tables (steel_erp index.php: Pending for Action) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Table 1: Pending Quotation Action */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                {t('pending_quotation_action')}
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
              {quotations.length}
            </span>
          </div>

          <div className="flex-1 overflow-x-auto max-h-80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">{t('date')}</th>
                  <th className="px-4 py-2.5">{t('customer')}</th>
                  <th className="px-4 py-2.5">{t('enquiry_ref')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">{q.date}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-800">
                      <div className="truncate max-w-[200px]">{q.customerName}</div>
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
              className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1"
            >
              <span>{t('view_in_crm')}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Table 2: Pending Delivery Action */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                {t('pending_delivery_action')}
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
              {deliveries.length}
            </span>
          </div>

          <div className="flex-1 overflow-x-auto max-h-80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">{t('sales_order')}</th>
                  <th className="px-4 py-2.5">{t('customer')}</th>
                  <th className="px-4 py-2.5">{t('lpo_ref')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveries.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-mono font-semibold text-slate-800 whitespace-nowrap">
                      {d.soNumber}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-slate-700">
                      <div className="truncate max-w-[200px]">{d.customerName}</div>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 font-mono text-[11px] whitespace-nowrap">
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
              className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1"
            >
              <span>{t('view_in_crm')}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
