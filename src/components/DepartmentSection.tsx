import React from 'react';
import {
  Wrench,
  Cog,
  Flame,
  Zap,
  Cpu,
  HardHat,
  Compass,
  Calculator,
  TrendingUp,
  Truck,
  Laptop,
  Code,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';
import { Department } from '../types';

interface DepartmentSectionProps {
  departments: Department[];
  onSelectDepartment: (deptId: string) => void;
  projectCountsByDept: Record<string, number>;
}

export const getDepartmentIcon = (iconName: string) => {
  const iconProps = { className: 'w-5 h-5 text-[#1d1d1f]' };
  switch (iconName) {
    case 'Wrench':
      return <Wrench {...iconProps} />;
    case 'Cog':
      return <Cog {...iconProps} />;
    case 'Flame':
      return <Flame {...iconProps} />;
    case 'Zap':
      return <Zap {...iconProps} />;
    case 'Cpu':
      return <Cpu {...iconProps} />;
    case 'HardHat':
      return <HardHat {...iconProps} />;
    case 'Compass':
      return <Compass {...iconProps} />;
    case 'Calculator':
      return <Calculator {...iconProps} />;
    case 'TrendingUp':
      return <TrendingUp {...iconProps} />;
    case 'Truck':
      return <Truck {...iconProps} />;
    case 'Laptop':
      return <Laptop {...iconProps} />;
    case 'Code':
      return <Code {...iconProps} />;
    default:
      return <GraduationCap {...iconProps} />;
  }
};

export const DepartmentSection: React.FC<DepartmentSectionProps> = ({
  departments,
  onSelectDepartment,
  projectCountsByDept,
}) => {
  return (
    <section id="departments" className="py-20 sm:py-28 bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#0071e3] uppercase mb-2">
            12 สาขาวิชาชีพ
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
            หลักสูตรและสาขาวิชา วิทยาลัยแม่สอด
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6e6e73] leading-relaxed">
            บ่มเพาะทักษะวิชาชีพชั้นสูง รองรับเขตเศรษฐกิจพิเศษแม่สอด ทั้งระดับ ปวช. และ ปวส.
          </p>
        </div>

        {/* Apple Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {departments.map((dept) => {
            const count = projectCountsByDept[dept.id] || 0;
            return (
              <div
                key={dept.id}
                onClick={() => onSelectDepartment(dept.id)}
                className="group cursor-pointer bg-white rounded-2xl p-6 border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between"
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

                  <p className="mt-2 text-xs text-[#6e6e73] line-clamp-2 leading-relaxed font-normal">
                    {dept.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs font-medium text-[#0071e3]">
                  <span>ดูผลงานในสาขา</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
