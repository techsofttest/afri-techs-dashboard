'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PieChart,
  Compass,
  MapPin,
  Building2,
  ChevronRight,
  LogOut,
  FileSpreadsheet,
  FileBarChart,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      name: 'Admin Overview',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
      allowed: true
    },
    {
      name: 'Accounts Module',
      href: '/accounts',
      icon: PieChart,
      badge: 'Finance',
      allowed: user ? user.permAccount : true
    },
    {
      name: 'CRM Module',
      href: '/crm',
      icon: Compass,
      badge: 'Sales',
      allowed: user ? user.permCRM : true
    },
    {
      name: 'Procurement Module',
      href: '/procurement',
      icon: MapPin,
      badge: 'Supply',
      allowed: user ? user.permProcurement : true
    }
  ];

  const reportItems = [
    {
      name: 'Accounts Reports',
      href: '/accounts?view=reports',
      icon: FileSpreadsheet,
      badge: '8 Reports',
      allowed: user ? user.permAccount : true
    },
    {
      name: 'CRM Sales Reports',
      href: '/crm?view=reports',
      icon: FileBarChart,
      badge: '15 Reports',
      allowed: user ? user.permCRM : true
    },
    {
      name: 'Procurement Reports',
      href: '/procurement?view=reports',
      icon: ClipboardList,
      badge: '8 Reports',
      allowed: user ? user.permProcurement : true
    }
  ];

  const adminItems = [
    {
      name: 'Companies',
      href: '/company',
      icon: Building2,
      allowed: true
    }
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const userInitials = user?.fullName
    ? user.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : user?.username?.slice(0, 2).toUpperCase() || 'AD';

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out bg-[#0b1120] text-slate-300 border-r border-slate-800/80 ${isOpen ? 'w-64' : 'w-20'
        } flex flex-col`}
    >
      {/* Brand Header with Company Logo */}
      <div className="flex items-center justify-center h-20 px-4 bg-[#070b14] border-b border-slate-800/80">
        <Link href="/" className="flex items-center justify-center w-full overflow-hidden">
          {isOpen ? (
            <div className="flex items-center justify-center py-1">
              <img
                src="/images/logo.png"
                alt="Afri-Techs Logo"
                className="h-11 w-auto max-w-[190px] object-contain drop-shadow"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <img
              src="/images/logo-sm.png"
              alt="Logo"
              className="h-8 w-8 object-contain"
              onError={(e) => {
                e.currentTarget.src = '/images/favicon.png';
              }}
            />
          )}
        </Link>
      </div>


      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          {isOpen && (
            <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Core Modules
            </p>
          )}
          <nav className="space-y-1">
            {navigationItems
              .filter((item) => item.allowed)
              .map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${active
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/30'
                      : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                      }`}
                    title={!isOpen ? item.name : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                    {isOpen && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{item.name}</span>
                        {item.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${active
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-800 text-slate-400'
                              }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* Enterprise Reports Section */}
        <div>
          {isOpen && (
            <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Reports</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 font-semibold">
                ERP Reports
              </span>
            </p>
          )}
          <nav className="space-y-1">
            {reportItems
              .filter((item) => item.allowed)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-slate-800/60 hover:text-white text-slate-400 group"
                    title={!isOpen ? item.name : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    {isOpen && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{item.name}</span>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold bg-slate-800 text-slate-400 group-hover:bg-blue-900/50 group-hover:text-blue-300">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* Administration Section */}
        <div>
          {isOpen && (
            <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Administration
            </p>
          )}
          <nav className="space-y-1">
            {adminItems
              .filter((item) => item.allowed)
              .map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${active
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/30'
                      : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                      }`}
                    title={!isOpen ? item.name : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                    {isOpen && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{item.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                    )}
                  </Link>
                );
              })}

            {/* Direct Logout Nav Link */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors text-left"
              title={!isOpen ? 'Logout' : undefined}
            >
              <LogOut className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-rose-400" />
              {isOpen && <span className="truncate">Sign Out</span>}
            </button>
          </nav>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 bg-[#070b14] border-t border-slate-800/80">
        {isOpen ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-[11px] shrink-0">
                {userInitials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate flex items-center gap-1">
                  {user?.fullName || user?.username || 'Admin'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{user?.role || 'Administrator'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={logout}
              title="Logout"
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors text-xs font-bold"
            >
              {userInitials}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
