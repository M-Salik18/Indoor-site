'use client';

import React from 'react';
import Link from 'next/link';
import { useDemo } from '@/context/DemoContext';
import { 
  Trophy, 
  Sun, 
  Moon, 
  Building, 
  LogOut,
  Shield
} from 'lucide-react';

export default function Navbar() {
  const { currentAdmin, logoutAdmin, theme, toggleTheme } = useDemo();

  return (
    <header className="w-full bg-slate-900/95 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Theme Switcher (Dark / Light Mode) & Optional Admin indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              id="theme-toggle-btn"
              type="button"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="group flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-slate-700/80 hover:border-emerald-500/60 bg-slate-800/80 hover:bg-slate-800 transition-all duration-200 text-xs font-semibold shadow-sm cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
                  <span className="text-slate-200 group-hover:text-white">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-500 group-hover:-rotate-12 transition-transform" />
                  <span className="text-slate-700 group-hover:text-slate-950 font-bold">Dark Mode</span>
                </>
              )}
            </button>

            {/* Admin status pill if logged in */}
            {currentAdmin && (
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-800">
                <Link
                  href={currentAdmin.role === 'super_admin' ? '/admin/super' : '/admin/venue'}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 border border-slate-700/50 flex items-center gap-1.5 transition-colors"
                >
                  {currentAdmin.role === 'super_admin' ? (
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                  ) : (
                    <Building className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span className="max-w-[130px] truncate">{currentAdmin.indoorName}</span>
                </Link>

                <button
                  onClick={() => logoutAdmin()}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors p-1 flex items-center gap-1"
                  title="Log out of admin portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Top: The "Courtly" Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="flex items-center gap-2.5 group"
              id="header-brand-logo"
            >
              <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-400 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Trophy className="w-4.5 sm:w-5 h-4.5 sm:h-5 text-emerald-400" />
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                  Courtly<span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-emerald-400 -mt-1">
                  Indoor Sports • Sri Lanka
                </span>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
