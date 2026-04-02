import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Bell, Megaphone, Calendar } from 'lucide-react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/api/announcements');
        setAnnouncements(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="border-b-2 border-slate-900 pb-4 mb-6 mt-2">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
          <Bell className="text-blue-600 w-6 h-6" /> Official Announcements
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest">Loading Broadcasts...</div>
      ) : announcements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map(a => (
            <div key={a.id} className="pro-card hover:shadow-lg transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 group-hover:bg-blue-500 transition-colors"></div>
               <div className="p-6 md:p-8">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-3 leading-tight group-hover:text-blue-600 transition-colors">{a.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed mb-6">
                    {a.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-4">
                     <Calendar className="w-4 h-4" />
                     {new Date(a.created_at).toLocaleString()}
                  </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pro-card p-16 text-center">
            <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">No Announcements</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
                Everything is running smoothly! Check back later for league updates and news.
            </p>
        </div>
      )}
    </div>
  );
};

export default Announcements;
