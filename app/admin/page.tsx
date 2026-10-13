'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';

export default function AdminIndexPage() {
  const router = useRouter();
  const { currentAdmin } = useDemo();

  useEffect(() => {
    if (currentAdmin) {
      if (currentAdmin.role === 'super_admin') {
        router.replace('/admin/super');
      } else {
        router.replace('/admin/venue');
      }
    } else {
      router.replace('/admin/login');
    }
  }, [currentAdmin, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
      Directing to admin portal...
    </div>
  );
}
