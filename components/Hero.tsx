'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';
import { 
  Search, 
  MapPin, 
  Trophy, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function Hero() {
  const router = useRouter();
  const { openBookingModal } = useDemo();
  
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedDistrict) params.set('district', selectedDistrict);
    if (selectedSport) params.set('sport', selectedSport);
    if (searchQuery) params.set('q', searchQuery);
    router.push(`/venues?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-900">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-slate-300 text-xs sm:text-sm shadow-inner shadow-black/50">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-emerald-400">Sri Lanka’s Indoor Sports Network</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 hidden sm:inline">Featuring AXION – Ambetenne</span>
          </div>
        </div>

        {/* Hero Headline & Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Your Next Game <br />
            <span className="bg-gradient-to-r from-emerald-400 via-lime-400 to-teal-300 bg-clip-text text-transparent">
              Starts Here.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-normal max-w-2xl mx-auto">
            Discover indoor sports venues, explore available courts, and book your next game across Sri Lanka.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => openBookingModal('venue-axion')}
              id="hero-book-turf-btn"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
              <span>Book a Turf</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <Link
              href="/venues"
              id="hero-explore-venues-btn"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-base border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Explore Venues</span>
            </Link>
          </div>

          {/* Quick value badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs sm:text-sm text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant Confirmation</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Pay at the Venue</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No Account Needed</span>
            </span>
          </div>
        </div>

        {/* Compact Search Panel */}
        <div className="mt-10 sm:mt-12 max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xl shadow-black/80 backdrop-blur-xl">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            
            {/* District select */}
            <div className="sm:col-span-3 relative">
              <label htmlFor="hero-district-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
                District
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="hero-district-select"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="">All Districts</option>
                  <option value="Kandy">Kandy (Central)</option>
                  <option value="Colombo">Colombo (Western)</option>
                  <option value="Gampaha">Gampaha (Western)</option>
                  <option value="Kurunegala">Kurunegala (North West)</option>
                </select>
              </div>
            </div>

            {/* Sport select */}
            <div className="sm:col-span-3 relative">
              <label htmlFor="hero-sport-select" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
                Sport
              </label>
              <div className="relative">
                <Trophy className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="hero-sport-select"
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="">All Sports</option>
                  <option value="Football">Football / Futsal</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Snooker">Snooker & Billiards</option>
                  <option value="Cricket Nets">Cricket Nets</option>
                  <option value="Basketball">Basketball</option>
                </select>
              </div>
            </div>

            {/* Venue Search query */}
            <div className="sm:col-span-4 relative">
              <label htmlFor="hero-venue-search" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
                Venue Name
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="hero-venue-search"
                  type="text"
                  placeholder="e.g. AXION, Colombo Arena..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="sm:col-span-2 sm:self-end pt-1 sm:pt-0">
              <button
                type="submit"
                id="hero-search-submit-btn"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>

          </form>
        </div>

        {/* Polished Visual Showcase Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
          
          {/* Card 1: Football Turf */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group shadow-lg">
            <div className="h-44 sm:h-52 w-full relative">
              <Image
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80"
                alt="Indoor Football & Futsal Turf"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-emerald-500/40 text-[11px] font-bold text-emerald-400">
                Football & Futsal
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-bold text-sm">FIFA-Standard AstroTurf</p>
                <p className="text-slate-400 text-xs">High-grip monofilament turf with floodlights</p>
              </div>
            </div>
          </div>

          {/* Card 2: Badminton Courts */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group shadow-lg">
            <div className="h-44 sm:h-52 w-full relative">
              <Image
                src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80"
                alt="Indoor Badminton Court"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-emerald-500/40 text-[11px] font-bold text-emerald-400">
                Badminton Courts
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-bold text-sm">Synthetic PVC Pro Mats</p>
                <p className="text-slate-400 text-xs">Anti-glare high bay illumination & pro nets</p>
              </div>
            </div>
          </div>

          {/* Card 3: Snooker & Indoor Sports */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group shadow-lg">
            <div className="h-44 sm:h-52 w-full relative">
              <Image
                src="https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=800&q=80"
                alt="Snooker & Billiards Lounge"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-emerald-500/40 text-[11px] font-bold text-emerald-400">
                Snooker & 8-Ball
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-bold text-sm">Tournament Slate Beds</p>
                <p className="text-slate-400 text-xs">Aramith 1G balls & air-conditioned lounge</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
