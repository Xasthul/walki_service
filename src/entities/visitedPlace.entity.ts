import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class VisitedPlace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  visitedAt: Date;

  @OneToOne(() => User, (user) => user.visitedPlaces, { onDelete: 'CASCADE' })
  user: User;
}
