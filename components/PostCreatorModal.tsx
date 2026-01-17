
import React, { useState } from 'react';
import { generatePostContent, generateImage } from '../services/geminiService.ts';
import type { Post, GeneratedPost } from '../types.ts';
import { SocialPlatform } from '../types.ts';
import { PlatformIcon } from './icons.tsx';

interface PostCreatorModalProps { onClose: () => void; onCreatePosts: (posts: Omit<Post, 'id'>[]) => void; }

const platformOptions = [SocialPlatform.Facebook, SocialPlatform.Instagram, SocialPlatform.LinkedIn, SocialPlatform.TikTok];

export const PostCreatorModal: React.FC<PostCreatorModalProps> = ({ onClose, onCreatePosts }) => {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState<'Bangla' | 'English'>('Bangla');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt || selectedPlatforms.length === 0) { setError('অনুগ্রহ করে একটি প্রম্পট লিখুন এবং প্ল্যাটফর্ম নির্বাচন করুন।'); return; }
    setError(''); setIsGenerating(true); setGeneratedPosts([]);
    try {
      const results = await generatePostContent(prompt, selectedPlatforms, language);
      const postsWithImages = await Promise.all(results.map(async post => {
          const image = post.imagePrompt ? await generateImage(post.imagePrompt) : null;
          return { ...post, image };
      }));
      setGeneratedPosts(postsWithImages);
    } catch (err) { setError(err instanceof Error ? err.message : 'ত্রুটি ঘটেছে।'); } finally { setIsGenerating(false); }
  };

  const handleScheduleAll = () => {
    const postsToSchedule = generatedPosts.map((post, i) => ({ ...post, status: 'শিডিউলড' as const, scheduledTime: new Date(Date.now() + (i + 1) * 3600000).toISOString(), imageUrl: post.image || undefined }));
    onCreatePosts(postsToSchedule);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center"><h2 className="text-xl font-bold">নতুন পোস্ট তৈরি করুন</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">&times;</button></div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="আপনার পোস্টের বিষয় কী?" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" rows={3}></textarea>
          <div className="flex gap-2">{platformOptions.map(p => <button key={p} onClick={() => setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(i => i !== p) : [...prev, p])} className={`px-3 py-1 border rounded-full ${selectedPlatforms.includes(p) ? 'bg-blue-500 text-white' : 'dark:border-gray-600'}`}>{p}</button>)}</div>
          <button onClick={handleGenerate} disabled={isGenerating} className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400">{isGenerating ? 'জেনারেট হচ্ছে...' : 'AI দিয়ে তৈরি করুন'}</button>
          {error && <p className="text-red-500">{error}</p>}
          {generatedPosts.length > 0 && <div className="space-y-4">{generatedPosts.map((post, i) => <div key={i} className="p-3 border rounded dark:border-gray-700"><div className="flex items-center gap-2 font-bold"><PlatformIcon platform={post.platform} />{post.platform}</div><p>{post.content}</p>{post.image && <img src={post.image} className="w-24 h-24 mt-2 rounded" />}</div>)}</div>}
        </div>
        <div className="p-4 border-t dark:border-gray-700 text-right"><button onClick={handleScheduleAll} className="px-4 py-2 bg-green-600 text-white rounded">সব শিডিউল করুন</button></div>
      </div>
    </div>
  );
};
