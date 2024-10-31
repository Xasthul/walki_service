import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { VisitedPlace } from './visitedPlace.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => VisitedPlace, (visitedPlace) => visitedPlace.user)
  visitedPlaces: VisitedPlace[];
}
