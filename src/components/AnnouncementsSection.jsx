import React from 'react';
import { useAnnouncements } from '../hooks/useAnnouncements';

const AnnouncementsSection = () => {
  const { announcements, loading } = useAnnouncements();

  if (loading) {
    return (
      <section className="py-20 border-b border-slate-200">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-12 text-center">Announcements</h2>
        <div className="text-center text-slate-600">Loading announcements...</div>
      </section>
    );
  }

  return (
    <section className="py-20 border-b border-slate-200">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-semibold mb-4 tracking-wide uppercase">
          Stay Updated
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900">
          Announcements
        </h2>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center text-slate-600">
          <p>No announcements at the moment. Check back soon!</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {announcements.map(announcement => (
            <div key={announcement.id} className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] max-w-md glass-card p-6 rounded-lg border-l-4 border-l-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-purple-600 flex-1">{announcement.title}</h3>
              </div>
              <p className="text-sm text-slate-500 mb-3">
                📅 {new Date(announcement.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-slate-600 leading-relaxed">{announcement.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AnnouncementsSection;