
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Activity, Users, CheckCircle, Clock, AlertTriangle, MapPin, RefreshCw } from 'lucide-react';
import { STATUS_COLORS, STATUS_LABELS } from '../constants';
import { CaseStatus, Hospital } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { findNearestHospital } from '../utils/location';
import { toPersianDigits } from '../utils/formatting';

// Chart Colors matching the theme
const CHART_COLORS: Record<CaseStatus, string> = {
  [CaseStatus.NEW]: '#3b82f6',          // blue-500
  [CaseStatus.PROBABLE]: '#f97316',     // orange-500
  [CaseStatus.CONFIRMED]: '#ef4444',    // red-500
  [CaseStatus.IMPROVING]: '#22c55e',    // green-500
  [CaseStatus.CONSENT_GIVEN]: '#14b8a6',// teal-500
  [CaseStatus.EXPIRED]: '#64748b',      // slate-500
  [CaseStatus.OTHER]: '#94a3b8',        // slate-400
};

const Dashboard: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const cases = state.cases;

  const [currentLocation, setCurrentLocation] = useState<{hospital: Hospital, distance: number} | null>(null);
  const [presenceStatus, setPresenceStatus] = useState<'loading' | 'found' | 'not_found' | 'error'>('loading');
  const [lastChecked, setLastChecked] = useState<string>('');

  const checkPresence = () => {
    setPresenceStatus('loading');
    if (!('geolocation' in navigator)) {
       setPresenceStatus('error');
       return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const result = findNearestHospital(latitude, longitude, state.hospitals, 0.5);
        
        if (result) {
          setCurrentLocation(result);
          setPresenceStatus('found');
        } else {
          setCurrentLocation(null);
          setPresenceStatus('not_found');
        }
        setLastChecked(new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }));
      },
      (error) => {
        setPresenceStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    checkPresence();
  }, []);

  const totalCases = cases.length;
  const activeCases = cases.filter(c => c.status !== CaseStatus.EXPIRED && c.status !== CaseStatus.OTHER).length;
  const confirmedCases = cases.filter(c => c.status === CaseStatus.CONFIRMED).length;
  
  const statCards = [
    { label: 'کل کیس‌ها', value: totalCases, icon: Users, color: 'bg-blue-500', filter: 'ALL' },
    { label: 'فعال', value: activeCases, icon: Activity, color: 'bg-green-500', filter: 'ACTIVE' },
    { label: 'تایید شده', value: confirmedCases, icon: CheckCircle, color: 'bg-teal-500', filter: CaseStatus.CONFIRMED },
    { label: 'مشکوک', value: cases.filter(c => c.status === CaseStatus.PROBABLE).length, icon: AlertTriangle, color: 'bg-orange-500', filter: CaseStatus.PROBABLE },
  ];

  // Show all statuses in chart
  const chartData = (Object.values(CaseStatus) as CaseStatus[]).map(status => ({
    name: STATUS_LABELS[status],
    status: status,
    count: cases.filter(c => c.status === status).length
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">داشبورد</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">خوش آمدید، {state.user?.firstName} {state.user?.lastName}</p>
        </div>
      </div>

      {/* Presence Widget */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-5 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
             <MapPin size={28} className="text-white" />
          </div>
          <div>
            <p className="text-indigo-200 text-xs mb-1">موقعیت مکانی شما</p>
            {presenceStatus === 'loading' && <p className="font-bold flex items-center gap-2"><RefreshCw className="animate-spin w-4 h-4" /> در حال شناسایی...</p>}
            {presenceStatus === 'error' && <p className="font-bold text-red-200">خطا در دریافت GPS</p>}
            {presenceStatus === 'not_found' && <p className="font-bold">خارج از محدوده بیمارستان</p>}
            {presenceStatus === 'found' && currentLocation && (
              <div>
                <p className="font-bold text-lg">{currentLocation.hospital.name}</p>
                <p className="text-xs text-indigo-200 mt-0.5 flex items-center gap-1">
                  <CheckCircle size={10} /> حضور شما ثبت شد
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
           <button 
             onClick={checkPresence} 
             className="bg-white/20 hover:bg-white/30 transition px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
             disabled={presenceStatus === 'loading'}
           >
             <RefreshCw size={14} className={presenceStatus === 'loading' ? 'animate-spin' : ''} /> بروزرسانی
           </button>
           {lastChecked && <span className="text-[10px] text-indigo-300">آخرین بررسی: {toPersianDigits(lastChecked)}</span>}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div 
            key={idx} 
            onClick={() => navigate(`/cases?filter=${stat.filter}`)}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
          >
            <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-opacity-20`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white font-sans">{toPersianDigits(stat.value)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <h3 className="font-bold text-gray-800 dark:text-white mb-6">وضعیت کلی کیس‌ها</h3>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{fontFamily: 'Vazirmatn', fontSize: 10}} stroke="#94a3b8" />
                  <YAxis tick={{fontFamily: 'Vazirmatn'}} tickFormatter={(val) => toPersianDigits(val)} stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{fontFamily: 'Vazirmatn'}}
                    formatter={(val: number | string | Array<number | string>) => Array.isArray(val) ? val.map(v => toPersianDigits(v)).join(' - ') : toPersianDigits(val)}
                    cursor={{fill: 'transparent'}}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={30}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[entry.status]} />
                    ))}
                  </Bar>
                </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-gray-800 dark:text-white">فعالیت‌های اخیر</h3>
             <button onClick={() => navigate('/cases')} className="text-primary-500 text-xs hover:underline">مشاهده همه</button>
          </div>
          
          <div className="space-y-4">
            {cases.slice(0, 4).map((c) => (
              <div key={c.id} onClick={() => navigate(`/cases/${c.id}`)} className="flex items-start gap-3 pb-3 border-b dark:border-gray-700 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded transition">
                <div className="mt-1">
                  <Clock size={16} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{c.patientName}</p>
                  <div className="flex gap-2 items-center mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[c.status]}`}>
                      {STATUS_LABELS[c.status]}
                    </span>
                    <span className="text-xs text-gray-400">{c.hospitalName}</span>
                  </div>
                </div>
              </div>
            ))}
            {cases.length === 0 && <p className="text-gray-400 text-center text-sm py-4">موردی یافت نشد</p>}
          </div>
        </div>
      </div>

      <button 
        onClick={() => navigate('/new-case')}
        className="md:hidden fixed bottom-24 left-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-primary-700 transition-transform hover:scale-105 z-40"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default Dashboard;
