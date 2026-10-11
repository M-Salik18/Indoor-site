import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { DemoProvider } from '@/context/DemoContext';
import DemoRoleBar from '@/components/DemoRoleBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Courtly Sri Lanka | Indoor Sports Booking Marketplace',
  description: 'Discover and book indoor futsal turfs, badminton courts, cricket nets, and snooker lounges across Sri Lanka. Instant reservations, pay at venue.',
};

import React, { Suspense } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
        <DemoProvider>
          <Suspense fallback={<div className="h-9 bg-slate-950" />}>
            <DemoRoleBar />
          </Suspense>
          <Suspense fallback={<div className="h-16 bg-slate-900" />}>
            <Navbar />
          </Suspense>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
          <BookingModal />
        </DemoProvider>
      </body>
    </html>
  );
}
