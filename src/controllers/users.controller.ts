import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/authUser.decorator';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { UsersService } from 'src/services/users.service';
import { JwtPayload } from 'src/types/auth/jwtPayload';
import { UserResource } from 'src/types/response/userResource.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({ status: HttpStatus.OK, type: UserResource })
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  async signIn(@AuthUser() user: JwtPayload): Promise<UserResource> {
    return await this.usersService.findById(user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  async deleteUser(@AuthUser() user: JwtPayload): Promise<void> {
    return await this.usersService.delete(user.userId);
  }
}
