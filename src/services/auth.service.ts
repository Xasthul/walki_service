import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { AccessTokenPayload } from 'src/types/auth/accessTokenPayload';
import { SignInResource } from 'src/types/response/signInResource.dto';
import { comparPasswordWithHash } from 'src/utils/hashing';
import { SignInPayload } from 'src/types/requestBody/signInPayload.dto';
import { CreateUserPayload } from 'src/types/requestBody/createUserPayload.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from 'src/entities/refreshToken.entity';
import { RefreshTokenPayload } from 'src/types/auth/refreshTokenPayload';
import { RefreshTokenPayload as RefreshTokenDto } from 'src/types/requestBody/refreshTokenPayload.dto';
import { RefreshTokenResource } from 'src/types/response/refreshTokenResource.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async signUp(createUserPayload: CreateUserPayload): Promise<void> {
    await this.usersService.create(createUserPayload);
  }

  async signIn(signInPayload: SignInPayload): Promise<SignInResource> {
    const user = await this.usersRepository.findOneBy({ email: signInPayload.email });
    if (!user) {
      throw new UnauthorizedException();
    }

    const hasPasswordsMatched = await comparPasswordWithHash(
      signInPayload.password,
      user.password,
    );
    if (!hasPasswordsMatched) {
      throw new UnauthorizedException();
    }

    await this.refreshTokensRepository.delete({ userId: user.id });

    return {
      accessToken: await this.createAccessToken(user.id),
      refreshToken: await this.createRefreshToken(user),
    };
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResource> {
    let providedRefreshToken: RefreshTokenPayload;
    try {
      providedRefreshToken = this.jwtService.verify(refreshToken);
    } catch (error) {
      throw new UnauthorizedException();
    }

    const user = await this.usersRepository.findOneBy({ id: providedRefreshToken.userId });
    if (!user) {
      throw new UnauthorizedException();
    }

    const oldRefreshToken = await this.refreshTokensRepository.findOneBy({ id: providedRefreshToken.sub });
    if (!oldRefreshToken) {
      throw new UnauthorizedException();
    }

    await this.refreshTokensRepository.remove(oldRefreshToken);

    return {
      accessToken: await this.createAccessToken(user.id),
      refreshToken: await this.createRefreshToken(user),
    };
  }

  private async createAccessToken(userId: string): Promise<string> {
    const accessTokenPayload: AccessTokenPayload = { userId: userId };
    return await this.jwtService.signAsync(accessTokenPayload, { expiresIn: '5m' });
  }

  private async createRefreshToken(user: User): Promise<string> {
    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    await this.refreshTokensRepository.save(refreshToken);

    const refreshTokenPayload: RefreshTokenPayload = { sub: refreshToken.id, userId: refreshToken.userId };
    return await this.jwtService.signAsync(refreshTokenPayload, { expiresIn: '21d' });
  }
}
