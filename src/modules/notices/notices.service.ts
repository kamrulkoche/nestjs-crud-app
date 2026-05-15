import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notice } from '../../entities/notice.entity';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

  create(dto: CreateNoticeDto) {
    const notice = this.noticeRepository.create({
      ...dto,
      publishedAt: dto.published === false ? undefined : new Date(),
    });
    return this.noticeRepository.save(notice);
  }

  findAllPublic() {
    return this.noticeRepository.find({
      where: { published: true },
      order: { createdAt: 'DESC' },
    });
  }

  findAll() {
    return this.noticeRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    if (!notice) {
      throw new NotFoundException(`Notice with id ${id} not found`);
    }
    return notice;
  }

  async update(id: number, dto: UpdateNoticeDto) {
    const notice = await this.findOne(id);
    if (dto.published === true && !notice.publishedAt) {
      notice.publishedAt = new Date();
    }
    Object.assign(notice, dto);
    return this.noticeRepository.save(notice);
  }

  async remove(id: number) {
    const result = await this.noticeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Notice with id ${id} not found`);
    }
    return { deleted: true };
  }
}
