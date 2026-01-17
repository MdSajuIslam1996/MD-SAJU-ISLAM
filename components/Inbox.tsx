
import React, { useState } from 'react';
import { generateMessageReply } from '../services/geminiService.ts';

const mockMessages = [{ id: 1, sender: 'জান্নাতুল ফেরদৌস', content: 'আপনাদের নতুন পণ্যটি সম্পর্কে জানতে চাই।' }];

export const Inbox: React.FC = () => {
    const [selectedMessage, setSelectedMessage] = useState(mockMessages[0]);
    const [replyText, setReplyText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateReply = async () => {
        setIsGenerating(true);
        try {
            const reply = await generateMessageReply(selectedMessage.content);
            setReplyText(reply);
        } catch (error) { console.error(error); } finally { setIsGenerating(false); }
    };
    
    return (
        <div className="flex h-[calc(100vh-112px)]">
            <div className="w-1/3 bg-white dark:bg-gray-800 border-r dark:border-gray-700"><div className="p-4 font-bold border-b dark:border-gray-700">ইনবক্স</div><ul>{mockMessages.map(msg => <li key={msg.id} onClick={() => setSelectedMessage(msg)} className={`p-4 cursor-pointer ${selectedMessage.id === msg.id && 'bg-gray-100 dark:bg-gray-700'}`}><h3>{msg.sender}</h3><p className="text-sm text-gray-500 truncate">{msg.content}</p></li>)}</ul></div>
            <div className="w-2/3 flex flex-col"><div className="flex-grow p-4">{selectedMessage.content}</div><div className="p-4 border-t dark:border-gray-700"><textarea value={replyText} onChange={e => setReplyText(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 mb-2" rows={3}></textarea><button onClick={handleGenerateReply} disabled={isGenerating} className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400">{isGenerating ? '...' : 'AI দিয়ে উত্তর দিন'}</button></div></div>
        </div>
    );
};
