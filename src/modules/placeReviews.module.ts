import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceReviewsController } from 'src/controllers/placeReviews.controller';
import { Place } from 'src/entities/place.entity';
import { PlaceReview } from 'src/entities/placeReview.entity';
import { User } from 'src/entities/user.entity';
import { PlaceReviewsService } from 'src/services/placeReviews.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceReview, User, Place])],
  providers: [PlaceReviewsService],
  controllers: [PlaceReviewsController],
})
export class PlaceReviewsModule {}
