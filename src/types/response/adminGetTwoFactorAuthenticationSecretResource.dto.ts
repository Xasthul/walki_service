import { ApiProperty } from '@nestjs/swagger';

export class AdminGetTwoFactorAuthenticationSecretResource {
  @ApiProperty()
  secret: string;

  @ApiProperty()
  qrCode: string;
}
