import React, { useState } from 'react';
import { Search, ChevronRight, ArrowRight } from 'lucide-react';
import { Department } from '../types';

interface HeroProps {
  onSearch: (keyword: string, deptId?: string) => void;
  onExploreAll: () => void;
  departments: Department[];
  totalProjects: number;
  totalDepartments: number;
}

export const Hero: React.FC<HeroProps> = ({
  onSearch,
  onExploreAll,
  departments,
  totalProjects,
  totalDepartments,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, selectedDept || undefined);
  };

  return (
    <section className="relative overflow-hidden bg-[#f5f5f7] pt-14 pb-20 sm:pt-20 sm:pb-28">
      {/* Subtle Apple gradient light pool */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-white via-white/80 to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Apple Kicker (Clean unboxed text, no pill) */}
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#0071e3] uppercase mb-3">
          วิทยาลัยแม่สอด · อาชีวศึกษาเพื่ออนาคต
        </p>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1d1d1f] leading-[1.12] text-balance">
          คลังโครงงานและนวัตกรรม
          <br />
          <span className="text-[#86868b] font-normal">ที่สร้างสรรค์ขึ้นเพื่อโลกจริง.</span>
        </h1>

        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-[#6e6e73] max-w-2xl mx-auto leading-relaxed text-balance">
          รวบรวมผลงานวิจัย สิ่งประดิษฐ์คนรุ่นใหม่ และนวัตกรรมเทคโนโลยีของนักศึกษา ระดับ ปวช. และ ปวส. ทั้ง 12 แผนกวิชาชีพ
        </p>

        {/* Minimalist Spotlight Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 sm:mt-10 max-w-2xl mx-auto bg-white rounded-2xl border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all p-2 flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="flex items-center gap-3 px-3 py-2.5 w-full sm:flex-1 text-[#1d1d1f]">
            <Search className="w-4 h-4 text-[#86868b] shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาโครงงาน, ชื่อนักศึกษา, เทคโนโลยี, IoT หรือคีย์เวิร์ด..."
              className="w-full bg-transparent text-[#1d1d1f] placeholder-[#86868b] text-sm focus:outline-none"
            />
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2 pr-1">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-[#f5f5f7] text-[#515154] hover:text-[#1d1d1f] border border-black/[0.04] rounded-xl text-xs py-2 px-3 focus:outline-none w-full sm:w-36 truncate cursor-pointer transition-colors"
            >
              <option value="">ทุกสาขาวิชา</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name.replace('แผนกวิชา', '')}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#0062c4] text-white font-medium text-xs rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
            >
              ค้นหา
            </button>
          </div>
        </form>

        {/* Quick Links & Metadata (Quiet typography, no pill badges) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#86868b]">
          <button
            onClick={onExploreAll}
            className="text-[#0071e3] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            <span>สำรวจโครงงานทั้งหมด ({totalProjects})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <span aria-hidden="true">·</span>
          <span>12 สาขาวิชาชีพ</span>
          <span aria-hidden="true">·</span>
          <span>ระบบปกติและทวิภาคี</span>
        </div>
      </div>
    </section>
  );
};
