import React, { useState } from 'react';
import { QrCode, ChevronRight, Eye } from 'lucide-react';
import { Project } from '../types';
import { QRCodeModal } from './QRCodeModal';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const [showQR, setShowQR] = useState(false);

  return (
    <>
      <div
        onClick={() => onSelect(project)}
        className="group cursor-pointer bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
      >
        {/* Cover Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#f5f5f7]">
          <img
            src={project.coverImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Minimalist QR Icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQR(true);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all cursor-pointer opacity-80 group-hover:opacity-100"
            title="แสดง QR Code"
            aria-label="QR Code"
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Quiet 1-line Department & ID kicker */}
            <div className="flex items-center justify-between text-xs text-[#86868b] mb-1.5">
              <span className="font-medium truncate">{project.departmentName}</span>
              <span className="font-mono text-[11px] shrink-0 text-[#a1a1a6]">{project.projectId}</span>
            </div>

            {/* Project Title */}
            <h3 className="text-base font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors line-clamp-2 leading-snug">
              {project.title}
            </h3>

            {/* Award or Featured Sub-note if present (Quiet text, zero-pill) */}
            {project.award && (
              <p className="mt-2 text-xs font-medium text-[#b45309] line-clamp-1">
                ★ {project.award}
              </p>
            )}

            {/* Excerpt */}
            <p className="mt-2.5 text-xs text-[#6e6e73] line-clamp-2 leading-relaxed">
              {project.abstract}
            </p>
          </div>

          {/* Unboxed Metadata & Authors footer */}
          <div className="mt-5 pt-3.5 border-t border-black/[0.04] space-y-2">
            {/* Authors */}
            <div className="text-xs text-[#86868b] truncate">
              <span className="text-[#515154] font-medium">
                {project.members && project.members.length > 0 ? project.members.join(', ') : 'นักศึกษา'}
              </span>
              {project.advisorName && (
                <>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>ที่ปรึกษา: {project.advisorName}</span>
                </>
              )}
            </div>

            {/* Unboxed Meta Badges with typographic dots */}
            <div className="flex items-center justify-between text-[11px] text-[#86868b]">
              <div className="flex items-center gap-1.5">
                <span>{project.educationLevel}</span>
                <span aria-hidden="true">·</span>
                <span>ระบบ{project.studySystem}</span>
                <span aria-hidden="true">·</span>
                <span>ปี {project.academicYear}</span>
              </div>
              <div className="flex items-center gap-1 text-[#0071e3] font-medium group-hover:translate-x-0.5 transition-transform">
                <span>รายละเอียด</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
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
