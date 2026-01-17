
import React from 'react';

interface HeaderProps { onNewPostClick: () => void; title: string; theme: string; toggleTheme: () => void; setIsSidebarOpen: (isOpen: boolean) => void; }

export const Header: React.FC<HeaderProps> = ({ onNewPostClick, title, theme, toggleTheme, setIsSidebarOpen }) => {
  return (
    <header className="flex justify-between items-center h-20 px-6 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      <div className="flex items-center gap-4">
         <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"><i className="fas fa-bars"></i></button>
         <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 capitalize">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"><i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i></button>
        <button onClick={onNewPostClick} className="flex items-center px-4 py-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-full hover:scale-105 transition-transform"><i className="fas fa-plus-circle mr-2"></i>নতুন পোস্ট</button>
      </div>
    </header>
  );
};
