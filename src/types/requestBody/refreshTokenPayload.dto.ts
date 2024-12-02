import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class RefreshTokenPayload {
  @ApiProperty()
  @IsJWT()
  readonly refreshToken: string;
}
