import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../config/firebase";
import { Linkedin, Mail, Phone } from "lucide-react";

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        // Fetch only active leads
        const q = query(collection(db, "leads"), where("status", "==", "active"));
        const snapshot = await getDocs(q);
        const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Define exact sorting order for roles
        const roleOrder = [
          "nodal officer",
          "co-nodal officer",
          "conodal officer",
          "co nodal officer",
          "student lead i",
          "student lead ii",
          "technology lead",
          "women innovation lead",
          "community lead",
          "finance lead",
          "research & ipr lead",
          "branding & marketing",
          "quality & operation lead",
          "creativity & innovation lead"
        ];

        members.sort((a, b) => {
          const roleA = a.role ? a.role.toLowerCase().trim() : "";
          const roleB = b.role ? b.role.toLowerCase().trim() : "";
          
          let indexA = roleOrder.indexOf(roleA);
          let indexB = roleOrder.indexOf(roleB);
          
          // Unknown roles go to the bottom
          const posA = indexA === -1 ? 999 : indexA;
          const posB = indexB === -1 ? 999 : indexB;
          
          if (posA !== posB) {
            return posA - posB;
          }
          // If roles are same or both unknown, sort by name
          const nameA = a.name ? a.name.toLowerCase() : "";
          const nameB = b.name ? b.name.toLowerCase() : "";
          return nameA.localeCompare(nameB);
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

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section id="team" className="py-20 bg-slate-950">
      <div className="container mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-teal-900/30 border border-teal-500/30 text-teal-300 text-sm font-semibold mb-4 tracking-wide uppercase">
            Our People
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Meet the Team
          </h2>
        </div>

        {loading ? (
          <div className="text-center text-slate-400">Loading team members...</div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center text-slate-400">No active team members found.</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                className="group relative w-full sm:w-[calc(50%-2rem)] lg:w-[calc(25%-2rem)] max-w-[280px]"
              >
                <Link to={`/lead/${(member.role || 'lead').toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '')}`} className="block w-full h-full">
                  <div className="absolute -inset-1 group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-pink-600 rounded-2xl blur opacity-60 transition duration-800"></div>
                  
                  <div className="relative w-full h-full bg-slate-900 rounded-2xl text-center p-6 flex flex-col items-center hover:bg-slate-800 transition-colors duration-300">
                    <div className="w-40 h-40 rounded-full mb-4 border-4 border-slate-700 shadow-lg overflow-hidden transition-transform duration-300 md:group-hover:scale-105 bg-slate-800">
                      {member.imageUrl ? (
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-slate-600 font-bold uppercase">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mt-2 group-hover:text-purple-400 transition-colors">{member.name}</h3>
                    <p className="gradient-text font-semibold font-['Poppins'] mb-4">{member.role}</p>

                    {/* Social Links - prevent default so clicking doesn't trigger Link navigation */}
                    <div className="flex space-x-4 mt-auto relative z-20">
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-slate-400 hover:text-blue-500 transition">
                          <Linkedin size={20} />
                        </a>
                      )}
                      {member.email && (
                        <a href={`mailto:${member.email}`} onClick={(e) => e.stopPropagation()} className="text-slate-400 hover:text-red-400 transition">
                          <Mail size={20} />
                        </a>
                      )}
                      {member.phone && (
                        <a href={`tel:${member.phone}`} onClick={(e) => e.stopPropagation()} className="text-slate-400 hover:text-green-400 transition">
                          <Phone size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
