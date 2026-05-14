import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Teacher } from '../../entities/teacher.entity';
import { LoginTeacherDto } from './dto/login-teacher.dto';
import { RegisterTeacherDto } from './dto/register-teacher.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
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

    return this.buildAuthResponse(teacher);
  }

  async login(dto: LoginTeacherDto) {
    const teacher = await this.teacherRepository.findOne({
      where: { email: dto.email },
    });
    if (!teacher) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      teacher.password,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(teacher);
  }

  private buildAuthResponse(teacher: Teacher) {
    const payload: JwtPayload = { sub: teacher.id, email: teacher.email };
    return {
      accessToken: this.jwtService.sign(payload),
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
      },
    };
  }
}
