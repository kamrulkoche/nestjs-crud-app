import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../../entities/admin.entity';
import { Department } from '../../entities/department.entity';
import { Notice } from '../../entities/notice.entity';
import { Teacher } from '../../entities/teacher.entity';
import { Student } from '../../entities/student.entity';
import { ClassRoom } from '../../entities/class.entity';
import { Assignment } from '../../entities/assignment.entity';
import { Announcement } from '../../entities/announcement.entity';
import { AttendanceRecord } from '../../entities/attendance.entity';
import { Grade } from '../../entities/grade.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      Department,
      Notice,
      Teacher,
      Student,
      ClassRoom,
      Assignment,
      Announcement,
      AttendanceRecord,
      Grade,
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
