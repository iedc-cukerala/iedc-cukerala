import React from 'react';
import { useEvents } from '../hooks/useEvents';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const EventsSection = () => {
  const { events, loading } = useEvents();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <section className="py-24 border-b border-slate-200 bg-white relative">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-12 text-center">Upcoming Events</h2>
        <div className="flex justify-center items-center h-48">
           <div className="w-12 h-12 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 border-b border-slate-200 bg-white relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold mb-4 tracking-widest uppercase shadow-sm"
          >
            What's Next
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight"
          >
            Upcoming Events
          </motion.h2>
        </div>

        {events.length === 0 ? (
          <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-lg font-medium">No upcoming events. Check back soon for exciting opportunities!</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {events.map(event => (
              <motion.div 
                key={event.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(147,51,234,0.1)] hover:border-purple-200 transition-all duration-500 flex flex-col h-full cursor-pointer"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden bg-slate-100 shrink-0">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f8fafc" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="20" fill="%23cbd5e1" text-anchor="middle" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                        <Calendar className="w-16 h-16 text-slate-200" />
                    </div>
                  )}
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                  
                  {/* Floating Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                      {event.category || 'Event'}
                    </span>
                  </div>

                  {/* Absolute Date Info on Image */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                     <h3 className="text-2xl font-bold mb-2 leading-tight text-white shadow-sm">{event.title}</h3>
                     <div className="flex items-center gap-4 text-sm font-medium text-white/90">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {event.time}</span>
                     </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow bg-white relative z-20">
                  <p className="text-slate-600 line-clamp-3 mb-6 flex-grow font-['Poppins'] leading-relaxed">{event.description}</p>
                  
                  {event.link && (
                    <a 
                      href={event.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-2 text-purple-600 font-bold hover:text-pink-600 transition-colors group/btn"
                    >
                      Register Now
                      <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;