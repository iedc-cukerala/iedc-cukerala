import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, Users, Zap } from 'lucide-react';
import AnimatedSection from './AnimatedSection'; 

const AboutSection = () => {
    const features = [
        { icon: <Rocket className="w-8 h-8 text-purple-600" />, title: "Innovation", text: "Transforming innovative ideas into functioning prototypes without the fear of failure." },
        { icon: <Target className="w-8 h-8 text-pink-600" />, title: "Technology", text: "Introducing students to state-of-the-art technologies through expert mentors." },
        { icon: <Users className="w-8 h-8 text-blue-600" />, title: "Entrepreneurship", text: "Bridging the gap between industry and academia via skill development." },
        { icon: <Zap className="w-8 h-8 text-teal-600" />, title: "Empowerment", text: "Empowering the next generation of leaders with resources and networking." }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <AnimatedSection id="about" className="relative py-32 bg-slate-50 overflow-hidden border-b border-slate-200">
            {/* Background glowing orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full filter blur-[120px] mix-blend-multiply pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/5 rounded-full filter blur-[120px] mix-blend-multiply pointer-events-none"></div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold mb-6 tracking-widest uppercase shadow-sm"
                    >
                        Who We Are
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight"
                    >
                        What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">IEDC?</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left text column */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-5 space-y-6"
                    >
                        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-100 via-pink-50 to-transparent rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                            
                            <p className="text-slate-700 text-lg md:text-xl leading-relaxed font-['Poppins'] relative z-10 mb-6">
                                The <strong className="text-slate-900 font-bold">Innovation and Entrepreneurship Development Centre (IEDC)</strong> is a flagship initiative of the Kerala Startup Mission, fostering an innovation culture within academic institutions.
                            </p>
                            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-['Poppins'] relative z-10">
                                At CUK, we are a learning hub encouraging students to upgrade their skills. Since our inception in 2021, we have acted as an aggregator for innovation, technology, and entrepreneurship.
                            </p>
                        </div>
                    </motion.div>

                    {/* Right feature cards - Bento Grid */}
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6"
                    >
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                {/* Animated Gradient Border on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" style={{ margin: '-1px', zIndex: 0 }}></div>
                                <div className="absolute inset-[1px] bg-white rounded-[23px] z-0"></div>

                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-purple-50 transition-colors duration-300">
                                        <div className="transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed font-['Poppins']">{feature.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                </div>
            </div>
        </AnimatedSection>
    );
};

export default AboutSection;
