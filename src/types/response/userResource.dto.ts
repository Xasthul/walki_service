import { ApiProperty } from '@nestjs/swagger';

export class UserResource {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
