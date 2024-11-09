import { ApiProperty } from '@nestjs/swagger';
import { VisitedPlaceResource } from './visitedPlaceResource.dto';

export class GetVisitedPlacesResource {
  @ApiProperty()
  items: VisitedPlaceResource[];
}
