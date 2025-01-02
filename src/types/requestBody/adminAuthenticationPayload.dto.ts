import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AdminAuthenticationPayload {
  @ApiProperty({ example: 'email@email.com' })
  @MaxLength(320)
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly twoFactorAuthenticationCode: string;
}
