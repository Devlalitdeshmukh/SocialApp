import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { CreatePostModal } from './CreatePostModal';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';
import { APP_NAME } from '../constants';
import { NavLink } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  onPostCreated: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onPostCreated }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleCreatePost = async (data: any) => {
    if (user) {
      await mockApi.createPost(data, user);
      onPostCreated(); // Trigger refresh in parent
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar onOpenCreate={() => setIsCreateModalOpen(true)} />
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4">
          <span className="text-xl font-bold text-indigo-600">{APP_NAME}</span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
              {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-white pt-20 px-6 space-y-4">
              <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-lg font-medium text-slate-800 border-b border-slate-100">Feed</NavLink>
              <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-lg font-medium text-slate-800 border-b border-slate-100">Profile</NavLink>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setIsCreateModalOpen(true); }}
                className="block w-full text-left py-3 text-lg font-medium text-indigo-600 border-b border-slate-100"
              >
                  Create Post
              </button>
              <button onClick={logout} className="block w-full text-left py-3 text-lg font-medium text-red-600">Sign Out</button>
          </div>
      )}

      <main className="flex-1 overflow-x-hidden md:ml-0 pt-20 md:pt-0 p-4 md:p-8">
        {children}
      </main>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};