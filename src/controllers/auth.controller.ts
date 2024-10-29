import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/services/auth.service';
import { CreateUserPayload } from 'src/types/requestBody/createUserPayload.dto';
import { SignInPayload } from 'src/types/requestBody/signInPayload.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInPayload: SignInPayload) {
    return this.authService.signIn(signInPayload);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() createUserPayload: CreateUserPayload) {
    return this.authService.signUp(createUserPayload);
  }
}
