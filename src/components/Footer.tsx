import React from 'react';
import { useNavigation } from '../context/NavigationContext';

interface FooterProps {
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin }) => {
  const {
    navigateToHome,
    navigateToProjects,
    navigateToDepartment,
    navigateToAwards,
    navigateToAbout,
  } = useNavigation();

  return (
    <footer className="bg-[#f5f5f7] text-[#86868b] text-[11px] border-t border-black/[0.08] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Overview */}
          <div className="space-y-3 md:col-span-2 max-w-sm">
            <div className="text-xs font-bold text-[#1d1d1f] tracking-tight">
              MSCC Project Hub · วิทยาลัยแม่สอด
            </div>
            <p className="text-[#6e6e73] leading-relaxed">
              ระบบศูนย์กลางรวบรวมและเผยแพร่งานวิจัย โครงงาน และนวัตกรรมสิ่งประดิษฐ์คนรุ่นใหม่ ระดับ ปวช. และ ปวส. สังกัดสำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.)
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2.5">
            <div className="font-semibold text-[#1d1d1f]">หน้าหลักของระบบ</div>
            <ul className="space-y-2">
              <li>
                <button onClick={navigateToHome} className="hover:text-[#1d1d1f] transition-colors cursor-pointer">
                  หน้าแรก (Home)
                </button>
              </li>
              <li>
                <button onClick={() => navigateToDepartment(undefined)} className="hover:text-[#1d1d1f] transition-colors cursor-pointer">
                  12 สาขาวิชาชีพ (Departments)
                </button>
              </li>
              <li>
                <button onClick={() => navigateToProjects()} className="hover:text-[#1d1d1f] transition-colors cursor-pointer">
                  คลังโครงงานทั้งหมด (Projects)
                </button>
              </li>
              <li>
                <button onClick={navigateToAwards} className="hover:text-[#1d1d1f] transition-colors cursor-pointer">
                  ผลงานที่ได้รับรางวัล (Awards)
                </button>
              </li>
              <li>
                <button onClick={navigateToAbout} className="hover:text-[#1d1d1f] transition-colors cursor-pointer">
                  เกี่ยวกับวิทยาลัย (About Us)
                </button>
              </li>
            </ul>
          </div>

          {/* Administration & College */}
          <div className="space-y-2.5">
            <div className="font-semibold text-[#1d1d1f]">ติดต่อและดูแลระบบ</div>
            <ul className="space-y-2">
              <li>
                <span>วิทยาลัยแม่สอด อ.แม่สอด จ.ตาก 63110</span>
              </li>
              <li>
                <span>โทร. 055-531-155</span>
              </li>
              <li>
                <button
                  onClick={onOpenAdminLogin}
                  className="text-[#0071e3] hover:underline cursor-pointer font-medium"
                >
                  เข้าสู่ระบบผู้ดูแลระบบ (Admin)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-6 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#86868b]">
          <div>
            Copyright © {new Date().getFullYear()} วิทยาลัยแม่สอด (Mae Sot Technical College). สงวนลิขสิทธิ์ทั้งหมด.
          </div>
          <div className="flex items-center gap-4">
            <span>ฐานข้อมูลคลังโครงงาน</span>
            <span aria-hidden="true">·</span>
            <span>ปวช. และ ปวส. ทวิภาคี</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
