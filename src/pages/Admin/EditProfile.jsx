import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import Cropper from 'react-easy-crop';
import { db, auth } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { ArrowLeft } from 'lucide-react';

const EditProfile = () => {
  const [leadData, setLeadData] = useState(null);
  const [docId, setDocId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // Cropper states
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [finalBase64, setFinalBase64] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isSuperAdmin } = useAuth();
  const targetId = searchParams.get('id');

  useEffect(() => {
    const fetchLeadData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/admin/login');
        return;
      }

      let leadDataObj = null;
      let leadDocId = null;

      try {
        if (isSuperAdmin && targetId) {
          const docRef = doc(db, 'leads', targetId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            leadDataObj = docSnap.data();
            leadDocId = docSnap.id;
          }
        } else {
          const q = query(collection(db, 'leads'), where('email', '==', user.email.toLowerCase()));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const leadDoc = querySnapshot.docs[0];
            leadDataObj = leadDoc.data();
            leadDocId = leadDoc.id;
          }
        }

        if (leadDataObj) {
          setDocId(leadDocId);
          setLeadData({
            name: leadDataObj.name || '',
            role: leadDataObj.role || '',
            imageUrl: leadDataObj.imageUrl || '',
            linkedin: leadDataObj.linkedin || '',
            email: leadDataObj.email || '',
            phone: leadDataObj.phone || '',
          });
        }
      } catch (err) {
        console.error("Error fetching lead:", err);
      }
      setLoading(false);
    };

    fetchLeadData();
  }, [navigate, isSuperAdmin, targetId]);

  const handleChange = (e) => {
    setLeadData({ ...leadData, [e.target.name]: e.target.value });
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Force 400x400 output
    canvas.width = 400;
    canvas.height = 400;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      400,
      400
    );

    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const handleCropComplete = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setFinalBase64(croppedImage);
      setShowCropper(false);
    } catch (e) {
      console.error(e);
      alert('Error cropping image');
    }
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageSrc(URL.createObjectURL(file));
      setShowCropper(true);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      let finalImageUrl = leadData.imageUrl;

      if (finalBase64) {
        finalImageUrl = finalBase64;
      }

      // Update Firestore
      await updateDoc(doc(db, 'leads', docId), {
        name: leadData.name,
        role: leadData.role,
        imageUrl: finalImageUrl,
        linkedin: leadData.linkedin,
        email: leadData.email,
        phone: leadData.phone,
      });

      setLeadData((prev) => ({ ...prev, imageUrl: finalImageUrl }));
      setFinalBase64(null); // Clear selected file
      setImageSrc(null);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setMessage(`Failed to update profile: ${err.message || err.code || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-400 py-12 text-center">Loading Profile...</div>;
  if (!leadData) return <div className="text-slate-400 py-12 text-center">No Profile Found in Leads collection.</div>;

  return (
    <div className="relative">
      {/* Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="bg-slate-900/80 p-8 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Adjust Profile Photo</h3>
            <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden bg-black/50 border border-white/5">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={(croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                onZoomChange={setZoom}
              />
            </div>
            <div className="mb-8">
              <label className="text-slate-400 text-sm mb-3 block text-center font-medium">Zoom: {Math.round(zoom * 100)}%</label>
              <input 
                type="range" value={zoom} min={1} max={3} step={0.1} 
                onChange={(e) => setZoom(e.target.value)} 
                className="w-full accent-purple-500" 
              />
            </div>
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => { setShowCropper(false); setImageSrc(null); setFinalBase64(null); }} 
                className="w-1/2 py-3.5 bg-white/5 rounded-xl text-slate-300 font-bold hover:bg-white/10 transition border border-white/10"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleCropComplete} 
                className="w-1/2 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold hover:opacity-90 transition shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-800 pb-6">
        <div>
          <button onClick={() => navigate('/admin/dashboard')} className="flex items-center text-slate-400 hover:text-white transition-colors text-sm mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </button>
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3 tracking-wider uppercase">
              {targetId && isSuperAdmin ? 'Edit Team Member' : 'Admin Profile'}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              {targetId && isSuperAdmin ? 'Edit Member Profile' : 'Edit My Profile'}
          </h2>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-8 text-center font-semibold ${message.includes('success') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 items-start">
          
          {/* Left Col: Image */}
          <div className="flex flex-col items-center justify-center space-y-4 p-8 border border-white/5 rounded-3xl bg-slate-950/30 shadow-inner">
            <div 
              className={`relative w-48 h-48 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-900 shadow-xl flex items-center justify-center transition-all duration-300 ${isEditing ? 'cursor-pointer group hover:border-purple-500' : ''}`}
              onClick={() => isEditing && fileInputRef.current?.click()}
            >
              {finalBase64 ? (
                <img src={finalBase64} alt="Preview" className="w-full h-full object-cover" />
              ) : leadData.imageUrl ? (
                <img src={leadData.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-600 text-sm">No Image</div>
              )}
              
              {isEditing && (
                <div className="absolute inset-0 bg-purple-900/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm font-bold tracking-wider">Change Photo</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*"
              ref={fileInputRef}
              onChange={onFileChange}
              className="hidden"
            />
            {!isEditing && leadData.imageUrl === '' && (
              <p className="text-xs text-slate-500 font-medium">No profile picture set.</p>
            )}
          </div>

          {/* Right Col: Basic Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Full Name</label>
              <input 
                type="text" name="name" value={leadData.name} onChange={handleChange} required disabled={!isEditing}
                className="w-full bg-slate-950/50 text-white p-4 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all disabled:opacity-50 disabled:bg-slate-900/50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Designation / Role</label>
              <input 
                type="text" name="role" value={leadData.role} onChange={handleChange} required disabled={!isEditing}
                className="w-full bg-slate-950/50 text-white p-4 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all disabled:opacity-50 disabled:bg-slate-900/50" 
              />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <h3 className="text-xl font-bold text-white mb-6 pl-1">Contact & Social</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">LinkedIn URL</label>
              <input 
                type="url" name="linkedin" value={leadData.linkedin} onChange={handleChange} disabled={!isEditing}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-slate-950/50 text-white p-4 rounded-xl border border-white/10 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50 disabled:bg-slate-900/50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Email Address</label>
              <input 
                type="email" name="email" value={leadData.email} onChange={handleChange} disabled={!isEditing}
                placeholder="contact@example.com"
                className="w-full bg-slate-950/50 text-white p-4 rounded-xl border border-white/10 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all disabled:opacity-50 disabled:bg-slate-900/50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Phone Number</label>
              <input 
                type="tel" name="phone" value={leadData.phone} onChange={handleChange} disabled={!isEditing}
                placeholder="+1 234 567 890"
                className="w-full bg-slate-950/50 text-white p-4 rounded-xl border border-white/10 outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all disabled:opacity-50 disabled:bg-slate-900/50" 
              />
            </div>
          </div>
        </div>

        <div className="pt-8">
          {!isEditing ? (
            <button 
              type="button"
              onClick={(e) => { e.preventDefault(); setIsEditing(true); setMessage(''); }}
              className="w-full bg-slate-800 border border-slate-700 text-white font-bold py-4 rounded-xl hover:bg-slate-700 transition-all text-lg shadow-lg"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => { setIsEditing(false); setFinalBase64(null); setImageSrc(null); setMessage(''); }}
                className="w-1/3 bg-slate-800 border border-slate-700 text-slate-300 font-bold py-4 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-lg shadow-lg"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={saving}
                className="w-2/3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 text-lg shadow-[0_0_30px_rgba(168,85,247,0.3)]"
              >
                {saving ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
