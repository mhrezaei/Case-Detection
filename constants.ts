
import { Case, CaseStatus, Hospital, User, UserRole, UserStatus, VisitType } from './types';

export const HOSPITALS: Hospital[] = [
  { 
    id: 1, 
    name: 'بیمارستان نمازی شیراز', 
    type: 'university', 
    province: 'فارس',
    city: 'شیراز',
    address: 'میدان نمازی',
    phones: ['07136474332', '07136474331'],
    location: { lat: 29.6357, lng: 52.5259 },
    personnel: { head: 'دکتر امیری', metron: 'خانم رضایی', supervisor: 'آقای کاظمی' },
    wards: ['ICU General', 'ICU جراحی اعصاب', 'ICU داخلی', 'اورژانس'] 
  },
  { 
    id: 2, 
    name: 'بیمارستان شهید فقیهی', 
    type: 'university', 
    province: 'فارس',
    city: 'شیراز',
    address: 'خیابان زند',
    phones: ['07132351087'],
    location: { lat: 29.6180, lng: 52.5380 },
    personnel: { head: 'دکتر حسینی', metron: 'خانم کمالی' },
    wards: ['ICU Trauma', 'ICU قلب', 'CCU'] 
  },
  { 
    id: 3, 
    name: 'بیمارستان رجایی', 
    type: 'general', 
    province: 'فارس',
    city: 'شیراز',
    address: 'بلوار چمران',
    phones: ['07136240101'],
    location: { lat: 29.6500, lng: 52.5000 },
    wards: ['ICU 1', 'ICU 2'] 
  },
  { 
    id: 4, 
    name: 'بیمارستان امیرالمومنین', 
    type: 'general', 
    province: 'فارس',
    city: 'صدرا',
    address: 'ورودی شهر صدرا',
    phones: ['07136421111'],
    wards: ['ICU سوختگی', 'بخش مردان'] 
  },
];

export const MOCK_USER: User = {
  id: 'u1',
  mobile: '09123456789',
  firstName: 'دکتر',
  lastName: 'علوی',
  role: UserRole.ADMIN, // Set to admin for demo purposes to see all menus
  status: UserStatus.ACTIVE,
  workplaceId: 1,
  workplacePhone: '07136123456',
  education: 'فوق تخصص ریه',
  position: 'سوپروایزر',
  shift: 'صبح',
  avatar: 'https://picsum.photos/100/100',
  registrationDate: '1402/10/01'
};

export const MOCK_USERS_LIST: User[] = [
  MOCK_USER,
  {
    id: 'u2',
    mobile: '09171112233',
    firstName: 'سارا',
    lastName: 'احمدی',
    role: UserRole.INSPECTOR,
    status: UserStatus.ACTIVE,
    workplaceId: 2,
    registrationDate: '1403/01/15'
  },
  {
    id: 'u3',
    mobile: '09129998877',
    role: UserRole.STAFF,
    status: UserStatus.PENDING,
    registrationDate: '1403/02/20',
    firstName: 'علی',
    lastName: 'رضایی'
  },
  {
    id: 'u4',
    mobile: '09355554433',
    role: UserRole.STAFF,
    status: UserStatus.NOT_WHITELISTED,
    registrationDate: '1403/02/22'
  }
];

export const MOCK_CASES: Case[] = [
  {
    id: 'c1',
    patientName: 'احمد رضایی',
    nationalId: '1234567890',
    age: 45,
    admissionDate: '1403/01/10',
    status: CaseStatus.PROBABLE,
    hospitalId: 1,
    hospitalName: 'بیمارستان نمازی شیراز',
    ward: 'ICU General',
    gcs: 4,
    notes: 'بیمار اینتوبه است.',
    logs: [
      {
        id: 'l1',
        userId: 'u1',
        userName: 'دکتر علوی',
        timestamp: '1403/01/10 14:30',
        action: 'ثبت اولیه',
        visitType: VisitType.IN_PERSON,
        location: { lat: 29.6, lng: 52.5 }
      }
    ],
    attachments: []
  },
  {
    id: 'c2',
    patientName: 'سارا محمدی',
    nationalId: '0987654321',
    age: 28,
    admissionDate: '1403/01/12',
    status: CaseStatus.CONFIRMED,
    hospitalId: 2,
    hospitalName: 'بیمارستان شهید فقیهی',
    ward: 'ICU Trauma',
    gcs: 3,
    logs: [],
    attachments: []
  },
  {
    id: 'c3',
    patientName: 'علی کمالی',
    nationalId: '1122334455',
    age: 60,
    admissionDate: '1403/01/15',
    status: CaseStatus.NEW,
    hospitalId: 1,
    hospitalName: 'بیمارستان نمازی شیراز',
    ward: 'ICU قلب',
    gcs: 5,
    logs: [],
    attachments: []
  }
];

export const STATUS_COLORS: Record<CaseStatus, string> = {
  [CaseStatus.NEW]: 'bg-blue-100 text-blue-800 border-blue-200',
  [CaseStatus.PROBABLE]: 'bg-orange-100 text-orange-800 border-orange-200',
  [CaseStatus.CONFIRMED]: 'bg-red-100 text-red-800 border-red-200',
  [CaseStatus.IMPROVING]: 'bg-green-100 text-green-800 border-green-200',
  [CaseStatus.CONSENT_GIVEN]: 'bg-teal-100 text-teal-800 border-teal-200',
  [CaseStatus.EXPIRED]: 'bg-gray-200 text-gray-800 border-gray-300',
  [CaseStatus.OTHER]: 'bg-slate-100 text-slate-800 border-slate-200',
};

export const STATUS_LABELS: Record<CaseStatus, string> = {
  [CaseStatus.NEW]: 'جدید',
  [CaseStatus.PROBABLE]: 'مشکوک به مرگ مغزی',
  [CaseStatus.CONFIRMED]: 'تایید مرگ مغزی',
  [CaseStatus.IMPROVING]: 'رو به بهبودی',
  [CaseStatus.CONSENT_GIVEN]: 'رضایت اهدا',
  [CaseStatus.EXPIRED]: 'فوت شده',
  [CaseStatus.OTHER]: 'سایر',
};