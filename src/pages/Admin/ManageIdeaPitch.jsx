import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Download, Search, Trash2, Check, X, FileText } from 'lucide-react';

const ManageIdeaPitch = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'ideapitch_registrations'),
      orderBy('submittedAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const regsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate() || new Date()
      }));
      setRegistrations(regsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      await deleteDoc(doc(db, 'ideapitch_registrations', id));
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
    await updateDoc(doc(db, 'ideapitch_registrations', id), {
      status: newStatus
    });
  };

  const escapeCSV = (str) => {
    if (str === null || str === undefined) return '';
    const stringified = String(str);
    if (stringified.includes(',') || stringified.includes('"') || stringified.includes('\n')) {
      return `"${stringified.replace(/"/g, '""')}"`;
    }
    return stringified;
  };

  const exportToCSV = () => {
    // Define headers
    const headers = [
      'Submitted At', 'Status', 'Team Name', 'Idea Title', 'Idea Description',
      'Leader Name', 'Leader Phone', 'Leader Email', 'Leader Reg No', 'Leader Dept', 'Leader Course', 'Leader Semester', 'Leader Year',
      'Member 2 Name', 'Member 2 Phone', 'Member 2 Email', 'Member 2 Reg No', 'Member 2 Dept', 'Member 2 Course', 'Member 2 Semester', 'Member 2 Year'
    ];

    // Map data to rows
    const csvRows = registrations.map(reg => [
      reg.submittedAt.toLocaleString(),
      reg.status || 'pending',
      reg.teamName,
      reg.ideaTitle,
      reg.ideaDescription,
      reg.member1Name,
      reg.member1Phone,
      reg.member1Email,
      reg.member1RegNo,
      reg.member1Department,
      reg.member1Course,
      reg.member1Semester,
      reg.member1Year,
      reg.member2Name || '-',
      reg.member2Phone || '-',
      reg.member2Email || '-',
      reg.member2RegNo || '-',
      reg.member2Department || '-',
      reg.member2Course || '-',
      reg.member2Semester || '-',
      reg.member2Year || '-'
    ].map(escapeCSV).join(','));

    // Join headers and rows
    const csvString = [headers.join(','), ...csvRows].join('\n');

    // Trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `IdeaPitch_Registrations_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    reg.ideaTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.member1Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Idea Pitch Registrations
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage and export competition entries</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search teams or leaders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-slate-900/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 transition-opacity px-4 py-2 rounded-lg font-medium shadow-lg text-sm whitespace-nowrap"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/80 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider whitespace-nowrap">Team & Idea</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider whitespace-nowrap">Leader</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider whitespace-nowrap">Members</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider whitespace-nowrap">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">Loading registrations...</td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">No registrations found.</td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-purple-300">{reg.teamName}</div>
                      <div className="text-sm text-slate-400 truncate max-w-[200px]" title={reg.ideaTitle}>{reg.ideaTitle}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-200">{reg.member1Name}</div>
                      <div className="text-xs text-slate-500">{reg.member1RegNo}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-slate-800 rounded-md text-xs font-medium text-slate-300">
                          {reg.hasSecondMember ? '2 Members' : 'Solo'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">
                      {reg.submittedAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleStatusChange(reg.id, reg.status)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          reg.status === 'approved' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                        }`}
                      >
                        {reg.status === 'approved' ? <Check size={12} /> : <FileText size={12} />}
                        {reg.status === 'approved' ? 'Approved' : 'Pending'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(reg.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-slate-800"
                        title="Delete Registration"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageIdeaPitch;
