import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Users, List } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { to: "/admin", icon: LayoutDashboard, label: "Match Control Dashboard" },
    { to: "/admin/new", icon: PlusCircle, label: "New Match" },
    { to: "/teams", icon: Users, label: "Team Management" },
    { to: "/admin/players", icon: List, label: "Player List" },
  ];

  return (
    <div className="w-64 sidebar-panel rounded-2xl p-4 flex flex-col h-full shadow-xl">
      <h3 className="text-sm font-semibold text-slate-500 mb-4 px-2 tracking-wide uppercase">Quick Links</h3>
      <div className="flex flex-col gap-1">
        {links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-white shadow-sm border border-slate-200 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
              }`
            }
          >
            <link.icon className="w-4 h-4" />
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
