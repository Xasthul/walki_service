import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  JoinColumn,
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

  @OneToOne(() => User, (user) => user.visitedPlaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column('uuid')
  userId: string;
}
