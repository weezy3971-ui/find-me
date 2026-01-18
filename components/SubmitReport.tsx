
import React, { useState, useRef, useEffect } from 'react';
import { Gender, MissingPerson, CaseStatus } from '../types';
import { Camera, MapPin, Calendar, CheckCircle2, Sparkles } from 'lucide-react';

const KENYAN_LOCATIONS = [
  'Nairobi, Westlands', 'Nairobi, CBD', 'Nairobi, Kilimani', 'Nairobi, Lang\'ata', 'Nairobi, Kasarani', 
  'Nairobi, Embakasi', 'Nairobi, Roysambu', 'Nairobi, Dagoretti', 'Nairobi, Kibra', 'Nairobi, Kamukunji',
  'Nairobi, Madaraka', 'Nairobi, South C', 'Nairobi, South B', 'Nairobi, Donholm', 'Nairobi, Buruburu',
  'Mombasa, Nyali', 'Mombasa, Old Town', 'Mombasa, Likoni', 'Mombasa, Kisauni', 'Mombasa, Changamwe',
  'Mombasa, Jomvu', 'Mombasa, Bamburi', 'Kisumu, Milimani', 'Kisumu, Kondele', 'Kisumu, Manyatta',
  'Kisumu, Nyalenda', 'Kisumu, Winam', 'Nakuru, Milimani', 'Nakuru, Shabab', 'Nakuru, Free Area',
  'Nakuru, Lanet', 'Eldoret, Kapsoya', 'Eldoret, West Indies', 'Eldoret, Langas', 'Thika, Section 9',
  'Thika, Makongeni', 'Thika, Ngoingwa', 'Ruiru, Kimbo', 'Kikuyu, Kidfarmaco', 'Malindi, Town',
  'Naivasha, Town', 'Kitui, Town', 'Machakos, Town', 'Athi River, Town', 'Kitale, Town', 
  'Kapsabet, Town', 'Kakamega, Town', 'Bungoma, Town', 'Busia, Town', 'Siaya, Town',
  'Homa Bay, Town', 'Migori, Town', 'Kisii, Town', 'Nyamira, Town', 'Garissa, Town',
  'Wajir, Town', 'Mandera, Town', 'Marsabit, Town', 'Isiolo, Town', 'Meru, Town',
  'Nyeri, Town', 'Kericho, Town', 'Bomet, Town', 'Vihiga, Town', 'Kwale, Town', 'Kilifi, Town'
].sort();

interface SubmitReportProps {
  onReport: (report: MissingPerson) => void;
}

const SubmitReport: React.FC<SubmitReportProps> = ({ onReport }) => {
  const [submitted, setSubmitted] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: Gender.MALE,
    location: '',
    date: '',
    description: '',
    phone: '',
    email: '',
  });

  const [showLocations, setShowLocations] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocations(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationChange = (val: string) => {
    setFormData({ ...formData, location: val });
    if (val.trim().length > 0) {
      const filtered = KENYAN_LOCATIONS.filter(loc => 
        loc.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowLocations(true);
    } else {
      setShowLocations(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: MissingPerson = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      location: formData.location,
      date: formData.date,
      status: CaseStatus.MISSING,
      description: formData.description,
      reportedAt: new Date().toLocaleDateString(),
      lat: -1.2921 + (Math.random() - 0.5) * 2,
      lng: 36.8219 + (Math.random() - 0.5) * 2,
      verified: false,
      photoUrl: photoPreview || undefined,
      phone: formData.phone
    };
    onReport(newReport);
    setSubmitted(true);
    setFormData({ name: '', age: '', gender: Gender.MALE, location: '', date: '', description: '', phone: '', email: '' });
    setPhotoPreview(null);
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/20">
          <CheckCircle2 className="text-emerald-600" size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">Report Submitted Successfully</h2>
        <p className="text-slate-500 font-medium text-center max-w-md leading-relaxed">
          Your report has been received and is currently in our <span className="text-blue-600 font-bold">Admin Review Queue</span>. 
          It will be visible to the public once verified by our team.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-10 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
        >
          Submit Another Case
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">File a New Report</h1>
        <p className="text-slate-500 mt-2 font-medium">Provide accurate information to help our community search effort.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-slate-200 p-12 shadow-sm space-y-8">
        {/* Photo Upload Area */}
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <label className="w-44 h-44 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 bg-slate-50/30 hover:bg-slate-50 hover:border-blue-300 transition-all cursor-pointer group shrink-0 relative overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <>
                <Camera className="text-slate-400 group-hover:text-blue-500" size={28} />
                <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Add Photo</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
          <div className="pt-4">
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Instructions</h3>
            <p className="text-slate-500 leading-relaxed font-medium text-sm max-w-sm">
              Please upload a clear, recent photo of the person. This is the most effective tool for identification.
            </p>
          </div>
        </div>

        {/* Row 1: Name, Age, Gender */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Samuel Okoth"
              className="w-full px-5 py-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium placeholder:text-slate-300 transition-all"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Approx. Age</label>
            <input 
              required
              type="number" 
              placeholder="24"
              className="w-full px-5 py-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium placeholder:text-slate-300 transition-all"
              value={formData.age}
              onChange={e => setFormData({...formData, age: e.target.value})}
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Gender</label>
            <div className="relative">
              <select 
                className="w-full px-5 py-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all appearance-none cursor-pointer"
                value={formData.gender}
                onChange={e => setFormData({...formData, gender: e.target.value as Gender})}
              >
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
                <option value={Gender.OTHER}>Other</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Location, Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative" ref={locationRef}>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Last Seen Location</label>
            <input 
              required
              type="text" 
              autoComplete="off"
              placeholder="e.g. Nairobi, Westlands"
              className="w-full px-5 py-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium placeholder:text-slate-300 transition-all"
              value={formData.location}
              onChange={e => handleLocationChange(e.target.value)}
              onFocus={() => { if(formData.location) setShowLocations(true) }}
            />
            {showLocations && filteredLocations.length > 0 && (
              <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                {filteredLocations.map((loc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="w-full text-left px-5 py-4 hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0 font-bold text-slate-700 text-sm"
                    onClick={() => {
                      setFormData({ ...formData, location: loc });
                      setShowLocations(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin size={14} className="text-blue-500" />
                      {loc}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date Missing</label>
            <div className="relative">
              <input 
                required
                type="text"
                placeholder="dd/mm/yyyy"
                className="w-full px-5 py-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium placeholder:text-slate-300 transition-all cursor-pointer"
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => { if(!e.target.value) e.target.type = 'text' }}
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
              <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-200 pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        {/* Row 3: Description */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
            <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-[8px] font-black text-blue-600 uppercase tracking-widest cursor-pointer hover:bg-blue-100 transition-colors">
              <Sparkles size={10} />
              Smart Tags
            </div>
          </div>
          <textarea 
            required
            rows={4}
            placeholder="What were they wearing? Notable features?"
            className="w-full px-6 py-5 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium placeholder:text-slate-300 transition-all resize-none shadow-inner"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        {/* Row 4: Phone, Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Phone</label>
            <input 
              required
              type="text" 
              placeholder="+254 7..."
              className="w-full px-5 py-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium placeholder:text-slate-300 transition-all"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Email</label>
            <input 
              type="email" 
              placeholder="Optional"
              className="w-full px-5 py-4 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium placeholder:text-slate-300 transition-all"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-5 bg-[#2563EB] text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.005] active:scale-[0.99] transition-all mt-4"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default SubmitReport;
