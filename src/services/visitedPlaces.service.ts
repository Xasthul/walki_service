import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { VisitedPlace } from 'src/entities/visitedPlace.entity';
import { GetVisitedPlacesQueryParam } from 'src/types/queryParams/getVisitedPlacesQueryParam.dto';
import { VisitedPlacePayload } from 'src/types/requestBody/visitedPlacePayload.dto';
import { GetVisitedPlacesResource } from 'src/types/response/getVisitedPlacesResource.dto';
import { VisitedPlaceResource } from 'src/types/response/visitedPlaceResource.dto';
import { mapVisitedPlaceToVisitedPlaceResource } from 'src/utils/mappers/mapVisitedPlaceToVisitedPlaceResource.dto';
import { Repository } from 'typeorm';

@Injectable()
export class VisitedPlacesService {
  constructor(
    @InjectRepository(VisitedPlace)
    private visitedPlacesRepository: Repository<VisitedPlace>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async visitPlace(
    visitPlacePayload: VisitedPlacePayload,
    userId: string,
  ): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new InternalServerErrorException();
    }

    const visitedPlace = new VisitedPlace();
    visitedPlace.name = visitPlacePayload.name;
    visitedPlace.latitude = visitPlacePayload.latitude;
    visitedPlace.longitude = visitPlacePayload.longitude;
    visitedPlace.user = user;
    await this.visitedPlacesRepository.insert(visitedPlace);
  }

  async findAll(
    getVisitedPlacesQueryParam: GetVisitedPlacesQueryParam,
    userId: string,
  ): Promise<GetVisitedPlacesResource> {
    const places = await this.visitedPlacesRepository
      .createQueryBuilder("vp")
      .innerJoin('vp.user', 'user')
      .where('user.id = :id', { id: userId })
      .andWhere('vp.visitedAt > :fromDate', { fromDate: getVisitedPlacesQueryParam.fromDate })
      .getMany();

    return { items: places.map(mapVisitedPlaceToVisitedPlaceResource) };
  }
}
