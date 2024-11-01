import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/services/auth.service';
import { CreateUserPayload } from 'src/types/requestBody/createUserPayload.dto';
import { SignInPayload } from 'src/types/requestBody/signInPayload.dto';
import { SignInResource } from 'src/types/response/signInResource.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: HttpStatus.OK, type: SignInResource })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInPayload: SignInPayload): Promise<SignInResource> {
    return this.authService.signIn(signInPayload);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() createUserPayload: CreateUserPayload): Promise<void> {
    return this.authService.signUp(createUserPayload);
  }
}
