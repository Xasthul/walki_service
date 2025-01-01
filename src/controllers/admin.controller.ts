import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/authUser.decorator';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { AdminService } from 'src/services/admin.service';
import { AccessTokenPayload } from 'src/types/auth/accessTokenPayload';
import { AdminGetUsersResource } from 'src/types/response/adminGetUsersResource.dto';

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
}
