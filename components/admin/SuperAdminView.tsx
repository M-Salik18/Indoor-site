'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useDemo } from '@/context/DemoContext';
import { Venue, DistrictType, SportType } from '@/types';
import { 
  ShieldCheck, 
  Building2, 
  DollarSign, 
  CheckCircle2, 
  Power, 
  SlidersHorizontal, 
  ArrowUpRight, 
  RotateCcw, 
  Plus, 
  Sparkles,
  Filter,
  Check,
  AlertCircle,
  Key,
  UserCheck,
  Eye,
  EyeOff,
  Trash2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SuperAdminView() {
  const router = useRouter();
  const { 
    venues, 
    facilities, 
    bookings, 
    commissionRate, 
    setCommissionRate, 
    settleVenueCommission, 
    getCommissionRecords,
    toggleVenueActive,
    addVenue,
    openBookingModal,
    adminAccounts,
    createAdminAccount,
    deleteAdminAccount,
    updateAdminAccount,
    loginAdmin
  } = useDemo();

  const [activeTab, setActiveTab] = useState<'overview' | 'venues' | 'commissions' | 'accounts'>('overview');
  
  // Commission filters
  const [filterVenueId, setFilterVenueId] = useState<string>('all');
  const [filterSettlement, setFilterSettlement] = useState<string>('all');

  // Add Venue Modal
  const [isAddVenueOpen, setIsAddVenueOpen] = useState(false);
  const [newVenueName, setNewVenueName] = useState('');
  const [newVenueDistrict, setNewVenueDistrict] = useState<DistrictType>('Colombo');
  const [newVenueCity, setNewVenueCity] = useState('');
  const [newVenueAddress, setNewVenueAddress] = useState('');
  const [newVenuePhone, setNewVenuePhone] = useState('+94 11 200 9988');
  const [newVenuePrice, setNewVenuePrice] = useState(2500);

  // Add Venue Admin Account Modal & State
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [accIndoorName, setAccIndoorName] = useState('');
  const [accUsername, setAccUsername] = useState('');
  const [accPassword, setAccPassword] = useState('');
  const [accVenueId, setAccVenueId] = useState('venue-axion');
  const [accOwnerName, setAccOwnerName] = useState('');
  const [accPhone, setAccPhone] = useState('');
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [accountBannerMsg, setAccountBannerMsg] = useState('');

  const commissionRecords = getCommissionRecords();

  // Metrics
  const totalVenues = venues.length;
  const activeVenues = venues.filter(v => v.isActive).length;
  const totalBookings = bookings.length;
  
  const grossBookingValue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const totalPlatformCommission = Math.round((grossBookingValue * commissionRate) / 100);

  const outstandingCommission = commissionRecords
    .filter(c => c.settlementStatus === 'outstanding' && c.bookingStatus !== 'cancelled')
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  // Filtered commission table records
  const displayedCommissions = useMemo(() => {
    return commissionRecords.filter(c => {
      if (filterVenueId !== 'all' && c.venueId !== filterVenueId) return false;
      if (filterSettlement !== 'all' && c.settlementStatus !== filterSettlement) return false;
      return true;
    });
  }, [commissionRecords, filterVenueId, filterSettlement]);

  const handleCreateVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVenueName.trim() || !newVenueCity.trim()) return;

    addVenue({
      name: newVenueName.trim(),
      district: newVenueDistrict,
      city: newVenueCity.trim(),
      address: newVenueAddress.trim() || `${newVenueCity}, Sri Lanka`,
      phone: newVenuePhone.trim(),
      email: `contact@${newVenueName.toLowerCase().replace(/[^a-z0-9]/g, '')}.lk`,
      description: 'Newly registered multi-sport arena partner in Sri Lanka.',
      heroImage: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [],
      sportsOffered: ['Football', 'Badminton'],
      rating: 4.8,
      reviewCount: 1,
      openingHours: '07:00 AM – 11:00 PM',
      openingDays: 'Open Daily',
      amenities: ['Synthetic Turf', 'Floodlights', 'Changing Rooms'],
      startingPricePerHour: Number(newVenuePrice),
      isActive: true,
    });

    setIsAddVenueOpen(false);
    setNewVenueName('');
    setNewVenueCity('');
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accIndoorName.trim() || !accUsername.trim() || !accPassword.trim()) return;

    const linkedVenue = venues.find(v => v.id === accVenueId) || venues[0];
    const newAccount = createAdminAccount({
      indoorName: accIndoorName.trim(),
      username: accUsername.trim().toLowerCase(),
      password: accPassword.trim(),
      venueId: accVenueId || (linkedVenue ? linkedVenue.id : 'venue-axion'),
      role: 'venue_admin',
      ownerName: accOwnerName.trim() || `${accIndoorName.trim()} Manager`,
      phone: accPhone.trim() || (linkedVenue ? linkedVenue.phone : '+94 77 123 4567'),
      status: 'active',
    });

    setAccountBannerMsg(`Account created successfully for "${newAccount.indoorName}"! Username: ${newAccount.username} | Password: ${newAccount.password}`);
    setIsAddAccountOpen(false);
    setActiveTab('accounts');
    setAccIndoorName('');
    setAccUsername('');
    setAccPassword('');
    setAccOwnerName('');
    setAccPhone('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Super Admin Top Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-950 px-2.5 py-0.5 rounded-full border border-purple-800/40">
                  Platform Operator Portal
                </span>
                <span className="text-xs text-slate-400">Courtly Sri Lanka HQ</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                Marketplace Super-Admin
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Managing multi-venue ecosystem, commission rates, settlements & platform revenue.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAddAccountOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <Key className="w-4 h-4" />
              <span>Create Venue Admin Account</span>
            </button>

            <button
              onClick={() => setIsAddVenueOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Venue</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
          {[
            { id: 'overview', label: 'Platform Performance' },
            { id: 'venues', label: `Partner Venues (${venues.length})` },
            { id: 'commissions', label: `Commission Ledger (${commissionRecords.length})` },
            { id: 'accounts', label: `Venue Admin Accounts (${adminAccounts.filter(a => a.role === 'venue_admin').length})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Top Metric Cards (Section 12) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
              
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Total Venues
                </span>
                <span className="text-2xl font-black text-white">{totalVenues}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Sri Lanka Network</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  Active Venues
                </span>
                <span className="text-2xl font-black text-emerald-300">{activeVenues}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Accepting bookings</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  Total Demo Bookings
                </span>
                <span className="text-2xl font-black text-blue-300">{totalBookings}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Across all arenas</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Gross Booking Value
                </span>
                <span className="text-xl font-black text-emerald-400">
                  LKR {grossBookingValue.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Sample turnover</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                  Platform Commission
                </span>
                <span className="text-xl font-black text-purple-300">
                  LKR {totalPlatformCommission.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">At {commissionRate}% take-rate</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Commission Outstanding
                </span>
                <span className="text-xl font-black text-amber-300">
                  LKR {outstandingCommission.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Pending venue payout</span>
              </div>

            </div>

            {/* Configurable Platform Commission Rate Controller (Section 12) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Monetization Model Demonstration
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Marketplace Commission Rate Setting
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">
                    Adjust the demo commission take-rate percentage. All platform commission metrics and venue settlement balances recalculate automatically.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 self-start sm:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Active Rate</span>
                    <span className="text-2xl font-black text-purple-400 font-mono">{commissionRate}%</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-2">
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-xs text-slate-300 font-medium">
                    <span>Adjust Rate:</span>
                    <span className="font-mono text-purple-300 font-bold">{commissionRate}% Take-Rate</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={25}
                    step={1}
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="accent-purple-500 w-full cursor-pointer h-2 bg-slate-950 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span className="text-purple-400 font-bold">5% (Default Platform Rate)</span>
                    <span>10%</span>
                    <span>15%</span>
                    <span>20%</span>
                    <span>25% (Premium)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 max-w-sm">
                  <p className="leading-relaxed">
                    At <strong>{commissionRate}%</strong>, the platform generates <strong>LKR {totalPlatformCommission.toLocaleString()}</strong> from current sample bookings across all partner centres.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: VENUES MANAGEMENT ================= */}
        {activeTab === 'venues' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Registered Indoor Sports Venues ({venues.length})
                  </h3>
                  <span className="text-xs text-slate-400">
                    Full marketplace directory with facility breakdown and live activation controls
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Venue Name</th>
                      <th className="py-3 px-4">District</th>
                      <th className="py-3 px-4">Facilities</th>
                      <th className="py-3 px-4">Sports Offered</th>
                      <th className="py-3 px-4">Total Bookings</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {venues.map((v) => {
                      const facCount = facilities.filter(f => f.venueId === v.id).length;
                      const venueBks = bookings.filter(b => b.venueId === v.id).length;

                      return (
                        <tr key={v.id} className="hover:bg-slate-950/40">
                          <td className="py-3.5 px-4 font-bold text-white">
                            <div className="flex items-center gap-2">
                              <span>{v.name}</span>
                              {v.id === 'venue-axion' && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                  Pilot Flagship
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 font-normal">{v.address}</span>
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-slate-300">
                            {v.district}
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                            {facCount} Facilities
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1">
                              {v.sportsOffered.map(s => (
                                <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                            {venueBks}
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => toggleVenueActive(v.id)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                                v.isActive
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-500'
                              }`}
                            >
                              <Power className="w-3 h-3" />
                              <span>{v.isActive ? 'Active' : 'Disabled'}</span>
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <Link
                              href={`/venues/${v.slug}`}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                            >
                              <span>Public Page</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: COMMISSION LEDGER ================= */}
        {activeTab === 'commissions' && (
          <div className="space-y-6">
            
            {/* Filter controls */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs items-center">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Filter by Venue
                </label>
                <select
                  value={filterVenueId}
                  onChange={(e) => setFilterVenueId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Venues ({venues.length})</option>
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Filter Settlement Status
                </label>
                <select
                  value={filterSettlement}
                  onChange={(e) => setFilterSettlement(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Settlements</option>
                  <option value="outstanding">Outstanding (Pending Payout)</option>
                  <option value="settled">Settled</option>
                </select>
              </div>

              <div className="flex items-end justify-end pt-2 sm:pt-0">
                <span className="text-slate-400 text-xs">
                  Outstanding: <strong className="text-amber-400">LKR {outstandingCommission.toLocaleString()}</strong>
                </span>
              </div>
            </div>

            {/* Commissions Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Illustrative Commission Records ({displayedCommissions.length})
                  </h3>
                  <span className="text-xs text-slate-400">
                    Transparent percentage breakdown per reservation
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Booking Ref</th>
                      <th className="py-3 px-4">Venue</th>
                      <th className="py-3 px-4">Booking Amount</th>
                      <th className="py-3 px-4">Rate</th>
                      <th className="py-3 px-4">Commission (LKR)</th>
                      <th className="py-3 px-4">Game Status</th>
                      <th className="py-3 px-4">Settlement</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {displayedCommissions.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-950/40">
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          {record.bookingRef}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-200">
                          {record.venueName}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          LKR {record.bookingAmount.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-purple-400 font-bold">
                          {record.commissionRate}%
                        </td>

                        <td className="py-3.5 px-4 font-mono font-black text-emerald-400 text-sm">
                          LKR {record.commissionAmount.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 uppercase text-[10px] font-bold">
                          <span className={`${
                            record.bookingStatus === 'completed' ? 'text-emerald-400' :
                            record.bookingStatus === 'confirmed' ? 'text-blue-400' : 'text-slate-500'
                          }`}>
                            {record.bookingStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            record.settlementStatus === 'settled'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {record.settlementStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {record.settlementStatus === 'outstanding' ? (
                            <button
                              onClick={() => settleVenueCommission(record.bookingId)}
                              className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold transition-colors"
                            >
                              Record Settlement
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                              <Check className="w-3 h-3" />
                              <span>Settled</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: VENUE ADMIN ACCOUNTS ================= */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            
            {/* Banner Notice */}
            {accountBannerMsg && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{accountBannerMsg}</span>
                </div>
                <button
                  onClick={() => setAccountBannerMsg('')}
                  className="text-emerald-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-emerald-900/60"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Header info card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Multi-Tenant Indoor Access Control
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Indoor Venue Admin Accounts
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Only Platform Super Admins can issue accounts. After selling our system to an indoor facility, create their dedicated login below. Each indoor owner accesses only their specific venue data, completely isolated from other venues.
                </p>
              </div>

              <button
                onClick={() => setIsAddAccountOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create Venue Account</span>
              </button>
            </div>

            {/* Accounts Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Registered Admin Credentials</h4>
                  <p className="text-xs text-slate-400">Total accounts: {adminAccounts.length} (including Super Admin)</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Indoor / Venue Name</th>
                      <th className="py-3 px-4">Admin Username</th>
                      <th className="py-3 px-4">Password</th>
                      <th className="py-3 px-4">Role & Linked Venue</th>
                      <th className="py-3 px-4">Owner / Contact</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {adminAccounts.map((account) => {
                      const isRevealed = !!revealedPasswords[account.id];
                      const isSuper = account.role === 'super_admin';
                      const linkedV = venues.find(v => v.id === account.venueId);

                      return (
                        <tr key={account.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isSuper ? 'bg-purple-600/20 text-purple-400' : 'bg-blue-600/20 text-blue-400'
                              }`}>
                                {isSuper ? <ShieldCheck className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                              </div>
                              <div>
                                <span className="font-bold text-white block">{account.indoorName}</span>
                                <span className="text-[10px] text-slate-500 font-mono">ID: {account.id}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                            {account.username}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 font-mono">
                              <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-200">
                                {isRevealed ? account.password : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setRevealedPasswords(prev => ({ ...prev, [account.id]: !prev[account.id] }))}
                                className="p-1 rounded text-slate-400 hover:text-white"
                                title={isRevealed ? 'Mask password' : 'Show password'}
                              >
                                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            {isSuper ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/50">
                                Platform Super Admin
                              </span>
                            ) : (
                              <div>
                                <span className="text-slate-200 block font-semibold">
                                  {linkedV ? linkedV.name : account.venueId}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                  {linkedV ? `${linkedV.district} District` : 'Private Portal'}
                                </span>
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-xs">
                              <span className="text-slate-200 block">{account.ownerName || '—'}</span>
                              <span className="text-[10px] text-slate-400">{account.phone || '—'}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              account.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}>
                              {account.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {!isSuper && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    loginAdmin(account.username, account.password);
                                    router.push('/admin/venue');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-[11px] font-bold transition-all flex items-center gap-1"
                                  title="Test logging in as this venue admin"
                                >
                                  <span>Log In</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              )}

                              {!isSuper && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateAdminAccount({
                                      ...account,
                                      status: account.status === 'active' ? 'suspended' : 'active'
                                    });
                                  }}
                                  className="p-1 rounded text-slate-400 hover:text-amber-300"
                                  title={account.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                                >
                                  <Lock className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {!isSuper && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Delete admin account for "${account.indoorName}"?`)) {
                                      deleteAdminAccount(account.id);
                                    }
                                  }}
                                  className="p-1 rounded text-slate-400 hover:text-rose-400"
                                  title="Delete Account"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Register Venue Modal */}
      {isAddVenueOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 text-xs">
            <div>
              <h3 className="text-base font-bold text-white">Register Partner Venue</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Onboard a new indoor sports arena into the Courtly Sri Lanka platform.
              </p>
            </div>

            <form onSubmit={handleCreateVenue} className="space-y-3">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Venue Business Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kandy Indoor Turf Arena"
                  value={newVenueName}
                  onChange={(e) => setNewVenueName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    District *
                  </label>
                  <select
                    value={newVenueDistrict}
                    onChange={(e) => setNewVenueDistrict(e.target.value as DistrictType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Colombo">Colombo</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kurunegala">Kurunegala</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Peradeniya"
                    value={newVenueCity}
                    onChange={(e) => setNewVenueCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Public Hotline
                </label>
                <input
                  type="text"
                  value={newVenuePhone}
                  onChange={(e) => setNewVenuePhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Starting Hourly Rate (LKR)
                </label>
                <input
                  type="number"
                  value={newVenuePrice}
                  onChange={(e) => setNewVenuePrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddVenueOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md shadow-purple-600/20"
                >
                  Create Venue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Venue Admin Account Modal */}
      {isAddAccountOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Create Venue Admin Account</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generate dedicated credentials after onboarding or selling system to an indoor centre.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Indoor / Venue Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AXION – Ambetenne or Royal Turf"
                    value={accIndoorName}
                    onChange={(e) => {
                      setAccIndoorName(e.target.value);
                      if (!accUsername) {
                        setAccUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Admin Username *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. axion or royalturf"
                    value={accUsername}
                    onChange={(e) => setAccUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Used by indoor owner to login</span>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Account Password *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. turf2026"
                    value={accPassword}
                    onChange={(e) => setAccPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Give this to the venue owner</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Link to Indoor Venue Facility *
                  </label>
                  <select
                    value={accVenueId}
                    onChange={(e) => {
                      setAccVenueId(e.target.value);
                      const v = venues.find(item => item.id === e.target.value);
                      if (v && !accIndoorName) {
                        setAccIndoorName(v.name);
                        setAccUsername(v.slug.replace(/[^a-z0-9]/g, ''));
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.district} – {v.city})
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Venue admin will be strictly locked to manage only this venue&apos;s bookings and pitches.
                  </span>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Owner / Manager Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rifkhan Nizam"
                    value={accOwnerName}
                    onChange={(e) => setAccOwnerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +94 81 230 4567"
                    value={accPhone}
                    onChange={(e) => setAccPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddAccountOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Create Account & Issue Credentials</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
