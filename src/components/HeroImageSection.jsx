import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronDown, Sparkles, Rocket, Zap, Code, Lightbulb } from 'lucide-react';
import cukVideo from '../assets/cuk_video.mp4'; 
import cukPoster from '../assets/posters/cuk_poster.jpg'; 

const HeroImageSection = () => {
    const scrollRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end start"]
    });

    const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const contentScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);
    const contentY = useTransform(scrollYProgress, [0, 0.8], [0, 100]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const springX = useSpring(mousePosition.x, { stiffness: 100, damping: 30 });
    const springY = useSpring(mousePosition.y, { stiffness: 100, damping: 30 });

    const scrollToEvents = () => {
        document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToAbout = () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div id="hero-image-section" className="relative h-screen overflow-hidden bg-transparent flex items-center justify-center">
            
            {/* The Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={cukPoster}
                    className="w-full h-full object-cover scale-105"
                >
                    <source src={cukVideo} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-white/40"></div>
            </div>
            
            <div ref={scrollRef} className="relative z-20 container mx-auto px-6 h-full flex flex-col items-center justify-center">
                
                {/* --- FLOATING 3D-LIKE GRAPHICS --- */}
                <motion.div 
                    animate={{ y: [0, -30, 0], rotate: [0, 10, 0], scale: [1, 1.1, 1] }} 
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
                    className="absolute top-1/4 left-[10%] md:left-[20%] z-0 opacity-90"
                >
                    <div className="bg-white/60 backdrop-blur-md p-4 rounded-[2rem] shadow-[0_20px_40px_rgba(255,0,127,0.3)] border border-white">
                        <Rocket className="w-12 h-12 md:w-16 md:h-16 text-[#ff007f]" strokeWidth={2} />
                    </div>
                </motion.div>

                <motion.div 
                    animate={{ y: [0, 40, 0], rotate: [0, -15, 0], scale: [1, 1.2, 1] }} 
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
                    className="absolute top-1/3 right-[10%] md:right-[15%] z-0 opacity-90"
                >
                    <div className="bg-white/60 backdrop-blur-md p-5 rounded-full shadow-[0_20px_40px_rgba(0,242,254,0.3)] border border-white">
                        <Zap className="w-14 h-14 md:w-20 md:h-20 text-[#00f2fe]" strokeWidth={2} />
                    </div>
                </motion.div>

                <motion.div 
                    animate={{ y: [0, -20, 0], rotate: [0, 20, 0], scale: [1, 1.1, 1] }} 
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }} 
                    className="absolute bottom-1/4 left-[15%] md:left-[25%] z-0 opacity-90 hidden md:block"
                >
                    <div className="bg-white/60 backdrop-blur-md p-4 rounded-3xl shadow-[0_20px_40px_rgba(255,153,51,0.3)] border border-white transform -rotate-12">
                        <Code className="w-12 h-12 md:w-16 md:h-16 text-[#ff9933]" strokeWidth={2} />
                    </div>
                </motion.div>

                <motion.div 
                    animate={{ y: [0, 30, 0], rotate: [0, -10, 0], scale: [1, 1.15, 1] }} 
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }} 
                    className="absolute bottom-1/3 right-[20%] md:right-[25%] z-0 opacity-90 hidden md:block"
                >
                    <div className="bg-white/60 backdrop-blur-md p-4 rounded-[2rem] shadow-[0_20px_40px_rgba(79,172,254,0.3)] border border-white transform rotate-12">
                        <Lightbulb className="w-12 h-12 md:w-16 md:h-16 text-[#4facfe]" strokeWidth={2} />
                    </div>
                </motion.div>
                <motion.div 
                    style={{ 
                        opacity: contentOpacity,
                        scale: contentScale,
                        y: contentY,
                        x: springX,
                        rotateX: springY,
                        rotateY: springX
                    }}
                    className="relative perspective-1000 w-full"
                >
                    <div className="relative z-10 flex flex-col items-center text-center">

                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="font-extrabold text-[#1e1b4b] leading-tight tracking-tight mb-6"
                        >
                            <span className='block text-5xl sm:text-6xl md:text-8xl lg:text-[100px] leading-tight'>
                                Innovate. <br className="sm:hidden" />
                                <span className="gradient-text">Incubate.</span>
                            </span>
                            <span className='block text-5xl sm:text-6xl md:text-8xl lg:text-[100px] mt-2'>
                                Inspire.
                            </span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                            className="text-slate-600 max-w-2xl mx-auto mb-10 text-lg md:text-2xl font-['Poppins'] font-light drop-shadow-sm"
                        >
                            Innovation and Entrepreneurship Development Centre <br/>
                            <strong className="font-semibold text-slate-900">Central University of Kerala</strong>
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                        >
                            <button 
                                onClick={scrollToEvents}
                                className="gradient-button px-10 py-5 rounded-full font-bold text-white text-lg transition-all overflow-hidden"
                            >
                                <span className="relative flex items-center justify-center gap-2">
                                    Explore Events
                                </span>
                            </button>
                            
                            <button 
                                onClick={scrollToAbout}
                                className="group px-10 py-5 bg-white/60 hover:bg-white border-2 border-transparent hover:border-pink-300 rounded-full font-bold text-[#1e1b4b] text-lg backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all flex items-center justify-center gap-2"
                            >
                                Learn More
                                <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform text-pink-500" />
                            </button>
                        </motion.div>

                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
                onClick={scrollToAbout}
            >
                <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Scroll</span>
                <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center p-1">
                    <motion.div 
                        animate={{ y: [0, 12, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="w-1.5 h-3 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default HeroImageSection;
