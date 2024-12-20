import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserPayload {
  @ApiProperty({ example: 'email@email.com' })
  @MaxLength(320)
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @MaxLength(128)
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
