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

  if (loading) return (
    <section className="py-20 bg-transparent">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center text-slate-500">Loading announcements...</div>
      </div>
    </section>
  );

  if (announcements.length === 0) return null;

  return (
    <section id="announcements" className="py-24 bg-transparent relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-sm font-bold mb-6 tracking-widest uppercase shadow-sm"
          >
            Latest News
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e1b4b] tracking-tight"
          >
            Recent <span className="gradient-text">Announcements</span>
          </motion.h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {announcements.map((announcement) => (
            <motion.div 
              key={announcement.id} 
              variants={itemVariants}
              className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-15px_rgba(255,153,51,0.4)] transition-all duration-500 overflow-hidden hover-lift"
            >
              {/* Left accent border that expands on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-orange-400 to-pink-500 group-hover:w-3 transition-all duration-300 ease-out"></div>
              
              {/* Subtle glowing background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>

              <div className="relative z-10 flex gap-6">
                {/* Icon Box */}
                <div className="hidden sm:flex shrink-0 w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                   <Bell className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-orange-500 mb-3 uppercase tracking-wider">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(announcement.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                  <h3 className="text-2xl font-bold text-[#1e1b4b] mb-3 group-hover:text-orange-600 transition-colors">
                    {announcement.title}
                  </h3>
                  <p className="text-[#1e1b4b]/70 leading-relaxed text-[15px]">
                    {announcement.description}
                  </p>

                  {announcement.link && (
                    <div className="mt-6">
                      <a 
                        href={announcement.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-pink-600 transition-colors group/link"
                      >
                        Read More
                        <ArrowUpRight className="w-5 h-5 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AnnouncementsSection;