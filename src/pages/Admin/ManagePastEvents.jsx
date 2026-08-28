import React, { useState } from 'react';
import { usePastEvents } from '../../hooks/usePastEvents';
import { Camera, Edit3, Trash2, Calendar, Image as ImageIcon, Link as LinkIcon, Save, HardDrive } from 'lucide-react';

const ManagePastEvents = () => {
  const { pastEvents, addPastEvent, updatePastEvent, deletePastEvent, loading } = usePastEvents();
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', time: '', category: '', imageUrl: '', link: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    try {
      if (editingId) {
        await updatePastEvent(editingId, formData);
        setEditingId(null);
      } else {
        await addPastEvent(formData);
      }
      setFormData({ title: '', description: '', date: '', time: '', category: '', imageUrl: '', link: '' });
    } catch (error) {
      setSubmitError('Error: ' + error.message);
    }
  };

  const handleEdit = (event) => {
    setFormData({ ...event });
    setEditingId(event.id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 mt-6">
      {/* Form */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 mb-1">
            <Camera className="text-blue-400 w-6 h-6" />
            {editingId ? 'Edit Past Event' : 'Add Past Event'}
          </h2>
          <p className="text-slate-400 text-sm">Archive completed events to showcase in the gallery.</p>
        </div>

        {submitError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
            <span>⚠️</span> {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800/60 p-4 sm:p-6 rounded-2xl shadow-xl space-y-5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Event Title</label>
            <input type="text" name="title" placeholder="e.g., Hackathon 2024" value={formData.title} onChange={handleInputChange} className="w-full bg-slate-950/50 text-white p-3 rounded-lg border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-slate-500" />
                </div>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full bg-slate-950/50 text-white pl-9 p-3 rounded-lg border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</label>
              <div className="relative">
                <input type="time" name="time" value={formData.time} onChange={handleInputChange} className="w-full bg-slate-950/50 text-white p-3 rounded-lg border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</label>
            <input type="text" name="category" placeholder="e.g., Workshop, Seminar" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-950/50 text-white p-3 rounded-lg border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Event Summary</label>
            <textarea name="description" placeholder="How was the event? What happened?" value={formData.description} onChange={handleInputChange} className="w-full bg-slate-950/50 text-white p-3 rounded-lg border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600 min-h-24 custom-scrollbar" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Image URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ImageIcon className="h-4 w-4 text-slate-500" />
              </div>
              <input type="url" name="imageUrl" placeholder="https://example.com/image.jpg" value={formData.imageUrl} onChange={handleInputChange} className="w-full bg-slate-950/50 text-white pl-9 p-3 rounded-lg border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600" />
            </div>
            {formData.imageUrl && (
              <div className="mt-3 relative rounded-lg overflow-hidden border border-slate-700 aspect-[4/3] w-48 bg-slate-950">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Drive Folder Link</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HardDrive className="h-4 w-4 text-slate-500" />
              </div>
              <input type="url" name="link" placeholder="Google Drive (Anyone with link)" value={formData.link} onChange={handleInputChange} className="w-full bg-slate-950/50 text-white pl-9 p-3 rounded-lg border border-slate-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600" />
            </div>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 mt-4">
            <Save className="w-4 h-4" /> {editingId ? 'Update Archive' : 'Save Archive'}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <HardDrive className="text-blue-400 w-6 h-6" />
              Event Archive
            </h2>
            <p className="text-slate-400 text-sm">Past events displayed in the public gallery.</p>
          </div>
          <div className="bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2">
            <span className="text-blue-400 font-bold">{pastEvents.length}</span>
            <span className="text-slate-400 text-xs uppercase tracking-wider">Total</span>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/60 p-4 sm:p-6 rounded-2xl shadow-xl min-h-[400px]">
          {pastEvents.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-40 text-slate-500">
               <Camera className="w-12 h-12 mb-3 opacity-20" />
               <p>No past events archived yet.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {pastEvents.map(event => (
                <div key={event.id} className="bg-slate-950/50 rounded-xl border border-slate-800/80 hover:border-blue-500/50 transition-colors group overflow-hidden flex flex-col">
                  {/* Thumbnail */}
                  <div className="w-full aspect-[4/3] relative border-b border-slate-800/80">
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                    <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[10px] text-white font-semibold bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                      <Calendar className="w-3 h-3" /> {event.date}
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-white text-base leading-tight mb-2 truncate" title={event.title}>{event.title}</h3>
                    
                    <a href={event.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mb-4 inline-flex w-fit">
                      <LinkIcon className="w-3 h-3" /> Gallery Link
                    </a>
                    
                    <div className="flex gap-2 mt-auto">
                      <button onClick={() => handleEdit(event)} className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white py-1.5 rounded-lg text-xs font-bold border border-slate-700 transition-colors">
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => deletePastEvent(event.id)} className="flex-1 flex items-center justify-center gap-1.5 bg-rose-900/10 hover:bg-rose-600 text-rose-500 hover:text-white py-1.5 rounded-lg text-xs font-bold border border-rose-900/30 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
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

export default ManagePastEvents;