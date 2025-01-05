import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { AdminService } from 'src/services/admin.service';
import { AdminDeletePlaceReviewParam } from 'src/types/queryParams/admiDeletePlaceReviewParam.dto';
import { AdminAuthenticationPayload } from 'src/types/requestBody/adminAuthenticationPayload.dto';
import { AdminGenerateTwoFactorAuthenticationSecretPayload } from 'src/types/requestBody/adminGenerateTwoFactorAuthenticationSecretPayload.dto';
import { AdminLoginPayload } from 'src/types/requestBody/adminLoginPayload.dto';
import { AdminAuthenticationResource } from 'src/types/response/adminAuthenticationResource.dto';
import { AdminGetPlacesResource } from 'src/types/response/adminGetPlacesResource.dto';
import { AdminGetPlacesReviewsResource } from 'src/types/response/adminGetPlacesReviewsResource.dto';
import { AdminGetTwoFactorAuthenticationSecretResource } from 'src/types/response/adminGetTwoFactorAuthenticationSecretResource.dto';
import { AdminGetUsersResource } from 'src/types/response/adminGetUsersResource.dto';
import { AdminLoginResource } from 'src/types/response/adminLoginResource.dto';

@ApiTags('Admin Panel')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) { }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, type: AdminGetUsersResource })
  @HttpCode(HttpStatus.OK)
  @Get('users')
  async getUsers(): Promise<AdminGetUsersResource> {
    return await this.adminService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: HttpStatus.OK, type: AdminGetPlacesResource })
  @HttpCode(HttpStatus.OK)
  @Get('places')
  async getPlaces(): Promise<AdminGetPlacesResource> {
    return await this.adminService.findAllPlaces();
  }

  @ApiResponse({ status: HttpStatus.OK, type: AdminGetPlacesReviewsResource })
  @HttpCode(HttpStatus.OK)
  @Get('places-reviews')
  async getPlacesReviews(): Promise<AdminGetPlacesReviewsResource> {
    return await this.adminService.findAllPlacesReviews();
  }

  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Delete('places-reviews/:reviewId')
  async deletePlaceReview(
    @Param() param: AdminDeletePlaceReviewParam,
  ): Promise<void> {
    return await this.adminService.deletePlaceReview(param.reviewId);
  }

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
  ): Promise<AdminAuthenticationResource> {
    return await this.adminService.authenticateWithTwoFactorAuthenticationCode(
      body.username,
      body.password,
      body.twoFactorAuthenticationCode,
    );
  }
}
