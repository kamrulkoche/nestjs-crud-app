import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from '../../entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly repo: Repository<Announcement>,
  ) {}

  create(dto: CreateAnnouncementDto, teacherId: number) {
    const a = this.repo.create({
      ...dto,
      targetClass: dto.targetClass ?? 'all',
      teacherId,
    });
    return this.repo.save(a);
  }

  findAllForTeacher(teacherId: number) {
    return this.repo.find({
      where: { teacherId },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number, teacherId: number) {
    const result = await this.repo.delete({ id, teacherId });
    if (result.affected === 0) {
      throw new NotFoundException(`Announcement with id ${id} not found`);
    }
    return { deleted: true };
  }
}
