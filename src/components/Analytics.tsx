
import React from 'react';
import type { Post, Account } from '../types';

export const Analytics: React.FC<{ posts: Post[], accounts: Account[] }> = ({ posts, accounts }) => {
    const totalFollowers = accounts.reduce((sum, acc) => sum + acc.followers, 0);
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">অ্যানালিটিক্স</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"><h3>মোট ফলোয়ার</h3><p className="text-3xl font-bold">{totalFollowers.toLocaleString()}</p></div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"><h3>মোট পোস্ট</h3><p className="text-3xl font-bold">{posts.length}</p></div>
            </div>
        </div>
    );
};
