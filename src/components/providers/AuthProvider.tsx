'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export interface AuthAccount {
  name: string;
  email: string;
  password: string;
  points: number;
  joined: string;
}

interface AuthContextType {
  user: AuthAccount | null;
  isLoading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updatePoints: (delta: number) => void;
}

const ACCOUNTS_KEY = 'zz_accounts';
const SESSION_KEY = 'zz_session';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => ({ success: false }),
  signup: () => ({ success: false }),
  logout: () => {},
  updatePoints: () => {},
});

function loadAccounts(): AuthAccount[] {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? '[]'); } catch { return []; }
}
function saveAccounts(accounts: AuthAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem(SESSION_KEY);
    if (email) {
      const acc = loadAccounts().find(a => a.email === email);
      if (acc) setUser(acc);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const trimmed = email.trim().toLowerCase();
    const acc = loadAccounts().find(a => a.email === trimmed);
    if (!acc || acc.password !== password) return { success: false, error: 'Incorrect email or password.' };
    localStorage.setItem(SESSION_KEY, acc.email);
    setUser(acc);
    return { success: true };
  }, []);

  const signup = useCallback((name: string, email: string, password: string) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes('@') || password.length < 4) return { success: false, error: 'Enter a valid email and a password of at least 4 characters.' };
    if (!name.trim()) return { success: false, error: 'Please enter your name.' };
    const accounts = loadAccounts();
    if (accounts.some(a => a.email === trimmed)) return { success: false, error: 'An account with this email already exists.' };
    const acc: AuthAccount = { name: name.trim(), email: trimmed, password, points: 50, joined: new Date().toISOString() };
    saveAccounts([...accounts, acc]);
    localStorage.setItem(SESSION_KEY, acc.email);
    setUser(acc);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const updatePoints = useCallback((delta: number) => {
    if (!user) return;
    const updated = { ...user, points: Math.max(0, user.points + delta) };
    setUser(updated);
    const accounts = loadAccounts().map(a => a.email === updated.email ? updated : a);
    saveAccounts(accounts);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updatePoints }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
