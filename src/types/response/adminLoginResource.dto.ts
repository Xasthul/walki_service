import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginResource {
    @ApiProperty()
    isTwoFactorAuthenticationEnabled: boolean;
}
