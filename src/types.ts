export type EducationLevel = 'ปวช.' | 'ปวส.';
export type StudySystem = 'ปกติ' | 'ทวิภาคี';
export type ProjectStatus = 'published' | 'draft' | 'archived';

export interface ProjectDocument {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'ppt' | 'pptx' | 'doc' | 'docx' | 'zip' | 'other';
  size?: string;
}

export interface Project {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  departmentId: string;
  departmentName: string;
  educationLevel: EducationLevel;
  studySystem: StudySystem;
  academicYear: string; // e.g. "2567", "2568"
  category: string;
  projectType: string;
  abstract: string;
  background?: string;
  objectives?: string;
  scope?: string;
  methodology?: string;
  technologies?: string;
  results?: string;
  benefits?: string;
  recommendations?: string;
  members: string[];
  advisorName: string;
  companyName?: string; // สถานประกอบการ (กรณีทวิภาคี)
  coverImage: string;
  gallery: string[];
  documents: ProjectDocument[];
  videoUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  tags: string[];
  featured: boolean;
  award?: string;
  status: ProjectStatus;
  publishedAt?: string;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  icon: string;
  color: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  projectCount?: number;
}

export interface AcademicYear {
  id: string;
  year: string;
  label: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  order: number;
}

export interface SiteSettings {
  collegeName: string;
  collegeShortName: string;
  campusName: string;
  logo: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  websiteDescription: string;
  adminEmail: string;
}
