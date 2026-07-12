import React, { useState } from 'react';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import { Megaphone, Edit3, Trash2, Calendar, Save, XCircle } from 'lucide-react';

const ManageAnnouncements = () => {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, loading } = useAnnouncements();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    try {
      if (editingId) {
        await updateAnnouncement(editingId, formData);
        setEditingId(null);
      } else {
        await addAnnouncement(formData);
      }
      setFormData({ title: '', description: '', date: '' });
    } catch (error) {
      setSubmitError('Error: ' + error.message);
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      description: announcement.description,
      date: announcement.date
    });
    setEditingId(announcement.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (announcementId) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      await deleteAnnouncement(announcementId);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', date: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
      {/* Form */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 mb-1">
            <Megaphone className="text-pink-400 w-6 h-6" />
            {editingId ? 'Edit Announcement' : 'New Announcement'}
          </h2>
          <p className="text-slate-400 text-sm">Broadcast important news to the homepage.</p>
        </div>

        {submitError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
            <XCircle className="w-4 h-4" /> {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800/60 p-6 rounded-2xl shadow-xl space-y-5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Announcement Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g., New Partnership Announcement"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full bg-slate-950/50 text-white p-3 rounded-lg border border-slate-700/50 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 outline-none transition-all placeholder:text-slate-600"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description *</label>
            <textarea
              name="description"
              placeholder="Detailed information for the bulletin"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-slate-950/50 text-white p-3 rounded-lg border border-slate-700/50 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 outline-none transition-all placeholder:text-slate-600 min-h-32 custom-scrollbar"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Display Date *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full bg-slate-950/50 text-white pl-9 p-3 rounded-lg border border-slate-700/50 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 outline-none transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> {editingId ? 'Update Post' : 'Publish Post'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Announcements List */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Megaphone className="text-pink-400 w-6 h-6" />
              Live Bulletins
            </h2>
            <p className="text-slate-400 text-sm">Currently visible on the main page.</p>
          </div>
          <div className="bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2">
            <span className="text-pink-400 font-bold">{announcements.length}</span>
            <span className="text-slate-400 text-xs uppercase tracking-wider">Total</span>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/60 p-6 rounded-2xl shadow-xl min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-500">
              <div className="w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mb-3"></div>
              <p>Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-500">
              <Megaphone className="w-12 h-12 mb-3 opacity-20" />
              <p>No announcements active right now.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {announcements.map(announcement => (
                <div key={announcement.id} className="bg-slate-950/50 p-5 rounded-xl border border-slate-800/80 hover:border-pink-500/50 transition-colors group relative overflow-hidden flex flex-col sm:flex-row justify-between gap-4">
                  <div className="absolute top-0 left-0 w-1 h-full bg-pink-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg leading-tight mb-1">{announcement.title}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-pink-400 font-semibold mb-3">
                      <Calendar className="w-3 h-3" /> {announcement.date}
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{announcement.description}</p>
                  </div>
                  
                  <div className="flex sm:flex-col gap-2 shrink-0 justify-end sm:justify-start">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-bold border border-slate-700 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="flex items-center justify-center gap-1.5 bg-rose-900/10 hover:bg-rose-600 text-rose-500 hover:text-white px-4 py-2 rounded-lg text-xs font-bold border border-rose-900/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAnnouncements;