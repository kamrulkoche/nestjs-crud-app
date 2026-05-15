import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from '../../entities/assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly repo: Repository<Assignment>,
  ) {}

  create(dto: CreateAssignmentDto, teacherId: number) {
    const a = this.repo.create({ ...dto, teacherId });
    return this.repo.save(a);
  }

  findAllForTeacher(teacherId: number) {
    return this.repo.find({
      where: { teacherId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, teacherId: number) {
    const a = await this.repo.findOne({ where: { id, teacherId } });
    if (!a) {
      throw new NotFoundException(`Assignment with id ${id} not found`);
    }
    return a;
  }

  async update(id: number, dto: UpdateAssignmentDto, teacherId: number) {
    const a = await this.findOne(id, teacherId);
    Object.assign(a, dto);
    return this.repo.save(a);
  }

  async remove(id: number, teacherId: number) {
    const result = await this.repo.delete({ id, teacherId });
    if (result.affected === 0) {
      throw new NotFoundException(`Assignment with id ${id} not found`);
    }
    return { deleted: true };
  }
}
