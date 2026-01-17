
import React, { useState } from 'react';
import type { Account } from '../types';
import { SocialPlatform } from '../types';
import { PlatformIcon } from './icons';

interface SettingsProps { accounts: Account[]; onToggleConnection: (platform: SocialPlatform) => void; }

export const Settings: React.FC<SettingsProps> = ({ accounts, onToggleConnection }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">অ্যাকাউন্ট সেটিংস</h2>
            <div className="space-y-4">
                {accounts.map(acc => (
                    <div key={acc.platform} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex items-center justify-between">
                        <div className="flex items-center gap-3 font-bold"><PlatformIcon platform={acc.platform} /> {acc.platform}</div>
                        <button onClick={() => onToggleConnection(acc.platform)} className={`px-4 py-2 rounded text-white ${acc.isConnected ? 'bg-red-500' : 'bg-green-500'}`}>{acc.isConnected ? 'সংযোগ বিচ্ছিন্ন করুন' : 'সংযোগ করুন'}</button>
                    </div>
                ))}
            </div>
        </div>
    );
};
