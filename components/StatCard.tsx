'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  bgColor?: 'cadet' | 'navy' | 'emerald' | 'amber';
  trend?: string;
  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  subValue,
  icon: Icon,
  bgColor = 'cadet',
  trend,
  onClick
}: StatCardProps) {
  // Refined modern aesthetic styles: clean cards with soft accent iconography
  const accentStyles = {
      cadet: {
        border: 'border-l-4 border-l-teal-600',
        iconBg: 'bg-teal-50 text-teal-700',
        glow: 'group-hover:border-teal-300'
      },
      navy: {
        border: 'border-l-4 border-l-indigo-600',
        iconBg: 'bg-indigo-50 text-indigo-700',
        glow: 'group-hover:border-indigo-300'
      },
      emerald: {
        border: 'border-l-4 border-l-emerald-600',
        iconBg: 'bg-emerald-50 text-emerald-700',
        glow: 'group-hover:border-emerald-300'
      },
      amber: {
        border: 'border-l-4 border-l-amber-500',
        iconBg: 'bg-amber-50 text-amber-700',
        glow: 'group-hover:border-amber-300'
      }
    };

    const style = accentStyles[bgColor];

    return(
    <div
      onClick = { onClick }
  className = {`group bg-white rounded-xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 cursor-pointer ${style.border} ${style.glow}`
}
    >
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {title}
        </p>
        <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {value}
        </h3>
        {subValue && (
          <p className="text-xs text-slate-400 font-medium">{subValue}</p>
        )}
      </div>

          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${style.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>

          {trend && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-medium">Performance:</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {trend}
              </span>
            </div>
      )}
      </div>
      );
}
