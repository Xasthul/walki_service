import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  @HttpCode(HttpStatus.OK)
  @Get('/')
  signIn() {
    return 'Hello World';
  }
}
