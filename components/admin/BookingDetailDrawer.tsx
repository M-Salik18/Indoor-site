'use client';

import React from 'react';
import { DemoBooking, BookingStatus, PaymentCollectionStatus } from '@/types';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Banknote,
  ShieldCheck
} from 'lucide-react';

interface BookingDetailDrawerProps {
  booking: DemoBooking | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onUpdatePayment: (id: string, paymentStatus: PaymentCollectionStatus) => void;
}

export default function BookingDetailDrawer({
  booking,
  onClose,
  onUpdateStatus,
  onUpdatePayment
}: BookingDetailDrawerProps) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Booking Reference
              </span>
              <h3 className="text-xl font-mono font-black text-emerald-400">
                {booking.bookingRef}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              booking.status === 'confirmed' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
              booking.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              booking.status === 'cancelled' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
              'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              Status: {booking.status}
            </span>

            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              booking.paymentStatus === 'collected_at_venue'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              Payment: {booking.paymentStatus === 'collected_at_venue' ? 'Collected at Venue' : 'Pending at Venue'}
            </span>
          </div>

          {/* Customer Privacy Container (Venue Admin Only) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Customer Contact (Admin-Only View)
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">Full Name:</span>
                <strong className="text-white text-sm">{booking.customerName}</strong>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400">Mobile:</span>
                <a href={`tel:${booking.customerMobile}`} className="text-emerald-400 font-mono font-bold hover:underline">
                  {booking.customerMobile}
                </a>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 border-t border-slate-900 pt-2">
              Customer contact information is strictly protected and never displayed on public marketplace listings.
            </p>
          </div>

          {/* Reservation Details */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider">
              Court & Timing Details
            </h4>
            
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-slate-500 block">Facility / Court</span>
                <strong className="text-white text-sm">{booking.facilityName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Sport</span>
                <strong className="text-white text-sm">{booking.sport}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Date</span>
                <strong className="text-white">{booking.date}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Time Slot</span>
                <strong className="text-white">{booking.startTime} – {booking.endTime}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Duration</span>
                <span className="text-slate-300">{booking.durationHours} Hour(s)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Amount</span>
                <span className="text-emerald-400 font-bold text-sm">
                  LKR {booking.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {booking.notes && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-slate-300 block mb-0.5">Booking Notes:</span>
                {booking.notes}
              </div>
            )}
          </div>
        </div>

        {/* Operational Actions */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Update Booking & Payment Status
          </span>

          {/* Payment collection action */}
          {booking.paymentStatus === 'pending_at_venue' ? (
            <button
              onClick={() => onUpdatePayment(booking.id, 'collected_at_venue')}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Banknote className="w-4 h-4" />
              <span>Record Payment Collected (LKR {booking.totalPrice.toLocaleString()})</span>
            </button>
          ) : (
            <button
              onClick={() => onUpdatePayment(booking.id, 'pending_at_venue')}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              Revert Payment to &quot;Pending at Venue&quot;
            </button>
          )}

          {/* Status Change Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onUpdateStatus(booking.id, 'completed')}
              className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-emerald-600/30 text-emerald-400 hover:text-emerald-300 border border-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </button>

            <button
              onClick={() => onUpdateStatus(booking.id, 'no-show')}
              className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-amber-600/30 text-amber-400 hover:text-amber-300 border border-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>No-Show</span>
            </button>

            <button
              onClick={() => onUpdateStatus(booking.id, 'cancelled')}
              className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-rose-600/30 text-rose-400 hover:text-rose-300 border border-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-slate-950 text-slate-400 hover:text-slate-200 text-xs font-medium"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
