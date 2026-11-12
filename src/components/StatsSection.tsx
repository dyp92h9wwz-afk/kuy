import React from 'react';

interface StatsSectionProps {
  totalProjects: number;
  totalDepartments: number;
  totalYears: number;
  awardProjectsCount: number;
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  totalProjects,
  totalDepartments,
  totalYears,
  awardProjectsCount,
}) => {
  const stats = [
    {
      value: totalProjects,
      label: 'โครงงานในคลังข้อมูล',
      desc: 'นวัตกรรมและงานวิจัยที่เผยแพร่',
    },
    {
      value: totalDepartments || 12,
      label: 'สาขาวิชาชีพ',
      desc: 'ช่างอุตสาหกรรมและบริหารธุรกิจ',
    },
    {
      value: awardProjectsCount,
      label: 'ผลงานได้รับรางวัล',
      desc: 'ระดับจังหวัด ภาค และระดับชาติ',
    },
    {
      value: totalYears || 4,
      label: 'ปีการศึกษา',
      desc: 'ฐานข้อมูลดิจิทัลเพื่อการสืบค้น',
    },
  ];

  return (
    <section className="bg-white border-y border-black/[0.06] py-14 sm:py-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center sm:text-left">
          {stats.map((st, i) => (
            <div key={i} className="flex flex-col space-y-1">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1d1d1f] tabular-nums">
                {st.value}
              </div>
              <div className="text-sm font-semibold text-[#1d1d1f] pt-1">
                {st.label}
              </div>
              <div className="text-xs text-[#86868b] leading-relaxed">
                {st.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
