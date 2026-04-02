import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Trash2, Megaphone, Send } from 'lucide-react';

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/api/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/announcements', formData, axiosConfig);
      setSuccess("Announcement broadcasted successfully!");
      setFormData({ title: '', description: '' });
      fetchAnnouncements();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create announcement.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await api.delete(`/api/announcements/${id}`, axiosConfig);
      fetchAnnouncements();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="pro-card">
         <div className="pro-header">
           <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
             <Send className="w-5 h-5 text-blue-600" /> Broadcast Update
           </h3>
         </div>
         <div className="p-6 bg-slate-50">
           {error && <div className="text-red-600 text-sm font-bold mb-4">{error}</div>}
           {success && <div className="text-green-700 text-sm font-bold mb-4">{success}</div>}
           <form onSubmit={handleCreate} className="space-y-4 max-w-2xl">
             <div>
               <label className="block text-xs font-black text-slate-700 uppercase mb-1">Headline</label>
               <input type="text" className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-600 outline-none text-sm font-semibold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required maxLength={200} />
             </div>
             <div>
               <label className="block text-xs font-black text-slate-700 uppercase mb-1">Message Body</label>
               <textarea className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-600 outline-none text-sm h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
             </div>
             <div className="flex justify-start">
                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded text-sm hover:bg-blue-700 uppercase tracking-widest flex items-center gap-2">Publish Now</button>
             </div>
           </form>
         </div>
      </div>

      <div className="pro-card overflow-hidden">
        <h3 className="pro-header font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-blue-600" /> Recent Broadcasts ({announcements.length})
        </h3>
        <div className="divide-y divide-slate-100">
          {announcements.map(a => (
            <div key={a.id} className="p-4 flex gap-4 items-start hover:bg-slate-50 relative group">
               <div className="w-10 h-10 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5" />
               </div>
               <div className="flex-1 pr-12">
                 <h4 className="font-bold text-slate-900 mb-1">{a.title}</h4>
                 <p className="text-sm text-slate-600 font-medium mb-2 leading-relaxed">{a.description}</p>
                 <span className="text-xs text-slate-400 font-bold">{new Date(a.created_at).toLocaleString()}</span>
               </div>
               <button onClick={() => handleDelete(a.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-2" title="Revoke Announcement">
                 <Trash2 className="w-5 h-5" />
               </button>
            </div>
          ))}
          {announcements.length === 0 && <div className="p-8 text-center font-medium text-slate-500">No recent broadcasts found.</div>}
        </div>
      </div>
    </div>
  );
};
export default AnnouncementManager;
