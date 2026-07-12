import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { MessageSquare, Mail, Phone, Clock, Trash2, CheckCircle } from 'lucide-react';

const ManageContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setContacts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await deleteDoc(doc(db, 'contacts', id));
    }
  };

  const markAsRead = async (id) => {
    await updateDoc(doc(db, 'contacts', id), { status: 'read' });
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400 font-medium">Loading messages...</div>;
  }

  return (
    <div className="space-y-6 mt-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 mb-1">
          <MessageSquare className="text-purple-600 w-6 h-6" />
          Messages & Inquiries
        </h2>
        <p className="text-slate-600 text-sm">Read and manage messages sent from the public Contact form.</p>
      </div>

      <div className="relative">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-slate-50 border border-slate-200 rounded-3xl shadow-sm">
            <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Your inbox is empty.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar pr-2 pb-10">
            {contacts.map((msg) => (
              <div 
                key={msg.id} 
                className={`p-6 rounded-2xl transition-all duration-300 relative group overflow-hidden ${
                  msg.status === 'read' 
                  ? 'bg-white border border-slate-200 opacity-80 hover:opacity-100 shadow-sm' 
                  : 'bg-white border border-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]'
                }`}
              >
                {/* Side glow for unread */}
                {msg.status !== 'read' && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]"></div>
                )}

                <div className="flex flex-col lg:flex-row justify-between items-start mb-5 pl-2 gap-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className={`w-14 h-14 rounded-full flex shrink-0 items-center justify-center font-extrabold text-xl shadow-inner border ${
                      msg.status === 'read' ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-purple-400/50 shadow-purple-500/30'
                    }`}>
                      {msg.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                        {msg.name}
                        {msg.status !== 'read' && (
                           <span className="bg-purple-100 text-purple-700 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1.5 shadow-sm">
                             <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></span>
                             New Message
                           </span>
                        )}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-slate-600 font-medium">
                        <a href={`mailto:${msg.email}`} className="flex items-center gap-1.5 hover:text-purple-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-slate-700">
                          <Mail className="w-3.5 h-3.5" /> {msg.email}
                        </a>
                        {msg.phone && (
                          <a href={`tel:${msg.phone}`} className="flex items-center gap-1.5 hover:text-purple-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-slate-700">
                            <Phone className="w-3.5 h-3.5" /> {msg.phone}
                          </a>
                        )}
                        <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-slate-700">
                          <Clock className="w-3.5 h-3.5" /> {msg.createdAt?.toDate().toLocaleString() || 'Recent'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full lg:w-auto justify-end mt-2 lg:mt-0">
                    {msg.status !== 'read' && (
                      <button onClick={() => markAsRead(msg.id)} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs rounded-xl transition-colors border border-emerald-500/30 shadow-sm" title="Mark as Read">
                        <CheckCircle className="w-4 h-4" /> Mark Read
                      </button>
                    )}
                    <button onClick={() => handleDelete(msg.id)} className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 font-bold text-xs rounded-xl transition-colors border border-rose-500/30 shadow-sm" title="Delete Message">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>

                <div className={`ml-2 lg:ml-20 p-5 rounded-2xl border whitespace-pre-wrap text-[15px] leading-relaxed ${
                  msg.status === 'read' ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-50 border-slate-300 text-slate-800 shadow-inner'
                }`}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageContacts;
