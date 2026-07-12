import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection'; // Assuming AnimatedSection is in a separate file

const AboutSection = () => (
    <AnimatedSection id="about">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white">What is IEDC?</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-2 rounded-full"></div>
            </div>
            <div 
                className="max-w-4xl mx-auto glass-card rounded-xl p-4 md:p-12"
                whileHover={{ y: -10, boxShadow: "0 10px 30px rgba(168, 85, 247, 0.2)" }}
            >
                <p className="text-slate-300 text-base md:text-lg  leading-relaxed font-['Poppins']">
                    Innovation and Entrepreneurship Development Centre (IEDC) is a flagship initiative of Kerala Startup Mission to promote innovation and entrepreneurship among the students and academic fraternity in educational institutions in the State of Kerala. It is considered an umbrella programme that would be instrumental in fostering an innovation culture in Academic institutions. The IEDC, CUK is envisioned as a learning and innovation hub that fosters an innovation culture among students by introducing them to state-of-the-art technologies through expert mentors. IEDC, CUK encourages students to transform their innovative ideas into prototypes without fear of failure. Additionally, we make earnest efforts to upgrade students' skill sets by conducting relevant workshops and seminars.
                </p>
                <p className="text-slate-300 text-base md:text-lg  mt-8 leading-relaxed font-['Poppins']">

    Since its inception in 2021, IEDC, CUK has organized various programs for the students of the Central University of Kerala. It has tried to bridge the gap between industry and academia by conducting skill development training programs for students and acting as an aggregator with three stages of growth in mind: innovation, technology, and entrepreneurship.
                </p>
            </div>
        </div>
    </AnimatedSection>
);

export default AboutSection;
