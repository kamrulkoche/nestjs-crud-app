import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Student } from '../../entities/student.entity';
import { Teacher } from '../../entities/teacher.entity';
import { LoginTeacherDto } from './dto/login-teacher.dto';
import { RegisterTeacherDto } from './dto/register-teacher.dto';
import { LoginStudentDto } from './dto/login-student.dto';
import { Role } from './role.enum';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { AuthAccount } from '../../interfaces/auth-account.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterTeacherDto) {
    const existing = await this.teacherRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('A teacher with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const teacher = this.teacherRepository.create({
      name: dto.name,
      email: dto.email,
      password: passwordHash,
    });
    await this.teacherRepository.save(teacher);

    return this.buildAuthResponse(teacher, Role.TEACHER);
  }

  async login(dto: LoginTeacherDto) {
    const teacher = await this.teacherRepository.findOne({
      where: { email: dto.email },
    });
    return this.verifyAndIssue(teacher, dto.password, Role.TEACHER);
  }

  async studentLogin(dto: LoginStudentDto) {
    const student = await this.studentRepository.findOne({
      where: { email: dto.email },
    });
    return this.verifyAndIssue(student, dto.password, Role.STUDENT);
  }

  private async verifyAndIssue(
    account: AuthAccount | null,
    password: string,
    role: Role,
  ) {
    if (!account) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(password, account.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(account, role);
  }

  private buildAuthResponse(account: AuthAccount, role: Role) {
    const payload: JwtPayload = {
      sub: account.id,
      email: account.email,
      role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        role,
      },
    };
  }
}
