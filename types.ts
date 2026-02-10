
export type UserRole = 'student' | 'teacher' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  level: number;
  vipPlan?: 'basic' | 'pro' | 'premium';
}

export type UpdateUserFn = (updates: Partial<User>) => void;

export interface Course {
  id: string;
  title: string;
  progress: number;
  category: string;
  imageUrl: string;
  videoUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: number; // multiplier, e.g., 1, 1.2, 1.4
  dyslexicFont: boolean;
  signLanguageAvatar: boolean;
  reduceMotion: boolean; // New: Stops animations
  calmPalette: boolean; // New: Pastel colors, less saturation
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredXp: number;
  unlocked: boolean;
}

export interface UniversityMentor {
  id: string;
  name: string;
  university: string;
  course: string;
  subjects: string[];
  avatar: string;
  rating: number;
  availableSlots: string[];
}
