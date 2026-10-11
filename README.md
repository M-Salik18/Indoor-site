# Courtly — Indoor Sports Booking Marketplace (Sri Lanka)
### High-Fidelity UI-Only Frontend Prototype

> **PROTOTYPE NOTICE:** This project is a frontend-only demonstration prototype built to pitch to indoor sports centre owners across Sri Lanka and secure initial pilot venues (featuring **AXION – Ambetenne**). It contains realistic Sri Lanka sample data, interactive client-side state, a flexible hourly pricing calculator, simulated OTP verification, and pay-at-venue workflows. **No live backend, database, SMS gateway, or real payments are connected in this phase.**

---

## 1. Quick Start

### Prerequisites
- Node.js v18+ or v20+ (developed with Node.js v24 / npm 11)

### Run Locally
```bash
# In the project workspace (f:/Indoor-site):
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 2. Interactive Demo Roles & Navigation

A persistent **Demo Role Bar** at the top of every screen allows immediate, 1-click switching between the three product viewpoints without modifying code:

| Role View | Route | Description |
|---|---|---|
| **Customer Website** | [`/`](http://localhost:3000/) | Public discovery marketplace for players to find arenas, check facilities, and book slots. |
| **Venue Administrator** | [`/admin/venue`](http://localhost:3000/admin/venue) | Dedicated dashboard for **AXION – Ambetenne** (and switchable venues) to manage schedule, inspect bookings with customer mobile numbers, configure facilities, and edit custom hourly pricing rules. |
| **Platform Super-Admin** | [`/admin/super`](http://localhost:3000/admin/super) | Platform-owner control center to monitor partner venues, adjust marketplace commission rates (e.g., 10%), view revenue analytics, and record simulated venue commission settlements. |

*Additional Quick Actions in Demo Bar:*
- **Quick Book Turf**: Launches the 7-step booking wizard from any screen.
- **Reset Sample Data**: Reverts demo state (bookings, facilities, custom prices) back to original defaults.

---

## 3. Implemented Screens & Features

### 1. Public Customer Experience
- **Homepage (`/`)**:
  - **Header & Brand**: "Courtly" logo with Sri Lanka indoor sports badge, navigation links, and glowing "Book a Turf" CTA with mobile slide-down menu.
  - **Hero Section**: Strong headline *"Your Next Game Starts Here."*, supporting copy, and compact search panel (District filter, Sport filter, Venue text search).
  - **Popular Sports Categories**: Visual cards with badges for Football, Futsal, Badminton, Basketball, Snooker, 8-Ball Pool, Cricket Nets, and Table Tennis.
  - **Featured Venues Showcase**:
    - **AXION – Ambetenne** (Flagship pilot venue in Central Province)
    - **Colombo Futsal & Cricket Arena** (Rajagiriya, Western Province)
    - **Metro Badminton & Smash Club** (Kelaniya, Gampaha)
    - **Apex Sports Complex** (Kurunegala, Wayamba)
  - **How It Works**: 3-step illustrated journey (Find Venue &rarr; Choose Facility & Time &rarr; Confirm & Pay at Venue).
  - **Footer**: Sri Lanka sports community statement, public helpline, cancellation policy, terms, and direct links to demo dashboards.

- **Explore & Discovery Page (`/venues`)**:
  - Live filtering by District (Kandy, Colombo, Gampaha, Kurunegala).
  - Sport category filter dropdown.
  - Venue name / city text search.
  - Hourly rate price range slider.
  - Sort by Highest Rated, Price (Low to High), Price (High to Low), Name.
  - Active filter chips with one-click reset and polished empty state.

- **Venue Detail Page (`/venues/[id]` e.g. `/venues/axion-ambetenne`)**:
  - High-res photo gallery with thumbnail switcher.
  - Full address, public hotline, operating hours, and amenities list.
  - **Data-driven facilities list**:
    - *Turf Pitch 1* (Football & Futsal)
    - *Turf Pitch 2* (Football)
    - *Badminton Court 1* (Badminton)
    - *Snooker Table 1* (Snooker)
  - **Hourly Pricing Schedule Table**: Transparent breakdown of weekday vs weekend and day vs night pricing rules.
  - Direct "Book a Turf or Court" CTA opening the wizard pre-scoped to that venue.

---

### 2. Customer 7-Step Booking Flow (`/book` or Modal Wizard)
1. **Step 1 — Venue Selection**: Searchable list of Sri Lankan partner venues with starting prices and district badges.
2. **Step 2 — Facility Selection**: Dynamically loads only facilities offered by the selected venue with sport tags and slot duration.
3. **Step 3 — Interactive Date & Time Picker**:
   - 7-day visual calendar selector.
   - Live color-coded slot grid: **Available** (emerald), **Booked** (disabled/struck-through), **Selected** (vibrant glow).
   - Dynamic price calculation per slot according to the venue's pricing schedule (e.g., LKR 2,000 off-peak vs LKR 3,000 peak night).
4. **Step 4 — Customer Information**:
   - Simple entry for Full Name and Sri Lankan Mobile Number (`077 XXX XXXX`).
   - **Zero registration friction**: No customer account, password, or login required.
5. **Step 5 — Simulated SMS OTP**:
   - Clearly labelled demo sandbox notice.
   - Demo code `8492` provided with 1-click "Auto-fill Demo Code" action.
6. **Step 6 — Booking Summary**:
   - Full breakdown: Venue, facility, sport, date, time slot, duration, hourly rate, total price in LKR, customer name, and contact.
   - Prominent reassurance: *"Payment is made at the venue after playing. Zero online prepayment required."*
7. **Step 7 — Booking Confirmation Pass**:
   - Generated booking reference (e.g. `CRTL-84920`).
   - Venue phone number, directions note, and total payable at counter.
   - Instant synchronization to the AXION Venue Admin and Super-Admin data stores.
   - Button to directly open the Venue Admin to inspect the reservation.

---

### 3. Venue Administrator Dashboard (`/admin/venue`)
*Focused on AXION – Ambetenne with venue switcher option.*
- **Overview Tab**:
  - Live metric cards: Today's Bookings, Upcoming, Completed, Cancelled, Gross Booking Value, and Estimated Platform Commission (10%).
  - Live Pitch Occupancy timeline across all 4 facilities for today.
- **Manage Bookings Tab**:
  - Comprehensive table with filtering by Facility, Status, and Date.
  - **Customer Privacy Protection**: Shows customer name and mobile number only within this venue admin view.
  - Booking Detail Drawer:
    - Mark booking as **Completed**.
    - Mark customer as **No-Show**.
    - **Cancel** booking (immediately frees up the time slot on the public site).
    - **Record Payment Collected at Venue** (e.g. "LKR 3,000 Collected").
- **Flexible Hourly Pricing Engine (Core Differentiator)**:
  - Add, edit, or delete rules per facility.
  - Select Day Schedule (Weekdays / Weekends / All Days).
  - Time window selector (e.g. 07:00 – 16:00 vs 16:00 – 00:00).
  - Price per hour in LKR.
  - Automatic overlap validation preventing conflicting rules.
  - Real-time recalculation across the public booking flow.
- **Facilities Tab**:
  - Add new turf pitches, badminton courts, or snooker tables.
  - Toggle active/deactivated status.
  - Configure supported sports, slot durations (60m / 90m / 120m), and transition buffers.
- **Venue Settings Tab**:
  - Edit venue business name, district, address, phone hotline, operating hours, and description with instant persistence.

---

### 4. Platform Super-Admin Dashboard (`/admin/super`)
- **Marketplace Overview**:
  - Platform-wide statistics: Total venues, active venues, total bookings, gross booking value, platform commission, and outstanding commissions.
- **Interactive Commission Rate Setting**:
  - Configurable platform commission slider (5% to 25%, defaulting to 10%).
  - Adjusting the slider instantly recalculates platform revenue and venue settlement balances.
- **Partner Venues Management**:
  - Directory of venues with district, facility counts, sports, active toggles, and total bookings.
  - "Register New Venue" modal form to onboard new facilities.
- **Commission Ledger**:
  - Per-booking commission records showing booking reference, venue, booking amount, commission rate %, commission amount, and status.
  - Filter by venue and settlement status (Outstanding vs Settled).
  - Simulated "Record Settlement" action to mark venue payouts with timestamp.

---

## 4. Technical Architecture

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript.
- **Styling**: Tailwind CSS v4 with bespoke dark navy & slate palette and electric emerald sports accents.
- **Icons**: Lucide React.
- **State Management**: `DemoContext.tsx` providing a unified client-side reactive store synchronized with `localStorage` for session persistence across page refreshes.
- **Dynamic Pricing Engine**: Algorithmic lookup matching facility, weekday/weekend day type, and hour window to compute live hourly rates.

---

## 5. Known Limitations (Prototype Scope)

1. **No Live Backend/DB**: All bookings, facility edits, and pricing rules are stored in browser memory and `localStorage`.
2. **No Real SMS Delivery**: Phone verification is an interactive simulation using demo code `8492`.
3. **No Online Payment Processing**: Aligns with the business model where customers settle payments at the venue after playing.
4. **Demonstrated Privacy Controls**: Role-based access (customer vs venue admin) is controlled via the client-side role switcher rather than cryptographic JWT tokens.

---

## 6. Supabase Backend Integration Roadmap

When transitioning from this prototype to production, the frontend architecture is designed for a seamless connection to Supabase:

### 1. Database Schema (PostgreSQL)
```sql
-- Venues table
create table venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  district text not null,
  city text not null,
  address text not null,
  phone text not null,
  email text,
  opening_hours text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Facilities table
create table facilities (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid references venues(id) on delete cascade,
  name text not null,
  sports text[] not null,
  slot_duration_minutes int default 60,
  buffer_minutes int default 0,
  surface_type text,
  is_active boolean default true
);

-- Pricing rules table
create table pricing_rules (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid references venues(id) on delete cascade,
  facility_id uuid references facilities(id) on delete cascade,
  day_type text not null check (day_type in ('weekday', 'weekend', 'all')),
  start_time time not null,
  end_time time not null,
  price_per_hour numeric not null
);

-- Bookings table
create table bookings (
  id uuid primary key default gen_random_uuid(),
  booking_ref text unique not null,
  venue_id uuid references venues(id),
  facility_id uuid references facilities(id),
  sport text not null,
  booking_date date not null,
  start_time time not null,
  end_time time not null,
  total_price numeric not null,
  customer_name text not null,
  customer_mobile text not null,
  status text not null default 'confirmed',
  payment_status text not null default 'pending_at_venue',
  created_at timestamptz default now()
);
```

### 2. Row Level Security (RLS)
- **Public Customers**: `SELECT` permissions on active venues, facilities, pricing rules, and time slot availability (without exposing other customers' names or mobile numbers).
- **Venue Owners**: Authenticated via Supabase Auth with custom claims (`venue_id`), allowing full `SELECT` and `UPDATE` on their venue's bookings, pricing rules, and facility specs.
- **Platform Super-Admin**: Full access across all venues and commission calculations.

### 3. Replacing `DemoContext`
Replace the local React state handlers in `DemoContext.tsx` with `@supabase/supabase-js` query hooks (e.g. `supabase.from('bookings').insert(...)` and Supabase Realtime subscriptions for live slot updates).
