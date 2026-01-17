
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Settings } from './components/Settings';
import { Inbox } from './components/Inbox';
import { Calendar } from './components/Calendar';
import { ResearchAssistant } from './components/ResearchAssistant';
import { PhotoEditor } from './components/PhotoEditor';
import { PostCreatorModal } from './components/PostCreatorModal';
import { PostEditorModal } from './components/PostEditorModal';
import { Analytics } from './components/Analytics';
import { IdeasLab } from './components/IdeasLab';
import type { Post, Account } from './types';
import { SocialPlatform } from './types';
import './App.css';

const initialAccounts: Account[] = [
    { platform: SocialPlatform.Facebook, username: '@ai_assistant', followers: 12500, isConnected: true },
    { platform: SocialPlatform.Instagram, username: '@ai_assistant', followers: 25700, isConnected: false },
    { platform: SocialPlatform.LinkedIn, username: 'AI Assistant Page', followers: 8900, isConnected: false },
    { platform: SocialPlatform.TikTok, username: '@ai_assistant_tok', followers: 18300, isConnected: true },
];

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [activeView, setActiveView] = useState('ড্যাশবোর্ড');
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      platform: SocialPlatform.LinkedIn,
      content: 'আমাদের নতুন AI-চালিত উৎপাদনশীলতা অ্যাপের লঞ্চ ঘোষণা করতে পেরে উত্তেজিত! এটি আপনার কাজের ধরন পরিবর্তন করবে। #AI #Productivity #Tech',
      status: 'প্রকাশিত',
      scheduledTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800'
    },
    {
      id: '2',
      platform: SocialPlatform.Instagram,
      content: 'পর্দার আড়ালের কিছু ঝলক! আমাদের দল কঠোর পরিশ্রম করছে নতুন কিছু নিয়ে আসার জন্য। সাথে থাকুন! 🚀 #StartupLife #BehindTheScenes',
      status: 'প্রকাশিত',
      scheduledTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c7da?q=80&w=800'
    },
     {
      id: '3',
      platform: SocialPlatform.Facebook,
      content: 'সবার জন্য দারুণ খবর! আগামী সপ্তাহে আমাদের বড় লঞ্চ হতে চলেছে। আপনার ক্যালেন্ডারে চিহ্ন দিয়ে রাখুন! 🎉',
      status: 'শিডিউলড',
      scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  }, []);

  const handleCreatePosts = useCallback((newPosts: Omit<Post, 'id'>[]) => {
    const postsToAdd = newPosts.map(p => ({ ...p, id: new Date().toISOString() + Math.random() }));
    setPosts(prevPosts => [...postsToAdd, ...prevPosts]);
  }, []);

  const handleUpdatePost = useCallback((updatedPost: Post) => {
    setPosts(prevPosts => prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
    setEditingPost(null);
  }, []);

  const handleDeletePost = useCallback((postId: string) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
    setEditingPost(null);
  }, []);

  const handleToggleConnection = useCallback((platform: SocialPlatform) => {
    setAccounts(prevAccounts => 
      prevAccounts.map(acc => 
        acc.platform === platform ? { ...acc, isConnected: !acc.isConnected } : acc
      )
    );
  }, []);

  const onNewPostClick = useCallback(() => setIsModalOpen(true), []);

  const renderActiveView = () => {
    switch(activeView) {
      case 'ড্যাশবোর্ড': return <Dashboard posts={posts} accounts={accounts} onPostClick={setEditingPost} onNewPostClick={onNewPostClick} setActiveView={setActiveView} />;
      case 'সেটিংস': return <Settings accounts={accounts} onToggleConnection={handleToggleConnection} />;
      case 'ইনবক্স': return <Inbox />;
      case 'ক্যালেন্ডার': return <Calendar posts={posts} onPostClick={setEditingPost} />;
      case 'চ্যাট সহকারী': return <ResearchAssistant />;
      case 'ফটো এডিটর': return <PhotoEditor />;
      case 'আইডিয়া ল্যাব': return <IdeasLab />;
      case 'অ্যানালিಟಿಕ್ಸ್': return <Analytics posts={posts} accounts={accounts} />;
      default: return <Dashboard posts={posts} accounts={accounts} onPostClick={setEditingPost} onNewPostClick={onNewPostClick} setActiveView={setActiveView} />;
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onNewPostClick={onNewPostClick} title={activeView} theme={theme} toggleTheme={toggleTheme} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 lg:p-8">
          {renderActiveView()}
        </main>
      </div>
      {isModalOpen && <PostCreatorModal onClose={() => setIsModalOpen(false)} onCreatePosts={handleCreatePosts} />}
      {editingPost && <PostEditorModal post={editingPost} onClose={() => setEditingPost(null)} onUpdate={handleUpdatePost} onDelete={handleDeletePost} />}
    </div>
  );
}
