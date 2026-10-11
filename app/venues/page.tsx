import React, { Suspense } from 'react';
import VenuesListClient from '@/components/VenuesListClient';

export const metadata = {
  title: 'Explore Indoor Sports Venues in Sri Lanka | Courtly',
  description: 'Discover and book indoor futsal turfs, badminton courts, cricket nets, and snooker clubs across Kandy, Colombo, and Gampaha.',
};

export default function VenuesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Loading sports venues...
      </div>
    }>
      <VenuesListClient />
    </Suspense>
  );
}
