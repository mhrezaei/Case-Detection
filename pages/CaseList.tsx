
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { STATUS_COLORS, STATUS_LABELS } from '../constants';
import { CaseStatus } from '../types';
import { Search, Filter, Calendar, Activity, ArrowUpDown, MapPin, Loader2, Building } from 'lucide-react';
import { findNearestHospital } from '../utils/location';
import { toPersianDigits } from '../utils/formatting';

const CaseList: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [filter, setFilter] = useState<string>('ALL');
  const [hospitalFilter, setHospitalFilter] = useState<number | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    const statusParam = searchParams.get('filter');
    if (statusParam) {
      setFilter(statusParam);
    }
    const hospitalParam = searchParams.get('hospitalId');
    if (hospitalParam) {
      setHospitalFilter(Number(hospitalParam));
    }
  }, [searchParams]);

  const filteredCases = state.cases
    .filter(c => {
      if (filter === 'ALL') return true;
      if (filter === 'ACTIVE') return c.status !== CaseStatus.EXPIRED && c.status !== CaseStatus.OTHER;
      return c.status === filter;
    })
    .filter(c => {
      if (hospitalFilter === 'ALL') return true;
      return c.hospitalId === hospitalFilter;
    })
    .filter(c => {
      const matchesSearch = c.patientName.includes(search) || c.nationalId.includes(search);
      return matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = a.admissionDate.localeCompare(b.admissionDate);
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else if (sortBy === 'name') {
        comparison = a.patientName.localeCompare(b.patientName);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleFilterByLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const result = findNearestHospital(latitude, longitude, state.hospitals);
          if (result) {
            setHospitalFilter(result.hospital.id);
          } else {
            alert('هیچ بیمارستانی در نزدیکی شما یافت نشد.');
          }
          setIsLocating(false);
        },
        (error) => {
          alert('خطا در دریافت موقعیت مکانی.');
          setIsLocating(false);
        }
      );
    } else {
      alert('مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند.');
      setIsLocating(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">لیست کیس‌ها</h2>
        
        <div className="flex flex-col lg:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute right-3 top-2.5 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="جستجو (نام، کدملی)..." 
              className="pl-4 pr-9 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white w-full text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="relative w-full md:w-48">
            <Filter className="absolute right-3 top-2.5 text-gray-400 w-4 h-4" />
            <select 
              className="pl-4 pr-9 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white w-full text-sm focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">همه وضعیت‌ها</option>
              <option value="ACTIVE">فقط فعال‌ها</option>
              <hr />
              {(Object.values(CaseStatus) as CaseStatus[]).map(status => (
                <option key={status} value={status}>{STATUS_LABELS[status]}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-48">
              <Building className="absolute right-3 top-2.5 text-gray-400 w-4 h-4" />
              <select 
                className="pl-4 pr-9 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white w-full text-sm focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
                value={hospitalFilter}
                onChange={(e) => setHospitalFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              >
                <option value="ALL">همه بیمارستان‌ها</option>
                {state.hospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleFilterByLocation}
              disabled={isLocating}
              className="bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-gray-700 dark:text-primary-400 dark:hover:bg-gray-600 p-2 rounded-lg border border-primary-100 dark:border-gray-600 transition-colors flex items-center justify-center gap-2 min-w-[42px]"
              title="فیلتر بر اساس نزدیکترین بیمارستان (GPS)"
            >
              {isLocating ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex md:hidden gap-2 overflow-x-auto no-scrollbar pb-2">
        <button onClick={() => toggleSort('date')} className={`px-3 py-1 rounded-full text-xs whitespace-nowrap border ${sortBy === 'date' ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-gray-200'}`}>
          تاریخ {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button onClick={() => toggleSort('status')} className={`px-3 py-1 rounded-full text-xs whitespace-nowrap border ${sortBy === 'status' ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-gray-200'}`}>
          وضعیت {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:hidden gap-4">
        {filteredCases.map((c) => (
          <div key={c.id} onClick={() => navigate(`/cases/${c.id}`)} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up cursor-pointer active:scale-[0.98] transition-transform">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{c.patientName}</h3>
                <p className="text-xs text-gray-500 mt-1">کدملی: {toPersianDigits(c.nationalId)}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[c.status]}`}>
                {STATUS_LABELS[c.status]}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
              <div className="flex items-center gap-1.5">
                 <Calendar size={14} className="text-gray-400" />
                 <span>{toPersianDigits(c.admissionDate)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <Activity size={14} className="text-gray-400" />
                 <span>GCS: {toPersianDigits(c.gcs || '-')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700 mt-2">
              <span className="text-xs text-gray-500 truncate max-w-[150px]">{c.hospitalName}</span>
              <button className="text-primary-600 text-sm font-medium">مشاهده</button>
            </div>
          </div>
        ))}
        {filteredCases.length === 0 && (
             <div className="text-center py-8 text-gray-400 text-sm">موردی مطابق فیلترها یافت نشد.</div>
        )}
      </div>

      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-sm">
            <tr>
              <th className="p-4 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => toggleSort('name')}>نام بیمار</th>
              <th className="p-4 font-semibold">کد ملی</th>
              <th className="p-4 font-semibold">بیمارستان</th>
              <th className="p-4 font-semibold">بخش</th>
              <th className="p-4 font-semibold">GCS</th>
              <th className="p-4 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => toggleSort('date')}>
                 <div className="flex items-center gap-1">تاریخ بستری {sortBy === 'date' && <ArrowUpDown size={14} />}</div>
              </th>
              <th className="p-4 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => toggleSort('status')}>وضعیت</th>
              <th className="p-4 font-semibold">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {filteredCases.map((c) => (
              <tr key={c.id} onClick={() => navigate(`/cases/${c.id}`)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-sm text-gray-700 dark:text-gray-300">
                <td className="p-4 font-medium">{c.patientName}</td>
                <td className="p-4 font-mono">{toPersianDigits(c.nationalId)}</td>
                <td className="p-4">{c.hospitalName}</td>
                <td className="p-4">{c.ward}</td>
                <td className="p-4">{toPersianDigits(c.gcs)}</td>
                <td className="p-4">{toPersianDigits(c.admissionDate)}</td>
                <td className="p-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full border whitespace-nowrap ${STATUS_COLORS[c.status]}`}>
                    {STATUS_LABELS[c.status]}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-primary-600 hover:text-primary-700 font-medium">جزئیات</button>
                </td>
              </tr>
            ))}
            {filteredCases.length === 0 && (
               <tr>
                 <td colSpan={8} className="p-8 text-center text-gray-500">موردی یافت نشد</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CaseList;
