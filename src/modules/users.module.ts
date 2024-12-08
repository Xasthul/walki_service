import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfanityClient } from 'src/clients/ProfanityClient/profanity.client';
import { UsersController } from 'src/controllers/users.controller';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, ProfanityClient],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
