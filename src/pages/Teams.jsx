import { Users, Search, MapPin, UserSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { API_BASE_URL } from '../utils/api';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get('/api/teams');
        setTeams(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(t => 
     t.team_name.toLowerCase().includes(search.toLowerCase()) || 
     t.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b-2 border-slate-900 pb-4 mb-6 gap-4">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
          <Users className="text-blue-600 w-6 h-6" /> Teams Directory
        </h2>
        
        <div className="relative w-full md:w-72">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
           <input 
              type="text" 
              placeholder="Search by team or city..." 
              className="w-full bg-white border border-slate-300 text-slate-900 pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest">Loading Teams Directory...</div>
      ) : filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredTeams.map(team => (
              <div key={team.team_id} className="pro-card group hover:-translate-y-1 transition-transform overflow-hidden flex flex-col">
                 <div className="bg-slate-100 p-8 flex justify-center items-center h-48 border-b border-slate-200">
                    {team.team_image ? (
                       <img src={team.team_image.startsWith('/') ? `${API_BASE_URL}${team.team_image}` : team.team_image} alt={team.team_name} className="w-32 h-32 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                       <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-inner text-slate-300">
                          <Users className="w-12 h-12" />
                       </div>
                    )}
                 </div>
                 <div className="p-6 text-center flex-1 bg-white">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase mb-4">{team.team_name}</h3>
                    
                    <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 mb-2">
                       <MapPin className="w-4 h-4 text-blue-600" />
                       {team.city}
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-600">
                       <UserSquare className="w-4 h-4 text-blue-600" />
                       Coach {team.coach_name}
                    </div>
                 </div>
                 <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
                    <Link to={`/teams/${team.team_id}`} className="block text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors w-full h-full">View Roster →</Link>
                 </div>
              </div>
           ))}
        </div>
      ) : (
        <div className="pro-card p-16 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">No Teams Found</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
                {search ? "No teams match your search criteria." : "Teams have not been added to the public directory yet."}
            </p>
        </div>
      )}
    </div>
  );
};

export default Teams;
