import React from 'react';
import { Hero } from '../components/Hero';
import { StatsSection } from '../components/StatsSection';
import { DepartmentSection } from '../components/DepartmentSection';
import { ProjectCard } from '../components/ProjectCard';
import { Project, Department, AcademicYear } from '../types';
import { useNavigation } from '../context/NavigationContext';
import { ChevronRight } from 'lucide-react';

interface HomePageProps {
  projects: Project[];
  departments: Department[];
  academicYears: AcademicYear[];
  projectCountsByDept: Record<string, number>;
}

export const HomePage: React.FC<HomePageProps> = ({
  projects,
  departments,
  academicYears,
  projectCountsByDept,
}) => {
  const { navigateToProjects, navigateToDepartment, navigateToAwards, navigateToProject } =
    useNavigation();

  const publishedProjects = projects.filter((p) => p.status === 'published');
  const featuredProjects = publishedProjects.filter((p) => p.featured).slice(0, 3);
  const awardProjects = publishedProjects.filter((p) => Boolean(p.award)).slice(0, 3);
  const latestProjects = publishedProjects.slice(0, 6);

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <Hero
        onSearch={(keyword, deptId) => navigateToProjects(keyword, deptId)}
        onExploreAll={() => navigateToProjects()}
        departments={departments}
        totalProjects={publishedProjects.length}
        totalDepartments={departments.length}
      />

      {/* Statistics Section (Keynote Metrics) */}
      <StatsSection
        totalProjects={publishedProjects.length}
        totalDepartments={departments.length}
        totalYears={academicYears.length}
        awardProjectsCount={publishedProjects.filter((p) => Boolean(p.award)).length}
      />

      {/* 12 Departments Bento Grid Preview */}
      <DepartmentSection
        departments={departments}
        onSelectDepartment={(deptId) => navigateToDepartment(deptId)}
        projectCountsByDept={projectCountsByDept}
      />

      {/* Featured Projects Preview */}
      {featuredProjects.length > 0 && (
        <section className="py-20 sm:py-28 bg-white border-b border-black/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#0071e3] uppercase mb-2">
                  โครงงานแนะนำ
                </p>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
                  ผลงานนวัตกรรมโดดเด่น
                </h2>
                <p className="text-sm text-[#6e6e73] mt-2">
                  คัดสรรผลงานที่มีความคิดสร้างสรรค์และสร้างผลกระทบต่อชุมชนและเศรษฐกิจ
                </p>
              </div>

              <button
                onClick={() => navigateToProjects()}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0071e3] hover:underline cursor-pointer"
              >
                <span>ดูทั้งหมด</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((p) => (
                <ProjectCard key={p.id} project={p} onSelect={(proj) => navigateToProject(proj.id)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Award-Winning Projects Showcase */}
      {awardProjects.length > 0 && (
        <section className="py-20 sm:py-28 bg-[#1d1d1f] text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#d4a373] uppercase mb-2">
                  ความภาคภูมิใจ
                </p>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                  ผลงานที่ได้รับรางวัลเชิดชูเกียรติ
                </h2>
                <p className="text-sm text-[#a1a1a6] mt-2">
                  รางวัลการประกวดสิ่งประดิษฐ์คนรุ่นใหม่และนวัตกรรมอาชีวศึกษา ระดับภาคและชาติ
                </p>
              </div>

              <button
                onClick={navigateToAwards}
                className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-[#1d1d1f] text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
              >
                เปิดหน้าผลงานรางวัลทั้งหมด
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {awardProjects.map((p) => (
                <ProjectCard key={p.id} project={p} onSelect={(proj) => navigateToProject(proj.id)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Projects Grid */}
      <section className="py-20 sm:py-28 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#0071e3] uppercase mb-2">
                อัปเดตล่าสุด
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
                โครงงานใหม่ล่าสุด
              </h2>
              <p className="text-sm text-[#6e6e73] mt-2">
                ผลงานที่เผยแพร่ล่าสุดจากนักศึกษาระดับ ปวช. และ ปวส.
              </p>
            </div>

            <button
              onClick={() => navigateToProjects()}
              className="px-4 py-2 rounded-full bg-[#1d1d1f] hover:bg-black text-white font-medium text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>คลังโครงงานทั้งหมด ({publishedProjects.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestProjects.map((p) => (
              <ProjectCard key={p.id} project={p} onSelect={(proj) => navigateToProject(proj.id)} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
