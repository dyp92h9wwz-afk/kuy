import React, { useState } from 'react';
import {
  Search,
  Menu,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';

interface NavbarProps {
  onOpenAdminLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdminLogin }) => {
  const { isAdmin } = useAuth();
  const {
    route,
    navigateToHome,
    navigateToProjects,
    navigateToDepartment,
    navigateToAwards,
    navigateToAbout,
    navigateToAdmin,
  } = useNavigation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCurrent = (pageName: string) => {
    return route.name === pageName;
  };

  return (
    <header className="sticky top-0 z-40 apple-glass border-b border-black/[0.06] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16 sm:h-18">
          {/* Zone 1: Brand Wordmark */}
          <div
            onClick={navigateToHome}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm group-hover:scale-105 transition-transform">
              M
            </div>
            <span className="text-base font-bold tracking-tight text-[#1d1d1f] whitespace-nowrap">
              MSCC <span className="font-medium text-[#86868b]">Project Hub</span>
            </span>
          </div>

          {/* Zone 2: 4-5 Clean Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium">
            <button
              onClick={navigateToHome}
              className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
                isCurrent('home')
                  ? 'text-[#0071e3] font-semibold'
                  : 'text-[#515154] hover:text-[#1d1d1f]'
              }`}
            >
              หน้าแรก
            </button>
            <button
              onClick={() => navigateToDepartment(undefined)}
              className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
                isCurrent('departments')
                  ? 'text-[#0071e3] font-semibold'
                  : 'text-[#515154] hover:text-[#1d1d1f]'
              }`}
            >
              12 สาขาวิชา
            </button>
            <button
              onClick={() => navigateToProjects()}
              className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
                isCurrent('projects')
                  ? 'text-[#0071e3] font-semibold'
                  : 'text-[#515154] hover:text-[#1d1d1f]'
              }`}
            >
              คลังโครงงาน
            </button>
            <button
              onClick={navigateToAwards}
              className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
                isCurrent('awards')
                  ? 'text-[#0071e3] font-semibold'
                  : 'text-[#515154] hover:text-[#1d1d1f]'
              }`}
            >
              ผลงานรางวัล
            </button>
            <button
              onClick={navigateToAbout}
              className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
                isCurrent('about')
                  ? 'text-[#0071e3] font-semibold'
                  : 'text-[#515154] hover:text-[#1d1d1f]'
              }`}
            >
              เกี่ยวกับเรา
            </button>
          </nav>

          {/* Zone 3: Search + Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigateToProjects()}
              className="p-2 text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04] rounded-full transition-colors cursor-pointer"
              title="ค้นหาโครงงาน"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {isAdmin ? (
              <button
                onClick={navigateToAdmin}
                className="px-3.5 py-1.5 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium transition-all shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>แดชบอร์ด</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="px-3.5 py-1.5 rounded-full bg-black/[0.05] hover:bg-black/[0.08] text-[#1d1d1f] text-xs font-medium transition-all cursor-pointer whitespace-nowrap"
              >
                ผู้ดูแลระบบ
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#515154] hover:text-[#1d1d1f] rounded-lg transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden apple-glass border-b border-black/[0.06] px-6 py-4 space-y-3 animate-fadeIn">
          <button
            onClick={() => {
              navigateToHome();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-[#1d1d1f]"
          >
            หน้าแรก
          </button>
          <button
            onClick={() => {
              navigateToDepartment(undefined);
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-[#1d1d1f]"
          >
            12 สาขาวิชา
          </button>
          <button
            onClick={() => {
              navigateToProjects();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-[#1d1d1f]"
          >
            คลังโครงงานทั้งหมด
          </button>
          <button
            onClick={() => {
              navigateToAwards();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-[#1d1d1f]"
          >
            ผลงานรางวัล
          </button>
          <button
            onClick={() => {
              navigateToAbout();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-[#1d1d1f]"
          >
            เกี่ยวกับเรา
          </button>
        </div>
      )}
    </header>
  );
};
