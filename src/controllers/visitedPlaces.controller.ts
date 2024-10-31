import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';

@Controller('visitedPlaces')
@UseGuards(JwtAuthGuard)
export class VisitedPlacesController {
  @HttpCode(HttpStatus.OK)
  @Get('/')
  signIn() {
    return 'Hello World';
  }
}
