'use client';

import { usePathname } from 'next/navigation';
import { StaticFooter } from './StaticFooter';

export function FooterWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return <StaticFooter />;
}
