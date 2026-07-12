import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { Linkedin, Mail, Phone } from "lucide-react";

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
      <section id="team" className="py-32 bg-transparent relative">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e1b4b] mb-12 text-center">Meet the Team</h2>
        <div className="flex justify-center items-center h-48">
           <div className="w-12 h-12 border-4 border-white border-t-[#00f2fe] rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="team" className="py-32 bg-transparent relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-600 text-sm font-bold mb-6 tracking-widest uppercase shadow-sm"
          >
            Our People
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e1b4b] tracking-tight"
          >
            Meet the <span className="gradient-text">Team</span>
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
                whileHover={{ y: -5 }}
                className="group bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm hover:shadow-[0_20px_40px_rgba(0,242,254,0.3)] transition-all duration-300 flex flex-col items-center p-8 hover-lift"
              >
                <div className="w-32 h-32 rounded-full mb-6 border-4 border-white shadow-lg overflow-hidden bg-slate-100 relative">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23f8fafc" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="40" fill="%23cbd5e1" text-anchor="middle" dy=".3em"%3E%3F%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-slate-400 font-bold uppercase bg-slate-50">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="text-center w-full mb-4">
                  <h3 className="text-xl font-bold text-[#1e1b4b] mb-1">{member.name}</h3>
                  <p className="text-sm font-bold text-pink-600 uppercase tracking-wider">{member.role}</p>
                </div>
                
                {/* Always visible Social Icons including Phone */}
                <div className="flex items-center gap-4 mt-auto">
                  {member.phone && (
                    <a href={`tel:${member.phone}`} title={`Call ${member.phone}`} className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-green-100 hover:text-green-600 transition-colors">
                      <Phone size={16} />
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} title={`Email ${member.email}`} className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors">
                      <Mail size={16} />
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors">
                      <Linkedin size={16} fill="currentColor" />
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

export default TeamSection;
