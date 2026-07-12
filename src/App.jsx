import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageEvents from './pages/Admin/ManageEvents';
import ManagePastEvents from './pages/Admin/ManagePastEvents';
import ManageAnnouncements from './pages/Admin/ManageAnnouncements';
import ManageTeam from './pages/Admin/ManageTeam';
import ManageContacts from './pages/Admin/ManageContacts';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/HeaderSection';
import HeroImageSection from './components/HeroImageSection';
import AboutSection from './components/AboutSection';
import EventsSection from './components/EventsSection';
import PastEventsSection from './components/PastEventsSection';
import AnnouncementsSection from './components/AnnouncementsSection';
import TeamSection from './components/TeamSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import LeadDashboard from './pages/LeadDashboard';
function PublicHome() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.9) {
        setIsHeaderVisible(true);
      } else {
        setIsHeaderVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-transparent">
      <Header isVisible={isHeaderVisible} />
      
      <div id="hero-image-section" className="fixed top-0 left-0 w-full h-screen z-0">
        <HeroImageSection />
      </div>
      
      <div className="h-screen" />
      <div className="relative z-10 bg-transparent overflow-hidden">
        
        {/* --- DYNAMIC GRAPHICAL BACKGROUND --- */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-pattern opacity-60"></div>
          {/* Vibrant Floating Blobs */}
          <div className="blob bg-[#ff007f] w-[500px] h-[500px] top-[-10%] left-[-10%]"></div>
          <div className="blob bg-[#ff9933] w-[600px] h-[600px] top-[20%] right-[-15%]" style={{ animationDelay: '3s', animationDuration: '20s' }}></div>
          <div className="blob bg-[#00f2fe] w-[400px] h-[400px] bottom-[10%] left-[20%]" style={{ animationDelay: '5s', animationDuration: '18s' }}></div>
          <div className="blob bg-[#4facfe] w-[700px] h-[700px] bottom-[-20%] right-[-10%]" style={{ animationDelay: '7s' }}></div>
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <main>
            <section id="announcements" className="scroll-mt-24">
              <AnnouncementsSection />
            </section>
            
            <section id="about" className="scroll-mt-24">
              <AboutSection />
            </section>
            
            <section id="events" className="scroll-mt-24">
              <EventsSection />
            </section>

            <section id="past-events" className="scroll-mt-24">
              <PastEventsSection />
            </section>
            
            <section id="team" className="scroll-mt-24">
              <TeamSection />
            </section>
            
            <section id="contact" className="scroll-mt-24">
              <ContactSection />
            </section>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="events" element={<ManageEvents />} />
          <Route path="past-events" element={<ManagePastEvents />} /> 
          <Route path="announcements" element={<ManageAnnouncements />} />
          <Route path="team" element={<ManageTeam />} />
          <Route path="contacts" element={<ManageContacts />} />
          <Route index element={
            <div className="text-center text-slate-500 py-12">
              <p className="text-lg">Welcome to Admin Dashboard!</p>
              <p className="text-sm mt-2">Select an option above to get started</p>
            </div>
          } />
        </Route>
        <Route 
          path="/lead-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'lead']}>
              <LeadDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<PublicHome />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;