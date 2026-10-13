'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Building2, 
  ShieldCheck, 
  User, 
  RotateCcw, 
  CalendarPlus, 
  Sparkles,
  Info
} from 'lucide-react';

export default function DemoRoleBar() {
  const { activeRole, setActiveRole, resetToDefaults, openBookingModal, currentAdmin, loginAdmin } = useDemo();
  const router = useRouter();
  const pathname = usePathname();

  const handleRoleChange = (role: 'customer' | 'venue_admin' | 'super_admin') => {
    setActiveRole(role);
    if (role === 'customer') {
      if (pathname.startsWith('/admin')) {
        router.push('/');
      }
    } else if (role === 'venue_admin') {
      if (!currentAdmin || currentAdmin.role !== 'venue_admin') {
        loginAdmin('axion', 'axion123');
      }
      router.push('/admin/venue');
    } else if (role === 'super_admin') {
      if (!currentAdmin || currentAdmin.role !== 'super_admin') {
        loginAdmin('superadmin', 'admin123');
      }
      router.push('/admin/super');
    }
  };

  return (
    <aside aria-label="Interactive Demo Controls" className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-emerald-500/20 text-slate-200 text-xs px-3 sm:px-6 py-2 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        
        {/* Left: Demo badge & notice */}
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">
            <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
            Prototype Demo Mode
          </span>
          <span className="hidden xl:inline text-slate-400 text-[11px] flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-500 inline" />
            Client-side simulation • Sri Lanka Indoor Sports Marketplace
          </span>
        </div>

        {/* Center: Role Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => handleRoleChange('customer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs ${
              activeRole === 'customer' && !pathname.startsWith('/admin')
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer Website</span>
          </button>

          <button
            onClick={() => handleRoleChange('venue_admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs ${
              activeRole === 'venue_admin' || pathname.startsWith('/admin/venue')
                ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Venue Admin <span className="opacity-80 font-normal hidden sm:inline">(AXION)</span></span>
          </button>

          <button
            onClick={() => handleRoleChange('super_admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 text-xs ${
              activeRole === 'super_admin' || pathname.startsWith('/admin/super')
                ? 'bg-purple-600 text-white font-bold shadow-sm shadow-purple-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Super-Admin</span>
          </button>
        </div>

        {/* Right: Quick shortcuts */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openBookingModal()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 font-medium transition-colors text-[11px]"
            title="Launch the 7-step customer booking wizard"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Quick Book Turf</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset prototype sample data to defaults?')) {
                resetToDefaults();
              }
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-colors text-[11px]"
            title="Reset bookings and custom pricing rules to demo default"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

      </div>
    </aside>
  );
}
