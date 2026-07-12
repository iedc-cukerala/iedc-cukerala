import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signOut, signInWithCredential } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const processLoginResult = async (user) => {
    try {
      const email = user.email;
      const superAdmins = ['tathagatamandal68@gmail.com'];

      let isAdmin = false;
      if (superAdmins.includes(email.toLowerCase())) {
        isAdmin = true;
      } else {
        const uidDoc = await getDoc(doc(db, 'admins', user.uid));
        if (uidDoc.exists()) {
          isAdmin = true;
        } else {
          const emailDoc = await getDoc(doc(db, 'admins', email.toLowerCase()));
          if (emailDoc.exists()) {
            isAdmin = true;
            await setDoc(doc(db, 'admins', user.uid), {
              ...emailDoc.data(),
              email: email.toLowerCase(),
              uid: user.uid,
              status: 'active'
            });
            await deleteDoc(doc(db, 'admins', email.toLowerCase()));
          } else {
            const adminQ = query(collection(db, 'admins'), where('email', '==', email));
            const adminSnapshot = await getDocs(adminQ);
            if (!adminSnapshot.empty) {
              isAdmin = true;
              const adminDoc = adminSnapshot.docs[0];
              if (adminDoc.id !== user.uid) {
                await setDoc(doc(db, 'admins', user.uid), {
                  ...adminDoc.data(),
                  uid: user.uid,
                  status: 'active'
                });
                await deleteDoc(doc(db, 'admins', adminDoc.id));
              }
            }
          }
        }
      }

      if (isAdmin) {
        navigate('/admin/dashboard');
        return;
      }

      const leadQ = query(collection(db, 'leads'), where('email', '==', email));
      const leadSnapshot = await getDocs(leadQ);

      if (!leadSnapshot.empty) {
        const leadDoc = leadSnapshot.docs[0];
        if (leadDoc.data().status === 'pending' || leadDoc.data().uid !== user.uid) {
          await updateDoc(doc(db, 'leads', leadDoc.id), {
            status: 'active',
            uid: user.uid,
          });
        }
        navigate('/lead-dashboard');
        return;
      }

      await signOut(auth);
      setError('Your email is not registered as an Admin or Team Lead.');
    } catch (err) {
      console.error(err);
      setError(`Verification failed: ${err.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOneTapResponse = async (response) => {
    setLoading(true);
    setError('');
    try {
      const credential = GoogleAuthProvider.credential(response.credential);
      const result = await signInWithCredential(auth, credential);
      await processLoginResult(result.user);
    } catch (err) {
      console.error(err);
      setError(`One Tap authentication failed: ${err.message || 'Please try again.'}`);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await processLoginResult(result.user);
    } catch (err) {
      console.error(err);
      setError(`Authentication failed: ${err.message || 'Please try again.'}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "1081319258572-8cgc9fcijrnv6c7bkl0bplj5efvulppu.apps.googleusercontent.com",
          callback: handleOneTapResponse
        });
        window.google.accounts.id.prompt();
      }
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl max-w-md w-full relative z-10"
      >
        <div className="flex justify-center items-center gap-6 mb-8">
          {/* IEDC Logo */}
          <div className="relative w-24 h-24 flex items-center justify-center transition-transform hover:scale-105 duration-300">
            <img src="/iedc_logo.png" alt="IEDC Logo" className="w-full h-full object-contain relative z-10" />
          </div>

          {/* CUK Logo */}
          <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-slate-800 shadow-[0_0_40px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_60px_rgba(168,85,247,0.4)] transition-all duration-500 p-1.5 overflow-hidden">
            <div className="absolute inset-0 rounded-full border-t-4 border-purple-500 animate-spin-slow opacity-50"></div>
            <img src="https://www.cukerala.ac.in/assets/img/CUKLOGO.png" alt="CUK Logo" className="w-full h-full object-contain relative z-10" />
          </div>
        </div>
        
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2 text-center tracking-tight">
          Admin & Lead Login
        </h2>
        <p className="text-slate-400 text-center mb-10 font-medium">IEDC Central University of Kerala</p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg mb-6 text-sm flex items-center"
          >
            <span className="mr-2">⚠️</span> {error}
          </motion.div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full relative group overflow-hidden bg-slate-800/80 border border-slate-600/50 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-xl disabled:opacity-50 flex items-center justify-center space-x-3 hover:bg-slate-700 hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6 transition-transform group-hover:scale-110 relative z-10" />
          <span className="text-lg tracking-wide relative z-10">{loading ? 'Verifying Credentials...' : 'Sign in with Google'}</span>
        </button>

        <p className="text-slate-400 text-xs text-center mt-6">
          *Must use your official <strong className="text-white">@cukerala.ac.in</strong> email address.
        </p>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col items-center gap-5">
          <Link 
            to="/" 
            className="text-slate-400 hover:text-white flex items-center justify-center gap-2 font-semibold bg-slate-800/40 px-6 py-2.5 rounded-full border border-slate-700/50 transition-all hover:bg-slate-700 hover:border-purple-500/50 group w-fit shadow-md hover:shadow-purple-500/20"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return to Main Site
          </Link>

          <p className="text-slate-500 text-xs text-center">
            Contact <a href="mailto:tathagata.2500705021@cukerala.ac.in" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
              tathagata.2500705021@cukerala.ac.in
            </a> for support.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;