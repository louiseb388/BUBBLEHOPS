'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase } from './supabase';

type AuthState = {
  configured: boolean;
  session: Session | null;
  loading: boolean;
  initials: string;
  /** Requests a one-time code by email (no password, no link to click — see verifyCode). */
  signInWithEmail: (email: string) => Promise<{ ok: boolean; message: string }>;
  /** Completes sign-in with the code from that email, Vercel-style. */
  verifyCode: (email: string, code: string) => Promise<{ ok: boolean; message: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => getSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState<string | null>(null);

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

  useEffect(() => {
    if (!supabase || !session) {
      setProfileName(null);
      return;
    }
    supabase
      .from('profiles')
      .select('name')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data }) => setProfileName(data?.name ?? null));
  }, [supabase, session]);

  const initials = useMemo(() => {
    // First + last initial from the saved profile name, once there's a first AND last
    // name on record — otherwise fall back to the first two letters of the email.
    const parts = profileName?.trim().split(/\s+/) ?? [];
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    const email = session?.user?.email;
    if (!email) return '';
    return email.slice(0, 2).toUpperCase();
  }, [session, profileName]);

  async function signInWithEmail(email: string) {
    if (!supabase) {
      return { ok: false, message: 'Sign-in needs NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY set in your environment.' };
    }
    // No emailRedirectTo: this app has the shopper type the code from the email rather than
    // click a link, so there's no redirect destination to configure.
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: 'Check your email for an 8-digit code.' };
  }

  async function verifyCode(email: string, code: string) {
    if (!supabase) {
      return { ok: false, message: 'Sign-in needs NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY set in your environment.' };
    }
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: 'Signed in.' };
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ configured: !!supabase, session, loading, initials, signInWithEmail, verifyCode, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
