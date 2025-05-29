import { ApiProperty } from '@nestjs/swagger';
import { AdminPlaceResource } from './adminPlaceResource.dto';

export class AdminGetPlacesResource {
    @ApiProperty({ isArray: true, type: AdminPlaceResource })
    items: AdminPlaceResource[];
}
