import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
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
        <div id="hero-image-section" className="relative h-screen overflow-hidden bg-slate-50 flex items-center justify-center">
            
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
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-slate-50"></div>
            </div>
            
            <div ref={scrollRef} className="relative z-20 container mx-auto px-6 h-full flex flex-col items-center justify-center">
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
                            className="font-extrabold text-white leading-tight tracking-tight mb-6 drop-shadow-2xl"
                        >
                            <span className='block text-4xl sm:text-5xl md:text-7xl lg:text-[90px] drop-shadow-xl leading-tight text-slate-900'>
                                Innovate. <br className="sm:hidden" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600">Incubate.</span>
                            </span>
                            <span className='block text-4xl sm:text-5xl md:text-7xl lg:text-[90px] mt-2 drop-shadow-xl text-slate-900'>
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
                                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(236,72,153,0.6)] transition-all overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                                <span className="relative flex items-center justify-center gap-2">
                                    Explore Events
                                </span>
                            </button>
                            
                            <button 
                                onClick={scrollToAbout}
                                className="group px-8 py-4 bg-white/60 hover:bg-white/80 border border-slate-300 rounded-full font-bold text-slate-900 backdrop-blur-md shadow-md transition-all flex items-center justify-center gap-2"
                            >
                                Learn More
                                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
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
