import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { JwtPayload } from 'src/types/auth/jwtPayload';
import { SignInResource } from 'src/types/response/signInResource.dto';
import { comparPasswordWithHash } from 'src/utils/hashing';
import { SignInPayload } from 'src/types/requestBody/signInPayload.dto';
import { CreateUserPayload } from 'src/types/requestBody/createUserPayload.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInPayload: SignInPayload): Promise<SignInResource> {
    const user = await this.usersRepository.findOneBy({
      email: signInPayload.email,
    });
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

    const payload: JwtPayload = { userId: user.id };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(createUserPayload: CreateUserPayload): Promise<void> {
    await this.usersService.create(createUserPayload);
  }
}
