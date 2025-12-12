import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, User, Settings, LogOut, PlusSquare, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../constants';

export const Sidebar: React.FC<{ onOpenCreate: () => void }> = ({ onOpenCreate }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Feed', path: '/' },
    { icon: User, label: 'Profile', path: '/profile' },
    // { icon: Activity, label: 'Activity', path: '/activity' }, // Placeholder for extra features
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          {APP_NAME}
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              {item.label}
            </NavLink>
          );
        })}

        <button
          onClick={onOpenCreate}
          className="w-full flex items-center px-4 py-3 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.02]"
        >
          <PlusSquare className="w-5 h-5 mr-3" />
          Create Post
        </button>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center mb-4 px-2">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-2 py-2 text-sm text-slate-500 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};