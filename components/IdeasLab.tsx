
import React, { useState } from 'react';
import { marked } from 'marked';
import { generateIdeas } from '../services/geminiService.ts';

export const IdeasLab: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');

    const handleGenerate = async (type: 'ideas' | 'hashtags') => {
        if (!topic) return;
        setIsLoading(true); setResult('');
        try {
            const content = await generateIdeas(topic, type);
            setResult(content);
        } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">AI আইডিয়া ল্যাব</h2>
            <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="আপনার বিষয় লিখুন..." className="w-full p-2 border rounded dark:bg-gray-700 mb-2" />
            <div className="flex gap-2 mb-4">
                <button onClick={() => handleGenerate('ideas')} className="px-4 py-2 bg-blue-600 text-white rounded">আইডিয়া</button>
                <button onClick={() => handleGenerate('hashtags')} className="px-4 py-2 bg-blue-600 text-white rounded">হ্যাশট্যাগ</button>
            </div>
            {isLoading && <p>জেনারেট হচ্ছে...</p>}
            {result && <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow" dangerouslySetInnerHTML={{ __html: marked.parse(result) as string }}></div>}
        </div>
    );
};
