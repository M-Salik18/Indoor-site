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

export interface CommissionRecord {
  id: string;
  bookingId: string;
  venueId: string;
  venueName: string;
  bookingRef: string;
  bookingAmount: number;
  commissionRate: number; // percentage, e.g. 10
  commissionAmount: number;
  bookingStatus: BookingStatus;
  settlementStatus: 'outstanding' | 'settled';
  settledAt?: string;
  date: string;
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
