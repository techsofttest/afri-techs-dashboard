'use client';

import React, { useState } from 'react';
import {
  Menu,
  Search,
  Maximize2,
  Bell,
  HelpCircle,
  Building,
  CheckCircle,
  AlertTriangle,
  LogOut,
  ShieldCheck,
  UserCheck,
  Globe
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => { });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
        setIsFullscreen(false);
      }
    }
  };

  const notifications = [
    {
      id: 1,
      title: 'CR License Renewal Warning',
      desc: 'Commercial Registration expires in 15 days.',
      time: '10m ago',
      type: 'warning'
    },
    {
      id: 2,
      title: 'New Material Requisition Approved',
      desc: 'MR-2026-052 has been signed off by Workshop Supervisor.',
      time: '1h ago',
      type: 'success'
    },
    {
      id: 3,
      title: 'Quotation Accepted by Atlas Infra',
      desc: 'SQ-2026-115 ($64,200) ready for Sales Order conversion.',
      time: '2h ago',
      type: 'info'
    }
  ];

  const userInitials = user?.fullName
    ? user.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : user?.username?.slice(0, 2).toUpperCase() || 'AD';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left Side: Toggle and Global Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative hidden sm:block w-64 md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right Side: Quick Actions, Company Indicator, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Company Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <Building className="w-4 h-4 text-cyan-600" />
            <span className="font-semibold text-slate-700">{t('hq_indicator')}</span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-600 font-medium">{t('live_db')}</span>
          </div>

          {/* Global Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-all shadow-2xs"
            title={language === 'en' ? 'Passer en Français' : 'Switch to English'}
          >
            <Globe className="w-4 h-4 text-cyan-600" />
            <span className="flex items-center gap-1 text-[11px]">
              <span className={language === 'en' ? 'text-blue-600 font-bold' : 'text-slate-400 font-normal'}>EN</span>
              <span className="text-slate-300">/</span>
              <span className={language === 'fr' ? 'text-blue-600 font-bold' : 'text-slate-400 font-normal'}>FR</span>
            </span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 className={`w-4 h-4 ${isFullscreen ? 'text-cyan-600' : ''}`} />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">{t('system_notifications')}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700">
                    {t('new_notifications')}
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-2.5">
                        {n.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{n.desc}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-cyan-600 hover:text-cyan-800 font-semibold"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown Menu */}
          <div className="relative pl-2 border-l border-slate-200">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 hover:opacity-85 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-cyan-500/30">
                {userInitials}
              </div>
              <div className="hidden md:block text-left">
                <span className="block text-xs font-bold text-slate-800 leading-tight">
                  {user?.fullName || user?.username || 'Admin'}
                </span>
                <span className="block text-[10px] text-slate-500 font-medium leading-tight">
                  {user?.role || 'Administrator'}
                </span>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800">{user?.fullName || user?.username}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-50 text-cyan-700">
                    {user?.role}
                  </span>
                </div>

                <div className="py-1 text-xs text-slate-700">
                  <div className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    <span>{t('my_account')}</span>
                  </div>
                  <div className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>{t('access_rights')}</span>
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('sign_out')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
