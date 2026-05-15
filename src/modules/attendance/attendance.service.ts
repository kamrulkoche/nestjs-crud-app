import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecord } from '../../entities/attendance.entity';
import { BatchAttendanceDto } from './dto/batch-attendance.dto';

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);

  constructor(
    @InjectRepository(AttendanceRecord)
    private readonly repo: Repository<AttendanceRecord>,
  ) {}

  findForDate(teacherId: number, className: string, date: string) {
    return this.repo.find({
      where: { teacherId, className, date },
    });
  }

  findAllForTeacher(teacherId: number) {
    return this.repo.find({
      where: { teacherId },
      order: { date: 'DESC' },
    });
  }

  async batchUpsert(dto: BatchAttendanceDto, teacherId: number) {
    if (!dto.entries || dto.entries.length === 0) {
      return [];
    }

    try {
      const rows = dto.entries.map((e) => ({
        teacherId,
        className: dto.className,
        date: dto.date,
        studentId: e.studentId,
        status: e.status,
      }));

      // Native INSERT ... ON CONFLICT ... DO UPDATE
      // Conflict target matches the unique index on (className, studentId, date)
      await this.repo.upsert(rows, {
        conflictPaths: ['className', 'studentId', 'date'],
        skipUpdateIfNoValuesChanged: true,
      });

      return this.findForDate(teacherId, dto.className, dto.date);
    } catch (err) {
      this.logger.error(
        `Failed to upsert attendance for class ${dto.className}, date ${dto.date}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }

  async clear(teacherId: number, className: string, date: string) {
    await this.repo.delete({ teacherId, className, date });
    return { cleared: true };
  }
}
