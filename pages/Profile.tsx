import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input, TextArea } from '../components/Input';
import { Button } from '../components/Button';
import { mockApi } from '../services/mockApi';
import { User, Post } from '../types';
import { format } from 'date-fns';
import { Camera, Calendar, Mail } from 'lucide-react';
import { PostCard } from '../components/PostCard';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  
  // User's Posts
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
      loadUserPosts(user.id);
    }
  }, [user]);

  const loadUserPosts = async (userId: string) => {
    const allPosts = await mockApi.getPosts();
    setUserPosts(allPosts.filter(p => p.userId === userId));
  }

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updated = await mockApi.updateProfile(user.id, { name, bio, avatar });
      updateUser(updated);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <div className="px-6 pb-6">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="relative">
                <img 
                    src={avatar} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white" 
                />
                {isEditing && (
                    <button className="absolute bottom-0 right-0 p-1.5 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors shadow-sm">
                        <Camera className="w-3 h-3" />
                    </button>
                )}
            </div>
            
            {!isEditing ? (
                 <Button onClick={() => setIsEditing(true)} variant="secondary">Edit Profile</Button>
            ) : (
                 <div className="flex space-x-2">
                     <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                     <Button onClick={handleSave} isLoading={isLoading}>Save Changes</Button>
                 </div>
            )}
          </div>

          {!isEditing ? (
             <div className="space-y-4">
                 <div>
                    <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                    <p className="text-slate-500">{user.email}</p>
                 </div>
                 
                 {user.bio && <p className="text-slate-700 leading-relaxed max-w-2xl">{user.bio}</p>}

                 <div className="flex items-center space-x-6 text-sm text-slate-500 pt-4 border-t border-slate-100">
                     <div className="flex items-center">
                         <Calendar className="w-4 h-4 mr-2" />
                         Joined {format(new Date(user.joinDate), 'MMMM yyyy')}
                     </div>
                     <div className="flex items-center">
                         <Mail className="w-4 h-4 mr-2" />
                         {user.role}
                     </div>
                 </div>
             </div>
          ) : (
             <div className="space-y-4 max-w-xl">
                 <Input label="Display Name" value={name} onChange={e => setName(e.target.value)} />
                 <Input label="Avatar URL" value={avatar} onChange={e => setAvatar(e.target.value)} />
                 <TextArea label="Bio" value={bio} onChange={e => setBio(e.target.value)} rows={3} />
             </div>
          )}
        </div>
      </div>

      {/* User's Posts */}
      <div>
         <h2 className="text-xl font-bold text-slate-900 mb-4">My Posts</h2>
         {userPosts.length > 0 ? (
             <div className="space-y-6">
                 {userPosts.map(post => (
                     <PostCard 
                        key={post.id} 
                        post={post} 
                        onLike={() => {}} 
                        onDelete={async (id) => {
                            if(window.confirm("Delete post?")) {
                                await mockApi.deletePost(id);
                                loadUserPosts(user.id);
                            }
                        }}
                    />
                 ))}
             </div>
         ) : (
             <div className="text-center py-10 bg-white rounded-xl border border-slate-200 border-dashed">
                 <p className="text-slate-400">You haven't posted anything yet.</p>
             </div>
         )}
      </div>
    </div>
  );
};