
export enum CaseStatus {
  MISSING = 'MISSING',
  FOUND = 'FOUND'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum AuthView {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  ADMIN = 'ADMIN',
  VERIFY_EMAIL = 'VERIFY_EMAIL'
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SUBMIT_REPORT = 'SUBMIT_REPORT',
  MAP_VIEW = 'MAP_VIEW',
  MY_PROFILE = 'MY_PROFILE',
  ADMIN_CONSOLE = 'ADMIN_CONSOLE',
  CASE_DETAILS = 'CASE_DETAILS'
}

export interface Sighting {
  id: string;
  details: string;
  timestamp: string;
}

export interface MissingPerson {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  location: string;
  date: string;
  status: CaseStatus;
  description: string;
  photoUrl?: string;
  lat: number;
  lng: number;
  tags?: string[];
  reportedAt: string;
  verified: boolean;
  phone?: string;
  sightings?: Sighting[];
}

export interface User {
  name: string;
  email: string;
  type: 'PUBLIC' | 'ADMIN';
  photoUrl?: string;
}
