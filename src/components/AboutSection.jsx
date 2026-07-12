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
        <AnimatedSection id="about" className="relative py-32 bg-transparent overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-pink-100 border border-pink-200 text-pink-600 text-sm font-bold mb-6 tracking-widest uppercase shadow-sm"
                    >
                        Who We Are
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#1e1b4b] tracking-tight"
                    >
                        What is <span className="gradient-text">IEDC?</span>
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
                        <div className="glass-card p-8 md:p-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-300/30 via-orange-300/20 to-transparent rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                            
                            <p className="text-[#1e1b4b] text-lg md:text-xl leading-relaxed font-['Poppins'] relative z-10 mb-6">
                                The <strong className="font-extrabold text-pink-600">Innovation and Entrepreneurship Development Centre (IEDC)</strong> is a flagship initiative of the Kerala Startup Mission, fostering an innovation culture within academic institutions.
                            </p>
                            <p className="text-[#1e1b4b]/80 text-base md:text-lg leading-relaxed font-['Poppins'] relative z-10">
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
                                className="hover-lift relative bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-sm overflow-hidden"
                            >
                                {/* Animated Gradient Border on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" style={{ margin: '-2px', zIndex: 0 }}></div>
                                <div className="absolute inset-[2px] bg-white/90 rounded-[22px] z-0"></div>

                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center mb-6 group-hover:bg-pink-100 transition-colors duration-300">
                                        <div className="transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1e1b4b] mb-3">{feature.title}</h3>
                                    <p className="text-[#1e1b4b]/70 leading-relaxed font-['Poppins']">{feature.text}</p>
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
