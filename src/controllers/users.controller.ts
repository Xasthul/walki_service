import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/authUser.decorator';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { UsersService } from 'src/services/users.service';
import { AccessTokenPayload } from 'src/types/auth/accessTokenPayload';
import { UserResource } from 'src/types/response/userResource.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({ status: HttpStatus.OK, type: UserResource })
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  async getUserInfo(@AuthUser() user: AccessTokenPayload): Promise<UserResource> {
    return await this.usersService.findById(user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  async deleteUser(@AuthUser() user: AccessTokenPayload): Promise<void> {
    return await this.usersService.delete(user.userId);
  }
}
