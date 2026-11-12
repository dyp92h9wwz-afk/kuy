import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  increment,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Project, Department, AcademicYear, Category, SiteSettings } from '../types';

export const INITIAL_DEPARTMENTS: Omit<Department, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'dept-auto',
    name: 'แผนกวิชาช่างยนต์',
    slug: 'automotive',
    description: 'พัฒนาทักษะระบบยานยนต์ ยานยนต์ไฟฟ้า (EV) และระบบหัวฉีดคอมมอนเรล ควบคุมเครื่องยนต์อัจฉริยะ',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    icon: 'Wrench',
    color: 'from-amber-500 to-orange-600',
    isActive: true,
    order: 1,
  },
  {
    id: 'dept-machine',
    name: 'แผนกวิชาช่างกลโรงงาน',
    slug: 'machine-shop',
    description: 'เทคโนโลยีเครื่องจักรกลการผลิต งานกลึง กัด ไส CNC และการออกแบบชิ้นส่วนอุตสาหกรรมแม่นยำสูง',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    icon: 'Cog',
    color: 'from-blue-600 to-indigo-800',
    isActive: true,
    order: 2,
  },
  {
    id: 'dept-weld',
    name: 'แผนกวิชาช่างเชื่อมโลหะ',
    slug: 'welding',
    description: 'งานเชื่อมโครงสร้างอุตสาหกรรม การตรวจสอบรอยเชื่อมแบบไม่ทำลาย (NDT) และการขึ้นรูปโลหะแผ่น',
    imageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    icon: 'Flame',
    color: 'from-red-500 to-amber-600',
    isActive: true,
    order: 3,
  },
  {
    id: 'dept-electric',
    name: 'แผนกวิชาช่างไฟฟ้ากำลัง',
    slug: 'electrical-power',
    description: 'ระบบสายส่งพลังงานไฟฟ้า ระบบโซลาร์เซลล์พลังงานแสงอาทิตย์ และระบบควบคุมมอเตอร์ PLC อุตสาหกรรม',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    icon: 'Zap',
    color: 'from-yellow-500 to-amber-600',
    isActive: true,
    order: 4,
  },
  {
    id: 'dept-electronic',
    name: 'แผนกวิชาช่างอิเล็กทรอนิกส์',
    slug: 'electronics',
    description: 'การออกแบบไมโครคอนโทรลเลอร์ ระบบสมองกลฝังตัว IoT หุ่นยนต์อัตโนมัติ และเซนเซอร์อุตสาหกรรม',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    icon: 'Cpu',
    color: 'from-cyan-500 to-blue-600',
    isActive: true,
    order: 5,
  },
  {
    id: 'dept-civil',
    name: 'แผนกวิชาช่างก่อสร้าง',
    slug: 'construction',
    description: 'วิศวกรรมงานโครงสร้างอาคาร การสำรวจรังวัด เทคนิคคอนกรีต และการประมาณราคางานก่อสร้าง',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    icon: 'HardHat',
    color: 'from-stone-600 to-zinc-800',
    isActive: true,
    order: 6,
  },
  {
    id: 'dept-arch',
    name: 'แผนกวิชาสถาปัตยกรรม',
    slug: 'architecture',
    description: 'การออกแบบสถาปัตยกรรมอาคาร การสร้างแบบจำลอง 3 มิติ BIM และการออกแบบตกแต่งภายในเชิงนิเวศ',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    icon: 'Compass',
    color: 'from-emerald-600 to-teal-800',
    isActive: true,
    order: 7,
  },
  {
    id: 'dept-account',
    name: 'แผนกวิชาการบัญชี',
    slug: 'accounting',
    description: 'ระบบสารสนเทศทางการบัญชี ภาษีอากร ธุรกิจการค้าชายแดน และการวิเคราะห์งบการเงินดิจิทัล',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    icon: 'Calculator',
    color: 'from-green-600 to-emerald-700',
    isActive: true,
    order: 8,
  },
  {
    id: 'dept-marketing',
    name: 'แผนกวิชาการตลาดและการจัดการ',
    slug: 'marketing',
    description: 'การตลาดยุคดิจิทัล การสร้างแบรนด์สินค้าเกษตรแปรรูป และการบริหารการค้าเขตเศรษฐกิจพิเศษแม่สอด',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    icon: 'TrendingUp',
    color: 'from-purple-600 to-pink-600',
    isActive: true,
    order: 9,
  },
  {
    id: 'dept-logistics',
    name: 'แผนกวิชาการจัดการโลจิสติกส์และซัพพลายเชน',
    slug: 'logistics',
    description: 'ระบบคลังสินค้าอัจฉริยะ การกระจายสินค้าข้ามพรมแดนไทย-เมียนมา และการขนส่งแบบมัลติโมดัล',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    icon: 'Truck',
    color: 'from-sky-600 to-blue-800',
    isActive: true,
    order: 10,
  },
  {
    id: 'dept-dbt',
    name: 'แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล',
    slug: 'digital-business',
    description: 'พาณิชย์อิเล็กทรอนิกส์ การพัฒนาสื่อมัลติมีเดีย กราฟิก และการผลิตคอนเทนต์สำหรับธุรกิจออนไลน์',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    icon: 'Laptop',
    color: 'from-indigo-500 to-violet-700',
    isActive: true,
    order: 11,
  },
  {
    id: 'dept-it',
    name: 'แผนกวิชาเทคโนโลยีสารสนเทศ',
    slug: 'information-technology',
    description: 'การพัฒนาเว็บแอปพลิเคชัน คลาวด์คอมพิวติ้ง ระบบความปลอดภัยไซเบอร์ และการวิเคราะห์ฐานข้อมูล',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    icon: 'Code',
    color: 'from-blue-500 to-teal-600',
    isActive: true,
    order: 12,
  },
];

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  { id: 'year-2568', year: '2568', label: 'ปีการศึกษา 2568', isActive: true, createdAt: '2026-01-01' },
  { id: 'year-2567', year: '2567', label: 'ปีการศึกษา 2567', isActive: true, createdAt: '2025-01-01' },
  { id: 'year-2566', year: '2566', label: 'ปีการศึกษา 2566', isActive: true, createdAt: '2024-01-01' },
  { id: 'year-2565', year: '2565', label: 'ปีการศึกษา 2565', isActive: true, createdAt: '2023-01-01' },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-innov', name: 'สิ่งประดิษฐ์และนวัตกรรมอาชีวศึกษา', description: 'ผลงานสิ่งประดิษฐ์เพื่อการพัฒนาคุณภาพชีวิตและอุตสาหกรรม', isActive: true, order: 1 },
  { id: 'cat-soft', name: 'ซอฟต์แวร์ แอปพลิเคชัน และระบบสารสนเทศ', description: 'โปรแกรมคอมพิวเตอร์ เว็บไซต์ และแอปพลิเคชันมือถือ', isActive: true, order: 2 },
  { id: 'cat-iot', name: 'อินเทอร์เน็ตของสรรพสิ่ง (IoT) และระบบอัตโนมัติ', description: 'ระบบควบคุมอัจฉริยะและเซนเซอร์การเกษตร/อุตสาหกรรม', isActive: true, order: 3 },
  { id: 'cat-clean', name: 'พลังงานทดแทนและสิ่งแวดล้อม', description: 'นวัตกรรมพลังงานแสงอาทิตย์และการจัดการของเสียชุมชน', isActive: true, order: 4 },
  { id: 'cat-biz', name: 'แผนธุรกิจและสตาร์ทอัพชุมชน', description: 'นวัตกรรมโมเดลธุรกิจสินค้าท้องถิ่นชายแดนแม่สอด', isActive: true, order: 5 },
];

export const INITIAL_SETTINGS: SiteSettings = {
  collegeName: 'วิทยาลัยแม่สอด',
  collegeShortName: 'MSCC',
  campusName: 'Mae Sot Technical College',
  logo: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=200&q=80',
  contactAddress: 'ตำบลแม่ปะ อำเภอแม่สอด จังหวัดตาก 63110',
  contactPhone: '055-531-155',
  contactEmail: 'contact@mscc.ac.th',
  websiteDescription: 'ระบบศูนย์รวมคลังข้อมูลโครงงาน งานวิจัย และนวัตกรรมสิ่งประดิษฐ์คนรุ่นใหม่ วิทยาลัยแม่สอด สังกัดสำนักงานคณะกรรมการการอาชีวศึกษา',
  adminEmail: 'trithepwangsing175@gmail.com',
};

export const INITIAL_PROJECTS: Omit<Project, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'proj-001',
    projectId: 'MSCC-2567-IT-01',
    title: 'ระบบบริหารจัดการสินค้าเกษตรชายแดนแม่สอดด้วย IoT และแดชบอร์ดคลาวด์',
    slug: 'maesot-border-agri-iot',
    departmentId: 'dept-it',
    departmentName: 'แผนกวิชาเทคโนโลยีสารสนเทศ',
    educationLevel: 'ปวส.',
    studySystem: 'ทวิภาคี',
    academicYear: '2567',
    category: 'อินเทอร์เน็ตของสรรพสิ่ง (IoT) และระบบอัตโนมัติ',
    projectType: 'โครงงานนวัตกรรมดิจิทัล',
    abstract: 'โครงงานนี้พัฒนาระบบตรวจสอบอุณหภูมิและความชื้นในตู้ขนส่งและคลังพักพืชผลเกษตรนำเข้า-ส่งออกบริเวณด่านพรมแดนแม่สอด โดยเชื่อมต่อเซนเซอร์ ESP32 ผ่านเครือข่าย LoRaWAN ส่งข้อมูลเข้าสู่คลาวด์แดชบอร์ดแบบเรียลไทม์ พร้อมระบบแจ้งเตือนผ่านแอปพลิเคชันไลน์เมื่อคุณภาพอากาศผิดปกติ ช่วยลดความสูญเสียผลผลิตเกษตรได้ถึงร้อยละ 32',
    background: 'อำเภอแม่สอด จังหวัดตาก เป็นศูนย์กลางการค้าชายแดนที่สำคัญของภาคเหนือ ผลผลิตเกษตรที่ขนส่งข้ามสะพานมิตรภาพไทย-เมียนมามักประสบปัญหาการเน่าเสียระหว่างรอการตรวจปล่อยสินค้า ผู้จัดทำจึงได้ร่วมกับสถานประกอบการในพื้นที่พัฒนาอุปกรณ์ตรวจวัดและแอปพลิเคชันติดตามสถานะแบบเรียลไทม์',
    objectives: '1. เพื่อออกแบบและสร้างกล่องตรวจวัดสภาพแวดล้อม IoT ขนาดกะทัดรัด\n2. เพื่อพัฒนาระบบคลาวด์แดชบอร์ดแสดงผลการติดตามตำแหน่งและอุณหภูมิ\n3. เพื่อประเมินความพึงพอใจของสถานประกอบการขนส่งในพื้นที่แม่สอด',
    scope: 'ครอบคลุมการทดสอบกับรถบรรทุกขนส่งสินค้าเกษตรจำนวน 15 คัน ในเส้นทางอำเภอแม่สอดถึงอำเภอเมืองตาก ระยะเวลาเก็บข้อมูล 3 เดือน',
    methodology: '1. ศึกษาสภาพปัญหาและความต้องการของผู้ประกอบการขนส่งสินค้าเกษตร\n2. ออกแบบวงจรฮาร์ดแวร์โดยใช้บอร์ดไมโครคอนโทรลเลอร์ ESP32 และเซนเซอร์ SHT31\n3. เขียนโปรแกรมส่งข้อมูลผ่าน MQTT ไปยัง Firebase Firestore และพัฒนา Frontend React สำหรับแสดงผล\n4. ติดตั้งและเก็บข้อมูลเปรียบเทียบในสภาพการใช้งานจริง',
    technologies: 'React, TypeScript, Firebase, Tailwind CSS, ESP32, LoRaWAN, Python MQTT Broker',
    results: 'ระบบสามารถตรวจวัดและส่งข้อมูลได้ต่อเนื่องแม้ในจุดอับสัญญาณโดยมีระบบออฟไลน์แคช และช่วยให้ผู้ควบคุมตู้เย็นปรับอุณหภูมิได้ทันท่วงที ได้รับผลการประเมินความพึงพอใจในระดับดีมาก (ค่าเฉลี่ย 4.82 จาก 5.00)',
    benefits: '1. ลดอัตราการเน่าเสียของสินค้าเกษตรสด\n2. ผู้ประกอบการสามารถตรวจสอบย้อนกลับ (Traceability) คุณภาพการขนส่งได้ทุกเที่ยวบิน\n3. สามารถต่อยอดเชิงพาณิชย์สำหรับโลจิสติกส์ข้ามแดน',
    recommendations: 'ควรเพิ่มระบบตรวจวัดก๊าซเอทิลีนเพื่อประเมินความสุกงอมของผลไม้ในอนาคต',
    members: ['นายธนภัทร ใจมั่น', 'นางสาวกานต์พิชชา ศรีวิชัย', 'นายอนุสรณ์ พงษ์ศิริ'],
    advisorName: 'อาจารย์พิชิต สุวรรณรัตน์',
    companyName: 'บริษัท แม่สอดอินเตอร์โลจิสติกส์ จำกัด',
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    ],
    documents: [
      { id: 'doc-1', name: 'รายงานโครงงานฉบับสมบูรณ์ (PDF)', url: '#', type: 'pdf', size: '4.8 MB' },
      { id: 'doc-2', name: 'สไลด์นำเสนอผลงาน (PowerPoint)', url: '#', type: 'pptx', size: '12.4 MB' },
      { id: 'doc-3', name: 'คู่มือการติดตั้งและซอร์สโค้ด (ZIP)', url: '#', type: 'zip', size: '1.2 MB' },
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    githubUrl: 'https://github.com/example/mscc-border-iot',
    demoUrl: 'https://example.com/demo-agri-iot',
    tags: ['IoT', 'Logistics', 'LoRaWAN', 'แม่สอด', 'เกษตรอัจฉริยะ', 'ทวิภาคี'],
    featured: true,
    award: 'รางวัลชนะเลิศอันดับ 1 สิ่งประดิษฐ์คนรุ่นใหม่ ระดับภาคเหนือ ประจำปี 2567',
    status: 'published',
    publishedAt: '2025-02-15T10:00:00Z',
    viewsCount: 428,
  },
  {
    id: 'proj-002',
    projectId: 'MSCC-2567-AUTO-02',
    title: 'ชุดดัดแปลงรถจักรยานยนต์เครื่องยนต์สันดาปเป็นยานยนต์ไฟฟ้าพลังงานแสงอาทิตย์ (Solar-EV Bike)',
    slug: 'solar-ev-conversion-bike',
    departmentId: 'dept-auto',
    departmentName: 'แผนกวิชาช่างยนต์',
    educationLevel: 'ปวช.',
    studySystem: 'ปกติ',
    academicYear: '2567',
    category: 'พลังงานทดแทนและสิ่งแวดล้อม',
    projectType: 'สิ่งประดิษฐ์และนวัตกรรมอาชีวศึกษา',
    abstract: 'การวิจัยและพัฒนาชุดดัดแปลงมอเตอร์ไซค์เก่าเครื่องยนต์ 110cc ให้เป็นระบบขับเคลื่อนด้วยมอเตอร์ไฟฟ้ากระแสตรงไร้แปรงถ่าน (BLDC Hub Motor 2000W) แบตเตอรี่ลิเธียมฟอสเฟต (LiFePO4) พร้อมแผงโซลาร์เซลล์แบบยืดหยุ่นติดตั้งบนตัวรถ สามารถเดินทางได้ระยะทาง 65 กิโลเมตรต่อการชาร์จหนึ่งครั้ง ด้วยต้นทุนการชาร์จเพียง 7 บาท',
    background: 'ปัญหามลพิษทางอากาศและราคาเชื้อเพลิงที่ผันผวน ส่งผลกระทบต่อนักเรียนและประชาชนในเขตเทศบาลนครแม่สอด ทางแผนกวิชาช่างยนต์จึงต้องการส่งเสริมการใช้ยานยนต์พลังงานสะอาดที่ประหยัดและประชาชนสามารถเข้าถึงได้',
    objectives: '1. เพื่อออกแบบโครงสร้างติดตั้งมอเตอร์ไฟฟ้าและกล่องควบคุมสำหรับรถจักรยานยนต์เดิม\n2. เพื่อทดสอบประสิทธิภาพความเร็วและระยะทางในการใช้งานในสภาพถนนเนินเขา\n3. เพื่อประเมินความปลอดภัยตามมาตรฐานกรมการขนส่งทางบก',
    scope: 'ดัดแปลงโครงรถจักรยานยนต์ฮอนด้าเวฟ 110i ใช้อุปกรณ์มอเตอร์ 48V 2000W ความเร็วสูงสุด 70 กม./ชม.',
    methodology: 'ถอดเครื่องยนต์เดิม สร้างขายึดมอเตอร์ฮับล้อหลัง ติดตั้งชุดแบตเตอรี่พร้อมระบบ Battery Management System (BMS) และวงจรสวิตช์ตัดตอนอัตโนมัติ',
    technologies: 'BLDC Motor 2000W, LiFePO4 Battery 48V 30Ah, MPPT Solar Controller, SolidWorks 3D Design',
    results: 'รถทดสอบสามารถทำความเร็วได้ 72 กม./ชม. มีอัตราเร่งที่นุ่มนวล และระบบเบรกทำงานได้อย่างปลอดภัย ผ่านการทดสอบขับขี่ลาดชันสะพานข้ามแม่น้ำเมยได้อย่างราบรื่น',
    benefits: 'ประหยัดค่าเชื้อเพลิงได้มากกว่า 85% เมื่อเทียบกับน้ำมันเบนซิน และลดการปล่อยก๊าซคาร์บอนไดออกไซด์เป็นศูนย์',
    recommendations: 'สามารถพัฒนาต่อยอดเป็นสถานีสลับแบตเตอรี่ (Battery Swapping) ภายในวิทยาลัย',
    members: ['นายวรเมธ คงไทย', 'นายอัศวิน แก้วมณี', 'นายศักดิ์ดา รัตนพงษ์'],
    advisorName: 'อาจารย์วิทยา ชัยภูมิ',
    coverImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80',
    ],
    documents: [
      { id: 'doc-auto-1', name: 'คู่มือการดัดแปลงและผังวงจรไฟฟ้า (PDF)', url: '#', type: 'pdf', size: '6.1 MB' },
      { id: 'doc-auto-2', name: 'ผลการทดสอบแรงบิดและระยะทาง (PDF)', url: '#', type: 'pdf', size: '2.5 MB' },
    ],
    tags: ['EV', 'ช่างยนต์', 'พลังงานแสงอาทิตย์', 'ยานยนต์ไฟฟ้า', 'สิ่งแวดล้อม'],
    featured: true,
    award: 'เหรียญทอง การประกวดสุดยอดนวัตกรรมอาชีวศึกษา ระดับจังหวัดตาก',
    status: 'published',
    publishedAt: '2025-01-20T08:30:00Z',
    viewsCount: 312,
  },
  {
    id: 'proj-003',
    projectId: 'MSCC-2567-ELEC-03',
    title: 'ตู้ควบคุมและให้อาหารสัตว์น้ำพลังงานแสงอาทิตย์ผ่านสมาร์ตโฟนสำหรับกลุ่มวิสาหกิจชุมชน',
    slug: 'smart-aquaculture-feeder-solar',
    departmentId: 'dept-electric',
    departmentName: 'แผนกวิชาช่างไฟฟ้ากำลัง',
    educationLevel: 'ปวส.',
    studySystem: 'ปกติ',
    academicYear: '2567',
    category: 'สิ่งประดิษฐ์และนวัตกรรมอาชีวศึกษา',
    projectType: 'โครงงานพัฒนาชุมชน',
    abstract: 'ระบบให้อาหารปลาอัตโนมัติที่จ่ายไฟด้วยแผงเซลล์แสงอาทิตย์ 150W ควบคุมมอเตอร์เกลียวป้อนอาหารและจานเหวี่ยงกระจายอาหารได้ไกลถึง 8 เมตร พร้อมระบบตรวจวัดค่าออกซิเจนในน้ำ (DO) และตั้งเวลาผ่านสมาร์ตโฟน ช่วยให้เกษตรกรประหยัดเวลาและลดปัญหาอาหารปลาเน่าค้างก้นบ่อ',
    background: 'เกษตรกรผู้เพาะเลี้ยงปลานิลในตำบลแม่ปะ มักประสบปัญหาการให้อาหารไม่สม่ำเสมอและค่าไฟฟ้าราคาสูงในพื้นที่บ่อเลี้ยงที่ห่างไกลโครงข่ายไฟฟ้า แผนกวิชาช่างไฟฟ้ากำลังจึงได้ออกแบบระบบอิสระที่พึ่งพาตนเองได้ด้วยพลังงานสะอาด',
    objectives: '1. เพื่อสร้างเครื่องให้อาหารปลาพลังงานแสงอาทิตย์แบบสแตนด์อโลน\n2. เพื่อพัฒนาระบบควบคุมเวลาและปริมาณผ่านสมาร์ตโฟน\n3. เพื่อส่งเสริมเศรษฐกิจชุมชนตามแนวทางปรัชญาเศรษฐกิจพอเพียง',
    scope: 'สามารถบรรจุอาหารเม็ดได้ 25 กิโลกรัม กระจายอาหารได้ครอบคลุมพื้นที่บ่อขนาด 1 ไร่',
    methodology: 'ออกแบบโครงสร้างถังไฟเบอร์กลาส ติดตั้งแผงโซลาร์เซลล์พร้อมแบตเตอรี่เจล และไมโครคอนโทรลเลอร์ที่รองรับคำสั่งผ่าน Bluetooth และ Wi-Fi',
    technologies: 'Solar 150W, Deep Cycle Battery, Arduino, IoT App, Stainless Steel Screw Feeder',
    results: 'เกษตรกรสามารถลดต้นทุนค่าแรงให้อาหารได้ 100% ปลามีอัตราการเจริญเติบโตสม่ำเสมอขึ้นร้อยละ 18 และค่าคุณภาพน้ำดีขึ้น',
    benefits: 'ช่วยให้เกษตรกรสามารถบริหารจัดการบ่อเลี้ยงจากระยะไกลได้ และลดการสิ้นเปลืองอาหารปลา',
    recommendations: 'สามารถติดตั้งเซนเซอร์กล้องใต้น้ำเพื่อตรวจจับการกินอาหารของปลา',
    members: ['นายพงศธร มณีรัตน์', 'นายธีรภัทร์ ดวงแก้ว'],
    advisorName: 'อาจารย์สมศักดิ์ รุ่งเรือง',
    coverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1000&q=80',
    ],
    documents: [
      { id: 'doc-elec-1', name: 'รายงานโครงงานวิจัยช่างไฟฟ้า (PDF)', url: '#', type: 'pdf', size: '5.2 MB' },
    ],
    tags: ['ไฟฟ้ากำลัง', 'พลังงานแสงอาทิตย์', 'เกษตรอัจฉริยะ', 'Smart Farm', 'ชุมชน'],
    featured: true,
    award: 'รางวัลรองชนะเลิศอันดับ 1 สิ่งประดิษฐ์เพื่อการประกอบอาชีพ',
    status: 'published',
    publishedAt: '2025-01-10T14:00:00Z',
    viewsCount: 245,
  },
  {
    id: 'proj-004',
    projectId: 'MSCC-2567-LOG-04',
    title: 'แอปพลิเคชันบริหารคลังสินค้ารองรับหลายภาษา (ไทย-พม่า-อังกฤษ) สำหรับศูนย์กระจายสินค้าชายแดน',
    slug: 'multilingual-wms-border-trade',
    departmentId: 'dept-logistics',
    departmentName: 'แผนกวิชาการจัดการโลจิสติกส์และซัพพลายเชน',
    educationLevel: 'ปวส.',
    studySystem: 'ทวิภาคี',
    academicYear: '2567',
    category: 'ซอฟต์แวร์ แอปพลิเคชัน และระบบสารสนเทศ',
    projectType: 'นวัตกรรมการบริการและโลจิสติกส์',
    abstract: 'การพัฒนาระบบคลังสินค้าบนมือถือที่รองรับการสแกนบาร์โค้ด QR Code และเปลี่ยนภาษาการทำงานได้ 3 ภาษา เพื่อแก้ปัญหาอุปสรรคทางภาษาของแรงงานในคลังสินค้าชายแดนแม่สอด ช่วยลดข้อผิดพลาดในการหยิบสินค้า (Picking Error) ได้ถึง 94%',
    background: 'คลังสินค้าในเขตพัฒนาเศรษฐกิจพิเศษตากมีแรงงานหลากหลายสัญชาติ การใช้ระบบซอฟต์แวร์ภาษาเดียวทำให้เกิดข้อผิดพลาดในการจัดเก็บและส่งมอบสินค้า',
    objectives: '1. เพื่อพัฒนาแอปพลิเคชัน WMS ที่รองรับภาษาไทย พม่า และอังกฤษ\n2. เพื่อเพิ่มความแม่นยำในการตรวจนับสต็อกสินค้า\n3. เพื่อเชื่อมโยงข้อมูลกับระบบออกใบเสร็จภาษีศุลกากร',
    scope: 'ทดสอบใช้งานกับคลังสินค้าแห้งและสินค้าอุปโภคบริโภคขนาด 2,000 ตร.ม.',
    methodology: 'ออกแบบ User Interface ด้วยหลักการ Universal Design และไอคอนที่เข้าใจง่าย ทดสอบความถูกต้องในการแปลภาษากับกลุ่มผู้ใช้จริง',
    technologies: 'Flutter, Firebase Firestore, Barcode Scanner SDK, Cloud Functions',
    results: 'เวลาในการค้นหาตำแหน่งสินค้าลดลงจากเฉลี่ย 8 นาที เหลือเพียง 1.5 นาทีต่อรายการ',
    benefits: 'เพิ่มประสิทธิภาพการส่งออกสินค้าข้ามแดนและสร้างมาตรฐานการทำงานที่เป็นสากล',
    members: ['นางสาวสุพัตรา บุญทา', 'นางสาวณิชากานต์ พลอยงาม', 'นายคริสโตเฟอร์ มิน'],
    advisorName: 'อาจารย์ดารารัตน์ วงศ์สุวรรณ',
    companyName: 'บริษัท ท่าข้ามแม่สอดคลังสินค้า จำกัด',
    coverImage: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1000&q=80',
    ],
    documents: [
      { id: 'doc-log-1', name: 'คู่มือการปฏิบัติงานคลังสินค้า WMS (PDF)', url: '#', type: 'pdf', size: '3.7 MB' },
    ],
    tags: ['โลจิสติกส์', 'คลังสินค้า', 'ชายแดนแม่สอด', 'ทวิภาคี', 'Multilingual'],
    featured: false,
    award: 'รางวัลนวัตกรรมการบริการ ระดับยอดเยี่ยม อวท.',
    status: 'published',
    publishedAt: '2025-02-01T09:15:00Z',
    viewsCount: 189,
  },
  {
    id: 'proj-005',
    projectId: 'MSCC-2566-ARCH-05',
    title: 'การออกแบบศูนย์เรียนรู้ศิลปวัฒนธรรมชาติพันธุ์แม่สอดด้วยสถาปัตยกรรมไม้ไผ่ประสานดินซีเมนต์',
    slug: 'maesot-ethnic-cultural-center-bamboo',
    departmentId: 'dept-arch',
    departmentName: 'แผนกวิชาสถาปัตยกรรม',
    educationLevel: 'ปวส.',
    studySystem: 'ปกติ',
    academicYear: '2566',
    category: 'สิ่งประดิษฐ์และนวัตกรรมอาชีวศึกษา',
    projectType: 'โครงงานออกแบบสถาปัตยกรรม',
    abstract: 'โครงงานออกแบบสถาปัตยกรรมอาคารสาธารณะที่ผสมผสานเอกลักษณ์ของกลุ่มชาติพันธุ์ในอำเภอแม่สอด ได้แก่ กะเหรี่ยง ม้ง และไทยวน โดยใช้วัสดุก่อสร้างท้องถิ่นที่เป็นมิตรต่อสิ่งแวดล้อม เช่น ไม้ไผ่แช่น้ำยากันมอดร่วมกับบล็อกดินซีเมนต์อัดประสาน เพื่อสร้างอาคารที่มีการระบายอากาศธรรมชาติและประหยัดพลังงาน',
    background: 'แม่สอดเป็นเมืองพหุวัฒนธรรมที่มีความหลากหลายของกลุ่มชาติพันธุ์ แต่ยังขาดพื้นที่ศูนย์กลางในการถ่ายทอดและจัดแสดงภูมิปัญญาท้องถิ่นแก่นักท่องเที่ยวและเยาวชน',
    objectives: '1. เพื่อศึกษาและรวบรวมอัตลักษณ์ทางสถาปัตยกรรมของชนเผ่าในอำเภอแม่สอด\n2. เพื่อสร้างแบบจำลองสถาปัตยกรรม 3 มิติและแบบก่อสร้างสถาปัตยกรรมเขียว\n3. เพื่อเผยแพร่องค์ความรู้การใช้วัสดุท้องถิ่นในการก่อสร้างสมัยใหม่',
    scope: 'พื้นที่โครงการขนาด 4 ไร่ ประกอบด้วยอาคารนิทรรศการ โรงละครกลางแจ้ง และพื้นที่ตลาดวัฒนธรรม',
    methodology: 'ลงพื้นที่สัมภาษณ์ปราชญ์ชาวบ้าน ออกแบบร่างสเกตช์ นำเข้าโปรแกรม Revit เพื่อคำนวณทิศทางแสงแดดและลมธรรมชาติ',
    technologies: 'Autodesk Revit, Lumion, SketchUp, Eco-BIM Simulation',
    results: 'อาคารสามารถลดการพึ่งพาเครื่องปรับอากาศได้ถึง 60% จากการระบายลมแนวตั้งและหลังคาทรงสูง',
    benefits: 'เป็นต้นแบบงานสถาปัตยกรรมอาชีวะที่ส่งเสริมการอนุรักษ์สิ่งแวดล้อมและการท่องเที่ยวเชิงวัฒนธรรม',
    members: ['นายธนกร สุริยะ', 'นางสาวพิมพ์ลภัส แก้วเรือน'],
    advisorName: 'อาจารย์อภิรักษ์ นันทพิชัย',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    ],
    documents: [
      { id: 'doc-arch-1', name: 'เอกสารประกอบแบบสถาปัตยกรรมฉบับสมบูรณ์ (PDF)', url: '#', type: 'pdf', size: '15.2 MB' },
    ],
    tags: ['สถาปัตยกรรม', 'วัฒนธรรมชาติพันธุ์', 'Eco-Design', 'ไม้ไผ่', 'แม่สอด'],
    featured: false,
    award: 'รางวัลดีเด่น ด้านการออกแบบเพื่อความยั่งยืน',
    status: 'published',
    publishedAt: '2024-03-12T11:00:00Z',
    viewsCount: 167,
  },
  {
    id: 'proj-006',
    projectId: 'MSCC-2567-DBT-06',
    title: 'แพลตฟอร์มอีคอมเมิร์ซและคอนเทนต์สตูดิโอส่งเสริมสินค้าผ้าทอกะเหรี่ยงแม่ระมาด-แม่สอด',
    slug: 'karen-woven-cloth-digital-ecommerce',
    departmentId: 'dept-dbt',
    departmentName: 'แผนกวิชาเทคโนโลยีธุรกิจดิจิทัล',
    educationLevel: 'ปวช.',
    studySystem: 'ปกติ',
    academicYear: '2567',
    category: 'แผนธุรกิจและสตาร์ทอัพชุมชน',
    projectType: 'นวัตกรรมธุรกิจดิจิทัล',
    abstract: 'การบูรณาการการสร้างเว็บไซต์ร้านค้าออนไลน์ระบบแค็ตตาล็อกดิจิทัล ระบบสั่งตัดตามสั่ง (Made to Order) และสตูดิโอถ่ายทอดสด Live Streaming เพื่อช่วยกลุ่มสตรีทอผ้าพื้นเมืองบ้านห้วยปลาหลดและแม่ระมาดจำหน่ายสินค้าไปยังตลาดสากล',
    background: 'ผ้าทอกะเหรี่ยงย้อมสีธรรมชาติมีคุณภาพสูงแต่ช่องทางการจัดจำหน่ายเดิมจำกัดอยู่เพียงตลาดริมเมย นักศึกษาจึงใช้วิชาชีพด้านธุรกิจดิจิทัลเพื่อยกระดับมูลค่าสินค้า',
    objectives: '1. เพื่อพัฒนาเว็บไซต์ E-commerce รองรับระบบชำระเงินพร้อมเพย์และบัตรเครดิต\n2. เพื่อสร้างคู่มือการถ่ายภาพสินค้าและการทำการตลาดบน TikTok Shop ให้แก่กลุ่มแม่บ้าน',
    scope: 'ผลิตภัณฑ์ผ้าทอมือ เสื้อกะเหรี่ยงประยุกต์ และกระเป๋าผ้า จำนวน 40 รายการ',
    methodology: 'ออกแบบเว็บ จัดเวิร์กช็อปสอนการไลฟ์สดและการแพ็กเกจสินค้าที่ได้มาตรฐาน',
    technologies: 'Next.js, Tailwind CSS, Stripe/PromptPay API, Canva Pro, OBS Studio',
    results: 'สร้างยอดขายให้กลุ่มทอผ้าเพิ่มขึ้นมากกว่า 120,000 บาท ในช่วงการจัดนิทรรศการและเทศกาลปีใหม่',
    benefits: 'กระจายรายได้สู่ชุมชนฐานรากและส่งเสริมเยาวชนให้เห็นคุณค่าของผ้าทอโบราณ',
    members: ['นางสาวกัญญารัตน์ แซ่ม้า', 'นางสาวศศิธร เจริญผล', 'นายพีรพัฒน์ มีสุข'],
    advisorName: 'อาจารย์ศิรินทิพย์ ภัทรเดชากุล',
    coverImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1000&q=80',
    ],
    documents: [
      { id: 'doc-dbt-1', name: 'แผนธุรกิจและการตลาดดิจิทัล (PDF)', url: '#', type: 'pdf', size: '4.1 MB' },
    ],
    tags: ['ธุรกิจดิจิทัล', 'ผ้าทอกะเหรี่ยง', 'E-commerce', 'OTOP', 'แม่สอด'],
    featured: false,
    status: 'published',
    publishedAt: '2025-01-28T16:00:00Z',
    viewsCount: 204,
  },
];

// Database Functions
export async function fetchDepartments(): Promise<Department[]> {
  try {
    const colRef = collection(db, 'departments');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      return [];
    }
    const depts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Department));
    return depts.sort((a, b) => a.order - b.order);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'departments');
  }
}

export async function fetchProjects(includeDrafts = false): Promise<Project[]> {
  try {
    const colRef = collection(db, 'projects');
    const q = includeDrafts
      ? query(colRef, orderBy('createdAt', 'desc'))
      : query(colRef, where('status', '==', 'published'));

    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'projects');
  }
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  try {
    const docRef = doc(db, 'projects', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Project;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `projects/${id}`);
  }
}

export async function recordProjectView(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'projects', id);
    await updateDoc(docRef, {
      viewsCount: increment(1),
    });
  } catch {
    // Non-blocking view counter update
  }
}

export async function saveProject(project: Partial<Project> & { id: string }): Promise<void> {
  try {
    const docRef = doc(db, 'projects', project.id);
    const existingSnap = await getDoc(docRef);
    const now = new Date().toISOString();

    if (existingSnap.exists()) {
      await updateDoc(docRef, {
        ...project,
        updatedAt: now,
      });
    } else {
      await setDoc(docRef, {
        ...project,
        viewsCount: project.viewsCount || 0,
        createdAt: now,
        updatedAt: now,
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `projects/${project.id}`);
  }
}

export async function deleteProjectById(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'projects', id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `projects/${id}`);
  }
}

export async function saveDepartment(dept: Department): Promise<void> {
  try {
    const docRef = doc(db, 'departments', dept.id);
    const now = new Date().toISOString();
    await setDoc(docRef, {
      ...dept,
      updatedAt: now,
      createdAt: dept.createdAt || now,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `departments/${dept.id}`);
  }
}

export async function deleteDepartmentById(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'departments', id);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `departments/${id}`);
  }
}

export async function fetchAcademicYears(): Promise<AcademicYear[]> {
  try {
    const colRef = collection(db, 'academicYears');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return [];
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as AcademicYear));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'academicYears');
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const colRef = collection(db, 'categories');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return [];
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'categories');
  }
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, 'settings', 'general');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as SiteSettings;
    }
    return INITIAL_SETTINGS;
  } catch {
    return INITIAL_SETTINGS;
  }
}

export async function updateSiteSettings(settings: SiteSettings): Promise<void> {
  try {
    const docRef = doc(db, 'settings', 'general');
    await setDoc(docRef, settings);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'settings/general');
  }
}

// Master Initial Seeder Function
export async function seedInitialDatabase(): Promise<{ departments: number; projects: number }> {
  try {
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    // 1. Departments
    for (const d of INITIAL_DEPARTMENTS) {
      const docRef = doc(db, 'departments', d.id);
      batch.set(docRef, { ...d, createdAt: now, updatedAt: now });
    }

    // 2. Academic Years
    for (const y of INITIAL_ACADEMIC_YEARS) {
      const docRef = doc(db, 'academicYears', y.id);
      batch.set(docRef, y);
    }

    // 3. Categories
    for (const c of INITIAL_CATEGORIES) {
      const docRef = doc(db, 'categories', c.id);
      batch.set(docRef, c);
    }

    // 4. Settings
    const settingsRef = doc(db, 'settings', 'general');
    batch.set(settingsRef, INITIAL_SETTINGS);

    // 5. Projects
    for (const p of INITIAL_PROJECTS) {
      const docRef = doc(db, 'projects', p.id);
      batch.set(docRef, { ...p, createdAt: now, updatedAt: now });
    }

    await batch.commit();
    return { departments: INITIAL_DEPARTMENTS.length, projects: INITIAL_PROJECTS.length };
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'batch-seed');
  }
}
