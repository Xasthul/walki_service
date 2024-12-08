import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePlaceVisitRecordPayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly googlePlaceId: string;

  @ApiProperty()
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
