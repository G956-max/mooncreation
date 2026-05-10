import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';

type Role = 'user' | 'admin';

interface AuthContextType {
  isLoggedIn: boolean;
  role: Role | null;
  user: User | null;
  loginAdmin: (email: string, password: string) => Promise<void>;
  loginUser: (identifier: string, password: string) => Promise<void>;
  signupUser: (email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthReady: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Standard Admin ID
const ADMIN_EMAIL = 'admin@mooncreation.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Admin check based on standard ID
        if (currentUser.email === ADMIN_EMAIL || currentUser.email === 'gopinathsumathi05@gmail.com') {
          setRole('admin');
        } else {
          setRole('user');
        }
      } else {
        setRole(null);
      }
      setIsAuthReady(true);
    });
    return unsubscribe;
  }, []);

  const loginAdmin = async (email: string, password: string) => {
    if (email !== ADMIN_EMAIL && email !== 'gopinathsumathi05@gmail.com') {
      throw new Error('Unauthorized: Only the standard admin ID can login here.');
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error: Please check your internet connection or disable ad-blockers and try again.');
      }
      throw new Error(error.message || 'Failed to sign in as admin. Please ensure Email/Password auth is enabled in Firebase Console.');
    }
  };

  const loginUser = async (identifier: string, password: string) => {
    let loginEmail = identifier;

    // If it doesn't look like an email, assume it's a phone number
    if (!identifier.includes('@')) {
      const path = 'users';
      try {
        const usersRef = collection(db, path);
        // Clean up phone number to match how it might be stored
        const cleanPhone = identifier.replace(/\D/g, '');
        const q = query(usersRef, where('phone', '==', cleanPhone));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error('No user found with this phone number.');
        }

        // Get the email associated with this phone number
        loginEmail = querySnapshot.docs[0].data().email;
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
      }
    }

    try {
      await signInWithEmailAndPassword(auth, loginEmail, password);
    } catch (error: any) {
      if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error: Please check your internet connection or disable ad-blockers and try again.');
      }
      throw new Error(error.message || 'Failed to sign in. Please check your credentials.');
    }
  };

  const signupUser = async (email: string, phone: string, password: string) => {
    const path = 'users';
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      
      // Check if phone already exists
      const usersRef = collection(db, path);
      const q = query(usersRef, where('phone', '==', cleanPhone));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error('Phone number is already registered.');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save user data to Firestore
      await setDoc(doc(db, path, userCredential.user.uid), {
        email,
        phone: cleanPhone,
        role: 'user',
        createdAt: serverTimestamp()
      });
    } catch (error: any) {
      if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error: Please check your internet connection or disable ad-blockers and try again.');
      }
      if (error.code === 'permission-denied' || error.message?.includes('insufficient permissions')) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
      throw new Error(error.message || 'Failed to sign up.');
    }
  };
  
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!user, role, user, loginAdmin, loginUser, signupUser, logout, isAuthReady, loading: !isAuthReady }}>
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

