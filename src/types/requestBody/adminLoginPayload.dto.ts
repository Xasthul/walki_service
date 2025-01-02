import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AdminLoginPayload {
  @ApiProperty()
  @MaxLength(64)
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty()
  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
