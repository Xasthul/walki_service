import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PlaceVisitRecord } from 'src/entities/placeVisitRecord.entity';
import { GetVisitedPlacesQueryParam } from 'src/types/queryParams/getVisitedPlacesQueryParam.dto';
import { CreatePlaceVisitRecordPayload } from 'src/types/requestBody/createPlaceVisitRecordPayload.dto';
import { GetPlaceVisitRecordsResource } from 'src/types/response/getPlaceVisitRecordsResource.dto';
import { mapPlaceVisitRecordToPlaceVisitRecordResource } from 'src/utils/mappers/mapPlaceVisitRecordToPlaceVisitRecordResource.dto';
import { Repository } from 'typeorm';
import { Place } from 'src/entities/place.entity';

@Injectable()
export class PlaceVisitRecordsService {
  constructor(
    @InjectRepository(PlaceVisitRecord)
    private placeVisitRecordsRepository: Repository<PlaceVisitRecord>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Place)
    private placesRepository: Repository<Place>,
  ) {}

  async createPlaceVisitRecord(
    payload: CreatePlaceVisitRecordPayload,
    userId: string,
  ): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new InternalServerErrorException();
    }

    let place;
    place = await this.placesRepository.findOneBy({
      googlePlaceId: payload.googlePlaceId,
    });
    if (!place) {
      place = await this.savePlace(payload);
    }

    await this.savePlaceVisitRecord(user, place);
  }

  private async savePlace(
    payload: CreatePlaceVisitRecordPayload,
  ): Promise<Place> {
    const place = new Place();
    place.googlePlaceId = payload.googlePlaceId;
    place.name = payload.name;
    place.latitude = payload.latitude;
    place.longitude = payload.longitude;
    return await this.placesRepository.save(place);
  }

  private async savePlaceVisitRecord(user: User, place: Place): Promise<void> {
    const placeVisitRecord = new PlaceVisitRecord();
    placeVisitRecord.user = user;
    placeVisitRecord.place = place;
    await this.placeVisitRecordsRepository.save(placeVisitRecord);
  }

  async findAll(
    getVisitedPlacesQueryParam: GetVisitedPlacesQueryParam,
    userId: string,
  ): Promise<GetPlaceVisitRecordsResource> {
    const places = await this.placeVisitRecordsRepository
      .createQueryBuilder('pvr')
      .leftJoinAndSelect('pvr.place', 'place')
      .innerJoin('pvr.user', 'user')
      .where('user.id = :id', { id: userId })
      .andWhere('pvr.visitedAt > :fromDate', {
        fromDate: getVisitedPlacesQueryParam.fromDate,
      })
      .getMany();

    return { items: places.map(mapPlaceVisitRecordToPlaceVisitRecordResource) };
  }
}
