'use client';

import React, { useState } from 'react';
import { Lock, Search, Calendar, UserCheck, CheckCircle2 } from 'lucide-react';

interface AccountingPeriodBarProps {
  currentYear?: number;
  currentMonth?: number;
  onPeriodChange?: (year: number, month: number) => void;
}

export default function AccountingPeriodBar({
  currentYear = 2026,
  currentMonth = 11,
  onPeriodChange
}: AccountingPeriodBarProps) {
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleLock = () => {
    const confirmed = window.confirm(
      'Change accounting period & year?\nNo transactions can be posted prior to the accounting period!'
    );
    if (confirmed) {
      setIsLocked(true);
      showToast(`Accounting Period locked to ${months[selectedMonth - 1]} ${selectedYear}`);
      if (onPeriodChange) onPeriodChange(selectedYear, selectedMonth);
    }
  };

  const handleSearch = () => {
    showToast(`Loaded records for ${months[selectedMonth - 1]} ${selectedYear}`);
    if (onPeriodChange) onPeriodChange(selectedYear, selectedMonth);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-3.5 mb-5">
        {toastMessage && (
          <div className="mb-3 px-3 py-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-emerald-700 font-bold ml-2">
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Year & Month Selection */}
          <div className="lg:col-span-5 flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                Period Year:
              </span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value={selectedYear - 1}>{selectedYear - 1}</option>
                <option value={selectedYear}>{selectedYear}</option>
                <option value={selectedYear + 1}>{selectedYear + 1}</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                Month:
              </span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons: Lock & Search */}
          <div className="lg:col-span-3 flex items-center gap-2 justify-start lg:justify-center">
            <button
              onClick={handleLock}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>

            <button
              onClick={handleSearch}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg shadow-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Filter</span>
            </button>

            {isLocked && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  Active
                </span>
          )}
              </div>

        {/* User and Date Info */}
            <div className="lg:col-span-4 flex items-center justify-between lg:justify-end gap-4 text-xs text-slate-600 border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-100">
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-medium text-slate-400">User:</span>
                <span className="font-semibold text-slate-800">Admin</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-medium text-slate-400">Date:</span>
                <span className="font-semibold text-slate-800">13-Nov-2026</span>
              </div>
            </div>
          </div>
        </div>
        );
}
