import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
  deleteUser,
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

// Firebase configuration from environment variables or stored settings
const getFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem('freakout_firebase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch {}

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAEWOC-QLiEefAI6lpOp41Byx63HehfYV8',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'freak-out-78040.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'freak-out-78040',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'freak-out-78040.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '738065666705',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:738065666705:web:6c9cdfd4061762da70a530',
  };
};

const firebaseConfig = getFirebaseConfig();

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

// Allow dynamic reload of Firebase when configured in UI
export const reloadFirebaseWithConfig = (newConfig: any) => {
  localStorage.setItem('freakout_firebase_config', JSON.stringify(newConfig));
  window.location.reload();
};

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

// Local user storage helper for when Firebase is not configured or offline
const LOCAL_ACCOUNTS_KEY = 'freakout_registered_accounts';

interface LocalAccount {
  uid: string;
  name: string;
  email: string;
  passwordHash: string;
  role?: string;
  createdAt: string;
}

const getLocalAccounts = (): LocalAccount[] => {
  try {
    const data = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalAccounts = (accounts: LocalAccount[]) => {
  localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
};

// Sign in with Google (Real Firebase)
export const loginWithGoogle = async (): Promise<AuthSession> => {
  if (!auth) {
    throw new Error(
      'ยังไม่ได้ตั้งค่า Firebase Configuration ในไฟล์ .env.local (กรุณาระบุ VITE_FIREBASE_API_KEY และ VITE_FIREBASE_PROJECT_ID เพื่อเชื่อมต่อ Google OAuth จริง)'
    );
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

// Sign Up with Email and Password
export const registerWithEmail = async (name: string, email: string, pass: string): Promise<AuthSession> => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim() || cleanEmail.split('@')[0];

  if (auth) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      await updateProfile(cred.user, { displayName: cleanName });

      const session: AuthSession = {
        user: {
          uid: cred.user.uid,
          displayName: cleanName,
          email: cred.user.email,
          photoURL: null,
        },
        googleAccessToken: null,
      };
      localStorage.setItem('freakout_auth_session', JSON.stringify(session));
      return session;
    } catch (err) {
      console.warn('Firebase register failed or not online, falling back to local DB:', err);
    }
  }

  // Local accounts fallback
  const accounts = getLocalAccounts();
  const existing = accounts.find((a) => a.email === cleanEmail);
  if (existing) {
    throw new Error('อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบ');
  }

  const newAccount: LocalAccount = {
    uid: `user-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    passwordHash: pass,
    role: 'Product / UI Designer',
    createdAt: new Date().toISOString(),
  };

  accounts.push(newAccount);
  saveLocalAccounts(accounts);

  const session: AuthSession = {
    user: {
      uid: newAccount.uid,
      displayName: newAccount.name,
      email: newAccount.email,
      photoURL: null,
    },
    googleAccessToken: null,
  };
  localStorage.setItem('freakout_auth_session', JSON.stringify(session));
  return session;
};

// Dedicated Administrator Credentials
export const ADMIN_CREDENTIALS = {
  email: 'admin@freakout.app',
  password: 'adminpassword123',
  name: 'Freak Out Administrator',
};

// Sign In with Email and Password
export const loginWithEmail = async (email: string, pass: string): Promise<AuthSession> => {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Check Dedicated Admin Account
  if (cleanEmail === ADMIN_CREDENTIALS.email) {
    if (pass !== ADMIN_CREDENTIALS.password) {
      throw new Error('รหัสผ่านผู้ดูแลระบบ (Admin) ไม่ถูกต้อง');
    }
    // Grant Pro Plan immediately to Admin
    localStorage.setItem('freakout_is_pro', 'true');

    // Automatically restore Admin's saved Gemini API Key if existed
    const savedAdminKey = localStorage.getItem('freakout_admin_gemini_api_key');
    if (savedAdminKey) {
      localStorage.setItem('freakout_gemini_api_key', savedAdminKey);
    }

    const adminSession: AuthSession = {
      user: {
        uid: 'admin-master-uid',
        displayName: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        photoURL: null,
      },
      googleAccessToken: null,
    };
    localStorage.setItem('freakout_auth_session', JSON.stringify(adminSession));
    return adminSession;
  }

  if (auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const session: AuthSession = {
        user: {
          uid: cred.user.uid,
          displayName: cred.user.displayName,
          email: cred.user.email,
          photoURL: cred.user.photoURL,
        },
        googleAccessToken: null,
      };
      localStorage.setItem('freakout_auth_session', JSON.stringify(session));
      return session;
    } catch (err) {
      console.warn('Firebase email login failed, checking local accounts:', err);
    }
  }

  const accounts = getLocalAccounts();
  const account = accounts.find((a) => a.email === cleanEmail);
  if (!account) {
    throw new Error('ไม่พบบัญชีผู้ใช้นี้ กรุณาสมัครสมาชิกก่อน');
  }
  if (account.passwordHash !== pass) {
    throw new Error('รหัสผ่านไม่ถูกต้อง');
  }

  const session: AuthSession = {
    user: {
      uid: account.uid,
      displayName: account.name,
      email: account.email,
      photoURL: null,
    },
    googleAccessToken: null,
  };
  localStorage.setItem('freakout_auth_session', JSON.stringify(session));
  return session;
};

// Update user profile (Name)
export const updateUserProfile = async (newName: string): Promise<void> => {
  const session = getSavedSession();
  if (!session?.user) return;

  session.user.displayName = newName;
  localStorage.setItem('freakout_auth_session', JSON.stringify(session));

  if (auth?.currentUser) {
    try {
      await updateProfile(auth.currentUser, { displayName: newName });
    } catch (e) {
      console.warn('Firebase profile update failed:', e);
    }
  }

  // Update local accounts
  const accounts = getLocalAccounts();
  const acc = accounts.find((a) => a.uid === session.user?.uid || a.email === session.user?.email);
  if (acc) {
    acc.name = newName;
    saveLocalAccounts(accounts);
  }
};

// Update user password
export const updateUserPassword = async (newPassword: string): Promise<void> => {
  const session = getSavedSession();
  if (!session?.user) return;

  if (auth?.currentUser) {
    try {
      await updatePassword(auth.currentUser, newPassword);
    } catch (e) {
      console.warn('Firebase password update failed:', e);
    }
  }

  const accounts = getLocalAccounts();
  const acc = accounts.find((a) => a.uid === session.user?.uid || a.email === session.user?.email);
  if (acc) {
    acc.passwordHash = newPassword;
    saveLocalAccounts(accounts);
  }
};

// Deactivate / Delete Account
export const deactivateAccount = async (): Promise<void> => {
  const session = getSavedSession();
  const uid = session?.user?.uid;
  const email = session?.user?.email;

  if (auth?.currentUser) {
    try {
      await deleteUser(auth.currentUser);
    } catch (e) {
      console.warn('Firebase delete user error:', e);
    }
  }

  if (uid || email) {
    const accounts = getLocalAccounts().filter((a) => a.uid !== uid && a.email !== email);
    saveLocalAccounts(accounts);
  }

  // Clear user-specific data from storage
  localStorage.removeItem('freakout_auth_session');
  localStorage.removeItem('freakout_authenticated');
  localStorage.removeItem('freakout_tasks');
  localStorage.removeItem('freakout_stats');
};

// Sign out
export const logoutAuth = async (): Promise<void> => {
  localStorage.removeItem('freakout_auth_session');
  localStorage.removeItem('freakout_authenticated');
  if (auth) {
    try {
      await signOut(auth);
    } catch {}
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
