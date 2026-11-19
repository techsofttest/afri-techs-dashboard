'use client';

import React, { useState } from 'react';
import {
  Printer,
  FileSpreadsheet,
  FileText,
  Search,
  Calendar,
  Filter,
  ArrowUpDown,
  Building2,
  DollarSign,
  TrendingUp,
  CreditCard,
  PieChart
} from 'lucide-react';
import {
  initialChartOfAccounts,
  initialReceipts,
  initialPayments,
  initialFixedAssets,
  initialCustomers,
  initialVendors
} from '@/lib/mock-data';

interface AccountsReportsProps {
  initialReport?: string;
}

export default function AccountsReports({ initialReport = 'Ledger' }: AccountsReportsProps) {
  const [activeReport, setActiveReport] = useState(initialReport);
  const [dateFrom, setDateFrom] = useState('2026-11-01');
  const [dateTo, setDateTo] = useState('2026-11-30');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('all');

  const reportTabs = [
    { key: 'Ledger', label: 'Ledger' },
    { key: 'TrialBalance', label: 'Trial Balance' },
    { key: 'PLAccount', label: 'Profit & Loss' },
    { key: 'BalanceSheet', label: 'Balance Sheet' },
    { key: 'RPSummery', label: 'Accounts Receivable/Payable Summary' },
    { key: 'StatementOfAccounts', label: 'Statement Of Accounts' },
    { key: 'AgedRP', label: 'Aged Receivables/Payables' },
    { key: 'FixedAsset', label: 'Fixed Asset Schedule' }
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
      {/* Reports Sub-Header Navigation (Replicated from steel_erp accounts/reports_sub_header.php) */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 shadow-xs overflow-x-auto">
        <div className="flex items-center space-x-1 min-w-max">
          {reportTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveReport(tab.key);
                setSearchTerm('');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeReport === tab.key
                ? 'bg-blue-600 text-white shadow-xs'
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
                className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span>To:</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Filter by keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
              />
            </div>
          </div>

          {/* Action Buttons: Print, Excel, PDF (Styled identically to steel_erp report action bar) */}
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
                // Export currently active report
                handleExportCsv(activeReport, ['Column1', 'Column2'], [['Data1', 'Data2']]);
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
          {/* 1. GENERAL LEDGER REPORT */}
          {activeReport === 'Ledger' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">General Ledger Transaction Register</h2>
                  <p className="text-xs text-slate-500">Comprehensive chronological debit and credit posting log</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Filter Account:</span>
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700"
                  >
                    <option value="all">All Chart of Accounts</option>
                    {initialChartOfAccounts.map((acc) => (
                      <option key={acc.id} value={acc.accountCode}>
                        {acc.accountCode} - {acc.accountName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">Date</th>
                      <th className="px-4 py-2.5 font-sans">Voucher / Ref</th>
                      <th className="px-4 py-2.5 font-sans">Account Head / Ledger</th>
                      <th className="px-4 py-2.5 font-sans">Narration & Entity</th>
                      <th className="px-4 py-2.5 text-right font-sans">Debit ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Credit ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Balance ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-4 py-2 text-slate-500 font-mono text-[11px]">01-Nov-2026</td>
                      <td className="px-4 py-2 font-mono text-blue-600 font-semibold">OB-2026-001</td>
                      <td className="px-4 py-2 font-medium text-slate-800">1010-01 Ecobank USD Operating</td>
                      <td className="px-4 py-2 text-slate-600">Opening Balance Brought Forward</td>
                      <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">420,000.00</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">-</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">420,000.00</td>
                    </tr>
                    {initialReceipts.map((r, idx) => (
                      <tr key={`r-${r.id}`} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 text-slate-500 font-mono text-[11px]">{r.date}</td>
                        <td className="px-4 py-2 font-mono text-emerald-600 font-semibold">{r.voucherNo}</td>
                        <td className="px-4 py-2 font-medium text-slate-800">1020-01 Trade Receivables</td>
                        <td className="px-4 py-2 text-slate-600">Received from {r.receivedFrom} ({r.narration})</td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">{r.amount.toLocaleString()}.00</td>
                        <td className="px-4 py-2 text-right font-mono text-slate-400">-</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">
                          {(420000 + (idx + 1) * 45000).toLocaleString()}.00
                        </td>
                      </tr>
                    ))}
                    {initialPayments.map((p, idx) => (
                      <tr key={`p-${p.id}`} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 text-slate-500 font-mono text-[11px]">{p.date}</td>
                        <td className="px-4 py-2 font-mono text-purple-600 font-semibold">{p.voucherNo}</td>
                        <td className="px-4 py-2 font-medium text-slate-800">2010-01 Trade Payables</td>
                        <td className="px-4 py-2 text-slate-600">Disbursed to {p.paidTo} ({p.narration})</td>
                        <td className="px-4 py-2 text-right font-mono text-slate-400">-</td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-rose-600">{p.amount.toLocaleString()}.00</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">
                          {(555000 - (idx + 1) * 35000).toLocaleString()}.00
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold">
                      <td className="px-4 py-3 text-slate-900 uppercase text-xs" colSpan={4}>
                        Total Ledger Debits & Credits
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-blue-900">$577,900.00</td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-rose-900">$107,700.00</td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-emerald-800 font-extrabold">$470,200.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. TRIAL BALANCE REPORT */}
          {activeReport === 'TrialBalance' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Afri-Techs Trial Balance Summary</h2>
                <p className="text-xs text-slate-500">Summary verification of mathematical equality for debits and credits</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">Account Code</th>
                      <th className="px-4 py-2.5 font-sans">Account Title / Description</th>
                      <th className="px-4 py-2.5 font-sans">Classification</th>
                      <th className="px-4 py-2.5 text-right font-sans">Debit Balance ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Credit Balance ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {initialChartOfAccounts.map((acc) => (
                      <tr key={acc.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 font-mono font-semibold text-blue-600">{acc.accountCode}</td>
                        <td className="px-4 py-2 font-medium text-slate-800">{acc.accountName}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${acc.category === 'Asset'
                              ? 'bg-emerald-100 text-emerald-800'
                              : acc.category === 'Liability'
                                ? 'bg-amber-100 text-amber-800'
                                : acc.category === 'Revenue'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                          >
                            {acc.category}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">
                          {acc.category === 'Asset' || acc.category === 'Expense'
                            ? acc.currentBalance.toLocaleString() + '.00'
                            : '-'}
                        </td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">
                          {acc.category === 'Liability' || acc.category === 'Revenue' || acc.category === 'Equity'
                            ? acc.currentBalance.toLocaleString() + '.00'
                            : '-'}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100/90 font-bold font-sans">
                      <td className="px-4 py-3 text-slate-900 uppercase text-xs" colSpan={3}>
                        Grand Balanced Total
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-blue-900 font-extrabold">$2,237,200.00</td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-blue-900 font-extrabold">$2,237,200.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. PROFIT & LOSS REPORT */}
          {activeReport === 'PLAccount' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Profit & Loss Statement (Income Statement)</h2>
                <p className="text-xs text-slate-500">For the period ending 30-Nov-2026 (Currency: USD)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <span className="text-[10px] font-bold uppercase text-blue-600">Total Operating Revenue</span>
                  <p className="text-2xl font-extrabold text-blue-950 mt-1">$1,845,000</p>
                  <span className="text-[11px] text-blue-700">Structural steel & industrial orders</span>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <span className="text-[10px] font-bold uppercase text-amber-700">Cost of Goods Sold (COGS)</span>
                  <p className="text-2xl font-extrabold text-amber-950 mt-1">$980,000</p>
                  <span className="text-[11px] text-amber-700">Raw steel, billets & consumables</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <span className="text-[10px] font-bold uppercase text-emerald-700">Net Operating Profit</span>
                  <p className="text-2xl font-extrabold text-emerald-950 mt-1">$720,500</p>
                  <span className="text-[11px] text-emerald-700 font-semibold">39.05% Net Margin</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5">Category & Head</th>
                      <th className="px-4 py-2.5 text-right">Amount ($)</th>
                      <th className="px-4 py-2.5 text-right">% of Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="bg-slate-50/70 font-bold text-slate-700">
                      <td className="px-4 py-2" colSpan={3}>Operating Revenues</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 pl-8 text-slate-600">4010-01 Structural Steel & Beams Fabrication Sales</td>
                      <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">1,420,000.00</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-500">76.96%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 pl-8 text-slate-600">4020-01 High-Tensile Deformed Rebar Contracts</td>
                      <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">425,000.00</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-500">23.04%</td>
                    </tr>
                    <tr className="bg-blue-50 font-semibold text-blue-900">
                      <td className="px-4 py-2">Total Gross Revenue</td>
                      <td className="px-4 py-2 text-right font-mono">$1,845,000.00</td>
                      <td className="px-4 py-2 text-right font-mono">100.00%</td>
                    </tr>
                    <tr className="bg-slate-50/70 font-bold text-slate-700">
                      <td className="px-4 py-2" colSpan={3}>Less: Cost of Sales (COGS)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 pl-8 text-slate-600">5010-01 Raw Steel Billets & Heavy Coils Procurement</td>
                      <td className="px-4 py-2 text-right font-mono font-semibold text-rose-600">(820,000.00)</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-500">44.44%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 pl-8 text-slate-600">5020-01 Workshop Industrial Gases & Consumables</td>
                      <td className="px-4 py-2 text-right font-mono font-semibold text-rose-600">(160,000.00)</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-500">8.67%</td>
                    </tr>
                    <tr className="bg-emerald-50 font-bold text-emerald-950">
                      <td className="px-4 py-2">Gross Profit Margin</td>
                      <td className="px-4 py-2 text-right font-mono">$865,000.00</td>
                      <td className="px-4 py-2 text-right font-mono">46.88%</td>
                    </tr>
                    <tr className="bg-slate-50/70 font-bold text-slate-700">
                      <td className="px-4 py-2" colSpan={3}>Less: Administrative & Operating Expenses</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 pl-8 text-slate-600">6010-01 Usine Matoto & Heavy Machinery Electricity</td>
                      <td className="px-4 py-2 text-right font-mono font-semibold text-rose-600">(48,500.00)</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-500">2.63%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 pl-8 text-slate-600">6020-01 Industrial Machinery Straight-line Depreciation</td>
                      <td className="px-4 py-2 text-right font-mono font-semibold text-rose-600">(35,000.00)</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-500">1.90%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 pl-8 text-slate-600">6030-01 Port Logistics, Freight & Transport Charges</td>
                      <td className="px-4 py-2 text-right font-mono font-semibold text-rose-600">(61,000.00)</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-500">3.31%</td>
                    </tr>
                    <tr className="bg-slate-900 font-bold text-white">
                      <td className="px-4 py-3 uppercase">Net Operating Profit for Period</td>
                      <td className="px-4 py-3 text-right font-mono text-sm text-emerald-400 font-extrabold">$720,500.00</td>
                      <td className="px-4 py-3 text-right font-mono text-sm text-emerald-400">39.05%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. BALANCE SHEET REPORT */}
          {activeReport === 'BalanceSheet' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Consolidated Balance Sheet (Statement of Financial Position)</h2>
                <p className="text-xs text-slate-500">As of 30-Nov-2026 (Currency: USD)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assets Column */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-900 text-white font-bold text-xs uppercase flex justify-between">
                    <span>Assets</span>
                    <span>Amount ($)</span>
                  </div>
                  <table className="w-full text-xs">
                    <tbody className="divide-y divide-slate-100">
                      <tr className="bg-slate-50 font-bold text-slate-700">
                        <td className="px-4 py-2" colSpan={2}>Current Assets</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 pl-6 text-slate-600">Ecobank USD Operating Account</td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">584,200.00</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 pl-6 text-slate-600">Petty Cash Funds (Conakry & Boké)</td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">3,450.00</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 pl-6 text-slate-600">Trade Accounts Receivable (Mining Clients)</td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">428,000.00</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 pl-6 text-slate-600">Raw Steel Billets & Finished Stock Inventory</td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">975,000.00</td>
                      </tr>
                      <tr className="bg-slate-50 font-bold text-slate-700">
                        <td className="px-4 py-2" colSpan={2}>Non-Current / Fixed Assets</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 pl-6 text-slate-600">Messer CNC Plasma Cutting Plant</td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">111,000.00</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 pl-6 text-slate-600">25-Ton Double Girder Crane & Forklifts</td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">134,750.00</td>
                      </tr>
                      <tr className="bg-blue-50 font-bold text-blue-900">
                        <td className="px-4 py-2.5">Total Company Assets</td>
                        <td className="px-4 py-2.5 text-right font-mono text-sm">$2,236,400.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Liabilities & Equity Column */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-900 text-white font-bold text-xs uppercase flex justify-between">
                    <span>Liabilities & Equity</span>
                    <span>Amount ($)</span>
                  </div>
                  <table className="w-full text-xs">
                    <tbody className="divide-y divide-slate-100">
                      <tr className="bg-slate-50 font-bold text-slate-700">
                        <td className="px-4 py-2" colSpan={2}>Current Liabilities</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 pl-6 text-slate-600">Trade Accounts Payable (Steel Mills)</td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">218,500.00</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 pl-6 text-slate-600">TVA & Corporate Withholding Tax Accrued</td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">38,200.00</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 pl-6 text-slate-600">Short-Term Working Capital Facility</td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">150,000.00</td>
                      </tr>
                      <tr className="bg-slate-50 font-bold text-slate-700">
                        <td className="px-4 py-2" colSpan={2}>Shareholders' Equity</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 pl-6 text-slate-600">Paid-Up Share Capital (Statutory)</td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">1,109,200.00</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 pl-6 text-slate-600">Retained Earnings & Current Net Income</td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">720,500.00</td>
                      </tr>
                      <tr className="bg-emerald-50 font-bold text-emerald-900">
                        <td className="px-4 py-2.5">Total Liabilities & Equity</td>
                        <td className="px-4 py-2.5 text-right font-mono text-sm">$2,236,400.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. ACCOUNTS RECEIVABLE / PAYABLE SUMMARY */}
          {activeReport === 'RPSummery' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Accounts Receivable & Payable Master Summary</h2>
                <p className="text-xs text-slate-500">Consolidated exposure, credit terms, and settlement balances</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Receivables Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                    <span className="font-bold text-xs text-blue-900">Trade Receivables (Customers)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-900">
                      Total: $267,700
                    </span>
                  </div>
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2">Customer</th>
                        <th className="px-3 py-2">Credit Limit</th>
                        <th className="px-3 py-2 text-right">Outstanding</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {initialCustomers.map((c) => (
                        <tr key={c.id}>
                          <td className="px-3 py-2 font-medium text-slate-800">{c.name}</td>
                          <td className="px-3 py-2 font-mono text-slate-500">${c.creditLimit.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-blue-700">
                            ${c.outstandingBalance.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Payables Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
                    <span className="font-bold text-xs text-purple-900">Trade Payables (Vendors)</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-200 text-purple-900">
                      Total: $218,500
                    </span>
                  </div>
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2">Vendor Name</th>
                        <th className="px-3 py-2">Terms</th>
                        <th className="px-3 py-2 text-right">Outstanding</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {initialVendors.map((v, i) => (
                        <tr key={v.id}>
                          <td className="px-3 py-2 font-medium text-slate-800">{v.name}</td>
                          <td className="px-3 py-2 text-slate-500">{v.paymentTerms}</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-purple-700">
                            ${(145000 - i * 60000).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. STATEMENT OF ACCOUNTS */}
          {activeReport === 'StatementOfAccounts' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase">Selected Entity Statement</h3>
                  <p className="text-xs text-slate-500">Société Minière de Boké (SMB) - Account No: 1020-01</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Closing Balance Due</span>
                  <p className="text-lg font-extrabold text-blue-600 font-mono">$48,500.00</p>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">Date</th>
                      <th className="px-4 py-2.5 font-sans">Document No</th>
                      <th className="px-4 py-2.5 font-sans">Description</th>
                      <th className="px-4 py-2.5 text-right font-sans">Invoiced / Debit ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Received / Credit ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Balance ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    <tr>
                      <td className="px-4 py-2 text-slate-500 font-mono text-[11px]">01-Nov-2026</td>
                      <td className="px-4 py-2 font-mono text-slate-600">BF</td>
                      <td className="px-4 py-2 text-slate-700">Opening Balance Forwarded</td>
                      <td className="px-4 py-2 text-right font-mono font-semibold">52,400.00</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">-</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">52,400.00</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-slate-500 font-mono text-[11px]">10-Nov-2026</td>
                      <td className="px-4 py-2 font-mono text-emerald-600 font-semibold">RV-2026-081</td>
                      <td className="px-4 py-2 text-slate-700">Bank Wire Ecobank ECO-GN-99120</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">-</td>
                      <td className="px-4 py-2 text-right font-mono font-semibold text-emerald-600">52,400.00</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">0.00</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-slate-500 font-mono text-[11px]">11-Nov-2026</td>
                      <td className="px-4 py-2 font-mono text-blue-600 font-semibold">INV-2026-118</td>
                      <td className="px-4 py-2 text-slate-700">Supply of 120x Mining H-Beams (SO-2026-104)</td>
                      <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">48,500.00</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">-</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-blue-700">48,500.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. AGED RECEIVABLES / PAYABLES */}
          {activeReport === 'AgedRP' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Aged Receivables & Overdue Aging Analysis</h2>
                <p className="text-xs text-slate-500">Aging schedule categorized by 30-day buckets</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">Debtor / Client Name</th>
                      <th className="px-4 py-2.5 text-right font-sans">Current (0-30d)</th>
                      <th className="px-4 py-2.5 text-right font-sans">31 - 60 Days</th>
                      <th className="px-4 py-2.5 text-right font-sans">61 - 90 Days</th>
                      <th className="px-4 py-2.5 text-right font-sans">90+ Days</th>
                      <th className="px-4 py-2.5 text-right font-sans">Total Overdue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-800">Société Minière de Boké (SMB)</td>
                      <td className="px-4 py-2 text-right font-mono text-emerald-600 font-semibold">$48,500</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">-</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">-</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">-</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">$48,500</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-800">Compagnie des Bauxites de Guinée (CBG)</td>
                      <td className="px-4 py-2 text-right font-mono text-emerald-600 font-semibold">$85,000</td>
                      <td className="px-4 py-2 text-right font-mono text-amber-600 font-semibold">$40,000</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">-</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">-</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">$125,000</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-slate-800">Simandou Winning Consortium</td>
                      <td className="px-4 py-2 text-right font-mono text-emerald-600 font-semibold">$94,200</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">-</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">-</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400">-</td>
                      <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">$94,200</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td className="px-4 py-2.5 text-slate-900 uppercase text-xs">Total Aging Debt ($)</td>
                      <td className="px-4 py-2.5 text-right font-mono text-emerald-700">$227,700</td>
                      <td className="px-4 py-2.5 text-right font-mono text-amber-700">$40,000</td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-400">$0</td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-400">$0</td>
                      <td className="px-4 py-2.5 text-right font-mono text-blue-900 font-extrabold">$267,700</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. FIXED ASSET SCHEDULE */}
          {activeReport === 'FixedAsset' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Fixed Asset Schedule & Depreciation Register</h2>
                <p className="text-xs text-slate-500">Asset capitalized cost, accumulated write-off, and net book value (NBV)</p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 uppercase">
                    <tr>
                      <th className="px-4 py-2.5 font-sans">Asset Code</th>
                      <th className="px-4 py-2.5 font-sans">Asset Description</th>
                      <th className="px-4 py-2.5 font-sans">Acquisition Date</th>
                      <th className="px-4 py-2.5 text-right font-sans">Cost ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Depr. Rate</th>
                      <th className="px-4 py-2.5 text-right font-sans">Accum. Depr ($)</th>
                      <th className="px-4 py-2.5 text-right font-sans">Book Value ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {initialFixedAssets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 font-mono font-semibold text-blue-600">{asset.assetCode}</td>
                        <td className="px-4 py-2 font-medium text-slate-800">{asset.assetName}</td>
                        <td className="px-4 py-2 font-mono text-slate-500 text-[11px]">{asset.purchaseDate}</td>
                        <td className="px-4 py-2 text-right font-mono font-semibold text-slate-800">
                          ${asset.purchaseCost.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-right font-mono text-slate-600">{asset.depreciationRate}% p.a.</td>
                        <td className="px-4 py-2 text-right font-mono text-rose-600">
                          ${asset.accumulatedDepreciation.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-emerald-700">
                          ${asset.currentBookValue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold">
                      <td className="px-4 py-2.5 text-slate-900 uppercase text-xs" colSpan={3}>
                        Total Capital Assets Value
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-900">$415,000</td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-500">-</td>
                      <td className="px-4 py-2.5 text-right font-mono text-rose-800">$169,250</td>
                      <td className="px-4 py-2.5 text-right font-mono text-emerald-800 font-extrabold">$245,750</td>
                    </tr>
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

