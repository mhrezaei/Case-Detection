import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserStatus } from '../types';
import { Settings, Zap, User as UserIcon, Wifi } from 'lucide-react';

const DevToolbar: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  if (state.appMode !== 'development') return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 md:bottom-4">
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 mb-4 w-72 animate-fade-in">
          <div className="flex justify-between items-center mb-3 border-b pb-2 dark:border-gray-700">
            <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200">ابزار توسعه</h3>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Dev Mode</span>
          </div>

          <div className="space-y-4">
            {/* User Status Simulation */}
            <div>
              <label className="text-xs text-gray-500 block mb-1 flex items-center gap-1">
                <UserIcon size={12} /> وضعیت کاربر
              </label>
              <select
                className="w-full text-sm border rounded p-1 dark:bg-gray-700 dark:border-gray-600"
                value={state.user?.status || 'unregistered'}
                onChange={(e) => dispatch({ type: 'UPDATE_USER_STATUS', payload: e.target.value as UserStatus })}
                disabled={!state.user}
              >
                <option value={UserStatus.ACTIVE}>فعال (Active)</option>
                <option value={UserStatus.PENDING}>در انتظار (Pending)</option>
                <option value={UserStatus.UNREGISTERED}>ثبت نام نشده</option>
                <option value={UserStatus.NOT_WHITELISTED}>غیرمجاز</option>
              </select>
            </div>

            {/* Network Delay Simulation */}
            <div>
              <label className="text-xs text-gray-500 block mb-1 flex items-center gap-1">
                <Wifi size={12} /> تاخیر شبکه ({state.networkDelay}ms)
              </label>
              <input
                type="range"
                min="0"
                max="3000"
                step="500"
                value={state.networkDelay}
                onChange={(e) => dispatch({ type: 'SET_NETWORK_DELAY', payload: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105"
        title="Dev Tools"
      >
        {isOpen ? <Zap size={24} className="text-yellow-400" /> : <Settings size={24} />}
      </button>
    </div>
  );
};

export default DevToolbar;