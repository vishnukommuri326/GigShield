// frontend/src/services/authService.ts
// CREATE THIS NEW FILE

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  platform: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Sign up new user
export const signUp = async ({ email, password, name, phoneNumber, platform }: SignUpData): Promise<User> => {
  // Create auth user
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update profile with name
  await updateProfile(user, { displayName: name });

  // Send verification email with action URL
  await sendEmailVerification(user, {
    url: window.location.origin + '/login',
    handleCodeInApp: false
  });

  // Save user data to Firestore
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    name: name,
    phoneNumber: phoneNumber,
    platform: platform,
    createdAt: new Date().toISOString(),
    emailVerified: false
  });

  return user;
};

// Login existing user
export const login = async ({ email, password, rememberMe = false }: LoginData): Promise<User> => {
  // Set persistence based on remember me
  await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Google Sign-In
export const loginWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;
  
  // Check if this is a new user and save to Firestore
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      name: user.displayName || 'User',
      phoneNumber: '',
      platform: '',
      createdAt: new Date().toISOString(),
      emailVerified: true
    });
  }
  
  return user;
};

// Logout
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Resend verification email
export const resendVerificationEmail = async (): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');
  if (user.emailVerified) throw new Error('Email already verified');
  await sendEmailVerification(user, {
    url: window.location.origin + '/login',
    handleCodeInApp: false
  });
};