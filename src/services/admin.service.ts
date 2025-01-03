import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { authenticator } from 'otplib';
import { User } from 'src/entities/user.entity';
import { AdminGetUsersResource } from 'src/types/response/adminGetUsersResource.dto';
import { mapUserToAdminUserResource } from 'src/utils/mappers/mapUserToAdminUserResource';
import { Repository } from 'typeorm';
import { generateQrCodeDataURL } from 'src/utils/qrCode/generateQrCodeDataUrl';
import { SuperUser } from 'src/entities/superUser.entity';
import {
  comparePasswordWithHash,
  generatePasswordHash,
} from 'src/utils/hashing';
import { ConfigService } from '@nestjs/config';
import { AdminLoginResource } from 'src/types/response/adminLoginResource.dto';
import { AdminGetTwoFactorAuthenticationSecretResource } from 'src/types/response/adminGetTwoFactorAuthenticationSecretResource.dto';
import { AdminAuthenticationResource } from 'src/types/response/adminAuthenticationResource.dto';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayload } from 'src/types/auth/accessTokenPayload';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(SuperUser)
    private superUsersRepository: Repository<SuperUser>,
    private configService: ConfigService,
    private jwtService: JwtService,
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

  async login(username: string, password: string): Promise<AdminLoginResource> {
    let superUser = await this.superUsersRepository.findOneBy({
      username: username,
    });
    if (!superUser) {
      const environmentUsername =
        this.configService.get<string>('SUPERUSER_USERNAME');
      const environmentPassword =
        this.configService.get<string>('SUPERUSER_PASSWORD');
      if (
        username !== environmentUsername ||
        password !== environmentPassword
      ) {
        throw new UnauthorizedException();
      }
      superUser = new SuperUser();
      superUser.username = username;
      superUser.password = await generatePasswordHash(password);
      await this.superUsersRepository.save(superUser);
    }
    return {
      isTwoFactorAuthenticationEnabled:
        superUser.isTwoFactorAuthenticationEnabled,
    };
  }

  async generateTwoFactorAuthenticationSecret(
    username: string,
    password: string,
  ): Promise<AdminGetTwoFactorAuthenticationSecretResource> {
    const superUser = await this.verifySuperUserCredentials(username, password);

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      superUser.username,
      'Walki Admin Panel',
      secret,
    );
    const qrCode = await generateQrCodeDataURL(otpauthUrl);

    superUser.twoFactorAuthenticationSecret = secret;
    await this.superUsersRepository.save(superUser);

    return { secret, qrCode };
  }

  async authenticateWithTwoFactorAuthenticationCode(
    username: string,
    password: string,
    twoFactorAuthenticationCode: string,
  ): Promise<AdminAuthenticationResource> {
    const superUser = await this.verifySuperUserCredentials(username, password);

    if (superUser.twoFactorAuthenticationSecret === null) {
      throw new UnprocessableEntityException();
    }

    const isCodeValid = authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: superUser.twoFactorAuthenticationSecret,
    });
    if (!isCodeValid) {
      throw new UnauthorizedException();
    }

    if (!superUser.isTwoFactorAuthenticationEnabled) {
      superUser.isTwoFactorAuthenticationEnabled = true;
      await this.superUsersRepository.save(superUser);
    }

    return {
      accessToken: await this.createAccessToken(superUser.id),
    };
  }

  private async verifySuperUserCredentials(
    username: string,
    password: string,
  ): Promise<SuperUser> {
    const superUser = await this.superUsersRepository.findOneBy({
      username: username,
    });
    if (!superUser) {
      throw new UnauthorizedException();
    }
    const hasPasswordsMatched = await comparePasswordWithHash(
      password,
      superUser.password,
    );
    if (!hasPasswordsMatched) {
      throw new UnauthorizedException();
    }
    return superUser;
  }

  private async createAccessToken(userId: string): Promise<string> {
    const accessTokenPayload: AccessTokenPayload = { userId: userId };
    return await this.jwtService.signAsync(accessTokenPayload, { expiresIn: '5m' });
  }
}
