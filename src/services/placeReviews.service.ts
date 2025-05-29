import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfanityClient } from 'src/clients/ProfanityClient/profanity.client';
import { Place } from 'src/entities/place.entity';
import { PlaceReview } from 'src/entities/placeReview.entity';
import { User } from 'src/entities/user.entity';
import { CreatePlaceReviewPayload } from 'src/types/requestBody/createPlaceReviewPayload.dto';
import { GetPlaceReviewsResource } from 'src/types/response/getPlaceReviewsResource.dto';
import { mapPlaceReviewToPlaceReviewResource } from 'src/utils/mappers/mapPlaceReviewToPlaceReviewResource';
import { Repository } from 'typeorm';

@Injectable()
export class PlaceReviewsService {
  constructor(
    @InjectRepository(PlaceReview)
    private placeReviewsRepository: Repository<PlaceReview>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Place)
    private placesRepository: Repository<Place>,
    private profanityClient: ProfanityClient,
  ) {}

  async createPlaceReview(
    payload: CreatePlaceReviewPayload,
    userId: string,
  ): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new InternalServerErrorException();
    }

    const place = await this.placesRepository.findOneBy({
      googlePlaceId: payload.googlePlaceId,
    });
    if (!place) {
      throw new InternalServerErrorException();
    }

    const profanityCheck = await this.profanityClient.verify(payload.content);
    if (profanityCheck.isProfanity) {
      throw new BadRequestException();
    }

    const review = new PlaceReview();
    review.content = payload.content;
    review.place = place;
    review.user = user;
    await this.placeReviewsRepository.save(review);
  }

  async findAllForPlace(
    googlePlaceId: string,
  ): Promise<GetPlaceReviewsResource> {
    const place = await this.placesRepository.findOneBy({
      googlePlaceId: googlePlaceId,
    });
    if (!place) {
      return { items: [] };
    }

    const reviews = await this.placeReviewsRepository.find({
      where: { placeId: place.id },
      relations: { user: true },
    });

    return { items: reviews.map(mapPlaceReviewToPlaceReviewResource) };
  }
}
