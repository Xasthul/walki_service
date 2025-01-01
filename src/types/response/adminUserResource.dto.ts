import { ApiProperty } from '@nestjs/swagger';

export class AdminUserResource {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  placesVisited: number;

  @ApiProperty()
  reviewsWritten: number;
}
