import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../../entities/student.entity';
import { Teacher } from '../../entities/teacher.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async findAll() {
    const teachers = await this.teacherRepository.find({
      order: { createdAt: 'DESC' },
    });
    return Promise.all(
      teachers.map(async (t) => {
        const studentCount = await this.studentRepository.count({
          where: { teacherId: t.id },
        });
        return {
          id: t.id,
          name: t.name,
          email: t.email,
          createdAt: t.createdAt,
          studentCount,
        };
      }),
    );
  }

  async findOne(id: number) {
    const teacher = await this.teacherRepository.findOne({ where: { id } });
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }
    const studentCount = await this.studentRepository.count({
      where: { teacherId: id },
    });
    return {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      createdAt: teacher.createdAt,
      studentCount,
    };
  }

  async remove(id: number) {
    const result = await this.teacherRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }
    return { deleted: true };
  }
}
