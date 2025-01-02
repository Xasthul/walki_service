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
import { PlaceVisitRecordsService } from 'src/services/placeVisitRecords.service';
import { AccessTokenPayload } from 'src/types/auth/accessTokenPayload';
import { GetVisitedPlacesQueryParam } from 'src/types/queryParams/getVisitedPlacesQueryParam.dto';
import { CreatePlaceVisitRecordPayload } from 'src/types/requestBody/createPlaceVisitRecordPayload.dto';
import { GetPlaceVisitRecordsResource } from 'src/types/response/getPlaceVisitRecordsResource.dto';

@ApiTags('Place visit records')
@Controller('place-visit-records')
@UseGuards(JwtAuthGuard)
export class PlaceVisitRecordsController {
  constructor(private placeVisitRecordsService: PlaceVisitRecordsService) {}

  @HttpCode(HttpStatus.OK)
  @Post('create')
  async createPlaceVisitRecord(
    @Body() body: CreatePlaceVisitRecordPayload,
    @AuthUser() user: AccessTokenPayload,
  ): Promise<void> {
    return await this.placeVisitRecordsService.createPlaceVisitRecord(
      body,
      user.userId,
    );
  }

  @ApiResponse({ status: HttpStatus.OK, type: GetPlaceVisitRecordsResource })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllPlaceVisitRecords(
    @Query() query: GetVisitedPlacesQueryParam,
    @AuthUser() user: AccessTokenPayload,
  ): Promise<GetPlaceVisitRecordsResource> {
    return await this.placeVisitRecordsService.findAll(query, user.userId);
  }
}
