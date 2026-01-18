
import { CaseStatus, MissingPerson, Gender } from './types';

export const INITIAL_REPORTS: MissingPerson[] = [
  {
    id: '1',
    name: 'Kevin Omondi',
    age: 12,
    gender: Gender.MALE,
    location: 'Nairobi, Westlands',
    date: '2023-10-15',
    status: CaseStatus.MISSING,
    description: 'Wearing a red t-shirt and blue shorts. Last seen near Sarit Centre.',
    lat: -1.2642,
    lng: 36.8042,
    tags: ['CHILD', 'WESTLANDS'],
    reportedAt: '1/16/2026',
    verified: true
  },
  {
    id: '2',
    name: 'Sarah Wanjiku',
    age: 24,
    gender: Gender.FEMALE,
    location: 'Mombasa, Old Town',
    date: '2023-10-12',
    status: CaseStatus.MISSING,
    description: 'Height 5\'4", black braids, scar on right arm.',
    lat: -4.0547,
    lng: 39.6738,
    tags: ['ADULT', 'MOMBASA'],
    reportedAt: '1/13/2026',
    verified: true
  },
  {
    id: '3',
    name: 'Samuel Kiprop',
    age: 68,
    gender: Gender.MALE,
    location: 'Eldoret, Town Centre',
    date: '2023-10-10',
    status: CaseStatus.FOUND,
    description: 'Elderly man with dementia. Wearing a grey suit.',
    lat: 0.5143,
    lng: 35.2698,
    tags: ['ELDERLY', 'FOUND'],
    reportedAt: '1/8/2026',
    verified: true
  }
];

export const COLORS = {
  primary: '#2563EB',
  secondary: '#1E293B',
  missing: '#EF4444',
  found: '#10B981',
  admin: '#F59E0B'
};
