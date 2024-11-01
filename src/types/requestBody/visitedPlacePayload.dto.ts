import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class VisitedPlacePayload {
  @ApiProperty()
  @MaxLength(128)
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNumber()
  readonly latitude: number;

  @ApiProperty()
  @IsNumber()
  readonly longitude: number;
}
