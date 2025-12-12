import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, FileText, Video } from 'lucide-react';
import { Button } from './Button';
import { Input, TextArea } from './Input';
import { Visibility, AttachmentType, Attachment } from '../types';
import { VISIBILITY_OPTIONS } from '../constants';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.PUBLIC);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newAttachments: Attachment[] = Array.from(e.target.files).map(file => {
        let type = AttachmentType.PDF;
        if (file.type.startsWith('image/')) type = AttachmentType.IMAGE;
        if (file.type.startsWith('video/')) type = AttachmentType.VIDEO;
        
        return {
          id: Math.random().toString(36).substr(2, 9),
          type,
          url: URL.createObjectURL(file), // Local preview URL
          filename: file.name
        };
      });
      setAttachments(prev => [...prev, ...newAttachments]);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsLoading(true);
    try {
      await onSubmit({
        title,
        description,
        eventDate: eventDate ? new Date(eventDate).toISOString() : undefined,
        visibility,
        attachments
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setEventDate('');
      setAttachments([]);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Create New Post</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="create-post-form" onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              placeholder="Give your post a catchy title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            
            <TextArea
              label="Description"
              placeholder="What's on your mind?"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="datetime-local"
                label="Event Date (Optional)"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Visibility</label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as Visibility)}
                >
                  {VISIBILITY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Attachments Section */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Attachments</label>
              
              <div className="flex flex-wrap gap-3 mb-3">
                {attachments.map(att => (
                  <div key={att.id} className="relative group w-24 h-24 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex flex-col items-center justify-center">
                    {att.type === AttachmentType.IMAGE ? (
                      <img src={att.url} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        {att.type === AttachmentType.VIDEO ? <Video className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                        <span className="text-[10px] mt-1 px-1 truncate w-full text-center">{att.filename}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
                >
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-xs">Add File</span>
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*,video/*,.pdf"
                onChange={handleFileChange}
              />
            </div>

          </form>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" form="create-post-form" isLoading={isLoading} disabled={!title || !description}>
            Post Update
          </Button>
        </div>
      </div>
    </div>
  );
};