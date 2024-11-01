import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from 'src/decorators/authUser.decorator';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { VisitedPlacesService } from 'src/services/visitedPlaces.service';
import { JwtPayload } from 'src/types/auth/jwtPayload';
import { VisitedPlacePayload } from 'src/types/requestBody/visitedPlacePayload.dto';

@Controller('visitedPlaces')
@UseGuards(JwtAuthGuard)
export class VisitedPlacesController {
  constructor(private visitedPlacesService: VisitedPlacesService) {}

  @HttpCode(HttpStatus.OK)
  @Post('add')
  async signIn(
    @Body() body: VisitedPlacePayload,
    @AuthUser() user: JwtPayload,
  ) {
    return await this.visitedPlacesService.visitPlace(body, user.userId);
  }
}
