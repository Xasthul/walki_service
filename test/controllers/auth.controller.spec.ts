import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/controllers/auth.controller';
import { AuthService } from '../../src/services/auth.service';
import {
  signInResource,
  signInPayload,
  createUserPayload,
  refreshTokenResource,
  refreshTokenPayload,
} from 'test/mocks/auth.mock';

describe('AuthController', () => {
  let authController: AuthController;

  const authServiceMock = {
    signIn: jest.fn(),
    signUp: jest.fn(),
    refreshToken: jest.fn(),
  };
  const expectedError = new Error();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a valid SignInResource when signIn is successful', async () => {
      authServiceMock.signIn.mockResolvedValue(signInResource);

      const result = await authController.signIn(signInPayload);

      expect(result).toEqual(signInResource);
      expect(authServiceMock.signIn).toHaveBeenCalledWith(signInPayload);
      expect(authServiceMock.signIn).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when signIn fails', async () => {
      authServiceMock.signIn.mockRejectedValue(expectedError);

      try {
        await authController.signIn(signInPayload);
      } catch (error) {
        expect(error).toBe(expectedError);
        expect(authServiceMock.signIn).toHaveBeenCalledWith(signInPayload);
      }
    });
  });

  describe('signUp', () => {
    it('should call signUp and return status CREATED (201)', async () => {
      await authController.signUp(createUserPayload);

      expect(authServiceMock.signUp).toHaveBeenCalledWith(createUserPayload);
      expect(authServiceMock.signUp).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when signUp fails', async () => {
      authServiceMock.signUp.mockRejectedValue(expectedError);

      try {
        await authController.signUp(createUserPayload);
      } catch (error) {
        expect(error).toBe(expectedError);
        expect(authServiceMock.signUp).toHaveBeenCalledWith(createUserPayload);
      }
    });
  });

  describe('refreshToken', () => {
    it('should return a new access token and refresh token when refreshToken is valid', async () => {
      authServiceMock.refreshToken.mockResolvedValue(refreshTokenResource);

      const result = await authController.refreshToken(refreshTokenPayload);

      expect(result).toEqual(refreshTokenResource);
      expect(authServiceMock.refreshToken).toHaveBeenCalledWith(
        refreshTokenPayload.refreshToken,
      );
      expect(authServiceMock.refreshToken).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when refreshToken is invalid', async () => {
      authServiceMock.refreshToken.mockRejectedValue(expectedError);

      try {
        await authController.refreshToken(refreshTokenPayload);
      } catch (error) {
        expect(error).toBe(expectedError);
        expect(authServiceMock.refreshToken).toHaveBeenCalledWith(
          refreshTokenPayload.refreshToken,
        );
      }
    });
  });
});
