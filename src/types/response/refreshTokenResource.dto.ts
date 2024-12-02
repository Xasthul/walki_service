import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenResource {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
