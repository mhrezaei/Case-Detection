
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, UserRole } from '../types';
import Combobox from '../components/Combobox';
import { Edit2, Save, X, User as UserIcon, MapPin, Phone, BookOpen, Briefcase, Clock } from 'lucide-react';

const Profile: React.FC = () => {
  const { state, dispatch } = useApp();
  const user = state.user;
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    nationalId: user?.nationalId || '',
    mobile: user?.mobile || '',
    workplaceId: user?.workplaceId,
    workplacePhone: user?.workplacePhone || '',
    education: user?.education || '',
    position: user?.position || '',
    shift: user?.shift || ''
  });

  if (!user) return null;

  const hospitalName = state.hospitals.find(h => h.id === user.workplaceId)?.name || 'نامشخص';

  const handleSave = () => {
    dispatch({ type: 'UPDATE_PROFILE', payload: formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      nationalId: user.nationalId || '',
      mobile: user.mobile || '',
      workplaceId: user.workplaceId,
      workplacePhone: user.workplacePhone || '',
      education: user.education || '',
      position: user.position || '',
      shift: user.shift || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        
        {/* Cover / Header */}
        <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-700"></div>
        
        <div className="px-6 pb-6 relative">
          {/* Avatar & Actions */}
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-700 p-1 shadow-md">
                <div className="w-full h-full rounded-xl bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={40} className="text-gray-400" />
                  )}
                </div>
              </div>
              <div className="mb-1">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{user.firstName} {user.lastName}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="capitalize">{user.role === UserRole.ADMIN ? 'مدیر سیستم' : user.role === UserRole.INSPECTOR ? 'بازرس' : 'پرسنل درمانی'}</span>
                  <span>•</span>
                  <span className={user.status === 'active' ? 'text-green-600' : 'text-orange-500'}>{user.status === 'active' ? 'فعال' : 'غیرفعال'}</span>
                </div>
              </div>
            </div>
            
            <div>
               {isEditing ? (
                 <div className="flex gap-2">
                    <button onClick={handleCancel} className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm flex items-center gap-2">
                      <X size={16} /> انصراف
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm flex items-center gap-2 shadow-lg shadow-green-500/30">
                      <Save size={16} /> ذخیره
                    </button>
                 </div>
               ) : (
                 <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-gray-700 dark:text-primary-400 text-sm flex items-center gap-2 transition">
                   <Edit2 size={16} /> ویرایش پروفایل
                 </button>
               )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Personal Info Section */}
            <div className="space-y-4">
               <h3 className="font-bold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2">اطلاعات هویتی</h3>
               
               <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-xs text-gray-500 block mb-1">نام</label>
                       {isEditing ? (
                         <input className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                       ) : <p className="text-sm font-medium dark:text-gray-200">{user.firstName}</p>}
                    </div>
                    <div>
                       <label className="text-xs text-gray-500 block mb-1">نام خانوادگی</label>
                       {isEditing ? (
                         <input className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                       ) : <p className="text-sm font-medium dark:text-gray-200">{user.lastName}</p>}
                    </div>
                 </div>
                 
                 <div>
                    <label className="text-xs text-gray-500 block mb-1">کد ملی</label>
                    {isEditing ? (
                       <input maxLength={10} className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.nationalId} onChange={e => setFormData({...formData, nationalId: e.target.value})} />
                    ) : <p className="text-sm font-medium dark:text-gray-200 font-mono tracking-wide">{user.nationalId || '-'}</p>}
                 </div>

                 <div>
                    <label className="text-xs text-gray-500 block mb-1">شماره موبایل</label>
                    <p className="text-sm font-medium dark:text-gray-200 font-mono tracking-wide">{user.mobile}</p>
                    {isEditing && <p className="text-[10px] text-gray-400 mt-1">شماره موبایل قابل تغییر نیست</p>}
                 </div>

                 <div>
                    <label className="text-xs text-gray-500 block mb-1 flex items-center gap-1"><BookOpen size={12}/> مدرک تحصیلی</label>
                    {isEditing ? (
                       <input className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} />
                    ) : <p className="text-sm font-medium dark:text-gray-200">{user.education || '-'}</p>}
                 </div>
               </div>
            </div>

            {/* Work Info Section */}
            <div className="space-y-4">
               <h3 className="font-bold text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2">اطلاعات شغلی</h3>
               
               <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1 flex items-center gap-1"><MapPin size={12}/> محل خدمت</label>
                    {isEditing ? (
                       <Combobox 
                          options={state.hospitals.map(h => ({ value: h.id, label: h.name }))}
                          value={Number(formData.workplaceId)}
                          onChange={(val) => setFormData({...formData, workplaceId: Number(val)})}
                          className="text-sm"
                       />
                    ) : <p className="text-sm font-medium dark:text-gray-200">{hospitalName}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1 flex items-center gap-1"><Briefcase size={12}/> سمت</label>
                        {isEditing ? (
                          <input className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
                        ) : <p className="text-sm font-medium dark:text-gray-200">{user.position || '-'}</p>}
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1 flex items-center gap-1"><Clock size={12}/> شیفت</label>
                        {isEditing ? (
                          <input className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})} />
                        ) : <p className="text-sm font-medium dark:text-gray-200">{user.shift || '-'}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1 flex items-center gap-1"><Phone size={12}/> تلفن ثابت محل کار</label>
                    {isEditing ? (
                       <input className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white ltr text-left" value={formData.workplacePhone} onChange={e => setFormData({...formData, workplacePhone: e.target.value})} />
                    ) : <p className="text-sm font-medium dark:text-gray-200 font-mono">{user.workplacePhone || '-'}</p>}
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
