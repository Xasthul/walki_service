import { PlaceReview } from 'src/entities/placeReview.entity';
import { AdminPlaceReviewResource } from 'src/types/response/adminPlaceReviewResource.dto';

export const mapPlaceReviewToAdminPlaceReviewResource = (placeReview: PlaceReview): AdminPlaceReviewResource => {
  const result = {} as AdminPlaceReviewResource;

  result.id = placeReview.id;
  result.placeName = placeReview.place.name;
  result.authorName = placeReview.user.name;
  result.content = placeReview.content;
  result.createdAt = placeReview.createdAt;

  return result;
};
