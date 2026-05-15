import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './modules/app.controller';
import { AppService } from './services/app.service';
import { AuthModule } from './modules/auth/auth.module';
import { StudentsModule } from './modules/students/students.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { NoticesModule } from './modules/notices/notices.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SeedModule } from './modules/seed/seed.module';
import { ClassesModule } from './modules/classes/classes.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { GradesModule } from './modules/grades/grades.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { Teacher } from './entities/teacher.entity';
import { Student } from './entities/student.entity';
import { Admin } from './entities/admin.entity';
import { Department } from './entities/department.entity';
import { Notice } from './entities/notice.entity';
import { Setting } from './entities/setting.entity';
import { ClassRoom } from './entities/class.entity';
import { Assignment } from './entities/assignment.entity';
import { AttendanceRecord } from './entities/attendance.entity';
import { Grade } from './entities/grade.entity';
import { Announcement } from './entities/announcement.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [
          Teacher,
          Student,
          Admin,
          Department,
          Notice,
          Setting,
          ClassRoom,
          Assignment,
          AttendanceRecord,
          Grade,
          Announcement,
        ],
        synchronize: true,
      }),
    }),
    AuthModule,
    StudentsModule,
    DepartmentsModule,
    NoticesModule,
    TeachersModule,
    SettingsModule,
    SeedModule,
    ClassesModule,
    AssignmentsModule,
    AttendanceModule,
    GradesModule,
    AnnouncementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
