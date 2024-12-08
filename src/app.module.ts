import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './typeOrmConfig';
import { UsersModule } from './modules/users.module';
import { PlaceVisitRecordsModule } from './modules/placeVisitRecords.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    UsersModule,
    PlaceVisitRecordsModule,
  ],
})
export class AppModule {}
