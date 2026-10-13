'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDemo } from '@/context/DemoContext';
import { 
  Building2, 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Key
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin, currentAdmin, adminAccounts } = useDemo();

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!usernameInput.trim()) {
      setErrorMessage('Please enter your Indoor name or username');
      return;
    }
    if (!passwordInput.trim()) {
      setErrorMessage('Please enter your account password');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = loginAdmin(usernameInput, passwordInput);
      setLoading(false);
      if (res.success && res.account) {
        if (res.account.role === 'super_admin') {
          router.push('/admin/super');
        } else {
          router.push('/admin/venue');
        }
      } else {
        setErrorMessage(res.error || 'Invalid credentials');
      }
    }, 250);
  };

  const handleQuickDemoLogin = (username: string, pass: string) => {
    setUsernameInput(username);
    setPasswordInput(pass);
    setErrorMessage('');
    const res = loginAdmin(username, pass);
    if (res.success && res.account) {
      if (res.account.role === 'super_admin') {
        router.push('/admin/super');
      } else {
        router.push('/admin/venue');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[500px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 w-[450px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Main Page</span>
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
            Multi-Tenant Secure Admin
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 p-0.5 mx-auto shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Building2 className="w-7 h-7 text-blue-400" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white">
              Indoor Admin Login
            </h1>
            <p className="text-xs text-slate-400">
              Enter your indoor facility credentials to access your dedicated management portal.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label 
                htmlFor="admin-username-input" 
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Indoor Name or Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-username-input"
                  type="text"
                  placeholder="e.g. axion or AXION – Ambetenne"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="admin-password-input" 
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password-input"
                  type="password"
                  placeholder="Enter your password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick Demo Login Preset Buttons */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                1-Click Demo Login
              </span>
              <span className="text-[10px] text-slate-500">
                Pre-configured sample accounts
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('superadmin', 'admin123')}
                className="w-full p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-800/50 text-left transition-all flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <div>
                    <span className="font-bold text-purple-200 block">Platform Super-Admin</span>
                    <span className="text-[10px] text-purple-400">Can create accounts & manage all venues</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] bg-purple-900/60 px-2 py-0.5 rounded text-purple-200">
                  superadmin
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('axion', 'axion123')}
                className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left transition-all flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-bold text-white block">AXION – Ambetenne</span>
                    <span className="text-[10px] text-slate-400">Private Venue Admin</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  axion
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('colomboarena', 'arena123')}
                className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left transition-all flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="font-bold text-white block">Colombo Futsal Arena</span>
                    <span className="text-[10px] text-slate-400">Private Venue Admin</span>
                  </div>
                </div>
                <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  colomboarena
                </span>
              </button>
            </div>
          </div>

        </div>

        {/* Security Notice */}
        <div className="text-center text-[11px] text-slate-500">
          Strict Multi-Tenant Isolation • Venue admins can only view their own indoor facility data.
        </div>

      </div>
    </div>
  );
}
