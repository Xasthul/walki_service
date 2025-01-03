import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from 'src/controllers/admin.controller';
import { SuperUser } from 'src/entities/superUser.entity';
import { User } from 'src/entities/user.entity';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { SessionSerializer } from 'src/strategies/sessionSerializer';
import { AdminService } from 'src/services/admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SuperUser]),
    PassportModule.register({ session: true }),
  ],
  providers: [AdminService, LocalStrategy, SessionSerializer],
  controllers: [AdminController],
})
export class AdminModule {}
