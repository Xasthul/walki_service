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
import { AccessTokenPayload } from 'src/types/auth/accessTokenPayload';
import { JwtService } from '@nestjs/jwt';
import { SuperUserRefreshToken } from 'src/entities/superUserRefreshToken.entity';
import { RefreshTokenPayload } from 'src/types/auth/refreshTokenPayload';
import { AdminLoginResource } from 'src/types/response/adminLoginResource.dto';
import { AdminGetTwoFactorAuthenticationSecretResource } from 'src/types/response/adminGetTwoFactorAuthenticationSecretResource.dto';
import { AdminAuthenticationResource } from 'src/types/response/adminAuthenticationResource.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(SuperUser)
    private superUsersRepository: Repository<SuperUser>,
    @InjectRepository(SuperUserRefreshToken)
    private superUserRefreshTokensRepository: Repository<SuperUserRefreshToken>,
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

  /// Authentication

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

    await this.superUserRefreshTokensRepository.delete({
      userId: superUser.id,
    });

    return {
      accessToken: await this.createAccessToken(superUser.id),
      refreshToken: await this.createRefreshToken(superUser),
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<AdminAuthenticationResource> {
    let providedRefreshToken: RefreshTokenPayload;
    try {
      providedRefreshToken = await this.jwtService.verifyAsync(refreshToken);
    } catch (error) {
      throw new UnauthorizedException();
    }

    const superUser = await this.superUsersRepository.findOneBy({
      id: providedRefreshToken.userId,
    });
    if (!superUser) {
      throw new UnauthorizedException();
    }

    const oldRefreshToken =
      await this.superUserRefreshTokensRepository.findOneBy({
        id: providedRefreshToken.sub,
        userId: providedRefreshToken.userId,
      });
    if (!oldRefreshToken) {
      throw new UnauthorizedException();
    }

    await this.superUserRefreshTokensRepository.remove(oldRefreshToken);

    return {
      accessToken: await this.createAccessToken(superUser.id),
      refreshToken: await this.createRefreshToken(superUser),
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
    return await this.jwtService.signAsync(accessTokenPayload, {
      expiresIn: '5m',
    });
  }

  private async createRefreshToken(user: SuperUser): Promise<string> {
    const refreshToken = new SuperUserRefreshToken();
    refreshToken.user = user;
    await this.superUserRefreshTokensRepository.save(refreshToken);

    const refreshTokenPayload: RefreshTokenPayload = {
      sub: refreshToken.id,
      userId: refreshToken.userId,
    };
    return await this.jwtService.signAsync(refreshTokenPayload, {
      expiresIn: '21d',
    });
  }
}
