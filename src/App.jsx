import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LiveScore from './pages/LiveScore';
import Fixtures from './pages/Fixtures';
import Teams from './pages/Teams';
import Announcements from './pages/Announcements';
import History from './pages/History';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import TeamDetails from './pages/TeamDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <Navbar />
        
        <div className="flex-1 w-full max-w-7xl mx-auto py-6 px-4 md:px-8">
           <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/live" element={<LiveScore />} />
             <Route path="/fixtures" element={<Fixtures />} />
             <Route path="/teams" element={<Teams />} />
             <Route path="/teams/:id" element={<TeamDetails />} />
             <Route path="/announcements" element={<Announcements />} />
             <Route path="/history" element={<History />} />
             <Route path="/login" element={<Login />} />
             <Route 
               path="/admin/*" 
               element={
                 <ProtectedRoute>
                   <AdminDashboard />
                 </ProtectedRoute>
               } 
             />
           </Routes>
        </div>
        
        {/* Simple Footer */}
        <footer className="bg-white border-t border-slate-200 mt-auto py-8 text-center text-slate-500 text-sm">
           <div className="flex justify-center gap-6 mb-4">
              <a href="#" className="hover:text-slate-900 font-medium">Terms of Use</a>
              <a href="#" className="hover:text-slate-900 font-medium">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900 font-medium">Interest-Based Ads</a>
           </div>
           <p>© {new Date().getFullYear()} VolleyTrack Sports. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
