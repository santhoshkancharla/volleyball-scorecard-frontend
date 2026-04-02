import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Calendar, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';

const Fixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const res = await api.get('/api/matches');
        // display anything that isn't completed
        setFixtures(res.data.filter(m => m.status !== 'completed'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFixtures();
  }, []);

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="border-b-2 border-slate-900 pb-4 mb-6 mt-2">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
          <Calendar className="text-blue-600 w-6 h-6" /> Upcoming Fixtures
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest">Loading Schedule...</div>
      ) : fixtures.length > 0 ? (
        <div className="space-y-4">
          {fixtures.map(f => (
             <div key={f.match_id} className="pro-card flex flex-col md:flex-row items-center border-l-4 border-l-blue-600 group hover:-translate-y-1 transition-transform overflow-hidden">
                <div className="bg-slate-50 p-6 md:w-48 w-full border-r border-slate-100 flex flex-col items-center justify-center shrink-0">
                   <p className="text-slate-900 font-black text-lg">{new Date(f.match_date).toLocaleDateString()}</p>
                   <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mt-1">{new Date(f.match_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                
                <div className="flex-1 p-6 flex flex-col md:flex-row items-center justify-between gap-6 w-full">
                   <div className="flex-1 text-center md:text-right">
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{f.team1_name}</h3>
                   </div>
                   
                   <div className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded uppercase tracking-widest shrink-0">
                      VS
                   </div>
                   
                   <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{f.team2_name}</h3>
                   </div>
                </div>
                
                <div className="p-6 md:w-48 w-full bg-slate-50 border-l border-slate-100 flex flex-col justify-center items-center text-center shrink-0">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Venue</span>
                   <span className="text-sm font-black text-slate-900 truncate w-full">{f.venue}</span>
                   {f.status === 'live' && <span className="mt-2 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest border border-red-200 animate-pulse">Live Now</span>}
                </div>
             </div>
          ))}
        </div>
      ) : (
        <div className="pro-card p-16 text-center">
            <MonitorPlay className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">Schedule Empty</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
                The tournament organizers have not scheduled any upcoming matches yet. Stay tuned for updates.
            </p>
            <Link to="/" className="px-6 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors uppercase tracking-widest text-sm shadow-md">
                Return Home
            </Link>
        </div>
      )}
    </div>
  );
};

export default Fixtures;
