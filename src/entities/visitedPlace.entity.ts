import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class VisitedPlace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  latitude: number;

  @Column('decimal')
  longitude: number;

  @CreateDateColumn({
    name: 'visitedAt',
    type: 'timestamp with time zone',
    default: () => 'NOW()',
  })
  visitedAt: Date;

  @ManyToOne(() => User, (user) => user.visitedPlaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column('uuid')
  userId: string;
}
