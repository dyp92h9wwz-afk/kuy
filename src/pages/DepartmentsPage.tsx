import React, { useState, useMemo } from 'react';
import { Department, Project, AcademicYear } from '../types';
import { useNavigation } from '../context/NavigationContext';
import { ProjectCard } from '../components/ProjectCard';
import { getDepartmentIcon } from '../components/DepartmentSection';
import { ArrowLeft, Search, ChevronRight, GraduationCap, Layers } from 'lucide-react';

interface DepartmentsPageProps {
  departments: Department[];
  projects: Project[];
  academicYears: AcademicYear[];
  selectedDeptId?: string;
  projectCountsByDept: Record<string, number>;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  departments,
  projects,
  academicYears,
  selectedDeptId,
  projectCountsByDept,
}) => {
  const { navigateToDepartment, navigateToProject, navigateToProjects } = useNavigation();

  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [systemFilter, setSystemFilter] = useState<string>('all');

  const currentDept = useMemo(() => {
    if (!selectedDeptId) return null;
    return departments.find((d) => d.id === selectedDeptId || d.slug === selectedDeptId) || null;
  }, [selectedDeptId, departments]);

  // Projects under this department (or all)
  const deptProjects = useMemo(() => {
    let list = projects.filter((p) => p.status === 'published');
    if (currentDept) {
      list = list.filter((p) => p.departmentId === currentDept.id);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.projectId.toLowerCase().includes(q) ||
          p.abstract?.toLowerCase().includes(q) ||
          p.members?.some((m) => m.toLowerCase().includes(q))
      );
    }
    if (levelFilter !== 'all') {
      list = list.filter((p) => p.educationLevel === levelFilter);
    }
    if (systemFilter !== 'all') {
      list = list.filter((p) => p.studySystem === systemFilter);
    }
    return list;
  }, [projects, currentDept, searchTerm, levelFilter, systemFilter]);

  // View 1: Specific Department Details & its projects
  if (currentDept) {
    return (
      <div className="py-12 sm:py-20 bg-[#f5f5f7] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Breadcrumb / Back button */}
          <button
            onClick={() => navigateToDepartment(undefined)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับไปยังสาขาวิชาทั้งหมด</span>
          </button>

          {/* Department Hero Banner */}
          <div className="bg-white rounded-[28px] border border-black/[0.06] p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#f5f5f7] flex items-center justify-center shrink-0 border border-black/[0.04]">
                {getDepartmentIcon(currentDept.icon)}
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[#0071e3] uppercase tracking-wider">
                  สาขาวิชาลำดับที่ {currentDept.order}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
                  {currentDept.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#6e6e73] max-w-2xl leading-relaxed">
                  {currentDept.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs shrink-0">
              <div className="bg-[#f5f5f7] px-4 py-2.5 rounded-xl border border-black/[0.04] text-center">
                <span className="block text-[#86868b] text-[11px]">โครงงานทั้งหมด</span>
                <span className="text-base font-bold text-[#1d1d1f] tabular-nums">
                  {projectCountsByDept[currentDept.id] || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Filters for this Department's Projects */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-black/[0.06]">
            <div className="relative flex-1 w-full max-w-sm">
              <Search className="w-3.5 h-3.5 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาโครงงานในสาขานี้..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#f5f5f7] border border-transparent rounded-xl text-xs focus:bg-white focus:border-[#0071e3] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="bg-[#f5f5f7] border border-transparent rounded-xl text-xs text-[#515154] py-1.5 px-2.5 focus:outline-none cursor-pointer"
              >
                <option value="all">ทุกระดับ (ปวช./ปวส.)</option>
                <option value="ปวช.">ปวช.</option>
                <option value="ปวส.">ปวส.</option>
              </select>

              <select
                value={systemFilter}
                onChange={(e) => setSystemFilter(e.target.value)}
                className="bg-[#f5f5f7] border border-transparent rounded-xl text-xs text-[#515154] py-1.5 px-2.5 focus:outline-none cursor-pointer"
              >
                <option value="all">ทุกระบบการเรียน</option>
                <option value="ปกติ">ปกติ</option>
                <option value="ทวิภาคี">ทวิภาคี</option>
              </select>
            </div>
          </div>

          {/* Department's Projects Grid */}
          {deptProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deptProjects.map((p) => (
                <ProjectCard key={p.id} project={p} onSelect={(proj) => navigateToProject(proj.id)} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-black/[0.06] p-12 text-center max-w-md mx-auto shadow-xs">
              <h3 className="text-sm font-bold text-[#1d1d1f] mb-1">
                ไม่พบโครงงานในเงื่อนไขนี้
              </h3>
              <p className="text-xs text-[#86868b] mb-4">
                ยังไม่มีการบันทึกโครงงานที่ตรงกับตัวกรองในแผนกนี้
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setLevelFilter('all');
                  setSystemFilter('all');
                }}
                className="px-4 py-2 rounded-full bg-[#1d1d1f] text-white text-xs font-medium cursor-pointer"
              >
                ล้างตัวกรอง
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // View 2: All 12 Departments Overview Page
  return (
    <div className="py-14 sm:py-24 bg-[#f5f5f7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#0071e3] uppercase mb-2">
            หลักสูตรและสาขาวิชาชีพ
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f]">
            12 สาขาวิชา วิทยาลัยแม่สอด
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#6e6e73] leading-relaxed">
            ครอบคลุมทักษะวิชาชีพชั้นสูง รองรับการเติบโตทางเศรษฐกิจชายแดน ทั้งระดับ ปวช. และ ปวส. ระบบปกติและทวิภาคี
          </p>
        </div>

        {/* 12 Departments Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {departments.map((dept) => {
            const count = projectCountsByDept[dept.id] || 0;
            return (
              <div
                key={dept.id}
                onClick={() => navigateToDepartment(dept.id)}
                className="group cursor-pointer bg-white rounded-2xl p-6 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      {getDepartmentIcon(dept.icon)}
                    </div>
                    <span className="text-xs font-medium text-[#86868b] tabular-nums">
                      {count} โครงงาน
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors leading-snug">
                    {dept.name}
                  </h3>

                  <p className="mt-2 text-xs text-[#6e6e73] line-clamp-3 leading-relaxed">
                    {dept.description}
                  </p>
                </div>

                <div className="mt-6 pt-3.5 border-t border-black/[0.04] flex items-center justify-between text-xs font-medium text-[#0071e3]">
                  <span>เข้าสู่หน้าสาขาวิชา</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
