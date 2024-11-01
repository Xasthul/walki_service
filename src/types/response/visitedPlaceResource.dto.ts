import { ApiProperty } from '@nestjs/swagger';

export class VisitedPlaceResource {
  @ApiProperty()
  name: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;
}
