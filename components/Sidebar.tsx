
import React from 'react';

interface SidebarProps { activeView: string; setActiveView: (view: string) => void; isSidebarOpen: boolean; setIsSidebarOpen: (isOpen: boolean) => void; }

const SidebarIcon: React.FC<{ icon: string; text: string; active?: boolean; onClick: () => void; }> = ({ icon, text, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center px-4 py-3 my-1 rounded-lg transition-all duration-300 group text-left ${active ? 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-l-4 border-blue-500' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'}`}>
    <i className={`fas ${icon} w-6 h-6 text-center text-lg`}></i>
    <span className="mx-4 font-semibold">{text}</span>
  </button>
);

const navItems = ["ড্যাশবোর্ড", "ক্যালেন্ডার", "ইনবক্স", "চ্যাট সহকারী", "ফটো এডিটর", "আইডিয়া ল্যাব", "অ্যানালিಟಿಕ್ಸ್", "সেটিংস"];
const navIcons: { [key: string]: string } = { "ড্যাশবোর্ড": "fa-tachometer-alt", "ক্যালেন্ডার": "fa-calendar-alt", "ইনবক্স": "fa-inbox", "চ্যাট সহকারী": "fa-comments", "ফটো এডিটর": "fa-paint-brush", "আইডিয়া ল্যাব": "fa-lightbulb", "অ্যানালিಟಿಕ್ಸ್": "fa-chart-line", "সেটিংস": "fa-cog" };

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isSidebarOpen, setIsSidebarOpen }) => {
    const handleNavItemClick = (item: string) => {
        setActiveView(item);
        setIsSidebarOpen(false);
    };

    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
            <div className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-800 z-40 md:relative md:translate-x-0 transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between h-20 px-4 border-b dark:border-gray-800">
                    <div className="flex items-center"><i className="fas fa-robot text-3xl text-blue-500"></i><h1 className="text-xl font-bold ml-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">AI Assistant</h1></div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-200"><i className="fas fa-times"></i></button>
                </div>
                <nav className="flex-1 overflow-y-auto mt-4 px-2">{navItems.map(item => <SidebarIcon key={item} icon={navIcons[item]} text={item} active={activeView === item} onClick={() => handleNavItemClick(item)} />)}</nav>
            </div>
        </>
    );
};
