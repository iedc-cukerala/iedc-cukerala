import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useContact = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const submitContactForm = async (formData) => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    try {
      // Save securely to Firebase Database
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: new Date(),
        status: 'unread'
      });
      
      setSuccess(true);
      return true;
    } catch (err) {
      console.error("Error submitting contact form: ", err);
      setError("Failed to send message. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitContactForm, loading, success, error };
};
