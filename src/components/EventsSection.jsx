import React from 'react';
import { useEvents } from '../hooks/useEvents';

const EventsSection = () => {
  const { events, loading } = useEvents();

  if (loading) {
    return (
      <section className="py-20 border-b border-slate-800">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-12 text-center">Upcoming Events</h2>
        <div className="text-center text-slate-400">Loading events...</div>
      </section>
    );
  }

  return (
    <section className="py-20 border-b border-slate-800">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-sm font-semibold mb-4 tracking-wide uppercase">
          What's Next
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
          Upcoming Events
        </h2>
      </div>

      {events.length === 0 ? (
        <div className="text-center text-slate-400">
          <p>No upcoming events. Check back soon for exciting opportunities!</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {events.map(event => (
            <div key={event.id} className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] max-w-md glass-card rounded-lg overflow-hidden hover:border-purple-500 transition group flex flex-col h-full">
              {event.imageUrl && (
                <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23374151" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="%239CA3AF" text-anchor="middle" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <h3 className="text-xl font-bold text-purple-400 flex-1">{event.title}</h3>
                  <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded whitespace-nowrap">
                    {event.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                  <span>📅 {new Date(event.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                  <span>🕐 {event.time}</span>
                </div>
                
                <p className="text-slate-300 line-clamp-3 mb-6 flex-grow">{event.description}</p>
                
                {/* --- BUTTON RENDERED IF LINK EXISTS --- */}
                {event.link && (
                  <a 
                    href={event.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-auto block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
                  >
                    Register / View Details
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default EventsSection;