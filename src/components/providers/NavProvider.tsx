'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { PageId } from '@/lib/data/zz';

interface NavContextType {
  page: PageId;
  goTo: (id: PageId) => void;
}

const NavContext = createContext<NavContextType>({
  page: 'cover',
  goTo: () => {},
});

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<PageId>('cover');
  const goTo = useCallback((id: PageId) => {
    setPage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return <NavContext.Provider value={{ page, goTo }}>{children}</NavContext.Provider>;
}

export const useNav = () => useContext(NavContext);
