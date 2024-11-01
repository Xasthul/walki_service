import { ApiProperty } from '@nestjs/swagger';

export class UserResponseModel {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly email: string;
}
