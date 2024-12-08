import { Injectable } from "@nestjs/common";
import { CreatePlaceReviewPayload } from "src/types/requestBody/createPlaceReviewPayload.dto";
import { GetPlaceReviewsResource } from "src/types/response/getPlaceReviewsResource.dto";

@Injectable()
export class PlaceReviewsService {

    async createPlaceReview(payload: CreatePlaceReviewPayload, userId: string): Promise<void> { }

    async findAllForPlace(googlePlaceId: string): Promise<GetPlaceReviewsResource> {
        return { items: [] };
    }
}