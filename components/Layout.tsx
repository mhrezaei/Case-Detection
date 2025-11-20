
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, PlusCircle, List, User, LogOut, Moon, Sun, Stethoscope, Users, Building } from 'lucide-react';
import Footer from './Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, dispatch } = useApp();
  const location = useLocation();

  // Don't show layout on login page
  if (!state.isAuthenticated) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">{children}</div>;
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'داشبورد', path: '/' },
    { icon: List, label: 'کیس‌ها', path: '/cases' },
    { icon: PlusCircle, label: 'ثبت مورد', path: '/new-case' },
    { icon: Building, label: 'بیمارستان‌ها', path: '/hospitals' },
    { icon: Users, label: 'بازرسان', path: '/users' },
    { icon: User, label: 'پروفایل', path: '/profile' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 fixed h-full z-30">
        <div className="p-6 flex items-center gap-3 border-b dark:border-gray-700">
          <div className="bg-primary-500 p-2 rounded-lg">
            <Stethoscope className="text-white w-6 h-6" />
          </div>
          <h1 className="font-bold text-lg text-gray-800 dark:text-white">سامانه اهدای عضو</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t dark:border-gray-700 space-y-2 bg-white dark:bg-gray-800 z-10">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
            className="flex items-center gap-3 p-3 w-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {state.isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{state.isDarkMode ? 'روز' : 'شب'}</span>
          </button>
          <button
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="flex items-center gap-3 p-3 w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
          >
            <LogOut size={20} />
            <span>خروج</span>
          </button>
        </div>
      </aside>

      {/* Mobile Content Wrapper */}
      <main className="flex-1 md:mr-64 pb-20 md:pb-0 flex flex-col min-h-screen md:min-h-0">
         {/* Mobile Header */}
         <div className="md:hidden bg-white dark:bg-gray-800 p-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
             <div className="flex items-center gap-2">
                <div className="bg-primary-500 p-1.5 rounded-md">
                  <Stethoscope className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-gray-800 dark:text-white">اهدای عضو</span>
             </div>
             <button onClick={() => dispatch({ type: 'TOGGLE_THEME' })} className="text-gray-600 dark:text-gray-300">
                {state.isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
         </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>

        <Footer className="mt-auto border-t dark:border-gray-700" />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex justify-around p-2 z-40 safe-area-pb overflow-x-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs min-w-[60px] p-1 rounded-lg ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-gray-700/50'
                  : 'text-gray-400 dark:text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="whitespace-nowrap scale-90">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
