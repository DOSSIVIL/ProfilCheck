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

export type TestDifficulty = 'FACILE' | 'MOYEN' | 'DIFFICILE' | 'MIXTE';

export interface TestQuestion {
  id?: number;
  questionText: string;
  expectedAnswer?: string;
  questionOrder?: number;
  weightCategory?: string;
  weight?: number;
  options?: string[];
  correctOptionIndex?: number;
}

export interface CvAnalysisResponse {
  profileId: number;
  fullName: string;
  jobTitle: string;
  experienceYears: number;
  declaredSkills: string | null;
  bio: string | null;
  cvFilePath: string;
  cvAnalyzedAt: string;
  coreSkills?: string[];
  complementarySkills?: string[];
  technicalSoftSkills?: string[];
  summary?: string;
}

export interface EvaluationStartRequest {
  profileId: number;
  title?: string;
  description?: string;
  questionCount: number;
  difficulty: TestDifficulty;
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
  answers: { questionId: number; answer?: string; selectedOptionIndex?: number }[];
}

export interface QuestionScoreDetail {
  questionId: number;
  questionText: string;
  weightCategory: string;
  weight: number;
  score: number;
  userAnswer: string;
  feedback: string;
}

export interface TestResult {
  id: number;
  testId: number;
  testTitle: string;
  profileId: number;
  profileName: string;
  score: number;
  complianceScore: number;
  icgScore?: number;
  exhaustivityCoefficient?: number;
  conformityCategory?: string;
  conformityLabel?: string;
  rhDecision?: string;
  rhDecisionLabel?: string;
  answers: string;
  aiFeedback: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  completedAt: string | null;
  createdAt: string;
}

export interface EvaluationResult {
  id: number;
  testId: number;
  testTitle: string;
  profileId: number;
  profileName: string;
  icgScore: number;
  exhaustivityCoefficient?: number;
  conformityCategory?: string;
  conformityLabel?: string;
  rhDecision?: string;
  rhDecisionLabel?: string;
  aiFeedback: string;
  status: string;
  questionScores: QuestionScoreDetail[];
  completedAt: string | null;
  createdAt: string;
  score?: number;
  complianceScore?: number;
}

export interface CategoryGap {
  category: string;
  label: string;
  averageScore: number;
  weight: number;
  questionCount: number;
  status: 'STRONG' | 'ADEQUATE' | 'WEAK' | 'CRITICAL';
  statusLabel: string;
}

export interface InterviewQuestion {
  topic: string;
  question: string;
  rationale: string;
  priority: 'HAUTE' | 'MOYENNE' | 'BASSE';
}

export interface SkillsGapAnalysis {
  resultId: number;
  profileName: string;
  jobTitle: string;
  icgScore: number;
  categories: CategoryGap[];
  strengths: string[];
  weaknesses: string[];
  interviewGuide: InterviewQuestion[];
  hiringRecommendation: string;
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
