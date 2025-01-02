import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { authenticator } from 'otplib';
import { User } from 'src/entities/user.entity';
import { AdminGetUsersResource } from 'src/types/response/adminGetUsersResource.dto';
import { mapUserToAdminUserResource } from 'src/utils/mappers/mapUserToAdminUserResource';
import { Repository } from 'typeorm';
import { toDataURL } from 'qrcode';
import { generateQrCodeDataURL } from 'src/utils/qrCode/generateQrCodeDataUrl';
import { Superuser } from 'src/entities/superuser.entity';
import { comparePasswordWithHash, generatePasswordHash } from 'src/utils/hashing';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Superuser)
    private superusersRepository: Repository<Superuser>,
    private configService: ConfigService,
  ) { }

  async findAllUsers(): Promise<AdminGetUsersResource> {
    const users = await this.usersRepository.find({
      relations: {
        visitedPlaces: true,
        placesReviews: true,
      },
    });
    return {
      items: users.map(mapUserToAdminUserResource),
    };
  }

  async login(username: string, password: string) {
    let superuser = await this.superusersRepository.findOneBy({ username: username });
    if (!superuser) {
      const environmentUsername = this.configService.get<string>('SUPERUSER_USERNAME');
      const environmentPassword = this.configService.get<string>('SUPERUSER_PASSWORD');
      if (username !== environmentUsername || password !== environmentPassword) {
        throw new UnauthorizedException();
      }
      superuser = new Superuser();
      superuser.username = username;
      superuser.password = await generatePasswordHash(password);
      await this.superusersRepository.save(superuser);
    }
    return {
      isTwoFactorAuthenticationEnabled: superuser.isTwoFactorAuthenticationEnabled,
    };
  }

  async generateTwoFactorAuthenticationSecret(username: string, password: string) {
    const superuser = await this.verifySuperuserRecordExists(username, password);

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(superuser.username, 'Walki Admin Panel', secret);
    const qrCode = await generateQrCodeDataURL(otpauthUrl);

    superuser.twoFactorAuthenticationSecret = secret;
    await this.superusersRepository.save(superuser);

    return {
      secret,
      qrCode,
    }
  }

  async turnOnTwoFactorAuthentication(
    username: string,
    password: string,
    twoFactorAuthenticationCode: string,
  ) {
    const superuser = await this.verifySuperuserRecordExists(username, password);

    this.verifyTwoFactorAuthenticationCode(
      superuser.twoFactorAuthenticationSecret,
      twoFactorAuthenticationCode,
    );

    superuser.isTwoFactorAuthenticationEnabled = true;
    await this.superusersRepository.save(superuser);

    return {
      accessToken: '',
      refreshToken: '',
    }
  }

  async authenticateWithTwoFactorAuthenticationCode(
    username: string,
    password: string,
    twoFactorAuthenticationCode: string,
  ) {
    const superuser = await this.verifySuperuserRecordExists(username, password);

    this.verifyTwoFactorAuthenticationCode(
      superuser.twoFactorAuthenticationSecret,
      twoFactorAuthenticationCode,
    );

    return {
      accessToken: '',
      refreshToken: '',
    }
  }

  private async verifySuperuserRecordExists(
    username: string,
    password: string,
  ): Promise<Superuser> {
    const superuser = await this.superusersRepository.findOneBy({ username: username });
    if (!superuser) {
      throw new UnauthorizedException();
    }
    const hasPasswordsMatched = await comparePasswordWithHash(password, superuser.password);
    if (!hasPasswordsMatched) {
      throw new UnauthorizedException();
    }
    return superuser;
  }

  private verifyTwoFactorAuthenticationCode(
    twoFactorAuthenticationSecret: string,
    twoFactorAuthenticationCode: string,
  ) {
    const isCodeValid = authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: twoFactorAuthenticationSecret,
    });
    if (!isCodeValid) {
      throw new UnauthorizedException();
    }
  }
}
