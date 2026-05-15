import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/role.enum';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentsService } from './students.service';

@ApiTags('students')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(Role.TEACHER)
  create(
    @Body() dto: CreateStudentDto,
    @Request() req: { user: { id: number } },
  ) {
    return this.studentsService.create(dto, req.user.id);
  }

  @Get()
  @Roles(Role.TEACHER)
  findAll() {
    return this.studentsService.findAll();
  }

  @Get('admin/all')
  @Roles(Role.ADMIN)
  findAllForAdmin() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.remove(id);
  }
}
