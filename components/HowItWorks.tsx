'use client';

import React from 'react';
import { 
  Search, 
  CalendarClock, 
  Banknote, 
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useDemo } from '@/context/DemoContext';

export default function HowItWorks() {
  const { openBookingModal } = useDemo();

  const steps = [
    {
      step: '01',
      title: 'Find an Indoor Venue',
      subtitle: 'Discover Sri Lanka’s top centres',
      description: 'Search by district, sport, or facility name. Compare artificial turf surfaces, court specs, lighting, and hourly rates in one place.',
      icon: Search,
      accent: 'emerald',
      features: ['Filter by Kandy, Colombo, etc.', 'Clear photos & amenity lists', 'Transparent hourly pricing'],
    },
    {
      step: '02',
      title: 'Choose Facility & Time',
      subtitle: 'Real-time slot availability',
      description: 'Select your preferred turf pitch, badminton court, or snooker table. Pick date and view live time slots with automatic peak/off-peak pricing.',
      icon: CalendarClock,
      accent: 'lime',
      features: ['Live color-coded slot status', 'Prevents double-bookings', 'Flexible durations'],
    },
    {
      step: '03',
      title: 'Confirm & Pay at Venue',
      subtitle: 'No advance online payment',
      description: 'Quick mobile verification without cumbersome account registration. Receive an instant booking reference and pay comfortably at the counter when you play.',
      icon: Banknote,
      accent: 'teal',
      features: ['Instant SMS/Pass confirmation', 'Zero credit card required', 'Direct payment at counter'],
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
      
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Frictionless Booking
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">
            How Courtly Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Three straightforward steps from selecting your preferred arena to kicking off on the pitch.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Step Pill */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-2xl font-black text-slate-700 group-hover:text-emerald-500/50 transition-colors">
                    {item.step}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                      {item.subtitle}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    {item.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom line connector visual on desktop */}
                {index < 2 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                    <ChevronRight className="w-6 h-6 text-slate-700" />
                  </div>
                )}
              </div>
            );
          })}

        </div>

        {/* CTA Bar */}
        <div className="mt-14 text-center">
          <button
            onClick={() => openBookingModal('venue-axion')}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2"
          >
            <span>Try the Booking Experience</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
