import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../../entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(dto: CreateDepartmentDto) {
    const existing = await this.departmentRepository.findOne({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException(
        `A department with slug "${dto.slug}" already exists`,
      );
    }
    const dept = this.departmentRepository.create(dto);
    return this.departmentRepository.save(dept);
  }

  findAll() {
    return this.departmentRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number) {
    const dept = await this.departmentRepository.findOne({ where: { id } });
    if (!dept) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }
    return dept;
  }

  async findBySlug(slug: string) {
    const dept = await this.departmentRepository.findOne({ where: { slug } });
    if (!dept) {
      throw new NotFoundException(`Department "${slug}" not found`);
    }
    return dept;
  }

  async update(id: number, dto: UpdateDepartmentDto) {
    const dept = await this.findOne(id);
    Object.assign(dept, dto);
    return this.departmentRepository.save(dept);
  }

  async remove(id: number) {
    const result = await this.departmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }
    return { deleted: true };
  }
}
