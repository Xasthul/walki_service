import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SuperUser } from './superUser.entity';

@Entity()
export class SuperUserRefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => SuperUser, (user) => user.refreshTokenId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: SuperUser;

  @Column('uuid')
  userId: string;
}
