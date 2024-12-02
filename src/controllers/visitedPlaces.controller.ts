import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/authUser.decorator';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { VisitedPlacesService } from 'src/services/visitedPlaces.service';
import { AccessTokenPayload } from 'src/types/auth/accessTokenPayload';
import { GetVisitedPlacesQueryParam } from 'src/types/queryParams/getVisitedPlacesQueryParam.dto';
import { VisitedPlacePayload } from 'src/types/requestBody/visitedPlacePayload.dto';
import { GetVisitedPlacesResource } from 'src/types/response/getVisitedPlacesResource.dto';
import { VisitedPlaceResource } from 'src/types/response/visitedPlaceResource.dto';

@ApiTags('Visited places')
@Controller('visited-places')
@UseGuards(JwtAuthGuard)
export class VisitedPlacesController {
  constructor(private visitedPlacesService: VisitedPlacesService) {}

  @HttpCode(HttpStatus.OK)
  @Post('add')
  async signIn(
    @Body() body: VisitedPlacePayload,
    @AuthUser() user: AccessTokenPayload,
  ): Promise<void> {
    return await this.visitedPlacesService.visitPlace(body, user.userId);
  }

  @ApiResponse({ status: HttpStatus.OK, type: [VisitedPlaceResource] })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllVisitedPlaces(
    @Query() query: GetVisitedPlacesQueryParam,
    @AuthUser() user: AccessTokenPayload,
  ): Promise<GetVisitedPlacesResource> {
    return await this.visitedPlacesService.findAll(query, user.userId);
  }
}
