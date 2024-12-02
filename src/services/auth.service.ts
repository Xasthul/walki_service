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

    // Remove all records of existing refresh tokens issued to user
    await this.refreshTokensRepository.delete({ userId: user.id });

    // Create a new refresh token record
    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    await this.refreshTokensRepository.save(refreshToken);

    const accessTokenPayload: AccessTokenPayload = { userId: user.id };
    const refreshTokenPayload: RefreshTokenPayload = { sub: refreshToken.id };
    return {
      accessToken: await this.jwtService.signAsync(accessTokenPayload, { expiresIn: '10m' }),
      refreshToken: await this.jwtService.signAsync(refreshTokenPayload, { expiresIn: '21d' }),
    };
  }

  async signUp(createUserPayload: CreateUserPayload): Promise<void> {
    await this.usersService.create(createUserPayload);
  }
}
