import { ApiProperty } from '@nestjs/swagger';
import { PlaceVisitRecordResource } from './placeVisitRecordResource.dto';

export class GetPlaceVisitRecordsResource {
  @ApiProperty({ isArray: true, type: PlaceVisitRecordResource })
  items: PlaceVisitRecordResource[];
}
