
import React, { useState } from 'react';
import { MissingPerson, CaseStatus } from '../types';
import { Search, MapPin, Users, AlertTriangle, CheckCircle, Share2, ChevronRight } from 'lucide-react';

interface DashboardProps {
  reports: MissingPerson[];
  onViewCase: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ reports, onViewCase }) => {
  const [search, setSearch] = useState('');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  
  const total = reports.length;
  const missing = reports.filter(r => r.status === CaseStatus.MISSING).length;
  const found = reports.filter(r => r.status === CaseStatus.FOUND).length;

  const filteredReports = reports.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleShare = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const url = `${window.location.origin}?case=${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyFeedback(id);
      setTimeout(() => setCopyFeedback(null), 2000);
    });
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Live Reports</h1>
          <p className="text-slate-500 mt-1 md:mt-2 font-medium text-sm md:text-base">Real-time alerts and community updates</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search name or location..." 
            className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl md:rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <StatCard 
            icon={<Users className="text-blue-600" size={20} />} 
            label="TOTAL CASES" 
            value={total} 
            bgColor="bg-blue-50"
        />
        <StatCard 
            icon={<AlertTriangle className="text-red-600" size={20} />} 
            label="STILL MISSING" 
            value={missing} 
            bgColor="bg-red-50"
        />
        <StatCard 
            icon={<CheckCircle className="text-emerald-600" size={20} />} 
            label="FOUND SAFE" 
            value={found} 
            bgColor="bg-emerald-50"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
        {/* Mobile View: Card List */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredReports.map((report) => (
            <div 
              key={report.id} 
              onClick={() => onViewCase(report.id)}
              className="p-4 active:bg-slate-50 transition-colors flex items-center gap-4 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-100 overflow-hidden shrink-0">
                {report.photoUrl ? (
                  <img src={report.photoUrl} alt={report.name} className="w-full h-full object-cover" />
                ) : (
                  <Users size={20} className="text-slate-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="font-bold text-slate-900 truncate pr-2">{report.name}</div>
                  <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter shrink-0 ${
                    report.status === CaseStatus.MISSING ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                   <MapPin size={10} className="text-blue-500" />
                   <span className="truncate">{report.location}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">{report.date} • {report.gender}</div>
              </div>
              <div className="flex flex-col items-center gap-2 pl-2">
                <button 
                  onClick={(e) => handleShare(e, report.id)}
                  className={`p-2 rounded-lg ${copyFeedback === report.id ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400'}`}
                >
                  <Share2 size={16} />
                </button>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </div>
          ))}
          {filteredReports.length === 0 && (
            <div className="p-12 text-center text-slate-400 font-medium italic text-sm">
              No matching records found.
            </div>
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Person Details</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Last Seen</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden shrink-0">
                        {report.photoUrl ? (
                          <img src={report.photoUrl} alt={report.name} className="w-full h-full object-cover" />
                        ) : (
                          <Users size={20} className="text-slate-300" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-lg leading-tight">{report.name}</div>
                        <div className="text-sm text-slate-400 font-medium">{report.age} years • {report.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <MapPin size={16} className="text-blue-500" />
                      {report.location}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-slate-500 font-medium">
                    {report.date}
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-tighter uppercase ${
                      report.status === CaseStatus.MISSING 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={(e) => handleShare(e, report.id)}
                        className={`p-2 rounded-lg transition-all ${
                          copyFeedback === report.id ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        title="Copy case link"
                      >
                        <Share2 size={18} />
                      </button>
                      <button 
                        onClick={() => onViewCase(report.id)}
                        className="text-blue-600 hover:text-blue-700 font-bold text-sm tracking-tight inline-flex items-center gap-1"
                      >
                        View Profile
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {copyFeedback && (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-slate-900 text-white px-5 md:px-6 py-3 rounded-xl md:rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 z-[60]">
          <CheckCircle size={16} className="text-emerald-400" />
          <span className="font-bold text-[12px] md:text-sm uppercase tracking-tight">Copied!</span>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; bgColor: string }> = ({ icon, label, value, bgColor }) => (
  <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4 md:gap-8 group hover:shadow-md transition-shadow cursor-default">
    <div className={`w-12 h-12 md:w-16 md:h-16 ${bgColor} rounded-xl md:rounded-2xl flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div>
      <div className="text-[9px] md:text-[11px] font-black text-slate-400 tracking-widest mb-0.5 md:mb-1">{label}</div>
      <div className="text-2xl md:text-4xl font-black text-slate-900">{value}</div>
    </div>
  </div>
);

export default Dashboard;
