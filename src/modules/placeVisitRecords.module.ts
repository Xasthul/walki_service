import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceVisitRecordsController } from 'src/controllers/placeVisitRecords.controller';
import { User } from 'src/entities/user.entity';
import { PlaceVisitRecord } from 'src/entities/placeVisitRecord.entity';
import { PlaceVisitRecordsService } from 'src/services/placeVisitRecords.service';
import { Place } from 'src/entities/place.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceVisitRecord, User, Place])],
  providers: [PlaceVisitRecordsService],
  controllers: [PlaceVisitRecordsController],
})
export class PlaceVisitRecordsModule {}
