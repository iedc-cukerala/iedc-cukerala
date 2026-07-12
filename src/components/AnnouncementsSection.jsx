import React from 'react';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { motion } from 'framer-motion';
import { Bell, Calendar as CalendarIcon, ArrowUpRight } from 'lucide-react';

const AnnouncementsSection = () => {
  const { announcements, loading } = useAnnouncements();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <section className="py-24 border-b border-slate-200 bg-white relative overflow-hidden">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-12 text-center">Announcements</h2>
        <div className="flex justify-center items-center h-32">
           <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 border-b border-slate-200 bg-white relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-4 tracking-widest uppercase shadow-sm"
          >
            Stay Updated
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight"
          >
            Announcements
          </motion.h2>
        </div>

        {announcements.length === 0 ? (
          <div className="text-center text-slate-500 py-12 bg-slate-50 rounded-3xl border border-slate-100 max-w-3xl mx-auto">
            <Bell className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-medium">No announcements at the moment. Check back soon!</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          >
            {announcements.map((announcement, idx) => (
              <motion.div 
                key={announcement.id} 
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.01 }}
                className={`group relative bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.1)] transition-all duration-300 flex flex-col gap-4 overflow-hidden ${
                  idx === 0 && announcements.length % 2 !== 0 ? 'md:col-span-2 md:flex-row md:items-center' : ''
                }`}
              >
                {/* Accent Side Line (Animated on hover) */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-indigo-600 transform scale-y-0 origin-top group-hover:scale-y-100 transition-transform duration-500"></div>

                <div className="flex-shrink-0">
                   <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-blue-100 group-hover:border-blue-500">
                      <Bell className="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-300" />
                   </div>
                </div>

                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {announcement.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-500/80 mb-4 uppercase tracking-wider">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(announcement.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <p className="text-slate-600 leading-relaxed font-['Poppins'] text-[15px]">
                    {announcement.description}
                  </p>
                </div>
                
                {/* Floating Action Arrow */}
                <div className="absolute top-6 right-6 opacity-0 translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-blue-500">
                   <ArrowUpRight className="w-6 h-6" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AnnouncementsSection;