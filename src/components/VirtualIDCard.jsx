import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

const VirtualIDCard = forwardRef(({ lead }, ref) => {
  if (!lead) return null;

  // Slugify role for the URL
  const slugify = (text) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  };

  const profileUrl = `https://iedc-cuk.web.app/lead/${slugify(lead.role || 'lead')}`;

  return (
    <div ref={ref} className="w-[400px] h-[600px] bg-slate-900 rounded-3xl relative overflow-hidden flex flex-col font-sans" style={{ border: '2px solid rgba(168, 85, 247, 0.3)' }}>
      {/* Decorative Gradients for Modern Look */}
      <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-purple-600 rounded-full mix-blend-screen filter blur-[80px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[250px] h-[250px] bg-teal-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40"></div>
      
      {/* Header with Logos */}
      <div className="relative z-10 flex justify-between items-center w-full px-8 pt-8">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-1 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          <img src="/iedc_logo.png" alt="IEDC" className="w-full h-full object-contain" />
        </div>
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-1 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          <img src="https://www.cukerala.ac.in/assets/img/CUKLOGO.png" alt="CUK" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center flex-grow mt-6 px-6">
        <div className="w-36 h-36 rounded-full border-4 border-purple-500/50 p-1 mb-6 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          <div className="w-full h-full rounded-full overflow-hidden bg-slate-800">
            {lead.imageUrl ? (
              <img src={lead.imageUrl} alt={lead.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-slate-600 font-bold uppercase">
                {lead.name ? lead.name.charAt(0) : '?'}
              </div>
            )}
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 text-center uppercase tracking-wider mb-2">
          {lead.name || 'Lead Name'}
        </h2>
        
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/50 text-purple-300 text-sm font-semibold tracking-wide uppercase shadow-inner">
          {lead.role || 'Designation'}
        </div>

        {lead.department && (
          <p className="text-slate-300 text-center mt-3 font-medium tracking-wide">
            {lead.department}
          </p>
        )}
      </div>

      {/* Footer Area with QR */}
      <div className="relative z-10 mt-auto w-full bg-slate-950/80 backdrop-blur-md border-t border-slate-700/50 p-6 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-semibold tracking-widest uppercase mb-1">Scan to Verify</span>
          <span className="text-[10px] text-slate-500 max-w-[150px]">View official sub-profile and credentials.</span>
        </div>
        <div className="bg-white p-2 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <QRCodeSVG value={profileUrl} size={80} level="H" />
        </div>
      </div>
    </div>
  );
});

VirtualIDCard.displayName = 'VirtualIDCard';
export default VirtualIDCard;
