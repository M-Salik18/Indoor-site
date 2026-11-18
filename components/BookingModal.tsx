'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Trophy, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Phone, 
  CreditCard,
  Building,
  User,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function BookingModal() {
  const router = useRouter();
  const { 
    isBookingModalOpen, 
    closeBookingModal, 
    bookingModalVenueId, 
    bookingModalFacilityId,
    bookingModalIsAdmin,
    venues, 
    facilities, 
    getSlotsForFacilityAndDate, 
    addBooking,
    setActiveRole
  } = useDemo();

  // Step state: 1 to 7
  const [currentStep, setCurrentStep] = useState(1);

  // Form selections
  const [selectedVenueId, setSelectedVenueId] = useState<string>('venue-axion');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  
  // Customer details
  const [customerName, setCustomerName] = useState('Kavindu Senanayake');
  const [customerMobile, setCustomerMobile] = useState('077 345 8912');
  const [customerError, setCustomerError] = useState('');

  // Simulated OTP state
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const DEMO_OTP = '8492';

  // Created booking result for step 7
  const [createdBooking, setCreatedBooking] = useState<any>(null);

  // Date options state for step 3
  const [dateOptions, setDateOptions] = useState<{ dateStr: string; dayName: string; dayNum: string }[]>([]);

  useEffect(() => {
    const list = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date('2026-10-11T00:00:00Z');
      d.setUTCDate(d.getUTCDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
      const dayNum = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', timeZone: 'UTC' });
      list.push({ dateStr, dayName, dayNum });
    }
    setDateOptions(list);
  }, []);

  // Sync initial props when opened
  useEffect(() => {
    if (isBookingModalOpen) {
      const vId = bookingModalVenueId || 'venue-axion';
      setSelectedVenueId(vId);
      
      // Determine default facility
      const venueFacs = facilities.filter(f => f.venueId === vId && f.isActive);
      if (bookingModalFacilityId && venueFacs.some(f => f.id === bookingModalFacilityId)) {
        setSelectedFacilityId(bookingModalFacilityId);
      } else if (venueFacs.length > 0) {
        setSelectedFacilityId(venueFacs[0].id);
      } else {
        setSelectedFacilityId('');
      }

      // Default date to today
      const todayStr = new Date().toISOString().split('T')[0];
      setSelectedDate(todayStr);
      setSelectedTimeSlots([]);
      setCurrentStep(bookingModalIsAdmin ? 2 : 1);
      setCreatedBooking(null);
      setEnteredOtp('');
      setOtpError('');
      setCustomerError('');
      if (bookingModalIsAdmin) {
        setCustomerName('');
        setCustomerMobile('');
      } else {
        setCustomerName('Kavindu Senanayake');
        setCustomerMobile('077 345 8912');
      }
    }
  }, [isBookingModalOpen, bookingModalVenueId, bookingModalFacilityId, bookingModalIsAdmin, facilities]);

  // When selected venue changes, update facility list
  const handleVenueSelect = (vId: string) => {
    setSelectedVenueId(vId);
    const venueFacs = facilities.filter(f => f.venueId === vId && f.isActive);
    if (venueFacs.length > 0) {
      setSelectedFacilityId(venueFacs[0].id);
    } else {
      setSelectedFacilityId('');
    }
    setSelectedTimeSlots([]);
  };

  // When facility changes, clear slots
  const handleFacilitySelect = (fId: string) => {
    setSelectedFacilityId(fId);
    setSelectedTimeSlots([]);
  };

  if (!isBookingModalOpen) return null;

  // Derived current selections
  const currentVenue = venues.find(v => v.id === selectedVenueId) || venues[0];
  const availableFacilities = facilities.filter(f => f.venueId === selectedVenueId && f.isActive);
  const currentFacility = availableFacilities.find(f => f.id === selectedFacilityId) || availableFacilities[0];
  
  // Available time slots for date + facility (30-minute intervals)
  const slots = currentFacility && selectedDate 
    ? getSlotsForFacilityAndDate(currentFacility.id, selectedDate)
    : [];

  const selectedSlotObjs = slots.filter(s => selectedTimeSlots.includes(s.time));
  const sortedSelectedSlots = [...selectedTimeSlots].sort();
  const firstSlotObj = slots.find(s => s.time === sortedSelectedSlots[0]);
  const lastSlotObj = slots.find(s => s.time === sortedSelectedSlots[sortedSelectedSlots.length - 1]);

  const startTimeStr = firstSlotObj ? firstSlotObj.time : '';
  const endTimeStr = lastSlotObj ? lastSlotObj.endTime : '';
  const totalDurationHours = selectedTimeSlots.length * 0.5;
  const totalPrice = selectedSlotObjs.reduce((acc, s) => acc + s.price, 0);

  const formatTimeStr = (t: string) => {
    if (!t) return '';
    const [h, m = 0] = t.split(':').map(Number);
    const period = h >= 12 && h < 24 ? 'PM' : 'AM';
    const displayH = h === 0 || h === 24 ? 12 : h > 12 ? h - 12 : h;
    const mStr = m === 0 ? ':00' : `:${m.toString().padStart(2, '0')}`;
    return `${displayH}${mStr} ${period}`;
  };

  const formattedTimeRange = firstSlotObj && lastSlotObj
    ? `${formatTimeStr(startTimeStr)} – ${formatTimeStr(endTimeStr)}`
    : '';

  // Slot toggle and multi-selection handler
  const handleSlotClick = (slotTime: string) => {
    if (selectedTimeSlots.length === 0) {
      setSelectedTimeSlots([slotTime]);
      return;
    }

    // If only one is selected and user clicks another slot
    if (selectedTimeSlots.length === 1 && selectedTimeSlots[0] === slotTime) {
      setSelectedTimeSlots([]);
      return;
    }

    const availableSlotTimes = slots.filter(s => s.status !== 'booked').map(s => s.time);
    const currentFirst = sortedSelectedSlots[0];

    // If user clicks a slot after current first slot, select the contiguous range!
    if (slotTime > currentFirst) {
      const startIdx = slots.findIndex(s => s.time === currentFirst);
      const endIdx = slots.findIndex(s => s.time === slotTime);
      if (startIdx !== -1 && endIdx !== -1 && endIdx >= startIdx) {
        const range = slots.slice(startIdx, endIdx + 1);
        const allAvailable = range.every(s => s.status !== 'booked');
        if (allAvailable) {
          setSelectedTimeSlots(range.map(s => s.time));
          return;
        }
      }
    }

    // Toggle or reset to single slot
    if (selectedTimeSlots.includes(slotTime)) {
      const remaining = selectedTimeSlots.filter(t => t !== slotTime);
      setSelectedTimeSlots(remaining);
    } else {
      setSelectedTimeSlots([slotTime]);
    }
  };

  // Quick duration preset helper
  const handleApplyDurationPreset = (sessionsCount: number) => {
    const baseStart = sortedSelectedSlots[0] || (slots.find(s => s.status === 'available')?.time);
    if (!baseStart) return;

    const startIdx = slots.findIndex(s => s.time === baseStart);
    if (startIdx === -1) return;

    const targetRange = slots.slice(startIdx, startIdx + sessionsCount);
    const allAvailable = targetRange.length === sessionsCount && targetRange.every(s => s.status !== 'booked');

    if (allAvailable) {
      setSelectedTimeSlots(targetRange.map(s => s.time));
    } else {
      setSelectedTimeSlots([baseStart]);
    }
  };

  const isValidSriLankanPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^(?:\+94|0094|94|0)?[1-9][0-9]{8}$/.test(cleaned);
  };

  // Step 4 Validation
  const handleProceedFromCustomerDetails = () => {
    if (!customerName.trim()) {
      setCustomerError('Please enter the customer\'s full name');
      return;
    }
    if (!customerMobile.trim() || !isValidSriLankanPhone(customerMobile)) {
      setCustomerError('Please enter a valid Sri Lankan mobile number (e.g. 077 123 4567 or +94 77 123 4567)');
      return;
    }
    setCustomerError('');
    if (bookingModalIsAdmin) {
      setCurrentStep(6); // Admin skips Step 5 (OTP) completely
    } else {
      setCurrentStep(5); // Proceed to simulated OTP
    }
  };

  // Step 5 Simulated OTP verification
  const handleVerifyOtp = () => {
    if (enteredOtp.trim() !== DEMO_OTP) {
      setOtpError(`Demo code is ${DEMO_OTP}. Please enter or click auto-fill.`);
      return;
    }
    setOtpError('');
    setCurrentStep(6); // Proceed to booking summary
  };

  // Step 6 Confirmation -> Create booking
  const handleConfirmBooking = () => {
    if (!currentFacility || selectedTimeSlots.length === 0 || !firstSlotObj || !lastSlotObj) return;

    // Live recheck of availability before creating booking
    const latestSlots = getSlotsForFacilityAndDate(currentFacility.id, selectedDate);
    const hasOverlap = selectedTimeSlots.some(t => {
      const found = latestSlots.find(s => s.time === t);
      return !found || found.status === 'booked';
    });

    if (hasOverlap) {
      alert('One or more selected time slots are no longer available. Please select another slot.');
      setCurrentStep(3);
      return;
    }

    const effectiveHourlyRate = totalDurationHours > 0 ? Math.round(totalPrice / totalDurationHours) : 2500;

    const newBk = addBooking({
      venueId: currentVenue.id,
      venueName: currentVenue.name,
      facilityId: currentFacility.id,
      facilityName: currentFacility.name,
      sport: currentFacility.sports[0] || 'Football',
      date: selectedDate,
      startTime: startTimeStr,
      endTime: endTimeStr,
      durationHours: totalDurationHours,
      hourlyRate: effectiveHourlyRate,
      totalPrice,
      customerName: customerName.trim(),
      customerMobile: customerMobile.trim(),
      status: 'confirmed',
      paymentStatus: 'pending_at_venue',
      notes: bookingModalIsAdmin
        ? `Booked directly by Venue Admin on customer's behalf (${selectedTimeSlots.length} x 30-min sessions: ${formattedTimeRange}).`
        : `Multi-session court reservation: ${selectedTimeSlots.length} x 30-min sessions (${formattedTimeRange}).`
    });

    setCreatedBooking(newBk);
    setCurrentStep(7); // Show confirmation pass
  };

  // Jump to venue admin
  const handleViewInVenueAdmin = () => {
    closeBookingModal();
    setActiveRole('venue_admin');
    router.push('/admin/venue');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Box */}
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
              {bookingModalIsAdmin ? (
                currentStep === 2 ? '1/4' :
                currentStep === 3 ? '2/4' :
                currentStep === 4 ? '3/4' :
                currentStep === 6 ? '4/4' : '✓'
              ) : (
                `${currentStep}/7`
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{bookingModalIsAdmin ? 'Book for Customer' : 'Court Reservation Wizard'}</span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800/40">
                  {bookingModalIsAdmin ? 'Venue Admin' : 'Prototype Demo'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {bookingModalIsAdmin ? (
                  currentStep === 2 ? `Step 1 of 4: Select pitch or court (${currentVenue?.name})` :
                  currentStep === 3 ? 'Step 2 of 4: Select date and available time slot' :
                  currentStep === 4 ? 'Step 3 of 4: Enter customer details (OTP skipped)' :
                  currentStep === 6 ? 'Step 4 of 4: Review reservation summary & confirm' :
                  'Booking confirmed on behalf of customer'
                ) : (
                  currentStep === 1 ? 'Step 1: Choose your indoor sports centre' :
                  currentStep === 2 ? 'Step 2: Select pitch, court, or table' :
                  currentStep === 3 ? 'Step 3: Select date and available time slot' :
                  currentStep === 4 ? 'Step 4: Enter contact details for confirmation' :
                  currentStep === 5 ? 'Step 5: Simulated SMS OTP verification' :
                  currentStep === 6 ? 'Step 6: Review booking summary & venue terms' :
                  'Step 7: Booking confirmed! Pay at the venue'
                )}
              </p>
            </div>
          </div>

          <button
            onClick={closeBookingModal}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-950 h-1">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-lime-400 h-1 transition-all duration-300"
            style={{ 
              width: bookingModalIsAdmin 
                ? (currentStep === 2 ? '25%' : currentStep === 3 ? '50%' : currentStep === 4 ? '75%' : '100%')
                : `${(currentStep / 7) * 100}%` 
            }}
          />
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* ================= STEP 1: SELECT VENUE ================= */}
          {currentStep === 1 && !bookingModalIsAdmin && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                  Select Indoor Sports Venue
                </h4>
                <span className="text-xs text-slate-400">
                  {venues.filter(v => v.isActive).length} active venues available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {venues.filter(v => v.isActive).map((venue) => {
                  const isSelected = venue.id === selectedVenueId;
                  return (
                    <div
                      key={venue.id}
                      onClick={() => handleVenueSelect(venue.id)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            {venue.district}
                          </span>
                          {venue.id === 'venue-axion' && (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                              AXION (Pilot)
                            </span>
                          )}
                        </div>

                        <h5 className="text-base font-bold text-white mb-1">
                          {venue.name}
                        </h5>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {venue.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          From <strong className="text-emerald-400">LKR {venue.startingPricePerHour.toLocaleString()}</strong>/hr
                        </span>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700 text-transparent'}`}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 2: SELECT FACILITY ================= */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    Select Facility at {currentVenue?.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Showing courts and pitches configured for this specific venue.
                  </p>
                </div>
              </div>

              {availableFacilities.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800">
                  <p className="text-sm text-slate-400">No active facilities found for this venue.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {availableFacilities.map((fac) => {
                    const isSelected = fac.id === selectedFacilityId;
                    return (
                      <div
                        key={fac.id}
                        onClick={() => handleFacilitySelect(fac.id)}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                          isSelected 
                            ? 'bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20' 
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex flex-wrap gap-1">
                              {fac.sports.map(s => (
                                <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-emerald-300">
                                  {s}
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-slate-400">
                              {fac.slotDurationMinutes} min slot
                            </span>
                          </div>

                          <h5 className="text-base font-bold text-white mb-1">
                            {fac.name}
                          </h5>
                          {fac.surfaceType && (
                            <p className="text-xs text-slate-400 mb-2">
                              Surface: {fac.surfaceType}
                            </p>
                          )}

                          <div className="space-y-1">
                            {fac.features.slice(0, 2).map((feat, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-end">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700 text-transparent'}`}>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3: SELECT DATE & TIME ================= */}
          {currentStep === 3 && (
            <div className="space-y-6">
              
              {/* Date Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  1. Select Date
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {dateOptions.map((d) => {
                    const isSelected = d.dateStr === selectedDate;
                    return (
                      <button
                        key={d.dateStr}
                        type="button"
                        onClick={() => {
                          setSelectedDate(d.dateStr);
                          setSelectedTimeSlots([]);
                        }}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSelected 
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/30' 
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="block text-[11px] uppercase tracking-wider opacity-80">
                          {d.dayName}
                        </span>
                        <span className="block text-sm font-black mt-0.5">
                          {d.dayNum}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots Grid (30-Minute Sessions) */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                      2. Select Booking Sessions ({currentFacility?.name})
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Each slot is 30 mins. Select multiple sessions for longer bookings (e.g. 6:00 PM – 8:00 PM or 8:00 PM – 10:30 PM).
                    </span>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 shrink-0">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500" />
                      Available
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                      Booked
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Selected
                    </span>
                  </div>
                </div>

                {/* Quick Length Presets */}
                <div className="mb-3.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-400 mr-1">
                    Quick Duration:
                  </span>
                  {[
                    { label: '30 mins (1 session)', sessions: 1 },
                    { label: '1 hour (2 sessions)', sessions: 2 },
                    { label: '1.5 hrs (3 sessions)', sessions: 3 },
                    { label: '2 hours (4 sessions)', sessions: 4 },
                    { label: '2.5 hrs (5 sessions)', sessions: 5 },
                    { label: '3 hours (6 sessions)', sessions: 6 },
                  ].map((preset) => {
                    const isActive = selectedTimeSlots.length === preset.sessions;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleApplyDurationPreset(preset.sessions)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          isActive
                            ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                            : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1">
                  {slots.map((slot) => {
                    const isSelected = selectedTimeSlots.includes(slot.time);
                    const isBooked = slot.status === 'booked';

                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={isBooked}
                        onClick={() => !isBooked && handleSlotClick(slot.time)}
                        className={`p-2.5 rounded-xl border text-left transition-all relative ${
                          isBooked 
                            ? 'bg-slate-950/60 border-slate-800/80 text-slate-600 cursor-not-allowed line-through'
                            : isSelected 
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 scale-[1.01]'
                              : 'bg-slate-950 border-slate-800 hover:border-emerald-500/50 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">
                            {slot.displayTime}
                          </span>
                          {isBooked ? (
                            <span className="text-[9px] uppercase font-bold text-rose-500/80 no-underline">
                              Booked
                            </span>
                          ) : (
                            <span className={`text-[10px] font-bold ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`}>
                              LKR {slot.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1 text-[10px]">
                          <span className={isSelected ? 'text-slate-900 font-medium' : 'text-slate-500'}>
                            until {slot.endTime}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>
                            30m
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Price & Time Window Display */}
              {selectedTimeSlots.length > 0 && firstSlotObj && lastSlotObj && (
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-black text-white block">
                        {formattedTimeRange} ({totalDurationHours} Hour{totalDurationHours === 1 ? '' : 's'})
                      </span>
                      <span className="text-xs text-slate-400">
                        {selectedDate} • {selectedTimeSlots.length} x 30-min sessions at {currentFacility?.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Total Amount</span>
                    <span className="text-lg font-black text-emerald-400">
                      LKR {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ================= STEP 4: CUSTOMER DETAILS ================= */}
          {currentStep === 4 && (
            <div className="space-y-5 max-w-lg mx-auto">
              <div>
                <h4 className="text-base font-bold text-white mb-1">
                  {bookingModalIsAdmin ? 'Customer Details' : 'Contact Information'}
                </h4>
                <p className="text-xs text-slate-400">
                  {bookingModalIsAdmin
                    ? 'Enter customer details for this direct reservation. OTP verification is bypassed.'
                    : 'No account or password required. We only need your name and mobile number to issue your booking reference.'}
                </p>
              </div>

              {bookingModalIsAdmin && (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>
                    <strong>Venue Admin Mode:</strong> Creating booking on customer&apos;s behalf. Phone OTP verification is skipped.
                  </span>
                </div>
              )}

              {customerError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{customerError}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="customer-name-input" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Customer Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="customer-name-input"
                      type="text"
                      placeholder="e.g. Kavindu Senanayake"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="customer-mobile-input" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Sri Lankan Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="customer-mobile-input"
                      type="text"
                      placeholder="e.g. 077 345 8912"
                      value={customerMobile}
                      onChange={(e) => setCustomerMobile(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {bookingModalIsAdmin
                      ? 'Format: 07X XXX XXXX or +94 7X XXX XXXX.'
                      : 'SMS booking confirmation pass will be simulated for this number.'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {bookingModalIsAdmin
                    ? `Booking will be recorded under ${currentVenue?.name} facility ledger.`
                    : `Your contact info is shared only with ${currentVenue?.name} for gate verification.`}
                </span>
              </div>
            </div>
          )}

          {/* ================= STEP 5: SIMULATED PHONE OTP ================= */}
          {currentStep === 5 && !bookingModalIsAdmin && (
            <div className="space-y-5 max-w-md mx-auto text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-emerald-400" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-1">
                  Simulated OTP Verification
                </h4>
                <p className="text-xs text-slate-400">
                  Simulating SMS verification to mobile: <strong className="text-slate-200">{customerMobile}</strong>
                </p>
                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                  Demo Sandbox • Real SMS is NOT sent
                </div>
              </div>

              {/* Demo Hint Banner */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                <p>
                  For demonstration purposes, your simulated OTP is: <span className="font-mono font-bold text-emerald-400 text-sm tracking-widest">{DEMO_OTP}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setEnteredOtp(DEMO_OTP)}
                  className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-colors"
                >
                  ⚡ Auto-fill Demo Code ({DEMO_OTP})
                </button>
              </div>

              {otpError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {otpError}
                </div>
              )}

              {/* OTP Inputs */}
              <div>
                <label htmlFor="otp-demo-code-input" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Enter 4-Digit Code
                </label>
                <input
                  id="otp-demo-code-input"
                  type="text"
                  maxLength={4}
                  placeholder="8492"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="w-40 mx-auto bg-slate-950 border border-slate-800 rounded-xl py-3 text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="text-[11px] text-slate-500">
                Clicking verify advances the prototype to the booking summary.
              </div>
            </div>
          )}

          {/* ================= STEP 6: BOOKING SUMMARY ================= */}
          {currentStep === 6 && (
            <div className="space-y-5 max-w-xl mx-auto">
              <div>
                <h4 className="text-base font-bold text-white mb-1">
                  Review & Confirm Your Reservation
                </h4>
                <p className="text-xs text-slate-400">
                  Please review your reservation parameters before final confirmation.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase font-semibold">Venue</span>
                    <h5 className="text-base font-bold text-white">{currentVenue?.name}</h5>
                    <p className="text-xs text-slate-400">{currentVenue?.address}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400">
                    {currentFacility?.sports[0]}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Facility / Pitch</span>
                    <strong className="text-slate-200">{currentFacility?.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date</span>
                    <strong className="text-slate-200">{selectedDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Reserved Time Slot</span>
                    <strong className="text-emerald-400 font-bold">
                      {formattedTimeRange} ({totalDurationHours} hrs • {selectedTimeSlots.length} sessions)
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Session Breakdown</span>
                    <strong className="text-slate-200">
                      {selectedTimeSlots.length} x 30-min sessions
                    </strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Reserved For</span>
                    <strong className="text-slate-200">{customerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Customer Mobile</span>
                    <strong className="text-slate-200">{customerMobile}</strong>
                  </div>
                </div>

                {/* Important Pay At Venue Notice */}
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-2.5">
                  <CreditCard className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-emerald-300 block">
                      {bookingModalIsAdmin ? 'Payment to be collected at the venue counter' : 'Payment is made at the venue.'}
                    </span>
                    <span className="text-slate-300">
                      {bookingModalIsAdmin
                        ? 'Collect cash or card payment when the customer arrives for their booking. You can update payment status in the admin ledger.'
                        : 'No card charge today. You pay the venue reception desk (cash or card) when you arrive to play.'}
                    </span>
                  </div>
                </div>

                {/* Total Price Banner */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Total Amount Payable at Venue</span>
                  <span className="text-xl font-black text-emerald-400">
                    LKR {totalPrice.toLocaleString()}
                  </span>
                </div>

              </div>
            </div>
          )}

          {/* ================= STEP 7: CONFIRMATION SUCCESS PASS ================= */}
          {currentStep === 7 && createdBooking && (
            <div className="space-y-6 max-w-lg mx-auto text-center py-2">
              
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  Demo Booking Confirmed
                </span>
                <h4 className="text-2xl font-black text-white mt-1">
                  Your Court is Reserved!
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Present this reference when checking in at {createdBooking.venueName}.
                </p>
              </div>

              {/* Ticket Pass */}
              <div className="rounded-2xl bg-slate-950 border-2 border-emerald-500/40 p-5 text-left space-y-4 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />

                <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Demo Reference #</span>
                    <span className="text-xl font-mono font-black text-emerald-400">
                      {createdBooking.bookingRef}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    CONFIRMED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Venue</span>
                    <strong className="text-white">{createdBooking.venueName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Pitch / Facility</span>
                    <strong className="text-white">{createdBooking.facilityName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date & Time Range</span>
                    <strong className="text-emerald-300">{createdBooking.date} • {createdBooking.startTime} – {createdBooking.endTime} ({createdBooking.durationHours} hrs)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Venue Phone</span>
                    <strong className="text-white">{currentVenue?.phone}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Total Payable at Counter</span>
                    <span className="text-lg font-black text-emerald-400">
                      LKR {createdBooking.totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 italic">
                    Pay after play
                  </span>
                </div>
              </div>

              {/* Venue Admin / Customer Confirmation Action */}
              {bookingModalIsAdmin ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-left space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Synchronized to Venue Ledger</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Booking <code className="text-emerald-300 font-bold">{createdBooking.bookingRef}</code> is now confirmed for <strong className="text-white">{createdBooking.customerName}</strong>. The time slot is locked and unavailable to other customers.
                  </p>
                  <button
                    type="button"
                    onClick={closeBookingModal}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Return to Venue Dashboard</span>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/40 text-left space-y-2">
                  <div className="flex items-center gap-2 text-blue-300 font-bold text-xs">
                    <Building className="w-4 h-4 text-blue-400" />
                    <span>Verify in Venue Admin Dashboard</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    This new booking (<code className="text-blue-300">{createdBooking.bookingRef}</code>) has been synchronized directly to the AXION Venue Admin and Super Admin data store for this session!
                  </p>
                  <button
                    type="button"
                    onClick={handleViewInVenueAdmin}
                    className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Open AXION Venue Admin to inspect this booking</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Bottom Actions Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between">
          
          {/* Back button or dismiss */}
          {((bookingModalIsAdmin && currentStep > 2 && currentStep < 7) || (!bookingModalIsAdmin && currentStep > 1 && currentStep < 7)) ? (
            <button
              type="button"
              onClick={() => {
                if (bookingModalIsAdmin) {
                  if (currentStep === 6) setCurrentStep(4);
                  else if (currentStep === 4) setCurrentStep(3);
                  else if (currentStep === 3) setCurrentStep(2);
                } else {
                  setCurrentStep(prev => prev - 1);
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={closeBookingModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              {currentStep === 7 ? 'Done' : 'Cancel'}
            </button>
          )}

          {/* Forward Action Buttons */}
          <div className="flex items-center gap-2">
            {currentStep === 1 && !bookingModalIsAdmin && (
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={!selectedVenueId}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Continue to Facilities</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 2 && (
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                disabled={!selectedFacilityId}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Pick Date & Time</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                disabled={selectedTimeSlots.length === 0}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <span>Customer Details ({selectedTimeSlots.length} session{selectedTimeSlots.length === 1 ? '' : 's'})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 4 && (
              <button
                type="button"
                onClick={handleProceedFromCustomerDetails}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <span>{bookingModalIsAdmin ? 'Review Booking Summary' : 'Proceed to Simulated OTP'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 5 && !bookingModalIsAdmin && (
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Verify Demo Code & Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 6 && (
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{bookingModalIsAdmin ? 'Confirm Booking for Customer' : 'Confirm Demo Booking'}</span>
              </button>
            )}

            {currentStep === 7 && (
              <button
                type="button"
                onClick={closeBookingModal}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                <span>{bookingModalIsAdmin ? 'Return to Dashboard' : 'Close Window'}</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
