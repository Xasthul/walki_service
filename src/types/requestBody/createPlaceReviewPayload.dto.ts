import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePlaceReviewPayload {
  @ApiProperty()
  @MaxLength(150)
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
