import React, { Suspense } from 'react';
import VenueDetailClient from '@/components/VenueDetailClient';
import { INITIAL_VENUES } from '@/data/sampleData';

interface VenuePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return INITIAL_VENUES.flatMap((v) => [
    { id: v.id },
    { id: v.slug }
  ]);
}

export default async function VenuePage({ params }: VenuePageProps) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Loading venue details...
      </div>
    }>
      <VenueDetailClient slugOrId={resolvedParams.id} />
    </Suspense>
  );
}
