import { ApiProperty } from '@nestjs/swagger';

export class AdminPlaceResource {
  @ApiProperty()
  name: string;

  @ApiProperty()
  timesVisited: number;

  @ApiProperty()
  reviewsNumber: number;
}
