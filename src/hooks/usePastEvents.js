import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export const usePastEvents = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Remove orderBy to prevent Firebase index errors. We'll sort on the client side.
    const q = query(collection(db, 'pastEvents'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      // SORT IN REACT INSTEAD OF FIREBASE (Newest First)
      .sort((a, b) => new Date(b.date) - new Date(a.date)); 

      setPastEvents(eventsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching past events:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addPastEvent = async (eventData) => {
    await addDoc(collection(db, 'pastEvents'), eventData);
  };

  const updatePastEvent = async (id, eventData) => {
    const eventRef = doc(db, 'pastEvents', id);
    await updateDoc(eventRef, eventData);
  };

  const deletePastEvent = async (id) => {
    const eventRef = doc(db, 'pastEvents', id);
    await deleteDoc(eventRef);
  };

  return { pastEvents, addPastEvent, updatePastEvent, deletePastEvent, loading };
};