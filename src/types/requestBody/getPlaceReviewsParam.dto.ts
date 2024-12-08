import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetPlaceReviewsParam {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly googlePlaceId: string;
}
