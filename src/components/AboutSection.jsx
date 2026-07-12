import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, Users } from 'lucide-react';
import AnimatedSection from './AnimatedSection'; 

const AboutSection = () => {
    const features = [
        { icon: <Rocket className="w-8 h-8 text-purple-400" />, title: "Innovation", text: "Transforming innovative ideas into functioning prototypes without the fear of failure." },
        { icon: <Target className="w-8 h-8 text-pink-400" />, title: "Technology", text: "Introducing students to state-of-the-art technologies through expert mentors." },
        { icon: <Users className="w-8 h-8 text-teal-400" />, title: "Entrepreneurship", text: "Bridging the gap between industry and academia via skill development programs." }
    ];

    return (
        <AnimatedSection id="about" className="relative py-24 bg-slate-50 overflow-hidden">
            {/* Background glowing orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full filter blur-[120px] mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full filter blur-[120px] mix-blend-screen pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-sm font-semibold mb-6 tracking-wide"
                    >
                        WHO WE ARE
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900">
                        What is IEDC?
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                    
                    {/* Left text column */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <div className="glass-card bg-white/80 backdrop-blur-xl border border-slate-200 p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden group hover:border-purple-300 transition-colors duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
                            <p className="text-slate-700 text-lg leading-relaxed font-['Poppins'] relative z-10">
                                The <strong className="text-slate-900 font-semibold">Innovation and Entrepreneurship Development Centre (IEDC)</strong> is a flagship initiative of the Kerala Startup Mission. It serves as an umbrella programme instrumental in fostering an innovation culture within academic institutions.
                            </p>
                            <p className="text-slate-600 text-base mt-6 leading-relaxed font-['Poppins'] relative z-10">
                                At CUK, we are envisioned as a learning hub that encourages students to upgrade their skill sets. Since our inception in 2021, we have acted as an aggregator with three distinct stages of growth in mind: innovation, technology, and entrepreneurship.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right feature cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.2 }}
                                whileHover={{ x: 10, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                                className="bg-white/60 border border-slate-200 shadow-sm p-6 rounded-2xl flex items-start gap-5 transition-all cursor-default"
                            >
                                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{feature.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </AnimatedSection>
    );
};

export default AboutSection;
