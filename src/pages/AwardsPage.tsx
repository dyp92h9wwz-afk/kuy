import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { useNavigation } from '../context/NavigationContext';
import { ProjectCard } from '../components/ProjectCard';
import { Award, ArrowLeft, Sparkles, Trophy } from 'lucide-react';

interface AwardsPageProps {
  projects: Project[];
}

export const AwardsPage: React.FC<AwardsPageProps> = ({ projects }) => {
  const { navigateToProject, navigateToHome } = useNavigation();
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const awardProjects = useMemo(() => {
    let list = projects.filter((p) => p.status === 'published' && Boolean(p.award));
    if (levelFilter !== 'all') {
      list = list.filter((p) => p.educationLevel === levelFilter);
    }
    return list;
  }, [projects, levelFilter]);

  return (
    <div className="py-14 sm:py-24 bg-[#f5f5f7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <button
              onClick={navigateToHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] transition-colors cursor-pointer mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับหน้าแรก</span>
            </button>
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#b45309] uppercase">
              เกียรติประวัติและความภาคภูมิใจ
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f]">
              ผลงานที่ได้รับรางวัล
            </h1>
            <p className="text-sm sm:text-base text-[#6e6e73] leading-relaxed">
              รวมสุดยอดผลงานวิจัย นวัตกรรม และสิ่งประดิษฐ์ของคนรุ่นใหม่ วิทยาลัยแม่สอด ที่คว้ารางวัลชนะเลิศระดับจังหวัด ระดับภาคเหนือ และระดับชาติ
            </p>
          </div>

          {/* Quick Segment Filter */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-white p-1 rounded-xl border border-black/[0.06]">
            <button
              onClick={() => setLevelFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                levelFilter === 'all' ? 'bg-[#1d1d1f] text-white' : 'text-[#515154] hover:text-[#1d1d1f]'
              }`}
            >
              ทั้งหมด ({projects.filter((p) => p.status === 'published' && Boolean(p.award)).length})
            </button>
            <button
              onClick={() => setLevelFilter('ปวช.')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                levelFilter === 'ปวช.' ? 'bg-[#1d1d1f] text-white' : 'text-[#515154] hover:text-[#1d1d1f]'
              }`}
            >
              ปวช.
            </button>
            <button
              onClick={() => setLevelFilter('ปวส.')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                levelFilter === 'ปวส.' ? 'bg-[#1d1d1f] text-white' : 'text-[#515154] hover:text-[#1d1d1f]'
              }`}
            >
              ปวส.
            </button>
          </div>
        </div>

        {/* Awards Gallery Grid */}
        {awardProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awardProjects.map((p) => (
              <ProjectCard key={p.id} project={p} onSelect={(proj) => navigateToProject(proj.id)} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-black/[0.06] p-12 text-center max-w-md mx-auto shadow-xs">
            <h3 className="text-sm font-bold text-[#1d1d1f] mb-1">ไม่พบผลงานรางวัลในตัวกรองนี้</h3>
            <button
              onClick={() => setLevelFilter('all')}
              className="mt-3 px-4 py-2 rounded-full bg-[#1d1d1f] text-white text-xs font-medium cursor-pointer"
            >
              แสดงผลงานรางวัลทั้งหมด
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
