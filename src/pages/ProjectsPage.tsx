import React from 'react';
import { Project, Department, AcademicYear, Category } from '../types';
import { ProjectGallery } from '../components/ProjectGallery';
import { useNavigation } from '../context/NavigationContext';

interface ProjectsPageProps {
  projects: Project[];
  departments: Department[];
  academicYears: AcademicYear[];
  categories: Category[];
  initialSearch?: string;
  initialDeptId?: string;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  departments,
  academicYears,
  categories,
  initialSearch = '',
  initialDeptId = '',
}) => {
  const { navigateToProject } = useNavigation();

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <ProjectGallery
        projects={projects.filter((p) => p.status === 'published')}
        departments={departments}
        academicYears={academicYears}
        categories={categories}
        initialSearch={initialSearch}
        initialDeptId={initialDeptId}
        onSelectProject={(p) => navigateToProject(p.id)}
      />
    </div>
  );
};
