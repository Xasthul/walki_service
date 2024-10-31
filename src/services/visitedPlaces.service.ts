import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VisitedPlace } from 'src/entities/visitedPlace.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VisitedPlacesService {
  constructor(
    @InjectRepository(VisitedPlace)
    private visitedPlacesRepository: Repository<VisitedPlace>,
  ) { };

  
}
