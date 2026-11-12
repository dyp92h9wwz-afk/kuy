import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  fetchProjects,
  fetchDepartments,
  fetchAcademicYears,
  fetchCategories,
  INITIAL_PROJECTS,
  INITIAL_DEPARTMENTS,
  INITIAL_ACADEMIC_YEARS,
  INITIAL_CATEGORIES,
} from './services/db';
import { Project, Department, AcademicYear, Category } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AwardsPage } from './pages/AwardsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';

function AppRouter() {
  const { route, navigateToAdmin, navigateToHome } = useNavigation();
  const { isAdmin } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  // Load data from Firebase Firestore
  const loadData = useCallback(async () => {
    try {
      const [pList, dList, yList, cList] = await Promise.all([
        fetchProjects(isAdmin),
        fetchDepartments(),
        fetchAcademicYears(),
        fetchCategories(),
      ]);

      const now = new Date().toISOString();
      const finalProjects: Project[] =
        pList && pList.length > 0
          ? pList
          : INITIAL_PROJECTS.map((p) => ({ ...p, createdAt: now, updatedAt: now }));

      const finalDepts: Department[] =
        dList && dList.length > 0
          ? dList
          : INITIAL_DEPARTMENTS.map((d) => ({ ...d, createdAt: now, updatedAt: now }));

      const finalYears: AcademicYear[] =
        yList && yList.length > 0 ? yList : INITIAL_ACADEMIC_YEARS;

      const finalCats: Category[] =
        cList && cList.length > 0 ? cList : INITIAL_CATEGORIES;

      setProjects(finalProjects);
      setDepartments(finalDepts);
      setAcademicYears(finalYears);
      setCategories(finalCats);
    } catch (err) {
      console.error('Data load error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Project count per department map
  const projectCountsByDept = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of projects) {
      if (p.status === 'published') {
        map[p.departmentId] = (map[p.departmentId] || 0) + 1;
      }
    }
    return map;
  }, [projects]);

  // If routing to Admin Page
  if (route.name === 'admin') {
    if (isAdmin) {
      return (
        <AdminDashboard
          projects={projects}
          departments={departments}
          academicYears={academicYears}
          categories={categories}
          settings={{
            collegeName: 'วิทยาลัยแม่สอด',
            collegeShortName: 'MSCC',
            campusName: 'Mae Sot Technical College',
            logo: '',
            contactAddress: 'ตำบลแม่ปะ อำเภอแม่สอด จังหวัดตาก 63110',
            contactPhone: '055-531-155',
            contactEmail: 'projecthub@mscc.ac.th',
            websiteDescription: 'ระบบคลังโครงงานและนวัตกรรม วิทยาลัยแม่สอด',
            adminEmail: 'trithepwangsing175@gmail.com',
          }}
          onRefreshData={loadData}
          onExitAdmin={navigateToHome}
        />
      );
    } else {
      // Non-admin attempted direct route
      return (
        <div className="min-h-screen bg-[#f5f5f7] flex flex-col font-['Plus_Jakarta_Sans','Prompt',sans-serif]">
          <Navbar onOpenAdminLogin={() => setAdminLoginOpen(true)} />
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-8 max-w-sm text-center border border-black/[0.08] shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#1d1d1f]">เข้าสู่ระบบผู้ดูแลระบบ</h2>
              <p className="text-xs text-[#86868b]">
                หน้านี้สงวนสิทธิ์เฉพาะผู้ดูแลระบบวิทยาลัยแม่สอดที่ได้รับอนุญาตเท่านั้น
              </p>
              <button
                onClick={() => setAdminLoginOpen(true)}
                className="w-full py-2.5 px-4 rounded-full bg-[#0071e3] text-white text-xs font-medium cursor-pointer"
              >
                เข้าสู่ระบบ Admin
              </button>
            </div>
          </div>
          <Footer onOpenAdminLogin={() => setAdminLoginOpen(true)} />
          {adminLoginOpen && (
            <AdminLoginModal
              isOpen={adminLoginOpen}
              onClose={() => setAdminLoginOpen(false)}
              onSuccess={navigateToAdmin}
            />
          )}
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col font-['Plus_Jakarta_Sans','Prompt',sans-serif]">
      {/* Global Top Navbar */}
      <Navbar onOpenAdminLogin={() => setAdminLoginOpen(true)} />

      {/* Dynamic Page Rendering */}
      <main className="flex-1">
        {route.name === 'home' && (
          <HomePage
            projects={projects}
            departments={departments}
            academicYears={academicYears}
            projectCountsByDept={projectCountsByDept}
          />
        )}

        {route.name === 'departments' && (
          <DepartmentsPage
            departments={departments}
            projects={projects}
            academicYears={academicYears}
            selectedDeptId={route.deptId}
            projectCountsByDept={projectCountsByDept}
          />
        )}

        {route.name === 'projects' && (
          <ProjectsPage
            projects={projects}
            departments={departments}
            academicYears={academicYears}
            categories={categories}
            initialSearch={route.search}
            initialDeptId={route.deptId}
          />
        )}

        {route.name === 'awards' && <AwardsPage projects={projects} />}

        {route.name === 'project-detail' && (
          <ProjectDetailPage
            projectId={route.projectId}
            projects={projects}
            departments={departments}
          />
        )}

        {route.name === 'about' && <AboutPage />}
      </main>

      {/* Global Bottom Footer */}
      <Footer onOpenAdminLogin={() => setAdminLoginOpen(true)} />

      {/* Admin Login Dialog */}
      {adminLoginOpen && (
        <AdminLoginModal
          isOpen={adminLoginOpen}
          onClose={() => setAdminLoginOpen(false)}
          onSuccess={navigateToAdmin}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppRouter />
      </NavigationProvider>
    </AuthProvider>
  );
}
