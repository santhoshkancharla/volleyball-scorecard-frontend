import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Settings, Save, Globe, MapPin, Calendar, Flag } from 'lucide-react';

const SettingsManager = () => {
  const [formData, setFormData] = useState({ league_name: '', location: '', season: '', organizer: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const fetchSettings = async () => {
    try {
      const res = await api.get('/api/settings');
      if(res.data) {
         setFormData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.put('/api/settings', formData, axiosConfig);
      setSuccess("League configuration updated successfully! This is now live on the homepage.");
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update settings.');
    }
  };

  if (loading) return <div className="text-slate-500 font-bold p-8">Loading configuration...</div>;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="pro-card">
         <div className="pro-header">
           <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
             <Settings className="w-5 h-5 text-blue-600" /> Global League Configuration
           </h3>
         </div>
         <div className="p-4 sm:p-6 md:p-8 bg-slate-50">
           {error && <div className="bg-red-50 text-red-600 p-4 rounded text-sm font-bold mb-6 border border-red-200">{error}</div>}
           {success && <div className="bg-green-50 text-green-700 p-4 rounded text-sm font-bold mb-6 border border-green-200">{success}</div>}
           
           <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
             
             <div className="space-y-4 bg-white p-4 sm:p-6 rounded-lg border border-slate-200 shadow-sm">
                <div>
                   <label className="text-xs font-black text-slate-700 uppercase mb-2 flex items-center gap-2"><Globe className="w-4 h-4 text-slate-400" /> Official League Name</label>
                   <input type="text" className="w-full border border-slate-300 rounded p-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm font-semibold text-slate-900" 
                      value={formData.league_name} 
                      onChange={e => setFormData({...formData, league_name: e.target.value})} 
                      required maxLength={100} placeholder="e.g. Premier Volley League" />
                </div>

                <div>
                   <label className="text-xs font-black text-slate-700 uppercase mb-2 flex items-center gap-2"><Flag className="w-4 h-4 text-slate-400" /> Tournament Organizer</label>
                   <input type="text" className="w-full border border-slate-300 rounded p-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm font-semibold text-slate-900" 
                      value={formData.organizer} 
                      onChange={e => setFormData({...formData, organizer: e.target.value})} 
                      required maxLength={100} placeholder="e.g. National Sports Association" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="text-xs font-black text-slate-700 uppercase mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> Location / Venue</label>
                      <input type="text" className="w-full border border-slate-300 rounded p-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm font-semibold text-slate-900" 
                         value={formData.location} 
                         onChange={e => setFormData({...formData, location: e.target.value})} 
                         required maxLength={100} placeholder="e.g. Metro Arena" />
                   </div>
                   <div>
                      <label className="text-xs font-black text-slate-700 uppercase mb-2 flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> Season Timeline</label>
                      <input type="text" className="w-full border border-slate-300 rounded p-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm font-semibold text-slate-900" 
                         value={formData.season} 
                         onChange={e => setFormData({...formData, season: e.target.value})} 
                         required maxLength={50} placeholder="e.g. Season 2026" />
                   </div>
                </div>
             </div>

             <div className="flex justify-start pt-2">
                <button type="submit" className="bg-blue-600 text-white font-black py-3 px-8 rounded text-sm hover:bg-blue-700 transition-colors uppercase tracking-widest shadow-md flex items-center gap-2">
                   <Save className="w-4 h-4" /> Save Configuration
                </button>
             </div>
           </form>
         </div>
      </div>
    </div>
  );
};

export default SettingsManager;
