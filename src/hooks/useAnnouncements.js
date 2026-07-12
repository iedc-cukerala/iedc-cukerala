import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all announcements
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      // Remove orderBy to prevent Firebase index errors. We'll sort on the client side.
      const q = query(collection(db, 'announcements'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new announcement
  const addAnnouncement = async (announcementData) => {
    try {
      const docRef = await addDoc(collection(db, 'announcements'), {
        ...announcementData,
        createdAt: new Date(),
      });
      await fetchAnnouncements(); // Refresh list
      return docRef.id;
    } catch (error) {
      console.error('Error adding announcement:', error);
      throw error;
    }
  };

  // Update announcement
  const updateAnnouncement = async (announcementId, announcementData) => {
    try {
      await updateDoc(doc(db, 'announcements', announcementId), announcementData);
      await fetchAnnouncements(); // Refresh list
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  };

  // Delete announcement
  const deleteAnnouncement = async (announcementId) => {
    try {
      await deleteDoc(doc(db, 'announcements', announcementId));
      await fetchAnnouncements(); // Refresh list
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return { announcements, loading, addAnnouncement, updateAnnouncement, deleteAnnouncement, fetchAnnouncements };
};