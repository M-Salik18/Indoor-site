import React from 'react';
import Hero from '@/components/Hero';
import SportCategories from '@/components/SportCategories';
import FeaturedVenues from '@/components/FeaturedVenues';
import HowItWorks from '@/components/HowItWorks';

export const metadata = {
  title: 'Courtly Sri Lanka | Discover & Book Indoor Sports Venues',
  description: 'Book indoor turf pitches, badminton courts, and snooker tables across Sri Lanka. Instant reservations, pay at venue, no account needed.',
};

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col bg-slate-950">
      <Hero />
      <SportCategories />
      <FeaturedVenues />
      <HowItWorks />
    </main>
  );
}
