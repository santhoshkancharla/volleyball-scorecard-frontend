import { Clock, ArchiveRestore, Trophy, Calendar, MapPin, ChevronRight, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import api, { API_BASE_URL } from '../utils/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/api/matches');
        const completed = res.data.filter(m => m.status === 'completed');
        
        // Fetch sets to determine winner logic
        for (const match of completed) {
           const setsRes = await api.get(`/api/matches/${match.match_id}/sets`);
           match.sets = setsRes.data;
           
           let t1Wins = 0, t2Wins = 0;
           match.sets.forEach(s => {
              if (s.team1_score > s.team2_score) t1Wins++;
              else if (s.team2_score > s.team1_score) t2Wins++;
           });
           
           if (t1Wins > t2Wins) match.winner_id = match.team1_id;
           else if (t2Wins > t1Wins) match.winner_id = match.team2_id;
           else match.winner_id = null;
           
           match.t1Wins = t1Wins;
           match.t2Wins = t2Wins;
        }
        
        // Sort by date descending
        completed.sort((a,b) => new Date(b.match_date) - new Date(a.match_date));
        setHistory(completed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="border-b-2 border-slate-900 pb-4 mb-6 mt-2">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
          <Clock className="text-blue-600 w-6 h-6" /> Match History & Archives
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest">Compiling Archives...</div>
      ) : history.length > 0 ? (
        <div className="space-y-6">
           {history.map(match => {
              const team1Won = match.winner_id === match.team1_id;
              const team2Won = match.winner_id === match.team2_id;
              const isExpanded = expandedId === match.match_id;

              return (
                 <div key={match.match_id} className="pro-card hover:shadow-lg transition-shadow bg-white flex flex-col border-l-4 border-l-slate-300 overflow-hidden">
                    {/* Main Row */}
                    <div className="flex flex-col md:flex-row">
                       {/* Left Meta Info */}
                       <div className="p-6 md:w-56 bg-slate-50 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-slate-100 text-center shrink-0">
                          <span className="text-sm font-black text-slate-900 bg-white px-3 py-1 rounded shadow-sm border border-slate-200 mb-3 block">
                             FINAL SCORE
                          </span>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
                             <Calendar className="w-4 h-4" /> {new Date(match.match_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                             <MapPin className="w-4 h-4" /> {match.venue}
                          </div>
                       </div>
                       
                       {/* Main Score Area */}
                       <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                          
                          {/* Team 1 */}
                          <div className={`flex flex-col items-center md:items-end flex-1 ${team1Won ? 'opacity-100' : 'opacity-70 grayscale-[30%]'}`}>
                             <div className="flex items-center gap-3 mb-2">
                                {team1Won && <Trophy className="w-6 h-6 text-yellow-500 animate-pulse" />}
                                <img src={match.team1_image?.startsWith('/') ? `${API_BASE_URL}${match.team1_image}` : match.team1_image || 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=100&h=100'} alt={match.team1_name} className="w-10 h-10 object-cover rounded shadow-sm border border-slate-200" />
                             </div>
                             <h3 className={`text-xl md:text-2xl font-black uppercase tracking-tight text-center md:text-right ${team1Won ? 'text-slate-900' : 'text-slate-600'}`}>
                                {match.team1_name}
                             </h3>
                          </div>

                          {/* Central Score */}
                          <div className="flex items-center gap-4 shrink-0 bg-slate-100 px-6 py-4 rounded-lg border border-slate-300 shadow-inner">
                             <span className={`text-4xl font-black ${team1Won ? 'text-blue-600' : 'text-slate-700'}`}>{match.t1Wins}</span>
                             <span className="text-lg font-bold text-slate-400">-</span>
                             <span className={`text-4xl font-black ${team2Won ? 'text-blue-600' : 'text-slate-700'}`}>{match.t2Wins}</span>
                          </div>

                          {/* Team 2 */}
                          <div className={`flex flex-col items-center md:items-start flex-1 ${team2Won ? 'opacity-100' : 'opacity-70 grayscale-[30%]'}`}>
                             <div className="flex items-center gap-3 mb-2">
                                <img src={match.team2_image?.startsWith('/') ? `${API_BASE_URL}${match.team2_image}` : match.team2_image || 'https://images.unsplash.com/photo-1628193850720-6d45e451b68f?w=100&h=100'} alt={match.team2_name} className="w-10 h-10 object-cover rounded shadow-sm border border-slate-200" />
                                {team2Won && <Trophy className="w-6 h-6 text-yellow-500 animate-pulse" />}
                             </div>
                             <h3 className={`text-xl md:text-2xl font-black uppercase tracking-tight text-center md:text-left ${team2Won ? 'text-slate-900' : 'text-slate-600'}`}>
                                {match.team2_name}
                             </h3>
                          </div>
                       </div>
                       
                       {/* Right Action / Details */}
                       <div 
                          onClick={() => toggleExpand(match.match_id)}
                          className={`bg-slate-50 md:bg-white border-t md:border-t-0 md:border-l border-slate-100 p-6 flex flex-col justify-center items-center shrink-0 w-full md:w-32 hover:bg-slate-100 transition-colors cursor-pointer group ${isExpanded ? 'bg-slate-100' : ''}`}
                       >
                          <div className={`w-10 h-10 rounded-full flex flex-col items-center justify-center transition-colors mb-2 ${isExpanded ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500 group-hover:bg-blue-600 group-hover:text-white'}`}>
                             {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest text-center ${isExpanded ? 'text-blue-600' : 'text-slate-400'}`}>Scorecard</span>
                       </div>
                    </div>

                    {/* Expandable Scorecard Detail */}
                    {isExpanded && (
                       <div className="bg-slate-900 text-white p-6 md:p-8 animate-in slide-in-from-top-4 duration-300">
                           <h4 className="text-center font-black uppercase tracking-widest text-slate-400 text-xs mb-6">Detailed Set Breakdown</h4>
                           <div className="max-w-3xl mx-auto overflow-x-auto">
                              <table className="w-full text-center border-collapse">
                                 <thead>
                                    <tr className="border-b border-slate-800 text-slate-500 font-bold text-xs uppercase tracking-widest">
                                       <th className="py-2 text-left w-1/3">Team</th>
                                       {match.sets.map((s) => (
                                          <th key={s.set_number} className="py-2 px-4 border-l border-slate-800">Set {s.set_number}</th>
                                       ))}
                                    </tr>
                                 </thead>
                                 <tbody>
                                    <tr className="border-b border-slate-800">
                                       <td className="py-4 text-left font-black tracking-tight text-lg">{match.team1_name} {team1Won && <Trophy className="w-4 h-4 inline text-yellow-500 ml-1" />}</td>
                                       {match.sets.map((s) => (
                                          <td key={s.set_number} className={`py-4 px-4 font-black text-xl border-l border-slate-800 ${s.team1_score > s.team2_score ? 'text-white' : 'text-slate-500'}`}>
                                             {s.team1_score}
                                          </td>
                                       ))}
                                    </tr>
                                    <tr>
                                       <td className="py-4 text-left font-black tracking-tight text-lg">{match.team2_name} {team2Won && <Trophy className="w-4 h-4 inline text-yellow-500 ml-1" />}</td>
                                       {match.sets.map((s) => (
                                          <td key={s.set_number} className={`py-4 px-4 font-black text-xl border-l border-slate-800 ${s.team2_score > s.team1_score ? 'text-white' : 'text-slate-500'}`}>
                                             {s.team2_score}
                                          </td>
                                       ))}
                                    </tr>
                                 </tbody>
                              </table>
                           </div>
                       </div>
                    )}
                 </div>
              );
           })}
        </div>
      ) : (
        <div className="pro-card p-16 text-center">
            <ArchiveRestore className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">History Empty</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
                No matches have been completed yet. Once an ongoing match finishes and is marked "COMPLETE" by an admin, its final scorecard will be archived here.
            </p>
        </div>
      )}
    </div>
  );
};

export default History;
