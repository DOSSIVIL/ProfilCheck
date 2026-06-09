export interface Company {
  id: number;
  name: string;
  code: string;
  createdAt: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  company: Company;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  company: string;
  password: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  password?: string;
}

export interface EmployeeProfile {
  id: number;
  fullName: string;
  email: string | null;
  jobTitle: string;
  experienceYears: number;
  declaredSkills: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileRequest {
  fullName: string;
  email?: string;
  jobTitle: string;
  experienceYears: number;
  declaredSkills?: string;
  bio?: string;
}

export interface TestQuestion {
  id?: number;
  questionText: string;
  expectedAnswer?: string;
  questionOrder?: number;
}

export interface SkillTest {
  id: number;
  profileId: number;
  profileName: string;
  title: string;
  description: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  questions: TestQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface TestGenerateRequest {
  profileId: number;
  title: string;
  description?: string;
  questions?: TestQuestion[];
}

export interface TestSubmitRequest {
  testId: number;
  answers: { questionId: number; answer: string }[];
}

export interface TestResult {
  id: number;
  testId: number;
  testTitle: string;
  profileId: number;
  profileName: string;
  score: number;
  complianceScore: number;
  answers: string;
  aiFeedback: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  completedAt: string | null;
  createdAt: string;
}

export interface DashboardStats {
  totalProfiles: number;
  activeTests: number;
  completedResults: number;
  averageComplianceScore: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  details?: string[];
}
