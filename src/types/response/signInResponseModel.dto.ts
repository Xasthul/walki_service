import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseModel {
  @ApiProperty()
  readonly accessToken: string;
}
