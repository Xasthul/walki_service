import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from 'src/decorators/authUser.decorator';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { UsersService } from 'src/services/users.service';
import { JwtPayload } from 'src/types/auth/jwtPayload';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  async signIn(@AuthUser() user: JwtPayload) {
    return await this.usersService.findById(user.userId);
  }
}
