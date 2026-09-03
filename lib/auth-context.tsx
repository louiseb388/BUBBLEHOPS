'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase } from './supabase';

type AuthState = {
  configured: boolean;
  session: Session | null;
  loading: boolean;
  initials: string;
  signInWithEmail: (email: string) => Promise<{ ok: boolean; message: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => getSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const initials = useMemo(() => {
    const email = session?.user?.email;
    if (!email) return '';
    return email.slice(0, 2).toUpperCase();
  }, [session]);

  async function signInWithEmail(email: string) {
    if (!supabase) {
      return { ok: false, message: 'Sign-in needs NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY set in your environment.' };
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/account` : undefined }
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: 'Check your email for a sign-in link.' };
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ configured: !!supabase, session, loading, initials, signInWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
