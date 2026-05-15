import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/role.enum';
import { AttendanceService } from './attendance.service';
import { BatchAttendanceDto } from './dto/batch-attendance.dto';

type AuthedReq = { user: { id: number } };

@ApiTags('attendance')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TEACHER)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Get()
  findForDate(
    @Query('className') className: string,
    @Query('date') date: string,
    @Request() req: AuthedReq,
  ) {
    if (!className || !date) {
      return this.service.findAllForTeacher(req.user.id);
    }
    return this.service.findForDate(req.user.id, className, date);
  }

  @Post('batch')
  batch(@Body() dto: BatchAttendanceDto, @Request() req: AuthedReq) {
    return this.service.batchUpsert(dto, req.user.id);
  }

  @Delete()
  clear(
    @Query('className') className: string,
    @Query('date') date: string,
    @Request() req: AuthedReq,
  ) {
    return this.service.clear(req.user.id, className, date);
  }
}
