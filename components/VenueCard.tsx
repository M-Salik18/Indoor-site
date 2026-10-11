'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDemo } from '@/context/DemoContext';
import { Venue } from '@/types';
import { 
  MapPin, 
  Phone, 
  Star, 
  ChevronRight, 
  Clock, 
  Sparkles,
  Zap
} from 'lucide-react';

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const { openBookingModal } = useDemo();

  return (
    <div className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Image & Badges */}
      <div>
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
          <Image
            src={venue.heroImage}
            alt={venue.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          
          {/* District Pill */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 text-xs font-semibold text-white">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{venue.district}</span>
          </div>

          {/* Rating Pill */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-lg border border-amber-500/30 text-xs font-bold text-amber-300">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{venue.rating}</span>
            <span className="text-[10px] text-slate-400 font-normal">({venue.reviewCount})</span>
          </div>

          {/* Special Flagship Badge for AXION */}
          {venue.id === 'venue-axion' && (
            <div className="absolute bottom-3 left-3 bg-emerald-500/90 backdrop-blur-md text-slate-950 px-2 py-0.5 rounded font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Pilot Partner Venue
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-3">
          
          <div>
            <Link 
              href={`/venues/${venue.slug}`}
              className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1"
            >
              {venue.name}
            </Link>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 line-clamp-1">
              <span>{venue.city}, {venue.district} District</span>
            </p>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {venue.description}
          </p>

          {/* Sports Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {venue.sportsOffered.map((sport) => (
              <span
                key={sport}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-emerald-300 border border-slate-700/60"
              >
                {sport}
              </span>
            ))}
          </div>

          {/* Public Phone & Hours */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{venue.phone}</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <Clock className="w-3 h-3" />
                <span>Open Daily</span>
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Pricing & Action Buttons */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">From</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-extrabold text-emerald-400">
              LKR {venue.startingPricePerHour.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400">/hr</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/venues/${venue.slug}`}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            Details
          </Link>
          <button
            onClick={() => openBookingModal(venue.id)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Book</span>
          </button>
        </div>
      </div>

    </div>
  );
}
