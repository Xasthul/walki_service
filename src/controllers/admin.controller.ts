import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from 'src/services/admin.service';
import { AdminAuthenticationPayload } from 'src/types/requestBody/adminAuthenticationPayload.dto';
import { AdminGenerateTwoFactorAuthenticationSecretPayload } from 'src/types/requestBody/adminGenerateTwoFactorAuthenticationSecretPayload.dto';
import { AdminLoginPayload } from 'src/types/requestBody/adminLoginPayload.dto';
import { AdminRefreshTokenPayload } from 'src/types/requestBody/adminRefreshTokenPayload.dto';
import { AdminAuthenticationResource } from 'src/types/response/adminAuthenticationResource.dto';
import { AdminGetTwoFactorAuthenticationSecretResource } from 'src/types/response/adminGetTwoFactorAuthenticationSecretResource.dto';
import { AdminGetUsersResource } from 'src/types/response/adminGetUsersResource.dto';
import { AdminLoginResource } from 'src/types/response/adminLoginResource.dto';

@ApiTags('Admin Panel')
@Controller('admin')
// @UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @ApiResponse({ status: HttpStatus.OK, type: AdminGetUsersResource })
  @HttpCode(HttpStatus.OK)
  @Get('users')
  async getUsers() // @AuthUser() user: AccessTokenPayload,
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

  @ApiResponse({ status: HttpStatus.OK, type: AdminAuthenticationResource })
  @HttpCode(HttpStatus.OK)
  @Post('2fa/turn-on')
  async turnOnTwoFactorAuthentication(
    @Body() body: AdminAuthenticationPayload,
  ): Promise<AdminAuthenticationResource> {
    return await this.adminService.turnOnTwoFactorAuthentication(
      body.username,
      body.password,
      body.twoFactorAuthenticationCode,
    );
  }

  @ApiResponse({ status: HttpStatus.OK, type: AdminAuthenticationResource })
  @HttpCode(HttpStatus.OK)
  @Post('2fa/authenticate')
  async authenticateWithTwoFactorAuthentication(
    @Body() body: AdminAuthenticationPayload,
  ): Promise<AdminAuthenticationResource> {
    return await this.adminService.authenticateWithTwoFactorAuthenticationCode(
      body.username,
      body.password,
      body.twoFactorAuthenticationCode,
    );
  }

  @ApiResponse({ status: HttpStatus.OK, type: AdminAuthenticationResource })
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(
    @Body() body: AdminRefreshTokenPayload,
  ): Promise<AdminAuthenticationResource> {
    return await this.adminService.refreshToken(body.refreshToken);
  }
}
