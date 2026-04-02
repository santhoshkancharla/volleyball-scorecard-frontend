import { useState, useEffect } from 'react';
import api, { API_BASE_URL } from '../../utils/api';
import { Trash2, Plus, Users, Image as ImageIcon, Edit2, X } from 'lucide-react';

const TeamManager = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ team_name: '', coach_name: '', city: '' });
  const [teamImage, setTeamImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

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

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.team_name || !formData.coach_name || !formData.city) {
       setError("All text fields are required.");
       return;
    }

    const data = new FormData();
    data.append('team_name', formData.team_name);
    data.append('coach_name', formData.coach_name);
    data.append('city', formData.city);
    if (teamImage) {
      data.append('team_image', teamImage);
    }

    try {
      if (editingId) {
        await api.put(`/api/teams/${editingId}`, data, {
           headers: { ...axiosConfig.headers, 'Content-Type': 'multipart/form-data' }
        });
        setSuccess("Team updated successfully!");
      } else {
        await api.post('/api/teams', data, {
           headers: { ...axiosConfig.headers, 'Content-Type': 'multipart/form-data' }
        });
        setSuccess("Team created successfully!");
      }
      setFormData({ team_name: '', coach_name: '', city: '' });
      setTeamImage(null);
      setEditingId(null);
      fetchTeams();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save team.');
    }
  };

  const handleEdit = (team) => {
    setFormData({ team_name: team.team_name, coach_name: team.coach_name, city: team.city });
    setEditingId(team.team_id);
    setTeamImage(null);
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ team_name: '', coach_name: '', city: '' });
    setTeamImage(null);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    try {
      await api.delete(`/api/teams/${id}`, axiosConfig);
      fetchTeams();
    } catch (err) {
      alert("Failed to delete team.");
    }
  };

  if (loading) return <div className="text-slate-500 p-8">Loading teams...</div>;

  return (
    <div className="space-y-6">
      <div className="pro-card">
         <div className="pro-header flex justify-between items-center">
           <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
             {editingId ? <Edit2 className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
             {editingId ? 'Edit Team' : 'Register New Team'}
           </h3>
           {editingId && (
             <button onClick={handleCancelEdit} className="text-slate-500 hover:text-slate-700 bg-slate-100 p-1.5 rounded-md flex items-center gap-1 text-xs font-bold uppercase transition-colors">
               <X className="w-4 h-4" /> Cancel
             </button>
           )}
         </div>
         <div className="p-6 bg-slate-50">
           {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm font-bold mb-4 border border-red-200">{error}</div>}
           {success && <div className="bg-green-50 text-green-700 p-3 rounded text-sm font-bold mb-4 border border-green-200">{success}</div>}
           
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-black text-slate-700 uppercase mb-1">Team Name</label>
               <input type="text" className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white text-sm" value={formData.team_name} onChange={e => setFormData({...formData, team_name: e.target.value})} maxLength={100} />
             </div>
             <div>
               <label className="block text-xs font-black text-slate-700 uppercase mb-1">Coach Name</label>
               <input type="text" className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white text-sm" value={formData.coach_name} onChange={e => setFormData({...formData, coach_name: e.target.value})} maxLength={100} />
             </div>
             <div>
               <label className="block text-xs font-black text-slate-700 uppercase mb-1">City / Region</label>
               <input type="text" className="w-full border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-600 focus:outline-none bg-white text-sm" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} maxLength={100} />
             </div>
             <div>
               <label className="block text-xs font-black text-slate-700 uppercase mb-1">Team Logo (Optional)</label>
               <div className="relative border border-slate-300 rounded bg-white flex items-center px-3 py-1.5 focus-within:ring-1 focus-within:ring-blue-600">
                  <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input type="file" accept="image/*" className="w-full text-sm ml-6 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" onChange={e => setTeamImage(e.target.files[0])} />
               </div>
             </div>
             <div className="md:col-span-2 flex justify-end mt-2 gap-3">
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded text-sm hover:bg-slate-300 transition-colors uppercase tracking-widest shadow-sm">Cancel</button>
                )}
                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded text-sm hover:bg-blue-700 transition-colors uppercase tracking-widest shadow-sm">
                  {editingId ? 'Update Team' : 'Add Team'}
                </button>
             </div>
           </form>
         </div>
      </div>

      <div className="pro-card">
         <div className="pro-header flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Registered Teams ({teams.length})
            </h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
               <thead className="bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-wider border-b border-slate-200">
                 <tr>
                   <th className="px-6 py-3 border-r border-slate-200/50">Logo</th>
                   <th className="px-6 py-3 border-r border-slate-200/50">Team Name</th>
                   <th className="px-6 py-3 border-r border-slate-200/50">Coach</th>
                   <th className="px-6 py-3 border-r border-slate-200/50">City</th>
                   <th className="px-6 py-3 text-center w-24">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 bg-white">
                 {teams.map(team => (
                   <tr key={team.team_id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-3 border-r border-slate-100">
                        {team.team_image ? (
                           <img src={team.team_image.startsWith('/') ? `${API_BASE_URL}${team.team_image}` : team.team_image} alt="logo" className="w-10 h-10 object-cover rounded shadow-sm border border-slate-200" />
                        ) : (
                           <div className="w-10 h-10 bg-slate-200 rounded flex items-center justify-center text-slate-400 text-xs font-bold shadow-inner">N/A</div>
                        )}
                     </td>
                     <td className="px-6 py-3 font-bold text-slate-900 border-r border-slate-100">{team.team_name}</td>
                     <td className="px-6 py-3 border-r border-slate-100 font-medium">{team.coach_name}</td>
                     <td className="px-6 py-3 border-r border-slate-100 text-slate-500">{team.city}</td>
                     <td className="px-6 py-3 text-center flex justify-center gap-2">
                        <button onClick={() => handleEdit(team)} className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition-colors" title="Edit Team">
                           <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(team.team_id)} className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors" title="Delete Team">
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </td>
                   </tr>
                 ))}
                 {teams.length === 0 && (
                   <tr>
                     <td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-medium">No teams registered in the database.</td>
                   </tr>
                 )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default TeamManager;
