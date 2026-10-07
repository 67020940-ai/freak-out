import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot
} from 'firebase/firestore';

// Firebase configuration from environment variables or safe local fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

const app = !getApps().length
  ? isFirebaseConfigured
    ? initializeApp(firebaseConfig)
    : null
  : getApp();

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

// Google Auth Provider with Google Calendar scope
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export interface AuthSession {
  user: {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  } | null;
  googleAccessToken: string | null;
}

// Sign in with Google (Real Firebase or Demo Fallback)
export const loginWithGoogle = async (): Promise<AuthSession> => {
  if (!auth) {
    // Graceful offline/demo mock login if Firebase credentials are not yet entered in .env
    const demoUser = {
      uid: 'demo-user-123',
      displayName: 'Jay (Local User)',
      email: 'jay@example.com',
      photoURL: null,
    };
    const session: AuthSession = {
      user: demoUser,
      googleAccessToken: 'mock-google-access-token',
    };
    localStorage.setItem('freakout_auth_session', JSON.stringify(session));
    return session;
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken || null;

    const session: AuthSession = {
      user: {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      },
      googleAccessToken: token,
    };

    localStorage.setItem('freakout_auth_session', JSON.stringify(session));
    return session;
  } catch (err: any) {
    console.error('Firebase Google Sign-In error:', err);
    throw err;
  }
};

// Sign out
export const logoutAuth = async (): Promise<void> => {
  localStorage.removeItem('freakout_auth_session');
  if (auth) {
    await signOut(auth);
  }
};

// Get current saved session
export const getSavedSession = (): AuthSession | null => {
  try {
    const saved = localStorage.getItem('freakout_auth_session');
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};
