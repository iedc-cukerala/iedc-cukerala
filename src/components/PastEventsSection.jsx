import React, { useState } from 'react';
import { usePastEvents } from '../hooks/usePastEvents';

const PastEventsSection = () => {
  const { pastEvents, loading } = usePastEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (loading) return null; // Don't show anything while loading
  if (pastEvents.length === 0) return null; // Hide section if no past events

  return (
    <section className="py-20 border-b border-slate-200">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-sm font-semibold mb-4 tracking-wide uppercase">
          Our Legacy
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900">
          Past Events & Gallery
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
        {pastEvents.map(event => (
          <div 
            key={event.id} 
            onClick={() => setSelectedEvent(event)}
            className="w-full md:w-[calc(50%-2rem)] max-w-xl group relative overflow-hidden rounded-2xl glass-card cursor-pointer hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
          >
            {/* CHANGED: Increased image height to h-72 (much taller!) */}
            <div className="h-72 overflow-hidden">
              <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90"></div>
            </div>
            
            <div className="absolute bottom-0 left-0 p-6 w-full">
              {/* CHANGED: Made the text larger (text-2xl) */}
              <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
              <p className="text-base text-blue-300 font-semibold">📅 {event.date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- POPUP MODAL --- */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <div 
            className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()} 
          >
            <img src={selectedEvent.imageUrl} alt="Cover" className="w-full h-72 object-cover" />
            <div className="p-6 md:p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{selectedEvent.title}</h2>
              <p className="text-slate-500 mb-6">📅 Conducted on: {selectedEvent.date}</p>
              <p className="text-slate-600 mb-8 whitespace-pre-line leading-relaxed">{selectedEvent.description}</p>
              
              <div className="flex gap-4">
                <a 
                  href={selectedEvent.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white text-center font-bold py-3 rounded-lg hover:bg-blue-500 transition shadow-lg"
                >
                  📸 View Full Photo Gallery
                </a>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="px-6 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PastEventsSection;