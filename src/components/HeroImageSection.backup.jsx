import React, { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from 'framer-motion';
import cukVideo from '../assets/cuk_video.mp4'; 
import cukPoster from '../assets/posters/cuk_poster.jpg'; 

const HeroImageSection = () => {
    const scrollRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end start"]
    });

    const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const contentScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);

    return (
        <div id="hero-image-section" className="relative h-screen overflow-hidden">
                <div className="absolute inset-0 bg-slate-950/60 z-10"></div>
            
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={cukPoster}
                    className="w-full h-full object-cover"
                >
                    <source src={cukVideo} type="video/mp4" />
                </video>
            </div>
            
            <div ref={scrollRef} className="relative h-full flex items-center justify-center text-center">
                <motion.div 
                    style={{ 
                        opacity: contentOpacity,
                        scale: contentScale 
                    }}
                    className="relative z-20 container mx-auto px-6"
                >
                    <motion.h1 
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="font-extrabold text-white leading-tight mb-4"
                    >
                        <span className='text-4xl md:text-[80px]'>Innovate. <span className="gradient-text">Incubate.</span> Inspire.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-slate-300 max-w-3xl mx-auto mb-8"
                    >
                        <span className="text-lg md:text-3xl font-['Poppins']">Welcome to the Innovation and Entrepreneurship Development Centre</span> <br/> <span className="gradient-text text-2xl md:text-5xl font-['Poppins'] font-semibold">Central University of Kerala</span>
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
};

export default HeroImageSection;
