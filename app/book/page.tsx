'use client';

import React, { useEffect } from 'react';
import { useDemo } from '@/context/DemoContext';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronRight, Trophy } from 'lucide-react';

export default function BookPage() {
  const { openBookingModal } = useDemo();
  const router = useRouter();

  useEffect(() => {
    openBookingModal('venue-axion');
  }, [openBookingModal]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
          <Calendar className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-white">Court Booking Wizard</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Opening the interactive reservation dialog for AXION – Ambetenne and Sri Lanka indoor facilities...
        </p>
        <button
          onClick={() => openBookingModal('venue-axion')}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
        >
          <span>Open Booking Wizard</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
