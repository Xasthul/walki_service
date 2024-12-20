import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { PlaceVisitRecord } from './placeVisitRecord.entity';
import { RefreshToken } from './refreshToken.entity';
import { PlaceReview } from './placeReview.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @OneToMany(() => PlaceVisitRecord, (visitRecord) => visitRecord.user)
  visitedPlaces: PlaceVisitRecord[];

  @OneToMany(() => PlaceReview, (review) => review.user)
  placesReviews: PlaceReview[];

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.userId)
  refreshTokenId: string;
}
