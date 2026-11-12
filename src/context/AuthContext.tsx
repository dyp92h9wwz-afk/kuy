import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider, DESIGNATED_ADMIN_EMAIL } from '../firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  loginWithGoogle: async () => {},
  logout: async () => {},
  authError: null,
  clearAuthError: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check designated admin email
        const isDesignated =
          currentUser.email?.toLowerCase() === DESIGNATED_ADMIN_EMAIL.toLowerCase();
        setIsAdmin(isDesignated);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email?.toLowerCase();
      if (email !== DESIGNATED_ADMIN_EMAIL.toLowerCase()) {
        await signOut(auth);
        setAuthError(`บัญชี ${email} ไม่มีสิทธิ์ผู้ดูแลระบบ (Admin Only: ${DESIGNATED_ADMIN_EMAIL})`);
        setIsAdmin(false);
        setUser(null);
        return;
      }
      setIsAdmin(true);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      console.error('Google Sign-in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง');
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        loginWithGoogle,
        logout,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
