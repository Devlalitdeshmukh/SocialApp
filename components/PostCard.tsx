import React from 'react';
import { Post, AttachmentType } from '../types';
import { format } from 'date-fns';
import { Heart, MessageCircle, Share2, MoreHorizontal, FileText, Video, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PostCardProps {
  post: Post;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user?.id === post.userId;

  const renderAttachment = () => {
    if (!post.attachments || post.attachments.length === 0) return null;

    // Display first attachment as thumbnail if it's an image
    const firstImage = post.attachments.find(a => a.type === AttachmentType.IMAGE);
    if (firstImage) {
      return (
        <div className="mt-3 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 max-h-80 flex items-center justify-center">
          <img src={firstImage.url} alt="Post content" className="w-full h-full object-cover" />
        </div>
      );
    }

    // Fallback for other files
    return (
      <div className="mt-3 space-y-2">
        {post.attachments.map((att) => (
          <div key={att.id} className="flex items-center p-3 bg-slate-50 border border-slate-200 rounded-lg">
            {att.type === AttachmentType.PDF && <FileText className="w-8 h-8 text-red-500 mr-3" />}
            {att.type === AttachmentType.VIDEO && <Video className="w-8 h-8 text-blue-500 mr-3" />}
            {att.type === AttachmentType.IMAGE && <FileText className="w-8 h-8 text-indigo-500 mr-3" />} {/* Should be caught above usually */}
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-slate-700 truncate">{att.filename}</p>
              <p className="text-xs text-slate-500 uppercase">{att.type}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden mb-6">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">{post.user.name}</h3>
              <p className="text-xs text-slate-500">
                {format(new Date(post.createdAt), 'MMM d, yyyy • h:mm a')}
                {post.visibility === 'private' && ' • Private'}
              </p>
            </div>
          </div>
          <div className="flex space-x-1">
             {isOwner && (
                 <button onClick={() => onDelete(post.id)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors" title="Delete Post">
                    <Trash2 className="w-4 h-4" />
                 </button>
             )}
             <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <MoreHorizontal className="w-4 h-4" />
             </button>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">{post.title}</h2>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{post.description}</p>
        </div>

        {renderAttachment()}

        {post.eventDate && (
             <div className="mt-3 text-xs font-semibold text-indigo-600 bg-indigo-50 inline-block px-2 py-1 rounded">
                Event Date: {format(new Date(post.eventDate), 'PPP p')}
             </div>
        )}

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex space-x-4">
            <button 
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-1.5 text-sm transition-colors ${post.isLikedByCurrentUser ? 'text-pink-600 font-medium' : 'text-slate-500 hover:text-pink-600'}`}
            >
              <Heart className={`w-4 h-4 ${post.isLikedByCurrentUser ? 'fill-current' : ''}`} />
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center space-x-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments.length}</span>
            </button>
          </div>
          <button className="flex items-center space-x-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};