import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/role.enum';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

type AuthedReq = { user: { id: number } };

@ApiTags('classes')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.TEACHER)
@Controller('classes')
export class ClassesController {
  constructor(private readonly service: ClassesService) {}

  @Post()
  create(@Body() dto: CreateClassDto, @Request() req: AuthedReq) {
    return this.service.create(dto, req.user.id);
  }

  @Get()
  findAll(@Request() req: AuthedReq) {
    return this.service.findAllForTeacher(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: AuthedReq) {
    return this.service.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClassDto,
    @Request() req: AuthedReq,
  ) {
    return this.service.update(id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: AuthedReq) {
    return this.service.remove(id, req.user.id);
  }
}
