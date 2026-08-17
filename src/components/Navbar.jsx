import { NavLink, Link, useLocation } from 'react-router-dom';
import { Trophy, Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const NavItem = ({ to, label, isLive }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <NavLink
      to={to}
      className={clsx(
        "relative px-4 py-4 text-sm font-bold uppercase tracking-wide transition-colors duration-200 flex items-center gap-2",
        isActive ? "text-blue-600 border-b-[3px] border-blue-600" : "text-slate-500 hover:text-slate-900 border-b-[3px] border-transparent"
      )}
    >
      {label}
      {isLive && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-sm animate-pulse">LIVE</span>}
    </NavLink>
  );
};

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'admin') setIsAdmin(true);
      } catch (err) {}
    }
  }, []);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      {/* Top darker bar - standard in sports apps - hidden on mobile */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center hidden sm:flex">
         <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Volleyball News</span>
            <span className="hover:text-white cursor-pointer transition-colors">Rankings</span>
            <span className="hover:text-white cursor-pointer transition-colors">Tournaments</span>
         </div>
         <div className="flex items-center gap-4">
            <span className="border-r border-slate-700 pr-4">English</span>
            {isAdmin ? (
               <Link to="/admin" className="text-blue-400 hover:text-blue-300 font-semibold">Dashboard</Link>
            ) : (
               <Link to="/login" className="hover:text-white font-medium">Log In / Sign Up</Link>
            )}
         </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 sm:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-8 h-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
               <Trophy className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
              VOLLEY<span className="text-blue-600">TRACK</span>
            </h1>
          </Link>

          <div className="hidden md:flex items-center h-full gap-2">
            <NavItem to="/" label="Home" />
            <NavItem to="/live" label="Live Score" isLive={true} />
            <NavItem to="/fixtures" label="Fixtures" />
            <NavItem to="/teams" label="Teams" />
            <NavItem to="/announcements" label="Announcements" />
            <NavItem to="/history" label="History" />
          </div>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="flex items-center gap-4 md:hidden">
           <button 
             onClick={() => setIsOpen(!isOpen)} 
             className="text-slate-600 p-2 hover:bg-slate-100 rounded-md transition-colors"
           >
             {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 flex flex-col gap-1 shadow-inner">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)} 
            className="block py-2.5 px-3 text-sm font-bold uppercase tracking-wider rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/live" 
            onClick={() => setIsOpen(false)} 
            className="block py-2.5 px-3 text-sm font-bold uppercase tracking-wider rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            Live Score 
            <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-sm animate-pulse">LIVE</span>
          </Link>
          <Link 
            to="/fixtures" 
            onClick={() => setIsOpen(false)} 
            className="block py-2.5 px-3 text-sm font-bold uppercase tracking-wider rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
          >
            Fixtures
          </Link>
          <Link 
            to="/teams" 
            onClick={() => setIsOpen(false)} 
            className="block py-2.5 px-3 text-sm font-bold uppercase tracking-wider rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
          >
            Teams
          </Link>
          <Link 
            to="/announcements" 
            onClick={() => setIsOpen(false)} 
            className="block py-2.5 px-3 text-sm font-bold uppercase tracking-wider rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
          >
            Announcements
          </Link>
          <Link 
            to="/history" 
            onClick={() => setIsOpen(false)} 
            className="block py-2.5 px-3 text-sm font-bold uppercase tracking-wider rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
          >
            History
          </Link>
          
          {/* User actions section inside mobile menu */}
          <div className="border-t border-slate-100 mt-2 pt-2">
            {isAdmin ? (
              <Link 
                to="/admin" 
                onClick={() => setIsOpen(false)} 
                className="block py-2.5 px-3 text-sm font-bold uppercase tracking-wider rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Admin Dashboard
              </Link>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)} 
                className="block py-2.5 px-3 text-sm font-bold uppercase tracking-wider rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
              >
                Log In / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
