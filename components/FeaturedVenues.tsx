'use client';

import React from 'react';
import Link from 'next/link';
import { useDemo } from '@/context/DemoContext';
import VenueCard from '@/components/VenueCard';
import { ChevronRight, Sparkles } from 'lucide-react';

export default function FeaturedVenues() {
  const { venues } = useDemo();
  const activeVenues = venues.filter(v => v.isActive);

  return (
    <section className="py-16 sm:py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Sports Venues</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Featured Indoor Sports Venues
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Inspect verified pitches, check transparent hourly pricing rules, and experience seamless booking.
            </p>
          </div>

          <Link
            href="/venues"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>Explore All Venues</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>

        {/* Demo Callout banner */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <span>Are you an indoor sports venue owner in Sri Lanka?</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl">
              Eliminate double-bookings, automate your court schedule, and accept reservations 24/7 without changing your pay-at-venue process.
            </p>
          </div>
          <Link
            href="/admin/venue"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all shrink-0"
          >
            Preview Venue Admin Dashboard →
          </Link>
        </div>

      </div>
    </section>
  );
}
