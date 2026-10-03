import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const VirtualIDCard = forwardRef(({ lead }, ref) => {
  if (!lead) return null;

  // Slugify role for the URL
  const slugify = (text) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const profileUrl = `https://iedc-cuk.web.app/lead/${slugify(lead.role || 'lead')}`;
  
  // Generate a pseudo-ID based on their email or name
  const generateId = () => {
    const str = lead.email || lead.name || 'IEDC';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; 
    }
    const positiveHash = Math.abs(hash).toString().padStart(6, '0').substring(0, 6);
    return `CUK-${new Date().getFullYear()}-${positiveHash}`;
  };

  return (
    <div 
      ref={ref} 
      className="w-[420px] h-[660px] relative overflow-hidden flex flex-col font-sans text-white bg-slate-900"
      style={{ 
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255,255,255,0.1)'
      }}
    >
      {/* Background with modern gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-0"></div>
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-20%] w-[400px] h-[400px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[80px] z-0"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[350px] h-[350px] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[80px] z-0"></div>
      
      {/* Glass Overlay Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] z-0"></div>

      {/* Header Bar */}
      <div className="relative z-10 bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-md border-b border-white/10 p-5 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1 shadow-md">
            <img src="/iedc_logo.png" alt="IEDC" className="w-full h-full object-contain" crossOrigin="anonymous" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-widest text-white leading-tight">IEDC CUK</h1>
            <p className="text-[10px] font-semibold text-purple-200 tracking-wider uppercase">Innovation & Entrepreneurship</p>
          </div>
        </div>
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1 shadow-md">
          <img src="/CUKLOGO.png" alt="CUK" className="w-full h-full object-contain" crossOrigin="anonymous" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center flex-grow pt-8 px-6">
        
        {/* Photo Container with Hex/Tech Border */}
        <div className="relative mb-6 group">
          <div className="absolute inset-[-4px] bg-gradient-to-b from-purple-500 to-blue-500 rounded-2xl opacity-70 blur-sm"></div>
          <div className="absolute inset-[-1px] bg-gradient-to-b from-purple-400 to-blue-400 rounded-2xl"></div>
          <div className="relative w-40 h-44 rounded-2xl overflow-hidden bg-slate-800 shadow-2xl">
            {lead.imageUrl ? (
              <img src={lead.imageUrl} alt={lead.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl text-slate-600 font-black uppercase">
                {lead.name ? lead.name.charAt(0) : '?'}
              </div>
            )}
          </div>
        </div>

        {/* Lead Details */}
        <div className="text-center w-full bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-4 shadow-inner mb-4">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 uppercase tracking-wide mb-1">
            {lead.name || 'Lead Name'}
          </h2>
          
          <div className="inline-block px-4 py-1.5 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold tracking-widest uppercase shadow-md mb-3">
            {lead.role || 'Designation'}
          </div>

          <div className="flex flex-col gap-1.5 mt-2 text-[11px] font-medium tracking-wide text-slate-300">
            {lead.department && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-purple-400">DEPT:</span> {lead.department}
              </div>
            )}
            {lead.email && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-blue-400">MAIL:</span> {lead.email}
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-pink-400">TEL:</span> {lead.phone}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer Area with QR & Member ID */}
      <div className="relative z-10 w-full bg-gradient-to-b from-slate-900/50 to-slate-950 backdrop-blur-md border-t border-white/10 p-5 flex items-center justify-between">
        
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1">Official ID</span>
          <span className="text-sm text-white font-mono font-bold tracking-widest bg-slate-800/80 px-2 py-1 rounded border border-white/5 inline-block w-max">
            {generateId()}
          </span>
          <span className="text-[9px] text-slate-500 mt-2 max-w-[160px] leading-tight">
            Scan QR code to verify authenticity on official IEDC CUK portal.
          </span>
        </div>

        <div className="bg-white p-2.5 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.15)] transform hover:scale-105 transition-transform">
          <QRCodeSVG value={profileUrl} size={70} level="H" />
        </div>

      </div>
    </div>
  );
});

VirtualIDCard.displayName = 'VirtualIDCard';
export default VirtualIDCard;
