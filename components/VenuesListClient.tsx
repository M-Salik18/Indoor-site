'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';
import VenueCard from '@/components/VenueCard';
import { 
  Search, 
  MapPin, 
  Trophy, 
  Filter, 
  SlidersHorizontal, 
  X, 
  Building2,
  Sparkles
} from 'lucide-react';
import { DistrictType, SportType } from '@/types';

export default function VenuesListClient() {
  const searchParams = useSearchParams();
  const { venues } = useDemo();

  // Initial filter values from URL params
  const initialDistrict = searchParams.get('district') || '';
  const initialSport = searchParams.get('sport') || '';
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [selectedSport, setSelectedSport] = useState<string>(initialSport);
  const [maxPrice, setMaxPrice] = useState<number>(4000);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating_desc' | 'name'>('rating_desc');

  // Filter & sort logic
  const filteredVenues = useMemo(() => {
    return venues.filter((v) => {
      if (!v.isActive) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = v.name.toLowerCase().includes(q);
        const matchCity = v.city.toLowerCase().includes(q);
        const matchDistrict = v.district.toLowerCase().includes(q);
        const matchSports = v.sportsOffered.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchCity && !matchDistrict && !matchSports) return false;
      }

      // District filter
      if (selectedDistrict && v.district !== selectedDistrict) {
        return false;
      }

      // Sport filter
      if (selectedSport && !v.sportsOffered.includes(selectedSport as SportType)) {
        return false;
      }

      // Max price filter
      if (v.startingPricePerHour > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.startingPricePerHour - b.startingPricePerHour;
      if (sortBy === 'price_desc') return b.startingPricePerHour - a.startingPricePerHour;
      if (sortBy === 'rating_desc') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [venues, searchQuery, selectedDistrict, selectedSport, maxPrice, sortBy]);

  const hasActiveFilters = Boolean(searchQuery || selectedDistrict || selectedSport || maxPrice < 4000);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDistrict('');
    setSelectedSport('');
    setMaxPrice(4000);
    setSortBy('rating_desc');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Sri Lanka Multi-Venue Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Explore Indoor Sports Centres
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Compare court specifications, live hourly rates, and book your next football, futsal, badminton, cricket, or snooker slot.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center">
            
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <label htmlFor="venue-filter-search" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
                Search Venue or City
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="venue-filter-search"
                  type="text"
                  placeholder="e.g. AXION, Ambetenne, Kandy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* District Select */}
            <div className="lg:col-span-3 relative">
              <label htmlFor="venue-filter-district" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
                District
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="venue-filter-district"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">All Districts ({venues.length})</option>
                  <option value="Kandy">Kandy (Central)</option>
                  <option value="Colombo">Colombo (Western)</option>
                  <option value="Gampaha">Gampaha (Western)</option>
                  <option value="Kurunegala">Kurunegala (North West)</option>
                </select>
              </div>
            </div>

            {/* Sport Select */}
            <div className="lg:col-span-3 relative">
              <label htmlFor="venue-filter-sport" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
                Sport
              </label>
              <div className="relative">
                <Trophy className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="venue-filter-sport"
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">All Sports</option>
                  <option value="Football">Football / Futsal</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Snooker">Snooker & 8-Ball</option>
                  <option value="Cricket Nets">Cricket Nets</option>
                  <option value="Basketball">Basketball</option>
                </select>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:col-span-2 relative">
              <label htmlFor="venue-filter-sort" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 ml-1">
                Sort By
              </label>
              <select
                id="venue-filter-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="rating_desc">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>

          </div>

          {/* Secondary filter: Price slider & reset */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-semibold">
                Starting Rate up to: <strong className="text-emerald-400">LKR {maxPrice.toLocaleString()}/hr</strong>
              </span>
              <input
                type="range"
                min={1500}
                max={4000}
                step={250}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-emerald-500 w-32 cursor-pointer"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 self-start sm:self-auto"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Count & Active Filter Pills */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{filteredVenues.length}</strong> of {venues.length} indoor sports venues
          </div>
        </div>

        {/* Venues Grid or Empty State */}
        {filteredVenues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 my-8">
            <div className="w-12 h-12 rounded-xl bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No Matching Venues Found</h3>
              <p className="text-xs text-slate-400 mt-1">
                Try adjusting your search criteria, price range, or selecting &quot;All Districts&quot;.
              </p>
            </div>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
