import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AdminLoginPayload {
  @ApiProperty({ example: 'email@email.com' })
  @MaxLength(320)
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
