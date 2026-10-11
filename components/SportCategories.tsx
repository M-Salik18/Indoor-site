'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CircleDot, 
  Dices, 
  Flame, 
  Trophy, 
  Activity, 
  Target, 
  Shield, 
  ChevronRight 
} from 'lucide-react';
import { SportType } from '@/types';

interface SportCategoryItem {
  id: string;
  name: SportType | 'Other Sports';
  filterKey: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  badge: string;
}

const CATEGORIES: SportCategoryItem[] = [
  {
    id: 'cat-football',
    name: 'Football',
    filterKey: 'Football',
    description: 'AstroTurf 5-a-side & 7-a-side outdoor/indoor pitches',
    icon: Flame,
    gradient: 'from-emerald-500/20 to-teal-500/5',
    badge: 'High Demand',
  },
  {
    id: 'cat-futsal',
    name: 'Futsal',
    filterKey: 'Futsal',
    description: 'Fast-paced enclosed pitches with perimeter netting',
    icon: Activity,
    gradient: 'from-lime-500/20 to-emerald-500/5',
    badge: 'Popular',
  },
  {
    id: 'cat-badminton',
    name: 'Badminton',
    filterKey: 'Badminton',
    description: 'Synthetic rubber & PVC tournament courts',
    icon: Target,
    gradient: 'from-cyan-500/20 to-blue-500/5',
    badge: 'All Weather',
  },
  {
    id: 'cat-basketball',
    name: 'Basketball',
    filterKey: 'Basketball',
    description: 'Hardwood and sprung composite indoor courts',
    icon: Trophy,
    gradient: 'from-amber-500/20 to-orange-500/5',
    badge: 'Full Court',
  },
  {
    id: 'cat-snooker',
    name: 'Snooker',
    filterKey: 'Snooker',
    description: '12ft tournament tables with Strachan pro cloth',
    icon: CircleDot,
    gradient: 'from-purple-500/20 to-indigo-500/5',
    badge: 'AC Lounge',
  },
  {
    id: 'cat-pool',
    name: '8-Ball Pool',
    filterKey: '8-Ball Pool',
    description: 'English & American pool tables for social games',
    icon: Dices,
    gradient: 'from-fuchsia-500/20 to-pink-500/5',
    badge: 'Social',
  },
  {
    id: 'cat-cricket',
    name: 'Cricket Nets',
    filterKey: 'Cricket Nets',
    description: 'Automated bowling machines & run-up turf nets',
    icon: Shield,
    gradient: 'from-red-500/20 to-rose-500/5',
    badge: 'Training',
  },
  {
    id: 'cat-table-tennis',
    name: 'Table Tennis',
    filterKey: 'Table Tennis',
    description: 'ITTF approved tournament tables & pro lighting',
    icon: Activity,
    gradient: 'from-teal-500/20 to-emerald-500/5',
    badge: 'Casual & Pro',
  },
];

export default function SportCategories() {
  return (
    <section id="popular-sports" className="py-16 bg-slate-950 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
              Browse by Discipline
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Popular Indoor Sports in Sri Lanka
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Select a sport to explore certified courts and availability near your district.
            </p>
          </div>

          <Link
            href="/venues"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Venues</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/venues?sport=${encodeURIComponent(cat.filterKey)}`}
                className="group relative rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 p-4 sm:p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
                      <Icon className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/50">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-emerald-400 transition-colors">
                  <span>Browse Courts</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
