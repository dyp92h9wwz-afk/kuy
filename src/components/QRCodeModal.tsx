import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Share2, Check } from 'lucide-react';
import { Project } from '../types';

interface QRCodeModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ project, isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  const projectUrl = window.location.origin + `?project=${project.id}`;

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        projectUrl,
        {
          width: 240,
          margin: 1,
          color: {
            dark: '#1d1d1f',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('QR Code error:', error);
        }
      );
    }
  }, [isOpen, projectUrl]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `QRCode-${project.projectId || project.id}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(projectUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.18)] max-w-sm w-full p-6 text-center border border-black/[0.08] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#86868b] hover:text-[#1d1d1f] p-1.5 rounded-full hover:bg-black/[0.05] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-base font-bold text-[#1d1d1f] mt-1 mb-1">
          QR Code ประจำโครงงาน
        </h3>
        <p className="text-xs text-[#86868b] mb-4">
          สำหรับจัดแสดงนิทรรศการหรือสแกนบนสมาร์ตโฟน
        </p>

        <div className="p-3 bg-white rounded-2xl inline-block border border-black/[0.06] shadow-xs mb-4">
          <canvas ref={canvasRef} className="rounded-lg max-w-full" />
        </div>

        <div className="bg-[#f5f5f7] rounded-xl p-3 mb-5 text-left text-xs">
          <div className="font-mono text-[11px] text-[#86868b]">{project.projectId}</div>
          <div className="font-semibold text-[#1d1d1f] line-clamp-1 mt-0.5">{project.title}</div>
          <div className="text-[11px] text-[#86868b] mt-0.5">{project.departmentName}</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลดภาพ</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-black/[0.05] hover:bg-black/[0.08] text-[#1d1d1f] text-xs font-medium cursor-pointer transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
