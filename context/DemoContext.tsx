'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Venue, 
  Facility, 
  PricingRule, 
  DemoBooking, 
  DemoRole, 
  BookingStatus, 
  PaymentCollectionStatus, 
  TimeSlot, 
  CommissionRecord 
} from '@/types';
import { 
  INITIAL_VENUES, 
  INITIAL_FACILITIES, 
  INITIAL_PRICING_RULES, 
  INITIAL_BOOKINGS 
} from '@/data/sampleData';

interface DemoContextType {
  // State
  venues: Venue[];
  facilities: Facility[];
  pricingRules: PricingRule[];
  bookings: DemoBooking[];
  activeRole: DemoRole;
  commissionRate: number;
  settledBookingIds: string[];
  
  // Role switcher
  setActiveRole: (role: DemoRole) => void;
  
  // Booking operations
  addBooking: (booking: Omit<DemoBooking, 'id' | 'bookingRef' | 'createdAt'>) => DemoBooking;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  updatePaymentStatus: (id: string, status: PaymentCollectionStatus) => void;
  
  // Pricing engine & operations
  calculatePriceForSlot: (venueId: string, facilityId: string, date: string, startTime: string) => number;
  getSlotsForFacilityAndDate: (facilityId: string, date: string) => TimeSlot[];
  addPricingRule: (rule: Omit<PricingRule, 'id'>) => void;
  updatePricingRule: (rule: PricingRule) => void;
  deletePricingRule: (id: string) => void;
  
  // Facility operations
  addFacility: (facility: Omit<Facility, 'id'>) => void;
  updateFacility: (facility: Facility) => void;
  toggleFacilityActive: (id: string) => void;
  
  // Venue operations
  updateVenue: (venue: Venue) => void;
  addVenue: (venue: Omit<Venue, 'id' | 'slug'>) => void;
  toggleVenueActive: (id: string) => void;
  
  // Commission operations
  setCommissionRate: (rate: number) => void;
  settleVenueCommission: (bookingId: string) => void;
  getCommissionRecords: () => CommissionRecord[];
  
  // Booking Modal helper
  isBookingModalOpen: boolean;
  bookingModalVenueId: string | null;
  bookingModalFacilityId: string | null;
  openBookingModal: (venueId?: string, facilityId?: string) => void;
  closeBookingModal: () => void;
  
  // Reset demo
  resetToDefaults: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'courtly_demo_v1_';

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeRole, setActiveRole] = useState<DemoRole>('customer');
  const [venues, setVenues] = useState<Venue[]>(INITIAL_VENUES);
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>(INITIAL_PRICING_RULES);
  const [bookings, setBookings] = useState<DemoBooking[]>(INITIAL_BOOKINGS);
  const [commissionRate, setCommissionRateState] = useState<number>(10);
  const [settledBookingIds, setSettledBookingIds] = useState<string[]>([]);
  
  // Modal quick access
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalVenueId, setBookingModalVenueId] = useState<string | null>(null);
  const [bookingModalFacilityId, setBookingModalFacilityId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedVenues = localStorage.getItem(`${STORAGE_KEY_PREFIX}venues`);
      const savedFacilities = localStorage.getItem(`${STORAGE_KEY_PREFIX}facilities`);
      const savedPricing = localStorage.getItem(`${STORAGE_KEY_PREFIX}pricing`);
      const savedBookings = localStorage.getItem(`${STORAGE_KEY_PREFIX}bookings`);
      const savedRate = localStorage.getItem(`${STORAGE_KEY_PREFIX}comm_rate`);
      const savedSettled = localStorage.getItem(`${STORAGE_KEY_PREFIX}settled`);
      const savedRole = localStorage.getItem(`${STORAGE_KEY_PREFIX}role`);

      if (savedVenues) setVenues(JSON.parse(savedVenues));
      if (savedFacilities) setFacilities(JSON.parse(savedFacilities));
      if (savedPricing) setPricingRules(JSON.parse(savedPricing));
      if (savedBookings) setBookings(JSON.parse(savedBookings));
      if (savedRate) setCommissionRateState(Number(savedRate));
      if (savedSettled) setSettledBookingIds(JSON.parse(savedSettled));
      if (savedRole) setActiveRole(savedRole as DemoRole);
    } catch {
      // ignore storage errors
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}venues`, JSON.stringify(venues));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}facilities`, JSON.stringify(facilities));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}pricing`, JSON.stringify(pricingRules));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}bookings`, JSON.stringify(bookings));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}comm_rate`, commissionRate.toString());
      localStorage.setItem(`${STORAGE_KEY_PREFIX}settled`, JSON.stringify(settledBookingIds));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}role`, activeRole);
    } catch {
      // ignore
    }
  }, [venues, facilities, pricingRules, bookings, commissionRate, settledBookingIds, activeRole, isHydrated]);

  // Pricing engine
  const calculatePriceForSlot = (
    venueId: string, 
    facilityId: string, 
    date: string, 
    startTime: string
  ): number => {
    // Determine weekday or weekend
    const dateObj = new Date(date + 'T12:00:00Z');
    const dayOfWeek = dateObj.getUTCDay(); // 0 is Sunday, 6 is Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const targetDayType = isWeekend ? 'weekend' : 'weekday';

    // Parse hour from startTime, e.g. "07:00" -> 7
    const [startHourStr] = startTime.split(':');
    const slotHour = parseInt(startHourStr, 10);

    // Filter rules matching facility or venue
    const facilityRules = pricingRules.filter(r => r.facilityId === facilityId);

    // Find rule that covers this day and time
    for (const rule of facilityRules) {
      const matchDay = rule.dayType === 'all' || rule.dayType === targetDayType;
      if (!matchDay) continue;

      const ruleStartHour = parseInt(rule.startTime.split(':')[0], 10);
      let ruleEndHour = parseInt(rule.endTime.split(':')[0], 10);
      if (ruleEndHour === 0) ruleEndHour = 24; // midnight is 24:00

      if (slotHour >= ruleStartHour && slotHour < ruleEndHour) {
        return rule.pricePerHour;
      }
    }

    // Default fallback to venue starting price
    const venue = venues.find(v => v.id === venueId);
    return venue ? venue.startingPricePerHour : 2500;
  };

  // Slot generator with live booking checks
  const getSlotsForFacilityAndDate = (facilityId: string, date: string): TimeSlot[] => {
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility) return [];

    const venue = venues.find(v => v.id === facility.venueId);
    const venueId = venue ? venue.id : '';

    // Standard hours 07:00 to 23:00 (1-hour slots)
    const hours = [
      '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
      '19:00', '20:00', '21:00', '22:00', '23:00'
    ];

    // Find existing non-cancelled bookings for this facility & date
    const dayBookings = bookings.filter(
      b => b.facilityId === facilityId && b.date === date && b.status !== 'cancelled'
    );

    return hours.map(h => {
      const [hourNum] = h.split(':').map(Number);
      const nextHour = (hourNum + 1).toString().padStart(2, '0') + ':00';
      
      const formatDisplay = (hr: number) => {
        const period = hr >= 12 ? 'PM' : 'AM';
        const displayHr = hr % 12 === 0 ? 12 : hr % 12;
        return `${displayHr}:00 ${period}`;
      };

      const displayTime = formatDisplay(hourNum);

      // Check if slot overlaps any booking
      const isBooked = dayBookings.some(b => {
        const bStartHour = parseInt(b.startTime.split(':')[0], 10);
        const bEndHour = parseInt(b.endTime.split(':')[0], 10);
        const effectiveEnd = bEndHour === 0 ? 24 : bEndHour;
        return hourNum >= bStartHour && hourNum < effectiveEnd;
      });

      const calculatedPrice = calculatePriceForSlot(venueId, facilityId, date, h);

      return {
        time: h,
        displayTime,
        endTime: nextHour,
        status: isBooked ? 'booked' : 'available',
        price: calculatedPrice,
      };
    });
  };

  // Add a new booking
  const addBooking = (
    bookingData: Omit<DemoBooking, 'id' | 'bookingRef' | 'createdAt'>
  ): DemoBooking => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newBooking: DemoBooking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingRef: `CRTL-${randomSuffix}`,
      createdAt: new Date().toISOString(),
    };

    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status } : b))
    );
  };

  const updatePaymentStatus = (id: string, paymentStatus: PaymentCollectionStatus) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { 
        ...b, 
        paymentStatus, 
        paymentCollectedAt: paymentStatus === 'collected_at_venue' ? new Date().toISOString() : undefined 
      } : b))
    );
  };

  // Pricing rules CRUD
  const addPricingRule = (ruleData: Omit<PricingRule, 'id'>) => {
    const newRule: PricingRule = {
      ...ruleData,
      id: `rule-${Date.now()}`
    };
    setPricingRules(prev => [...prev, newRule]);
  };

  const updatePricingRule = (updatedRule: PricingRule) => {
    setPricingRules(prev =>
      prev.map(r => (r.id === updatedRule.id ? updatedRule : r))
    );
  };

  const deletePricingRule = (id: string) => {
    setPricingRules(prev => prev.filter(r => r.id !== id));
  };

  // Facility management CRUD
  const addFacility = (facilityData: Omit<Facility, 'id'>) => {
    const newFac: Facility = {
      ...facilityData,
      id: `fac-${Date.now()}`
    };
    setFacilities(prev => [...prev, newFac]);
  };

  const updateFacility = (updated: Facility) => {
    setFacilities(prev => prev.map(f => (f.id === updated.id ? updated : f)));
  };

  const toggleFacilityActive = (id: string) => {
    setFacilities(prev =>
      prev.map(f => (f.id === id ? { ...f, isActive: !f.isActive } : f))
    );
  };

  // Venue management CRUD
  const updateVenue = (updated: Venue) => {
    setVenues(prev => prev.map(v => (v.id === updated.id ? updated : v)));
  };

  const addVenue = (venueData: Omit<Venue, 'id' | 'slug'>) => {
    const slug = venueData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newVenue: Venue = {
      ...venueData,
      id: `venue-${Date.now()}`,
      slug
    };
    setVenues(prev => [...prev, newVenue]);
  };

  const toggleVenueActive = (id: string) => {
    setVenues(prev =>
      prev.map(v => (v.id === id ? { ...v, isActive: !v.isActive } : v))
    );
  };

  // Commission operations
  const setCommissionRate = (rate: number) => {
    setCommissionRateState(rate);
  };

  const settleVenueCommission = (bookingId: string) => {
    setSettledBookingIds(prev => [...prev, bookingId]);
  };

  const getCommissionRecords = (): CommissionRecord[] => {
    return bookings.map(b => {
      const isSettled = settledBookingIds.includes(b.id);
      const commissionAmount = Math.round((b.totalPrice * commissionRate) / 100);
      return {
        id: `comm-${b.id}`,
        bookingId: b.id,
        venueId: b.venueId,
        venueName: b.venueName,
        bookingRef: b.bookingRef,
        bookingAmount: b.totalPrice,
        commissionRate,
        commissionAmount,
        bookingStatus: b.status,
        settlementStatus: isSettled ? 'settled' : 'outstanding',
        settledAt: isSettled ? new Date().toISOString() : undefined,
        date: b.date,
      };
    });
  };

  const openBookingModal = (venueId?: string, facilityId?: string) => {
    setBookingModalVenueId(venueId || 'venue-axion');
    setBookingModalFacilityId(facilityId || null);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  const resetToDefaults = () => {
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}venues`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}facilities`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}pricing`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}bookings`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}comm_rate`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}settled`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}role`);
    } catch {
      // ignore
    }
    setVenues(INITIAL_VENUES);
    setFacilities(INITIAL_FACILITIES);
    setPricingRules(INITIAL_PRICING_RULES);
    setBookings(INITIAL_BOOKINGS);
    setCommissionRateState(10);
    setSettledBookingIds([]);
    setActiveRole('customer');
  };

  return (
    <DemoContext.Provider
      value={{
        venues,
        facilities,
        pricingRules,
        bookings,
        activeRole,
        commissionRate,
        settledBookingIds,
        setActiveRole,
        addBooking,
        updateBookingStatus,
        updatePaymentStatus,
        calculatePriceForSlot,
        getSlotsForFacilityAndDate,
        addPricingRule,
        updatePricingRule,
        deletePricingRule,
        addFacility,
        updateFacility,
        toggleFacilityActive,
        updateVenue,
        addVenue,
        toggleVenueActive,
        setCommissionRate,
        settleVenueCommission,
        getCommissionRecords,
        isBookingModalOpen,
        bookingModalVenueId,
        bookingModalFacilityId,
        openBookingModal,
        closeBookingModal,
        resetToDefaults,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
