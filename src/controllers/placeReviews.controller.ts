import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/authUser.decorator';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { PlaceReviewsService } from 'src/services/placeReviews.service';
import { AccessTokenPayload } from 'src/types/auth/accessTokenPayload';
import { CreatePlaceReviewPayload } from 'src/types/requestBody/createPlaceReviewPayload.dto';
import { GetPlaceReviewsParam } from 'src/types/requestBody/getPlaceReviewsParam.dto';
import { GetPlaceReviewsResource } from 'src/types/response/getPlaceReviewsResource.dto';
import { PlaceReviewResource } from 'src/types/response/placeReviewResource.dto';

@ApiTags('Place reviews')
@Controller('place-reviews')
@UseGuards(JwtAuthGuard)
export class PlaceReviewsController {
    constructor(private placeReviewsService: PlaceReviewsService) { }

    @HttpCode(HttpStatus.OK)
    @Post('create')
    async createPlaceVisitRecord(
        @Body() body: CreatePlaceReviewPayload,
        @AuthUser() user: AccessTokenPayload,
    ): Promise<void> {
        return await this.placeReviewsService.createPlaceReview(
            body,
            user.userId,
        );
    }

    @ApiResponse({ status: HttpStatus.OK, type: [PlaceReviewResource] })
    @HttpCode(HttpStatus.OK)
    @Get(':googlePlaceId')
    async getAllPlaceReviews(@Param() param: GetPlaceReviewsParam): Promise<GetPlaceReviewsResource> {
        return await this.placeReviewsService.findAllForPlace(param.googlePlaceId);
    }
}
