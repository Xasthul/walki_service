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
import { ApiResponse } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/authUser.decorator';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { VisitedPlacesService } from 'src/services/visitedPlaces.service';
import { JwtPayload } from 'src/types/auth/jwtPayload';
import { GetVisitedPlacesQueryParam } from 'src/types/queryParams/getVisitedPlacesQueryParam.dto';
import { VisitedPlacePayload } from 'src/types/requestBody/visitedPlacePayload.dto';
import { VisitedPlaceResource } from 'src/types/response/visitedPlaceResource.dto';

@Controller('visitedPlaces')
@UseGuards(JwtAuthGuard)
export class VisitedPlacesController {
  constructor(private visitedPlacesService: VisitedPlacesService) {}

  @HttpCode(HttpStatus.OK)
  @Post('add')
  async signIn(
    @Body() body: VisitedPlacePayload,
    @AuthUser() user: JwtPayload,
  ): Promise<void> {
    return await this.visitedPlacesService.visitPlace(body, user.userId);
  }

  @ApiResponse({ status: HttpStatus.OK, type: [VisitedPlaceResource] })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllVisitedPlaces(
    @Query() query: GetVisitedPlacesQueryParam,
    @AuthUser() user: JwtPayload,
  ): Promise<VisitedPlaceResource[]> {
    return await this.visitedPlacesService.findAll(query, user.userId);
  }
}
