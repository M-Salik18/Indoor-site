'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useDemo } from '@/context/DemoContext';
import { DemoBooking, BookingStatus, PaymentCollectionStatus } from '@/types';
import BookingDetailDrawer from '@/components/admin/BookingDetailDrawer';
import PricingEditor from '@/components/admin/PricingEditor';
import FacilityManager from '@/components/admin/FacilityManager';
import VenueSettingsEditor from '@/components/admin/VenueSettingsEditor';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sliders,
  Layers,
  Settings,
  Filter,
  Eye,
  Banknote,
  ShieldCheck,
  Sparkles,
  Phone,
  User,
  Plus,
  LogOut,
  Shield
} from 'lucide-react';

export default function VenueAdminView() {
  const router = useRouter();
  const {
    venues,
    facilities,
    bookings,
    subscriptions,
    updateBookingStatus,
    updatePaymentStatus,
    openBookingModal,
    currentAdmin,
    logoutAdmin
  } = useDemo();

  // If user is a logged-in venue_admin, lock strictly to their venue ID
  const isVenueAdmin = currentAdmin?.role === 'venue_admin';
  const lockedVenueId = isVenueAdmin && currentAdmin.venueId ? currentAdmin.venueId : null;

  // Selected venue in admin (locked if venue_admin, else controllable by super_admin)
  const [selectedVenueId, setSelectedVenueId] = useState<string>('venue-axion');
  const activeVenueId = lockedVenueId || selectedVenueId;

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'pricing' | 'facilities' | 'settings'>('overview');

  // Booking filters
  const [filterFacilityId, setFilterFacilityId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');

  // Selected booking for drawer inspection
  const [inspectedBooking, setInspectedBooking] = useState<DemoBooking | null>(null);

  const currentVenue = venues.find(v => v.id === activeVenueId) || venues[0];
  const venueFacilities = facilities.filter(f => f.venueId === activeVenueId);

  // All bookings for this venue
  const venueBookings = useMemo(() => {
    return bookings.filter(b => b.venueId === activeVenueId);
  }, [bookings, activeVenueId]);

  // Today's date string (deterministic for prerender)
  const [todayStr, setTodayStr] = useState('2026-10-11');
  React.useEffect(() => {
    setTodayStr(new Date().toISOString().split('T')[0]);
  }, []);

  // Calculated metrics
  const todayBookings = venueBookings.filter(b => b.date === todayStr);
  const upcomingBookings = venueBookings.filter(b => b.date >= todayStr && b.status === 'confirmed');
  const completedBookings = venueBookings.filter(b => b.status === 'completed');
  const cancelledBookings = venueBookings.filter(b => b.status === 'cancelled');

  const totalGrossValue = venueBookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const venueSubscription = subscriptions.find(s => s.venueId === activeVenueId);
  const monthlyPrice = venueSubscription?.monthlyPrice || 10000;
  const subscriptionPlan = venueSubscription?.planName || 'Standard Venue Monthly';
  const subscriptionStatus = venueSubscription?.status || 'active';
  const nextDueDate = venueSubscription?.nextBillingDate || '1st of next month';

  // Filtered bookings for the table
  const displayedBookings = useMemo(() => {
    return venueBookings.filter(b => {
      if (filterFacilityId !== 'all' && b.facilityId !== filterFacilityId) return false;
      if (filterStatus !== 'all' && b.status !== filterStatus) return false;
      if (filterDate && b.date !== filterDate) return false;
      return true;
    });
  }, [venueBookings, filterFacilityId, filterStatus, filterDate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Top Venue Header & Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-800/40">
                  {isVenueAdmin ? 'Private Indoor Admin Portal' : 'Venue Admin Portal'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {currentVenue.district} District
                </span>
                {isVenueAdmin && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                    Isolated Tenant Access
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {currentVenue.name}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {venueFacilities.length} active facilities • Contact: {currentVenue.phone}
              </p>
            </div>
          </div>

          {/* Account Badge & Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* If venue admin, show their locked account badge and NO switcher */}
            {isVenueAdmin ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-slate-200 font-semibold">{currentAdmin.ownerName || currentAdmin.indoorName}</span>
                  <span className="text-slate-500">(@{currentAdmin.username})</span>
                </div>

                <button
                  onClick={() => {
                    logoutAdmin();
                    router.push('/admin/login');
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                  title="Log out of this venue portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              /* Super Admin can switch venues or jump to Super Admin */
              <div className="flex items-center gap-2">
                <Link
                  href="/admin/super"
                  className="px-3 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800 text-purple-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Super Admin</span>
                </Link>

                <div className="relative">
                  <label htmlFor="venue-switcher-select" className="sr-only">Switch Venue</label>
                  <select
                    id="venue-switcher-select"
                    value={activeVenueId}
                    onChange={(e) => setSelectedVenueId(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    {venues.map((v) => (
                      <option key={v.id} value={v.id}>
                        Switch to: {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              onClick={() => openBookingModal(activeVenueId, undefined, true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book for Customer</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Calendar },
            { id: 'bookings', label: `Manage Bookings (${venueBookings.length})`, icon: Clock },
            { id: 'pricing', label: 'Hourly Pricing Engine', icon: DollarSign },
            { id: 'facilities', label: `Facilities (${venueFacilities.length})`, icon: Layers },
            { id: 'settings', label: 'Venue Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">

            {/* Metric Cards (Section 11) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Today&apos;s Bookings
                </span>
                <span className="text-2xl font-black text-white">
                  {todayBookings.length}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Scheduled for today
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  Upcoming
                </span>
                <span className="text-2xl font-black text-blue-300">
                  {upcomingBookings.length}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Confirmed future games
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  Completed
                </span>
                <span className="text-2xl font-black text-emerald-300">
                  {completedBookings.length}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Played & settled
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                  Cancelled
                </span>
                <span className="text-2xl font-black text-rose-300">
                  {cancelledBookings.length}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Slot released
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Booking Value (Sample)
                </span>
                <span className="text-xl font-black text-emerald-400">
                  LKR {totalGrossValue.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Gross slot revenue
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    Platform Subscription
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {subscriptionStatus}
                  </span>
                </div>
                <span className="text-xl font-black text-purple-300">
                  LKR {monthlyPrice.toLocaleString()}<span className="text-xs font-semibold text-slate-400">/mo</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {subscriptionPlan} • Next due: {nextDueDate}
                </span>
              </div>

            </div>

            {/* Live Today's Schedule Overview */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Today&apos;s Pitch Occupancy & Timeline
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live visual grid of reserved and open court slots for {currentVenue.name}.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300"
                >
                  View Full Booking Table →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {venueFacilities.map((fac) => {
                  const facTodayBookings = todayBookings.filter(b => b.facilityId === fac.id);
                  return (
                    <div key={fac.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <strong className="text-sm font-bold text-white">{fac.name}</strong>
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                          {facTodayBookings.length} Bookings
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {facTodayBookings.length > 0 ? (
                          facTodayBookings.map((b) => (
                            <div
                              key={b.id}
                              onClick={() => setInspectedBooking(b)}
                              className="cursor-pointer p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-between transition-colors"
                            >
                              <div>
                                <span className="font-bold text-white block">{b.startTime} - {b.endTime}</span>
                                <span className="text-[11px] text-slate-400">{b.customerName}</span>
                              </div>
                              <span className="text-[10px] font-semibold text-emerald-400">
                                LKR {b.totalPrice.toLocaleString()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-center text-slate-500 text-xs italic">
                            No reservations for today yet
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: BOOKING MANAGEMENT ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">

            {/* Filter Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs items-center">
              <div>
                <label htmlFor="admin-filter-facility" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Filter by Facility
                </label>
                <select
                  id="admin-filter-facility"
                  value={filterFacilityId}
                  onChange={(e) => setFilterFacilityId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Facilities ({venueFacilities.length})</option>
                  {venueFacilities.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="admin-filter-status" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Filter by Status
                </label>
                <select
                  id="admin-filter-status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No-Show</option>
                </select>
              </div>

              <div>
                <label htmlFor="admin-filter-date" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Filter by Specific Date
                </label>
                <input
                  id="admin-filter-date"
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-end justify-end pt-2 sm:pt-0">
                <button
                  onClick={() => {
                    setFilterFacilityId('all');
                    setFilterStatus('all');
                    setFilterDate('');
                  }}
                  className="text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Bookings Table (Section 11) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Court Bookings Ledger ({displayedBookings.length})
                  </h3>
                  <span className="text-xs text-slate-400">
                    Showing private customer contact details only within this venue admin session
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Ref #</th>
                      <th className="py-3 px-4">Customer Name & Mobile</th>
                      <th className="py-3 px-4">Facility / Sport</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Amount (LKR)</th>
                      <th className="py-3 px-4">Booking Status</th>
                      <th className="py-3 px-4">Pay at Venue</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {displayedBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-950/40">

                        {/* Ref # */}
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                          {b.bookingRef}
                        </td>

                        {/* Customer Private Name & Mobile */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="font-bold text-white block">{b.customerName}</span>
                            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-500" />
                              {b.customerMobile}
                            </span>
                          </div>
                        </td>

                        {/* Facility */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-200 block">{b.facilityName}</span>
                          <span className="text-[10px] text-emerald-400">{b.sport}</span>
                        </td>

                        {/* Date & Time */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-300 block">{b.date}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{b.startTime} - {b.endTime}</span>
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 font-black text-emerald-400 font-mono text-sm">
                          LKR {b.totalPrice.toLocaleString()}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${b.status === 'confirmed' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                              b.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                b.status === 'cancelled' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                                  'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                            {b.status}
                          </span>
                        </td>

                        {/* Payment */}
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${b.paymentStatus === 'collected_at_venue'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                            {b.paymentStatus === 'collected_at_venue' ? 'Collected' : 'Pending'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setInspectedBooking(b)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 3: PRICING RULES (SECTION 10) ================= */}
        {activeTab === 'pricing' && (
          <PricingEditor venueId={selectedVenueId} />
        )}

        {/* ================= TAB 4: FACILITIES (SECTION 11) ================= */}
        {activeTab === 'facilities' && (
          <FacilityManager venueId={selectedVenueId} />
        )}

        {/* ================= TAB 5: VENUE SETTINGS (SECTION 11) ================= */}
        {activeTab === 'settings' && (
          <VenueSettingsEditor venueId={selectedVenueId} />
        )}

      </div>

      {/* Booking Detail Drawer Modal */}
      <BookingDetailDrawer
        booking={inspectedBooking}
        onClose={() => setInspectedBooking(null)}
        onUpdateStatus={(id, status) => {
          updateBookingStatus(id, status);
          if (inspectedBooking && inspectedBooking.id === id) {
            setInspectedBooking({ ...inspectedBooking, status });
          }
        }}
        onUpdatePayment={(id, paymentStatus) => {
          updatePaymentStatus(id, paymentStatus);
          if (inspectedBooking && inspectedBooking.id === id) {
            setInspectedBooking({ ...inspectedBooking, paymentStatus });
          }
        }}
      />

    </div>
  );
}
