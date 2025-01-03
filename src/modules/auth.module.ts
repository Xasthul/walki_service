import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { AuthService } from 'src/services/auth.service';
import { AuthController } from 'src/controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from 'src/entities/refreshToken.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
