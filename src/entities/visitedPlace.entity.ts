import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { DecimalColumnTransformer } from 'src/utils/transformers/decimalColumnTransformer';

@Entity()
export class VisitedPlace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { transformer: new DecimalColumnTransformer() })
  latitude: number;

  @Column('decimal', { transformer: new DecimalColumnTransformer() })
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
