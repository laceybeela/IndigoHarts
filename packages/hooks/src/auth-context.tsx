import React, { createContext, useContext, useEffect, useState } from 'react';
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { User } from '@indigo-harts/types';
import { getCurrentUser } from '@indigo-harts/services';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  client: SupabaseClient;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  client,
  children,
}: {
  client: SupabaseClient;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    isLoading: true,
    isAdmin: false,
  });

  useEffect(() => {
    client.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        getCurrentUser(client).then((user) => {
          setState({
            session,
            user,
            isLoading: false,
            isAdmin: user.role === 'admin',
          });
        }).catch(() => {
          setState({ session: null, user: null, isLoading: false, isAdmin: false });
        });
      } else {
        setState({ session: null, user: null, isLoading: false, isAdmin: false });
      }
    });

    const { data: { subscription } } = client.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          try {
            const user = await getCurrentUser(client);
            setState({
              session,
              user,
              isLoading: false,
              isAdmin: user.role === 'admin',
            });
          } catch {
            setState({ session: null, user: null, isLoading: false, isAdmin: false });
          }
        } else {
          setState({ session: null, user: null, isLoading: false, isAdmin: false });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [client]);

  const signIn = async (email: string, password: string) => {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await client.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, client }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
