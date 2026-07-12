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
        // Fetch only active leads
        const q = query(collection(db, "leads"), where("status", "==", "active"));
        const snapshot = await getDocs(q);
        const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Define exact sorting order for roles
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
          
          // Unknown roles go to the bottom
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

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section id="team" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-teal-100 border border-teal-200 text-teal-700 text-sm font-semibold mb-4 tracking-wide uppercase">
            Our People
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900">
            Meet the Team
          </h2>
        </div>

        {loading ? (
          <div className="text-center text-slate-600">Loading team members...</div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center text-slate-600">No active team members found.</div>
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
                <div className="absolute -inset-1 group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-pink-600 rounded-2xl blur opacity-60 transition duration-800"></div>
                
                <div className="relative w-full h-full bg-white border border-slate-100 shadow-xl rounded-2xl text-center p-6 flex flex-col items-center">
                  <div className="w-40 h-40 rounded-full mb-4 border-4 border-slate-200 shadow-md overflow-hidden transition-transform duration-300 md:group-hover:scale-105 bg-slate-100">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-slate-400 font-bold uppercase">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">{member.name}</h3>
                  <p className="gradient-text font-semibold font-['Poppins'] mb-4">{member.role}</p>

                  {/* Social Links */}
                  <div className="flex space-x-4 mt-auto">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-600 transition">
                        <Linkedin size={20} />
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-slate-500 hover:text-red-500 transition">
                        <Mail size={20} />
                      </a>
                    )}
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="text-slate-500 hover:text-green-600 transition">
                        <Phone size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
