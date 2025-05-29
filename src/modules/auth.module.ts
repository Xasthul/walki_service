import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { AuthService } from 'src/services/auth.service';
import { AuthController } from 'src/controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from 'src/entities/refreshToken.entity';
import { JwtStrategy } from 'src/guards/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    UsersModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
