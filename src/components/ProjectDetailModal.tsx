import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Download,
  Share2,
  Printer,
  QrCode,
  ExternalLink,
  Github,
  Play,
  Check,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { Project } from '../types';
import { QRCodeModal } from './QRCodeModal';
import { recordProjectView } from '../services/db';

interface ProjectDetailModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSelectRelated: (p: Project) => void;
  allProjects: Project[];
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onSelectRelated,
  allProjects,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'media' | 'docs'>('details');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeImage, setActiveImage] = useState<string>(project.coverImage);

  useEffect(() => {
    if (isOpen) {
      setActiveImage(project.coverImage);
      recordProjectView(project.id);
    }
  }, [isOpen, project]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const url = window.location.origin + `?project=${project.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const relatedProjects = allProjects
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
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-md overflow-y-auto animate-fadeIn">
        <div className="bg-white rounded-[28px] shadow-[0_24px_64px_rgba(0,0,0,0.18)] max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-black/[0.08] relative my-auto">
          {/* Modal Header */}
          <div className="sticky top-0 z-20 apple-glass px-6 py-4 border-b border-black/[0.06] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate text-xs text-[#86868b]">
              <span className="font-mono text-[#1d1d1f] font-semibold">{project.projectId}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{project.departmentName}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowQR(true)}
                className="p-2 text-[#515154] hover:text-[#1d1d1f] hover:bg-black/[0.04] rounded-full transition-colors cursor-pointer"
                title="QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 text-[#515154] hover:text-[#1d1d1f] hover:bg-black/[0.04] rounded-full transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'คัดลอกแล้ว' : 'แชร์'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="p-2 text-[#515154] hover:text-[#1d1d1f] hover:bg-black/[0.04] rounded-full transition-colors cursor-pointer hidden sm:flex"
                title="พิมพ์"
              >
                <Printer className="w-4 h-4" />
              </button>
              <div className="h-4 w-[1px] bg-black/[0.08] mx-1" />
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-[#1d1d1f] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1">
            {/* Header Split: Cover & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
                      className={`relative w-14 h-10 rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${
                        activeImage === project.coverImage ? 'border-[#0071e3] ring-1 ring-[#0071e3]' : 'border-transparent opacity-60'
                      }`}
                    >
                      <img src={project.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    </button>
                    {project.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`relative w-14 h-10 rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${
                          activeImage === img ? 'border-[#0071e3] ring-1 ring-[#0071e3]' : 'border-transparent opacity-60'
                        }`}
                      >
                        <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title, Award & Info */}
              <div className="lg:col-span-7 space-y-4">
                {/* Unboxed Metadata Line */}
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

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f] leading-snug">
                  {project.title}
                </h2>

                {project.award && (
                  <div className="text-xs font-semibold text-[#b45309] flex items-center gap-1.5">
                    <span>★ {project.award}</span>
                  </div>
                )}

                {/* Team Box (Apple Minimalist) */}
                <div className="bg-[#f5f5f7] rounded-2xl p-4 space-y-2.5 text-xs">
                  <div>
                    <span className="text-[#86868b] block font-medium">คณะผู้จัดทำ</span>
                    <span className="text-[#1d1d1f] font-semibold mt-0.5 block">
                      {project.members && project.members.length > 0 ? project.members.join(', ') : 'นักศึกษาวิทยาลัยแม่สอด'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-black/[0.04]">
                    <div>
                      <span className="text-[#86868b] block font-medium">ครูที่ปรึกษา</span>
                      <span className="text-[#1d1d1f] font-semibold">{project.advisorName || '-'}</span>
                    </div>

                    {project.studySystem === 'ทวิภาคี' && project.companyName && (
                      <div>
                        <span className="text-[#86868b] block font-medium">สถานประกอบการ</span>
                        <span className="text-[#1d1d1f] font-semibold">{project.companyName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* External Links */}
                {(project.demoUrl || project.githubUrl) && (
                  <div className="flex items-center gap-3 pt-1">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium transition-colors"
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
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/[0.06] hover:bg-black/[0.1] text-[#1d1d1f] text-xs font-medium transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Apple Tab Bar */}
            <div className="flex border-b border-black/[0.06]">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-[#0071e3] text-[#0071e3]'
                    : 'border-transparent text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                บทคัดย่อและรายละเอียด
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
                {/* Abstract */}
                <div className="bg-[#f5f5f7] rounded-2xl p-6">
                  <h4 className="font-bold text-[#1d1d1f] text-sm mb-2">บทคัดย่อ (Abstract)</h4>
                  <p className="text-[#515154] leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                    {project.abstract || 'ไม่มีบทคัดย่อ'}
                  </p>
                </div>

                {/* Tech Stack */}
                {project.technologies && (
                  <div>
                    <h4 className="font-semibold text-xs text-[#86868b] uppercase tracking-wider mb-2">
                      เครื่องมือและเทคโนโลยี
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.split(',').map((tech, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-[#f5f5f7] text-[#1d1d1f] text-xs font-medium">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {project.background && (
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-[#1d1d1f] text-xs">ที่มาและความสำคัญ</h4>
                      <p className="text-xs text-[#6e6e73] leading-relaxed whitespace-pre-line">
                        {project.background}
                      </p>
                    </div>
                  )}

                  {project.objectives && (
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-[#1d1d1f] text-xs">วัตถุประสงค์</h4>
                      <p className="text-xs text-[#6e6e73] leading-relaxed whitespace-pre-line">
                        {project.objectives}
                      </p>
                    </div>
                  )}

                  {project.methodology && (
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-[#1d1d1f] text-xs">วิธีดำเนินงาน</h4>
                      <p className="text-xs text-[#6e6e73] leading-relaxed whitespace-pre-line">
                        {project.methodology}
                      </p>
                    </div>
                  )}

                  {project.results && (
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-[#1d1d1f] text-xs">ผลการทดลองและทดสอบ</h4>
                      <p className="text-xs text-[#6e6e73] leading-relaxed whitespace-pre-line">
                        {project.results}
                      </p>
                    </div>
                  )}
                </div>

                {/* Benefits & Recommendations */}
                {(project.benefits || project.recommendations) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {project.benefits && (
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-[#1d1d1f] text-xs">ประโยชน์ที่ได้รับ</h4>
                        <p className="text-xs text-[#6e6e73] leading-relaxed whitespace-pre-line">
                          {project.benefits}
                        </p>
                      </div>
                    )}

                    {project.recommendations && (
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-[#1d1d1f] text-xs">ข้อเสนอแนะ</h4>
                        <p className="text-xs text-[#6e6e73] leading-relaxed whitespace-pre-line">
                          {project.recommendations}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DOCS */}
            {activeTab === 'docs' && (
              <div className="space-y-4">
                {project.documents && project.documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.documents.map((docItem, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] flex items-center justify-between gap-3"
                      >
                        <div className="truncate">
                          <div className="text-xs font-semibold text-[#1d1d1f] truncate">
                            {docItem.name}
                          </div>
                          <div className="text-[11px] text-[#86868b] uppercase mt-0.5">
                            {docItem.type} · {docItem.size || 'เอกสารทางการ'}
                          </div>
                        </div>

                        <a
                          href={docItem.url || '#'}
                          download={docItem.name}
                          onClick={(e) => {
                            if (docItem.url === '#') {
                              e.preventDefault();
                              alert(`ดาวน์โหลด ${docItem.name} (ไฟล์โครงงานวิทยาลัยแม่สอด)`);
                            }
                          }}
                          className="px-3 py-1.5 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors"
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
                  <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                    <iframe
                      src={ytEmbed}
                      title={project.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}

                {project.gallery && project.gallery.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.gallery.map((img, i) => (
                      <div key={i} className="aspect-video rounded-xl overflow-hidden bg-[#f5f5f7]">
                        <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <div className="pt-8 border-t border-black/[0.06]">
                <h4 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider mb-4">
                  โครงงานที่เกี่ยวข้อง
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {relatedProjects.map((rp) => (
                    <div
                      key={rp.id}
                      onClick={() => onSelectRelated(rp)}
                      className="cursor-pointer group p-3 rounded-2xl bg-[#f5f5f7] hover:bg-black/[0.04] transition-colors"
                    >
                      <div className="aspect-video rounded-xl overflow-hidden bg-[#e5e5ea] mb-2">
                        <img src={rp.coverImage} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="text-[11px] text-[#86868b] truncate">{rp.departmentName}</div>
                      <div className="text-xs font-bold text-[#1d1d1f] line-clamp-1 mt-0.5 group-hover:text-[#0071e3] transition-colors">
                        {rp.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showQR && (
        <QRCodeModal
          project={project}
          isOpen={showQR}
          onClose={() => setShowQR(false)}
        />
      )}
    </>
  );
};
