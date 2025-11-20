
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Hospital } from '../types';
import { MapPin, Phone, Plus, Search, Edit2, Trash2, Building } from 'lucide-react';
import LeafletMap from '../components/LeafletMap';
import ConfirmModal from '../components/ConfirmModal';
import { toPersianDigits } from '../utils/formatting';

const HospitalList: React.FC = () => {
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form State
  const emptyForm: Hospital = {
    id: 0, name: '', type: 'general', province: 'فارس', city: 'شیراز', address: '', phones: [], wards: [], personnel: {},
    location: { lat: 29.5916, lng: 52.5839 }
  };
  const [formData, setFormData] = useState<Hospital>(emptyForm);
  const [tempPhone, setTempPhone] = useState('');
  const [tempWard, setTempWard] = useState('');

  const filteredHospitals = state.hospitals.filter(h => 
    h.name.includes(search) || h.city.includes(search)
  );

  const handleOpenModal = (hospital?: Hospital) => {
    if (hospital) {
      setFormData(hospital);
      setEditingId(hospital.id);
    } else {
      setFormData({ ...emptyForm, id: Date.now() });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      dispatch({ type: 'UPDATE_HOSPITAL', payload: formData });
    } else {
      dispatch({ type: 'ADD_HOSPITAL', payload: formData });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      dispatch({ type: 'DELETE_HOSPITAL', payload: deleteId });
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">مدیریت مراکز درمانی</h2>
        <button onClick={() => handleOpenModal()} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition">
          <Plus size={18} /> افزودن بیمارستان
        </button>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-2.5 text-gray-400 w-4 h-4" />
        <input 
          type="text" 
          placeholder="جستجو در نام یا شهر..." 
          className="w-full md:w-1/3 pl-4 pr-9 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredHospitals.map(hospital => (
          <div key={hospital.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition">
            <div className="h-32 w-full relative">
              <LeafletMap lat={hospital.location?.lat || 29.5} lng={hospital.location?.lng || 52.5} readOnly />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 right-3 text-white font-bold flex items-center gap-2">
                <Building size={18} /> {hospital.name}
              </div>
            </div>
            <div className="p-4 space-y-3">
               <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                 <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{hospital.type === 'university' ? 'دانشگاهی' : 'عمومی'}</span>
                 <span>{hospital.city}</span>
               </div>
               
               <div className="text-sm space-y-1 dark:text-gray-300">
                 <p className="truncate"><span className="text-gray-400">آدرس:</span> {hospital.address || '-'}</p>
                 <p className="truncate"><span className="text-gray-400">رئیس:</span> {hospital.personnel?.head || '-'}</p>
                 <p className="truncate"><span className="text-gray-400">تلفن:</span> {hospital.phones && hospital.phones.length > 0 ? toPersianDigits(hospital.phones[0]) : '-'}</p>
               </div>

               <div className="flex justify-end gap-2 pt-2 border-t dark:border-gray-700">
                 <button onClick={() => handleOpenModal(hospital)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                 <button onClick={() => setDeleteId(hospital.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl my-8 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-lg dark:text-white">{editingId ? 'ویرایش بیمارستان' : 'افزودن بیمارستان جدید'}</h3>
              <button onClick={() => setIsModalOpen(false)}><Plus size={24} className="rotate-45 text-gray-500" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                   <label className="block text-xs text-gray-500 mb-1">نام مرکز</label>
                   <input required className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                   <label className="block text-xs text-gray-500 mb-1">نوع</label>
                   <select className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                     <option value="university">دانشگاهی</option>
                     <option value="general">عمومی</option>
                     <option value="private">خصوصی</option>
                     <option value="charity">خیریه</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs text-gray-500 mb-1">استان</label>
                   <input className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})} />
                </div>
                <div>
                   <label className="block text-xs text-gray-500 mb-1">شهر</label>
                   <input className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
                <div>
                   <label className="block text-xs text-gray-500 mb-1">تلفن</label>
                   <div className="flex gap-2">
                     <input className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="افزودن شماره..." value={tempPhone} onChange={e => setTempPhone(e.target.value)} />
                     <button type="button" onClick={() => { if(tempPhone) { setFormData({...formData, phones: [...(formData.phones || []), tempPhone]}); setTempPhone(''); } }} className="bg-primary-100 text-primary-600 p-2 rounded"><Plus size={16}/></button>
                   </div>
                   <div className="flex flex-wrap gap-1 mt-1">
                     {formData.phones?.map((p, i) => <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{toPersianDigits(p)}</span>)}
                   </div>
                </div>
                <div className="md:col-span-3">
                   <label className="block text-xs text-gray-500 mb-1">آدرس دقیق</label>
                   <input className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>

              {/* Personnel */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                   <label className="block text-xs text-gray-500 mb-1">رئیس بیمارستان</label>
                   <input className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" value={formData.personnel?.head || ''} onChange={e => setFormData({...formData, personnel: {...formData.personnel, head: e.target.value}})} />
                 </div>
                 <div>
                   <label className="block text-xs text-gray-500 mb-1">مترون</label>
                   <input className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" value={formData.personnel?.metron || ''} onChange={e => setFormData({...formData, personnel: {...formData.personnel, metron: e.target.value}})} />
                 </div>
                 <div>
                   <label className="block text-xs text-gray-500 mb-1">سوپروایزر</label>
                   <input className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" value={formData.personnel?.supervisor || ''} onChange={e => setFormData({...formData, personnel: {...formData.personnel, supervisor: e.target.value}})} />
                 </div>
              </div>
              
              {/* Wards */}
               <div>
                   <label className="block text-xs text-gray-500 mb-1">بخش‌های مرتبط</label>
                   <div className="flex gap-2 mb-2">
                     <input className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="نام بخش (مثال: ICU General)..." value={tempWard} onChange={e => setTempWard(e.target.value)} />
                     <button type="button" onClick={() => { if(tempWard) { setFormData({...formData, wards: [...formData.wards, tempWard]}); setTempWard(''); } }} className="bg-primary-100 text-primary-600 px-4 rounded">افزودن</button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {formData.wards.map((w, i) => (
                       <span key={i} className="text-sm bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full flex items-center gap-2">
                         {w} <button type="button" onClick={() => setFormData({...formData, wards: formData.wards.filter((_, idx) => idx !== i)})}><Plus size={14} className="rotate-45"/></button>
                       </span>
                     ))}
                   </div>
                </div>

              {/* Map */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">موقعیت روی نقشه (برای انتخاب کلیک کنید)</label>
                <div className="h-64 rounded-xl overflow-hidden border dark:border-gray-600">
                  <LeafletMap 
                    lat={formData.location?.lat || 29.59} 
                    lng={formData.location?.lng || 52.58} 
                    onLocationSelect={(lat, lng) => setFormData({...formData, location: { lat, lng }})}
                  />
                </div>
              </div>
            </form>

            <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">انصراف</button>
              <button onClick={handleSubmit} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition shadow-lg shadow-primary-500/30">ذخیره تغییرات</button>
            </div>
          </div>
        </div>
      )}
      
      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="حذف بیمارستان"
        message="آیا از حذف این مرکز درمانی اطمینان دارید؟ این عملیات قابل بازگشت نیست."
        confirmText="حذف شود"
        variant="danger"
      />
    </div>
  );
};

export default HospitalList;
