import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from 'src/controllers/admin.controller';
import { SuperUser } from 'src/entities/superUser.entity';
import { SuperUserRefreshToken } from 'src/entities/superUserRefreshToken.entity';
import { User } from 'src/entities/user.entity';
import { AdminService } from 'src/services/admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, SuperUser, SuperUserRefreshToken])],
  providers: [AdminService, JwtService],
  controllers: [AdminController],
})
export class AdminModule {}
