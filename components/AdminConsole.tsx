
import React, { useState } from 'react';
import { MissingPerson, CaseStatus } from '../types';
import { Check, Trash2, Heart, Search, ShieldCheck } from 'lucide-react';

interface AdminConsoleProps {
  reports: MissingPerson[];
  onUpdate: (id: string, update: Partial<MissingPerson>) => void;
  onDelete: (id: string) => void;
}

const AdminConsole: React.FC<AdminConsoleProps> = ({ reports, onUpdate, onDelete }) => {
  const [filter, setFilter] = useState<'QUEUE' | 'ALL'>('QUEUE');
  
  const queueItems = reports.filter(r => !r.verified);
  const approvedItems = reports.filter(r => r.verified);
  
  const displayItems = filter === 'QUEUE' ? queueItems : approvedItems;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Admin Console</h1>
          <p className="text-slate-500 mt-2 font-medium">Management workspace for cases</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setFilter('QUEUE')}
            className={`px-5 py-2 rounded-lg text-xs font-black tracking-widest uppercase transition-all ${
              filter === 'QUEUE' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Queue ({queueItems.length})
          </button>
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-5 py-2 rounded-lg text-xs font-black tracking-widest uppercase transition-all ${
              filter === 'ALL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Approved ({approvedItems.length})
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {displayItems.length > 0 ? (
          displayItems.map((report) => (
            <div key={report.id} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row gap-8 group hover:border-slate-300 transition-all relative">
              <div className="w-full md:w-56 h-56 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 overflow-hidden shrink-0">
                {report.photoUrl ? (
                  <img src={report.photoUrl} alt={report.name} className="w-full h-full object-cover" />
                ) : (
                  <Search size={32} className="text-slate-200" />
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{report.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase ${
                      report.status === CaseStatus.MISSING ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm font-bold mb-4">Reported {report.reportedAt}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <span className="block text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Age</span>
                      <span className="font-bold text-slate-700">{report.age} Years</span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Area</span>
                      <span className="font-bold text-slate-700">{report.location}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="block text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Description</span>
                    <p className="text-slate-500 italic leading-relaxed text-sm">"{report.description}"</p>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  {!report.verified ? (
                    <button 
                      onClick={() => onUpdate(report.id, { verified: true })}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                    >
                      <ShieldCheck size={16} />
                      Approve Report
                    </button>
                  ) : (
                    report.status === CaseStatus.MISSING && (
                      <button 
                        onClick={() => onUpdate(report.id, { status: CaseStatus.FOUND })}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all"
                      >
                        <Heart size={16} fill="white" />
                        Mark as Found
                      </button>
                    )
                  )}
                  <button 
                    onClick={() => onDelete(report.id)}
                    className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-500 font-bold text-xs uppercase tracking-widest rounded-xl border border-red-100 hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="absolute top-8 right-8 flex gap-2">
                {report.tags?.map(tag => (
                   <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-500 text-[8px] font-black tracking-widest uppercase rounded-md border border-blue-100">{tag}</span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-32 flex flex-col items-center justify-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                <Check className="text-emerald-500" size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Queue Clear</h2>
            <p className="text-slate-400 font-medium">No reports match the selected criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminConsole;
