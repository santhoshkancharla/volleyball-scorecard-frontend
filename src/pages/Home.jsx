import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trophy, Activity, Users, ArrowRight, MapPin, Calendar, Flame, Medal } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [featuredMatch, setFeaturedMatch] = useState(null);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, mRes, sRes] = await Promise.all([
           api.get('/api/announcements'),
           api.get('/api/matches'),
           api.get('/api/settings')
        ]);
        
        setAnnouncements(aRes.data.slice(0, 4)); // top 4 news
        setSettings(sRes.data);
        
        const liveMatch = mRes.data.find(m => m.status === 'live');
        if (liveMatch) {
           const setsRes = await api.get(`/api/matches/${liveMatch.match_id}/sets`);
           liveMatch.sets = setsRes.data;
           setFeaturedMatch(liveMatch);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Volleyball Themed League Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-xl shadow-lg border-b-4 border-b-blue-500 flex flex-col md:flex-row items-center justify-between p-6 md:px-12 md:py-8 overflow-hidden relative">
         {/* Abstract Court Lines Background Pattern */}
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
               <defs>
                  <pattern id="court" width="100" height="100" patternUnits="userSpaceOnUse">
                     <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="2"/>
                  </pattern>
               </defs>
               <rect width="100%" height="100%" fill="url(#court)" />
            </svg>
         </div>

         <div className="flex items-center gap-6 relative z-10 w-full md:w-auto mb-6 md:mb-0">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur rounded-full flex items-center justify-center border-2 border-white/20 shadow-inner shrink-0">
               <Trophy className="w-10 h-10 md:w-12 md:h-12 text-yellow-400" />
            </div>
            <div>
               <h3 className="text-blue-200 font-bold uppercase tracking-widest text-xs md:text-sm mb-1 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" /> {settings?.organizer || 'Official Competition'}
               </h3>
               <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-2 drop-shadow-md">
                  {settings?.league_name || 'Premier Volley League'}
               </h1>
               <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-bold text-white/90">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-400" /> {settings?.location || 'National Arena'}</span>
                  <span className="hidden md:inline-block text-white/30">•</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-blue-400" /> {settings?.season || 'Season 2026'}</span>
               </div>
            </div>
         </div>

         <div className="relative z-10 w-full md:w-auto flex justify-start md:justify-end">
             <Link to="/fixtures" className="bg-white hover:bg-slate-100 text-blue-900 px-6 py-3 rounded-md font-black uppercase tracking-widest transition-colors shadow-lg flex items-center gap-2 text-sm">
                View Schedule <ArrowRight className="w-4 h-4" />
             </Link>
         </div>
      </div>

      {/* Featured Match Hero Overlay */}
      <section className="relative overflow-hidden rounded-xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row min-h-[450px]">
        <div className="absolute inset-0 z-0">
           {featuredMatch ? (
             <img src="https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=2500" alt="Volleyball Match" className="w-full h-full object-cover opacity-50 mix-blend-overlay scale-105" />
           ) : (
             <img src="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2500" alt="Volleyball" className="w-full h-full object-cover opacity-40 scale-105" />
           )}
           <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-slate-900/95 to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end md:justify-center w-full md:w-2/3 lg:w-3/4">
           {featuredMatch ? (
              <div className="animate-in slide-in-from-left-4 duration-700 fade-in">
                 <span className="bg-red-600 text-white text-xs font-black px-4 py-1.5 uppercase tracking-[0.2em] rounded-sm w-fit mb-6 flex items-center gap-2 shadow-lg shadow-red-600/30">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    LIVE COURT ACTION
                 </span>
                 <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none tracking-tighter uppercase text-white drop-shadow-xl border-l-4 border-blue-500 pl-4">
                       {featuredMatch.team1_name}
                    </h1>
                    <h2 className="text-2xl font-black uppercase tracking-widest text-slate-500 pl-4 my-2">VS</h2>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none tracking-tighter uppercase text-white drop-shadow-xl border-l-4 border-red-500 pl-4">
                       {featuredMatch.team2_name}
                    </h1>
                 </div>
                 <p className="text-blue-200 text-lg md:text-xl font-bold mt-8 mb-8 max-w-xl border-t border-slate-700 pt-6">
                    Feel the intensity. Catch every spike, block, and point instantly on the Live Center.
                 </p>
              </div>
           ) : (
              <div className="animate-in slide-in-from-bottom-4 duration-700 fade-in">
                 <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 uppercase tracking-[0.2em] rounded-sm w-fit mb-6 border border-blue-500 shadow-lg shadow-blue-600/20 block">Official Broadcast</span>
                 <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[0.9] tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 drop-shadow-2xl">
                    COMMAND<br/>THE COURT
                 </h1>
                 <p className="text-slate-300 text-lg md:text-xl font-medium mb-10 max-w-xl leading-relaxed">
                    Track the biggest plays, live score updates, and exclusive tournament analytics seamlessly across the entire league.
                 </p>
              </div>
           )}
           
           <div className="flex flex-wrap gap-4 font-bold">
              <Link to="/live" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-sm transition-all flex items-center gap-3 tracking-[0.1em] uppercase text-sm shadow-xl shadow-blue-600/30 hover:-translate-y-1">
                 <Activity className="w-5 h-5" /> MATCH CENTER
              </Link>
           </div>
        </div>
      </section>

      {/* Grid of News / Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Content Column */}
         <div className="lg:col-span-2 space-y-6">
            
            <div className="flex justify-between items-end border-b-[3px] border-slate-900 pb-2">
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                  <Medal className="w-6 h-6 text-blue-600" /> League Headlines
               </h2>
               <Link to="/announcements" className="text-blue-600 font-black hover:text-blue-800 transition-colors text-xs uppercase tracking-[0.15em]">All News →</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {announcements.map((a, i) => (
                  <Link to="/announcements" key={a.id} className="group cursor-pointer flex flex-col">
                     <div className="w-full h-48 bg-slate-900 rounded-sm overflow-hidden mb-4 relative drop-shadow-md">
                        <img src={`https://images.unsplash.com/photo-1593786480164-cd4460f38b16?q=80&w=600&h=400&fit=crop&q=${i}`} alt="Volleyball News" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-sm tracking-[0.2em] uppercase shadow-md">Breaking</div>
                     </div>
                     <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 uppercase tracking-wide">{a.title}</h3>
                     <p className="text-sm text-slate-600 mt-2 line-clamp-2 font-medium leading-relaxed">{a.description}</p>
                     <p className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> {new Date(a.created_at).toLocaleDateString()}
                     </p>
                  </Link>
               ))}
               {announcements.length === 0 && (
                  <div className="col-span-2 text-center text-slate-400 font-black tracking-widest uppercase py-16 bg-white border-2 border-dashed border-slate-200 rounded-sm">
                     No official press releases generated.
                  </div>
               )}
            </div>
         </div>
         
         {/* Right Sidebar equivalent - Quick Stats Panel */}
         <div className="space-y-6">
            <div className="flex justify-between items-end border-b-[3px] border-slate-900 pb-2">
               <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Quick Access</h2>
            </div>
            
            <div className="bg-white border-t-4 border-blue-600 shadow-xl overflow-hidden rounded-sm">
               <div className="divide-y divide-slate-100">
                  <Link to="/teams" className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-sm flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"><Users className="w-5 h-5" /></div>
                        <div className="flex flex-col">
                           <span className="font-black text-slate-900 uppercase tracking-wide text-sm">Team Database</span>
                           <span className="text-xs font-bold text-slate-400">View Rosters & Stats</span>
                        </div>
                     </div>
                     <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                  <Link to="/fixtures" className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-sm flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"><Calendar className="w-5 h-5" /></div>
                        <div className="flex flex-col">
                           <span className="font-black text-slate-900 uppercase tracking-wide text-sm">Season Schedule</span>
                           <span className="text-xs font-bold text-slate-400">Upcoming Fixtures</span>
                        </div>
                     </div>
                     <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                  <Link to="/history" className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors group">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-sm flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"><Trophy className="w-5 h-5" /></div>
                        <div className="flex flex-col">
                           <span className="font-black text-slate-900 uppercase tracking-wide text-sm">Match Archives</span>
                           <span className="text-xs font-bold text-slate-400">Past Results & Winners</span>
                        </div>
                     </div>
                     <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </Link>
               </div>
            </div>
            
            {/* Ad or Promo Box */}
            <div className="bg-slate-900 text-white p-6 rounded-sm shadow-xl relative overflow-hidden group">
               <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1593786480164-cd4460f38b16?q=80&w=600')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
               <div className="relative z-10 flex flex-col items-center text-center">
                  <Flame className="w-8 h-8 text-orange-500 mb-3 drop-shadow-lg" />
                  <h3 className="font-black text-xl mb-1 uppercase tracking-tighter">League Pass Pro</h3>
                  <p className="text-xs font-bold text-slate-300 px-4 mb-4">Unlock ad-free premium stats and court-side camera angles.</p>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-xs tracking-widest py-2 px-6 rounded-sm w-full transition-colors shadow-lg shadow-orange-500/30">Upgrade Now</button>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default Home;
