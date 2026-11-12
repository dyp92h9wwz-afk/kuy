import React, { useState, useMemo } from 'react';
import { Search, X, RotateCcw, Filter, ChevronDown } from 'lucide-react';
import { Project, Department, AcademicYear, Category } from '../types';
import { ProjectCard } from './ProjectCard';

interface ProjectGalleryProps {
  projects: Project[];
  departments: Department[];
  academicYears: AcademicYear[];
  categories: Category[];
  initialSearch?: string;
  initialDeptId?: string;
  onSelectProject: (p: Project) => void;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  projects,
  departments,
  academicYears,
  categories,
  initialSearch = '',
  initialDeptId = '',
  onSelectProject,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedDept, setSelectedDept] = useState(initialDeptId);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyAwards, setOnlyAwards] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'az' | 'popular' | 'featured'>('latest');

  // Sync initial props
  React.useEffect(() => {
    if (initialSearch !== undefined) setSearchTerm(initialSearch);
  }, [initialSearch]);

  React.useEffect(() => {
    if (initialDeptId !== undefined) setSelectedDept(initialDeptId);
  }, [initialDeptId]);

  // Filter & Sort Logic
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(term);
          const matchId = p.projectId.toLowerCase().includes(term);
          const matchDept = p.departmentName.toLowerCase().includes(term);
          const matchAbstract = p.abstract?.toLowerCase().includes(term);
          const matchAdvisor = p.advisorName?.toLowerCase().includes(term);
          const matchMembers = p.members?.some((m) => m.toLowerCase().includes(term));
          const matchTags = p.tags?.some((t) => t.toLowerCase().includes(term));
          const matchTech = p.technologies?.toLowerCase().includes(term);

          if (!(matchTitle || matchId || matchDept || matchAbstract || matchAdvisor || matchMembers || matchTags || matchTech)) {
            return false;
          }
        }

        if (selectedDept && selectedDept !== 'all' && p.departmentId !== selectedDept) {
          return false;
        }

        if (selectedLevel !== 'all' && p.educationLevel !== selectedLevel) {
          return false;
        }

        if (selectedSystem !== 'all' && p.studySystem !== selectedSystem) {
          return false;
        }

        if (selectedYear !== 'all' && p.academicYear !== selectedYear) {
          return false;
        }

        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        if (onlyAwards && !p.award) {
          return false;
        }

        if (onlyFeatured && !p.featured) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'latest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === 'popular') return (b.viewsCount || 0) - (a.viewsCount || 0);
        if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        if (sortBy === 'az') return a.title.localeCompare(b.title, 'th');
        return 0;
      });
  }, [
    projects,
    searchTerm,
    selectedDept,
    selectedLevel,
    selectedSystem,
    selectedYear,
    selectedCategory,
    onlyAwards,
    onlyFeatured,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDept('');
    setSelectedLevel('all');
    setSelectedSystem('all');
    setSelectedYear('all');
    setSelectedCategory('all');
    setOnlyAwards(false);
    setOnlyFeatured(false);
    setSortBy('latest');
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    Boolean(selectedDept) ||
    selectedLevel !== 'all' ||
    selectedSystem !== 'all' ||
    selectedYear !== 'all' ||
    selectedCategory !== 'all' ||
    onlyAwards ||
    onlyFeatured;

  return (
    <section id="projects-gallery" className="py-14 sm:py-20 bg-[#f5f5f7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header & Result Summary */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#0071e3] uppercase mb-1">
              คลังโครงงานทั้งหมด
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
              สืบค้นผลงานนวัตกรรม
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#86868b] mt-1.5">
              <span>{filteredProjects.length} โครงงาน</span>
              <span aria-hidden="true">·</span>
              <span>วิทยาลัยแม่สอด</span>
            </div>
          </div>

          {/* Minimalist Apple Segmented Sort Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#86868b] hidden sm:inline">จัดเรียง:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-black/[0.08] text-xs font-medium text-[#1d1d1f] rounded-xl px-3 py-2 shadow-xs focus:outline-none cursor-pointer"
            >
              <option value="latest">ล่าสุด</option>
              <option value="popular">ยอดเข้าชมสูงสุด</option>
              <option value="featured">โครงงานแนะนำ</option>
              <option value="az">เรียงชื่อ ก-ฮ</option>
              <option value="oldest">เก่าที่สุด</option>
            </select>
          </div>
        </div>

        {/* Minimal Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4 sm:p-5 space-y-4">
          {/* Search Field */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาโครงงาน, คำสำคัญ, ผู้จัดทำ หรือเทคโนโลยี..."
              className="w-full pl-10 pr-9 py-2.5 bg-[#f5f5f7] border border-transparent rounded-xl text-xs sm:text-sm text-[#1d1d1f] placeholder-[#86868b] focus:bg-white focus:border-[#0071e3] focus:outline-none transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-[#f5f5f7] border border-transparent rounded-xl text-xs text-[#515154] hover:text-[#1d1d1f] py-2 px-2.5 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">ทุกสาขาวิชา</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name.replace('แผนกวิชา', '')}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-[#f5f5f7] border border-transparent rounded-xl text-xs text-[#515154] hover:text-[#1d1d1f] py-2 px-2.5 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">ทุกระดับการศึกษา</option>
              <option value="ปวช.">ปวช.</option>
              <option value="ปวส.">ปวส.</option>
            </select>

            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value)}
              className="bg-[#f5f5f7] border border-transparent rounded-xl text-xs text-[#515154] hover:text-[#1d1d1f] py-2 px-2.5 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">ทุกระบบการเรียน</option>
              <option value="ปกติ">ปกติ</option>
              <option value="ทวิภาคี">ทวิภาคี</option>
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-[#f5f5f7] border border-transparent rounded-xl text-xs text-[#515154] hover:text-[#1d1d1f] py-2 px-2.5 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">ทุกปีการศึกษา</option>
              {academicYears.map((y) => (
                <option key={y.id} value={y.year}>
                  ปี {y.year}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Segment Buttons & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-black/[0.04] text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOnlyAwards(!onlyAwards)}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                  onlyAwards
                    ? 'bg-[#1d1d1f] text-white'
                    : 'bg-[#f5f5f7] hover:bg-black/[0.06] text-[#515154]'
                }`}
              >
                ผลงานรางวัล
              </button>

              <button
                type="button"
                onClick={() => setOnlyFeatured(!onlyFeatured)}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                  onlyFeatured
                    ? 'bg-[#1d1d1f] text-white'
                    : 'bg-[#f5f5f7] hover:bg-black/[0.06] text-[#515154]'
                }`}
              >
                โครงงานแนะนำ
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[#0071e3] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ล้างตัวกรอง</span>
              </button>
            )}
          </div>
        </div>

        {/* 3-Column Responsive Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <ProjectCard key={p.id} project={p} onSelect={onSelectProject} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-black/[0.06] p-12 text-center max-w-md mx-auto shadow-xs">
            <h3 className="text-base font-bold text-[#1d1d1f] mb-1">
              ไม่พบผลงานที่ค้นหา
            </h3>
            <p className="text-xs text-[#86868b] mb-5">
              ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองเพื่อดูโครงงานทั้งหมด
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium cursor-pointer transition-colors"
            >
              แสดงโครงงานทั้งหมด
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
