import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/services/auth.service';
import { CreateUserPayload } from 'src/types/requestBody/createUserPayload.dto';
import { SignInPayload } from 'src/types/requestBody/signInPayload.dto';
import { SignInResponseModel } from 'src/types/response/signInResponseModel.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: HttpStatus.OK, type: SignInResponseModel })
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
