import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Admin } from '../../entities/admin.entity';
import { Announcement } from '../../entities/announcement.entity';
import { Assignment } from '../../entities/assignment.entity';
import { AttendanceRecord } from '../../entities/attendance.entity';
import { ClassRoom } from '../../entities/class.entity';
import { Department } from '../../entities/department.entity';
import { Grade } from '../../entities/grade.entity';
import { Notice, NoticeType } from '../../entities/notice.entity';
import { Student } from '../../entities/student.entity';
import { Teacher } from '../../entities/teacher.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(ClassRoom)
    private readonly classRepository: Repository<ClassRoom>,
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepository: Repository<AttendanceRecord>,
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin();
    await this.seedDepartments();
    await this.seedNotices();
    await this.seedDefaultTeacher();

    // Seed sample data for every teacher who has no data yet.
    const teachers = await this.teacherRepository.find();
    for (const teacher of teachers) {
      const students = await this.seedStudents(teacher.id);
      const classes = await this.seedClasses(teacher.id);
      await this.seedAssignments(teacher.id, classes);
      await this.seedAnnouncements(teacher.id, classes);
      await this.seedAttendance(teacher.id, classes, students);
      await this.seedGrades(teacher.id, classes, students);
    }
  }

  private async seedAdmin() {
    const email =
      this.config.get<string>('ADMIN_DEFAULT_EMAIL') ?? 'admin@varsity.edu';
    const password =
      this.config.get<string>('ADMIN_DEFAULT_PASSWORD') ?? 'Admin@1234';
    const name = this.config.get<string>('ADMIN_DEFAULT_NAME') ?? 'Site Admin';

    if ((await this.adminRepository.count()) > 0) {
      this.logger.log('Admin seed skipped — already exists.');
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await this.adminRepository.save(
      this.adminRepository.create({ name, email, password: passwordHash }),
    );
    this.logger.warn('═══════════════════════════════════════════════════════');
    this.logger.warn('  Default admin account created');
    this.logger.warn(`  Email:    ${email}`);
    this.logger.warn(`  Password: ${password}`);
    this.logger.warn('═══════════════════════════════════════════════════════');
  }

  private async seedDepartments() {
    if ((await this.departmentRepository.count()) > 0) {
      this.logger.log('Departments seed skipped — already exists.');
      return;
    }
    const departments: Partial<Department>[] = [
      {
        name: 'Computer Science & Engineering',
        slug: 'computer-science',
        description:
          'Bachelor and Master programs covering software engineering, AI, data science, networks, and cybersecurity.',
        headName: 'Prof. Dr. M. Anwar Hossain',
      },
      {
        name: 'Electrical & Electronic Engineering',
        slug: 'electrical-engineering',
        description:
          'Power systems, electronics, signal processing, and renewable energy.',
        headName: 'Prof. Dr. Tania Rahman',
      },
      {
        name: 'Business Administration',
        slug: 'bba',
        description:
          'BBA and MBA programs in finance, marketing, HRM, operations, and entrepreneurship.',
        headName: 'Prof. Dr. Sara Khanam',
      },
      {
        name: 'English Literature',
        slug: 'english',
        description:
          'Literature, linguistics, and applied language studies.',
        headName: 'Prof. Tanvir Ahmed',
      },
      {
        name: 'Mathematics',
        slug: 'mathematics',
        description:
          'Pure and applied mathematics from undergraduate to PhD level.',
        headName: 'Dr. Rifat Hossain',
      },
      {
        name: 'Civil Engineering',
        slug: 'civil-engineering',
        description:
          'Structural, geotechnical, environmental, and transportation engineering.',
        headName: 'Prof. Dr. Mahmud Karim',
      },
    ];
    await this.departmentRepository.save(
      departments.map((d) => this.departmentRepository.create(d)),
    );
    this.logger.log(`Seeded ${departments.length} departments.`);
  }

  private async seedNotices() {
    if ((await this.noticeRepository.count()) > 0) {
      this.logger.log('Notices seed skipped — already exists.');
      return;
    }
    const now = Date.now();
    const day = 86_400_000;
    const notices: Partial<Notice>[] = [
      {
        title: 'Fall 2026 admission applications now open',
        body: 'Applications for the Fall 2026 intake are now open across all undergraduate and graduate programs.',
        type: 'admission' as NoticeType,
        published: true,
        publishedAt: new Date(now - 1 * day),
      },
      {
        title: 'Spring 2026 semester begins on February 3',
        body: 'The Spring 2026 semester officially begins on Monday, February 3.',
        type: 'academic' as NoticeType,
        published: true,
        publishedAt: new Date(now - 3 * day),
      },
      {
        title: 'Mid-term examination schedule released',
        body: 'The mid-term examination schedule for all departments has been published.',
        type: 'exam' as NoticeType,
        published: true,
        publishedAt: new Date(now - 5 * day),
      },
      {
        title: 'Campus closed for Eid-ul-Fitr holidays',
        body: 'The campus will remain closed from April 8 to April 14.',
        type: 'holiday' as NoticeType,
        published: true,
        publishedAt: new Date(now - 7 * day),
      },
      {
        title: 'New library hours during exam week',
        body: 'The main library will remain open 24 hours from Monday through Friday.',
        type: 'general' as NoticeType,
        published: true,
        publishedAt: new Date(now - 10 * day),
      },
      {
        title: 'Final semester project submission guidelines',
        body: 'All final-year students must submit their project reports by April 30.',
        type: 'academic' as NoticeType,
        published: true,
        publishedAt: new Date(now - 14 * day),
      },
    ];
    await this.noticeRepository.save(
      notices.map((n) => this.noticeRepository.create(n)),
    );
    this.logger.log(`Seeded ${notices.length} notices.`);
  }

  private async seedDefaultTeacher(): Promise<Teacher | null> {
    const email =
      this.config.get<string>('TEACHER_DEFAULT_EMAIL') ?? 'teacher@varsity.edu';
    const password =
      this.config.get<string>('TEACHER_DEFAULT_PASSWORD') ?? 'Teacher@1234';
    const name =
      this.config.get<string>('TEACHER_DEFAULT_NAME') ?? 'Sara Ahmed';

    const existing = await this.teacherRepository.findOne({ where: { email } });
    if (existing) {
      this.logger.log(`Default teacher already exists (${email}).`);
      return existing;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const teacher = await this.teacherRepository.save(
      this.teacherRepository.create({
        name,
        email,
        password: passwordHash,
      }),
    );
    this.logger.warn('═══════════════════════════════════════════════════════');
    this.logger.warn('  Default teacher account created');
    this.logger.warn(`  Email:    ${email}`);
    this.logger.warn(`  Password: ${password}`);
    this.logger.warn('═══════════════════════════════════════════════════════');
    return teacher;
  }

  private async seedStudents(teacherId: number): Promise<Student[]> {
    const existing = await this.studentRepository.count({
      where: { teacherId },
    });
    if (existing > 0) {
      this.logger.log(
        `Students seed skipped — teacher ${teacherId} already has ${existing} students.`,
      );
      return this.studentRepository.find({ where: { teacherId } });
    }
    // Emails include teacherId to avoid unique conflicts when seeding for
    // multiple teachers. Default teacher (id=1) uses clean emails.
    const suffix = teacherId === 1 ? '' : `+t${teacherId}`;
    const defaults = [
      { name: 'Ayesha Khan', email: `ayesha${suffix}@varsity.edu` },
      { name: 'Rifat Hossain', email: `rifat${suffix}@varsity.edu` },
      { name: 'Maria Sultana', email: `maria${suffix}@varsity.edu` },
      { name: 'Tanvir Ahmed', email: `tanvir${suffix}@varsity.edu` },
      { name: 'Nadia Karim', email: `nadia${suffix}@varsity.edu` },
      { name: 'Omar Faruk', email: `omar${suffix}@varsity.edu` },
      { name: 'Lamia Hossain', email: `lamia${suffix}@varsity.edu` },
      { name: 'Sajjad Rahman', email: `sajjad${suffix}@varsity.edu` },
    ];
    const hash = await bcrypt.hash('Student@1234', 10);
    const saved: Student[] = [];
    for (const s of defaults) {
      const already = await this.studentRepository.findOne({
        where: { email: s.email },
      });
      if (already) {
        saved.push(already);
        continue;
      }
      const student = await this.studentRepository.save(
        this.studentRepository.create({
          name: s.name,
          email: s.email,
          password: hash,
          teacherId,
        }),
      );
      saved.push(student);
    }
    this.logger.log(
      `Seeded ${saved.length} students for teacher ${teacherId} (password: Student@1234).`,
    );
    return saved;
  }

  private async seedClasses(teacherId: number): Promise<ClassRoom[]> {
    const existing = await this.classRepository.count({ where: { teacherId } });
    if (existing > 0) {
      this.logger.log(
        `Classes seed skipped — teacher already has ${existing} classes.`,
      );
      return this.classRepository.find({ where: { teacherId } });
    }
    const palette = [
      'from-blue-500 to-indigo-500',
      'from-purple-500 to-pink-500',
      'from-emerald-500 to-teal-500',
      'from-orange-500 to-amber-500',
    ];
    const defaults: Partial<ClassRoom>[] = [
      {
        name: 'Algebra II',
        grade: 'Grade 10',
        schedule: 'Mon · Wed · Fri · 10:00 AM',
        room: 'Room 204',
        studentCount: 32,
        progress: 68,
        color: palette[0],
      },
      {
        name: 'Physics Fundamentals',
        grade: 'Grade 11',
        schedule: 'Tue · Thu · 11:30 AM',
        room: 'Lab 3',
        studentCount: 24,
        progress: 42,
        color: palette[1],
      },
      {
        name: 'Calculus AP',
        grade: 'Grade 12',
        schedule: 'Mon · Wed · 2:00 PM',
        room: 'Room 301',
        studentCount: 18,
        progress: 81,
        color: palette[2],
      },
      {
        name: 'Pre-Algebra',
        grade: 'Grade 9',
        schedule: 'Tue · Thu · Fri · 9:00 AM',
        room: 'Room 102',
        studentCount: 28,
        progress: 55,
        color: palette[3],
      },
    ];
    const saved = await this.classRepository.save(
      defaults.map((d) =>
        this.classRepository.create({ ...d, teacherId }),
      ),
    );
    this.logger.log(`Seeded ${saved.length} classes.`);
    return saved;
  }

  private async seedAssignments(teacherId: number, classes: ClassRoom[]) {
    const existing = await this.assignmentRepository.count({
      where: { teacherId },
    });
    if (existing > 0) {
      this.logger.log(
        `Assignments seed skipped — teacher already has ${existing}.`,
      );
      return;
    }
    if (classes.length === 0) return;
    const today = new Date();
    const fmtDate = (offsetDays: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().slice(0, 10);
    };
    const defaults: Array<Partial<Assignment>> = [
      {
        title: 'Quadratic Equations — Problem Set 4',
        className: classes[0].name,
        due: fmtDate(5),
        status: 'active',
        submitted: 24,
        total: classes[0].studentCount,
        description: 'Solve problems 1–20 from Chapter 7.',
      },
      {
        title: 'Newton’s Laws Lab Report',
        className: classes[1]?.name ?? classes[0].name,
        due: fmtDate(3),
        status: 'graded',
        submitted: classes[1]?.studentCount ?? 24,
        total: classes[1]?.studentCount ?? 24,
        description: 'Submit a full lab report including hypothesis, method, results, discussion.',
      },
      {
        title: 'Integration Techniques Quiz',
        className: classes[2]?.name ?? classes[0].name,
        due: fmtDate(7),
        status: 'active',
        submitted: 12,
        total: classes[2]?.studentCount ?? 18,
        description: 'Closed-book quiz on integration by parts and substitution.',
      },
      {
        title: 'Linear Equations Worksheet',
        className: classes[3]?.name ?? classes[0].name,
        due: fmtDate(10),
        status: 'draft',
        submitted: 0,
        total: classes[3]?.studentCount ?? 28,
        description: 'Practice worksheet — not yet published to students.',
      },
    ];
    await this.assignmentRepository.save(
      defaults.map((a) =>
        this.assignmentRepository.create({ ...a, teacherId }),
      ),
    );
    this.logger.log(`Seeded ${defaults.length} assignments.`);
  }

  private async seedAnnouncements(teacherId: number, classes: ClassRoom[]) {
    const existing = await this.announcementRepository.count({
      where: { teacherId },
    });
    if (existing > 0) {
      this.logger.log(
        `Announcements seed skipped — teacher already has ${existing}.`,
      );
      return;
    }
    const defaults: Partial<Announcement>[] = [
      {
        title: 'Reminder: bring calculators tomorrow',
        body: 'Tomorrow’s physics quiz allows scientific calculators only. No graphing calculators.',
        targetClass: classes[1]?.name ?? 'all',
      },
      {
        title: 'Office hours moved',
        body: 'My Thursday office hours are now 4pm – 6pm in Room 204.',
        targetClass: 'all',
      },
      {
        title: 'Homework deadline extended',
        body: 'The Algebra II problem set 4 deadline is extended to Friday at 11:59pm.',
        targetClass: classes[0]?.name ?? 'all',
      },
    ];
    await this.announcementRepository.save(
      defaults.map((a) =>
        this.announcementRepository.create({ ...a, teacherId }),
      ),
    );
    this.logger.log(`Seeded ${defaults.length} announcements.`);
  }

  private async seedAttendance(
    teacherId: number,
    classes: ClassRoom[],
    students: Student[],
  ) {
    const existing = await this.attendanceRepository.count({
      where: { teacherId },
    });
    if (existing > 0) {
      this.logger.log(
        `Attendance seed skipped — already has ${existing} records.`,
      );
      return;
    }
    if (classes.length === 0 || students.length === 0) return;

    const today = new Date();
    const fmtDate = (offsetDays: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() - offsetDays);
      return d.toISOString().slice(0, 10);
    };
    const klass = classes[0].name;
    const statuses: Array<'present' | 'absent' | 'late'> = [
      'present',
      'present',
      'present',
      'late',
      'absent',
    ];
    const records: Partial<AttendanceRecord>[] = [];
    // Seed 3 days of attendance for the first class
    for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
      const date = fmtDate(dayOffset);
      students.forEach((s, i) => {
        records.push({
          className: klass,
          studentId: s.id,
          date,
          status: statuses[(i + dayOffset) % statuses.length],
          teacherId,
        });
      });
    }
    await this.attendanceRepository.save(
      records.map((r) => this.attendanceRepository.create(r)),
    );
    this.logger.log(
      `Seeded ${records.length} attendance records for ${klass}.`,
    );
  }

  private async seedGrades(
    teacherId: number,
    classes: ClassRoom[],
    students: Student[],
  ) {
    const existing = await this.gradeRepository.count({ where: { teacherId } });
    if (existing > 0) {
      this.logger.log(`Grades seed skipped — already has ${existing} records.`);
      return;
    }
    if (classes.length === 0 || students.length === 0) return;

    const klass = classes[0].name;
    const categories = ['Quiz 1', 'Quiz 2', 'Midterm', 'Project'];
    const records: Partial<Grade>[] = [];
    students.forEach((s, i) => {
      categories.forEach((c, j) => {
        // Distribute scores 60–100 deterministically
        const score = 60 + ((i * 7 + j * 11) % 41);
        records.push({
          className: klass,
          category: c,
          studentId: s.id,
          score,
          teacherId,
        });
      });
    });
    await this.gradeRepository.save(
      records.map((r) => this.gradeRepository.create(r)),
    );
    this.logger.log(`Seeded ${records.length} grade records for ${klass}.`);
  }
}
