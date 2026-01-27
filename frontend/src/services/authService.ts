// frontend/src/services/authService.ts
// CREATE THIS NEW FILE

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
}

// Sign up new user
export const signUp = async ({ email, password, name, phoneNumber, platform }: SignUpData): Promise<User> => {
  // Create auth user
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update profile with name
  await updateProfile(user, { displayName: name });

  // Save user data to Firestore
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    name: name,
    phoneNumber: phoneNumber,
    platform: platform,
    createdAt: new Date().toISOString()
  });

  return user;
};

// Login existing user
export const login = async ({ email, password }: LoginData): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
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