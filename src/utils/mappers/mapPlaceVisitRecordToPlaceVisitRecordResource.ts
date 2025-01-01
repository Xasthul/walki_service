import { PlaceVisitRecord } from 'src/entities/placeVisitRecord.entity';
import { PlaceVisitRecordResource } from 'src/types/response/placeVisitRecordResource.dto';

export const mapPlaceVisitRecordToPlaceVisitRecordResource = (
  placeVisitRecord: PlaceVisitRecord,
): PlaceVisitRecordResource => {
  const result = {} as PlaceVisitRecordResource;

  result.name = placeVisitRecord.place.name;
  result.latitude = placeVisitRecord.place.latitude;
  result.longitude = placeVisitRecord.place.longitude;

  return result;
};
