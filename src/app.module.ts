import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './typeOrmConfig';
import { UsersModule } from './modules/users.module';
import { PlaceVisitRecordsModule } from './modules/placeVisitRecords.module';
import { PlaceReviewsModule } from './modules/placeReviews.module';
import { HttpModule } from '@nestjs/axios';
import { AdminModule } from './modules/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    HttpModule.register({ global: true }),
    AuthModule,
    UsersModule,
    PlaceVisitRecordsModule,
    PlaceReviewsModule,
    AdminModule,
  ],
})
export class AppModule {}
