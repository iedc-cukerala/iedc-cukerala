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
                        className="glass-card bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-950/50 text-white p-3.5 rounded-lg border border-slate-700/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-600" placeholder="John Doe" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Email *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-slate-950/50 text-white pl-10 p-3.5 rounded-lg border border-slate-700/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-600" placeholder="john@example.com" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Phone className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-950/50 text-white pl-10 p-3.5 rounded-lg border border-slate-700/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-600" placeholder="+91 98765 43210" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Message *</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" className="w-full bg-slate-950/50 text-white p-3.5 rounded-lg border border-slate-700/50 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-600 custom-scrollbar" placeholder="How can we help you?"></textarea>
                            </div>

                            {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
                            {success && <p className="text-emerald-400 text-sm font-medium p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-center">✅ Message sent successfully! We'll get back to you soon.</p>}

                            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3.5 rounded-lg hover:opacity-90 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 flex justify-center items-center gap-2">
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
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4 tracking-tight">Get Involved!</h2>
                            <p className="text-slate-300 text-lg mb-8">
                                Have an idea? Want to join our team? Or just curious? We'd love to hear from you. Fill out the form or follow us on our social channels!
                            </p>
                        </div>
                        
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-bold text-white mb-2">Connect With Us</h3>
                            <p className="text-slate-400">Follow us on our social media channels to stay updated with our latest events and announcements.</p>
                        </div>
                        
                        <div className="flex space-x-6">
                            <a href='http://www.instagram.com/iedc_cuk' target="_blank" rel="noreferrer" className="w-14 h-14 bg-slate-800/80 rounded-2xl flex items-center justify-center text-slate-400 hover:text-pink-400 hover:bg-slate-800 border border-slate-700 hover:border-pink-500/50 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-pink-500/20">
                                <Instagram size={28} />
                            </a>
                            <a href='https://www.linkedin.com/in/iedc-cuk-56b73b259/' target="_blank" rel="noreferrer" className="w-14 h-14 bg-slate-800/80 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-blue-500/20">
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