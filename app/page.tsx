'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';
import { 
  Calendar, 
  ShieldCheck, 
  ChevronRight, 
  Clock, 
  Banknote, 
  CheckCircle2, 
  MapPin, 
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { openBookingModal, currentAdmin } = useDemo();

  const handleContinueAsAdmin = () => {
    if (currentAdmin) {
      if (currentAdmin.role === 'super_admin') {
        router.push('/admin/super');
      } else {
        router.push('/admin/venue');
      }
    } else {
      router.push('/admin/login');
    }
  };

  return (
    <main className="flex-1 flex flex-col justify-center bg-slate-950 text-slate-100 relative overflow-hidden py-12 sm:py-20 px-4 sm:px-6 lg:px-8">


      <div className="max-w-4xl mx-auto w-full relative z-10 space-y-10 sm:space-y-14 text-center">
        
        {/* Simple Brand Header */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sri Lanka&apos;s Indoor Sports Reservation System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Book Indoor Turfs <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-lime-400">
              Without the Confusion
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
            Clean and simple for everyone. No technical skills, passwords, or complicated forms required. Choose what you need below to get started immediately.
          </p>
        </div>

        {/* PRIMARY TWO ACTIONS - Minimal & Prominent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto text-left">
          
          {/* Button 1: Book a Turf */}
          <div
            onClick={() => openBookingModal()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openBookingModal()}
            className="group relative cursor-pointer rounded-3xl p-7 sm:p-8 bg-gradient-to-b from-slate-900 to-slate-900/90 border-2 border-emerald-500/40 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  For Customers & Players
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-emerald-300 transition-colors">
                  Book a Turf
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  Reserve indoor futsal pitches, badminton courts, and cricket nets in 30-minute sessions. Book 1 hr, 2 hrs (6–8 PM), or 2.5 hrs (8–10:30 PM). Pay cash or card at the venue counter.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 group-hover:underline">
                Start Quick Booking
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/30 group-hover:bg-emerald-400 transition-colors">
                Book Now
              </span>
            </div>
          </div>

          {/* Button 2: Continue as Admin */}
          <div
            onClick={handleContinueAsAdmin}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleContinueAsAdmin()}
            className="group relative cursor-pointer rounded-3xl p-7 sm:p-8 bg-gradient-to-b from-slate-900 to-slate-900/90 border-2 border-blue-500/40 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Building2 className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  For Indoor Facility Owners
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-blue-300 transition-colors">
                  Continue as Admin
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  Log in to your private indoor admin dashboard with your indoor credentials. Manage daily reservations, view pitch occupancy, set custom pricing rules, and track revenue.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1 group-hover:underline">
                {currentAdmin ? `Open ${currentAdmin.indoorName}` : 'Indoor Owner Login'}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-black text-xs shadow-md shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
                Admin Portal
              </span>
            </div>
          </div>

        </div>

        {/* Minimal 3-Point Reassurance Strip */}
        <div className="pt-2 border-t border-slate-900 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            
            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/60 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">30-Min Sessions</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Book multi-hour sessions like 6pm–8pm or 8pm–10:30pm with ease.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/60 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                <Banknote className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Pay at the Venue</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  No online card needed today. Pay at the indoor reception desk.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/60 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Dedicated Indoor Portals</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Each indoor owner has their own private admin account and dashboard.
                </p>
              </div>
            </div>

          </div>

          <div className="mt-8 text-center">
            <Link
              href="/venues"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <span>Want to explore all venue pictures, turf specs, and amenities?</span>
              <strong className="text-emerald-400 flex items-center gap-0.5">
                Explore All Venues <ArrowRight className="w-3.5 h-3.5" />
              </strong>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
