import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginTeacherDto } from './dto/login-teacher.dto';
import { RegisterTeacherDto } from './dto/register-teacher.dto';
import { LoginStudentDto } from './dto/login-student.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Role } from './role.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('teacher/register')
  registerTeacher(@Body() dto: RegisterTeacherDto) {
    return this.authService.register(dto);
  }

  @Post('teacher/login')
  @HttpCode(HttpStatus.OK)
  loginTeacher(@Body() dto: LoginTeacherDto) {
    return this.authService.login(dto);
  }

  @Post('student/login')
  @HttpCode(HttpStatus.OK)
  loginStudent(@Body() dto: LoginStudentDto) {
    return this.authService.studentLogin(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  me(
    @Request()
    req: {
      user: { id: number; email: string; role: Role };
    },
  ) {
    return req.user;
  }
}
