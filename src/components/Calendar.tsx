
import React from 'react';
import type { Post } from '../types';

export const Calendar: React.FC<{ posts: Post[]; onPostClick: (post: Post) => void; }> = ({ posts, onPostClick }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">ক্যালেন্ডার</h2>
            <div className="space-y-2">
                {posts.filter(p => p.status === 'শিডিউলড').map(post => (
                    <div key={post.id} className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow cursor-pointer" onClick={() => onPostClick(post)}>
                        <p>{post.content.substring(0, 50)}...</p>
                        <p className="text-xs text-gray-500">{new Date(post.scheduledTime).toLocaleString('bn-BD')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
