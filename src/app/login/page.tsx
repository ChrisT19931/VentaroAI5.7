'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    // TODO: kick off your auth flow here if needed
    const redirectTo = params?.get('redirect') || '/';
    router.replace(redirectTo);
  }, [params, router]);

  return null;
}