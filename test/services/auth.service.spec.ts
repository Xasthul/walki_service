import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '../../src/services/auth.service';
import { UsersService } from '../../src/services/users.service';
import { User } from '../../src/entities/user.entity';
import { RefreshToken } from '../../src/entities/refreshToken.entity';
import {
  createUserPayload,
  user,
  signInPayload,
  refreshTokenPayload,
  refreshToken,
} from 'test/mocks/auth.mock';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let usersRepository: Repository<User>;
  let refreshTokensRepository: Repository<RefreshToken>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mock-token'),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    refreshTokensRepository = module.get<Repository<RefreshToken>>(
      getRepositoryToken(RefreshToken),
    );
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      jest.spyOn(usersService, 'create').mockResolvedValue(undefined);

      await authService.signUp(createUserPayload);

      expect(usersService.create).toHaveBeenCalledWith(createUserPayload);
    });
  });

  describe('signIn', () => {
    it('should return access and refresh tokens when credentials are valid', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce('mock-access-token')
        .mockResolvedValueOnce('mock-refresh-token');
      jest
        .spyOn(refreshTokensRepository as any, 'delete')
        .mockResolvedValue(undefined);
      jest
        .spyOn(refreshTokensRepository as any, 'save')
        .mockResolvedValue(undefined);
      jest.spyOn(bcrypt as any, 'compare').mockResolvedValueOnce(true);

      const result = await authService.signIn(signInPayload);

      expect(result).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({
        email: signInPayload.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        signInPayload.password,
        user.password,
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);

      await expect(authService.signIn(signInPayload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(bcrypt as any, 'compare').mockResolvedValueOnce(false);
      jest
        .spyOn(refreshTokensRepository as any, 'delete')
        .mockResolvedValue(undefined);
      jest
        .spyOn(refreshTokensRepository as any, 'save')
        .mockResolvedValue(undefined);

      await expect(authService.signIn(signInPayload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should return new access and refresh tokens for valid refresh token', async () => {
      jest
        .spyOn(jwtService as any, 'verifyAsync')
        .mockResolvedValue(refreshTokenPayload);
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest
        .spyOn(refreshTokensRepository, 'findOneBy')
        .mockResolvedValue(refreshToken);
      jest
        .spyOn(refreshTokensRepository as any, 'remove')
        .mockResolvedValue(undefined);
      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce('mock-access-token')
        .mockResolvedValueOnce('mock-refresh-token');
      jest
        .spyOn(refreshTokensRepository as any, 'delete')
        .mockResolvedValue(undefined);
      jest
        .spyOn(refreshTokensRepository as any, 'save')
        .mockResolvedValue(undefined);

      const result = await authService.refreshToken('valid-refresh-token');

      expect(result).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(
        'valid-refresh-token',
      );
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({
        id: refreshTokenPayload.userId,
      });
      expect(refreshTokensRepository.findOneBy).toHaveBeenCalledWith({
        id: refreshTokenPayload.sub,
        userId: refreshTokenPayload.userId,
      });
      expect(refreshTokensRepository.remove).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      jest.spyOn(jwtService, 'verifyAsync').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        authService.refreshToken('invalid-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest
        .spyOn(jwtService as any, 'verifyAsync')
        .mockResolvedValue(refreshTokenPayload);
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        authService.refreshToken('valid-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if refresh token does not exist', async () => {
      jest
        .spyOn(jwtService as any, 'verifyAsync')
        .mockResolvedValue(refreshTokenPayload);
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(refreshTokensRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        authService.refreshToken('valid-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
