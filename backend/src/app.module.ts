import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { CrmModule } from './crm/crm.module';

@Module({
  imports: [AuthModule, UsersModule, ProjectsModule, CrmModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
