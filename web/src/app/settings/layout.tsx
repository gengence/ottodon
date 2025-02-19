'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/settings') {
      router.replace('/settings/default');
    }
  }, [pathname, router]);

  return (
    <div className="pl-[100px] flex-1">
      {children}
    </div>
  );
} 