import { SignInPayload } from 'src/types/requestBody/signInPayload.dto';
import { SignInResource } from 'src/types/response/signInResource.dto';
import { CreateUserPayload } from 'src/types/requestBody/createUserPayload.dto';
import { RefreshTokenResource } from 'src/types/response/refreshTokenResource.dto';
import { User } from 'src/entities/user.entity';
import { RefreshToken } from 'src/entities/refreshToken.entity';
import { RefreshTokenPayload } from 'src/types/auth/refreshTokenPayload';

export const signInPayload: SignInPayload = {
    email: 'test@example.com',
    password: 'password',
};

export const signInResource: SignInResource = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
};

export const createUserPayload: CreateUserPayload = {
    email: 'newuser@example.com',
    name: 'name',
    password: 'password',
};

export const refreshTokenPayload: RefreshTokenPayload = {
    sub: 'sub',
    userId: 'userId',
};

export const refreshTokenResource: RefreshTokenResource = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
};

export const user: User = {
    id: 'id',
    name: 'name',
    email: 'test@example.com',
    password: 'password',
    visitedPlaces: [],
    placesReviews: [],
    refreshTokenId: 'refreshTokenId',
};

export const refreshToken: RefreshToken = {
    id: 'id',
    user: user,
    userId: user.id,
};