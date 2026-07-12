import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Remove orderBy to prevent Firebase index errors. We'll sort on the client side.
      const q = query(collection(db, 'events'));
      const snapshot = await getDocs(q);
      
      const activeEvents = [];
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Start of today

      for (const document of snapshot.docs) {
        const data = document.data();
        const eventDate = new Date(data.date);

        // If event date has passed
        if (eventDate < now) {
          try {
            // Auto-migrate to pastEvents collection
            await addDoc(collection(db, 'pastEvents'), {
              title: data.title || '',
              date: data.date || '',
              time: data.time || '',
              category: data.category || '',
              description: data.description || '',
              imageUrl: data.imageUrl || '',
              link: '' // Cleared so admin can add the drive link
            });
            // Delete from active events
            await deleteDoc(doc(db, 'events', document.id));
          } catch (e) {
            // If user lacks permission (e.g. normal visitor), silently skip migration.
            // The event is still filtered out of the active list below.
            console.log("Could not auto-migrate past event (likely insufficient permissions).");
          }
        } else {
          activeEvents.push({ id: document.id, ...data });
        }
      }

      activeEvents.sort((a, b) => new Date(a.date) - new Date(b.date)); // Ascending for upcoming events
      setEvents(activeEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new event
  const addEvent = async (eventData) => {
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...eventData,
        createdAt: new Date(),
      });
      await fetchEvents(); // Refresh list
      return docRef.id;
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  // Update event
  const updateEvent = async (eventId, eventData) => {
    try {
      await updateDoc(doc(db, 'events', eventId), eventData);
      await fetchEvents(); // Refresh list
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, 'events', eventId));
      await fetchEvents(); // Refresh list
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, addEvent, updateEvent, deleteEvent, fetchEvents };
};