import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const email = currentUser.email;
        let userRole = null;
        
        const superAdmins = [
          'iedctech@cukerala.ac.in'
        ];

        if (superAdmins.includes(email.toLowerCase())) {
          userRole = 'admin';
        } else {
          try {
            const { collection, query, where, getDocs } = await import('firebase/firestore');
            const { db } = await import('../config/firebase');
            
            const adminQ = query(collection(db, 'admins'), where('email', '==', email));
            const adminSnap = await getDocs(adminQ);
            if (!adminSnap.empty) {
              userRole = 'admin';
            } else {
              const leadQ = query(collection(db, 'leads'), where('email', '==', email));
              const leadSnap = await getDocs(leadQ);
              if (!leadSnap.empty) {
                userRole = 'admin'; // Upgraded from 'lead'
              }
            }
          } catch (e) {
            console.error("Error fetching roles:", e);
          }
        }
        setRole(userRole);
      } else {
        setRole(null);
      }
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  return { user, loading, role, login, logout, signInWithGoogle };
};