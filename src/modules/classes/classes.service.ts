import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassRoom } from '../../entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(ClassRoom)
    private readonly repo: Repository<ClassRoom>,
  ) {}

  create(dto: CreateClassDto, teacherId: number) {
    const klass = this.repo.create({ ...dto, teacherId });
    return this.repo.save(klass);
  }

  findAllForTeacher(teacherId: number) {
    return this.repo.find({
      where: { teacherId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: number, teacherId: number) {
    const klass = await this.repo.findOne({ where: { id, teacherId } });
    if (!klass) {
      throw new NotFoundException(`Class with id ${id} not found`);
    }
    return klass;
  }

  async update(id: number, dto: UpdateClassDto, teacherId: number) {
    const klass = await this.findOne(id, teacherId);
    Object.assign(klass, dto);
    return this.repo.save(klass);
  }

  async remove(id: number, teacherId: number) {
    const result = await this.repo.delete({ id, teacherId });
    if (result.affected === 0) {
      throw new NotFoundException(`Class with id ${id} not found`);
    }
    return { deleted: true };
  }
}
