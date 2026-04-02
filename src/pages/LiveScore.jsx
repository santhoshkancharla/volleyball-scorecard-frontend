import { useEffect, useState } from 'react';
import api, { API_BASE_URL } from '../utils/api';
import { io } from 'socket.io-client';
import { Globe, RefreshCw } from 'lucide-react';

const socket = io(API_BASE_URL);

const LiveScore = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      // Fetch both matches and announcements concurrently
      const [mRes, aRes] = await Promise.all([
         api.get('/api/matches'),
         api.get('/api/announcements')
      ]);

      const active = mRes.data.filter(m => m.status === 'live');
      
      // Load sets for active matches
      for (const match of active) {
        const setsRes = await api.get(`/api/matches/${match.match_id}/sets`);
        match.sets = setsRes.data;
      }
      
      setLiveMatches(active);
      
      // Get the next 3 pending fixtures
      setFixtures(mRes.data.filter(m => m.status !== 'completed' && m.status !== 'live').slice(0, 3));
      
      // Get the 3 most recent announcements
      setAnnouncements(aRes.data.slice(0, 3));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    socket.on('scoreUpdated', () => {
      fetchDashboardData();
    });

    return () => {
      socket.off('scoreUpdated');
    };
  }, []);

  if (loading) return <div className="text-center py-20 text-blue-600 font-bold animate-pulse tracking-widest uppercase">Fetching Live Terminal...</div>;

  return (
    <div className="flex flex-col gap-6 w-full pb-8 animate-in fade-in duration-500">
      {/* ESPNCricinfo Style Header */}
      <div className="flex justify-between items-center mb-2">
         <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
            <span className="w-1.5 h-6 bg-red-600 rounded-full inline-block"></span>
            Live Matches
         </h2>
         <button onClick={fetchDashboardData} className="text-slate-500 hover:text-blue-600 flex items-center gap-1.5 text-sm font-bold transition-colors">
            <RefreshCw className="w-4 h-4" /> REFRESH
         </button>
      </div>

      {liveMatches.length === 0 && (
         <div className="pro-card p-12 text-center text-slate-500 font-bold tracking-widest uppercase">
            No matches are currently live.
         </div>
      )}

      {liveMatches.map(match => {
        const currentSet = match.sets?.length > 0 ? match.sets[match.sets.length - 1] : { set_number: 1, team1_score: 0, team2_score: 0 };
        return (
          <div key={match.match_id} className="pro-card">
             {/* Match Header Bar */}
             <div className="pro-header flex justify-between px-4 sm:px-6 py-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                   <div className="badge-live"><div className="badge-live-pulse"></div> LIVE</div>
                   <span className="text-sm font-bold text-slate-500 truncate max-w-[150px] sm:max-w-none">Volleyball Pro League • Set {currentSet.set_number}</span>
                </div>
                {/* Visual Set History Columns */}
                <div className="flex justify-end gap-1.5 sm:gap-2 text-xs font-bold text-slate-400">
                   <span className="w-6 sm:w-8 text-center bg-slate-100 rounded text-slate-600">S1</span>
                   <span className="w-6 sm:w-8 text-center bg-slate-100 rounded text-slate-600">S2</span>
                   <span className="w-6 sm:w-8 text-center bg-slate-100 rounded text-slate-600">S3</span>
                   <span className="w-6 sm:w-8 text-center hidden sm:inline-block">S4</span>
                   <span className="w-6 sm:w-8 text-center hidden sm:inline-block">S5</span>
                </div>
             </div>

             {/* Match Body - Team 1 */}
             <div className="p-4 sm:p-6 pb-2">
                 <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                    <div className="flex items-center gap-4 flex-1">
                       <img src={match.team1_image?.startsWith('/') ? `${API_BASE_URL}${match.team1_image}` : match.team1_image || 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=200&h=200&fit=crop'} alt={match.team1_name} className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded shadow-sm border border-slate-200 shrink-0" />
                       <h3 className="font-black text-slate-900 text-lg sm:text-xl uppercase tracking-tight leading-none">{match.team1_name}</h3>
                       {currentSet.team1_score > currentSet.team2_score && <span className="bg-blue-600 text-white text-[10px] px-1 rounded uppercase tracking-widest ml-2 hidden lg:block shrink-0">Serving</span>}
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                       <div className="text-5xl font-black text-slate-900 w-16 text-right leading-none">{currentSet.team1_score}</div>
                       <div className="hidden sm:flex gap-1.5 sm:gap-2 text-sm font-bold text-slate-500">
                          {match.sets && match.sets.map((s, idx) => (
                             <span key={idx} className={`w-8 text-center flex items-center justify-center rounded bg-slate-50 ${s.team1_score > s.team2_score ? 'text-blue-600' : ''}`}>{s.team1_score}</span>
                          ))}
                          {Array.from({length: Math.max(0, 5 - (match.sets?.length || 0))}).map((_, i) => <span key={'empty_'+i} className="w-8 text-center flex items-center justify-center">-</span>)}
                       </div>
                    </div>
                 </div>

                 {/* Match Body - Team 2 */}
                 <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4 flex-1">
                       <img src={match.team2_image?.startsWith('/') ? `${API_BASE_URL}${match.team2_image}` : match.team2_image || 'https://images.unsplash.com/photo-1628193850720-6d45e451b68f?w=200&h=200&fit=crop'} alt={match.team2_name} className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded shadow-sm border border-slate-200 shrink-0" />
                       <h3 className="font-black text-slate-900 text-lg sm:text-xl uppercase tracking-tight leading-none">{match.team2_name}</h3>
                       {currentSet.team2_score > currentSet.team1_score && <span className="bg-blue-600 text-white text-[10px] px-1 rounded uppercase tracking-widest ml-2 hidden lg:block shrink-0">Serving</span>}
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                       <div className="text-5xl font-black text-slate-900 w-16 text-right leading-none">{currentSet.team2_score}</div>
                       <div className="hidden sm:flex gap-1.5 sm:gap-2 text-sm font-bold text-slate-500">
                          {match.sets && match.sets.map((s, idx) => (
                             <span key={idx} className={`w-8 text-center flex items-center justify-center rounded bg-slate-50 ${s.team2_score > s.team1_score ? 'text-blue-600' : ''}`}>{s.team2_score}</span>
                          ))}
                          {Array.from({length: Math.max(0, 5 - (match.sets?.length || 0))}).map((_, i) => <span key={'empty_'+i} className="w-8 text-center flex items-center justify-center">-</span>)}
                       </div>
                    </div>
                 </div>
                 
                 {/* Match Footer Info */}
                 <div className="mt-8 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <Globe className="w-4 h-4 text-blue-500" />
                       <span className="truncate">Best of {match.total_sets}. LIVE Broadcast.</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider font-bold shrink-0">Refresh →</button>
                 </div>
             </div>
          </div>
        );
      })}

      {/* Grid of details at bottom - ESPN Style Dynamic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="pro-card border-t-4 border-t-red-600 divide-y divide-slate-100 h-fit">
             <div className="p-4 bg-slate-50"><h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Top Stories & News</h4></div>
             
             {announcements.map(a => (
                <div key={a.id} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors group">
                   <h5 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-blue-600 leading-snug">{a.title}</h5>
                   <p className="text-xs text-slate-500 font-medium truncate">{a.description}</p>
                   <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{new Date(a.created_at).toLocaleDateString()}</p>
                </div>
             ))}
             {announcements.length === 0 && <div className="p-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">No Recent News</div>}
          </div>
          
          <div className="pro-card border-t-4 border-t-blue-600 divide-y divide-slate-100 h-fit">
             <div className="p-4 bg-slate-50"><h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Key Fixtures</h4></div>
             
             {fixtures.map(f => (
                <div key={f.match_id} className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors group">
                    <div className="flex flex-col gap-1 w-[60%]">
                       <span className="font-black text-slate-900 text-sm truncate uppercase">{f.team1_name}</span>
                       <span className="font-black text-slate-900 text-sm truncate uppercase">{f.team2_name}</span>
                    </div>
                    <div className="text-right w-[35%]">
                       <span className="block text-xs font-bold text-blue-600 truncate">{new Date(f.match_date).toLocaleDateString()}</span>
                       <span className="block text-xs font-medium text-slate-500 truncate">{f.venue}</span>
                    </div>
                </div>
             ))}
             {fixtures.length === 0 && <div className="p-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">No Upcoming Fixtures</div>}
          </div>
      </div>
    </div>
  );
};

export default LiveScore;
