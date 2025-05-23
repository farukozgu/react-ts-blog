
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from './AuthContext';

export type Category = 'technology' | 'gaming' | 'music' | 'movies';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: Category;
  authorId: string;
  authorName: string;
  authorImage?: string;
  createdAt: string;
  likes: string[];
  dislikes: string[];
  favorites: string[];
}

interface BlogContextType {
  posts: BlogPost[];
  userPosts: (userId: string) => BlogPost[];
  userFavorites: (userId: string) => BlogPost[];
  categories: {id: Category, name: string}[];
  getPosts: (category?: Category) => BlogPost[];
  getPost: (id: string) => BlogPost | undefined;
  createPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'likes' | 'dislikes' | 'favorites'>) => Promise<void>;
  updatePost: (id: string, post: Partial<BlogPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  likePost: (postId: string, userId: string) => Promise<void>;
  dislikePost: (postId: string, userId: string) => Promise<void>;
  toggleFavorite: (postId: string, userId: string) => Promise<void>;
  isFavorite: (postId: string, userId: string) => boolean;
  isLiked: (postId: string, userId: string) => boolean;
  isDisliked: (postId: string, userId: string) => boolean;
}

export const BlogContext = createContext<BlogContextType | undefined>(undefined);

// Sample blog posts for initial data
const initialPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of AI in Web Development',
    content: '<p>Artificial intelligence is revolutionizing how we build websites. From automated testing to intelligent design suggestions, AI tools are making developers more productive than ever.</p><p>In this post, we will explore several cutting-edge AI tools that are changing the landscape of web development.</p><p>Code completion tools like GitHub Copilot are just the beginning. We\'re seeing AI that can generate entire components from descriptions, optimize performance automatically, and even help debug complex issues.</p><p>The future of web development will likely involve collaboration between human creativity and AI efficiency, creating better websites faster than ever before.</p>',
    excerpt: 'Artificial intelligence is revolutionizing how we build websites. From automated testing to intelligent design suggestions, AI tools are making developers more productive than ever.',
    coverImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800',
    category: 'technology',
    authorId: '1',
    authorName: 'Demo User',
    authorImage: 'https://i.pravatar.cc/150?u=demo@example.com',
    createdAt: '2025-05-10T10:30:00Z',
    likes: ['2'],
    dislikes: [],
    favorites: ['2']
  },
  {
    id: '2',
    title: 'Top RPG Games of 2025',
    content: '<p>2025 has been an incredible year for RPG enthusiasts. With technological advancements enabling more immersive worlds than ever before, game developers have delivered some truly groundbreaking titles.</p><p>From open-world adventures to character-driven narratives, this year\'s releases have pushed the boundaries of what\'s possible in gaming.</p><p>Our top picks include "Eternal Legacy," with its revolutionary dialogue system that adapts to your every decision, and "Nebula Chronicles," which features the most detailed character customization we\'ve ever seen.</p><p>Whether you prefer fantasy settings or science fiction universes, 2025\'s RPG lineup has something special for everyone.</p>',
    excerpt: '2025 has been an incredible year for RPG enthusiasts. With technological advancements enabling more immersive worlds than ever before, game developers have delivered some truly groundbreaking titles.',
    coverImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800',
    category: 'gaming',
    authorId: '2',
    authorName: 'Jane Smith',
    authorImage: 'https://i.pravatar.cc/150?u=jane@example.com',
    createdAt: '2025-05-12T14:20:00Z',
    likes: ['1'],
    dislikes: [],
    favorites: []
  },
  {
    id: '3',
    title: 'Evolution of Jazz in the Digital Age',
    content: '<p>Jazz has always been about innovation and improvisation. In the digital age, artists are finding new ways to honor tradition while pushing boundaries with technology.</p><p>Modern jazz musicians are incorporating electronic elements, leveraging social media for collaboration, and using AI tools to explore new melodic possibilities.</p><p>Despite these technological advances, the soul of jazz remains intact. The human element—the spontaneity, emotion, and technical mastery—continues to be the driving force behind the genre\'s evolution.</p><p>In this article, we explore how contemporary jazz artists are navigating this intersection of tradition and technology, creating sounds that both honor the past and forge new paths forward.</p>',
    excerpt: 'Jazz has always been about innovation and improvisation. In the digital age, artists are finding new ways to honor tradition while pushing boundaries with technology.',
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800',
    category: 'music',
    authorId: '3',
    authorName: 'Robert Johnson',
    authorImage: 'https://i.pravatar.cc/150?u=robert@example.com',
    createdAt: '2025-05-15T09:45:00Z',
    likes: ['1', '2'],
    dislikes: [],
    favorites: ['1']
  },
  {
    id: '4',
    title: 'Why Miniseries Are Dominating Streaming Platforms',
    content: '<p>The rise of streaming platforms has transformed how stories are told on screen. Limited series, with their tight narratives and high production values, have become the preferred format for both creators and viewers.</p><p>Unlike traditional TV shows that might run for several seasons, miniseries offer complete stories in just 6-10 episodes, attracting A-list talent from the film industry.</p><p>This format allows for more experimentation, deeper character development, and complex narratives without the risk of storylines becoming stretched or stale.</p><p>From historical dramas to science fiction anthologies, miniseries are delivering some of the most innovative and compelling content in today\'s entertainment landscape.</p>',
    excerpt: 'The rise of streaming platforms has transformed how stories are told on screen. Limited series, with their tight narratives and high production values, have become the preferred format for both creators and viewers.',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800',
    category: 'movies',
    authorId: '4',
    authorName: 'Emma Lee',
    authorImage: 'https://i.pravatar.cc/150?u=emma@example.com',
    createdAt: '2025-05-18T16:10:00Z',
    likes: ['1'],
    dislikes: ['3'],
    favorites: ['1', '2']
  }
];

// Local storage key
const POSTS_STORAGE_KEY = 'blog-app-posts';

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const categories = [
    { id: 'technology' as Category, name: 'Technology' },
    { id: 'gaming' as Category, name: 'Gaming' },
    { id: 'music' as Category, name: 'Music' },
    { id: 'movies' as Category, name: 'Movies & TV' },
  ];

  // Load posts from localStorage on init
  useEffect(() => {
    const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    if (storedPosts) {
      try {
        setPosts(JSON.parse(storedPosts));
      } catch (error) {
        console.error("Error parsing stored posts:", error);
        localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(initialPosts));
        setPosts(initialPosts);
      }
    } else {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(initialPosts));
      setPosts(initialPosts);
    }
  }, []);

  // Helper to save posts to localStorage
  const savePosts = (newPosts: BlogPost[]) => {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(newPosts));
    setPosts(newPosts);
  };

  const getPosts = (category?: Category) => {
    if (!category) return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return [...posts]
      .filter(post => post.category === category)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getPost = (id: string) => {
    return posts.find(post => post.id === id);
  };

  const userPosts = (userId: string) => {
    return posts.filter(post => post.authorId === userId);
  };

  const userFavorites = (userId: string) => {
    return posts.filter(post => post.favorites.includes(userId));
  };

  const createPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'likes' | 'dislikes' | 'favorites'>) => {
    try {
      if (!user) {
        throw new Error("User must be logged in to create a post");
      }

      const newPost: BlogPost = {
        id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        title: post.title,
        content: post.content,
        excerpt: post.content.substring(0, 150) + '...',
        coverImage: post.coverImage || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800',
        category: post.category,
        authorId: user.id,
        authorName: user.name,
        authorImage: user.profilePicture,
        createdAt: new Date().toISOString(),
        likes: [],
        dislikes: [],
        favorites: []
      };
      
      // Update posts
      const updatedPosts = [newPost, ...posts];
      savePosts(updatedPosts);

      toast({
        title: "Success",
        description: "Your post has been published",
      });
    } catch (error: any) {
      console.error("Failed to create post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    }
  };

  const updatePost = async (id: string, postUpdate: Partial<BlogPost>) => {
    try {
      const postIndex = posts.findIndex(p => p.id === id);
      
      if (postIndex === -1) {
        throw new Error("Post not found");
      }
      
      // Create updated post
      const updatedPost = {
        ...posts[postIndex],
        ...postUpdate
      };
      
      // Create new posts array
      const updatedPosts = [...posts];
      updatedPosts[postIndex] = updatedPost;
      
      // Save
      savePosts(updatedPosts);

      toast({
        title: "Success",
        description: "Post updated successfully",
      });
    } catch (error: any) {
      console.error("Failed to update post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update post",
        variant: "destructive",
      });
    }
  };

  const deletePost = async (id: string) => {
    try {
      const filteredPosts = posts.filter(post => post.id !== id);
      savePosts(filteredPosts);
      
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error: any) {
      console.error("Failed to delete post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  // User interactions with posts
  const likePost = async (postId: string, userId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        // If already liked, remove like
        if (post.likes.includes(userId)) {
          return {
            ...post,
            likes: post.likes.filter(id => id !== userId)
          };
        }
        // If disliked, remove dislike and add like
        const updatedDislikes = post.dislikes.filter(id => id !== userId);
        return {
          ...post,
          likes: [...post.likes, userId],
          dislikes: updatedDislikes
        };
      }
      return post;
    });
    
    savePosts(updatedPosts);
  };

  const dislikePost = async (postId: string, userId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        // If already disliked, remove dislike
        if (post.dislikes.includes(userId)) {
          return {
            ...post,
            dislikes: post.dislikes.filter(id => id !== userId)
          };
        }
        // If liked, remove like and add dislike
        const updatedLikes = post.likes.filter(id => id !== userId);
        return {
          ...post,
          dislikes: [...post.dislikes, userId],
          likes: updatedLikes
        };
      }
      return post;
    });
    
    savePosts(updatedPosts);
  };

  const toggleFavorite = async (postId: string, userId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        if (post.favorites.includes(userId)) {
          return {
            ...post,
            favorites: post.favorites.filter(id => id !== userId)
          };
        } else {
          return {
            ...post,
            favorites: [...post.favorites, userId]
          };
        }
      }
      return post;
    });
    
    savePosts(updatedPosts);
  };

  const isFavorite = (postId: string, userId: string) => {
    const post = posts.find(p => p.id === postId);
    return post?.favorites.includes(userId) || false;
  };

  const isLiked = (postId: string, userId: string) => {
    const post = posts.find(p => p.id === postId);
    return post?.likes.includes(userId) || false;
  };

  const isDisliked = (postId: string, userId: string) => {
    const post = posts.find(p => p.id === postId);
    return post?.dislikes.includes(userId) || false;
  };

  return (
    <BlogContext.Provider value={{
      posts,
      categories,
      getPosts,
      getPost,
      userPosts,
      userFavorites,
      createPost,
      updatePost,
      deletePost,
      likePost,
      dislikePost,
      toggleFavorite,
      isFavorite,
      isLiked,
      isDisliked
    }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}
