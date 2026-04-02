import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { API_BASE_URL } from '../utils/api';
import { Users, ArrowLeft, MapPin, UserSquare } from 'lucide-react';

const TeamDetails = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const [teamsRes, playersRes] = await Promise.all([
          api.get('/api/teams'),
          api.get('/api/players')
        ]);
        
        const foundTeam = teamsRes.data.find(t => t.team_id.toString() === id);
        if (foundTeam) {
            setTeam(foundTeam);
            setPlayers(playersRes.data.filter(p => p.team_id.toString() === id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamData();
  }, [id]);

  if (loading) return <div className="py-20 text-center font-bold text-slate-500 uppercase tracking-widest">Loading Roster...</div>;
  if (!team) return <div className="py-20 text-center font-bold text-red-500 uppercase tracking-widest">Team not found</div>;

  return (
    <div className="w-full animate-in fade-in duration-500 space-y-6">
       <div className="border-b-2 border-slate-900 pb-4 mt-2">
         <Link to="/teams" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Teams Directory
         </Link>
       </div>
       
       <div className="pro-card p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white">
          <div className="w-48 h-48 shrink-0">
             {team.team_image ? (
                <img src={team.team_image.startsWith('/') ? `${API_BASE_URL}${team.team_image}` : team.team_image} alt={team.team_name} className="w-full h-full object-contain drop-shadow-xl" />
             ) : (
                <div className="w-full h-full bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-300 shadow-inner">
                   <Users className="w-16 h-16" />
                </div>
             )}
          </div>
          
          <div className="text-center md:text-left flex-1">
             <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight leading-none mb-6">{team.team_name}</h1>
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                <div className="flex items-center gap-3 text-slate-700 font-black tracking-wide uppercase bg-slate-50 px-4 py-3 rounded border border-slate-200 shadow-sm">
                   <MapPin className="w-5 h-5 text-blue-600" /> {team.city}
                </div>
                <div className="flex items-center gap-3 text-slate-700 font-black tracking-wide uppercase bg-slate-50 px-4 py-3 rounded border border-slate-200 shadow-sm">
                   <UserSquare className="w-5 h-5 text-blue-600" /> COACH {team.coach_name}
                </div>
             </div>
          </div>
       </div>

       <div className="pro-card overflow-hidden">
          <div className="pro-header bg-white border-b-2 border-slate-100">
             <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" /> Active Player Roster ({players.length})
             </h3>
          </div>
          {players.length > 0 ? (
             <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-xs uppercase bg-slate-50 text-slate-400 font-black tracking-widest border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-4 border-r border-slate-100 text-center w-24">Jersey</th>
                        <th className="px-6 py-4 border-r border-slate-100">Player Name</th>
                        <th className="px-6 py-4">Position Function</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {players.map(p => (
                       <tr key={p.player_id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-5 text-center font-black text-slate-900 text-lg border-r border-slate-100">{p.jersey_number || '-'}</td>
                          <td className="px-6 py-5 font-black text-slate-900 uppercase border-r border-slate-100 flex items-center gap-3">
                             <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600 font-black shadow-inner hidden sm:flex">{p.player_name.charAt(0)}</div>
                             {p.player_name}
                          </td>
                          <td className="px-6 py-5 font-bold text-slate-500 uppercase tracking-wide text-xs">{p.position || 'Rotation Player'}</td>
                       </tr>
                    ))}
                </tbody>
             </table>
          ) : (
             <div className="p-16 text-center text-slate-500 font-bold uppercase tracking-widest">
                No active players have been assigned to this roster yet.
             </div>
          )}
       </div>
    </div>
  );
};

export default TeamDetails;
