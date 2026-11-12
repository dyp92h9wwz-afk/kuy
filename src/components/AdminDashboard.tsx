import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  GraduationCap,
  Calendar,
  Layers,
  Award,
  LogOut,
  Database,
  Download,
  Trash2,
  Edit,
  CheckCircle,
  BarChart2,
  PieChart as PieIcon,
  Search,
  X,
  Save,
  AlertTriangle,
  UploadCloud,
  ArrowUpRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Project, Department, AcademicYear, Category, SiteSettings } from '../types';
import {
  saveProject,
  deleteProjectById,
  saveDepartment,
  seedInitialDatabase,
} from '../services/db';
import { useAuth } from '../context/AuthContext';

interface AdminDashboardProps {
  projects: Project[];
  departments: Department[];
  academicYears: AcademicYear[];
  categories: Category[];
  settings: SiteSettings;
  onRefreshData: () => Promise<void>;
  onExitAdmin: () => void;
}

type AdminTab = 'overview' | 'projects' | 'departments' | 'years' | 'tools';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects,
  departments,
  academicYears,
  categories,
  onRefreshData,
  onExitAdmin,
}) => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchProjectQuery, setSearchProjectQuery] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [seedSuccessMsg, setSeedSuccessMsg] = useState('');

  // Project Modal State (Add / Edit)
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [savingProject, setSavingProject] = useState(false);

  // Department Modal State
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptFormOpen, setDeptFormOpen] = useState(false);

  // Delete Confirm Dialog
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Stats calculation
  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.status === 'published').length;
  const draftProjects = projects.filter((p) => p.status === 'draft').length;
  const featuredProjects = projects.filter((p) => p.featured).length;
  const awardProjects = projects.filter((p) => Boolean(p.award)).length;

  // Chart data: Projects by Department
  const projectsByDeptData = departments.map((d) => ({
    name: d.name.replace('แผนกวิชา', ''),
    count: projects.filter((p) => p.departmentId === d.id).length,
  }));

  // Chart data: Projects by Education Level (Apple colors)
  const levelData = [
    { name: 'ปวช.', value: projects.filter((p) => p.educationLevel === 'ปวช.').length, color: '#0071e3' },
    { name: 'ปวส.', value: projects.filter((p) => p.educationLevel === 'ปวส.').length, color: '#34c759' },
  ];

  // Handlers
  const handleOpenAddProject = () => {
    const defaultDept = departments[0] || { id: 'dept-it', name: 'แผนกวิชาเทคโนโลยีสารสนเทศ' };
    const newId = `MSCC-${new Date().getFullYear() + 543}-${Math.floor(1000 + Math.random() * 9000)}`;
    setEditingProject({
      id: `proj-${Date.now()}`,
      projectId: newId,
      title: '',
      slug: '',
      departmentId: defaultDept.id,
      departmentName: defaultDept.name,
      educationLevel: 'ปวส.',
      studySystem: 'ปกติ',
      academicYear: '2568',
      category: categories[0]?.name || 'สิ่งประดิษฐ์และนวัตกรรมอาชีวศึกษา',
      projectType: 'โครงงานนวัตกรรม',
      abstract: '',
      background: '',
      objectives: '',
      scope: '',
      methodology: '',
      technologies: '',
      results: '',
      benefits: '',
      recommendations: '',
      members: [''],
      advisorName: '',
      companyName: '',
      coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      documents: [
        { id: 'doc-1', name: 'รายงานโครงงานฉบับสมบูรณ์ (PDF)', url: '#', type: 'pdf', size: '5 MB' },
      ],
      videoUrl: '',
      githubUrl: '',
      demoUrl: '',
      tags: ['แม่สอด', 'นวัตกรรม'],
      featured: false,
      award: '',
      status: 'published',
      viewsCount: 0,
    });
    setProjectFormOpen(true);
  };

  const handleEditProject = (p: Project) => {
    setEditingProject({ ...p });
    setProjectFormOpen(true);
  };

  const handleSaveProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title || !editingProject.departmentId) {
      alert('กรุณากรอกชื่อโครงงานและเลือกแผนกวิชา');
      return;
    }
    setSavingProject(true);
    try {
      const dept = departments.find((d) => d.id === editingProject.departmentId);
      const fullProject = {
        ...editingProject,
        departmentName: dept?.name || editingProject.departmentName || '',
        members: editingProject.members?.filter((m) => m.trim().length > 0) || [],
      } as Project;

      await saveProject(fullProject);
      await onRefreshData();
      setProjectFormOpen(false);
      setEditingProject(null);
    } catch (err) {
      console.error('Error saving project:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProjectConfirm = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProjectById(projectToDelete.id);
      await onRefreshData();
      setProjectToDelete(null);
    } catch (err) {
      console.error('Delete error:', err);
      alert('เกิดข้อผิดพลาดในการลบโครงงาน');
    }
  };

  const handleToggleProjectStatus = async (p: Project, nextStatus: 'published' | 'draft' | 'archived') => {
    try {
      await saveProject({ ...p, status: nextStatus });
      await onRefreshData();
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const handleSeedDatabase = async () => {
    if (!confirm('ต้องการซิงค์ข้อมูลเริ่มต้น (12 แผนกวิชาและโครงงานตัวอย่าง) ลงใน Firebase หรือไม่?')) {
      return;
    }
    setSeeding(true);
    try {
      const res = await seedInitialDatabase();
      setSeedSuccessMsg(`ซิงค์ข้อมูลสำเร็จ! นำเข้า ${res.departments} สาขาวิชา และ ${res.projects} โครงงาน`);
      await onRefreshData();
      setTimeout(() => setSeedSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Seed error:', err);
      alert('เกิดข้อผิดพลาดในการซิงค์ข้อมูล');
    } finally {
      setSeeding(false);
    }
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mscc-projects-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredProjectsTable = projects.filter((p) => {
    if (!searchProjectQuery) return true;
    const q = searchProjectQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.projectId.toLowerCase().includes(q) ||
      p.departmentName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col font-['Plus_Jakarta_Sans','Prompt',sans-serif]">
      {/* Top macOS-style Glass Bar */}
      <header className="apple-glass sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between border-b border-black/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-xs">
            M
          </div>
          <div>
            <div className="text-xs font-bold text-[#1d1d1f] tracking-tight">MSCC Project Hub</div>
            <div className="text-[10px] text-[#86868b]">ระบบผู้ดูแลระบบ (Admin)</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right text-xs">
            <span className="font-semibold text-[#1d1d1f] block">{user?.displayName || 'Administrator'}</span>
            <span className="text-[10px] text-[#86868b]">{user?.email}</span>
          </div>
          <button
            onClick={onExitAdmin}
            className="px-3.5 py-1.5 rounded-full bg-black/[0.05] hover:bg-black/[0.08] text-[#1d1d1f] text-xs font-medium transition-colors cursor-pointer"
          >
            หน้าเว็บไซต์
          </button>
          <button
            onClick={logout}
            className="p-1.5 rounded-full hover:bg-red-50 text-[#86868b] hover:text-red-600 transition-colors cursor-pointer"
            title="ออกจากระบบ"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Apple Style Sidebar */}
        <aside className="w-full md:w-60 bg-white border-r border-black/[0.06] p-4 space-y-1">
          <div className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider px-3 py-2">
            การจัดการ
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'bg-[#1d1d1f] text-white shadow-xs' : 'text-[#515154] hover:bg-[#f5f5f7]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>ภาพรวมและสถิติ</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'projects' ? 'bg-[#1d1d1f] text-white shadow-xs' : 'text-[#515154] hover:bg-[#f5f5f7]'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>จัดการโครงงาน ({totalProjects})</span>
          </button>

          <button
            onClick={() => setActiveTab('departments')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'departments' ? 'bg-[#1d1d1f] text-white shadow-xs' : 'text-[#515154] hover:bg-[#f5f5f7]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>12 สาขาวิชา</span>
          </button>

          <button
            onClick={() => setActiveTab('years')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'years' ? 'bg-[#1d1d1f] text-white shadow-xs' : 'text-[#515154] hover:bg-[#f5f5f7]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>ปีการศึกษา</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'tools' ? 'bg-[#1d1d1f] text-white shadow-xs' : 'text-[#515154] hover:bg-[#f5f5f7]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>ซิงค์และสำรองข้อมูล</span>
          </button>

          <div className="pt-4 mt-4 border-t border-black/[0.04]">
            <button
              onClick={handleOpenAddProject}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs transition-colors cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>เพิ่มโครงงาน</span>
            </button>
          </div>
        </aside>

        {/* Tab Content */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {seedSuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fadeIn">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{seedSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#1d1d1f]">แดชบอร์ดสรุปผลงาน</h2>
                  <p className="text-xs text-[#86868b] mt-0.5">ภาพรวมสถิติคลังโครงงาน วิทยาลัยแม่สอด</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddProject}
                    className="px-3.5 py-2 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>เพิ่มโครงงาน</span>
                  </button>
                  <button
                    onClick={handleExportData}
                    className="px-3.5 py-2 rounded-full bg-white border border-black/[0.08] hover:bg-[#f5f5f7] text-[#1d1d1f] text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>

              {/* Stat Cards (Apple Clean) */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <div className="text-xs text-[#86868b]">โครงงานทั้งหมด</div>
                  <div className="text-2xl font-bold text-[#1d1d1f] mt-1 tabular-nums">{totalProjects}</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <div className="text-xs text-[#86868b]">เผยแพร่แล้ว</div>
                  <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">{publishedProjects}</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <div className="text-xs text-[#86868b]">แบบร่าง (Draft)</div>
                  <div className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">{draftProjects}</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <div className="text-xs text-[#86868b]">ผลงานรางวัล</div>
                  <div className="text-2xl font-bold text-[#b45309] mt-1 tabular-nums">{awardProjects}</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <div className="text-xs text-[#86868b]">สาขาวิชาชีพ</div>
                  <div className="text-2xl font-bold text-[#1d1d1f] mt-1 tabular-nums">{departments.length}</div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                  <h3 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider mb-4">
                    จำนวนโครงงานจำแนกตามสาขาวิชา
                  </h3>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={projectsByDeptData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                        <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 9 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0071e3" radius={[4, 4, 0, 0]} name="จำนวนโครงงาน" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider mb-2">
                      ระดับ ปวช. vs ปวส.
                    </h3>
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={levelData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" label>
                            {levelData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-black/[0.04] text-xs text-[#86868b] flex justify-between">
                    <span>ระบบปกติ: {projects.filter((p) => p.studySystem === 'ปกติ').length}</span>
                    <span>ทวิภาคี: {projects.filter((p) => p.studySystem === 'ทวิภาคี').length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-black/[0.06]">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-[#86868b] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchProjectQuery}
                    onChange={(e) => setSearchProjectQuery(e.target.value)}
                    placeholder="ค้นหาโครงงาน..."
                    className="w-full pl-9 pr-3 py-2 bg-[#f5f5f7] border border-transparent rounded-xl text-xs focus:bg-white focus:border-[#0071e3] focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleOpenAddProject}
                  className="px-4 py-2 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>เพิ่มโครงงาน</span>
                </button>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-black/[0.06] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#1d1d1f]">
                    <thead className="bg-[#f5f5f7] text-[#86868b] font-medium border-b border-black/[0.04]">
                      <tr>
                        <th className="py-3 px-4">ชื่อโครงงาน</th>
                        <th className="py-3 px-3">สาขาวิชา</th>
                        <th className="py-3 px-3">ระดับ/ระบบ</th>
                        <th className="py-3 px-2 text-center">ปี</th>
                        <th className="py-3 px-3">สถานะ</th>
                        <th className="py-3 px-4 text-right">การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04]">
                      {filteredProjectsTable.map((p) => (
                        <tr key={p.id} className="hover:bg-[#f5f5f7]/60 transition-colors">
                          <td className="py-3 px-4 max-w-xs">
                            <div className="font-mono text-[10px] text-[#86868b]">{p.projectId}</div>
                            <div className="font-semibold text-[#1d1d1f] line-clamp-1 mt-0.5">{p.title}</div>
                          </td>
                          <td className="py-3 px-3 text-[#515154] whitespace-nowrap">
                            {p.departmentName.replace('แผนกวิชา', '')}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap text-[#86868b]">
                            {p.educationLevel} · {p.studySystem}
                          </td>
                          <td className="py-3 px-2 text-center text-[#86868b]">{p.academicYear}</td>
                          <td className="py-3 px-3">
                            <select
                              value={p.status}
                              onChange={(e) => handleToggleProjectStatus(p, e.target.value as any)}
                              className="text-[11px] font-medium px-2 py-0.5 rounded-lg border border-black/[0.06] bg-white cursor-pointer focus:outline-none"
                            >
                              <option value="published">เผยแพร่</option>
                              <option value="draft">แบบร่าง</option>
                              <option value="archived">เก็บถาวร</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEditProject(p)}
                                className="p-1.5 rounded-lg hover:bg-black/[0.05] text-[#515154] hover:text-[#1d1d1f] transition-colors cursor-pointer"
                                title="แก้ไข"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setProjectToDelete(p)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-[#86868b] hover:text-red-600 transition-colors cursor-pointer"
                                title="ลบ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DEPARTMENTS */}
          {activeTab === 'departments' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-black/[0.06]">
                <h3 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">
                  สาขาวิชาชีพ วิทยาลัยแม่สอด ({departments.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {departments.map((dept) => {
                  const count = projects.filter((p) => p.departmentId === dept.id).length;
                  return (
                    <div
                      key={dept.id}
                      className="bg-white rounded-2xl border border-black/[0.06] p-4 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5 text-xs text-[#86868b]">
                          <span>ลำดับ {dept.order}</span>
                          <span>{count} โครงงาน</span>
                        </div>
                        <h4 className="font-bold text-[#1d1d1f] text-sm">{dept.name}</h4>
                        <p className="text-xs text-[#6e6e73] mt-1 line-clamp-2">{dept.description}</p>
                      </div>

                      <div className="pt-2 border-t border-black/[0.04] flex items-center justify-between text-xs">
                        <span className="text-[#86868b]">{dept.isActive ? 'เปิดใช้งาน' : 'ปิด'}</span>
                        <button
                          onClick={() => {
                            setEditingDept(dept);
                            setDeptFormOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-full bg-[#f5f5f7] hover:bg-black/[0.08] text-[#1d1d1f] font-medium text-xs transition-colors cursor-pointer"
                        >
                          แก้ไข
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: YEARS */}
          {activeTab === 'years' && (
            <div className="bg-white rounded-2xl border border-black/[0.06] p-6 max-w-lg space-y-4">
              <h3 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">
                ปีการศึกษาที่เปิดใช้งาน
              </h3>
              <div className="divide-y divide-black/[0.04]">
                {academicYears.map((y) => (
                  <div key={y.id} className="py-2.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1d1d1f]">{y.label}</span>
                    <span className="text-[#86868b] font-mono">ปี {y.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TOOLS & SEED */}
          {activeTab === 'tools' && (
            <div className="space-y-4 max-w-xl">
              <div className="bg-white rounded-2xl border border-black/[0.06] p-6 space-y-3">
                <h3 className="text-sm font-bold text-[#1d1d1f]">ซิงค์ข้อมูลเริ่มต้น (Initial Database Seed)</h3>
                <p className="text-xs text-[#6e6e73] leading-relaxed">
                  นำเข้า 12 สาขาวิชาชีพและตัวอย่างโครงงานวิทยาลัยแม่สอดลงใน Firebase Firestore
                </p>
                <button
                  onClick={handleSeedDatabase}
                  disabled={seeding}
                  className="px-4 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{seeding ? 'กำลังซิงค์...' : 'เริ่มซิงค์ข้อมูล'}</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-black/[0.06] p-6 space-y-3">
                <h3 className="text-sm font-bold text-[#1d1d1f]">สำรองข้อมูล (Export JSON)</h3>
                <p className="text-xs text-[#6e6e73] leading-relaxed">
                  ดาวน์โหลดข้อมูลโครงงานทั้งหมดเก็บเป็นไฟล์สำรอง
                </p>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลด JSON</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PROJECT FORM MODAL */}
      {projectFormOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-[28px] shadow-[0_24px_64px_rgba(0,0,0,0.18)] max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-black/[0.08]">
            <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between">
              <h3 className="font-bold text-[#1d1d1f] text-sm">
                {editingProject.id ? 'แก้ไขโครงงาน' : 'เพิ่มโครงงานใหม่'}
              </h3>
              <button
                onClick={() => setProjectFormOpen(false)}
                className="p-1 rounded-full text-[#86868b] hover:text-[#1d1d1f] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProjectSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8">
                  <label className="block font-semibold text-[#1d1d1f] mb-1">ชื่อโครงงาน *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 border border-black/[0.08] rounded-xl focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block font-semibold text-[#1d1d1f] mb-1">รหัสโครงงาน</label>
                  <input
                    type="text"
                    value={editingProject.projectId || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, projectId: e.target.value })}
                    className="w-full px-3 py-2 border border-black/[0.08] rounded-xl font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-[#1d1d1f] mb-1">สาขาวิชา</label>
                  <select
                    value={editingProject.departmentId || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, departmentId: e.target.value })}
                    className="w-full px-2 py-2 border border-black/[0.08] rounded-xl focus:outline-none"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name.replace('แผนกวิชา', '')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1d1d1f] mb-1">ระดับ</label>
                  <select
                    value={editingProject.educationLevel || 'ปวส.'}
                    onChange={(e) => setEditingProject({ ...editingProject, educationLevel: e.target.value as any })}
                    className="w-full px-2 py-2 border border-black/[0.08] rounded-xl focus:outline-none"
                  >
                    <option value="ปวช.">ปวช.</option>
                    <option value="ปวส.">ปวส.</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1d1d1f] mb-1">ระบบ</label>
                  <select
                    value={editingProject.studySystem || 'ปกติ'}
                    onChange={(e) => setEditingProject({ ...editingProject, studySystem: e.target.value as any })}
                    className="w-full px-2 py-2 border border-black/[0.08] rounded-xl focus:outline-none"
                  >
                    <option value="ปกติ">ปกติ</option>
                    <option value="ทวิภาคี">ทวิภาคี</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#1d1d1f] mb-1">ปีการศึกษา</label>
                  <select
                    value={editingProject.academicYear || '2568'}
                    onChange={(e) => setEditingProject({ ...editingProject, academicYear: e.target.value })}
                    className="w-full px-2 py-2 border border-black/[0.08] rounded-xl focus:outline-none"
                  >
                    {academicYears.map((y) => (
                      <option key={y.id} value={y.year}>
                        ปี {y.year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1d1d1f] mb-1">สมาชิกผู้จัดทำ (คั่นด้วยเครื่องหมายจุลภาค ,)</label>
                <input
                  type="text"
                  value={editingProject.members?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      members: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  className="w-full px-3 py-2 border border-black/[0.08] rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1d1d1f] mb-1">ครูที่ปรึกษา</label>
                  <input
                    type="text"
                    value={editingProject.advisorName || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, advisorName: e.target.value })}
                    className="w-full px-3 py-2 border border-black/[0.08] rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1d1d1f] mb-1">สถานประกอบการ (ถ้ามี)</label>
                  <input
                    type="text"
                    value={editingProject.companyName || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-black/[0.08] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1d1d1f] mb-1">บทคัดย่อ (Abstract) *</label>
                <textarea
                  rows={4}
                  required
                  value={editingProject.abstract || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, abstract: e.target.value })}
                  className="w-full px-3 py-2 border border-black/[0.08] rounded-xl focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1d1d1f] mb-1">เครื่องมือและเทคโนโลยี</label>
                  <input
                    type="text"
                    value={editingProject.technologies || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value })}
                    className="w-full px-3 py-2 border border-black/[0.08] rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1d1d1f] mb-1">URL รูปภาพหน้าปก</label>
                  <input
                    type="url"
                    value={editingProject.coverImage || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                    className="w-full px-3 py-2 border border-black/[0.08] rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1d1d1f] mb-1">รางวัลที่ได้รับ (ถ้ามี)</label>
                  <input
                    type="text"
                    value={editingProject.award || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, award: e.target.value })}
                    className="w-full px-3 py-2 border border-black/[0.08] rounded-xl focus:outline-none"
                    placeholder="เช่น รางวัลชนะเลิศระดับภาคเหนือ"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#1d1d1f] mb-1">สถานะการเผยแพร่</label>
                  <select
                    value={editingProject.status || 'published'}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-black/[0.08] rounded-xl font-medium"
                  >
                    <option value="published">เผยแพร่</option>
                    <option value="draft">แบบร่าง</option>
                    <option value="archived">เก็บถาวร</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-black/[0.06] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProjectFormOpen(false)}
                  className="px-4 py-2 rounded-full border border-black/[0.08] text-[#515154] hover:bg-[#f5f5f7] font-medium"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={savingProject}
                  className="px-5 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium shadow-xs disabled:opacity-50"
                >
                  {savingProject ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEPARTMENT MODAL */}
      {deptFormOpen && editingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.18)] max-w-md w-full p-6 border border-black/[0.08] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
              <h3 className="font-bold text-[#1d1d1f] text-sm">แก้ไขสาขาวิชา</h3>
              <button onClick={() => setDeptFormOpen(false)} className="text-[#86868b] hover:text-[#1d1d1f]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1d1d1f] mb-1">ชื่อแผนกวิชา</label>
                <input
                  type="text"
                  value={editingDept.name}
                  onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                  className="w-full px-3 py-2 border border-black/[0.08] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1d1d1f] mb-1">คำอธิบาย</label>
                <textarea
                  rows={3}
                  value={editingDept.description}
                  onChange={(e) => setEditingDept({ ...editingDept, description: e.target.value })}
                  className="w-full px-3 py-2 border border-black/[0.08] rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-black/[0.06] flex items-center justify-end gap-2">
              <button
                onClick={() => setDeptFormOpen(false)}
                className="px-3.5 py-1.5 rounded-full border border-black/[0.08] text-xs font-medium text-[#515154]"
              >
                ยกเลิก
              </button>
              <button
                onClick={async () => {
                  await saveDepartment(editingDept);
                  await onRefreshData();
                  setDeptFormOpen(false);
                }}
                className="px-4 py-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-xs font-medium text-white shadow-xs"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.18)] max-w-xs w-full p-6 text-center border border-black/[0.08] space-y-3">
            <h4 className="font-bold text-[#1d1d1f] text-sm">ลบโครงงานนี้?</h4>
            <p className="text-xs text-[#6e6e73]">
              "{projectToDelete.title}"
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="py-1.5 px-3 rounded-full border border-black/[0.08] text-xs font-medium text-[#515154]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteProjectConfirm}
                className="py-1.5 px-3 rounded-full bg-red-600 hover:bg-red-700 text-xs font-medium text-white shadow-xs"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
