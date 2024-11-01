import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate } from 'class-validator';

export class GetVisitedPlacesQueryParam {
  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  readonly fromDate: Date;
}
