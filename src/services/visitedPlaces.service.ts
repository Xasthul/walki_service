import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { VisitedPlace } from 'src/entities/visitedPlace.entity';
import { VisitedPlacePayload } from 'src/types/requestBody/visitedPlacePayload.dto';
import { Repository } from 'typeorm';

@Injectable()
export class VisitedPlacesService {
  constructor(
    @InjectRepository(VisitedPlace)
    private visitedPlacesRepository: Repository<VisitedPlace>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async visitPlace(visitPlacePayload: VisitedPlacePayload, userId: string) {
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
}
