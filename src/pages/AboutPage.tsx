import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { MapPin, Phone, Mail, Award, BookOpen, ShieldCheck, ArrowLeft } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateToHome, navigateToProjects, navigateToDepartment } = useNavigation();

  return (
    <div className="py-14 sm:py-24 bg-[#f5f5f7] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation back */}
        <button
          onClick={navigateToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>กลับหน้าแรก</span>
        </button>

        {/* Title */}
        <div className="space-y-3">
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#0071e3] uppercase">
            เกี่ยวกับเรา
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f]">
            วิทยาลัยแม่สอด
          </h1>
          <p className="text-sm sm:text-base text-[#6e6e73] leading-relaxed">
            สถาบันการอาชีวศึกษาชั้นนำในเขตพัฒนาเศรษฐกิจพิเศษตาก มุ่งมั่นผลิตและพัฒนากำลังคนวิชาชีพที่มีสมรรถนะสูงควบคู่คุณธรรม
          </p>
        </div>

        {/* Story Card */}
        <div className="bg-white rounded-[28px] border border-black/[0.06] p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6 text-sm text-[#515154] leading-relaxed">
          <h2 className="text-xl font-bold text-[#1d1d1f]">
            ระบบคลังโครงงานและนวัตกรรม (MSCC Project Hub)
          </h2>
          <p>
            MSCC Project Hub ได้รับการพัฒนาขึ้นเพื่อเป็นคลังข้อมูลกลางแบบดิจิทัลในการรวบรวม เผยแพร่ และสืบค้นผลงานวิจัย นวัตกรรม และสิ่งประดิษฐ์ของคนรุ่นใหม่ ของนักศึกษาระดับประกาศนียบัตรวิชาชีพ (ปวช.) และประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) ครอบคลุมทั้ง 12 สาขาวิชา ทั้งระบบปกติและระบบทวิภาคีร่วมกับสถานประกอบการ
          </p>
          <p>
            ระบบนี้เป็นเครื่องมือส่งเสริมการเรียนรู้ตลอดชีวิต (Lifelong Learning) ช่วยให้นักเรียน นักศึกษา ครู อาจารย์ และผู้ประกอบการในพื้นที่ สามารถศึกษา ต่อยอดองค์ความรู้ และนำนวัตกรรมไปประยุกต์ใช้เพื่อการพัฒนาชุมชน สังคม และเศรษฐกิจชายแดนไทย-เมียนมาได้อย่างแท้จริง
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-2xs space-y-2">
            <BookOpen className="w-6 h-6 text-[#0071e3]" />
            <h3 className="font-bold text-[#1d1d1f] text-sm">การศึกษาฐานสมรรถนะ</h3>
            <p className="text-xs text-[#6e6e73] leading-relaxed">
              ฝึกปฏิบัติจริงในห้องปฏิบัติการและสถานประกอบการชั้นนำ
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-2xs space-y-2">
            <Award className="w-6 h-6 text-[#b45309]" />
            <h3 className="font-bold text-[#1d1d1f] text-sm">นวัตกรรมและสิ่งประดิษฐ์</h3>
            <p className="text-xs text-[#6e6e73] leading-relaxed">
              ส่งเสริมการคิดค้นสิ่งประดิษฐ์คนรุ่นใหม่ระดับภาคและระดับชาติ
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-2xs space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#34c759]" />
            <h3 className="font-bold text-[#1d1d1f] text-sm">มาตรฐานอาชีวศึกษา</h3>
            <p className="text-xs text-[#6e6e73] leading-relaxed">
              สังกัดสำนักงานคณะกรรมการการอาชีวศึกษา กระทรวงศึกษาธิการ
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-[28px] border border-black/[0.06] p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
          <h2 className="text-lg font-bold text-[#1d1d1f]">ข้อมูลติดต่อ วิทยาลัยแม่สอด</h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#515154]">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
              <span>ตำบลแม่ปะ อำเภอแม่สอด จังหวัดตาก 63110</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#0071e3] shrink-0" />
              <span>055-531-155 (งานวิจัยและพัฒนานวัตกรรมสิ่งประดิษฐ์)</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#0071e3] shrink-0" />
              <span>projecthub@mscc.ac.th</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
