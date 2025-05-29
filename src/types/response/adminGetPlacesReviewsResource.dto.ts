import { ApiProperty } from '@nestjs/swagger';
import { AdminPlaceReviewResource } from './adminPlaceReviewResource.dto';

export class AdminGetPlacesReviewsResource {
    @ApiProperty({ isArray: true, type: AdminPlaceReviewResource })
    items: AdminPlaceReviewResource[];
}
