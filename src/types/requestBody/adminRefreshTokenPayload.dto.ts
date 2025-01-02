import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class AdminRefreshTokenPayload {
  @ApiProperty()
  @IsJWT()
  readonly refreshToken: string;
}
