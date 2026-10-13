'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';
import SuperAdminView from '@/components/admin/SuperAdminView';
import { ShieldAlert, ArrowLeft, Building2 } from 'lucide-react';

export default function SuperAdminPage() {
  const router = useRouter();
  const { currentAdmin } = useDemo();

  // If logged in as venue_admin, block access to super admin portal
  if (currentAdmin && currentAdmin.role === 'venue_admin') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-200">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-800/40">
              Access Restricted
            </span>
            <h1 className="text-xl font-bold text-white mt-2">
              Super Admin Access Only
            </h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              You are signed in as <strong className="text-white">{currentAdmin.indoorName}</strong> ({currentAdmin.username}). Venue accounts are strictly restricted to their own indoor facility management.
            </p>
          </div>

          <button
            onClick={() => router.push('/admin/venue')}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
          >
            <Building2 className="w-4 h-4" />
            <span>Return to {currentAdmin.indoorName} Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return <SuperAdminView />;
}
