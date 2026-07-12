import React, { useState } from 'react';
import { useContact } from '../hooks/useContact';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Twitter, Mail, Phone } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const ContactSection = () => {
    const { submitContactForm, loading, success, error } = useContact();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isSuccess = await submitContactForm(formData);
        if (isSuccess) {
            setFormData({ name: '', email: '', phone: '', message: '' });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <AnimatedSection id="contact">
            <div className="container mx-auto px-6 max-w-5xl lg:max-w-6xl pt-8">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Form Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className="glass-card bg-white/60 backdrop-blur-xl border border-white p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(255,0,127,0.1)] relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ff007f] to-[#ff9933] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Your Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-white text-slate-900 p-3.5 rounded-lg border border-slate-200 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-400 shadow-sm" placeholder="John Doe" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Your Email *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-white text-slate-900 pl-10 p-3.5 rounded-lg border border-slate-200 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-400 shadow-sm" placeholder="john@example.com" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Your Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Phone className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white text-slate-900 pl-10 p-3.5 rounded-lg border border-slate-200 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-400 shadow-sm" placeholder="+91 98765 43210" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Your Message *</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" className="w-full bg-white text-slate-900 p-3.5 rounded-lg border border-slate-200 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-400 custom-scrollbar shadow-sm" placeholder="How can we help you?"></textarea>
                            </div>

                            {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
                            {success && <p className="text-emerald-400 text-sm font-medium p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-center">✅ Message sent successfully! We'll get back to you soon.</p>}

                            <button type="submit" disabled={loading} className="w-full gradient-button text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(255,0,127,0.3)] hover:shadow-[0_15px_30px_rgba(255,94,98,0.5)] disabled:opacity-50 flex justify-center items-center gap-2">
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </motion.div>

                    {/* Socials & Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center md:items-start space-y-8"
                    >
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1e1b4b] mb-4 tracking-tight">Get <span className="gradient-text">Involved!</span></h2>
                            <p className="text-[#1e1b4b]/80 text-lg mb-8 font-['Poppins']">
                                Have an idea? Want to join our team? Or just curious? We'd love to hear from you. Fill out the form or follow us on our social channels!
                            </p>
                        </div>
                        
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-bold text-[#1e1b4b] mb-2">Connect With Us</h3>
                            <p className="text-[#1e1b4b]/70 font-['Poppins']">Follow us on our social media channels to stay updated with our latest events and announcements.</p>
                        </div>
                        
                        <div className="flex justify-center md:justify-start space-x-6">
                            <a href='http://www.instagram.com/iedc_cuk' target="_blank" rel="noreferrer" className="w-16 h-16 bg-white/60 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#ff007f] hover:bg-white border border-white hover:border-pink-300 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-[0_10px_25px_rgba(255,0,127,0.3)]">
                                <Instagram size={28} />
                            </a>
                            <a href='https://www.linkedin.com/in/iedc-cuk-56b73b259/' target="_blank" rel="noreferrer" className="w-16 h-16 bg-white/60 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#00f2fe] hover:bg-white border border-white hover:border-cyan-300 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-[0_10px_25px_rgba(0,242,254,0.3)]">
                                <Linkedin size={28} />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatedSection>
    );
};

export default ContactSection;