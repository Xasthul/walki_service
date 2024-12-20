import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/services/auth.service';
import { CreateUserPayload } from 'src/types/requestBody/createUserPayload.dto';
import { RefreshTokenPayload } from 'src/types/requestBody/refreshTokenPayload.dto';
import { SignInPayload } from 'src/types/requestBody/signInPayload.dto';
import { RefreshTokenResource } from 'src/types/response/refreshTokenResource.dto';
import { SignInResource } from 'src/types/response/signInResource.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: HttpStatus.OK, type: SignInResource })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInPayload: SignInPayload): Promise<SignInResource> {
    return await this.authService.signIn(signInPayload);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() createUserPayload: CreateUserPayload): Promise<void> {
    return await this.authService.signUp(createUserPayload);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenPayload: RefreshTokenPayload,
  ): Promise<RefreshTokenResource> {
    return await this.authService.refreshToken(
      refreshTokenPayload.refreshToken,
    );
  }
}
