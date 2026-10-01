import React from 'react';
import { Instagram, Linkedin, Twitter, Mail, Youtube } from 'lucide-react';

const Footer = () => {
    const navLinks = [
        { name: 'About', href: '#about', external: false },
        { name: 'Events', href: '#events', external: false },
        { name: 'Kerala Startup Mission', href: 'https://startupmission.kerala.gov.in/iedc', external: true },
        { name: 'Central University of Kerala', href: 'https://www.cukerala.ac.in/', external: true },
    ];

    const socialLinks = [
        { icon: <Instagram size={24} />, href: 'http://www.instagram.com/iedc_cuk' },
        { icon: <Linkedin size={24} />, href: 'https://www.linkedin.com/in/iedc-cuk-56b73b259/' },
        { icon: <Youtube size={24} />, href: 'https://www.youtube.com/@iedc_cukerala' },
    ];

    return (
        <footer className="bg-slate-950 pt-20 relative">


            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className='flex flex-col items-center'>
                        <a href="#" className="text-2xl font-bold text-white z-10 flex items-center">
                            <img src="./iedc_logo.png" alt="IEDC Logo" className="inline-block h-8 mr-3" />
                            IEDC <span className="gradient-text ml-2 mr-3">CUK</span>
                            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full ml-2 p-0.5 shadow-md border border-slate-200 overflow-hidden">
                                <img src="https://www.cukerala.ac.in/assets/img/CUKLOGO.png" alt="CUK Logo" className="w-full h-full object-contain transform scale-110" />
                            </div>
                        </a>
                        <p className="text-slate-400 mt-2">Innovate. Incubate. Inspire.</p>
                    </div>

                    <div className='flex flex-col items-center'>
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-center">
                            {navLinks.map(link => (
                                <li key={link.name}>
                                    <a 
                                      href={link.href} 
                                      target={link.external ? "_blank" : "_self"}
                                      rel={link.external ? "noopener noreferrer" : ""}
                                      className="text-slate-400 hover:text-pink-400 transition-colors duration-300 outline-none focus:outline-none"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='flex flex-col items-center'>
                        <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
                        <div className="flex justify-center space-x-4">
                            {socialLinks.map((social, index) => (
                                <a 
                                    key={index} 
                                    href={social.href} 
                                    className="text-slate-400 hover:text-pink-400 transition-all duration-300 hover:scale-110"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- UPDATED COPYRIGHT & DEVELOPER CREDIT SECTION --- */}
                <div className="mt-12 pt-8 flex flex-col items-center justify-center">
                    <p className="text-slate-500 text-sm text-center">
                        &copy; {new Date().getFullYear()} IEDC Central University of Kerala. All Rights Reserved.
                    </p>
                    <p className="text-slate-500 text-sm text-center mt-2">
                        Developed by{' '}
                        <a 
                            href="https://www.linkedin.com/in/tathagata-mandal-453863225/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-pink-400 font-semibold hover:text-pink-300 transition outline-none focus:outline-none"
                        >
                            Tathagata Mandal
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;