import { Place } from 'src/entities/place.entity';
import { AdminPlaceResource } from 'src/types/response/adminPlaceResource.dto';

export const mapPlaceToAdminPlaceResource = (place: Place): AdminPlaceResource => {
  const result = {} as AdminPlaceResource;

  result.name = place.name;
  result.timesVisited = place.visitRecords.length;
  result.reviewsNumber = place.reviews.length;

  return result;
};
