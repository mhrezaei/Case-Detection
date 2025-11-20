
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserStatus } from '../types';
import Combobox from '../components/Combobox';
import { Loader2, Stethoscope, Phone, BookOpen, User, Clock } from 'lucide-react';

const Register: React.FC = () => {
  const { dispatch, state } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalId: '',
    workplaceId: '',
    workplacePhone: '',
    education: '',
    position: '',
    shift: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      dispatch({
        type: 'REGISTER_USER',
        payload: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          nationalId: formData.nationalId,
          workplaceId: Number(formData.workplaceId),
          workplacePhone: formData.workplacePhone,
          education: formData.education,
          position: formData.position,
          shift: formData.shift
        }
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in">
        <div className="text-center mb-8">
          <div className="bg-primary-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
             <Stethoscope className="text-primary-600 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تکمیل پروفایل پرسنل</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">لطفاً اطلاعات خود را جهت احراز هویت با دقت وارد نمایید.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Personal Info */}
          <div>
             <h3 className="text-sm font-bold text-primary-600 mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">اطلاعات فردی</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نام</label>
                    <input required type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نام خانوادگی</label>
                    <input required type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">کد ملی</label>
                  <input required type="text" maxLength={10} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" value={formData.nationalId} onChange={(e) => setFormData({...formData, nationalId: e.target.value.replace(/\D/g, '')})} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"><BookOpen size={14}/> مدرک تحصیلی</label>
                   <input required type="text" placeholder="مثال: کارشناسی پرستاری" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" value={formData.education} onChange={(e) => setFormData({...formData, education: e.target.value})} />
                </div>
             </div>
          </div>

          {/* Work Info */}
          <div>
             <h3 className="text-sm font-bold text-primary-600 mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">اطلاعات شغلی</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">محل خدمت</label>
                  <Combobox 
                    options={state.hospitals.map(h => ({ value: h.id, label: h.name }))}
                    value={Number(formData.workplaceId)}
                    onChange={(val) => setFormData({...formData, workplaceId: String(val)})}
                    placeholder="جستجوی بیمارستان..."
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"><User size={14}/> سمت</label>
                   <input required type="text" placeholder="مثال: سوپروایزر" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
                </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"><Clock size={14}/> شیفت کاری</label>
                   <input required type="text" placeholder="مثال: صبح" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" value={formData.shift} onChange={(e) => setFormData({...formData, shift: e.target.value})} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"><Phone size={14}/> تلفن ثابت محل کار</label>
                   <input required type="tel" placeholder="021xxxxxxxx" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none text-left ltr" value={formData.workplacePhone} onChange={(e) => setFormData({...formData, workplacePhone: e.target.value})} />
                </div>
             </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition-colors mt-4 flex justify-center items-center"
          >
             {isLoading ? <Loader2 className="animate-spin" /> : 'ثبت اطلاعات'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
