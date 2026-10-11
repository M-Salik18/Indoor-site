'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';
import { 
  Trophy, 
  Menu, 
  X, 
  Search, 
  ChevronRight,
  Shield,
  Building
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { openBookingModal } = useDemo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Explore Venues', href: '/venues' },
    { label: 'AXION – Ambetenne', href: '/venues/axion-ambetenne' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="w-full bg-slate-900/95 border-b border-slate-800 backdrop-blur-md sticky top-[41px] z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-400 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                  Courtly<span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 -mt-1">
                  Indoor Sports • Sri Lanka
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-emerald-400 bg-slate-800/80 font-semibold' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Book Turf CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/venues"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-700/60 transition-all flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search Courts</span>
            </Link>

            <button
              onClick={() => openBookingModal('venue-axion')}
              id="header-book-turf-btn"
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
            >
              <span>Book a Turf</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => openBookingModal('venue-axion')}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
            >
              Book Turf
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="grid gap-1 pb-3 border-b border-slate-800/80">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900 hover:text-emerald-400 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Link>
            ))}
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openBookingModal('venue-axion');
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 text-slate-950 font-bold text-sm shadow-md text-center flex items-center justify-center gap-2"
            >
              <span>Book a Turf Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <Link
                href="/admin/venue"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1.5"
              >
                <Building className="w-3.5 h-3.5 text-blue-400" />
                <span>Venue Admin</span>
              </Link>
              <Link
                href="/admin/super"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Super Admin</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
