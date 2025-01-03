import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AdminService } from 'src/services/admin.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private adminService: AdminService) {
        super();
    }

    async validate(
        username: string,
        password: string,
        twoFactorAuthenticationCode: string,
    ): Promise<any> {
        return await this.adminService.authenticateWithTwoFactorAuthenticationCode(
            username,
            password,
            twoFactorAuthenticationCode,
        );
    }
}