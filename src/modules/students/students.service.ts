import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Student } from '../../entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(dto: CreateStudentDto, teacherId: number) {
    const existing = await this.studentRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('A student with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const student = this.studentRepository.create({
      name: dto.name,
      email: dto.email,
      password: passwordHash,
      teacherId,
    });
    const saved = await this.studentRepository.save(student);
    return this.toResponse(saved);
  }

  async findAll() {
    const students = await this.studentRepository.find();
    return students.map((student) => this.toResponse(student));
  }

  async findOne(id: number) {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    return this.toResponse(student);
  }

  async remove(id: number) {
    const result = await this.studentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    return { deleted: true };
  }

  private toResponse(student: Student) {
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      teacherId: student.teacherId,
      createdAt: student.createdAt,
    };
  }
}
