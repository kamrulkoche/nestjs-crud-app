import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from '../../entities/grade.entity';
import { BatchGradesDto } from './dto/batch-grades.dto';

@Injectable()
export class GradesService {
  private readonly logger = new Logger(GradesService.name);

  constructor(
    @InjectRepository(Grade)
    private readonly repo: Repository<Grade>,
  ) {}

  findForClass(teacherId: number, className: string) {
    return this.repo.find({
      where: { teacherId, className },
    });
  }

  findAllForTeacher(teacherId: number) {
    return this.repo.find({
      where: { teacherId },
    });
  }

  async batchUpsert(dto: BatchGradesDto, teacherId: number) {
    if (!dto.entries || dto.entries.length === 0) return [];

    try {
      const rows = dto.entries.map((e) => ({
        teacherId,
        className: dto.className,
        category: e.category,
        studentId: e.studentId,
        score: e.score,
      }));

      await this.repo.upsert(rows, {
        conflictPaths: ['className', 'category', 'studentId'],
        skipUpdateIfNoValuesChanged: true,
      });

      return this.findForClass(teacherId, dto.className);
    } catch (err) {
      this.logger.error(
        `Failed to upsert grades for class ${dto.className}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }

  async clear(teacherId: number, className: string) {
    await this.repo.delete({ teacherId, className });
    return { cleared: true };
  }
}
