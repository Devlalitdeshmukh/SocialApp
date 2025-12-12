export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum Visibility {
  PUBLIC = 'public',
  FRIENDS = 'friends',
  PRIVATE = 'private'
}

export enum AttachmentType {
  IMAGE = 'image',
  VIDEO = 'video',
  PDF = 'pdf'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinDate: string;
  role: UserRole;
}

export interface Attachment {
  id: string;
  type: AttachmentType;
  url: string;
  filename: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  user: User; // Expanded for easier frontend display
  title: string;
  description: string;
  createdAt: string; // The creation date
  eventDate?: string; // The specific "relevant" date set by user
  attachments: Attachment[];
  visibility: Visibility;
  likes: number;
  comments: Comment[];
  isLikedByCurrentUser?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}