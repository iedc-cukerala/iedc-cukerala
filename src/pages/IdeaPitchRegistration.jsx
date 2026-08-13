import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowRight, ArrowLeft, CheckCircle, Lightbulb, Users, FileText, Send } from 'lucide-react';

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
    
    const [hasSecondMember, setHasSecondMember] = useState(false);

    const [formData, setFormData] = useState({
        teamName: '',
        ideaTitle: '',
        ideaDescription: '',
        
        member1Name: '',
        member1Department: '',
        member1Course: '',
        member1Semester: '',
        member1Year: '',
        member1RegNo: '',
        member1Email: '',
        member1Phone: '',

        member2Name: '',
        member2Department: '',
        member2Course: '',
        member2Semester: '',
        member2Year: '',
        member2RegNo: '',
        member2Email: '',
        member2Phone: ''
    });

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'ideapitch_registrations'), {
                ...formData,
                hasSecondMember,
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

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col pt-12 pb-24">
            {/* Background Decorative Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 pointer-events-none animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 pointer-events-none animate-blob animation-delay-2000"></div>

            <div className="container mx-auto px-4 max-w-3xl relative z-10 flex-grow flex flex-col">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                        Idea Pitch Competition
                    </h1>
                    <p className="text-slate-400 text-lg">Register your team and submit your innovative idea.</p>
                </div>

                {/* Stepper */}
                <div className="flex justify-between items-center mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 -translate-y-1/2 rounded-full"></div>
                    <div 
                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
                        style={{ width: `${((step - 1) / (hasSecondMember ? 3 : 2)) * 100}%` }}
                    ></div>
                    
                    {[
                        { num: 1, icon: <Lightbulb size={20} />, label: "Idea" },
                        { num: 2, icon: <Users size={20} />, label: "Leader" },
                        ...(hasSecondMember ? [{ num: 3, icon: <Users size={20} />, label: "Member 2" }] : []),
                        { num: hasSecondMember ? 4 : 3, icon: <FileText size={20} />, label: "Review" }
                    ].map((s) => (
                        <div key={s.num} className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${
                                step >= s.num 
                                ? 'bg-slate-900 border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]' 
                                : 'bg-slate-900 border-slate-700 text-slate-500'
                            }`}>
                                {s.icon}
                            </div>
                            <span className={`text-xs mt-2 font-medium ${step >= s.num ? 'text-purple-400' : 'text-slate-500'}`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-6 md:p-10 shadow-2xl flex-grow">
                    <form onSubmit={step === (hasSecondMember ? 4 : 3) ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
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
                                    <FormField label="Team Name" value={formData.teamName} onChange={e => updateField('teamName', e.target.value)} required placeholder="Awesome Innovators" />
                                    <FormField label="Idea Title" value={formData.ideaTitle} onChange={e => updateField('ideaTitle', e.target.value)} required placeholder="Smart IoT Solution" />
                                    <FormField label="Brief Description of Idea" value={formData.ideaDescription} onChange={e => updateField('ideaDescription', e.target.value)} required multiline placeholder="Describe the problem and your solution..." />
                                    
                                    <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={hasSecondMember}
                                                onChange={(e) => setHasSecondMember(e.target.checked)}
                                                className="w-5 h-5 rounded border-slate-600 text-purple-500 focus:ring-purple-500 bg-slate-900"
                                            />
                                            <span className="text-white font-medium">Add a second team member?</span>
                                        </label>
                                        <p className="text-sm text-slate-400 mt-2 ml-8">Check this if your team consists of 2 members. Leave unchecked if participating solo.</p>
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                        <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                                            Next: Team Leader <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: LEADER DETAILS */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    custom={1}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ type: "tween", duration: 0.3 }}
                                >
                                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                        <Users className="text-purple-400" /> Team Leader Details
                                    </h3>
                                    
                                    <FormField label="Full Name" value={formData.member1Name} onChange={e => updateField('member1Name', e.target.value)} required placeholder="John Doe" />
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField type="email" label="Email Address" value={formData.member1Email} onChange={e => updateField('member1Email', e.target.value)} required placeholder="john@example.com" />
                                        <FormField type="tel" label="Phone Number" value={formData.member1Phone} onChange={e => updateField('member1Phone', e.target.value)} required placeholder="+91 9876543210" />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField label="Department" value={formData.member1Department} onChange={e => updateField('member1Department', e.target.value)} required placeholder="Computer Science" />
                                        <FormField label="Course" value={formData.member1Course} onChange={e => updateField('member1Course', e.target.value)} required placeholder="B.Tech / MSc" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField label="Semester" value={formData.member1Semester} onChange={e => updateField('member1Semester', e.target.value)} required placeholder="S4" />
                                        <FormField label="Year" value={formData.member1Year} onChange={e => updateField('member1Year', e.target.value)} required placeholder="2nd Year" />
                                        <FormField label="Registration No" value={formData.member1RegNo} onChange={e => updateField('member1RegNo', e.target.value)} required placeholder="CUK12345" />
                                    </div>

                                    <div className="mt-8 flex justify-between">
                                        <button type="button" onClick={prevStep} className="flex items-center gap-2 text-slate-300 px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors">
                                            <ArrowLeft size={20} /> Back
                                        </button>
                                        <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                                            {hasSecondMember ? 'Next: Member 2' : 'Review Details'} <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3 (Conditional): MEMBER 2 DETAILS */}
                            {step === 3 && hasSecondMember && (
                                <motion.div
                                    key="step3"
                                    custom={1}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ type: "tween", duration: 0.3 }}
                                >
                                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                        <Users className="text-pink-400" /> Second Member Details
                                    </h3>
                                    
                                    <FormField label="Full Name" value={formData.member2Name} onChange={e => updateField('member2Name', e.target.value)} required={hasSecondMember} placeholder="Jane Smith" />
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField type="email" label="Email Address" value={formData.member2Email} onChange={e => updateField('member2Email', e.target.value)} required={hasSecondMember} placeholder="jane@example.com" />
                                        <FormField type="tel" label="Phone Number" value={formData.member2Phone} onChange={e => updateField('member2Phone', e.target.value)} required={hasSecondMember} placeholder="+91 9876543210" />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField label="Department" value={formData.member2Department} onChange={e => updateField('member2Department', e.target.value)} required={hasSecondMember} placeholder="Computer Science" />
                                        <FormField label="Course" value={formData.member2Course} onChange={e => updateField('member2Course', e.target.value)} required={hasSecondMember} placeholder="B.Tech / MSc" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField label="Semester" value={formData.member2Semester} onChange={e => updateField('member2Semester', e.target.value)} required={hasSecondMember} placeholder="S4" />
                                        <FormField label="Year" value={formData.member2Year} onChange={e => updateField('member2Year', e.target.value)} required={hasSecondMember} placeholder="2nd Year" />
                                        <FormField label="Registration No" value={formData.member2RegNo} onChange={e => updateField('member2RegNo', e.target.value)} required={hasSecondMember} placeholder="CUK12346" />
                                    </div>

                                    <div className="mt-8 flex justify-between">
                                        <button type="button" onClick={prevStep} className="flex items-center gap-2 text-slate-300 px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors">
                                            <ArrowLeft size={20} /> Back
                                        </button>
                                        <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                                            Review Details <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* FINAL STEP: REVIEW & SUBMIT */}
                            {step === (hasSecondMember ? 4 : 3) && (
                                <motion.div
                                    key="step4"
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

                                        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                                            <h4 className="text-pink-400 font-semibold mb-2 uppercase text-xs tracking-wider">Team Leader</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                <p><span className="text-slate-400">Name:</span> <span className="text-white">{formData.member1Name}</span></p>
                                                <p><span className="text-slate-400">Phone:</span> <span className="text-white">{formData.member1Phone}</span></p>
                                                <p><span className="text-slate-400">Email:</span> <span className="text-white">{formData.member1Email}</span></p>
                                                <p><span className="text-slate-400">Reg No:</span> <span className="text-white">{formData.member1RegNo}</span></p>
                                            </div>
                                        </div>

                                        {hasSecondMember && (
                                            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                                                <h4 className="text-pink-400 font-semibold mb-2 uppercase text-xs tracking-wider">Second Member</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <p><span className="text-slate-400">Name:</span> <span className="text-white">{formData.member2Name}</span></p>
                                                    <p><span className="text-slate-400">Phone:</span> <span className="text-white">{formData.member2Phone}</span></p>
                                                    <p><span className="text-slate-400">Email:</span> <span className="text-white">{formData.member2Email}</span></p>
                                                    <p><span className="text-slate-400">Reg No:</span> <span className="text-white">{formData.member2RegNo}</span></p>
                                                </div>
                                            </div>
                                        )}
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
        </div>
    );
};

export default IdeaPitchRegistration;
