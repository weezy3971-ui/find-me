
import React, { useState } from 'react';
import { MissingPerson, CaseStatus, Sighting } from '../types';
import { ArrowLeft, Phone, Info, Eye, CheckCircle2, MapPin, Clock } from 'lucide-react';

interface CaseDetailsProps {
  person: MissingPerson;
  onBack: () => void;
  onSightingReport: (sighting: Sighting) => void;
}

const CaseDetails: React.FC<CaseDetailsProps> = ({ person, onBack, onSightingReport }) => {
  const [showSightingForm, setShowSightingForm] = useState(false);
  const [sightingDetails, setSightingDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSightingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSighting: Sighting = {
      id: Math.random().toString(36).substr(2, 9),
      details: sightingDetails,
      timestamp: new Date().toLocaleString(),
    };

    onSightingReport(newSighting);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setShowSightingForm(false);
      setIsSubmitted(false);
      setSightingDetails('');
    }, 3000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-left-4 duration-500 relative pb-10 md:pb-20">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] mb-6 md:mb-8 transition-colors"
      >
        <ArrowLeft size={14} strokeWidth={3} />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-0 lg:min-h-[600px] relative">
        {/* Left Side/Top: Photo */}
        <div className="w-full lg:w-[42%] bg-slate-100 relative overflow-hidden shrink-0 min-h-[350px] md:min-h-[400px]">
          {person.photoUrl ? (
            <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-4">
               <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-200 rounded-full flex items-center justify-center">
                  <Info size={32} />
               </div>
               <span className="font-bold text-[10px] md:text-sm tracking-widest uppercase">No Photo Available</span>
            </div>
          )}
          
          <div className="absolute top-4 left-4 md:top-6 md:left-6">
             <div className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black tracking-[0.1em] uppercase shadow-lg backdrop-blur-md ${
                person.status === CaseStatus.MISSING 
                  ? 'bg-red-500/90 text-white' 
                  : 'bg-emerald-500/90 text-white'
              }`}>
                {person.status}
              </div>
          </div>
        </div>

        {/* Right Side/Bottom: Info */}
        <div className="flex-1 p-6 md:p-10 lg:p-16 flex flex-col relative bg-white">
          <div className="flex justify-between items-start mb-2 md:mb-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-tight">{person.name}</h1>
          </div>
          <p className="text-lg md:text-xl text-slate-400 font-medium mb-6 md:mb-10 italic">Missing since {person.date}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 border-y border-slate-50 py-6 md:py-10 mb-6 md:mb-10">
            <div>
              <label className="block text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 md:mb-3">Last Seen Location</label>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-500" />
                <div className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">{person.location}</div>
              </div>
            </div>
            <div>
              <label className="block text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 md:mb-3">Profile Identity</label>
              <div className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">{person.age} Years • {person.gender}</div>
            </div>
          </div>

          <div className="mb-6 md:mb-10">
            <label className="block text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3 md:mb-4">Detailed Description</label>
            <div className="text-base md:text-xl font-medium text-slate-600 leading-relaxed border-l-4 border-blue-100 pl-4 md:pl-8 py-1">
              {person.description}
            </div>
          </div>

          {/* Sightings History Section */}
          {person.sightings && person.sightings.length > 0 && (
            <div className="mb-6 md:mb-10 animate-in fade-in duration-700">
               <label className="block text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 md:mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Recent Community Sightings
               </label>
               <div className="space-y-3 md:space-y-4">
                  {person.sightings.slice(0, 3).map((s) => (
                    <div key={s.id} className="bg-slate-50/80 rounded-xl md:rounded-2xl p-4 md:p-5 border border-slate-100/50">
                       <div className="flex flex-col md:flex-row items-start justify-between gap-2 md:gap-4">
                          <p className="text-slate-600 font-medium text-sm leading-relaxed">"{s.details}"</p>
                          <div className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-tighter shrink-0">
                             <Clock size={10} />
                             {s.timestamp}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          <div className="bg-slate-50/50 rounded-2xl md:rounded-[2rem] p-5 md:p-8 border border-slate-100 mt-auto flex items-center gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center text-blue-600 border border-slate-100 shrink-0">
                <Phone size={24} fill="currentColor" className="text-blue-500" />
              </div>
              <div className="min-w-0">
                <label className="block text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0.5 md:mb-1">Emergency Contact</label>
                <div className="text-lg md:text-2xl font-black text-slate-900 tracking-tight truncate">{person.phone || '+254 700 000 000'}</div>
              </div>
          </div>

          <button 
            disabled={person.status !== CaseStatus.MISSING}
            onClick={() => setShowSightingForm(true)}
            className={`w-full mt-6 md:mt-10 py-4 md:py-6 rounded-2xl md:rounded-3xl text-white font-black text-base md:text-xl uppercase tracking-widest shadow-xl md:shadow-2xl transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${
            person.status === CaseStatus.MISSING 
              ? 'bg-red-600 shadow-red-600/30' 
              : 'bg-emerald-600 shadow-emerald-600/30'
          }`}>
            {person.status === CaseStatus.MISSING ? 'Report a sighting' : 'Case successfully closed'}
          </button>

          {/* Sighting Overlay Form */}
          {showSightingForm && (
            <div className="fixed inset-0 lg:absolute lg:inset-x-8 lg:bottom-8 z-[70] flex items-end lg:items-center justify-center p-4 bg-black/40 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none animate-in fade-in duration-300">
              <div className="w-full max-w-xl bg-[#FFFDF2] border-2 border-amber-200 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl animate-in slide-in-from-bottom-8">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-6 md:py-10 text-amber-900 space-y-3 md:space-y-4 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-2 md:mb-4">
                       {/* Fix: replaced invalid md:size prop with Tailwind classes */}
                       <CheckCircle2 className="text-emerald-500 w-8 h-8 md:w-12 md:h-12" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tighter">Thank you!</h3>
                    <p className="font-medium text-amber-800/60 max-w-xs md:max-w-sm text-sm md:text-lg leading-relaxed">
                      Your sighting report has been sent to the reporter and authorities.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSightingSubmit} className="space-y-6 md:space-y-8">
                    <div className="flex items-center gap-3 md:gap-4 text-[#78350F]">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 rounded-xl md:rounded-2xl flex items-center justify-center">
                         {/* Fix: replaced invalid md:size prop with Tailwind classes */}
                         <Eye className="fill-current text-amber-700 w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-black tracking-tight">Report a Sighting</h3>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      <label className="block text-[10px] md:text-[11px] font-black text-[#B45309] uppercase tracking-[0.2em]">
                        Detailed description of the sighting
                      </label>
                      <textarea 
                        required
                        autoFocus
                        rows={3}
                        value={sightingDetails}
                        onChange={(e) => setSightingDetails(e.target.value)}
                        placeholder="Where, when, and any notable details..."
                        className="w-full px-5 py-4 md:px-8 md:py-6 bg-white border-2 border-amber-100 rounded-2xl md:rounded-3xl focus:ring-4 focus:ring-amber-200 focus:border-amber-400 outline-none font-medium text-amber-900 placeholder:text-amber-200 transition-all resize-none shadow-inner text-sm md:text-base"
                      />
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                      <button 
                        type="submit"
                        className="w-full md:flex-1 bg-[#D97706] hover:bg-[#B45309] text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-600/30 transition-all"
                      >
                        Send Alert
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowSightingForm(false)}
                        className="w-full md:px-10 bg-white border-2 border-amber-50 hover:bg-white/50 text-amber-700 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
