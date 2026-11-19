'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { initialUsers } from '@/lib/mock-data';
import { UserRecord } from '@/lib/types';

interface AuthContextType {
  user: UserRecord | null;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
  isLoading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage for existing logged-in user
    try {
      const stored = localStorage.getItem('afri_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // By default, set admin as logged in if not set, or leave null
        setUser(initialUsers[0]);
        localStorage.setItem('afri_user', JSON.stringify(initialUsers[0]));
      }
    } catch {
      setUser(initialUsers[0]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (username: string, pass: string): boolean => {
    // Find matching user from mock users or accept admin
    const cleanUser = username.trim().toLowerCase();
    const found = initialUsers.find(
      (u) => u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser
    );

    if (found || cleanUser === 'admin') {
      const targetUser = found || initialUsers[0];
      setUser(targetUser);
      localStorage.setItem('afri_user', JSON.stringify(targetUser));
      router.push('/');
      return true;
    }

    return false;
  };

  const logout = () => {
    const confirmed = window.confirm('Are you sure you want to log out of Afri-Techs ERP?');
    if (confirmed) {
      setUser(null);
      localStorage.removeItem('afri_user');
      router.push('/login');
    }
  };

  // Guard routing
  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== '/login') {
        router.push('/login');
      } else if (user && pathname === '/login') {
        router.push('/');
      }
    }
  }, [user, isLoading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

