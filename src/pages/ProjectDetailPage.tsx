import React, { useState, useEffect, useMemo } from 'react';
import { Project, Department } from '../types';
import { useNavigation } from '../context/NavigationContext';
import { QRCodeModal } from '../components/QRCodeModal';
import { ProjectCard } from '../components/ProjectCard';
import { recordProjectView } from '../services/db';
import {
  ArrowLeft,
  Share2,
  Printer,
  QrCode,
  Download,
  ExternalLink,
  Github,
  Check,
  ChevronRight,
  Eye,
  Play,
  FileText,
} from 'lucide-react';

interface ProjectDetailPageProps {
  projectId: string;
  projects: Project[];
  departments: Department[];
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  projectId,
  projects,
  departments,
}) => {
  const { goBack, navigateToProject, navigateToDepartment, navigateToProjects, navigateToHome } =
    useNavigation();

  const [activeTab, setActiveTab] = useState<'details' | 'docs' | 'media'>('details');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const project = useMemo(() => {
    return projects.find((p) => p.id === projectId || p.projectId === projectId) || null;
  }, [projects, projectId]);

  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (project) {
      setActiveImage(project.coverImage);
      recordProjectView(project.id);
    }
  }, [project]);

  if (!project) {
    return (
      <div className="py-24 bg-[#f5f5f7] min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl p-10 max-w-md text-center border border-black/[0.06] shadow-sm">
          <h2 className="text-base font-bold text-[#1d1d1f] mb-1">ไม่พบโครงงานที่ต้องการ</h2>
          <p className="text-xs text-[#86868b] mb-6">โครงงานนี้อาจถูกลบหรือยังไม่ได้รับการเผยแพร่</p>
          <button
            onClick={() => navigateToProjects()}
            className="px-5 py-2.5 rounded-full bg-[#1d1d1f] text-white text-xs font-medium cursor-pointer"
          >
            กลับไปยังคลังโครงงาน
          </button>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    const url = window.location.origin + `/#/project/${project.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const relatedProjects = projects
    .filter((p) => p.id !== project.id && (p.departmentId === project.departmentId || p.educationLevel === project.educationLevel))
    .slice(0, 3);

  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const ytEmbed = getYouTubeEmbedUrl(project.videoUrl);

  return (
    <div className="py-10 sm:py-16 bg-[#f5f5f7] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Bar / Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#86868b] truncate">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-1.5 font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors cursor-pointer mr-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ย้อนกลับ</span>
            </button>
            <span aria-hidden="true">/</span>
            <button
              onClick={navigateToHome}
              className="hover:text-[#1d1d1f] transition-colors cursor-pointer"
            >
              หน้าแรก
            </button>
            <span aria-hidden="true">/</span>
            <button
              onClick={() => navigateToDepartment(project.departmentId)}
              className="hover:text-[#1d1d1f] transition-colors cursor-pointer truncate"
            >
              {project.departmentName}
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQR(true)}
              className="px-3 py-1.5 rounded-full bg-white border border-black/[0.08] hover:bg-[#f5f5f7] text-[#1d1d1f] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 rounded-full bg-white border border-black/[0.08] hover:bg-[#f5f5f7] text-[#1d1d1f] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว' : 'แชร์'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-full bg-white border border-black/[0.08] hover:bg-[#f5f5f7] text-[#1d1d1f] transition-colors cursor-pointer hidden sm:flex shadow-2xs"
              title="พิมพ์เอกสาร"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Project Header Container */}
        <div className="bg-white rounded-[28px] border border-black/[0.06] p-6 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Gallery Column */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-[#f5f5f7] border border-black/[0.06]">
                <img
                  src={activeImage || project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {project.gallery && project.gallery.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => setActiveImage(project.coverImage)}
                    className={`relative w-16 h-11 rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${
                      activeImage === project.coverImage ? 'border-[#0071e3] ring-1 ring-[#0071e3]' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={project.coverImage} alt="Cover" className="w-full h-full object-cover" />
                  </button>
                  {project.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-16 h-11 rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${
                        activeImage === img ? 'border-[#0071e3] ring-1 ring-[#0071e3]' : 'border-transparent opacity-60'
                      }`}
                    >
                      <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Information Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs text-[#86868b] flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[#0071e3]">{project.educationLevel}</span>
                <span aria-hidden="true">·</span>
                <span>ระบบ{project.studySystem}</span>
                <span aria-hidden="true">·</span>
                <span>ปีการศึกษา {project.academicYear}</span>
                {project.viewsCount > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">เข้าชม {project.viewsCount} ครั้ง</span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] leading-snug">
                {project.title}
              </h1>

              {project.award && (
                <div className="text-xs font-semibold text-[#b45309] flex items-center gap-1.5">
                  <span>★ {project.award}</span>
                </div>
              )}

              {/* Authors & Advisor Card */}
              <div className="bg-[#f5f5f7] rounded-2xl p-5 space-y-3 text-xs">
                <div>
                  <span className="text-[#86868b] block font-medium">คณะผู้จัดทำโครงงาน</span>
                  <span className="text-[#1d1d1f] font-semibold mt-0.5 block text-sm">
                    {project.members && project.members.length > 0 ? project.members.join(', ') : 'นักศึกษาวิทยาลัยแม่สอด'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-black/[0.04]">
                  <div>
                    <span className="text-[#86868b] block font-medium">ครูที่ปรึกษาโครงงาน</span>
                    <span className="text-[#1d1d1f] font-semibold">{project.advisorName || '-'}</span>
                  </div>

                  {project.studySystem === 'ทวิภาคี' && project.companyName && (
                    <div>
                      <span className="text-[#86868b] block font-medium">สถานประกอบการร่วมผลิต</span>
                      <span className="text-[#1d1d1f] font-semibold">{project.companyName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Demo / GitHub Actions */}
              {(project.demoUrl || project.githubUrl) && (
                <div className="flex items-center gap-3 pt-2">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>เปิดดูชิ้นงานจริง</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/[0.06] hover:bg-black/[0.1] text-[#1d1d1f] text-xs font-medium transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>ซอร์สโค้ด GitHub</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-black/[0.06]">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === 'details'
                  ? 'border-[#0071e3] text-[#0071e3]'
                  : 'border-transparent text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              บทคัดย่อและเนื้อหา
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === 'docs'
                  ? 'border-[#0071e3] text-[#0071e3]'
                  : 'border-transparent text-[#86868b] hover:text-[#1d1d1f]'
              }`}
            >
              เอกสารดาวน์โหลด ({project.documents?.length || 0})
            </button>
            {(ytEmbed || (project.gallery && project.gallery.length > 0)) && (
              <button
                onClick={() => setActiveTab('media')}
                className={`py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
                  activeTab === 'media'
                    ? 'border-[#0071e3] text-[#0071e3]'
                    : 'border-transparent text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                สื่อและวิดีโอ
              </button>
            )}
          </div>

          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-6 text-[#1d1d1f] text-sm leading-relaxed">
              <div className="bg-[#f5f5f7] rounded-2xl p-6 sm:p-8">
                <h3 className="font-bold text-[#1d1d1f] text-base mb-2">บทคัดย่อ (Abstract)</h3>
                <p className="text-[#515154] leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                  {project.abstract || 'ไม่มีบทคัดย่อ'}
                </p>
              </div>

              {project.technologies && (
                <div>
                  <h4 className="font-semibold text-xs text-[#86868b] uppercase tracking-wider mb-2">
                    เครื่องมือและเทคโนโลยีที่ใช้
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.split(',').map((tech, i) => (
                      <span key={i} className="px-3 py-1 rounded-lg bg-[#f5f5f7] text-[#1d1d1f] text-xs font-medium">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {project.background && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#1d1d1f] text-sm">ที่มาและความสำคัญ</h4>
                    <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed whitespace-pre-line">
                      {project.background}
                    </p>
                  </div>
                )}

                {project.objectives && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#1d1d1f] text-sm">วัตถุประสงค์</h4>
                    <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed whitespace-pre-line">
                      {project.objectives}
                    </p>
                  </div>
                )}

                {project.scope && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#1d1d1f] text-sm">ขอบเขตของโครงงาน</h4>
                    <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed whitespace-pre-line">
                      {project.scope}
                    </p>
                  </div>
                )}

                {project.methodology && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#1d1d1f] text-sm">วิธีดำเนินงานวิจัยและพัฒนา</h4>
                    <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed whitespace-pre-line">
                      {project.methodology}
                    </p>
                  </div>
                )}
              </div>

              {(project.results || project.benefits) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-black/[0.04]">
                  {project.results && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-[#1d1d1f] text-sm">ผลการศึกษาและทดสอบ</h4>
                      <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed whitespace-pre-line">
                        {project.results}
                      </p>
                    </div>
                  )}

                  {project.benefits && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-[#1d1d1f] text-sm">ประโยชน์ที่ได้รับ</h4>
                      <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed whitespace-pre-line">
                        {project.benefits}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {project.recommendations && (
                <div className="space-y-2 pt-4 border-t border-black/[0.04]">
                  <h4 className="font-bold text-[#1d1d1f] text-sm">ข้อเสนอแนะสำหรับการต่อยอด</h4>
                  <p className="text-xs sm:text-sm text-[#6e6e73] leading-relaxed whitespace-pre-line">
                    {project.recommendations}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DOCS */}
          {activeTab === 'docs' && (
            <div className="space-y-4">
              {project.documents && project.documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.documents.map((docItem, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] flex items-center justify-between gap-4"
                    >
                      <div className="truncate">
                        <div className="text-sm font-semibold text-[#1d1d1f] truncate">
                          {docItem.name}
                        </div>
                        <div className="text-xs text-[#86868b] uppercase mt-0.5">
                          {docItem.type} · {docItem.size || 'เอกสารทางการ'}
                        </div>
                      </div>

                      <a
                        href={docItem.url || '#'}
                        download={docItem.name}
                        onClick={(e) => {
                          if (docItem.url === '#') {
                            e.preventDefault();
                            alert(`ดาวน์โหลดเอกสาร ${docItem.name} (วิทยาลัยแม่สอด)`);
                          }
                        }}
                        className="px-4 py-2 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>ดาวน์โหลด</span>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-[#86868b] text-xs">
                  ไม่มีเอกสารแนบสำหรับโครงงานนี้
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MEDIA */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {ytEmbed && (
                <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-md">
                  <iframe src={ytEmbed} title={project.title} className="w-full h-full" allowFullScreen />
                </div>
              )}

              {project.gallery && project.gallery.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {project.gallery.map((img, i) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden bg-[#f5f5f7]">
                      <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="space-y-6 pt-6">
            <h3 className="text-lg font-bold text-[#1d1d1f]">
              โครงงานอื่นที่น่าสนใจ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((rp) => (
                <ProjectCard key={rp.id} project={rp} onSelect={(p) => navigateToProject(p.id)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {showQR && (
        <QRCodeModal
          project={project}
          isOpen={showQR}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
};
