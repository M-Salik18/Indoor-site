'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDemo } from '@/context/DemoContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  Zap, 
  ArrowLeft,
  Building,
  Info
} from 'lucide-react';

interface VenueDetailClientProps {
  slugOrId: string;
}

export default function VenueDetailClient({ slugOrId }: VenueDetailClientProps) {
  const { venues, facilities, pricingRules, openBookingModal } = useDemo();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Find venue by slug or id
  const venue = venues.find(v => v.slug === slugOrId || v.id === slugOrId) || venues[0];
  const venueFacilities = facilities.filter(f => f.venueId === venue.id && f.isActive);
  const venuePricingRules = pricingRules.filter(r => r.venueId === venue.id);

  const images = venue.galleryImages && venue.galleryImages.length > 0 
    ? venue.galleryImages 
    : [venue.heroImage];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb / Back button */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <Link
            href="/venues"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Venues</span>
          </Link>

          <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-emerald-400 font-semibold text-[11px]">
            {venue.district} District • Sri Lanka
          </span>
        </div>

        {/* Hero Gallery & Quick Meta */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Photos (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
              <Image
                src={images[selectedPhotoIndex] || venue.heroImage}
                alt={venue.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-all duration-300"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              {venue.id === 'venue-axion' && (
                <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-md text-slate-950 px-3 py-1 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                  Primary Pilot Partner
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedPhotoIndex === idx 
                        ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/30' 
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Venue Main Details Box (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {venue.city}, {venue.district}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{venue.rating}</span>
                  <span className="text-slate-500 font-normal">({venue.reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {venue.name}
              </h1>

              <p className="text-xs text-slate-400 flex items-start gap-1.5 mt-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{venue.address}</span>
              </p>
            </div>

            {/* Contact & Hours Grid */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Public Phone</span>
                <a href={`tel:${venue.phone}`} className="text-slate-200 font-semibold hover:text-emerald-400 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{venue.phone}</span>
                </a>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Operating Hours</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{venue.openingHours}</span>
                </span>
              </div>
            </div>

            {/* Pricing starting banner */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Starting Rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-emerald-400">
                    LKR {venue.startingPricePerHour.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">/ hour</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-emerald-300 block">
                  Pay at Venue
                </span>
                <span className="text-[10px] text-slate-500">
                  Zero online advance fee
                </span>
              </div>
            </div>

            {/* Main Action Button */}
            <button
              onClick={() => openBookingModal(venue.id)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>Book a Turf or Court at {venue.name.split('–')[0].trim()}</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            {venue.id === 'venue-axion' && (
              <div className="pt-2">
                <Link
                  href="/admin/venue"
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
                >
                  <Building className="w-4 h-4 text-blue-400" />
                  <span>Manage in Venue Admin (Demo)</span>
                </Link>
              </div>
            )}

          </div>

        </div>

        {/* Venue Facilities List (Data-driven!) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Available Facilities ({venueFacilities.length})
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Turf Pitches, Courts & Tables at {venue.name}
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Only facilities configured by this venue are displayed here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {venueFacilities.map((fac) => (
              <div
                key={fac.id}
                className="rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 p-5 flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800">
                      {fac.sports.join(' / ')}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {fac.slotDurationMinutes}m slot
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {fac.name}
                  </h3>

                  {fac.surfaceType && (
                    <p className="text-xs text-slate-400 mt-1">
                      {fac.surfaceType}
                    </p>
                  )}

                  <div className="mt-3 space-y-1.5 border-t border-slate-900 pt-3">
                    {fac.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between">
                  <button
                    onClick={() => openBookingModal(venue.id, fac.id)}
                    className="w-full py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold text-xs border border-emerald-500/30 transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Check Availability</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Schedule Table (Section 10 Flexible Pricing Demonstration) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Transparent Rates
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Venue Hourly Pricing Schedule
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>Configurable in Venue Admin Dashboard</span>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Each venue maintains independent hourly pricing rules for weekdays, weekends, and peak night hours.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Facility</th>
                  <th className="py-3 px-4">Day Type</th>
                  <th className="py-3 px-4">Time Window</th>
                  <th className="py-3 px-4">Hourly Price (LKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {venuePricingRules.map((rule) => {
                  const fac = facilities.find(f => f.id === rule.facilityId);
                  return (
                    <tr key={rule.id} className="hover:bg-slate-950/40">
                      <td className="py-3 px-4 font-bold text-white">
                        {fac?.name || 'All Facilities'}
                      </td>
                      <td className="py-3 px-4 capitalize font-semibold text-slate-300">
                        {rule.dayType === 'all' ? 'All Days (Mon–Sun)' : rule.dayType}
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono">
                        {rule.startTime} – {rule.endTime === '00:00' ? '12:00 AM' : rule.endTime}
                      </td>
                      <td className="py-3 px-4 font-black text-emerald-400 text-sm">
                        LKR {rule.pricePerHour.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Amenities & Overview Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-white">
              About {venue.name}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {venue.description}
            </p>
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Opening Days & Policies
              </h4>
              <p className="text-xs text-slate-400">
                Open {venue.openingDays}. Court bookings operate on 60-minute blocks with no advance deposit required. Cancellations are free up to 4 hours in advance.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-white">
              Arena Amenities
            </h3>
            <div className="space-y-2.5">
              {venue.amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
