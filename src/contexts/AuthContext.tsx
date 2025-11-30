"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to sync user with Supabase
async function syncUserToSupabase(firebaseUser: User, authProvider: 'google' | 'email'): Promise<boolean> {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        display_name: firebaseUser.displayName,
        photo_url: firebaseUser.photoURL,
        is_verified: firebaseUser.emailVerified,
        auth_provider: authProvider,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to sync user to Supabase:', errorData);
      return false;
    }
    
    console.log('User synced to Supabase successfully');
    return true;
  } catch (error) {
    console.error('Failed to sync user to Supabase:', error);
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      // Sync verified users to Supabase on auth state change
      if (user && user.emailVerified) {
        const provider = user.providerData[0]?.providerId === 'google.com' ? 'google' : 'email';
        await syncUserToSupabase(user, provider);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Google users are always verified, sync to Supabase
      await syncUserToSupabase(result.user, 'google');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        // Sign out the user since email is not verified
        await firebaseSignOut(auth);
        throw { code: 'auth/email-not-verified', message: 'Please verify your email before signing in. Check your inbox for the verification link.' };
      }
      
      // Sync verified user to Supabase
      await syncUserToSupabase(userCredential.user, 'email');
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      
      // Save user to Supabase (not verified yet)
      await syncUserToSupabase(userCredential.user, 'email');
      
      // Send verification email - must be done while user is still signed in
      try {
        await sendEmailVerification(userCredential.user, {
          url: window.location.origin + '/login', // Redirect URL after verification
        });
        console.log('Verification email sent successfully to:', email);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't throw here - account is created, just email failed
      }
      
      // Sign out after sending verification email
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, resendVerificationEmail, resetPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
