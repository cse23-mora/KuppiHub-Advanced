'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, onAuthStateChanged, signInWithGoogle, signInWithEmail, signUpWithEmail, logOut, User } from '@/lib/firebase';
import supabase from '@/lib/supabase';

interface UserProfile {
  id: string;
  firebase_uid: string;
  email: string;
  display_name: string | null;
  photo_url: string | null;
  index_number: string | null;
  role: 'student' | 'tutor' | 'admin';
  is_verified_tutor: boolean;
  faculty_path: string | null;
  linkedin_url: string | null;
  bio: string | null;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ user: User | null; error: string | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  logOut: () => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch or create user profile in Supabase
  const fetchOrCreateProfile = async (firebaseUser: User): Promise<UserProfile | null> => {
    try {
      // First try to fetch existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('firebase_uid', firebaseUser.uid)
        .single();

      if (existingProfile) {
        return existingProfile as UserProfile;
      }

      // If not found, create new profile
      if (fetchError && fetchError.code === 'PGRST116') {
        const newProfile = {
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          display_name: firebaseUser.displayName,
          photo_url: firebaseUser.photoURL,
          role: 'student',
          is_verified_tutor: false,
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('users')
          .insert([newProfile])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return null;
        }

        return createdProfile as UserProfile;
      }

      console.error('Error fetching profile:', fetchError);
      return null;
    } catch (error) {
      console.error('Error in fetchOrCreateProfile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profile = await fetchOrCreateProfile(user);
      setUserProfile(profile);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const profile = await fetchOrCreateProfile(firebaseUser);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
