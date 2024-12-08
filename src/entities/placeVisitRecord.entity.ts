import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Place } from './place.entity';

@Entity()
export class PlaceVisitRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  placeId: string;

  @CreateDateColumn({
    name: 'visitedAt',
    type: 'timestamp with time zone',
    default: () => 'NOW()',
  })
  visitedAt: Date;

  @ManyToOne(() => User, (user) => user.visitedPlaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Place, (place) => place.visitRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'placeId', referencedColumnName: 'id' })
  place: Place;
}
