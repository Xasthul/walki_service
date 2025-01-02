import { ApiProperty } from '@nestjs/swagger';

export class AdminAuthenticationResource {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
