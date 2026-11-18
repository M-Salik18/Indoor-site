export type SportType = 
  | 'Football' 
  | 'Futsal' 
  | 'Badminton' 
  | 'Basketball' 
  | 'Snooker' 
  | '8-Ball Pool' 
  | 'Cricket Nets' 
  | 'Table Tennis';

export type DistrictType = 
  | 'Kandy'
  | 'Colombo'
  | 'Gampaha'
  | 'Kurunegala'
  | 'Galle'
  | 'Matara'
  | 'Kalutara';

export type BookingStatus = 'confirmed' | 'completed' | 'cancelled' | 'no-show';

export type PaymentCollectionStatus = 'pending_at_venue' | 'collected_at_venue';

export type DayType = 'weekday' | 'weekend' | 'all';

export interface PricingRule {
  id: string;
  venueId: string;
  facilityId: string;
  dayType: DayType;
  startTime: string; // HH:mm format, e.g. "07:00"
  endTime: string;   // HH:mm format, e.g. "16:00" or "00:00"
  pricePerHour: number; // LKR
}

export interface Facility {
  id: string;
  venueId: string;
  name: string;
  sports: SportType[];
  slotDurationMinutes: number; // usually 60
  bufferMinutes: number;       // default 0
  isActive: boolean;
  surfaceType?: string;
  features: string[];
}

export interface Venue {
  id: string;
  name: string;
  slug: string;
  district: DistrictType;
  city: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  heroImage: string;
  galleryImages: string[];
  sportsOffered: SportType[];
  rating: number;
  reviewCount: number;
  openingHours: string;
  openingDays: string;
  amenities: string[];
  startingPricePerHour: number;
  isActive: boolean;
}

export interface DemoBooking {
  id: string;
  bookingRef: string; // e.g. CRTL-84920
  venueId: string;
  venueName: string;
  facilityId: string;
  facilityName: string;
  sport: SportType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  durationHours: number;
  hourlyRate: number;
  totalPrice: number; // LKR
  customerName: string;
  customerMobile: string; // Sri Lankan mobile number
  status: BookingStatus;
  paymentStatus: PaymentCollectionStatus;
  createdAt: string;
  paymentCollectedAt?: string;
  notes?: string;
}

export interface VenueSubscription {
  id: string;
  venueId: string;
  planName: string;
  monthlyPrice: number; // 10000 LKR
  status: 'active' | 'past_due' | 'suspended' | 'trialing';
  currentPeriodStart: string; // YYYY-MM-DD
  currentPeriodEnd: string;   // YYYY-MM-DD
  nextBillingDate: string;    // YYYY-MM-DD
  gracePeriodUntil?: string;  // YYYY-MM-DD
}

export interface SubscriptionPayment {
  id: string;
  subscriptionId: string;
  venueId: string;
  paymentRef: string; // e.g. SUB-PAY-84920
  amount: number;     // 10000 LKR
  billingPeriodStart: string; // YYYY-MM-DD
  billingPeriodEnd: string;   // YYYY-MM-DD
  paymentDate: string;        // YYYY-MM-DD
  paymentMethod: string;      // e.g. 'Bank Transfer', 'Direct Deposit', 'Cash'
  paymentReferenceNumber: string; // Bank slip no / txn id
  verificationStatus: 'verified' | 'pending_verification';
  recordedBy: string;
  notes?: string;
}

export interface TimeSlot {
  time: string; // "07:00"
  displayTime: string; // "7:00 AM"
  endTime: string; // "08:00"
  status: 'available' | 'booked' | 'unavailable' | 'selected';
  price: number;
}

export interface AdminAccount {
  id: string;
  username: string;
  password: string;
  indoorName: string;
  venueId: string;
  role: 'venue_admin' | 'super_admin';
  ownerName?: string;
  phone?: string;
  createdAt: string;
  status: 'active' | 'suspended';
}

export type DemoRole = 'customer' | 'venue_admin' | 'super_admin';

export type DayOfWeek = 
  | 'Sunday' 
  | 'Monday' 
  | 'Tuesday' 
  | 'Wednesday' 
  | 'Thursday' 
  | 'Friday' 
  | 'Saturday';

export type PermanentBookingStatus = 'active' | 'cancelled' | 'completed';

export interface ReleasedOccurrence {
  id: string;
  permanentBookingId: string;
  date: string; // YYYY-MM-DD
  releasedAt: string; // ISO datetime
  releasedBy: string; // admin username or name
  reason?: string;
}

export interface PermanentBooking {
  id: string;
  bookingRef: string; // e.g. PERM-89102
  venueId: string;
  venueName: string;
  facilityId: string;
  facilityName: string;
  sport: SportType;
  customerName: string;
  customerPhone: string; // Sri Lankan mobile e.g. 0771234567
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm e.g. "20:00"
  endTime: string;   // HH:mm e.g. "22:00"
  effectiveStartDate: string; // YYYY-MM-DD
  effectiveEndDate?: string;  // YYYY-MM-DD (optional)
  status: PermanentBookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  releasedOccurrences: ReleasedOccurrence[];
}

export type OccurrenceStatus = 
  | 'reserved' 
  | 'released' 
  | 'booked_by_other' 
  | 'completed' 
  | 'cancelled';

export interface OccurrenceView {
  date: string; // YYYY-MM-DD
  displayDate: string; // e.g. "Sunday, October 18, 2026"
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  status: OccurrenceStatus;
  isPast: boolean;
  releasedInfo?: ReleasedOccurrence;
  replacementBooking?: DemoBooking;
}
