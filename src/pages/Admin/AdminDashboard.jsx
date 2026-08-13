import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { Calendar, Image as ImageIcon, Megaphone, Users, LogOut, LayoutDashboard, ArrowLeft, MessageSquare, Lightbulb, UserCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Only fetch if admin is actually logged in and looking at the dashboard
    if (!user) return;
    const q = query(collection(db, 'contacts'), where('status', '==', 'unread'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.docs.length);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isRoot = location.pathname === '/admin/dashboard' || location.pathname === '/admin/dashboard/';

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-xl border-b border-slate-800/60 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Admin Control</h1>
              <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider">IEDC CUK Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-6 bg-slate-800/50 py-2 px-4 rounded-full border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold">{user?.email?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <p className="text-slate-300 text-sm hidden sm:block font-medium">{user?.email}</p>
            </div>
            <div className="w-px h-6 bg-slate-700"></div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 transition flex items-center gap-2 text-sm font-bold group"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Navigation Cards */}
        {isRoot && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            
            <Link to="/admin/dashboard/events" className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative h-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl flex flex-col items-start hover:bg-slate-800/80 transition">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="text-purple-400 w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Manage Events</h2>
                <p className="text-slate-400 text-sm">Create and edit upcoming events and registrations.</p>
              </div>
            </Link>

            <Link to="/admin/dashboard/past-events" className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative h-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl flex flex-col items-start hover:bg-slate-800/80 transition">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ImageIcon className="text-blue-400 w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Past Events</h2>
                <p className="text-slate-400 text-sm">Archive events with galleries and summaries.</p>
              </div>
            </Link>

            <Link to="/admin/dashboard/announcements" className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative h-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl flex flex-col items-start hover:bg-slate-800/80 transition">
                <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Megaphone className="text-pink-400 w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Announcements</h2>
                <p className="text-slate-400 text-sm">Broadcast important news to the homepage.</p>
              </div>
            </Link>

            <Link to="/admin/dashboard/team" className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative h-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl flex flex-col items-start hover:bg-slate-800/80 transition">
                <div className="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-teal-400 w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Manage Team</h2>
                <p className="text-slate-400 text-sm">Invite leads and manage dashboard access.</p>
              </div>
            </Link>

            <Link to="/admin/dashboard/ideapitch" className="group">
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl shadow-xl hover:shadow-yellow-500/10 hover:border-yellow-500/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Lightbulb className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Idea Pitch
                </h2>
                <p className="text-slate-400 text-sm">Manage idea pitch registrations.</p>
              </div>
            </Link>

            <Link to="/admin/dashboard/contacts" className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative h-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl flex flex-col items-start hover:bg-slate-800/80 transition">
                <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative">
                  <MessageSquare className="text-violet-400 w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-500 items-center justify-center text-[10px] font-bold text-white shadow-lg border border-rose-400">
                        {unreadCount}
                      </span>
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Inbox Messages
                </h2>
                <p className="text-slate-400 text-sm">Read and reply to user queries.</p>
              </div>
            </Link>

            <Link to="/admin/dashboard/profile" className="group">
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-6 rounded-2xl shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserCircle className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  My Profile
                </h2>
                <p className="text-slate-400 text-sm">Edit your own team profile details.</p>
              </div>
            </Link>

          </div>
        )}

        {/* Main Content Area */}
        {!isRoot && (
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-semibold group w-fit bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800/60"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-8 rounded-2xl shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-teal-500 opacity-50 rounded-t-2xl"></div>
              <Outlet />
            </div>
          </div>
        )}

        {/* Footer Support Text */}
        <div className="mt-12 pt-6 border-t border-slate-800/60 text-center">
          <p className="text-slate-500 text-sm">
            Contact <a href="mailto:tathagata.2500705021@cukerala.ac.in" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">tathagata.2500705021@cukerala.ac.in</a> for support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;