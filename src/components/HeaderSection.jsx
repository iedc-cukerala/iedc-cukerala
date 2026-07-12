import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Header = ({ isVisible }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // --- ADDED PAST EVENTS HERE ---
    const navLinks = [
        { name: 'Home', href: '#hero-image-section' },
        { name: 'Announcements', href: '#announcements' },
        { name: 'About', href: '#about' },
        { name: 'Events', href: '#events' },
        { name: 'Past Events', href: '#past-events' }, 
        { name: 'Team', href: '#team' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <>
            <motion.header 
                id="header" 
                className="bg-white/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 border-b border-slate-200 flex"
                animate={{ 
                    y: isVisible ? 0 : -100,
                    opacity: isVisible ? 1 : 0 
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    
                    <a href="#" className="text-3xl font-bold text-slate-900 z-10 flex items-center">
                        <img src="./iedc_logo.png" alt="IEDC Logo" className="inline-block h-10 mr-3" />
                        IEDC <span className="gradient-text ml-2 mr-3">CUK</span>
                        <div className="hidden sm:flex items-center justify-center w-14 h-14 bg-white rounded-full ml-2 p-0.5 shadow-lg border border-slate-200 overflow-hidden">
                            <img src="https://www.cukerala.ac.in/assets/img/CUKLOGO.png" alt="CUK Logo" className="w-full h-full object-contain transform scale-110" />
                        </div>
                    </a>
                    
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-4">
                            <nav className="flex items-center space-x-6 text-slate-600">
                                {navLinks.map(link => (
                                    <a key={link.name} href={link.href} className="hover:text-slate-900 transition-colors duration-300">{link.name}</a>
                                ))}
                            </nav>
                            <a href="/admin/login" className="gradient-button text-white font-semibold px-5 py-2 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
                                Admin & Lead Login
                            </a>
                        </div>

                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(true)} className="text-slate-900">
                                <Menu />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden fixed inset-0 bg-white bg-opacity-95 z-50 flex flex-col items-center justify-center"
                    >
                        <button 
                            onClick={() => setIsMenuOpen(false)} 
                            className="absolute top-6 right-6 text-slate-900"
                        >
                            <X size={28} />
                        </button>
                        <nav className="flex flex-col items-center space-y-6">
                            {navLinks.map(link => (
                                <a 
                                    key={link.name} 
                                    href={link.href} 
                                    className="text-2xl text-slate-600 hover:text-slate-900 transition-colors duration-300" 
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>
                        <div className="pt-8">
                            <a 
                                href="/admin/login" 
                                className="gradient-button text-white font-semibold px-8 py-3 rounded-lg shadow-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Admin & Lead Login
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;