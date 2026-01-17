
import React, { useState, useEffect } from 'react';
import type { Post } from '../types.ts';

interface PostEditorModalProps { post: Post; onClose: () => void; onUpdate: (post: Post) => void; onDelete: (postId: string) => void; }

export const PostEditorModal: React.FC<PostEditorModalProps> = ({ post, onClose, onUpdate, onDelete }) => {
  const [editedPost, setEditedPost] = useState<Post>(post);
  useEffect(() => { setEditedPost(post); }, [post]);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center"><h2 className="text-xl font-bold">পোস্ট সম্পাদনা</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">&times;</button></div>
        <div className="p-6 space-y-4">
          <textarea value={editedPost.content} onChange={e => setEditedPost(p => ({...p, content: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" rows={6}></textarea>
          {editedPost.imageUrl && <img src={editedPost.imageUrl} className="w-full rounded" />}
        </div>
        <div className="p-4 border-t dark:border-gray-700 flex justify-between">
          <button onClick={() => onDelete(post.id)} className="px-4 py-2 bg-red-600 text-white rounded">মুছে ফেলুন</button>
          <button onClick={() => onUpdate(editedPost)} className="px-4 py-2 bg-blue-600 text-white rounded">সেভ করুন</button>
        </div>
      </div>
    </div>
  );
};
 