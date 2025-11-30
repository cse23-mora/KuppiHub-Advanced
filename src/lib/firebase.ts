// Firebase Configuration
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

// Firebase configuration - Replace with your Firebase project config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (prevent multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Auth Functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return { user: null, error: errorMessage };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return { user: null, error: errorMessage };
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return { user: null, error: errorMessage };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return { error: errorMessage };
  }
};

// Firestore Functions for Hierarchy Data
export interface Faculty {
  id: string;
  name: string;
  hasDepartments: boolean;
}

export interface Department {
  id: string;
  name: string;
  facultyId: string;
}

export interface Semester {
  id: string;
  name: string;
  number: number;
}

export interface ModuleMapping {
  moduleCode: string;
  facultyId: string;
  departmentId?: string;
  semesterId: string;
}

// Get all faculties
export const getFaculties = async (): Promise<Faculty[]> => {
  try {
    const facultiesRef = collection(db, 'faculties');
    const snapshot = await getDocs(facultiesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Faculty));
  } catch (error) {
    console.error('Error fetching faculties:', error);
    return [];
  }
};

// Get departments for a faculty
export const getDepartments = async (facultyId: string): Promise<Department[]> => {
  try {
    const deptRef = collection(db, 'faculties', facultyId, 'departments');
    const snapshot = await getDocs(deptRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      facultyId,
      ...doc.data()
    } as Department));
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
};

// Get semesters for a department (or faculty if no departments)
export const getSemesters = async (facultyId: string, departmentId?: string): Promise<Semester[]> => {
  try {
    let semRef;
    if (departmentId) {
      semRef = collection(db, 'faculties', facultyId, 'departments', departmentId, 'semesters');
    } else {
      semRef = collection(db, 'faculties', facultyId, 'semesters');
    }
    const snapshot = await getDocs(semRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Semester));
  } catch (error) {
    console.error('Error fetching semesters:', error);
    return [];
  }
};

// Get module codes for a specific path
export const getModuleCodes = async (
  facultyId: string,
  departmentId?: string,
  semesterId?: string
): Promise<string[]> => {
  try {
    let mappingsRef;
    if (departmentId && semesterId) {
      mappingsRef = collection(
        db,
        'faculties', facultyId,
        'departments', departmentId,
        'semesters', semesterId,
        'modules'
      );
    } else if (semesterId) {
      mappingsRef = collection(
        db,
        'faculties', facultyId,
        'semesters', semesterId,
        'modules'
      );
    } else {
      return [];
    }
    
    const snapshot = await getDocs(mappingsRef);
    return snapshot.docs.map(doc => doc.data().code as string);
  } catch (error) {
    console.error('Error fetching module codes:', error);
    return [];
  }
};

// Export instances
export { app, auth, db, onAuthStateChanged };
export type { User };
