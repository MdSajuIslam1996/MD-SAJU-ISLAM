
import React from 'react';
import type { Post, Account } from '../types.ts';
import { SocialPlatform } from '../types.ts';
import { PlatformIcon } from './icons.tsx';

const platformColors: { [key in SocialPlatform]: { bg: string; text: string; } } = {
    [SocialPlatform.Facebook]: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
    [SocialPlatform.Instagram]: { bg: 'bg-pink-500/10', text: 'text-pink-500' },
    [SocialPlatform.LinkedIn]: { bg: 'bg-sky-500/10', text: 'text-sky-500' },
    [SocialPlatform.TikTok]: { bg: 'bg-cyan-400/10', text: 'text-cyan-400' },
};

const PostCard: React.FC<{ post: Post, onPostClick: (post: Post) => void }> = ({ post, onPostClick }) => {
    const colors = platformColors[post.platform];
    return (
        <button onClick={() => onPostClick(post)} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border dark:border-gray-700 flex flex-col hover:shadow-lg transition-shadow">
            {post.imageUrl && <img src={post.imageUrl} alt="Post" className="w-full h-40 object-cover rounded-t-lg" />}
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex items-center gap-2 mb-2"><div className={`p-1.5 rounded-full ${colors.bg} ${colors.text}`}><PlatformIcon platform={post.platform} /></div><span className="font-bold text-gray-800 dark:text-white">{post.platform}</span></div>
                <p className="text-gray-600 dark:text-gray-300 text-sm flex-grow">{post.content.substring(0, 100)}...</p>
                <div className="text-xs text-gray-500 mt-2 pt-2 border-t dark:border-gray-700">{post.status} - {new Date(post.scheduledTime).toLocaleDateString('bn-BD')}</div>
            </div>
        </button>
    );
};

export const Dashboard: React.FC<{ posts: Post[]; accounts: Account[]; onPostClick: (post: Post) => void; onNewPostClick: () => void; setActiveView: (view: string) => void; }> = ({ posts, accounts, onPostClick, onNewPostClick, setActiveView }) => {
  return (
    <div className="space-y-8">
        <div>
            <h2 className="text-2xl font-bold mb-4">সাম্প্রতিক এবং নির্ধারিত পোস্ট</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {posts.map(post => <PostCard key={post.id} post={post} onPostClick={onPostClick} />)}
            </div>
        </div>
    </div>
  );
};
