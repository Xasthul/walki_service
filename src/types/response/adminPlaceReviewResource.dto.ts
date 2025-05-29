import { ApiProperty } from '@nestjs/swagger';

export class AdminPlaceReviewResource {
  @ApiProperty()
  id: string;

  @ApiProperty()
  placeName: string;

  @ApiProperty()
  authorName: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;
}
