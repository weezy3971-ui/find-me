
import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Shield, Trash2, Edit2, Camera, Save, X } from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedPhoto, setEditedPhoto] = useState<string | null>(user.photoUrl || null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdate({
      ...user,
      name: editedName,
      photoUrl: editedPhoto || undefined
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500 mt-2 font-medium">Manage your account information and privacy settings.</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-12 space-y-12">
          {/* Header */}
          <div className="flex items-center gap-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2.5rem] bg-blue-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-blue-500/40 border-4 border-white overflow-hidden">
                {editedPhoto ? (
                  <img src={editedPhoto} className="w-full h-full object-cover" />
                ) : (
                  user.name[0].toUpperCase()
                )}
              </div>
              {isEditing && (
                <label className="absolute inset-0 bg-black/50 rounded-[2.5rem] flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={32} />
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
              )}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input 
                  type="text" 
                  className="text-4xl font-black text-slate-900 tracking-tight bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              ) : (
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">{user.name}</h2>
              )}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                <span className="px-3 py-1 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 rounded-lg border border-slate-200">{user.type} ACCOUNT</span>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                    <Save size={20} />
                  </button>
                  <button onClick={() => { setIsEditing(false); setEditedName(user.name); setEditedPhoto(user.photoUrl || null); }} className="bg-slate-100 text-slate-500 p-3 rounded-xl hover:bg-slate-200">
                    <X size={20} />
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors border border-blue-100">
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-4">Account Details</h3>
            <div className="grid grid-cols-2 gap-y-10">
              <div>
                <label className="block text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Display Name</label>
                <div className="text-xl font-bold text-slate-900 tracking-tight">{user.name}</div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Account Type</label>
                <div className="text-xl font-bold text-slate-900 tracking-tight">{user.type}</div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Email Address</label>
                <div className="text-xl font-bold text-slate-900 tracking-tight">{user.email}</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <h3 className="text-2xl font-black text-red-500 tracking-tight mb-2">Danger Zone</h3>
            <p className="text-slate-500 font-medium">Once you delete your account, there is no going back. All your data will be removed.</p>
            <button className="mt-6 flex items-center gap-2 px-6 py-3 bg-red-50 text-red-500 font-bold rounded-xl border border-red-100 hover:bg-red-100 transition-colors">
              <Trash2 size={18} />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
