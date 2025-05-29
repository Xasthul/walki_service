import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AdminDeletePlaceReviewParam {
  @ApiProperty()
  @IsUUID()
  readonly reviewId: string;
}
