import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { Linkedin, Mail, Phone, ExternalLink } from "lucide-react";

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const q = query(collection(db, "leads"), where("status", "==", "active"));
        const snapshot = await getDocs(q);
        const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const roleOrder = [
          "Nodal Officer",
          "Co-Nodal Officer",
          "Student Lead I",
          "Student Lead II",
          "Technology Lead",
          "Women Innovation Lead",
          "Community Lead",
          "Finance Lead",
          "Research & IPR Lead",
          "Branding & Marketing",
          "Quality & Operation Lead",
          "Creativity & Innovation Lead"
        ];

        members.sort((a, b) => {
          const indexA = roleOrder.indexOf(a.role);
          const indexB = roleOrder.indexOf(b.role);
          const posA = indexA === -1 ? 999 : indexA;
          const posB = indexB === -1 ? 999 : indexB;
          return posA - posB;
        });

        setTeamMembers(members);
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <section id="team" className="py-24 bg-slate-50 border-b border-slate-200">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-12 text-center">Meet the Team</h2>
        <div className="flex justify-center items-center h-48">
           <div className="w-12 h-12 border-4 border-slate-200 border-t-teal-600 rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="py-32 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full filter blur-[100px] mix-blend-multiply pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold mb-6 tracking-widest uppercase shadow-sm"
          >
            Our People
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight"
          >
            Meet the Team
          </motion.h2>
        </div>

        {teamMembers.length === 0 ? (
          <div className="text-center text-slate-500">No active team members found.</div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(13,148,136,0.1)] hover:border-teal-200 transition-all duration-500 flex flex-col items-center pt-10 pb-8 px-6 overflow-hidden"
              >
                {/* Accent Background on Hover */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-teal-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative w-36 h-36 rounded-full mb-6 z-10">
                  {/* Floating Outline */}
                  <div className="absolute -inset-2 rounded-full border border-teal-200/0 group-hover:border-teal-200 scale-90 group-hover:scale-100 transition-all duration-500"></div>
                  
                  <div className="w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 relative z-10">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23f8fafc" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="40" fill="%23cbd5e1" text-anchor="middle" dy=".3em"%3E%3F%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-slate-300 font-bold uppercase bg-slate-50">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  {/* Social Icons (Reveal on Hover) */}
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 z-20 delay-100">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 hover:scale-110 transition-all">
                        <Linkedin size={14} fill="currentColor" />
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:bg-rose-600 hover:scale-110 transition-all">
                        <Mail size={14} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="relative z-10 text-center w-full">
                  <h3 className="text-xl font-bold text-slate-900 mb-1 leading-tight group-hover:text-teal-700 transition-colors">{member.name}</h3>
                  <p className="text-sm font-semibold text-teal-600/90 uppercase tracking-wider mb-4 font-['Poppins']">{member.role}</p>
                </div>
                
                {/* Decorative Bottom Line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-teal-200 rounded-t-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"></div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
