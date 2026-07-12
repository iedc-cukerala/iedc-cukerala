import React, { useState } from 'react';
import { usePastEvents } from '../hooks/usePastEvents';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, CheckCircle2, X, Image as ImageIcon } from 'lucide-react';

const PastEventsSection = () => {
  const { pastEvents, loading } = usePastEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const validPastEvents = pastEvents.filter(event => event.title && event.title.trim() !== '');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <section className="py-32 bg-transparent relative">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e1b4b] mb-12 text-center">Past Events</h2>
        <div className="flex justify-center items-center h-48">
           <div className="w-12 h-12 border-4 border-white border-t-pink-600 rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  // Removed early return null so the section remains visible

  return (
    <section className="py-32 bg-transparent relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-bold mb-6 tracking-widest uppercase shadow-sm"
          >
            Our Legacy
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e1b4b] tracking-tight mb-4"
          >
            Past <span className="gradient-text">Events</span>
          </motion.h2>
        </div>

        {validPastEvents.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white/50 backdrop-blur-md rounded-[2rem] border border-white/50 shadow-sm max-w-2xl mx-auto"
          >
            <Calendar className="w-16 h-16 text-blue-300 mx-auto mb-4" />
            <p className="text-[#1e1b4b] text-xl font-medium">No past events yet.</p>
            <p className="text-[#1e1b4b]/60 mt-2">Check back soon for updates on our past successes!</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {validPastEvents.map(event => (
              <motion.div 
                key={event.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedEvent(event)}
                className="group relative bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-slate-200 hover:shadow-[0_20px_50px_-15px_rgba(0,242,254,0.4)] transition-all duration-500 flex flex-col h-full cursor-pointer hover-lift"
              >
                <div className="relative h-72 overflow-hidden bg-slate-100 shrink-0">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f8fafc" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="%23cbd5e1" text-anchor="middle" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <Calendar className="w-16 h-16 text-slate-300" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b]/95 via-[#1e1b4b]/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-green-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 z-10 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                     <h3 className="text-2xl font-bold mb-3 leading-tight text-white shadow-sm">{event.title}</h3>
                     <div className="flex items-center gap-4 text-sm font-medium text-pink-200">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}</span>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()} 
            >
              <div className="relative h-64 sm:h-80 shrink-0">
                <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    {selectedEvent.category || 'Event'}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <h2 className="text-3xl font-extrabold text-[#1e1b4b] mb-3">{selectedEvent.title}</h2>
                <p className="text-pink-600 font-semibold mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> 
                  Conducted on: {new Date(selectedEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-slate-600 mb-8 whitespace-pre-line leading-relaxed font-['Poppins'] text-lg">
                  {selectedEvent.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  {selectedEvent.link && (
                    <a 
                      href={selectedEvent.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2 group"
                    >
                      <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      View Full Photo Gallery
                    </a>
                  )}
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="px-8 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PastEventsSection;