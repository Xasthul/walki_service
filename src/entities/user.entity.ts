import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { VisitedPlace } from './visitedPlace.entity';

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
}
