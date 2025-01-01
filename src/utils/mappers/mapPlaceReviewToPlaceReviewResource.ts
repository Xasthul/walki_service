import { PlaceReview } from 'src/entities/placeReview.entity';
import { PlaceReviewResource } from 'src/types/response/placeReviewResource.dto';

export const mapPlaceReviewToPlaceReviewResource = (
  placeReview: PlaceReview,
): PlaceReviewResource => {
  const result = {} as PlaceReviewResource;

  result.author = placeReview.user.name;
  result.content = placeReview.content;
  result.createdAt = placeReview.createdAt;

  return result;
};
