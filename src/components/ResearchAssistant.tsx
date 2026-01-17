
import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import type { Chat } from '@google/genai';
import { createChatSession } from '../services/geminiService';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export const ResearchAssistant: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { transcript, isListening, startListening, stopListening } = useSpeechRecognition();

    useEffect(() => { setChat(createChatSession()); }, []);
    useEffect(() => { if (transcript) setInput(transcript); }, [transcript]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault(); if (!input.trim() || !chat) return;
        const userMessage = { role: 'user' as const, text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput(''); setIsLoading(true);
        try {
            // FIX: `chat.sendMessage` expects an object with a `message` property.
            const result = await chat.sendMessage({ message: input });
            // FIX: The text content is accessed via the `text` property on the response, not `response.text()`.
            setMessages(prev => [...prev, { role: 'model' as const, text: result.text ?? '' }]);
        } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-112px)]"><div className="flex-grow p-4 space-y-4 overflow-y-auto">{messages.map((msg, i) => <div key={i} className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 dark:bg-gray-700'}`} dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) as string }} />)} {isLoading && <p>...</p>}</div><form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700 flex gap-2"><input value={input} onChange={e => setInput(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700" /><button type="button" onClick={isListening ? stopListening : startListening} className={`p-2 rounded ${isListening ? 'bg-red-500' : 'bg-gray-500'} text-white`}><i className="fas fa-microphone"></i></button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">পাঠান</button></form></div>
    );
};
