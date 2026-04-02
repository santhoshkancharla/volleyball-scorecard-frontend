import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Trash2, UserPlus, Users2, Edit2, X } from 'lucide-react';

const PlayerManager = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({ player_name: '', team_id: '', position: '', jersey_number: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      const [pRes, tRes] = await Promise.all([
        api.get('/api/players'),
        api.get('/api/teams')
      ]);
      setPlayers(pRes.data);
      setTeams(tRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.team_id) return setError("Please select a team.");
    try {
      if (editingId) {
        await api.put(`/api/players/${editingId}`, formData, axiosConfig);
        setSuccess("Player updated successfully!");
      } else {
        await api.post('/api/players', formData, axiosConfig);
        setSuccess("Player added successfully!");
      }
      setFormData({ player_name: '', team_id: '', position: '', jersey_number: '' });
      setEditingId(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save player.');
    }
  };

  const handleEdit = (player) => {
    setFormData({
      player_name: player.player_name,
      team_id: player.team_id,
      position: player.position || '',
      jersey_number: player.jersey_number || ''
    });
    setEditingId(player.player_id);
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ player_name: '', team_id: '', position: '', jersey_number: '' });
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this player?")) return;
    try {
      await api.delete(`/api/players/${id}`, axiosConfig);
      fetchData();
    } catch (err) {
      alert("Failed to delete player.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="pro-card">
         <div className="pro-header flex justify-between items-center">
           <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
             {editingId ? <Edit2 className="w-5 h-5 text-blue-600" /> : <UserPlus className="w-5 h-5 text-blue-600" />} 
             {editingId ? 'Edit Player' : 'Waitlist New Player'}
           </h3>
           {editingId && (
             <button onClick={handleCancelEdit} className="text-slate-500 hover:text-slate-700 bg-slate-100 p-1.5 rounded-md flex items-center gap-1 text-xs font-bold uppercase transition-colors">
               <X className="w-4 h-4" /> Cancel
             </button>
           )}
         </div>
         <div className="p-6 bg-slate-50">
           {error && <div className="text-red-600 text-sm font-bold mb-4">{error}</div>}
           {success && <div className="text-green-700 text-sm font-bold mb-4">{success}</div>}
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
             <div>
               <label className="block text-xs font-black text-slate-700 uppercase mb-1">Player Name</label>
               <input type="text" className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-600 outline-none text-sm font-semibold" value={formData.player_name} onChange={e => setFormData({...formData, player_name: e.target.value})} required />
             </div>
             <div>
               <label className="block text-xs font-black text-slate-700 uppercase mb-1">Assign Team</label>
               <select className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-600 outline-none text-sm font-semibold bg-white" value={formData.team_id} onChange={e => setFormData({...formData, team_id: e.target.value})} required>
                 <option value="">-- Select Team --</option>
                 {teams.map(team => <option key={team.team_id} value={team.team_id}>{team.team_name}</option>)}
               </select>
             </div>
             <div>
               <label className="block text-xs font-black text-slate-700 uppercase mb-1">Position</label>
               <input type="text" className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-600 outline-none text-sm font-semibold" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} placeholder="e.g. Spiker" />
             </div>
             <div>
               <label className="block text-xs font-black text-slate-700 uppercase mb-1">Jersey No.</label>
               <input type="number" className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-600 outline-none text-sm font-semibold" value={formData.jersey_number} onChange={e => setFormData({...formData, jersey_number: e.target.value})} />
             </div>
             <div className="lg:col-span-4 flex justify-end mt-2 gap-3">
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded text-sm hover:bg-slate-300 uppercase tracking-widest shadow-sm transition-colors">Cancel</button>
                )}
                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded text-sm hover:bg-blue-700 uppercase tracking-widest shadow-sm transition-colors">
                  {editingId ? 'Update Player' : 'Save Player'}
                </button>
             </div>
           </form>
         </div>
      </div>

      <div className="pro-card p-0 overflow-hidden">
        <h3 className="pro-header font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
          <Users2 className="w-5 h-5 text-blue-600" /> Active Roster ({players.length})
        </h3>
        <table className="w-full text-left text-sm text-slate-600">
           <thead className="bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-wider border-b border-slate-200">
             <tr>
               <th className="px-6 py-3 border-r border-slate-200 text-center w-16">No.</th>
               <th className="px-6 py-3 border-r border-slate-200">Player</th>
               <th className="px-6 py-3 border-r border-slate-200">Team</th>
               <th className="px-6 py-3 border-r border-slate-200">Position</th>
               <th className="px-6 py-3 text-center w-24">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100 bg-white">
             {players.map(p => (
               <tr key={p.player_id} className="hover:bg-slate-50">
                 <td className="px-6 py-3 border-r border-slate-100 font-black text-slate-900 text-center">{p.jersey_number || '-'}</td>
                 <td className="px-6 py-3 border-r border-slate-100 font-bold text-slate-900">{p.player_name}</td>
                 <td className="px-6 py-3 border-r border-slate-100 font-semibold text-blue-600">{p.team_name}</td>
                 <td className="px-6 py-3 border-r border-slate-100">{p.position}</td>
                 <td className="px-6 py-3 text-center flex justify-center gap-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition-colors" title="Edit Player"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.player_id)} className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                 </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </div>
  );
};
export default PlayerManager;
