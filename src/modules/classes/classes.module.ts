import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassRoom } from '../../entities/class.entity';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClassRoom])],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
