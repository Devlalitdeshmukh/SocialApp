import React, { useEffect, useState } from 'react';
import { mockApi } from '../services/mockApi';
import { Post } from '../types';
import { PostCard } from '../components/PostCard';
import { PostListRow } from '../components/PostListRow';
import { LayoutGrid, List, Search, Loader2 } from 'lucide-react';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
    refreshTrigger: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ refreshTrigger }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user } = useAuth();

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = await mockApi.getPosts();
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [refreshTrigger]);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(lowerQuery) || 
        post.description.toLowerCase().includes(lowerQuery) ||
        post.user.name.toLowerCase().includes(lowerQuery)
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts]);

  const handleLike = async (id: string) => {
      // Optimistic update
      setPosts(current => current.map(p => {
          if (p.id === id) {
              return {
                  ...p,
                  likes: p.isLikedByCurrentUser ? p.likes - 1 : p.likes + 1,
                  isLikedByCurrentUser: !p.isLikedByCurrentUser
              };
          }
          return p;
      }));

      // Call API
      try {
        if (user) await mockApi.toggleLike(id, user.id);
      } catch (err) {
          // Revert if error (not implemented for brevity)
          console.error("Like failed");
      }
  };

  const handleDelete = async (id: string) => {
      if(window.confirm("Are you sure you want to delete this post?")) {
          await mockApi.deletePost(id);
          setPosts(prev => prev.filter(p => p.id !== id));
      }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Recent Updates</h1>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
           <div className="relative flex-1 sm:w-64">
             <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
             <input
                type="text"
                placeholder="Search posts..."
                className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
           
           <div className="flex bg-white rounded-lg border border-slate-200 p-1">
             <button
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'card' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
             >
                <LayoutGrid className="w-4 h-4" />
             </button>
             <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
             >
                <List className="w-4 h-4" />
             </button>
           </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
           <p className="text-slate-500">No posts found. Start the conversation!</p>
        </div>
      ) : (
        <div className={viewMode === 'list' ? 'bg-white rounded-xl border border-slate-200 overflow-hidden' : 'space-y-6'}>
          {filteredPosts.map(post => (
             viewMode === 'card' ? (
               <PostCard key={post.id} post={post} onLike={handleLike} onDelete={handleDelete} />
             ) : (
               <PostListRow key={post.id} post={post} onLike={handleLike} onDelete={handleDelete} />
             )
          ))}
        </div>
      )}
    </div>
  );
};