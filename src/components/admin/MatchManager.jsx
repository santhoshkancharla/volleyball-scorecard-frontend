import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../utils/api';
import { Plus, List, Save, Activity, CheckCircle, Wifi, WifiOff, Loader2 } from 'lucide-react';

const MatchManager = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Create Match State
  const [newMatch, setNewMatch] = useState({ team1_id: '', team2_id: '', match_date: '', venue: '', total_sets: 3, points_per_set: 25 });
  
  // Active Management State
  const [managingMatch, setManagingMatch] = useState(null);
  const [activeSets, setActiveSets] = useState([]);
  const [editSet, setEditSet] = useState({ set_number: 1, team1_score: 0, team2_score: 0 });

  // Auto-save state
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const debounceTimer = useRef(null);
  const isInitialLoad = useRef(true); // skip auto-save on panel open

  const token = localStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      const [mRes, tRes] = await Promise.all([
        api.get('/api/matches'),
        api.get('/api/teams')
      ]);
      setMatches(mRes.data);
      setTeams(tRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    if(newMatch.team1_id === newMatch.team2_id) return setError("Teams must be different.");
    try {
      await api.post('/api/matches', newMatch, axiosConfig);
      setSuccess("Match scheduled successfully!");
      setNewMatch({ team1_id: '', team2_id: '', match_date: '', venue: '', total_sets: 3, points_per_set: 25 });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create match.');
    }
  };

  const openManager = async (match) => {
    isInitialLoad.current = true;
    setManagingMatch(match);
    setSaveStatus('idle');
    try {
      const res = await api.get(`/api/matches/${match.match_id}/sets`);
      setActiveSets(res.data);
      const latestSet = res.data.length > 0 ? res.data[res.data.length - 1] : { set_number: 1, team1_score: 0, team2_score: 0 };
      setEditSet({ set_number: latestSet.set_number, team1_score: latestSet.team1_score, team2_score: latestSet.team2_score });
    } catch (err) {
      console.error("Failed to load sets");
    }
  };

  // Auto-save effect: triggers 700ms after any score/set change
  useEffect(() => {
    if (!managingMatch) return;
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    setSaveStatus('saving');
    clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        await api.post(`/api/matches/${managingMatch.match_id}/sets`, editSet, axiosConfig);
        const res = await api.get(`/api/matches/${managingMatch.match_id}/sets`);
        setActiveSets(res.data);
        setSaveStatus('saved');
        // Reset to idle after 2 seconds
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (err) {
        setSaveStatus('error');
        setError('Auto-save failed. Try again.');
      }
    }, 700);

    return () => clearTimeout(debounceTimer.current);
  }, [editSet, managingMatch?.match_id]);

  const handleUpdateStatus = async (status) => {
    try {
      await api.put(`/api/matches/${managingMatch.match_id}`, { status }, axiosConfig);
      setSuccess(`Match marked as ${status.toUpperCase()}`);
      setManagingMatch({...managingMatch, status});
      fetchData();
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  // Save status indicator config
  const statusConfig = {
    idle:   { icon: <Wifi className="w-3.5 h-3.5" />,    label: 'Auto-save On',     cls: 'text-slate-400 bg-slate-100' },
    saving: { icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, label: 'Saving...', cls: 'text-blue-600 bg-blue-50' },
    saved:  { icon: <CheckCircle className="w-3.5 h-3.5" />, label: '✓ Live',        cls: 'text-green-600 bg-green-50' },
    error:  { icon: <WifiOff className="w-3.5 h-3.5" />,  label: 'Save Failed',    cls: 'text-red-500 bg-red-50' },
  };
  const status = statusConfig[saveStatus];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Top Section: Create Match */}
         <div className="lg:col-span-1 pro-card h-fit">
            <div className="pro-header">
              <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Schedule Match
              </h3>
            </div>
            <div className="p-4 bg-slate-50">
               {error && <div className="text-red-600 text-sm font-bold mb-3">{error}</div>}
               {success && <div className="text-green-700 text-sm font-bold mb-3">{success}</div>}
               <form onSubmit={handleCreateMatch} className="space-y-3">
                 <div>
                   <label className="block text-xs font-black text-slate-700 uppercase mb-1">Team 1 (Home)</label>
                   <select className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-600 outline-none text-sm font-semibold bg-white" required value={newMatch.team1_id} onChange={e=>setNewMatch({...newMatch, team1_id:e.target.value})}>
                     <option value="">- Select -</option>
                     {teams.map(t => <option key={t.team_id} value={t.team_id}>{t.team_name}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-black text-slate-700 uppercase mb-1">Team 2 (Away)</label>
                   <select className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-600 outline-none text-sm font-semibold bg-white" required value={newMatch.team2_id} onChange={e=>setNewMatch({...newMatch, team2_id:e.target.value})}>
                     <option value="">- Select -</option>
                     {teams.map(t => <option key={t.team_id} value={t.team_id}>{t.team_name}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-black text-slate-700 uppercase mb-1">Date & Time</label>
                   <input type="datetime-local" className="w-full border border-slate-300 rounded p-2 outline-none text-sm font-semibold bg-white" required value={newMatch.match_date} onChange={e=>setNewMatch({...newMatch, match_date:e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-xs font-black text-slate-700 uppercase mb-1">Venue</label>
                   <input type="text" className="w-full border border-slate-300 rounded p-2 outline-none text-sm font-semibold bg-white" required value={newMatch.venue} onChange={e=>setNewMatch({...newMatch, venue:e.target.value})} placeholder="Main Court" />
                 </div>
                 <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 mt-2 rounded border border-blue-700 hover:bg-blue-700 uppercase tracking-widest text-xs">Create Fixture</button>
               </form>
            </div>
         </div>

         {/* Right Section: Manage Matches */}
         <div className="lg:col-span-2 pro-card overflow-hidden">
             <div className="pro-header">
               <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
                 <List className="w-5 h-5 text-blue-600" /> Match Roster
               </h3>
             </div>
             
             {managingMatch ? (
                <div className="p-0">
                   {/* Score Control Interface */}
                   <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
                       <button onClick={() => setManagingMatch(null)} className="absolute top-4 right-4 text-xs font-bold text-slate-400 border border-slate-600 rounded px-2 py-1 hover:text-white hover:border-white transition-colors">Close</button>
                       <div className="flex items-center justify-center gap-3 mb-4">
                         <h4 className="text-xl font-black uppercase tracking-tight">Live Interface</h4>
                         <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border transition-all ${status.cls} ${
                           saveStatus === 'saved' ? 'border-green-200' : saveStatus === 'saving' ? 'border-blue-200' : saveStatus === 'error' ? 'border-red-200' : 'border-slate-200'
                         }`}>
                           {status.icon}
                           {status.label}
                         </span>
                       </div>
                      
                      <div className="flex justify-between items-center bg-slate-800 rounded-lg p-4 border border-slate-700 mb-6 w-full max-w-lg mx-auto">
                         <div className="flex-1 text-center font-bold text-lg">{managingMatch.team1_name}</div>
                         <div className="text-sm font-black tracking-widest text-slate-500 px-4">VS</div>
                         <div className="flex-1 text-center font-bold text-lg">{managingMatch.team2_name}</div>
                      </div>

                      <div className="bg-white rounded-lg p-6 text-slate-900 w-full max-w-lg mx-auto shadow-2xl">
                         <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                            <div>
                               <label className="block text-xs font-black text-slate-500 uppercase">Set Number</label>
                               <input type="number" min="1" max="5" value={editSet.set_number} onChange={e=>setEditSet({...editSet, set_number: parseInt(e.target.value)})} className="text-2xl font-black w-16 bg-slate-100 rounded text-center outline-none border border-slate-300 mt-1" />
                            </div>
                            <div className="flex gap-2">
                               <button onClick={() => handleUpdateStatus('live')} className={`flex items-center gap-1 text-[10px] uppercase font-black px-2 py-1 rounded ${managingMatch.status==='live'?'bg-red-600 text-white':'bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600'}`}><Activity className="w-3 h-3"/> Live</button>
                               <button onClick={() => handleUpdateStatus('completed')} className={`flex items-center gap-1 text-[10px] uppercase font-black px-2 py-1 rounded ${managingMatch.status==='completed'?'bg-green-600 text-white':'bg-slate-100 text-slate-600 hover:bg-green-100 hover:text-green-600'}`}><CheckCircle className="w-3 h-3"/> Complete</button>
                            </div>
                         </div>

                         <div className="flex justify-between items-center mb-8 gap-4 text-center">
                            <div className="flex-1">
                               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 truncate max-w-[120px] mx-auto">{managingMatch.team1_name}</p>
                               <input type="number" value={editSet.team1_score} onChange={e=>setEditSet({...editSet, team1_score: parseInt(e.target.value)})} className="text-5xl font-black w-24 text-center bg-slate-50 border border-slate-200 rounded py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 block mx-auto" />
                               <div className="flex justify-center gap-2 mt-2">
                                  <button type="button" onClick={()=>setEditSet(s => ({...s, team1_score: Math.max(0, s.team1_score - 1)}))} className="w-8 h-8 rounded bg-slate-200 font-bold hover:bg-red-200 text-lg leading-none">-</button>
                                  <button type="button" onClick={()=>setEditSet(s => ({...s, team1_score: s.team1_score + 1}))} className="w-8 h-8 rounded bg-blue-100 font-bold hover:bg-blue-200 text-blue-700 text-lg leading-none">+</button>
                               </div>
                            </div>
                            <div className="text-3xl font-light text-slate-300">-</div>
                            <div className="flex-1">
                               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 truncate max-w-[120px] mx-auto">{managingMatch.team2_name}</p>
                               <input type="number" value={editSet.team2_score} onChange={e=>setEditSet({...editSet, team2_score: parseInt(e.target.value)})} className="text-5xl font-black w-24 text-center bg-slate-50 border border-slate-200 rounded py-2 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 block mx-auto" />
                               <div className="flex justify-center gap-2 mt-2">
                                  <button type="button" onClick={()=>setEditSet(s => ({...s, team2_score: Math.max(0, s.team2_score - 1)}))} className="w-8 h-8 rounded bg-slate-200 font-bold hover:bg-red-200 text-lg leading-none">-</button>
                                  <button type="button" onClick={()=>setEditSet(s => ({...s, team2_score: s.team2_score + 1}))} className="w-8 h-8 rounded bg-blue-100 font-bold hover:bg-blue-200 text-blue-700 text-lg leading-none">+</button>
                               </div>
                            </div>
                         </div>
                         
                          <div className={`mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all duration-300
                            text-xs font-bold uppercase tracking-widest
                            ${saveStatus === 'saving' ? 'bg-blue-50 border-blue-200 text-blue-600' : saveStatus === 'saved' ? 'bg-green-50 border-green-200 text-green-600' : saveStatus === 'error' ? 'bg-red-50 border-red-200 text-red-500' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                            {status.icon}
                            {saveStatus === 'idle' ? 'Changes auto-broadcast to live feed' : status.label}
                          </div>
                      </div>
                   </div>
                </div>
             ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                     <thead className="bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider border-b border-slate-200">
                       <tr>
                         <th className="px-4 py-3 border-r border-slate-200/50">Teams (Home vs Away)</th>
                         <th className="px-4 py-3 border-r border-slate-200/50">Date & Venue</th>
                         <th className="px-4 py-3 border-r border-slate-200/50">Status</th>
                         <th className="px-4 py-3 text-center">Control</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 bg-white">
                       {matches.map(m => (
                         <tr key={m.match_id} className="hover:bg-slate-50">
                           <td className="px-4 py-4 border-r border-slate-100">
                              <div className="font-black text-slate-900 leading-tight mb-1">{m.team1_name}</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">vs</div>
                              <div className="font-black text-slate-900 leading-tight">{m.team2_name}</div>
                           </td>
                           <td className="px-4 py-4 border-r border-slate-100 font-medium">
                              <div>{new Date(m.match_date).toLocaleDateString()}</div>
                              <div className="text-xs text-slate-500">{m.venue}</div>
                           </td>
                           <td className="px-4 py-4 border-r border-slate-100">
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-widest ${m.status === 'live' ? 'bg-red-100 text-red-700 border border-red-200' : m.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-700 border border-slate-300'}`}>
                                 {m.status}
                              </span>
                           </td>
                           <td className="px-4 py-4 text-center">
                              <button onClick={() => openManager(m)} className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-black uppercase px-3 py-1.5 rounded transition-colors tracking-wider whitespace-nowrap">
                                 Launch Panel
                              </button>
                           </td>
                         </tr>
                       ))}
                       {matches.length === 0 && <tr><td colSpan="4" className="text-center p-8 text-slate-500 font-medium">No matches scheduled.</td></tr>}
                     </tbody>
                  </table>
                </div>
             )}
         </div>
      </div>
    </div>
  );
};
export default MatchManager;
