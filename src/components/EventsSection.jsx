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
      <section className="py-32 bg-transparent">
        <div className="container mx-auto px-6">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-6 bg-slate-200 rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="h-64 bg-slate-200 rounded-3xl"></div>
                  <div className="h-64 bg-slate-200 rounded-3xl"></div>
                  <div className="h-64 bg-slate-200 rounded-3xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-32 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-pink-100 border border-pink-200 text-pink-600 text-sm font-bold mb-6 tracking-widest uppercase shadow-sm"
            >
              What's Happening
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e1b4b] tracking-tight mb-4"
            >
              Upcoming <span className="gradient-text text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-600">Events</span>
            </motion.h2>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center text-slate-500 py-12 bg-white rounded-3xl border border-slate-200 shadow-xl">
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
                className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-15px_rgba(236,72,153,0.3)] transition-all duration-500 flex flex-col h-[450px]"
              >
                {/* Image Section */}
                <div className="absolute inset-0 z-0">
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
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <Calendar className="w-16 h-16 text-slate-300" />
                    </div>
                  )}
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b]/95 via-[#1e1b4b]/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 p-8 flex flex-col justify-end h-full transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-4 py-1.5 bg-pink-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                      {event.category || 'Event'}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-pink-300 transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-white/80 line-clamp-2 text-sm mb-6 font-['Poppins']">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between text-white/90 text-sm font-semibold border-t border-white/20 pt-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-pink-400" /> {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-pink-400" /> {event.time}</span>
                    </div>
                    
                    {event.link && (
                      <a 
                        href={event.link}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 bg-white/20 hover:bg-pink-500 rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                      >
                        <ArrowRight className="w-5 h-5 text-white" />
                      </a>
                    )}
                  </div>
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