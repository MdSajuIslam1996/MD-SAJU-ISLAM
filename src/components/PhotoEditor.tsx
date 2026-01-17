
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { editImage } from '../services/geminiService';

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => resolve((reader.result as string).split(',')[1]); reader.onerror = reject; });

export const PhotoEditor: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback((files: File[]) => { const file = files[0]; setOriginalImage(file); setPreview(URL.createObjectURL(file)); setEditedImage(null); }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] } });

    const handleEdit = async () => {
        if (!originalImage || !prompt) return;
        setIsLoading(true); setEditedImage(null);
        try {
            const base64 = await fileToBase64(originalImage);
            const result = await editImage(base64, originalImage.type, prompt);
            setEditedImage(result);
        } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">AI ফটো এডিটর</h2>
            <div className="grid grid-cols-2 gap-4">
                <div {...getRootProps()} className="p-4 border-2 border-dashed rounded cursor-pointer flex items-center justify-center h-64">{preview ? <img src={preview} className="max-h-full" /> : <p>ছবি আপলোড করুন</p>}</div>
                <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded">{isLoading ? <p>প্রসেসিং...</p> : editedImage && <img src={editedImage} className="max-h-full" />}</div>
            </div>
            <div className="mt-4"><input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="কী পরিবর্তন করতে চান?" className="w-full p-2 border rounded dark:bg-gray-700" /><button onClick={handleEdit} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">পরিবর্তন করুন</button></div>
        </div>
    );
};
