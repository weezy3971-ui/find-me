
import React, { useState, useEffect } from 'react';
import { AppView, User, MissingPerson } from './types';
import { INITIAL_REPORTS } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SubmitReport from './components/SubmitReport';
import MapViewComponent from './components/MapView';
import Profile from './components/Profile';
import AdminConsole from './components/AdminConsole';
import CaseDetails from './components/CaseDetails';
import Auth from './components/Auth';
import { saveData, getData, deleteData } from './db';
import { Menu, X, Shield } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<MissingPerson[]>([]);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. Initial Data Load
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const savedUser = await getData('user');
        const savedReports = await getData('reports');
        
        if (savedUser) setUser(savedUser);
        
        if (savedReports && Array.isArray(savedReports)) {
          const savedIds = new Set(savedReports.map(r => r.id));
          const merged = [...savedReports, ...INITIAL_REPORTS.filter(r => !savedIds.has(r.id))];
          setReports(merged);
        } else {
          setReports(INITIAL_REPORTS);
        }
      } catch (error) {
        console.error("Failed to load data from IndexedDB:", error);
        setReports(INITIAL_REPORTS);
      } finally {
        setIsLoaded(true);
      }
    };
    loadPersistedData();
  }, []);

  // 2. Deep Linking / Share URL Support
  useEffect(() => {
    if (isLoaded) {
      const params = new URLSearchParams(window.location.search);
      const caseId = params.get('case');
      if (caseId) {
        const exists = reports.find(r => r.id === caseId);
        if (exists) {
          setSelectedCaseId(caseId);
          setCurrentView(AppView.CASE_DETAILS);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [isLoaded, reports]);

  // 3. Persistence
  useEffect(() => {
    if (isLoaded) {
      saveData('reports', reports);
    }
  }, [reports, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        saveData('user', user);
      } else {
        deleteData('user');
      }
    }
  }, [user, isLoaded]);

  const handleLogout = () => {
    setUser(null);
    setSelectedCaseId(null);
    setCurrentView(AppView.DASHBOARD);
    setIsMobileMenuOpen(false);
  };

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-6">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="font-black uppercase tracking-[0.3em] text-sm animate-pulse">Initializing Secure Database</div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const verifiedReports = reports.filter(r => r.verified);

  const handleViewCase = (id: string) => {
    setSelectedCaseId(id);
    setCurrentView(AppView.CASE_DETAILS);
    setIsMobileMenuOpen(false);
  };

  const handleUpdateReport = (id: string, update: Partial<MissingPerson>) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, ...update } : r));
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard reports={verifiedReports} onViewCase={handleViewCase} />;
      case AppView.SUBMIT_REPORT:
        return <SubmitReport onReport={(report) => setReports([report, ...reports])} />;
      case AppView.MAP_VIEW:
        return <MapViewComponent reports={verifiedReports} />;
      case AppView.MY_PROFILE:
        return <Profile user={user} onUpdate={setUser} />;
      case AppView.CASE_DETAILS:
        const selectedCase = reports.find(r => r.id === selectedCaseId);
        if (!selectedCase) {
          setCurrentView(AppView.DASHBOARD);
          return null;
        }
        return (
          <CaseDetails 
            person={selectedCase} 
            onSightingReport={(sighting) => {
              const updatedSightings = [sighting, ...(selectedCase.sightings || [])];
              handleUpdateReport(selectedCase.id, { sightings: updatedSightings });
            }}
            onBack={() => {
              setSelectedCaseId(null);
              setCurrentView(AppView.DASHBOARD);
            }} 
          />
        );
      case AppView.ADMIN_CONSOLE:
        return (
          <AdminConsole 
            reports={reports} 
            onUpdate={handleUpdateReport} 
            onDelete={(id) => {
              if (confirm('Are you sure you want to delete this case permanently?')) {
                setReports(prev => prev.filter(r => r.id !== id));
              }
            }}
          />
        );
      default:
        return <Dashboard reports={verifiedReports} onViewCase={handleViewCase} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-inter flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg">
              <Shield className="w-5 h-5 text-white" fill="white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Find Me</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar - Desktop and Mobile Overlay */}
      <div className={`fixed inset-0 z-40 transition-opacity duration-300 lg:relative lg:inset-auto lg:block ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto'}`}>
        <div className="absolute inset-0 bg-black/50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute left-0 top-0 bottom-0 w-64 transform transition-transform duration-300 lg:transform-none lg:relative ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar 
            currentView={currentView} 
            onViewChange={(view) => {
              setSelectedCaseId(null);
              setCurrentView(view);
              setIsMobileMenuOpen(false);
            }} 
            user={user} 
            onLogout={handleLogout} 
          />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
