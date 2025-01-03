import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from 'src/services/admin.service';
import { AdminGenerateTwoFactorAuthenticationSecretPayload } from 'src/types/requestBody/adminGenerateTwoFactorAuthenticationSecretPayload.dto';
import { AdminLoginPayload } from 'src/types/requestBody/adminLoginPayload.dto';
import { AdminGetTwoFactorAuthenticationSecretResource } from 'src/types/response/adminGetTwoFactorAuthenticationSecretResource.dto';
import { AdminGetUsersResource } from 'src/types/response/adminGetUsersResource.dto';
import { AdminLoginResource } from 'src/types/response/adminLoginResource.dto';
import { LocalGuard } from 'src/guards/local.guard';
import { LoggedInGuard } from 'src/guards/loggedIn.guard';

@ApiTags('Admin Panel')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) { }

  @UseGuards(LoggedInGuard)
  @ApiResponse({ status: HttpStatus.OK, type: AdminGetUsersResource })
  @HttpCode(HttpStatus.OK)
  @Get('users')
  async getUsers()
    : Promise<AdminGetUsersResource> {
    return await this.adminService.findAllUsers();
  }

  // @ApiResponse({ status: HttpStatus.OK, type: AdminGetPlacesResource })
  // @HttpCode(HttpStatus.OK)
  // @Get('places')
  // async getPlaces(
  //   @AuthUser() user: AccessTokenPayload,
  // ): Promise<AdminGetPlacesResource> {
  //   return await this.adminService.findAllPlaces(user.userId);
  // }

  // @ApiResponse({ status: HttpStatus.OK, type: AdminGetPlacesReviewsResource })
  // @HttpCode(HttpStatus.OK)
  // @Get('places-reviews')
  // async getPlacesReviews(
  //   @AuthUser() user: AccessTokenPayload,
  // ): Promise<AdminGetPlacesReviewsResource> {
  //   return await this.adminService.findAllPlacesReviews(user.userId);
  // }

  // @ApiResponse({ status: HttpStatus.OK })
  // @HttpCode(HttpStatus.OK)
  // @Delete('place-review/:id')
  // async deletePlaceReview(
  //   @Param() id: AdminDeletePlaceReviewParam,
  //   @AuthUser() user: AccessTokenPayload,
  // ): Promise<void> {
  //   return await this.adminService.deletePlaceReview(id, user.userId);
  // }

  @ApiResponse({ status: HttpStatus.OK, type: AdminLoginResource })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: AdminLoginPayload): Promise<AdminLoginResource> {
    return await this.adminService.login(body.username, body.password);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: AdminGetTwoFactorAuthenticationSecretResource,
  })
  @HttpCode(HttpStatus.OK)
  @Post('2fa/generate')
  async generateTwoFactorAuthenticationSecret(
    @Body() body: AdminGenerateTwoFactorAuthenticationSecretPayload,
  ): Promise<AdminGetTwoFactorAuthenticationSecretResource> {
    return await this.adminService.generateTwoFactorAuthenticationSecret(
      body.username,
      body.password,
    );
  }

  @UseGuards(LocalGuard)
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Post('2fa/authenticate')
  async authenticateWithTwoFactorAuthentication(
  ): Promise<void> {
    return;
  }
}
