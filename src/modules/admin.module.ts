import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from 'src/controllers/admin.controller';
import { Place } from 'src/entities/place.entity';
import { SuperUser } from 'src/entities/superUser.entity';
import { User } from 'src/entities/user.entity';
import { JwtStrategy } from 'src/guards/jwt.strategy';
import { AdminService } from 'src/services/admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Place, SuperUser]),
    PassportModule.register({ session: true }),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy],
})
export class AdminModule {}
