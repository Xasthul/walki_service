import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitedPlacesController } from 'src/controllers/visitedPlaces.controller';
import { User } from 'src/entities/user.entity';
import { VisitedPlace } from 'src/entities/visitedPlace.entity';
import { VisitedPlacesService } from 'src/services/visitedPlaces.service';

@Module({
  imports: [TypeOrmModule.forFeature([VisitedPlace, User])],
  providers: [VisitedPlacesService],
  controllers: [VisitedPlacesController],
})
export class VisitedPlacesModule {}
