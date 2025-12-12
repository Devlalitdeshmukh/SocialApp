import React from 'react';
import { Post, AttachmentType } from '../types';
import { format } from 'date-fns';
import { Heart, MessageCircle, Paperclip, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PostListRowProps {
  post: Post;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
}

export const PostListRow: React.FC<PostListRowProps> = ({ post, onLike, onDelete }) => {
    const { user } = useAuth();
    const isOwner = user?.id === post.userId;
    const hasAttachments = post.attachments.length > 0;

    return (
        <div className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors p-4 flex items-center justify-between">
            <div className="flex items-center flex-1 min-w-0 mr-4">
                 <img src={post.user.avatar} alt={post.user.name} className="w-8 h-8 rounded-full object-cover mr-3 flex-shrink-0" />
                 <div className="min-w-0">
                     <h4 className="text-sm font-medium text-slate-900 truncate">{post.title}</h4>
                     <p className="text-xs text-slate-500 truncate">{post.description}</p>
                 </div>
            </div>

            <div className="hidden md:flex items-center space-x-6 mr-6">
                <span className="text-xs text-slate-400 w-24">
                    {format(new Date(post.createdAt), 'MMM d, h:mm a')}
                </span>
                <div className="flex items-center w-8 justify-center">
                    {hasAttachments ? <Paperclip className="w-4 h-4 text-slate-400" /> : <span className="w-4" />}
                </div>
            </div>

            <div className="flex items-center space-x-3">
                 <button 
                    onClick={() => onLike(post.id)}
                    className={`flex items-center space-x-1 text-xs ${post.isLikedByCurrentUser ? 'text-pink-600' : 'text-slate-400 hover:text-pink-600'}`}
                 >
                    <Heart className={`w-4 h-4 ${post.isLikedByCurrentUser ? 'fill-current' : ''}`} />
                    <span className="w-4">{post.likes}</span>
                 </button>
                 {isOwner && (
                     <button onClick={() => onDelete(post.id)} className="text-slate-400 hover:text-red-600 p-1">
                         <Trash2 className="w-4 h-4" />
                     </button>
                 )}
            </div>
        </div>
    );
}