import { Post, User, UserRole, Visibility, Attachment, AttachmentType } from '../types';
import { DEFAULT_AVATAR, MOCK_DELAY } from '../constants';

// --- Mock Data Helpers ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getStorage = <T>(key: string, defaultVal: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultVal;
};

const setStorage = (key: string, val: any) => {
  localStorage.setItem(key, JSON.stringify(val));
};

// --- Seed Data ---

const SEED_USERS: User[] = [
  {
    id: 'u1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatar: 'https://picsum.photos/id/1027/200/200',
    bio: 'Digital nomad & coffee enthusiast. ☕️',
    joinDate: new Date('2023-01-15').toISOString(),
    role: UserRole.USER
  },
  {
    id: 'u2',
    name: 'John Smith',
    email: 'john@example.com',
    avatar: 'https://picsum.photos/id/1012/200/200',
    bio: 'Tech lead. Building the future.',
    joinDate: new Date('2023-02-20').toISOString(),
    role: UserRole.USER
  }
];

const SEED_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    user: SEED_USERS[0],
    title: 'Sunset at the Beach',
    description: 'Had an amazing time walking down the coast this evening. The colors were unreal!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    eventDate: new Date().toISOString(),
    attachments: [
      { id: 'a1', type: AttachmentType.IMAGE, url: 'https://picsum.photos/id/10/800/600', filename: 'sunset.jpg' }
    ],
    visibility: Visibility.PUBLIC,
    likes: 12,
    comments: [],
    isLikedByCurrentUser: false
  },
  {
    id: 'p2',
    userId: 'u2',
    user: SEED_USERS[1],
    title: 'Project Update: Q4 Goals',
    description: 'Just wrapped up the quarterly planning session. Here are the key takeaways (see PDF).',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    eventDate: new Date().toISOString(),
    attachments: [
      { id: 'a2', type: AttachmentType.PDF, url: '#', filename: 'Q4_Roadmap.pdf' }
    ],
    visibility: Visibility.FRIENDS,
    likes: 5,
    comments: [
      { id: 'c1', userId: 'u1', userName: 'Jane Doe', userAvatar: SEED_USERS[0].avatar, content: 'Great work team!', createdAt: new Date().toISOString() }
    ],
    isLikedByCurrentUser: true
  }
];

// --- API Service ---

export const mockApi = {
  // Auth
  login: async (email: string, password: string): Promise<User> => {
    await delay(MOCK_DELAY);
    const users = getStorage<User[]>('users', SEED_USERS);
    // Simple mock logic: any user in the list works, password ignored for demo
    const user = users.find(u => u.email === email);
    if (!user) throw new Error("Invalid credentials");
    return user;
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    await delay(MOCK_DELAY);
    const users = getStorage<User[]>('users', SEED_USERS);
    if (users.find(u => u.email === email)) throw new Error("User already exists");

    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      role: UserRole.USER,
      joinDate: new Date().toISOString(),
      avatar: DEFAULT_AVATAR
    };
    
    users.push(newUser);
    setStorage('users', users);
    return newUser;
  },

  // Posts
  getPosts: async (): Promise<Post[]> => {
    await delay(MOCK_DELAY);
    const posts = getStorage<Post[]>('posts', SEED_POSTS);
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createPost: async (postData: Partial<Post>, currentUser: User): Promise<Post> => {
    await delay(MOCK_DELAY);
    const posts = getStorage<Post[]>('posts', SEED_POSTS);
    
    const newPost: Post = {
      id: `p${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      title: postData.title || 'Untitled',
      description: postData.description || '',
      createdAt: new Date().toISOString(),
      eventDate: postData.eventDate || new Date().toISOString(),
      attachments: postData.attachments || [],
      visibility: postData.visibility || Visibility.PUBLIC,
      likes: 0,
      comments: [],
      isLikedByCurrentUser: false
    };

    posts.unshift(newPost);
    setStorage('posts', posts);
    return newPost;
  },

  deletePost: async (postId: string): Promise<void> => {
    await delay(MOCK_DELAY);
    let posts = getStorage<Post[]>('posts', SEED_POSTS);
    posts = posts.filter(p => p.id !== postId);
    setStorage('posts', posts);
  },

  toggleLike: async (postId: string, userId: string): Promise<Post> => {
     // This is a local toggle simulation
     await delay(300);
     const posts = getStorage<Post[]>('posts', SEED_POSTS);
     const postIndex = posts.findIndex(p => p.id === postId);
     
     if (postIndex === -1) throw new Error("Post not found");
     
     const post = posts[postIndex];
     // Toggle logic
     if (post.isLikedByCurrentUser) {
       post.likes -= 1;
       post.isLikedByCurrentUser = false;
     } else {
       post.likes += 1;
       post.isLikedByCurrentUser = true;
     }
     
     posts[postIndex] = post;
     setStorage('posts', posts);
     return post;
  },

  // User
  updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    await delay(MOCK_DELAY);
    const users = getStorage<User[]>('users', SEED_USERS);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");

    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    setStorage('users', users);
    
    // Also update user info in posts for display consistency in this mock
    const posts = getStorage<Post[]>('posts', SEED_POSTS);
    const updatedPosts = posts.map(p => {
        if(p.userId === userId) {
            return { ...p, user: updatedUser };
        }
        return p;
    });
    setStorage('posts', updatedPosts);

    return updatedUser;
  }
};