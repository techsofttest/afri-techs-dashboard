'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { companyData } from '@/lib/mock-data';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError('Invalid username or password. Please verify your credentials.');
        setIsSubmitting(false);
      }
}, 350);
  };

    return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 p-4 sm:p-6">
      {/* Top subtle bar */}
      <div className="w-full max-w-md mx-auto pt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Enterprise Security • 256-Bit SSL Encrypted</span>
      </div>

          {/* Main Centered Aesthetic Card */}
          <div className="w-full max-w-md mx-auto my-auto">
            <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 p-8 sm:p-10 transition-all">
              {/* Company Logo Header - Placed directly on the white background */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                  <img
                    src="/images/logo.png"
                    alt="Afri-Techs Company Logo"
                    className="h-24 sm:h-28 w-auto max-w-[280px] object-contain drop-shadow-xs"
                  />
                </div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  AFRI-TECHS ERP
                </h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Sign in to access your administrative dashboard
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-5 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Username or Email
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('Please contact the IT administrator to reset your account password.')}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-3.5 h-3.5"
                      />
                      <span>Remember me</span>
                    </label>
                  </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wide shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

    {/* Footer */}
    <footer className="w-full max-w-md mx-auto pb-4 text-center text-[11px] text-slate-500">
      &copy; {new Date().getFullYear()} {companyData.name}. All Rights Reserved.
    </footer>
  </div>
);
}
