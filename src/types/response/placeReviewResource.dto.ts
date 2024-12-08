import { ApiProperty } from '@nestjs/swagger';

export class PlaceReviewResource {
  @ApiProperty()
  author: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;
}
