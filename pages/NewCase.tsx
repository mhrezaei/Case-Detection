
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CaseStatus, VisitType } from '../types';
import { validateNationalId } from '../utils/validation';
import { MapPin, Phone, Plus, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Combobox from '../components/Combobox';
import { toPersianDigits } from '../utils/formatting';

const NewCase: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const defaultHospitalId = state.hospitals.length > 0 ? state.hospitals[0].id : 0;

  const [formData, setFormData] = useState({
    nationalId: '',
    patientName: '',
    age: '',
    visitType: VisitType.PHONE,
    hospitalId: state.user?.workplaceId || defaultHospitalId,
    ward: '',
    gcs: '',
    location: null as { lat: number; lng: number } | null
  });

  const selectedHospital = state.hospitals.find(h => h.id === Number(formData.hospitalId));
  const availableWards = selectedHospital?.wards || [];

  const handleLocationRequest = () => {
    setLocationStatus('loading');
    // Simulate or Real GPS
    try {
      if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setFormData(prev => ({ ...prev, location: { lat: position.coords.latitude, lng: position.coords.longitude } }));
            setLocationStatus('success');
          },
          (error) => {
             // Fallback logic for dev mode or error handling
             if (state.appMode === 'development') {
                // Mock location for dev
                setTimeout(() => {
                    setFormData(prev => ({ ...prev, location: { lat: 29.6, lng: 52.5 } }));
                    setLocationStatus('success');
                }, 1000);
             } else {
                setLocationStatus('error');
             }
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      } else {
        setLocationStatus('error');
      }
    } catch (error) {
      setLocationStatus('error');
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!validateNationalId(formData.nationalId)) errors.nationalId = 'کد ملی نامعتبر است';
    if (formData.visitType === VisitType.IN_PERSON && !formData.location) errors.location = 'در ویزیت حضوری ثبت موقعیت الزامی است';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      const newCase = {
        id: `c${Date.now()}`,
        patientName: formData.patientName,
        nationalId: formData.nationalId,
        age: Number(formData.age),
        admissionDate: new Date().toLocaleDateString('fa-IR'),
        status: CaseStatus.NEW,
        hospitalId: Number(formData.hospitalId),
        hospitalName: selectedHospital?.name || '',
        ward: formData.ward,
        gcs: Number(formData.gcs),
        logs: [
          {
            id: `l${Date.now()}`,
            userId: state.user?.id || 'unknown',
            userName: `${state.user?.firstName} ${state.user?.lastName}`,
            timestamp: new Date().toLocaleString('fa-IR'),
            action: 'ایجاد کیس جدید',
            visitType: formData.visitType,
            location: formData.location || undefined
          }
        ],
        attachments: []
      };

      dispatch({ type: 'ADD_CASE', payload: newCase });
      setIsLoading(false);
      navigate('/cases');
    }, state.networkDelay + 800);
  };

  return (
    <div className="max-w-2xl mx-auto pb-10 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">ثبت مورد جدید</h2>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        
        {/* Visit Type Selector */}
        <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
          <button type="button" onClick={() => setFormData({ ...formData, visitType: VisitType.PHONE })} className={`py-3 rounded-lg text-sm font-medium flex justify-center items-center gap-2 transition-all ${formData.visitType === VisitType.PHONE ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
            <Phone size={18} /> تلفنی
          </button>
          <button type="button" onClick={() => { setFormData({ ...formData, visitType: VisitType.IN_PERSON }); handleLocationRequest(); }} className={`py-3 rounded-lg text-sm font-medium flex justify-center items-center gap-2 transition-all ${formData.visitType === VisitType.IN_PERSON ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
            <MapPin size={18} /> حضوری
          </button>
        </div>

        {/* Location Status Indicator (Map Hidden) */}
        {formData.visitType === VisitType.IN_PERSON && (
          <div className={`p-4 rounded-lg border flex items-center gap-3 transition-colors ${
            locationStatus === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 
            locationStatus === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 
            'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
             {locationStatus === 'loading' && <Loader2 className="animate-spin" size={20} />}
             {locationStatus === 'success' && <CheckCircle size={20} />}
             {locationStatus === 'error' && <AlertCircle size={20} />}
             
             <div className="text-sm font-medium">
                {locationStatus === 'loading' && 'در حال دریافت خودکار موقعیت مکانی...'}
                {locationStatus === 'success' && 'موقعیت مکانی شما با موفقیت ثبت شد.'}
                {locationStatus === 'error' && 'خطا در دریافت موقعیت. لطفاً GPS را روشن کنید.'}
             </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">کد ملی بیمار</label>
            <input required type="text" maxLength={10} className={`w-full px-4 py-2 rounded-lg border ${validationErrors.nationalId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none`} value={formData.nationalId} onChange={(e) => setFormData({...formData, nationalId: e.target.value.replace(/\D/g, '')})} />
            {validationErrors.nationalId && <p className="text-red-500 text-xs mt-1">{validationErrors.nationalId}</p>}
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نام کامل بیمار</label>
             <input required type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" value={formData.patientName} onChange={(e) => setFormData({...formData, patientName: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">سن</label>
            <input required type="number" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">سطح هوشیاری (GCS)</label>
            <input required type="number" max={15} min={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" value={formData.gcs} onChange={(e) => setFormData({...formData, gcs: e.target.value})} />
          </div>
        </div>

        {/* Hospital & Ward */}
        <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">بیمارستان</label>
           <Combobox 
             options={state.hospitals.map(h => ({ value: h.id, label: h.name }))}
             value={formData.hospitalId}
             onChange={(val) => setFormData({...formData, hospitalId: Number(val), ward: ''})} 
           />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">بخش</label>
           <select 
             required
             className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
             value={formData.ward}
             onChange={(e) => setFormData({...formData, ward: e.target.value})}
             disabled={availableWards.length === 0}
           >
             <option value="">انتخاب کنید...</option>
             {availableWards.map(w => (
               <option key={w} value={w}>{w}</option>
             ))}
           </select>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={isLoading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary-500/30 flex justify-center items-center gap-2">
            {isLoading ? <Loader2 className="animate-spin" /> : <><Plus className="w-5 h-5" /> ثبت کیس جدید</>}
          </button>
        </div>

      </form>
    </div>
  );
};

export default NewCase;
