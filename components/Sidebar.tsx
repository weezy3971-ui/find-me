
import React from 'react';
import { AppView, User } from '../types';
import { 
  LayoutDashboard, 
  PlusSquare, 
  Map as MapIcon, 
  User as UserIcon, 
  ShieldCheck, 
  LogOut,
  Shield
} from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, user, onLogout }) => {
  const navItems = [
    { id: AppView.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { id: AppView.SUBMIT_REPORT, icon: PlusSquare, label: 'Submit Report' },
    { id: AppView.MAP_VIEW, icon: MapIcon, label: 'Map View' },
    { id: AppView.MY_PROFILE, icon: UserIcon, label: 'My Profile' },
  ];

  if (user.type === 'ADMIN') {
    navItems.push({ id: AppView.ADMIN_CONSOLE, icon: ShieldCheck, label: 'Admin Console' });
  }

  return (
    <aside className="w-full h-full bg-[#0F172A] text-white flex flex-col shrink-0 border-r border-slate-800/50 overflow-hidden">
      <div className="p-6 hidden lg:flex items-center gap-3 shrink-0">
        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Shield className="w-6 h-6" fill="white" />
        </div>
        <span className="text-xl font-bold tracking-tight">Find Me</span>
      </div>

      <nav className="flex-1 mt-4 lg:mt-6 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <item.icon size={20} strokeWidth={currentView === item.id ? 2.5 : 2} />
            <span className="font-medium text-sm md:text-base">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t border-slate-800 shrink-0">
        <div className="flex items-center gap-3 px-2 py-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-slate-300 shrink-0">
            {user.name[0].toUpperCase()}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-sm truncate">{user.name}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">{user.type}</span>
          </div>
        </div>
        <button 
          type="button"
          onClick={() => onLogout()}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-red-500/10 rounded-xl transition-all group"
        >
          <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
          <span className="text-sm font-medium group-hover:text-red-400 transition-colors">Logout</span>
        </button>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
