
export enum UserRole {
  ADMIN = 'admin',
  INSPECTOR = 'inspector',
  STAFF = 'staff'
}

export enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  UNREGISTERED = 'unregistered',
  NOT_WHITELISTED = 'not_whitelisted'
}

export interface User {
  id: string;
  mobile: string;
  firstName?: string;
  lastName?: string;
  nationalId?: string;
  role: UserRole;
  status: UserStatus;
  workplaceId?: number;
  workplacePhone?: string;
  education?: string;
  position?: string;
  shift?: string;
  avatar?: string;
  registrationDate?: string;
}

export enum CaseStatus {
  NEW = 'New',
  PROBABLE = 'Probable', // BrainDead Probable
  CONFIRMED = 'Confirmed', // BrainDead Confirmed
  IMPROVING = 'Improving',
  CONSENT_GIVEN = 'Consent Given',
  EXPIRED = 'Expired',
  OTHER = 'Other'
}

export enum VisitType {
  IN_PERSON = 'in_person',
  PHONE = 'phone'
}

export interface CaseLog {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  action: string;
  visitType: VisitType;
  location?: { lat: number; lng: number };
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  url: string;
  uploadedAt: string;
  category: 'CT' | 'Angio' | 'Lab' | 'Other';
}

export interface Case {
  id: string;
  patientName: string;
  nationalId: string;
  age: number;
  admissionDate: string;
  status: CaseStatus;
  hospitalId: number;
  hospitalName: string;
  ward: string;
  gcs?: number;
  sedation?: boolean;
  notes?: string;
  logs: CaseLog[];
  attachments: Attachment[];
  location?: { lat: number; lng: number };
}

export interface Hospital {
  id: number;
  name: string;
  type: 'university' | 'general' | 'private' | 'charity';
  province: string;
  city: string;
  address?: string;
  phones?: string[];
  location?: { lat: number; lng: number };
  personnel?: {
    head?: string;
    metron?: string;
    supervisor?: string;
  };
  wards: string[];
}
