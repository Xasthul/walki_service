import { ApiProperty } from '@nestjs/swagger';
import { AdminUserResource } from './adminUserResource.dto';

export class AdminGetUsersResource {
  @ApiProperty({ isArray: true, type: AdminUserResource })
  items: AdminUserResource[];
}
