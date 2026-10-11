'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Clock, 
  Heart,
  CreditCard,
  Building
} from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer" className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          
          {/* Brand & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-lime-400 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Courtly<span className="text-emerald-400">.lk</span>
              </span>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Sri Lanka’s dedicated discovery and court-reservation platform for indoor sports centres. Connecting athletes and casual players with premier futsal turfs, badminton courts, cricket nets, and snooker lounges.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400/90 bg-emerald-950/40 border border-emerald-800/30 px-3 py-2 rounded-lg max-w-sm">
              <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero online prepayment required. Always pay directly at the venue.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explore Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/venues" className="hover:text-emerald-400 transition-colors">All Indoor Venues</Link>
              </li>
              <li>
                <Link href="/venues/axion-ambetenne" className="hover:text-emerald-400 transition-colors">AXION – Ambetenne</Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link href="/#popular-sports" className="hover:text-emerald-400 transition-colors">Sports Categories</Link>
              </li>
            </ul>
          </div>

          {/* Demonstrator / Business Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">For Venue Owners</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin/venue" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-400" />
                  <span>Venue Admin Demo</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/super" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Super-Admin Demo</span>
                </Link>
              </li>
              <li>
                <span className="text-slate-500 text-xs block pt-1">
                  Interested in listing your indoor arena? Join our pilot cohort in Kandy, Colombo, and Gampaha.
                </span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div id="contact" className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact & Hotline</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Colombo & Kandy Hubs, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+94 11 750 0900 (Demo Support)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>hello@courtly.lk</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Demo operational hours: 24/7</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal & Policy Highlights */}
        <div className="py-6 border-b border-slate-900 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-400 block mb-1">Cancellation Policy</span>
            <p>
              Free cancellation up to 4 hours prior to game start. Cancellations can be reported directly to the venue management by telephone.
            </p>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block mb-1">Pay at Venue Terms</span>
            <p>
              Payments are settled directly with the venue staff via cash or card before/after playing. Courtly does not collect card details from players.
            </p>
          </div>
          <div>
            <span className="font-semibold text-slate-400 block mb-1">Prototype Notice</span>
            <p>
              This application is an interactive frontend demonstration prototype. No actual SMS messages or banking authorizations are executed.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© 2026 Courtly Sri Lanka. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Sri Lankan Sports
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
