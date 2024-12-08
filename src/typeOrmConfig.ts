import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PlaceVisitRecord } from './entities/placeVisitRecord.entity';
import { RefreshToken } from './entities/refreshToken.entity';
import { PlaceReview } from './entities/placeReview.entity';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: [User, PlaceVisitRecord, RefreshToken, PlaceVisitRecord, PlaceReview],
      // NOTE: must be false in prod
      synchronize: true,
    };
  },
};
