import { useState, useEffect } from 'react';
import { LogOut, ShieldCheck, Activity, Users, Settings, Mic, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TeamManager from '../../components/admin/TeamManager';
import PlayerManager from '../../components/admin/PlayerManager';
import AnnouncementManager from '../../components/admin/AnnouncementManager';
import MatchManager from '../../components/admin/MatchManager';
import SettingsManager from '../../components/admin/SettingsManager';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('matches');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const tabs = [
    { id: 'matches', label: 'Match Control', icon: Activity },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'players', label: 'Player List', icon: List },
    { id: 'announcements', label: 'Announcements', icon: Mic },
    { id: 'settings', label: 'Config', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'teams': return <TeamManager />;
      case 'players': return <PlayerManager />;
      case 'announcements': return <AnnouncementManager />;
      case 'matches': return <MatchManager />;
      case 'settings': return <SettingsManager />;
      default: return null;
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 min-h-[60vh]">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 pro-card p-4 flex flex-col h-fit shrink-0 border-t-4 border-t-slate-900">
         <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 mt-2">
           <ShieldCheck className="w-7 h-7 text-blue-600" />
           <div className="flex flex-col">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">Admin Hub</h2>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Authorized Access</span>
           </div>
         </div>
         
         <div className="flex flex-col gap-1 flex-grow">
           {tabs.map((tab) => (
             <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`text-left px-4 py-3 rounded-md transition-colors text-sm font-bold uppercase tracking-wide flex items-center gap-3 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
             >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-400'}`} />
                {tab.label}
             </button>
           ))}
         </div>

         <div className="mt-8 pt-4 border-t border-slate-100 pl-4 text-xs font-semibold text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse block"></span>
            Socket Channel Online
         </div>

         <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 text-sm font-bold px-4 py-3 rounded-md transition-colors mt-2 cursor-pointer uppercase tracking-widest border border-transparent hover:border-red-100">
           <LogOut className="w-4 h-4" />
           Terminate Session
         </button>
      </div>
      
      {/* Main Dynamically Rendered Content Pane */}
      <div className="flex-1 w-full min-w-0 flex flex-col gap-4">
        <div className="border-b-2 border-slate-900 pb-2">
           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
             {tabs.find(t=>t.id===activeTab)?.label}
           </h2>
        </div>
        
        {/* Render the selected manager component here */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
           {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
