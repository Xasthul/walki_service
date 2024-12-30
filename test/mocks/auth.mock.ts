import { SignInPayload } from 'src/types/requestBody/signInPayload.dto';
import { SignInResource } from 'src/types/response/signInResource.dto';
import { CreateUserPayload } from 'src/types/requestBody/createUserPayload.dto';
import { RefreshTokenPayload } from 'src/types/requestBody/refreshTokenPayload.dto';
import { RefreshTokenResource } from 'src/types/response/refreshTokenResource.dto';

export const signInPayload: SignInPayload = {
    email: 'test@example.com',
    password: 'testpassword',
};
export const signInResource: SignInResource = {
    accessToken: 'valid-token',
    refreshToken: 'valid-refresh-token',
};
export const createUserPayload: CreateUserPayload = {
    email: 'newuser@example.com',
    name: 'name',
    password: 'newpassword',
};
export const refreshTokenPayload: RefreshTokenPayload = {
    refreshToken: 'existing-refresh-token',
};
export const refreshTokenResource: RefreshTokenResource = {
    accessToken: 'new-valid-access-token',
    refreshToken: 'new-valid-refresh-token',
};