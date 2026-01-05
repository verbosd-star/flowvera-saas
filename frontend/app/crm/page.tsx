'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function CrmPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to contacts page by default
    router.push('/crm/contacts');
  }, [router]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    </ProtectedRoute>
  );
}
