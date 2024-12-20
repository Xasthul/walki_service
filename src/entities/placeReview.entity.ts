import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Place } from './place.entity';

@Entity()
export class PlaceReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  placeId: string;

  @Column()
  content: string;

  @Column('uuid')
  authorId: string;

  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamp with time zone',
    default: () => 'NOW()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamp with time zone',
    default: () => 'NOW()',
  })
  updatedAt: Date;

  @ManyToOne(() => Place, (place) => place.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'placeId', referencedColumnName: 'id' })
  place: Place;

  @ManyToOne(() => User, (user) => user.placesReviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId', referencedColumnName: 'id' })
  user: User;
}
