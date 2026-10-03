import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Phone, Instagram, ArrowLeft, Briefcase, GraduationCap } from 'lucide-react';
import Header from '../components/HeaderSection';
import Footer from '../components/Footer';

const LeadProfile = () => {
  const { roleSlug } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  // Slugify helper to match the URL parameter
  const slugify = (text) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const q = query(collection(db, 'leads'));
        const snapshot = await getDocs(q);
        
        let foundLead = null;
        for (const doc of snapshot.docs) {
          const data = doc.data();
          if (data.status === 'active' && data.role && slugify(data.role) === roleSlug) {
            foundLead = { id: doc.id, ...data };
            break;
          }
        }
        
        setLead(foundLead);
      } catch (err) {
        console.error("Error fetching lead profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [roleSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Header isVisible={true} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-purple-400 text-xl font-semibold animate-pulse">Loading Profile...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Header isVisible={true} />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">Profile Not Found</h2>
          <p className="text-slate-400 mb-8">The requested lead profile could not be found or is no longer active.</p>
          <Link to="/" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-all">
            Return to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Header isVisible={true} />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-purple-400 transition-colors mb-8 font-medium">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Team
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl relative"
          >
            {/* Top Banner Gradient */}
            <div className="h-48 w-full bg-gradient-to-r from-purple-900 via-slate-800 to-pink-900 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            </div>

            <div className="px-8 pb-12 relative">
              {/* Profile Picture */}
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-end -mt-24 mb-8">
                <div className="w-48 h-48 rounded-full border-8 border-slate-900 bg-slate-800 flex-shrink-0 shadow-2xl overflow-hidden relative z-10">
                  {lead.imageUrl ? (
                    <img src={lead.imageUrl} alt={lead.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-slate-600 font-bold uppercase">
                      {lead.name ? lead.name.charAt(0) : '?'}
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left flex-grow pb-2">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{lead.name}</h1>
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/50 text-purple-300 font-semibold tracking-wide uppercase shadow-inner text-sm mb-4 md:mb-0">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {lead.role}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Left Col: Contact & Socials */}
                <div className="md:col-span-1 space-y-8">
                  
                  {lead.department && (
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5">
                      <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center">
                        <GraduationCap className="w-4 h-4 mr-2" /> Education
                      </h3>
                      <p className="text-white font-medium">{lead.department}</p>
                    </div>
                  )}

                  <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5">
                    <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">Connect</h3>
                    <div className="flex flex-col space-y-4">
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className="flex items-center text-slate-300 hover:text-red-400 transition-colors group">
                          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center mr-4 group-hover:bg-red-400/20">
                            <Mail className="w-5 h-5" />
                          </div>
                          <span className="truncate">{lead.email}</span>
                        </a>
                      )}
                      {lead.linkedin && (
                        <a href={lead.linkedin} target="_blank" rel="noreferrer" className="flex items-center text-slate-300 hover:text-blue-500 transition-colors group">
                          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center mr-4 group-hover:bg-blue-500/20">
                            <Linkedin className="w-5 h-5" />
                          </div>
                          <span className="truncate">LinkedIn Profile</span>
                        </a>
                      )}
                      {lead.instagram && (
                        <a href={`https://instagram.com/${lead.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center text-slate-300 hover:text-pink-500 transition-colors group">
                          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center mr-4 group-hover:bg-pink-500/20">
                            <Instagram className="w-5 h-5" />
                          </div>
                          <span className="truncate">{lead.instagram}</span>
                        </a>
                      )}
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="flex items-center text-slate-300 hover:text-green-400 transition-colors group">
                          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center mr-4 group-hover:bg-green-400/20">
                            <Phone className="w-5 h-5" />
                          </div>
                          <span className="truncate">{lead.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Col: Bio & Details */}
                <div className="md:col-span-2 space-y-8">
                  <div className="bg-slate-800/50 rounded-2xl p-8 border border-white/5 h-full">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-4">About</h3>
                    {lead.bio ? (
                      <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {lead.bio}
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">This lead hasn't added a bio yet.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LeadProfile;
