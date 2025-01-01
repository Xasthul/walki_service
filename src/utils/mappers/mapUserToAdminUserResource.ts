import { User } from 'src/entities/user.entity';
import { AdminUserResource } from 'src/types/response/adminUserResource.dto';

export const mapUserToAdminUserResource = (user: User): AdminUserResource => {
  const result = {} as AdminUserResource;

  result.email = user.email;
  result.name = user.name;
  result.placesVisited = user.visitedPlaces.length;
  result.reviewsWritten = user.placesReviews.length;

  return result;
};
