import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { VisitedPlace } from './visitedPlace.entity';
import { RefreshToken } from './refreshToken.entity';

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

  @OneToMany(() => VisitedPlace, (visitedPlace) => visitedPlace.user)
  visitedPlaces: VisitedPlace[];

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.userId)
  refreshTokenId: string;
}
