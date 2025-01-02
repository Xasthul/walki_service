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
import { AccessTokenPayload } from 'src/types/auth/accessTokenPayload';
import { JwtService } from '@nestjs/jwt';
import { SuperuserRefreshToken } from 'src/entities/superuserRefreshToken.entity';
import { RefreshTokenPayload } from 'src/types/auth/refreshTokenPayload';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Superuser)
    private superusersRepository: Repository<Superuser>,
    @InjectRepository(SuperuserRefreshToken)
    private superuserRefreshTokensRepository: Repository<SuperuserRefreshToken>,
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
    const superuser = await this.verifySuperuserCredentials(username, password);

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
    const superuser = await this.verifySuperuserCredentials(username, password);

    this.verifyTwoFactorAuthenticationCode(
      superuser.twoFactorAuthenticationSecret,
      twoFactorAuthenticationCode,
    );

    superuser.isTwoFactorAuthenticationEnabled = true;
    await this.superusersRepository.save(superuser);

    return {
      accessToken: await this.createAccessToken(superuser.id),
      refreshToken: await this.createRefreshToken(superuser),
    }
  }

  async authenticateWithTwoFactorAuthenticationCode(
    username: string,
    password: string,
    twoFactorAuthenticationCode: string,
  ) {
    const superuser = await this.verifySuperuserCredentials(username, password);

    this.verifyTwoFactorAuthenticationCode(
      superuser.twoFactorAuthenticationSecret,
      twoFactorAuthenticationCode,
    );

    return {
      accessToken: await this.createAccessToken(superuser.id),
      refreshToken: await this.createRefreshToken(superuser),
    }
  }

  async refreshToken(refreshToken: string) {
    let providedRefreshToken: RefreshTokenPayload;
    try {
      providedRefreshToken = await this.jwtService.verifyAsync(refreshToken);
    } catch (error) {
      throw new UnauthorizedException();
    }

    const superuser = await this.superusersRepository.findOneBy({
      id: providedRefreshToken.userId,
    });
    if (!superuser) {
      throw new UnauthorizedException();
    }

    const oldRefreshToken = await this.superuserRefreshTokensRepository.findOneBy({
      id: providedRefreshToken.sub,
      userId: providedRefreshToken.userId,
    });
    if (!oldRefreshToken) {
      throw new UnauthorizedException();
    }

    await this.superuserRefreshTokensRepository.remove(oldRefreshToken);

    return {
      accessToken: await this.createAccessToken(superuser.id),
      refreshToken: await this.createRefreshToken(superuser),
    };
  }

  private async verifySuperuserCredentials(
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

  private async createAccessToken(userId: string): Promise<string> {
    const accessTokenPayload: AccessTokenPayload = { userId: userId };
    return await this.jwtService.signAsync(accessTokenPayload, {
      expiresIn: '5m',
    });
  }

  private async createRefreshToken(user: Superuser): Promise<string> {
    const refreshToken = new SuperuserRefreshToken();
    refreshToken.user = user;
    await this.superuserRefreshTokensRepository.save(refreshToken);

    const refreshTokenPayload: RefreshTokenPayload = {
      sub: refreshToken.id,
      userId: refreshToken.userId,
    };
    return await this.jwtService.signAsync(refreshTokenPayload, {
      expiresIn: '21d',
    });
  }
}
