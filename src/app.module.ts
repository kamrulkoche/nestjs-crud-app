import { Module } from '@nestjs/common';
import { AppController } from './modules/app.controller';
import { AppService } from './services/app.service';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
