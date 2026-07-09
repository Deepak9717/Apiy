'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';

export default function ThemeBody({ children }: { children: React.ReactNode }) {
  const { theme } = useUIStore();

  // Apply/remove 'dark' class on <html> so Tailwind dark: variants work everywhere
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <body className="antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {children}
    </body>
  );
}
