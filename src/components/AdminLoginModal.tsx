import React from 'react';
import { X, AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DESIGNATED_ADMIN_EMAIL } from '../firebase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginWithGoogle, authError, clearAuthError, isAdmin } = useAuth();
  const [submitting, setSubmitting] = React.useState(false);

  if (!isOpen) return null;

  const handleLogin = async () => {
    setSubmitting(true);
    await loginWithGoogle();
    setSubmitting(false);
  };

  React.useEffect(() => {
    if (isAdmin) {
      onSuccess();
      onClose();
    }
  }, [isAdmin, onSuccess, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.18)] max-w-sm w-full p-6 sm:p-7 border border-black/[0.08] relative text-center">
        <button
          onClick={() => {
            clearAuthError();
            onClose();
          }}
          className="absolute top-4 right-4 text-[#86868b] hover:text-[#1d1d1f] p-1.5 rounded-full hover:bg-black/[0.05] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-11 h-11 rounded-2xl bg-[#1d1d1f] text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
          <LogIn className="w-5 h-5" />
        </div>

        <h3 className="text-lg font-bold text-[#1d1d1f] tracking-tight mb-1">
          ผู้ดูแลระบบ
        </h3>
        <p className="text-xs text-[#86868b] mb-5 leading-relaxed">
          เข้าสู่ระบบเพื่อจัดการโครงงาน สาขาวิชา และการตั้งค่าของ MSCC Project Hub
        </p>

        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-left flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-800 font-medium">
              {authError}
            </div>
          </div>
        )}

        <div className="p-3.5 rounded-2xl bg-[#f5f5f7] mb-5 text-left text-xs">
          <div className="text-[11px] text-[#86868b]">สิทธิ์ผู้ดูแลระบบหลัก</div>
          <div className="font-semibold text-[#1d1d1f] mt-0.5 font-mono break-all">
            {DESIGNATED_ADMIN_EMAIL}
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={submitting}
          className="w-full py-2.5 px-4 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          {submitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Google'}
        </button>

        <p className="mt-4 text-[11px] text-[#86868b]">
          บุคคลทั่วไปสามารถสืบค้นโครงงานได้โดยไม่ต้องเข้าสู่ระบบ
        </p>
      </div>
    </div>
  );
};
