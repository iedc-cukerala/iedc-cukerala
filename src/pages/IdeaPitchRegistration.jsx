import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowRight, ArrowLeft, CheckCircle, Lightbulb, Users, FileText, Send, UserPlus, UserMinus } from 'lucide-react';
import Footer from '../components/Footer';

const FormField = ({ label, type = "text", value, onChange, required, placeholder, multiline = false }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-1">
            {label} {required && <span className="text-pink-500">*</span>}
        </label>
        {multiline ? (
            <textarea
                required={required}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={4}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
            />
        ) : (
            <input
                type={type}
                required={required}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
        )}
    </div>
);

const IdeaPitchRegistration = () => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        teamName: '',
        ideaTitle: '',
        ideaDescription: '',
        members: [
            { name: '', department: '', course: '', semester: '', regNo: '', email: '', phone: '' },
            { name: '', department: '', course: '', semester: '', regNo: '', email: '', phone: '' }
        ]
    });

    const updateIdeaField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateMemberField = (index, field, value) => {
        setFormData(prev => {
            const newMembers = [...prev.members];
            newMembers[index] = { ...newMembers[index], [field]: value };
            return { ...prev, members: newMembers };
        });
    };

    const addMember = () => {
        if (formData.members.length < 4) {
            setFormData(prev => ({
                ...prev,
                members: [
                    ...prev.members,
                    { name: '', department: '', course: '', semester: '', regNo: '', email: '', phone: '' }
                ]
            }));
            // Immediately jump to the new member step
            setStep(prev => prev + 1);
        }
    };

    const removeMember = (indexToRemove) => {
        if (formData.members.length > 2) {
            setFormData(prev => ({
                ...prev,
                members: prev.members.filter((_, idx) => idx !== indexToRemove)
            }));
            setStep(prev => prev - 1);
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all emails
        for (let i = 0; i < formData.members.length; i++) {
            if (!formData.members[i].email.endsWith('@cukerala.ac.in')) {
                alert(`Member ${i + 1}'s email must be a valid @cukerala.ac.in address.`);
                return;
            }
        }

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'ideapitch_registrations'), {
                ...formData,
                status: 'pending',
                submittedAt: serverTimestamp()
            });
            setIsSuccess(true);
        } catch (error) {
            console.error("Error submitting registration: ", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0
        })
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
                </div>
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 p-12 rounded-3xl max-w-lg w-full text-center shadow-2xl"
                >
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                        className="w-24 h-24 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(52,211,153,0.3)]"
                    >
                        <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-4">Registration Successful!</h2>
                    <p className="text-slate-400 mb-8">
                        Your idea has been successfully pitched. We will review it and get back to you soon on your registered email address. Best of luck!
                    </p>
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Return Home
                    </button>
                </motion.div>
            </div>
        );
    }

    const totalSteps = formData.members.length + 2; // Idea + Members + Review

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col pt-12">
            {/* Background Decorative Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 pointer-events-none animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 pointer-events-none animate-blob animation-delay-2000"></div>

            <div className="container mx-auto px-4 max-w-3xl relative z-10 flex-grow flex flex-col pb-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                        Idea Pitch Competition
                    </h1>
                    <p className="text-slate-400 text-lg">Register your team (2 to 4 members) and submit your innovative idea.</p>
                </div>

                {/* Dynamic Stepper */}
                <div className="flex justify-between items-center mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 -translate-y-1/2 rounded-full"></div>
                    <div 
                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
                        style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                    ></div>
                    
                    {/* Idea Step */}
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${
                            step >= 1 ? 'bg-slate-900 border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-slate-900 border-slate-700 text-slate-500'
                        }`}>
                            <Lightbulb size={20} />
                        </div>
                    </div>

                    {/* Member Steps */}
                    {formData.members.map((_, idx) => (
                        <div key={`step-member-${idx}`} className="flex flex-col items-center">
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${
                                step >= idx + 2 ? 'bg-slate-900 border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-slate-900 border-slate-700 text-slate-500'
                            }`}>
                                <Users size={20} />
                            </div>
                        </div>
                    ))}

                    {/* Review Step */}
                    <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${
                            step >= totalSteps ? 'bg-slate-900 border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-slate-900 border-slate-700 text-slate-500'
                        }`}>
                            <FileText size={20} />
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-6 md:p-10 shadow-2xl flex-grow">
                    <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
                        <AnimatePresence mode="wait" custom={1}>
                            
                            {/* STEP 1: IDEA DETAILS */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    custom={1}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ type: "tween", duration: 0.3 }}
                                >
                                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                        <Lightbulb className="text-purple-400" /> Project Details
                                    </h3>
                                    <FormField label="Team Name" value={formData.teamName} onChange={e => updateIdeaField('teamName', e.target.value)} required placeholder="Awesome Innovators" />
                                    <FormField label="Idea Title" value={formData.ideaTitle} onChange={e => updateIdeaField('ideaTitle', e.target.value)} required placeholder="Smart IoT Solution" />
                                    <FormField label="Brief Description of Idea" value={formData.ideaDescription} onChange={e => updateIdeaField('ideaDescription', e.target.value)} required multiline placeholder="Describe the problem and your solution..." />
                                    
                                    <div className="mt-8 flex justify-end">
                                        <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                                            Next: Team Leader <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* DYNAMIC MEMBER STEPS */}
                            {formData.members.map((member, idx) => (
                                step === idx + 2 && (
                                    <motion.div
                                        key={`member-${idx}`}
                                        custom={1}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ type: "tween", duration: 0.3 }}
                                    >
                                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Users className={idx === 0 ? "text-purple-400" : "text-pink-400"} /> 
                                                {idx === 0 ? "Team Leader" : `Member ${idx + 1}`}
                                            </div>
                                            {idx > 1 && (
                                                <button type="button" onClick={() => removeMember(idx)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors">
                                                    <UserMinus size={16} /> Remove
                                                </button>
                                            )}
                                        </h3>
                                        
                                        <FormField label="Full Name" value={member.name} onChange={e => updateMemberField(idx, 'name', e.target.value)} required placeholder="John Doe" />
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField type="email" label="Email Address" value={member.email} onChange={e => updateMemberField(idx, 'email', e.target.value)} required placeholder="name@cukerala.ac.in" />
                                            <FormField type="tel" label="Phone Number" value={member.phone} onChange={e => updateMemberField(idx, 'phone', e.target.value)} required placeholder="+91 9876543210" />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField label="Department" value={member.department} onChange={e => updateMemberField(idx, 'department', e.target.value)} required placeholder="Computer Science" />
                                            <FormField label="Course" value={member.course} onChange={e => updateMemberField(idx, 'course', e.target.value)} required placeholder="B.Tech / MSc" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField label="Semester" value={member.semester} onChange={e => updateMemberField(idx, 'semester', e.target.value)} required placeholder="S4" />
                                            <FormField label="Registration No" value={member.regNo} onChange={e => updateMemberField(idx, 'regNo', e.target.value)} required placeholder="CUK12345" />
                                        </div>

                                        <div className="mt-8 flex flex-col md:flex-row justify-between gap-4">
                                            <button type="button" onClick={prevStep} className="flex items-center justify-center gap-2 text-slate-300 px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors w-full md:w-auto">
                                                <ArrowLeft size={20} /> Back
                                            </button>
                                            
                                            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                                                {/* If this is the last member being viewed, and we haven't reached 4 members yet */}
                                                {idx === formData.members.length - 1 && formData.members.length < 4 && (
                                                    <button type="button" onClick={addMember} className="flex items-center justify-center gap-2 border border-purple-500 text-purple-400 px-6 py-3 rounded-xl font-semibold hover:bg-purple-500/10 transition-colors">
                                                        <UserPlus size={20} /> Add Member {idx + 2}
                                                    </button>
                                                )}
                                                
                                                <button type="submit" className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                                                    {idx === formData.members.length - 1 ? 'Review Details' : `Next Member`} <ArrowRight size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            ))}

                            {/* FINAL STEP: REVIEW & SUBMIT */}
                            {step === totalSteps && (
                                <motion.div
                                    key="stepFinal"
                                    custom={1}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ type: "tween", duration: 0.3 }}
                                >
                                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                        <FileText className="text-purple-400" /> Review Application
                                    </h3>
                                    
                                    <div className="space-y-6 text-sm">
                                        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                                            <h4 className="text-purple-400 font-semibold mb-2 uppercase text-xs tracking-wider">Project Idea</h4>
                                            <p><span className="text-slate-400">Team Name:</span> <span className="font-medium text-white">{formData.teamName}</span></p>
                                            <p><span className="text-slate-400">Title:</span> <span className="font-medium text-white">{formData.ideaTitle}</span></p>
                                            <p className="mt-2 text-slate-300 whitespace-pre-wrap">{formData.ideaDescription}</p>
                                        </div>

                                        {formData.members.map((member, idx) => (
                                            <div key={`review-member-${idx}`} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                                                <h4 className={`${idx === 0 ? 'text-purple-400' : 'text-pink-400'} font-semibold mb-2 uppercase text-xs tracking-wider`}>
                                                    {idx === 0 ? 'Team Leader' : `Member ${idx + 1}`}
                                                </h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <p><span className="text-slate-400">Name:</span> <span className="text-white">{member.name}</span></p>
                                                    <p><span className="text-slate-400">Phone:</span> <span className="text-white">{member.phone}</span></p>
                                                    <p><span className="text-slate-400">Email:</span> <span className="text-white">{member.email}</span></p>
                                                    <p><span className="text-slate-400">Reg No:</span> <span className="text-white">{member.regNo}</span></p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 flex justify-between">
                                        <button type="button" onClick={prevStep} disabled={isSubmitting} className="flex items-center gap-2 text-slate-300 px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50">
                                            <ArrowLeft size={20} /> Back
                                        </button>
                                        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0">
                                            {isSubmitting ? 'Submitting...' : 'Submit Pitch'} <Send size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </form>
                </div>
            </div>

            {/* Developer Footer */}
            <div className="mt-auto pt-8 pb-8 flex flex-col items-center justify-center relative z-10 w-full">
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
    );
};

export default IdeaPitchRegistration;
