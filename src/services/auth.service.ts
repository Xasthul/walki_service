import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { JwtPayload } from 'src/types/auth/jwtPayload';
import { SignInResponseModel } from 'src/types/response/signInResponseModel.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<SignInResponseModel> {
    const user = await this.usersService.findOne(email);
    // TODO: bcrypt
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload: JwtPayload = { userId: user.userId };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
