
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserStatus, UserRole, User } from '../types';
import { Search, Filter, CheckCircle, XCircle, Trash2, Edit2, Save, X } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import Combobox from '../components/Combobox';
import { toPersianDigits } from '../utils/formatting';

const UserList: React.FC = () => {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  if (state.user?.role !== UserRole.ADMIN) {
     return <div className="p-8 text-center text-gray-500">دسترسی غیرمجاز</div>;
  }

  const filteredUsers = state.users.filter(u => {
    const matchesSearch = 
      (u.firstName + ' ' + u.lastName).includes(search) || 
      u.mobile.includes(search);
    const matchesFilter = filterStatus === 'ALL' || u.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getHospitalName = (id?: number) => {
    return state.hospitals.find(h => h.id === id)?.name || '-';
  };

  const handleStatusChange = (userId: string, newStatus: UserStatus) => {
    dispatch({ type: 'UPDATE_USER_ROLE_STATUS', payload: { id: userId, status: newStatus } });
  };
  
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    dispatch({ type: 'UPDATE_USER_ROLE_STATUS', payload: { id: userId, role: newRole } });
  };

  const handleDelete = () => {
    if (deleteId) {
      dispatch({ type: 'DELETE_USER', payload: deleteId });
      setDeleteId(null);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      dispatch({ type: 'UPDATE_ANY_USER', payload: editingUser });
      setIsEditModalOpen(false);
      setEditingUser(null);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">مدیریت کاربران</h2>

      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative flex-1">
           <Search className="absolute right-3 top-2.5 text-gray-400 w-4 h-4" />
           <input 
              className="w-full pl-4 pr-9 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="جستجوی نام یا شماره موبایل..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
           />
        </div>
        <div className="relative w-full sm:w-48">
           <Filter className="absolute right-3 top-2.5 text-gray-400 w-4 h-4" />
           <select 
             className="w-full pl-4 pr-9 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
             value={filterStatus}
             onChange={(e) => setFilterStatus(e.target.value)}
           >
             <option value="ALL">همه وضعیت‌ها</option>
             <option value={UserStatus.ACTIVE}>فعال</option>
             <option value={UserStatus.PENDING}>در انتظار</option>
             <option value={UserStatus.NOT_WHITELISTED}>غیرمجاز</option>
           </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-xs uppercase">
              <tr>
                <th className="p-4">کاربر</th>
                <th className="p-4">نقش</th>
                <th className="p-4">محل خدمت</th>
                <th className="p-4">تاریخ عضویت</th>
                <th className="p-4">وضعیت</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                        {user.firstName ? user.firstName[0] : 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white text-sm">{user.firstName} {user.lastName || 'نامشخص'}</p>
                        <p className="text-xs text-gray-400 font-mono">{toPersianDigits(user.mobile)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <select 
                      value={user.role} 
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      className="bg-transparent border-none text-sm outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 rounded px-1"
                    >
                       <option value={UserRole.ADMIN}>مدیر سیستم</option>
                       <option value={UserRole.INSPECTOR}>بازرس</option>
                       <option value={UserRole.STAFF}>پرسنل</option>
                    </select>
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {getHospitalName(user.workplaceId)}
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {toPersianDigits(user.registrationDate || '-')}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs border ${
                      user.status === UserStatus.ACTIVE ? 'bg-green-50 text-green-700 border-green-200' :
                      user.status === UserStatus.PENDING ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {user.status === UserStatus.ACTIVE ? 'فعال' : 
                       user.status === UserStatus.PENDING ? 'در انتظار' : 'مسدود/غیرمجاز'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                       <button onClick={() => openEditModal(user)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="ویرایش پروفایل"><Edit2 size={18}/></button>
                       {user.status === UserStatus.PENDING ? (
                         <button onClick={() => handleStatusChange(user.id, UserStatus.ACTIVE)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="تایید"><CheckCircle size={18}/></button>
                       ) : user.status === UserStatus.ACTIVE ? (
                         <button onClick={() => handleStatusChange(user.id, UserStatus.NOT_WHITELISTED)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded" title="مسدود کردن"><XCircle size={18}/></button>
                       ) : (
                         <button onClick={() => handleStatusChange(user.id, UserStatus.ACTIVE)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="فعال سازی"><CheckCircle size={18}/></button>
                       )}
                       <button onClick={() => setDeleteId(user.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="حذف"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
           <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                 <h3 className="font-bold text-lg dark:text-white">ویرایش کاربر</h3>
                 <button onClick={() => setIsEditModalOpen(false)}><X size={24} className="text-gray-500" /></button>
              </div>
              <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs text-gray-500 mb-1">نام</label>
                       <input required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" value={editingUser.firstName || ''} onChange={e => setEditingUser({...editingUser, firstName: e.target.value})} />
                    </div>
                    <div>
                       <label className="block text-xs text-gray-500 mb-1">نام خانوادگی</label>
                       <input required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" value={editingUser.lastName || ''} onChange={e => setEditingUser({...editingUser, lastName: e.target.value})} />
                    </div>
                    <div>
                       <label className="block text-xs text-gray-500 mb-1">شماره موبایل</label>
                       <input className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 ltr text-left" value={editingUser.mobile} onChange={e => setEditingUser({...editingUser, mobile: e.target.value})} />
                    </div>
                     <div>
                       <label className="block text-xs text-gray-500 mb-1">کد ملی</label>
                       <input maxLength={10} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" value={editingUser.nationalId || ''} onChange={e => setEditingUser({...editingUser, nationalId: e.target.value})} />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 dark:border-gray-700">
                    <div className="md:col-span-2">
                       <label className="block text-xs text-gray-500 mb-1">محل خدمت</label>
                       <Combobox 
                          options={state.hospitals.map(h => ({ value: h.id, label: h.name }))}
                          value={Number(editingUser.workplaceId)}
                          onChange={(val) => setEditingUser({...editingUser, workplaceId: Number(val)})}
                       />
                    </div>
                     <div>
                       <label className="block text-xs text-gray-500 mb-1">سمت</label>
                       <input className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" value={editingUser.position || ''} onChange={e => setEditingUser({...editingUser, position: e.target.value})} />
                    </div>
                     <div>
                       <label className="block text-xs text-gray-500 mb-1">مدرک تحصیلی</label>
                       <input className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" value={editingUser.education || ''} onChange={e => setEditingUser({...editingUser, education: e.target.value})} />
                    </div>
                 </div>

                 <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">انصراف</button>
                    <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2">
                       <Save size={18} /> ذخیره تغییرات
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="حذف کاربر"
        message="آیا از حذف این کاربر اطمینان دارید؟ تمامی دسترسی‌های ایشان قطع خواهد شد."
        confirmText="حذف کاربر"
        variant="danger"
      />
    </div>
  );
};

export default UserList;
