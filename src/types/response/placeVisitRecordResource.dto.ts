import { ApiProperty } from '@nestjs/swagger';

export class PlaceVisitRecordResource {
  @ApiProperty()
  name: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;
}
