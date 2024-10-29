import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { SignInPayload } from 'src/types/requestBody/signInPayload.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInPayload: SignInPayload) {
    return this.authService.signIn(signInPayload.email, signInPayload.password);
  }
}
