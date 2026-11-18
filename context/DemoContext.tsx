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
  VenueSubscription,
  SubscriptionPayment,
  AdminAccount,
  PermanentBooking,
  ReleasedOccurrence,
  OccurrenceView,
  OccurrenceStatus,
  DayOfWeek
} from '@/types';
import { 
  INITIAL_VENUES, 
  INITIAL_FACILITIES, 
  INITIAL_PRICING_RULES, 
  INITIAL_BOOKINGS,
  INITIAL_ADMIN_ACCOUNTS,
  INITIAL_VENUE_SUBSCRIPTIONS,
  INITIAL_SUBSCRIPTION_PAYMENTS,
  INITIAL_PERMANENT_BOOKINGS
} from '@/data/sampleData';

interface DemoContextType {
  // State
  venues: Venue[];
  facilities: Facility[];
  pricingRules: PricingRule[];
  bookings: DemoBooking[];
  activeRole: DemoRole;
  subscriptions: VenueSubscription[];
  subscriptionPayments: SubscriptionPayment[];
  adminAccounts: AdminAccount[];
  currentAdmin: AdminAccount | null;
  permanentBookings: PermanentBooking[];
  
  // Auth & Admin operations
  loginAdmin: (usernameOrIndoor: string, password: string) => { success: boolean; account?: AdminAccount; error?: string };
  logoutAdmin: () => void;
  createAdminAccount: (data: Omit<AdminAccount, 'id' | 'createdAt'>) => AdminAccount;
  deleteAdminAccount: (id: string) => void;
  updateAdminAccount: (account: AdminAccount) => void;
  
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Role switcher
  setActiveRole: (role: DemoRole) => void;
  
  // Booking operations
  addBooking: (booking: Omit<DemoBooking, 'id' | 'bookingRef' | 'createdAt'>) => DemoBooking;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  updatePaymentStatus: (id: string, status: PaymentCollectionStatus) => void;
  
  // Permanent Bookings operations
  addPermanentBooking: (data: Omit<PermanentBooking, 'id' | 'bookingRef' | 'createdAt' | 'releasedOccurrences'>) => { success: boolean; booking?: PermanentBooking; error?: string };
  updatePermanentBooking: (booking: PermanentBooking) => { success: boolean; error?: string };
  cancelPermanentBooking: (id: string, reason?: string) => void;
  releaseOccurrence: (permanentBookingId: string, date: string, reason?: string) => { success: boolean; error?: string };
  unreleaseOccurrence: (permanentBookingId: string, date: string) => { success: boolean; error?: string };
  getOccurrencesForPermanentBooking: (permanentBookingId: string, weeksAhead?: number) => OccurrenceView[];
  
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
  
  // Subscription operations (Fixed LKR 10,000/month model)
  recordSubscriptionPayment: (payment: Omit<SubscriptionPayment, 'id' | 'paymentRef'>) => SubscriptionPayment;
  updateSubscriptionStatus: (subscriptionId: string, status: VenueSubscription['status']) => void;
  updateMonthlyPrice: (subscriptionId: string, price: number) => void;
  
  // Booking Modal helper
  isBookingModalOpen: boolean;
  bookingModalVenueId: string | null;
  bookingModalFacilityId: string | null;
  bookingModalIsAdmin: boolean;
  openBookingModal: (venueId?: string, facilityId?: string, isAdmin?: boolean) => void;
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
  const [subscriptions, setSubscriptions] = useState<VenueSubscription[]>(INITIAL_VENUE_SUBSCRIPTIONS);
  const [subscriptionPayments, setSubscriptionPayments] = useState<SubscriptionPayment[]>(INITIAL_SUBSCRIPTION_PAYMENTS);
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>(INITIAL_ADMIN_ACCOUNTS);
  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(null);
  const [permanentBookings, setPermanentBookings] = useState<PermanentBooking[]>(INITIAL_PERMANENT_BOOKINGS);
  
  // Modal quick access
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalVenueId, setBookingModalVenueId] = useState<string | null>(null);
  const [bookingModalFacilityId, setBookingModalFacilityId] = useState<string | null>(null);
  const [bookingModalIsAdmin, setBookingModalIsAdmin] = useState(false);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('courtly_theme') as 'dark' | 'light' | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(savedTheme);
          document.documentElement.style.colorScheme = savedTheme;
        }
      } else {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        }
      }

      const savedVenues = localStorage.getItem(`${STORAGE_KEY_PREFIX}venues`);
      const savedFacilities = localStorage.getItem(`${STORAGE_KEY_PREFIX}facilities`);
      const savedPricing = localStorage.getItem(`${STORAGE_KEY_PREFIX}pricing`);
      const savedBookings = localStorage.getItem(`${STORAGE_KEY_PREFIX}bookings`);
      const savedSubscriptions = localStorage.getItem(`${STORAGE_KEY_PREFIX}subscriptions`);
      const savedSubPayments = localStorage.getItem(`${STORAGE_KEY_PREFIX}sub_payments`);
      const savedPerm = localStorage.getItem(`${STORAGE_KEY_PREFIX}permanent_bookings`);
      const savedRole = localStorage.getItem(`${STORAGE_KEY_PREFIX}role`);
      const savedAccounts = localStorage.getItem(`${STORAGE_KEY_PREFIX}accounts`);
      const savedAdmin = localStorage.getItem(`${STORAGE_KEY_PREFIX}current_admin`);

      if (savedVenues) setVenues(JSON.parse(savedVenues));
      if (savedFacilities) setFacilities(JSON.parse(savedFacilities));
      if (savedPricing) setPricingRules(JSON.parse(savedPricing));
      if (savedBookings) setBookings(JSON.parse(savedBookings));
      if (savedSubscriptions) setSubscriptions(JSON.parse(savedSubscriptions));
      if (savedSubPayments) setSubscriptionPayments(JSON.parse(savedSubPayments));
      if (savedPerm) setPermanentBookings(JSON.parse(savedPerm));
      if (savedRole) setActiveRole(savedRole as DemoRole);
      if (savedAccounts) setAdminAccounts(JSON.parse(savedAccounts));
      if (savedAdmin) setCurrentAdmin(JSON.parse(savedAdmin));
    } catch {
      // ignore storage errors
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Ensure documentElement always reflects current theme
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(theme);
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.colorScheme = theme;
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('courtly_theme', nextTheme);
      } catch {}
      return nextTheme;
    });
  };

  // Save changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}venues`, JSON.stringify(venues));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}facilities`, JSON.stringify(facilities));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}pricing`, JSON.stringify(pricingRules));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}bookings`, JSON.stringify(bookings));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}subscriptions`, JSON.stringify(subscriptions));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}sub_payments`, JSON.stringify(subscriptionPayments));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}permanent_bookings`, JSON.stringify(permanentBookings));
      localStorage.setItem(`${STORAGE_KEY_PREFIX}role`, activeRole);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}accounts`, JSON.stringify(adminAccounts));
      if (currentAdmin) {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}current_admin`, JSON.stringify(currentAdmin));
      } else {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}current_admin`);
      }
    } catch {
      // ignore
    }
  }, [venues, facilities, pricingRules, bookings, subscriptions, subscriptionPayments, permanentBookings, activeRole, adminAccounts, currentAdmin, isHydrated]);

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

  // Helpers for date, time, and Sri Lankan phone numbers
  const DAYS_OF_WEEK: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getDayOfWeekName = (dateStr: string): DayOfWeek => {
    const d = new Date(dateStr + 'T12:00:00Z');
    return DAYS_OF_WEEK[d.getUTCDay()];
  };

  const toMinutes = (timeStr: string) => {
    const [h = 0, m = 0] = timeStr.split(':').map(Number);
    return h === 0 ? 24 * 60 : h * 60 + m;
  };

  const isValidSriLankanPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^(?:\+94|0094|94|0)?[1-9][0-9]{8}$/.test(cleaned);
  };

  // Slot generator with live booking checks for 30-minute intervals
  const getSlotsForFacilityAndDate = (facilityId: string, date: string): TimeSlot[] => {
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility) return [];

    const venue = venues.find(v => v.id === facility.venueId);
    const venueId = venue ? venue.id : '';

    // Generate 30-minute slots from 06:00 to 23:30 (last slot ends at 00:00 midnight)
    const slotTimes: string[] = [];
    for (let hr = 6; hr <= 23; hr++) {
      const hrStr = hr.toString().padStart(2, '0');
      slotTimes.push(`${hrStr}:00`);
      slotTimes.push(`${hrStr}:30`);
    }

    // Find existing non-cancelled bookings for this facility & date
    const dayBookings = bookings.filter(
      b => b.facilityId === facilityId && b.date === date && b.status !== 'cancelled'
    );

    const dayOfWeekName = getDayOfWeekName(date);

    return slotTimes.map(h => {
      const [hourNum, minNum] = h.split(':').map(Number);
      
      // Calculate end time (+30 minutes)
      let endHour = hourNum;
      let endMin = minNum + 30;
      if (endMin >= 60) {
        endMin = 0;
        endHour += 1;
      }
      const endTimeStr = endHour >= 24 ? '00:00' : `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;

      const formatDisplay = (hr: number, mn: number) => {
        const period = hr >= 12 && hr < 24 ? 'PM' : 'AM';
        const displayHr = hr === 0 || hr === 24 ? 12 : hr > 12 ? hr - 12 : hr;
        const mnStr = mn === 0 ? ':00' : `:${mn.toString().padStart(2, '0')}`;
        return `${displayHr}${mnStr} ${period}`;
      };

      const displayTime = formatDisplay(hourNum, minNum);

      // Check if this 30-minute slot overlaps an ordinary booking
      const slotStartMin = hourNum * 60 + minNum;
      const slotEndMin = slotStartMin + 30;

      const isDirectlyBooked = dayBookings.some(b => {
        const bStartMin = toMinutes(b.startTime);
        const bEndMin = toMinutes(b.endTime);
        return Math.max(slotStartMin, bStartMin) < Math.min(slotEndMin, bEndMin);
      });

      // Check if this slot is reserved by an active permanent booking
      // (Unless that specific date occurrence was released by the venue admin!)
      const isPermanentlyReserved = permanentBookings.some(p => {
        if (p.facilityId !== facilityId) return false;
        if (p.status !== 'active') return false;
        if (p.dayOfWeek !== dayOfWeekName) return false;
        if (date < p.effectiveStartDate) return false;
        if (p.effectiveEndDate && date > p.effectiveEndDate) return false;

        // If admin released this specific occurrence, slot is available!
        const isReleased = p.releasedOccurrences.some(r => r.date === date);
        if (isReleased) return false;

        const pStartMin = toMinutes(p.startTime);
        const pEndMin = toMinutes(p.endTime);
        return Math.max(slotStartMin, pStartMin) < Math.min(slotEndMin, pEndMin);
      });

      const isBooked = isDirectlyBooked || isPermanentlyReserved;

      // Price per 30-minute session is half of the calculated hourly rate
      const hourlyPrice = calculatePriceForSlot(venueId, facilityId, date, h);
      const sessionPrice = Math.round(hourlyPrice / 2);

      return {
        time: h,
        displayTime,
        endTime: endTimeStr,
        status: isBooked ? 'booked' : 'available',
        price: sessionPrice,
      };
    });
  };

  // Auth & Multi-tenant admin operations
  const loginAdmin = (usernameOrIndoor: string, password: string) => {
    const trimmedUser = usernameOrIndoor.trim().toLowerCase();
    const trimmedPass = password.trim();
    
    const account = adminAccounts.find(a => 
      (a.username.toLowerCase() === trimmedUser || a.indoorName.toLowerCase() === trimmedUser) &&
      a.password === trimmedPass
    );

    if (!account) {
      return { success: false, error: 'Invalid indoor name / username or password' };
    }

    if (account.status === 'suspended') {
      return { success: false, error: 'This indoor account is currently deactivated. Contact Super Admin.' };
    }

    setCurrentAdmin(account);
    setActiveRole(account.role);
    return { success: true, account };
  };

  const logoutAdmin = () => {
    setCurrentAdmin(null);
    setActiveRole('customer');
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}current_admin`);
    } catch {}
  };

  const createAdminAccount = (data: Omit<AdminAccount, 'id' | 'createdAt'>): AdminAccount => {
    const newAccount: AdminAccount = {
      ...data,
      id: `admin-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAdminAccounts(prev => [...prev, newAccount]);
    return newAccount;
  };

  const deleteAdminAccount = (id: string) => {
    setAdminAccounts(prev => prev.filter(a => a.id !== id));
  };

  const updateAdminAccount = (account: AdminAccount) => {
    setAdminAccounts(prev => prev.map(a => a.id === account.id ? account : a));
    if (currentAdmin?.id === account.id) {
      setCurrentAdmin(account);
    }
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

    // Automatically create standard monthly subscription for new partner venue
    const newSub: VenueSubscription = {
      id: `sub-${newVenue.id}`,
      venueId: newVenue.id,
      planName: 'Standard Venue Monthly',
      monthlyPrice: 10000,
      status: 'active',
      currentPeriodStart: new Date().toISOString().split('T')[0],
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      nextBillingDate: new Date(Date.now() + 31 * 86400000).toISOString().split('T')[0],
      gracePeriodUntil: new Date(Date.now() + 37 * 86400000).toISOString().split('T')[0],
    };
    setSubscriptions(prev => [...prev, newSub]);
  };

  const toggleVenueActive = (id: string) => {
    setVenues(prev =>
      prev.map(v => (v.id === id ? { ...v, isActive: !v.isActive } : v))
    );
  };

  // Subscription operations (Fixed LKR 10,000/month model)
  const recordSubscriptionPayment = (
    data: Omit<SubscriptionPayment, 'id' | 'paymentRef'>
  ): SubscriptionPayment => {
    const newPayment: SubscriptionPayment = {
      ...data,
      id: `subpay-${Date.now()}`,
      paymentRef: `SUB-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setSubscriptionPayments(prev => [newPayment, ...prev]);

    // Extend subscription current period and set status to active
    setSubscriptions(prev =>
      prev.map(sub => {
        if (sub.id === data.subscriptionId || sub.venueId === data.venueId) {
          return {
            ...sub,
            status: 'active',
            currentPeriodStart: data.billingPeriodStart || sub.currentPeriodStart,
            currentPeriodEnd: data.billingPeriodEnd || sub.currentPeriodEnd,
            nextBillingDate: data.billingPeriodEnd
              ? new Date(new Date(data.billingPeriodEnd).getTime() + 86400000).toISOString().split('T')[0]
              : sub.nextBillingDate,
          };
        }
        return sub;
      })
    );

    return newPayment;
  };

  const updateSubscriptionStatus = (
    subscriptionId: string,
    status: VenueSubscription['status']
  ) => {
    setSubscriptions(prev =>
      prev.map(sub => (sub.id === subscriptionId ? { ...sub, status } : sub))
    );
  };

  const updateMonthlyPrice = (subscriptionId: string, price: number) => {
    setSubscriptions(prev =>
      prev.map(sub => (sub.id === subscriptionId ? { ...sub, monthlyPrice: price } : sub))
    );
  };

  // ================= PERMANENT BOOKINGS ENGINE =================
  const checkPermanentBookingOverlap = (
    candidate: {
      id?: string;
      facilityId: string;
      dayOfWeek: DayOfWeek;
      startTime: string;
      endTime: string;
      effectiveStartDate: string;
      effectiveEndDate?: string;
    },
    existingList: PermanentBooking[]
  ): string | null => {
    const candStartMin = toMinutes(candidate.startTime);
    const candEndMin = toMinutes(candidate.endTime);
    const candStartDate = candidate.effectiveStartDate;
    const candEndDate = candidate.effectiveEndDate || '9999-12-31';

    for (const p of existingList) {
      if (p.id === candidate.id) continue;
      if (p.status !== 'active') continue;
      if (p.facilityId !== candidate.facilityId) continue;
      if (p.dayOfWeek !== candidate.dayOfWeek) continue;

      // Check date range overlap
      const pEndDate = p.effectiveEndDate || '9999-12-31';
      const datesOverlap = candStartDate <= pEndDate && candEndDate >= p.effectiveStartDate;
      if (!datesOverlap) continue;

      // Check time range overlap
      const pStartMin = toMinutes(p.startTime);
      const pEndMin = toMinutes(p.endTime);
      const timesOverlap = Math.max(candStartMin, pStartMin) < Math.min(candEndMin, pEndMin);

      if (timesOverlap) {
        return `Overlap detected: ${p.facilityName} is already permanently reserved on ${p.dayOfWeek}s from ${p.startTime} to ${p.endTime} by ${p.customerName} (${p.bookingRef}).`;
      }
    }

    return null;
  };

  const addPermanentBooking = (
    data: Omit<PermanentBooking, 'id' | 'bookingRef' | 'createdAt' | 'releasedOccurrences'>
  ): { success: boolean; booking?: PermanentBooking; error?: string } => {
    if (!data.customerName.trim()) {
      return { success: false, error: 'Customer name is required.' };
    }
    if (!data.customerPhone.trim() || !isValidSriLankanPhone(data.customerPhone)) {
      return { success: false, error: 'Please enter a valid Sri Lankan mobile number (e.g. 077 123 4567 or +94 77 123 4567).' };
    }
    const startMin = toMinutes(data.startTime);
    const endMin = toMinutes(data.endTime);
    if (endMin <= startMin) {
      return { success: false, error: 'End time must be later than start time.' };
    }
    if (data.effectiveEndDate && data.effectiveEndDate < data.effectiveStartDate) {
      return { success: false, error: 'Effective end date cannot be earlier than effective start date.' };
    }

    const overlapError = checkPermanentBookingOverlap(data, permanentBookings);
    if (overlapError) {
      return { success: false, error: overlapError };
    }

    const randomRef = Math.floor(1000 + Math.random() * 9000);
    const newBooking: PermanentBooking = {
      ...data,
      id: `perm-${Date.now()}`,
      bookingRef: `PERM-${randomRef}`,
      createdAt: new Date().toISOString(),
      releasedOccurrences: [],
    };

    setPermanentBookings(prev => [newBooking, ...prev]);
    return { success: true, booking: newBooking };
  };

  const updatePermanentBooking = (
    booking: PermanentBooking
  ): { success: boolean; error?: string } => {
    if (!booking.customerName.trim()) {
      return { success: false, error: 'Customer name is required.' };
    }
    if (!booking.customerPhone.trim() || !isValidSriLankanPhone(booking.customerPhone)) {
      return { success: false, error: 'Please enter a valid Sri Lankan mobile number (e.g. 077 123 4567).' };
    }
    const startMin = toMinutes(booking.startTime);
    const endMin = toMinutes(booking.endTime);
    if (endMin <= startMin) {
      return { success: false, error: 'End time must be later than start time.' };
    }
    if (booking.effectiveEndDate && booking.effectiveEndDate < booking.effectiveStartDate) {
      return { success: false, error: 'Effective end date cannot be earlier than effective start date.' };
    }

    const overlapError = checkPermanentBookingOverlap(booking, permanentBookings);
    if (overlapError) {
      return { success: false, error: overlapError };
    }

    setPermanentBookings(prev =>
      prev.map(p => (p.id === booking.id ? { ...booking, updatedAt: new Date().toISOString() } : p))
    );
    return { success: true };
  };

  const cancelPermanentBooking = (id: string, reason?: string) => {
    setPermanentBookings(prev =>
      prev.map(p => (p.id === id ? { 
        ...p, 
        status: 'cancelled', 
        notes: reason ? `${p.notes ? p.notes + ' • ' : ''}Cancelled: ${reason}` : p.notes,
        updatedAt: new Date().toISOString() 
      } : p))
    );
  };

  const releaseOccurrence = (
    permanentBookingId: string, 
    date: string, 
    reason?: string
  ): { success: boolean; error?: string } => {
    const perm = permanentBookings.find(p => p.id === permanentBookingId);
    if (!perm) return { success: false, error: 'Permanent booking not found.' };

    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      return { success: false, error: 'Cannot release a past occurrence.' };
    }

    if (perm.releasedOccurrences.some(r => r.date === date)) {
      return { success: false, error: 'This weekly occurrence has already been released.' };
    }

    const newRelease: ReleasedOccurrence = {
      id: `rel-${Date.now()}`,
      permanentBookingId,
      date,
      releasedAt: new Date().toISOString(),
      releasedBy: currentAdmin?.ownerName || currentAdmin?.username || 'Venue Administrator',
      reason: reason?.trim() || undefined,
    };

    setPermanentBookings(prev =>
      prev.map(p => (p.id === permanentBookingId ? {
        ...p,
        releasedOccurrences: [...p.releasedOccurrences, newRelease],
        updatedAt: new Date().toISOString()
      } : p))
    );

    return { success: true };
  };

  const unreleaseOccurrence = (
    permanentBookingId: string, 
    date: string
  ): { success: boolean; error?: string } => {
    const perm = permanentBookings.find(p => p.id === permanentBookingId);
    if (!perm) return { success: false, error: 'Permanent booking not found.' };

    // Check if another customer has already booked this released slot
    const pStartMin = toMinutes(perm.startTime);
    const pEndMin = toMinutes(perm.endTime);
    const hasReplacementBooking = bookings.some(b => {
      if (b.facilityId !== perm.facilityId) return false;
      if (b.date !== date) return false;
      if (b.status === 'cancelled') return false;
      const bStartMin = toMinutes(b.startTime);
      const bEndMin = toMinutes(b.endTime);
      return Math.max(pStartMin, bStartMin) < Math.min(pEndMin, bEndMin);
    });

    if (hasReplacementBooking) {
      return { 
        success: false, 
        error: 'Cannot reclaim this slot: Another customer has already booked this released date and time.' 
      };
    }

    setPermanentBookings(prev =>
      prev.map(p => (p.id === permanentBookingId ? {
        ...p,
        releasedOccurrences: p.releasedOccurrences.filter(r => r.date !== date),
        updatedAt: new Date().toISOString()
      } : p))
    );

    return { success: true };
  };

  const getOccurrencesForPermanentBooking = (
    permanentBookingId: string,
    weeksAhead: number = 8
  ): OccurrenceView[] => {
    const perm = permanentBookings.find(p => p.id === permanentBookingId);
    if (!perm) return [];

    const targetDayIdx = DAYS_OF_WEEK.indexOf(perm.dayOfWeek);
    if (targetDayIdx === -1) return [];

    const todayStr = new Date().toISOString().split('T')[0];
    const occurrences: OccurrenceView[] = [];
    
    // Look 2 weeks back to show recent history, and up to weeksAhead weeks forward
    const cur = new Date();
    cur.setHours(12, 0, 0, 0);
    cur.setDate(cur.getDate() - 14);

    const endDateLimit = perm.effectiveEndDate 
      ? new Date(perm.effectiveEndDate + 'T23:59:59Z') 
      : new Date(Date.now() + (weeksAhead + 3) * 7 * 86400000);

    const pStartMin = toMinutes(perm.startTime);
    const pEndMin = toMinutes(perm.endTime);

    while (cur <= endDateLimit && occurrences.length < weeksAhead + 4) {
      if (cur.getDay() === targetDayIdx) {
        const occurrenceDateStr = cur.toISOString().split('T')[0];

        if (occurrenceDateStr >= perm.effectiveStartDate && (!perm.effectiveEndDate || occurrenceDateStr <= perm.effectiveEndDate)) {
          const isPast = occurrenceDateStr < todayStr;
          const releasedInfo = perm.releasedOccurrences.find(r => r.date === occurrenceDateStr);

          // Find replacement booking if released
          let replacementBooking: DemoBooking | undefined;
          if (releasedInfo) {
            replacementBooking = bookings.find(b => {
              if (b.facilityId !== perm.facilityId) return false;
              if (b.date !== occurrenceDateStr) return false;
              if (b.status === 'cancelled') return false;
              const bStartMin = toMinutes(b.startTime);
              const bEndMin = toMinutes(b.endTime);
              return Math.max(pStartMin, bStartMin) < Math.min(pEndMin, bEndMin);
            });
          }

          let status: OccurrenceStatus = 'reserved';
          if (perm.status === 'cancelled') {
            status = 'cancelled';
          } else if (isPast) {
            status = 'completed';
          } else if (releasedInfo) {
            status = replacementBooking ? 'booked_by_other' : 'released';
          } else {
            status = 'reserved';
          }

          const displayDate = cur.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          occurrences.push({
            date: occurrenceDateStr,
            displayDate,
            dayOfWeek: perm.dayOfWeek,
            startTime: perm.startTime,
            endTime: perm.endTime,
            status,
            isPast,
            releasedInfo,
            replacementBooking,
          });
        }
      }
      cur.setDate(cur.getDate() + 1);
    }

    return occurrences;
  };

  const openBookingModal = (venueId?: string, facilityId?: string, isAdmin: boolean = false) => {
    setBookingModalVenueId(venueId || 'venue-axion');
    setBookingModalFacilityId(facilityId || null);
    setBookingModalIsAdmin(Boolean(isAdmin));
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setBookingModalIsAdmin(false);
  };

  const resetToDefaults = () => {
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}venues`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}facilities`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}pricing`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}bookings`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}subscriptions`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}sub_payments`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}permanent_bookings`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}comm_rate`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}settled`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}role`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}accounts`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}current_admin`);
    } catch {
      // ignore
    }
    setVenues(INITIAL_VENUES);
    setFacilities(INITIAL_FACILITIES);
    setPricingRules(INITIAL_PRICING_RULES);
    setBookings(INITIAL_BOOKINGS);
    setSubscriptions(INITIAL_VENUE_SUBSCRIPTIONS);
    setSubscriptionPayments(INITIAL_SUBSCRIPTION_PAYMENTS);
    setPermanentBookings(INITIAL_PERMANENT_BOOKINGS);
    setAdminAccounts(INITIAL_ADMIN_ACCOUNTS);
    setCurrentAdmin(null);
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
        subscriptions,
        subscriptionPayments,
        adminAccounts,
        currentAdmin,
        permanentBookings,
        theme,
        toggleTheme,
        loginAdmin,
        logoutAdmin,
        createAdminAccount,
        deleteAdminAccount,
        updateAdminAccount,
        setActiveRole,
        addBooking,
        updateBookingStatus,
        updatePaymentStatus,
        addPermanentBooking,
        updatePermanentBooking,
        cancelPermanentBooking,
        releaseOccurrence,
        unreleaseOccurrence,
        getOccurrencesForPermanentBooking,
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
        recordSubscriptionPayment,
        updateSubscriptionStatus,
        updateMonthlyPrice,
        isBookingModalOpen,
        bookingModalVenueId,
        bookingModalFacilityId,
        bookingModalIsAdmin,
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
