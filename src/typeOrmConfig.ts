import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PlaceVisitRecord } from './entities/placeVisitRecord.entity';
import { RefreshToken } from './entities/refreshToken.entity';
import { PlaceReview } from './entities/placeReview.entity';
import { Place } from './entities/place.entity';
import { SuperUser } from './entities/superUser.entity';
import { SuperUserRefreshToken } from './entities/superUserRefreshToken.entity';

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
      entities: [User, RefreshToken, Place, PlaceVisitRecord, PlaceReview, SuperUser, SuperUserRefreshToken],
      // NOTE: must be false in prod
      synchronize: true,
    };
  },
};
