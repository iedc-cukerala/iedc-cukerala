import React, { useState } from 'react';
import { usePastEvents } from '../hooks/usePastEvents';

const PastEventsSection = () => {
  const { pastEvents, loading } = usePastEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (loading) return null; // Don't show anything while loading
  if (pastEvents.length === 0) return null; // Hide section if no past events

  return (
    <section className="py-20 border-b border-slate-800">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-pink-900/30 border border-pink-500/30 text-pink-300 text-sm font-semibold mb-4 tracking-wide uppercase">
          Our Legacy
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
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
            {/* CHANGED: 4:3 Aspect Ratio for consistent thumbnail sizing */}
            <div className="aspect-[4/3] w-full overflow-hidden">
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

      {/* --- POPUP MODAL (Kept exactly the same) --- */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <div 
            className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Left Column: Image */}
            <div className="w-full md:w-1/2 bg-slate-950 flex items-center justify-center p-4">
              <img src={selectedEvent.imageUrl} alt="Cover" className="max-w-full max-h-[40vh] md:max-h-full object-contain rounded-lg shadow-lg" />
            </div>
            
            {/* Right Column: Text & Buttons */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
              <h2 className="text-3xl font-bold text-white mb-2">{selectedEvent.title}</h2>
              <p className="text-slate-400 mb-6">📅 Conducted on: {selectedEvent.date}</p>
              
              <div className="text-slate-300 mb-8 whitespace-pre-line leading-relaxed flex-grow overflow-y-auto pr-2">
                {selectedEvent.description}
              </div>
              
              <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-slate-800">
                {selectedEvent.link && (
                  <a 
                    href={selectedEvent.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white text-center font-bold py-3 rounded-lg hover:bg-blue-500 transition shadow-lg"
                  >
                    📸 View Full Photo Gallery
                  </a>
                )}
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="w-full py-3 bg-slate-800 text-slate-300 font-bold rounded-lg hover:bg-slate-700 transition"
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