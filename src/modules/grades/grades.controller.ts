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
import { GradesService } from './grades.service';
import { BatchGradesDto } from './dto/batch-grades.dto';

type AuthedReq = { user: { id: number } };

@ApiTags('grades')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TEACHER)
@Controller('grades')
export class GradesController {
  constructor(private readonly service: GradesService) {}

  @Get()
  find(
    @Query('className') className: string | undefined,
    @Request() req: AuthedReq,
  ) {
    if (className) {
      return this.service.findForClass(req.user.id, className);
    }
    return this.service.findAllForTeacher(req.user.id);
  }

  @Post('batch')
  batch(@Body() dto: BatchGradesDto, @Request() req: AuthedReq) {
    return this.service.batchUpsert(dto, req.user.id);
  }

  @Delete()
  clear(
    @Query('className') className: string,
    @Request() req: AuthedReq,
  ) {
    return this.service.clear(req.user.id, className);
  }
}
