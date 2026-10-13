import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { DemoProvider } from '@/context/DemoContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import React, { Suspense } from 'react';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('courtly_theme')||'dark';document.documentElement.classList.remove('dark','light');document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t;}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans transition-colors duration-200">
        <DemoProvider>
          <Suspense fallback={<div className="h-16 sm:h-20 bg-slate-900" />}>
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
