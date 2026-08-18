import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Mail, Lock, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      if(res.data.user.role === 'admin'){
        navigate('/admin');
        window.location.reload(); 
      } else {
        navigate('/');
      }
    } catch (err) {
      if (!err.response) {
        setError('Network Error: Unable to reach the server. Please check your internet connection or backend API URL.');
      } else {
        setError(err.response.data?.message || 'Invalid username or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-[75vh] pro-card overflow-hidden">
      
      {/* Left Image Splash Section */}
      <div className="hidden md:block md:w-[45%] lg:w-1/2 relative bg-slate-900">
         <img src="https://images.unsplash.com/photo-1593786480164-cd4460f38b16?q=80&w=1400&auto=format&fit=crop" alt="Volleyball" className="w-full h-full object-cover opacity-80" />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent flex flex-col justify-end p-12">
            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight uppercase mb-3">Match Command Center</h2>
            <p className="text-slate-300 font-medium text-lg leading-snug max-w-md">Securely control tournament live scoring, broadcast real-time updates, and manage the official match history.</p>
         </div>
      </div>
      
      {/* Right Form Section */}
      <div className="w-full md:w-[55%] lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
        <div className="mb-10 flex flex-col items-center text-center">
           <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-5 ring-4 ring-blue-50">
              <ShieldCheck className="w-7 h-7" />
           </div>
           <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Admin Portal</h2>
           <p className="text-sm font-semibold text-slate-500 max-w-sm mx-auto">Sign in to securely access the centralized match control array.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-8 flex items-center gap-3 border border-red-200 w-full max-w-md mx-auto">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 w-full max-w-md mx-auto">
          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Admin Identity</label>
            <div className="relative group">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 pl-12 pr-4 py-3.5 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold"
                placeholder="santhosh"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Secure Passcode</label>
            <div className="relative group">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="password"
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 pl-12 pr-4 py-3.5 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-bold"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-4 rounded-lg flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-sm shadow-lg shadow-blue-600/30 active:scale-[0.98] disabled:opacity-70 disabled:scale-100 mt-2"
          >
            {loading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign Into Console
              </>
            )}
          </button>
        </form>
      </div>
      
    </div>
  );
};

export default Login;
