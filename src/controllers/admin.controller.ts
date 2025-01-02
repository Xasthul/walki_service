import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from 'src/services/admin.service';
import { AdminAuthenticationPayload } from 'src/types/requestBody/adminAuthenticationPayload.dto';
import { AdminGenerateTwoFactorAuthenticationSecretPayload } from 'src/types/requestBody/adminGenerateTwoFactorAuthenticationSecretPayload.dto';
import { AdminLoginPayload } from 'src/types/requestBody/adminLoginPayload.dto';
import { AdminRefreshTokenPayload } from 'src/types/requestBody/adminRefreshTokenPayload.dto';
import { AdminGetTwoFactorAuthenticationSecretResource } from 'src/types/response/adminGetTwoFactorAuthenticationSecretResource.dto';
import { AdminGetUsersResource } from 'src/types/response/adminGetUsersResource.dto';
import { AdminLoginResource } from 'src/types/response/adminLoginResource.dto';
import { FastifyReply } from 'fastify';

@ApiTags('Admin Panel')
@Controller('admin')
// @UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) { }

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

  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Post('2fa/authenticate')
  async authenticateWithTwoFactorAuthentication(
    @Body() body: AdminAuthenticationPayload,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<void> {
    const tokens = await this.adminService.authenticateWithTwoFactorAuthenticationCode(
      body.username,
      body.password,
      body.twoFactorAuthenticationCode,
    );

    response.setCookie('accessToken', tokens.accessToken, { httpOnly: true, secure: true });
    response.setCookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });

    return response.send();
  }

  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(
    @Body() body: AdminRefreshTokenPayload,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<void> {
    const tokens = await this.adminService.refreshToken(body.refreshToken);

    response.setCookie('accessToken', tokens.accessToken, { httpOnly: true, secure: true });
    response.setCookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });

    return response.send();
  }
}
