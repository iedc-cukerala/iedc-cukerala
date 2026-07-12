import React, { useState } from 'react';
import { useTeam } from '../../hooks/useTeam';
import { Mail, User, Users, Shield, UserPlus, XCircle, CheckCircle2, Clock, Trash2 } from 'lucide-react';

const ManageTeam = () => {
  const { leads, inviteLead, revokeLead } = useTeam();
  const [formData, setFormData] = useState({ name: '', role: '', email: '' });
  const [isSending, setIsSending] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      // 1. Save to Firebase as 'pending'
      await inviteLead(formData);

      // 2. Trigger Email (We will connect EmailJS here later!)
      console.log(`✉️ Simulated Email sent to ${formData.email} with setup link.`);
      
      setFormData({ name: '', role: '', email: '' });
      alert("Lead invited successfully!");
    } catch (error) {
      console.error("Error inviting lead:", error);
      alert("Failed to invite lead.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
      {/* Invite Form */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 mb-1">
            <UserPlus className="text-teal-600 w-6 h-6" />
            Invite New Lead
          </h2>
          <p className="text-slate-600 text-sm">Send an onboarding invite to a new team member.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <input 
                type="text" name="name" placeholder="e.g., John Doe" 
                value={formData.name} onChange={handleInputChange} 
                className="w-full bg-slate-50 text-slate-900 pl-10 p-3 rounded-lg border border-slate-200 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-slate-400" required 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Role / Designation</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-slate-500" />
              </div>
              <input 
                type="text" name="role" placeholder="e.g., AI Lead" 
                value={formData.role} onChange={handleInputChange} 
                className="w-full bg-slate-50 text-slate-900 pl-10 p-3 rounded-lg border border-slate-200 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-slate-400" required 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input 
                type="email" name="email" placeholder="contact@example.com" 
                value={formData.email} onChange={handleInputChange} 
                className="w-full bg-slate-50 text-slate-900 pl-10 p-3 rounded-lg border border-slate-200 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all placeholder:text-slate-400" required 
              />
            </div>
          </div>

          <button 
            type="submit" disabled={isSending}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
          >
            {isSending ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...</>
            ) : 'Send Setup Invite'}
          </button>
        </form>
      </div>

      {/* Roster & Kill Switch */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 mb-1">
            <Users className="text-teal-600 w-6 h-6" />
            Team Roster
          </h2>
          <p className="text-slate-600 text-sm">Manage existing leads and revoke access if necessary.</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm min-h-[400px]">
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                <Users className="w-12 h-12 mb-3 opacity-20" />
                <p>No leads invited yet.</p>
              </div>
            ) : (
              leads.map(lead => (
                <div key={lead.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center group hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                      {lead.imageUrl ? (
                        <img src={lead.imageUrl} alt={lead.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">{lead.name}</h3>
                      <p className="text-xs text-teal-600 font-semibold mb-1">{lead.role}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {lead.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {/* Status Badge */}
                    <div>
                      {lead.status === 'pending' ? (
                        <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-[10px] px-2 py-1 rounded-full border border-yellow-200 uppercase tracking-wider font-bold">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-green-100 text-emerald-700 text-[10px] px-2 py-1 rounded-full border border-green-200 uppercase tracking-wider font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                    
                    {/* The Kill Switch */}
                    <button 
                      onClick={() => {
                        if(window.confirm(`Are you sure you want to permanently revoke access for ${lead.name}?`)) {
                          revokeLead(lead.id);
                        }
                      }} 
                      className="flex items-center gap-1 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-200 hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Revoke
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTeam;