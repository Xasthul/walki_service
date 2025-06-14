import { ApiProperty } from '@nestjs/swagger';
import { PlaceReviewResource } from './placeReviewResource.dto';

export class GetPlaceReviewsResource {
  @ApiProperty({ isArray: true, type: PlaceReviewResource })
  items: PlaceReviewResource[];
}
