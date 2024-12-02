import { ApiProperty } from '@nestjs/swagger';

export class SignInResource {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
