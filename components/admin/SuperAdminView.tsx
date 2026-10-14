'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useDemo } from '@/context/DemoContext';
import { Venue, DistrictType, SportType, VenueSubscription, SubscriptionPayment } from '@/types';
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
  ExternalLink,
  CreditCard,
  Receipt,
  Calendar,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SuperAdminView() {
  const router = useRouter();
  const { 
    venues, 
    facilities, 
    bookings, 
    subscriptions,
    subscriptionPayments,
    recordSubscriptionPayment,
    updateSubscriptionStatus,
    updateMonthlyPrice,
    toggleVenueActive,
    addVenue,
    openBookingModal,
    adminAccounts,
    createAdminAccount,
    deleteAdminAccount,
    updateAdminAccount,
    loginAdmin
  } = useDemo();

  const [activeTab, setActiveTab] = useState<'overview' | 'venues' | 'subscriptions' | 'accounts'>('overview');
  
  // Subscription filters
  const [filterSubVenueId, setFilterSubVenueId] = useState<string>('all');
  const [filterSubStatus, setFilterSubStatus] = useState<string>('all');

  // Record Subscription Payment Modal
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [paymentVenueId, setPaymentVenueId] = useState('venue-axion');
  const [paymentAmount, setPaymentAmount] = useState(10000);
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [paymentRefNumber, setPaymentRefNumber] = useState('');
  const [billingMonth, setBillingMonth] = useState('2026-10');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [subscriptionBannerMsg, setSubscriptionBannerMsg] = useState('');

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

  // Metrics
  const totalVenues = venues.length;
  const activeVenues = venues.filter(v => v.isActive).length;
  const totalBookings = bookings.length;
  
  const grossBookingValue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const totalMRR = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.monthlyPrice, 0);

  const overdueCount = subscriptions.filter(s => s.status === 'past_due' || s.status === 'suspended').length;
  const totalCollectedRevenue = subscriptionPayments.reduce((sum, p) => sum + p.amount, 0);

  // Filtered subscriptions for the management table
  const displayedSubscriptions = useMemo(() => {
    return subscriptions.filter(s => {
      if (filterSubVenueId !== 'all' && s.venueId !== filterSubVenueId) return false;
      if (filterSubStatus !== 'all' && s.status !== filterSubStatus) return false;
      return true;
    });
  }, [subscriptions, filterSubVenueId, filterSubStatus]);

  const handleOpenRecordPayment = (venueId?: string) => {
    const targetVenueId = venueId || (venues[0]?.id || 'venue-axion');
    setPaymentVenueId(targetVenueId);
    const sub = subscriptions.find(s => s.venueId === targetVenueId);
    setPaymentAmount(sub?.monthlyPrice || 10000);
    setIsRecordPaymentOpen(true);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSub = subscriptions.find(s => s.venueId === paymentVenueId);
    const subId = targetSub?.id || `sub-${paymentVenueId}`;
    const targetVenue = venues.find(v => v.id === paymentVenueId);

    const [year, month] = billingMonth.split('-');
    const startDate = `${year}-${month}-01`;
    const lastDay = new Date(Number(year), Number(month), 0).getDate();
    const endDate = `${year}-${month}-${lastDay.toString().padStart(2, '0')}`;

    recordSubscriptionPayment({
      subscriptionId: subId,
      venueId: paymentVenueId,
      amount: Number(paymentAmount) || 10000,
      billingPeriodStart: startDate,
      billingPeriodEnd: endDate,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod,
      paymentReferenceNumber: paymentRefNumber.trim() || `TXN-REF-${Math.floor(100000 + Math.random() * 900000)}`,
      verificationStatus: 'verified',
      recordedBy: 'Super Administrator',
      notes: paymentNotes.trim() || 'Verified monthly platform subscription payment.',
    });

    setSubscriptionBannerMsg(`Successfully recorded and verified LKR ${(Number(paymentAmount) || 10000).toLocaleString()} subscription payment for ${targetVenue?.name || 'venue'}.`);
    setIsRecordPaymentOpen(false);
    setPaymentRefNumber('');
    setPaymentNotes('');
  };

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
                Managing multi-venue partner network, monthly fixed subscriptions & verified payment records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleOpenRecordPayment()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>Record Subscription Payment</span>
            </button>

            <button
              onClick={() => setIsAddAccountOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>Create Venue Admin Account</span>
            </button>

            <button
              onClick={() => setIsAddVenueOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
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
            { id: 'subscriptions', label: `Subscriptions & Billing (${subscriptions.length})` },
            { id: 'accounts', label: `Venue Admin Accounts (${adminAccounts.filter(a => a.role === 'venue_admin').length})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
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
            
            {/* Top Metric Cards */}
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
                  Customer Bookings
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
                <span className="text-[10px] text-emerald-400/90 font-medium block mt-1">
                  0% Commission (100% kept by venues)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                  Monthly Revenue (MRR)
                </span>
                <span className="text-xl font-black text-purple-300">
                  LKR {totalMRR.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  {activeSubscriptions.length} active @ LKR 10,000/mo
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Overdue / Past Due
                </span>
                <span className="text-xl font-black text-amber-300">
                  {overdueCount}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  {overdueCount === 0 ? 'All subscriptions current' : 'Requires renewal check'}
                </span>
              </div>

            </div>

            {/* Fixed Subscription Business Model Information Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Business Model: Fixed Monthly Subscription
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    LKR 10,000 / Month Per Venue • 0% Commission
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    Courtly charges each indoor sports venue a simple, transparent flat monthly subscription. Venues keep 100% of player counter payments, while Super Admins record and reconcile monthly fee settlements.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('subscriptions')}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>View Subscriptions & Billing</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">LKR 10,000 Flat Monthly Fee</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Predictable and transparent billing. No per-hour or per-game commission calculations to audit or dispute.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">0% Commission on Bookings</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Customers pay the indoor centre directly at the counter. Partner facilities retain 100% of their pitch revenues.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Manual Verified Settlement Ledger</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Super Admin records bank transfers, deposit slips, and reference numbers with instant status updates.
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

        {/* ================= TAB 3: SUBSCRIPTIONS & BILLING ================= */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            
            {/* Banner Notice */}
            {subscriptionBannerMsg && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{subscriptionBannerMsg}</span>
                </div>
                <button
                  onClick={() => setSubscriptionBannerMsg('')}
                  className="text-emerald-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-emerald-900/60 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Subscriptions Status Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Total Partner Venues
                </span>
                <span className="text-2xl font-black text-white">{totalVenues}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Ecosystem arenas</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  Active Subscriptions
                </span>
                <span className="text-2xl font-black text-emerald-300">
                  {activeSubscriptions.length} / {subscriptions.length}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">LKR 10,000 / month</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                  Monthly Recurring (MRR)
                </span>
                <span className="text-2xl font-black text-purple-300">
                  LKR {totalMRR.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Projected this month</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Overdue / Suspended
                </span>
                <span className="text-2xl font-black text-amber-300">{overdueCount}</span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  {overdueCount === 0 ? 'All venues in good standing' : 'Follow up required'}
                </span>
              </div>
            </div>

            {/* Subscriptions Filter & Actions Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                <div className="min-w-[200px]">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Filter by Venue
                  </label>
                  <select
                    value={filterSubVenueId}
                    onChange={(e) => setFilterSubVenueId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Venues ({venues.length})</option>
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div className="min-w-[160px]">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Subscription Status
                  </label>
                  <select
                    value={filterSubStatus}
                    onChange={(e) => setFilterSubStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="past_due">Past Due</option>
                    <option value="suspended">Suspended</option>
                    <option value="trialing">Trialing</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 sm:pt-0 self-end sm:self-auto">
                <button
                  onClick={() => handleOpenRecordPayment()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>+ Record Subscription Payment</span>
                </button>
              </div>
            </div>

            {/* Table 1: Venue Subscriptions Ledger */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>Venue Subscription Status Ledger</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-400 border border-purple-800/40">
                      Fixed LKR 10,000 / Mo
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    Monthly billing cycle details, current active standing, and manual settlement action
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Indoor Arena / Venue</th>
                      <th className="py-3 px-4">Subscription Plan</th>
                      <th className="py-3 px-4">Monthly Fee</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Current Period</th>
                      <th className="py-3 px-4">Next Due Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {displayedSubscriptions.map((sub) => {
                      const v = venues.find(item => item.id === sub.venueId);
                      return (
                        <tr key={sub.id} className="hover:bg-slate-950/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-sm">
                              {v?.name || sub.venueId}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {v?.district} • {v?.city}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-medium text-slate-200">
                            {sub.planName}
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold text-purple-400 text-sm">
                            LKR {sub.monthlyPrice.toLocaleString()}<span className="text-xs font-normal text-slate-400">/mo</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                              sub.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : sub.status === 'past_due'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}>
                              {sub.status.replace('_', ' ')}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px]">
                            {sub.currentPeriodStart} to {sub.currentPeriodEnd}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-200 font-semibold text-[11px]">
                            {sub.nextBillingDate}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenRecordPayment(sub.venueId)}
                                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                title="Record monthly subscription payment"
                              >
                                <Receipt className="w-3.5 h-3.5" />
                                <span>Record Payment</span>
                              </button>

                              <select
                                value={sub.status}
                                onChange={(e) => updateSubscriptionStatus(sub.id, e.target.value as any)}
                                className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                                title="Change status"
                              >
                                <option value="active">Active</option>
                                <option value="past_due">Past Due</option>
                                <option value="suspended">Suspended</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Verified Subscription Payments History */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>Verified Subscription Payment History & Bank Slips ({subscriptionPayments.length})</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    Audit trail of reconciled LKR 10,000 monthly subscription payments recorded by Super Admin
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Payment Ref</th>
                      <th className="py-3 px-4">Venue</th>
                      <th className="py-3 px-4">Billing Month</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Payment Method</th>
                      <th className="py-3 px-4">Slip / Txn Ref</th>
                      <th className="py-3 px-4">Payment Date</th>
                      <th className="py-3 px-4">Verification</th>
                      <th className="py-3 px-4">Recorded By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {subscriptionPayments.map((p) => {
                      const v = venues.find(item => item.id === p.venueId);
                      return (
                        <tr key={p.id} className="hover:bg-slate-950/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-white">
                            {p.paymentRef}
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-slate-200">
                            {v?.name || p.venueId}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            {p.billingPeriodStart.substring(0, 7)}
                          </td>

                          <td className="py-3.5 px-4 font-mono font-black text-emerald-400 text-sm">
                            LKR {p.amount.toLocaleString()}
                          </td>

                          <td className="py-3.5 px-4 text-slate-300">
                            {p.paymentMethod}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-purple-300 font-semibold">
                            {p.paymentReferenceNumber}
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                            {p.paymentDate}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>{p.verificationStatus.replace('_', ' ')}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                            {p.recordedBy}
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

      {/* Record Subscription Payment Modal */}
      {isRecordPaymentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Record & Verify Subscription Payment</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manually record a venue&apos;s monthly platform fee (LKR 10,000) against a bank transfer or deposit slip.
                </p>
              </div>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
              <div className="space-y-3.5">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Select Venue / Indoor Facility *
                  </label>
                  <select
                    value={paymentVenueId}
                    onChange={(e) => {
                      setPaymentVenueId(e.target.value);
                      const sub = subscriptions.find(s => s.venueId === e.target.value);
                      if (sub) {
                        setPaymentAmount(sub.monthlyPrice);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500"
                    required
                  >
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.district} – {v.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Billing Month *
                    </label>
                    <input
                      type="month"
                      value={billingMonth}
                      onChange={(e) => setBillingMonth(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                      required
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Full month coverage</span>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Amount (LKR) *
                    </label>
                    <input
                      type="number"
                      step="500"
                      min="1000"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold text-xs focus:outline-none focus:border-purple-500"
                      required
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Standard fee: LKR 10,000</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Payment Method *
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500"
                    >
                      <option value="Bank Transfer (BOC)">Bank Transfer (BOC)</option>
                      <option value="Bank Transfer (Commercial Bank)">Bank Transfer (Commercial Bank)</option>
                      <option value="Bank Transfer (HNB)">Bank Transfer (HNB)</option>
                      <option value="Bank Transfer (Sampath Bank)">Bank Transfer (Sampath Bank)</option>
                      <option value="Bank Deposit Slip">Bank Deposit Slip</option>
                      <option value="Cash at Head Office">Cash at Head Office</option>
                      <option value="Cheque Deposit">Cheque Deposit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Slip / Txn Reference No *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TXN-BOC-849201 or SLIP-449"
                      value={paymentRefNumber}
                      onChange={(e) => setPaymentRefNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Reconciliation Notes / Remarks
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Bank statement checked and verified by Super Admin; slip verified."
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-start gap-2.5 text-[11px] text-purple-200">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Manual Verification by Super Admin:</span> Submitting this form updates the venue&apos;s subscription standing to <span className="font-semibold text-emerald-400">&apos;active&apos;</span> and logs an immutable audit payment slip with verified status.
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRecordPaymentOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Verify & Record Payment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
