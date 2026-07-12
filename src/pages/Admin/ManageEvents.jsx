import React, { useState } from 'react';
import { useEvents } from '../../hooks/useEvents';
import { CalendarPlus, Edit3, Trash2, Calendar, Clock, Image as ImageIcon, Link as LinkIcon, Save, XCircle, Tag } from 'lucide-react';

const ManageEvents = () => {
  const { events, addEvent, updateEvent, deleteEvent, loading } = useEvents();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    imageUrl: '',
    category: '',
    link: '' // Added link state here
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
        await updateEvent(editingId, formData);
        setEditingId(null);
      } else {
        await addEvent(formData);
      }
      setFormData({ title: '', description: '', date: '', time: '', imageUrl: '', category: '', link: '' });
    } catch (error) {
      setSubmitError('Error: ' + error.message);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title || '',
      description: event.description || '',
      date: event.date || '',
      time: event.time || '',
      imageUrl: event.imageUrl || '',
      category: event.category || '',
      link: event.link || ''
    });
    setEditingId(event.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(eventId);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', date: '', time: '', imageUrl: '', category: '', link: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
      {/* Form */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 mb-1">
            <CalendarPlus className="text-purple-400 w-6 h-6" />
            {editingId ? 'Edit Event' : 'Add New Event'}
          </h2>
          <p className="text-slate-400 text-sm">Fill in the details to publish an upcoming event.</p>
        </div>

        {submitError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
            <XCircle className="w-4 h-4" /> {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800/60 p-6 rounded-2xl shadow-xl space-y-5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Event Title *</label>
            <input type="text" name="title" placeholder="e.g., Workshop on AI" value={formData.title} onChange={handleInputChange} className="w-full bg-slate-950/50 text-white p-3 rounded-lg border border-slate-700/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-600" required />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description *</label>
            <textarea name="description" placeholder="Event details and information" value={formData.description} onChange={handleInputChange} className="w-full bg-slate-950/50 text-white p-3 rounded-lg border border-slate-700/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-600 min-h-24 custom-scrollbar" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-slate-500" />
                </div>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full bg-slate-950/50 text-white pl-9 p-3 rounded-lg border border-slate-700/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Time *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-4 w-4 text-slate-500" />
                </div>
                <input type="time" name="time" value={formData.time} onChange={handleInputChange} className="w-full bg-slate-950/50 text-white pl-9 p-3 rounded-lg border border-slate-700/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" required />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-4 w-4 text-slate-500" />
              </div>
              <input type="text" name="category" placeholder="e.g., Workshop, Seminar" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-950/50 text-white pl-9 p-3 rounded-lg border border-slate-700/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-600" required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Image URL *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ImageIcon className="h-4 w-4 text-slate-500" />
              </div>
              <input type="url" name="imageUrl" placeholder="https://example.com/image.jpg" value={formData.imageUrl} onChange={handleInputChange} className="w-full bg-slate-950/50 text-white pl-9 p-3 rounded-lg border border-slate-700/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-600" required />
            </div>
            {formData.imageUrl && (
              <div className="mt-3 relative rounded-lg overflow-hidden border border-slate-700 h-32 bg-slate-950">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registration Link (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-4 w-4 text-slate-500" />
              </div>
              <input type="url" name="link" placeholder="https://forms.gle/..." value={formData.link} onChange={handleInputChange} className="w-full bg-slate-950/50 text-white pl-9 p-3 rounded-lg border border-slate-700/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-600" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> {editingId ? 'Update Event' : 'Add Event'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel} className="flex-1 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Events List */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Calendar className="text-purple-400 w-6 h-6" />
              Active Events
            </h2>
            <p className="text-slate-400 text-sm">Manage and monitor upcoming events.</p>
          </div>
          <div className="bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2">
            <span className="text-purple-400 font-bold">{events.length}</span>
            <span className="text-slate-400 text-xs uppercase tracking-wider">Total</span>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/60 p-6 rounded-2xl shadow-xl min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-500">
              <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-3"></div>
              <p>Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-500">
              <CalendarPlus className="w-12 h-12 mb-3 opacity-20" />
              <p>No events yet. Create your first event!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {events.map(event => (
                <div key={event.id} className="bg-slate-950/50 p-5 rounded-xl border border-slate-800/80 hover:border-purple-500/50 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Thumbnail */}
                    {event.imageUrl && (
                      <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-white text-lg leading-tight">{event.title}</h3>
                        <span className="bg-purple-900/30 text-purple-400 text-[10px] px-2 py-1 rounded-full border border-purple-700/30 uppercase tracking-wider font-bold whitespace-nowrap ml-3">
                          {event.category}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-medium mb-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>
                        {event.link && (
                          <a href={event.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
                            <LinkIcon className="w-3 h-3" /> Registration
                          </a>
                        )}
                      </div>
                      
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">{event.description}</p>
                      
                      <div className="flex gap-2 mt-auto justify-end">
                        <button onClick={() => handleEdit(event)} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold border border-slate-700 transition-colors">
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => handleDelete(event.id)} className="flex items-center gap-1.5 bg-rose-900/10 hover:bg-rose-600 text-rose-500 hover:text-white px-4 py-1.5 rounded-lg text-xs font-bold border border-rose-900/30 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
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

export default ManageEvents;