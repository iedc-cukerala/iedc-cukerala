import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useTeam = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeads(leadsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const inviteLead = async (leadData) => {
    await addDoc(collection(db, 'leads'), {
      ...leadData,
      status: 'pending', // They start as pending until they set a password
      createdAt: new Date().toISOString()
    });
  };

  const revokeLead = async (id) => {
    const leadDoc = await getDoc(doc(db, 'leads', id));
    if (leadDoc.exists()) {
      const leadData = leadDoc.data();
      if (leadData.uid) {
        await deleteDoc(doc(db, 'admins', leadData.uid));
      }
    }
    await deleteDoc(doc(db, 'leads', id));
  };

  return { leads, inviteLead, revokeLead, loading };
};