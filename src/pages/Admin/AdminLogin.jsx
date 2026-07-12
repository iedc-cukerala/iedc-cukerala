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
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4 relative overflow-hidden">

      {/* --- DYNAMIC GRAPHICAL BACKGROUND --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-60"></div>
        {/* Vibrant Floating Blobs */}
        <div className="blob bg-[#ff007f] w-[600px] h-[600px] top-[-20%] left-[-10%] opacity-50"></div>
        <div className="blob bg-[#ff9933] w-[700px] h-[700px] top-[20%] right-[-15%] opacity-40" style={{ animationDelay: '3s', animationDuration: '20s' }}></div>
        <div className="blob bg-[#00f2fe] w-[500px] h-[500px] bottom-[-10%] left-[20%] opacity-50" style={{ animationDelay: '5s', animationDuration: '18s' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 24 }}
        className="bg-white/80 backdrop-blur-2xl border border-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_70px_-20px_rgba(255,0,127,0.3)] max-w-md w-full relative z-10 transition-all duration-500"
      >
        <div className="flex justify-center items-center gap-6 mb-8">
          {/* IEDC Logo */}
          <div className="relative w-24 h-24 flex items-center justify-center transition-transform hover:scale-110 hover:-rotate-3 duration-500">
            <img src="/iedc_logo.png" alt="IEDC Logo" className="w-full h-full object-contain relative z-10" />
          </div>

          {/* CUK Logo */}
          <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-[0_0_30px_rgba(255,153,51,0.3)] hover:shadow-[0_0_50px_rgba(255,153,51,0.6)] hover:rotate-3 transition-all duration-500 p-1.5 overflow-hidden">
            <img src="https://www.cukerala.ac.in/assets/img/CUKLOGO.png" alt="CUK Logo" className="w-full h-full object-contain relative z-10 transform scale-110" />
          </div>
        </div>
        
        <h2 className="text-3xl font-extrabold text-[#1e1b4b] mb-2 text-center tracking-tight">
          Admin <span className="gradient-text">Login</span>
        </h2>
        <p className="text-[#1e1b4b]/70 text-center mb-10 font-medium">IEDC Central University of Kerala</p>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-700 p-4 rounded-2xl mb-6 text-sm flex items-center shadow-inner"
          >
            <span className="mr-3 text-red-500 text-xl">⚠️</span> <span className="font-medium">{error}</span>
          </motion.div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full relative group overflow-hidden bg-white border border-white text-[#1e1b4b] font-bold py-4 rounded-2xl transition-all duration-300 shadow-[0_5px_20px_rgba(0,0,0,0.05)] disabled:opacity-50 flex items-center justify-center space-x-3 hover:border-pink-300 hover:shadow-[0_10px_30px_rgba(255,0,127,0.2)] hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6 transition-transform group-hover:scale-110 relative z-10" />
          <span className="text-lg tracking-wide relative z-10">{loading ? 'Verifying Credentials...' : 'Sign in with Google'}</span>
        </button>

        <p className="text-[#1e1b4b]/50 text-xs text-center mt-6 font-medium">
          *Must use your official <strong className="text-pink-600 font-bold">@cukerala.ac.in</strong> email address.
        </p>

        <div className="mt-8 pt-6 border-t border-[#1e1b4b]/10 flex flex-col items-center gap-5">
          <Link 
            to="/" 
            className="text-[#1e1b4b]/70 hover:text-pink-600 flex items-center justify-center gap-2 font-bold bg-white/50 backdrop-blur-sm px-6 py-2.5 rounded-full border border-white transition-all hover:bg-white hover:shadow-md group w-fit"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Return to Main Site
          </Link>

          <p className="text-[#1e1b4b]/60 text-xs text-center">
            Contact <a href="mailto:tathagata.2500705021@cukerala.ac.in" className="text-pink-600 hover:text-orange-500 transition-colors font-bold underline decoration-pink-600/30 underline-offset-4">
              tathagata.2500705021@cukerala.ac.in
            </a> for support.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;