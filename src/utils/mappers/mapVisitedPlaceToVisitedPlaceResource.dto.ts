import { VisitedPlace } from 'src/entities/placeVisitRecord.entity';
import { VisitedPlaceResource } from 'src/types/response/visitedPlaceResource.dto';

export const mapVisitedPlaceToVisitedPlaceResource = (
  visitedPlace: VisitedPlace,
): VisitedPlaceResource => {
  const result = {} as VisitedPlaceResource;

  result.name = visitedPlace.name;
  result.latitude = visitedPlace.latitude;
  result.longitude = visitedPlace.longitude;

  return result;
};
