import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  profileLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  updateProfile: (fullName: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchProfile = useCallback(async (uid: string) => {
    setProfileLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('id', uid)
      .maybeSingle();

    if (!error && data) {
      setProfile(data as Profile);
    } else if (error) {
      // Profile row doesn't exist yet — create it from auth user metadata
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const fullName =
          (userData.user.user_metadata?.full_name as string) ?? '';
        await supabase
          .from('profiles')
          .insert({ id: uid, email: userData.user.email ?? '', full_name: fullName });
        const { data: newProfile } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .eq('id', uid)
          .maybeSingle();
        if (newProfile) setProfile(newProfile as Profile);
      }
    }
    setProfileLoading(false);
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        fetchProfile(data.session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return { error: null };
    },
    []
  );

  const signUp = useCallback(
    async (email: string, password: string, fullName: string): Promise<{ error: string | null }> => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) return { error: error.message };

      // Create profile row if signup succeeded
      if (data.user) {
        await supabase
          .from('profiles')
          .insert({ id: data.user.id, email, full_name: fullName });
      }

      return { error: null };
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const resetPassword = useCallback(
    async (email: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) return { error: error.message };
      return { error: null };
    },
    []
  );

  const updatePassword = useCallback(
    async (password: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) return { error: error.message };
      return { error: null };
    },
    []
  );

  const updateProfile = useCallback(
    async (fullName: string): Promise<{ error: string | null }> => {
      if (!user) return { error: 'Tidak ada sesi aktif' };
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);
      if (error) return { error: error.message };
      setProfile((prev) => (prev ? { ...prev, full_name: fullName } : prev));
      return { error: null };
    },
    [user]
  );

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const value: AuthContextValue = {
    session,
    user,
    profile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
