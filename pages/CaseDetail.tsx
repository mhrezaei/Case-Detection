
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CaseStatus, VisitType, Attachment, CaseLog } from '../types';
import { STATUS_COLORS, STATUS_LABELS } from '../constants';
import { ArrowRight, Edit2, Save, X, MapPin, FileText, Activity, Clock, Paperclip, Upload, AlertCircle, Footprints } from 'lucide-react';
import LeafletMap from '../components/LeafletMap';
import Combobox from '../components/Combobox';
import { toPersianDigits } from '../utils/formatting';

const CaseDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const caseData = state.cases.find(c => c.id === id);
  const [activeTab, setActiveTab] = useState<'info' | 'clinical' | 'logs' | 'files'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(caseData);
  
  // Map Modal State
  const [mapModalLog, setMapModalLog] = useState<CaseLog | null>(null);

  if (!caseData || !editForm) return <div className="p-8 text-center">پرونده یافت نشد</div>;

  const selectedHospitalInfo = state.hospitals.find(h => h.id === editForm.hospitalId);
  const availableWards = selectedHospitalInfo?.wards || [];
  const isOtherHospital = editForm.hospitalId === -1;

  const handleSave = () => {
    const changes: string[] = [];

    if (editForm.patientName !== caseData.patientName) changes.push(`تغییر نام به ${editForm.patientName}`);
    if (editForm.nationalId !== caseData.nationalId) changes.push(`تغییر کدملی به ${editForm.nationalId}`);
    if (editForm.age !== caseData.age) changes.push(`تغییر سن به ${editForm.age}`);
    if (editForm.gcs !== caseData.gcs) changes.push(`تغییر GCS از ${caseData.gcs} به ${editForm.gcs}`);
    if (editForm.hospitalName !== caseData.hospitalName) changes.push(`تغییر بیمارستان به ${editForm.hospitalName}`);
    if (editForm.ward !== caseData.ward) changes.push(`تغییر بخش به ${editForm.ward}`);
    if (editForm.notes !== caseData.notes) changes.push('ویرایش یادداشت بالینی');
    if (editForm.status !== caseData.status) changes.push(`تغییر وضعیت به ${STATUS_LABELS[editForm.status]}`);

    const actionDescription = changes.length > 0 
      ? `ویرایش: ${changes.join('، ')}` 
      : 'ویرایش پرونده (بدون تغییر)';

    const updatedCase = {
      ...editForm,
      logs: [
        {
          id: `l${Date.now()}`,
          userId: state.user?.id || 'u1',
          userName: `${state.user?.firstName} ${state.user?.lastName}`,
          timestamp: new Date().toLocaleString('fa-IR'),
          action: actionDescription,
          visitType: VisitType.PHONE,
        },
        ...caseData.logs
      ]
    };
    dispatch({ type: 'UPDATE_CASE', payload: updatedCase });
    setIsEditing(false);
  };

  // "Log Visit" - Only logs timestamp and user, no data change
  const handleLogVisit = () => {
     // Get current location (mocked for now or real if available)
     let currentLocation = undefined;
     if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
           currentLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
           dispatchVisitUpdate(currentLocation);
        }, () => {
           dispatchVisitUpdate(undefined); // Fail silently on location
        });
     } else {
        dispatchVisitUpdate(undefined);
     }
  };

  const dispatchVisitUpdate = (location?: {lat: number, lng: number}) => {
     const updatedCase = {
      ...caseData,
      logs: [
        {
          id: `l${Date.now()}`,
          userId: state.user?.id || 'u1',
          userName: `${state.user?.firstName} ${state.user?.lastName}`,
          timestamp: new Date().toLocaleString('fa-IR'),
          action: 'بازدید مجدد (بدون تغییر)',
          visitType: VisitType.IN_PERSON, // Assume visit implies in-person usually
          location: location
        },
        ...caseData.logs
      ]
    };
    dispatch({ type: 'UPDATE_CASE', payload: updatedCase });
    // Optional: Show toast
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newAttachment: Attachment = {
        id: `a${Date.now()}`,
        fileName: file.name,
        fileType: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toLocaleString('fa-IR'),
        category: 'Other'
      };
      
      const updatedCase = {
        ...caseData,
        attachments: [...caseData.attachments, newAttachment],
        logs: [
           {
            id: `l${Date.now()}`,
            userId: state.user?.id || 'u1',
            userName: `${state.user?.firstName} ${state.user?.lastName}`,
            timestamp: new Date().toLocaleString('fa-IR'),
            action: `افزودن فایل: ${file.name}`,
            visitType: VisitType.PHONE,
          },
          ...caseData.logs
        ]
      };
      dispatch({ type: 'UPDATE_CASE', payload: updatedCase });
      setEditForm(updatedCase);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/cases')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
            <ArrowRight size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">{caseData.patientName}</h1>
            <p className="text-sm text-gray-500">کدملی: {toPersianDigits(caseData.nationalId)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {isEditing ? (
             <>
               <button onClick={() => { setIsEditing(false); setEditForm(caseData); }} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm">
                 <X size={16} /> انصراف
               </button>
               <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm shadow-lg shadow-green-500/30">
                 <Save size={16} /> ذخیره تغییرات
               </button>
             </>
          ) : (
             <>
               <button onClick={handleLogVisit} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-gray-700 text-sm transition" title="ثبت بازدید بدون تغییر اطلاعات">
                  <Footprints size={16} /> ثبت ویزیت (بدون تغییر)
               </button>
               <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-50 dark:bg-gray-700 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-gray-600 text-sm transition">
                 <Edit2 size={16} /> ویرایش پرونده
               </button>
             </>
          )}
        </div>
      </div>

      {/* Status Banner */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 ${STATUS_COLORS[editForm.status]}`}>
        <div className="flex items-center gap-3">
          <Activity size={24} />
          <div>
            <p className="font-bold">وضعیت فعلی: {STATUS_LABELS[editForm.status]}</p>
            <p className="text-xs opacity-80">آخرین بروزرسانی: {toPersianDigits(caseData.logs[0]?.timestamp || 'نامشخص')}</p>
          </div>
        </div>
        {isEditing && (
          <select 
            value={editForm.status}
            onChange={(e) => setEditForm({...editForm, status: e.target.value as CaseStatus})}
            className="bg-white/50 dark:bg-black/20 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-white outline-none"
          >
            {Object.values(CaseStatus).map(s => (
              <option key={s} value={s} className="text-black dark:text-white">{STATUS_LABELS[s]}</option>
            ))}
          </select>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b dark:border-gray-700 overflow-x-auto no-scrollbar">
        {[
          { id: 'info', label: 'اطلاعات پایه', icon: FileText },
          { id: 'clinical', label: 'بالینی و بیمارستان', icon: Activity },
          { id: 'files', label: 'ضمیمه‌ها', icon: Paperclip },
          { id: 'logs', label: 'تاریخچه (Logs)', icon: Clock },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[300px]">
        
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-1">
               <label className="text-xs text-gray-500">نام بیمار</label>
               {isEditing ? (
                 <input className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" value={editForm.patientName} onChange={e => setEditForm({...editForm, patientName: e.target.value})} />
               ) : <p className="font-medium dark:text-white">{caseData.patientName}</p>}
             </div>
             <div className="space-y-1">
               <label className="text-xs text-gray-500">کد ملی</label>
               <p className="font-mono font-medium dark:text-white">{toPersianDigits(caseData.nationalId)}</p>
             </div>
             <div className="space-y-1">
               <label className="text-xs text-gray-500">سن</label>
               {isEditing ? (
                 <input type="number" className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" value={editForm.age} onChange={e => setEditForm({...editForm, age: Number(e.target.value)})} />
               ) : <p className="font-medium dark:text-white">{toPersianDigits(caseData.age)} سال</p>}
             </div>
          </div>
        )}

        {/* Clinical Tab */}
        {activeTab === 'clinical' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs text-gray-500">بیمارستان</label>
                {isEditing ? (
                  <div className="space-y-2">
                    <Combobox 
                      options={[
                        ...state.hospitals.map(h => ({ value: h.id, label: h.name })),
                        { value: -1, label: 'سایر مراکز درمانی (تایپ دستی)' }
                      ]}
                      value={editForm.hospitalId}
                      onChange={(val) => {
                        const hId = Number(val);
                        const hospital = state.hospitals.find(h => h.id === hId);
                        setEditForm({
                          ...editForm, 
                          hospitalId: hId, 
                          hospitalName: hospital ? hospital.name : '', 
                          ward: '' 
                        });
                      }}
                    />
                    {isOtherHospital && (
                      <input 
                        type="text" 
                        placeholder="نام مرکز درمانی..."
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 text-sm" 
                        value={editForm.hospitalName} 
                        onChange={e => setEditForm({...editForm, hospitalName: e.target.value})} 
                      />
                    )}
                  </div>
                ) : (
                  <p className="font-medium dark:text-white">{caseData.hospitalName}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-500">بخش</label>
                {isEditing ? (
                   availableWards.length > 0 ? (
                     <select 
                       className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                       value={editForm.ward}
                       onChange={e => setEditForm({...editForm, ward: e.target.value})}
                     >
                        <option value="">انتخاب کنید...</option>
                        {availableWards.map(w => <option key={w} value={w}>{w}</option>)}
                     </select>
                   ) : (
                     <input 
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" 
                        value={editForm.ward} 
                        placeholder="نام بخش"
                        onChange={e => setEditForm({...editForm, ward: e.target.value})} 
                     />
                   )
                ) : <p className="font-medium dark:text-white">{caseData.ward}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-500">GCS</label>
                {isEditing ? (
                   <input type="number" max={15} min={3} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" value={editForm.gcs} onChange={e => setEditForm({...editForm, gcs: Number(e.target.value)})} />
                ) : <p className="font-medium dark:text-white">{toPersianDigits(caseData.gcs)}</p>}
              </div>
            </div>
            
            <div>
               <label className="text-xs text-gray-500 block mb-2">یادداشت‌های بالینی</label>
               {isEditing ? (
                 <textarea className="w-full p-3 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 h-32" value={editForm.notes || ''} onChange={e => setEditForm({...editForm, notes: e.target.value})} />
               ) : (
                 <p className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg leading-relaxed dark:text-gray-200">{caseData.notes || 'بدون یادداشت'}</p>
               )}
            </div>
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div>
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-sm dark:text-white">مدارک ضمیمه شده</h3>
               <button onClick={() => fileInputRef.current?.click()} className="text-xs bg-primary-50 text-primary-600 px-3 py-1.5 rounded-lg hover:bg-primary-100 flex items-center gap-1">
                  <Upload size={14} /> افزودن فایل
               </button>
               <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {caseData.attachments.map(file => (
                  <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                     <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded">
                        <FileText size={20} className="text-gray-500 dark:text-gray-300" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate dark:text-white">{file.fileName}</p>
                        <p className="text-xs text-gray-400">{toPersianDigits(file.uploadedAt)}</p>
                     </div>
                     <a href={file.url} target="_blank" rel="noreferrer" className="text-xs text-primary-500 hover:underline">دانلود</a>
                  </div>
               ))}
               {caseData.attachments.length === 0 && (
                 <div className="col-span-2 flex flex-col items-center justify-center py-10 text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-600">
                   <AlertCircle size={32} className="mb-2 opacity-50" />
                   <p className="text-sm">هیچ فایلی ضمیمه نشده است.</p>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="relative border-r-2 border-gray-200 dark:border-gray-700 mr-3 space-y-8">
            {caseData.logs.map((log, idx) => (
              <div key={log.id} className="relative pr-6 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="absolute -right-[9px] top-0 w-4 h-4 rounded-full bg-primary-500 ring-4 ring-white dark:ring-gray-800"></div>
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">{log.action}</p>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                     <span>{toPersianDigits(log.timestamp)}</span>
                     <span>•</span>
                     <span>{log.userName}</span>
                     {log.visitType === VisitType.IN_PERSON && (
                       <div className="flex items-center gap-2">
                         <span className="flex items-center text-green-600 font-medium"><MapPin size={10} className="mr-0.5" /> حضوری</span>
                         {log.location && (
                           <button onClick={() => setMapModalLog(log)} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 hover:bg-blue-100 transition flex items-center gap-1">
                              <MapPin size={10} /> مشاهده موقعیت
                           </button>
                         )}
                       </div>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map Modal */}
      {mapModalLog && mapModalLog.location && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
             <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <div>
                   <h3 className="font-bold dark:text-white">موقعیت ثبت شده</h3>
                   <p className="text-xs text-gray-500">{toPersianDigits(mapModalLog.timestamp)} - {mapModalLog.userName}</p>
                </div>
                <button onClick={() => setMapModalLog(null)}><X size={24} className="text-gray-500" /></button>
             </div>
             <div className="h-72 w-full">
                <LeafletMap lat={mapModalLog.location.lat} lng={mapModalLog.location.lng} readOnly />
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseDetail;
